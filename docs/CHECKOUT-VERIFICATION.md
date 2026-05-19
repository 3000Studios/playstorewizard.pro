# Checkout Verification — End-to-End $1 Test Playbook

**Purpose:** prove Stripe + PayPal + license signing all work in production before pointing a single visitor at the site.

**Total cost:** about $0.60–$1.20 in Stripe/PayPal processing fees (refunds return the principal, not the processor fees). Worth it.

**Read this whole file before doing anything.** Especially the "If a step fails" tables — they save 30 minutes of guessing.

---

## Part 1 — Config probes (zero cost, zero risk)

These commands hit your live endpoints with no payment attached. They tell you whether the secrets are loaded in Cloudflare. Run from PowerShell. **Open Cloudflare Workers logs (`wrangler tail`) in a second window before running — the error messages there are more specific than the HTTP responses.**

### 1.1 Stripe config probe

```powershell
$body = @{ tier = "pro"; billing = "monthly"; customerEmail = "mr.jwswain@gmail.com" } | ConvertTo-Json
curl.exe -s -X POST https://playstorewizard.pro/api/checkout/stripe `
  -H "Content-Type: application/json" `
  -d $body
```

| Response | Meaning |
|---|---|
| `{"url":"https://checkout.stripe.com/c/pay/..."}` | ✅ Stripe live secret loaded; checkout session created successfully. Save this URL — you'll use it in Part 2. |
| `{"error":"Card checkout is being activated. Please use PayPal checkout for now."}` (503) | ❌ `STRIPE_SECRET_KEY` missing or invalid in Cloudflare. Fix below. |
| `{"error":"Invalid input"}` (400) | Body schema issue. Re-check the JSON. |
| Any 5xx other than 503 | Look at `wrangler tail` — likely a Node compat issue in the Stripe SDK. |

**If 503:** set the secret via Wrangler:
```powershell
cd C:\Workspaces\playstorewizard.pro
wrangler pages secret put STRIPE_SECRET_KEY --project-name playstorewizard-pro
# paste sk_live_... when prompted
wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name playstorewizard-pro
# paste whsec_... from Stripe Dashboard → Developers → Webhooks → Add endpoint
```
Then redeploy. Re-run the probe.

### 1.2 PayPal config probe

```powershell
$body = @{ tier = "pro"; billing = "monthly"; customerEmail = "mr.jwswain@gmail.com" } | ConvertTo-Json
curl.exe -s -X POST https://playstorewizard.pro/api/checkout/paypal `
  -H "Content-Type: application/json" `
  -d $body
```

| Response | Meaning |
|---|---|
| `{"orderId":"...","approveUrl":"https://www.paypal.com/checkoutnow?token=..."}` | ✅ PayPal creds loaded; order created. Save `approveUrl` for Part 2. |
| `{"error":"Could not verify PayPal credentials"}` (502) | ❌ `PAYPAL_CLIENT_ID` or `PAYPAL_CLIENT_SECRET` missing/wrong. |
| `{"error":"..."}` with PayPal API error text | Read the message — usually a sandbox/live mismatch. Confirm `PAYPAL_ENV=live` in wrangler.toml [vars] matches the creds you set. |

**If 502:** set both secrets:
```powershell
wrangler pages secret put PAYPAL_CLIENT_ID --project-name playstorewizard-pro
wrangler pages secret put PAYPAL_CLIENT_SECRET --project-name playstorewizard-pro
```
Both must be from your **live** PayPal app, not sandbox. Get them at developer.paypal.com → My Apps → your app → Live tab.

### 1.3 License signing probe

```powershell
$body = @{ provider = "stripe"; sessionId = "cs_test_does_not_exist" } | ConvertTo-Json
curl.exe -s -X POST https://playstorewizard.pro/api/checkout/verify `
  -H "Content-Type: application/json" `
  -d $body
```

| Response | Meaning |
|---|---|
| `{"error":"Server is not configured to issue licenses"}` (503) | ❌ `LICENSE_SIGNING_SECRET` is missing. Fix below. |
| `{"error":"No such checkout session"}` or similar (5xx) | ✅ Signing secret is present (we expected the session lookup to fail, since the ID is fake). The error came from Stripe, not from your config — good. |
| `{"error":"Payment not completed"}` (402) | ✅ Signing secret is present. |

**If 503:** generate and set a strong secret:
```powershell
# Generate a 256-bit random secret in PowerShell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
# Copy the output, then:
wrangler pages secret put LICENSE_SIGNING_SECRET --project-name playstorewizard-pro
```
**Once set, never rotate it casually.** Rotating invalidates every license already issued.

---

## Part 2 — Live $9.99 transaction (your money, refundable)

Do not skip Part 1. If any probe failed there, your live test will fail too.

### 2.1 Stripe live test

1. Open the URL returned by the Stripe probe (or go to https://playstorewizard.pro/pricing and click **Pro · Monthly · Card**).
2. Pay with **your real personal card** — the address can be a PO box, the email can be `mr.jwswain+test@gmail.com`. You will be charged **$9.99**.
3. Verify you land on `https://playstorewizard.pro/checkout/success?session_id=cs_live_...`.
4. The success page should auto-call `/api/checkout/verify` and store the signed license in your browser's localStorage. Open DevTools → Application → Local Storage and confirm a `playstorewizard.license` entry exists with a tier field of `"pro"`.
5. In Stripe Dashboard: confirm the payment shows as **Succeeded**, customer email is correct, metadata shows `tier=pro billing=monthly`.
6. **Refund:** Stripe Dashboard → the payment → top-right "..." menu → Refund. Refund the full $9.99. The $0.30 + 2.9% processing fee is non-refundable — that's your test cost (~$0.59).
7. **Cancel the subscription:** Customers → your test customer → Cancel subscription immediately. Otherwise you'll be charged again in 30 days.

**If step 4 fails (license not minted):** the verify endpoint failed. Most common cause: `LICENSE_SIGNING_SECRET` missing. Re-run probe 1.3.

### 2.2 PayPal live test

1. Open the `approveUrl` from the PayPal probe, or click **Pro · Monthly · PayPal** on the pricing page.
2. Log in with **your real personal PayPal account**. You will be charged $9.99.
3. After approving, you should be redirected back to the site, which calls `/api/checkout/paypal/capture` automatically.
4. Confirm the success page renders and the license JWT appears in localStorage as in step 2.1.4.
5. **Refund:** PayPal Activity → the transaction → Issue Refund. PayPal returns the full $9.99; they keep no fee on refunds for personal-to-business transactions if the refund happens within 180 days. (Verify in your account's fee statement.)

### 2.3 Webhook verification (Stripe only)

Critical: if the webhook secret is wrong, you'll receive payments but never update your own KV / database with the subscription state, meaning the license expiration won't extend on renewal.

```powershell
# Trigger a fake Stripe webhook event from the CLI (requires Stripe CLI: stripe.com/docs/stripe-cli)
stripe listen --forward-to https://playstorewizard.pro/api/webhooks/stripe
# In another window:
stripe trigger checkout.session.completed
```

Watch `wrangler tail` for the webhook handler running and returning 200. If it returns 400, the signature verification failed — confirm `STRIPE_WEBHOOK_SECRET` matches the endpoint in Stripe Dashboard → Developers → Webhooks.

---

## Part 3 — Edge cases to test before launching to traffic

Each takes <2 minutes. Don't skip.

- [ ] **Cancel mid-checkout:** start a Stripe checkout, hit browser back button. Should land on `/pricing?canceled=1` cleanly.
- [ ] **Pro Yearly ($99):** repeat Stripe + PayPal flows with `billing=yearly`. Verify license `validUntil` is ~366 days out.
- [ ] **Pro Lifetime ($199):** same. Verify license `validUntil` is `"never"`.
- [ ] **Studio Monthly ($49.99):** repeat. Verify tier=studio and deviceLimit=5 in license JWT.
- [ ] **Email empty:** start Stripe checkout without entering an email. Stripe should collect one. Verify it lands on success and license email is populated.
- [ ] **Coupon code:** Stripe checkout has `allow_promotion_codes: true`. Create a 100%-off test coupon in Stripe Dashboard, run a full checkout. Verifies the $0 path mints a license (the code already handles `no_payment_required`).
- [ ] **Mobile browser:** repeat 2.1 on your phone. Stripe Checkout has a different mobile flow.
- [ ] **Wizard paywall trigger:** without a license, complete the wizard up to step 4. Confirm the paywall appears and links to the pricing page.

---

## Part 4 — Sign-off

When all of the below are checked, you can run the content cadence in `CONTENT-KIT-WEEK-1.md` and send traffic.

- [ ] Stripe probe returned a `checkout.stripe.com` URL
- [ ] PayPal probe returned a `paypal.com/checkoutnow` URL
- [ ] License signing probe did NOT return the 503 "not configured" error
- [ ] Live Stripe $9.99 charge succeeded; license minted; refunded
- [ ] Live PayPal $9.99 charge succeeded; license minted; refunded
- [ ] Subscription cancelled in Stripe Dashboard (or you'll be auto-charged in 30 days)
- [ ] Webhook event delivered and returned 200
- [ ] At least 3 of the Part 3 edge cases verified
- [ ] AdSense application status confirmed in dashboard
- [ ] DNS / SSL cert healthy on `playstorewizard.pro` and `*.playstorewizard.pro`

If everything is checked, you are launch-ready. Run the IndieHackers post from CONTENT-KIT-WEEK-1.md.

---

## What only you can do

I cannot:

- Charge your real card or PayPal account.
- Read your Cloudflare dashboard or Stripe / PayPal dashboards.
- Confirm which secrets are loaded in production (only the runtime knows — that's why the probes in Part 1 exist).
- Verify AdSense approval.

I can:

- Inspect any future API route changes and re-derive these checks.
- Decode any error response you paste back to me (just paste the JSON and I'll tell you what's wrong).
- Update this file when the routes change.

---

## Known gaps in the current code (low priority, future cleanup)

These do not block your $1 test, but flag them for a future cleanup PR.

- **`STRIPE_PRICE_IDS` lookup** (in `src/lib/payments/stripe.ts`): if you create pre-configured Stripe Prices in Dashboard and set `STRIPE_PRICE_PRO_MONTHLY` etc. as env vars, the checkout uses them; otherwise it falls back to inline `price_data`. Pre-configured prices give cleaner Stripe analytics but aren't required.
- **PayPal subscriptions:** the current `/api/checkout/paypal` route creates one-time `Order` objects, even for monthly/yearly billing. That means PayPal does not auto-renew monthly subscriptions — every monthly cycle requires the user to re-checkout. For true recurring PayPal, you'd need to migrate to PayPal Billing Plans + Subscriptions API. **Recommended action:** for now, present PayPal as **lifetime-only** ($199 Pro / $799 Studio) on the pricing page, and route monthly/yearly through Stripe. This avoids customer support churn from missed renewals.
- **Doc/code drift:** `src/lib/pro/tiers.ts` header comment says Pro = $14.99/mo. The TIERS array sets it to $9.99. Cosmetic fix.
