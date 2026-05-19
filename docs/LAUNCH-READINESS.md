# Launch Readiness — Playstore Wizard

**Date:** 2026-05-16
**Status:** Code is launch-ready. Two security fixes outside the code base must be done before going live.

---

## 1. Code changes made this session (typecheck passes, exit 0)

| File | Change | Why |
|---|---|---|
| `src/lib/pro/tiers.ts` | Fixed stale docstring `$14.99/mo` → `$9.99/mo` | Matched the actual TIERS array |
| `src/app/api/checkout/paypal/route.ts` | Added server-side guard rejecting non-lifetime billing | PayPal route creates one-time Orders, not Subscriptions — preventing customers from buying a "monthly" PayPal plan that wouldn't auto-renew |
| `src/app/(marketing)/pricing/pricing-client.tsx` | Rewrote CheckoutButton: Stripe primary (all billing), PayPal only for lifetime, Studio now self-serve | The pricing page previously showed PayPal-only, which couldn't auto-renew. Stripe handles subscriptions correctly. |
| `.env.example` | Rewrote with clear PUBLIC-VAR vs SECRET separation, instructions for `wrangler pages secret put` | So future-you (or a contractor) knows exactly which variables go where |
| `.gitattributes` | Added LF normalization for the repo | Prevents the CRLF/LF churn that was creating 117 phantom "modified" files |

**Verification:** `node_modules/.bin/tsc --noEmit` returns exit 0 (no type errors). You should run `pnpm lint && pnpm build` locally before deploying — both take <60 seconds and catch anything tsc misses.

---

## 2. How payments work after this change

| Billing tab | Stripe button | PayPal button |
|---|---|---|
| Monthly | ✅ Pay with card | (hidden) |
| Yearly | ✅ Pay with card | (hidden) |
| Lifetime | ✅ Pay with card | ✅ Pay with PayPal |

Why: real recurring PayPal requires PayPal Billing Plans + Subscriptions API (not implemented). The existing PayPal route creates one-time Orders, which is correct for lifetime purchases. Showing PayPal on monthly/yearly would create unhappy customers who don't see auto-renewal.

To unlock recurring PayPal in the future: implement `/api/checkout/paypal/subscription` using the PayPal Subscriptions API. That's a future PR, not a launch blocker.

---

## 3. Secrets vs Variables — the rule

**PUBLIC variables** (already set correctly in `wrangler.toml [vars]` — safe to commit):
- `NEXT_PUBLIC_SITE_URL` = `https://playstorewizard.pro`
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` = `ca-pub-5800977493749262`
- `PAYPAL_ENV` = `live`

**SECRETS** (must be set via `wrangler pages secret put` — never in `wrangler.toml`, never in git):
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `LICENSE_SIGNING_SECRET`
- `ADMIN_ACCESS_TOKEN`

**Optional (Stripe Price IDs)** — set as secrets or vars, your choice; they aren't sensitive but cleaner Stripe analytics if used:
- `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_YEARLY`, `STRIPE_PRICE_PRO_LIFETIME`
- `STRIPE_PRICE_STUDIO_MONTHLY`, `STRIPE_PRICE_STUDIO_YEARLY`, `STRIPE_PRICE_STUDIO_LIFETIME`

**Optional (one-click publish)** — secret if used:
- `GOOGLE_SA_JSON` (single-line service-account JSON)

---

## 4. What's already in your LOCAL_ENV.txt — read with care

I checked `C:\Workspaces\LOCAL_ENV.txt`. Mapping to what production needs:

| Cloudflare secret name | Source variable in LOCAL_ENV.txt | Status |
|---|---|---|
| `STRIPE_SECRET_KEY` | `PSW_STRIPE_SECRET_KEY` (also aliased as `STRIPET_SECRET_KEY`) | ✅ present, sk_live_... |
| `STRIPE_WEBHOOK_SECRET` | `PSW_STRIPE_WEBHOOK_SECRET` (also `STRIPET_WEBHOOK_SECRET`) | ✅ present, whsec_... |
| `PAYPAL_CLIENT_ID` | `PSW_PAYPAL_CLIENT_ID` (also `PAYPAL_CLIENT_ID`) | ✅ present, live |
| `PAYPAL_CLIENT_SECRET` | `PSW_PAYPAL_CLIENT_SECRET` (also `PAYPAL_CLIENT_SECRET`) | ✅ present, live |
| `LICENSE_SIGNING_SECRET` | `PSW_LICENSE_SIGNING_SECRET` (also `LICENSE_SIGNING_SECRET`) | ✅ present, 64-char |
| `ADMIN_ACCESS_TOKEN` | — | ❌ NOT in LOCAL_ENV.txt — need to generate one |

You also have public `PSW_STRIPE_PUBLISHABLE_KEY` — the codebase doesn't use it server-side (Stripe Checkout doesn't need it), but if you ever add a client-side Stripe element, set it as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

---

## 5. Security flags from LOCAL_ENV.txt — fix these before launch

I'm not echoing any secret values, but I have to flag these patterns:

1. **`ADMIN_PASSCODE = 5555`, `CONTROL_PASSWORD = 5555`, `SESSION_SECRET = 5555`** — your own TODO in the file calls this out. Four digits is brute-forceable in microseconds. Regenerate before the site is publicly indexed.

2. **Multiple GitHub personal access tokens stored in plaintext.** If `C:\Workspaces\` is ever shared, synced to a backup with weak access, or scanned by an extension, all of GitHub goes with it. Move to GitHub fine-grained tokens or use the Windows Credential Manager.

3. **Cloudflare master tokens in plaintext.** A leaked Cloudflare master token = full account takeover (DNS rewrites, secret reading, billing). Rotate to a minimum-scope token (Workers + Pages deploy only) for daily use.

4. **No file-level encryption on `LOCAL_ENV.txt`.** It is plaintext on a drive that any process with read access can read. Two cheap free upgrades:
   - **Move to a password-protected 7-zip / VeraCrypt container.** Decrypt-on-demand.
   - **Use `gh secret set` / `wrangler secret put` directly and stop keeping the values in a flat file.** The cloud provider becomes the source of truth.

5. **`VITE_FIREBASE_APP_ID = ` (empty).** Your TODO already notes this. Fill it in if Firebase is in use, otherwise remove the entries to avoid confusion.

6. **`RAILWAY_TOKEN` is 34 hex chars** — Railway tokens are usually 36-char UUIDs. Your own note flags this. If you still use Railway, regenerate.

None of these are blockers for the `playstorewizard.pro` launch specifically, but the "5555" passwords absolutely must be rotated before any admin panel sees real traffic.

---

## 6. Generate a strong `ADMIN_ACCESS_TOKEN` (the only missing secret)

In PowerShell:

```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$token = [Convert]::ToBase64String($bytes)
Write-Host "ADMIN_ACCESS_TOKEN = $token"
```

Copy the output, paste into `LOCAL_ENV.txt` under the PSW section as `PSW_ADMIN_ACCESS_TOKEN`, then set as a Cloudflare secret (next section).

---

## 7. Push secrets to Cloudflare — the exact sequence

From PowerShell in `C:\Workspaces\playstorewizard.pro`:

```powershell
# Make sure you're authenticated
wrangler whoami

# Set the six required secrets. Each prompts for the value — paste from LOCAL_ENV.txt.
wrangler pages secret put STRIPE_SECRET_KEY        --project-name playstorewizard-pro
wrangler pages secret put STRIPE_WEBHOOK_SECRET    --project-name playstorewizard-pro
wrangler pages secret put PAYPAL_CLIENT_ID         --project-name playstorewizard-pro
wrangler pages secret put PAYPAL_CLIENT_SECRET     --project-name playstorewizard-pro
wrangler pages secret put LICENSE_SIGNING_SECRET   --project-name playstorewizard-pro
wrangler pages secret put ADMIN_ACCESS_TOKEN       --project-name playstorewizard-pro

# Verify
wrangler pages secret list --project-name playstorewizard-pro
```

If `wrangler pages secret put` errors with "project not found", the project is deployed as a **Worker** (not Pages) — your wrangler.toml has `main = ".open-next/worker.js"` which is Workers, not Pages. In that case use:

```powershell
wrangler secret put STRIPE_SECRET_KEY        --name playstorewizard-pro
wrangler secret put STRIPE_WEBHOOK_SECRET    --name playstorewizard-pro
wrangler secret put PAYPAL_CLIENT_ID         --name playstorewizard-pro
wrangler secret put PAYPAL_CLIENT_SECRET     --name playstorewizard-pro
wrangler secret put LICENSE_SIGNING_SECRET   --name playstorewizard-pro
wrangler secret put ADMIN_ACCESS_TOKEN       --name playstorewizard-pro

wrangler secret list --name playstorewizard-pro
```

(Your existing `C:\Workspaces\deploy-playstorewizard.ps1` may already automate this — open it and check which form it uses.)

---

## 8. Pre-launch test sequence — in order

```powershell
cd C:\Workspaces\playstorewizard.pro

# 1. Clean up the line-ending noise we discussed earlier
git checkout -- .   # ONLY if you have no other real local changes

# 2. Stage and push the launch-ready code
git add .gitattributes .env.example docs/
git add src/app/api/checkout/paypal/route.ts
git add src/app/(marketing)/pricing/pricing-client.tsx
git add src/lib/pro/tiers.ts
git status   # eyeball the staged list
git commit -m "Wire Stripe + PayPal payment buttons; lock PayPal to lifetime; add launch docs"
git push origin main

# 3. Local sanity check
pnpm typecheck    # already passing
pnpm lint         # run it
pnpm build        # full Next.js build — catches anything tsc missed

# 4. Deploy
pnpm deploy       # opennextjs-cloudflare build && deploy

# 5. Probe production endpoints (no charge yet)
$body = @{ tier = "pro"; billing = "monthly" } | ConvertTo-Json
curl.exe -s -X POST https://playstorewizard.pro/api/checkout/stripe -H "Content-Type: application/json" -d $body
# Expect: {"url":"https://checkout.stripe.com/..."}

$body = @{ tier = "pro"; billing = "lifetime" } | ConvertTo-Json
curl.exe -s -X POST https://playstorewizard.pro/api/checkout/paypal -H "Content-Type: application/json" -d $body
# Expect: {"orderId":"...","approveUrl":"https://www.paypal.com/checkoutnow?token=..."}

$body = @{ tier = "pro"; billing = "monthly" } | ConvertTo-Json
curl.exe -s -X POST https://playstorewizard.pro/api/checkout/paypal -H "Content-Type: application/json" -d $body
# Expect: {"error":"PayPal checkout is only available for lifetime plans. ..."}  (this is the NEW guard working)

# 6. Run the full $1 verification in docs/CHECKOUT-VERIFICATION.md
```

---

## 9. Sign-off

Launch-ready when ALL of these are true:

- [ ] All 6 secrets visible in `wrangler secret list` for the project
- [ ] `pnpm build` exits 0 locally
- [ ] Last deploy completed without errors (`wrangler deployments list`)
- [ ] Stripe probe returned a `checkout.stripe.com` URL
- [ ] PayPal lifetime probe returned a `paypal.com/checkoutnow` URL
- [ ] PayPal monthly probe returned the new 400 error (proves the guard is live)
- [ ] One $9.99 Stripe charge succeeded end-to-end, license appeared in localStorage, then refunded
- [ ] One PayPal lifetime $199 charge succeeded (or a temporary test lifetime price), then refunded
- [ ] Webhook from Stripe Dashboard delivered, returned 200
- [ ] AdSense application status confirmed in your AdSense dashboard
- [ ] The four "5555" passwords in LOCAL_ENV.txt have been rotated to strong values

When the list is fully checked, run the IndieHackers launch post from `docs/CONTENT-KIT-WEEK-1.md`.
