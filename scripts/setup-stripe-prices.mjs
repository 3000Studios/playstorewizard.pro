/**
 * setup-stripe-prices.mjs
 *
 * Creates Playstore Wizard Pro + Studio Stripe products and all price variants.
 * Run once per environment (live / test). Idempotent — checks for existing products first.
 *
 * Usage:
 *   node scripts/setup-stripe-prices.mjs
 *
 * Requires STRIPE_SECRET_KEY in the environment:
 *   $env:STRIPE_SECRET_KEY = "sk_live_..." && node scripts/setup-stripe-prices.mjs
 *
 * After running, copy the printed STRIPE_PRICE_* values to:
 *   1. wrangler.toml  [vars]  OR
 *   2. `wrangler secret put STRIPE_PRICE_PRO_MONTHLY --name playstorewizard-pro` for each
 */

const sk = process.env.STRIPE_SECRET_KEY;
if (!sk) {
  console.error("ERROR: STRIPE_SECRET_KEY environment variable is not set.");
  process.exit(1);
}

const BASE = "https://api.stripe.com/v1";
const headers = {
  Authorization: `Bearer ${sk}`,
  "Content-Type": "application/x-www-form-urlencoded",
};

async function stripe(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? new URLSearchParams(body).toString() : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Stripe ${method} ${path} failed: ${err?.error?.message ?? res.status}`);
  }
  return res.json();
}

async function findOrCreateProduct(name, metadata) {
  const list = await stripe("GET", `/products?limit=100&active=true`);
  const existing = list.data.find((p) => p.name === name);
  if (existing) {
    console.log(`  ↩  Product already exists: ${existing.id} (${name})`);
    return existing;
  }
  const params = { name, ...Object.fromEntries(Object.entries(metadata).map(([k, v]) => [`metadata[${k}]`, v])) };
  const created = await stripe("POST", "/products", params);
  console.log(`  ✓  Created product: ${created.id} (${name})`);
  return created;
}

async function createPrice(productId, amountCents, currency, nickname, recurring, metadata) {
  const params = {
    product: productId,
    currency,
    unit_amount: String(amountCents),
    nickname,
    ...Object.fromEntries(Object.entries(metadata ?? {}).map(([k, v]) => [`metadata[${k}]`, v])),
  };
  if (recurring) {
    params["recurring[interval]"] = recurring;
  }
  const price = await stripe("POST", "/prices", params);
  console.log(`  ✓  ${nickname}: ${price.id}`);
  return price;
}

(async () => {
  console.log("\n🎯 Setting up Stripe products and prices for Playstore Wizard...\n");

  console.log("── Pro ($9.99/mo | $99/yr | $199 lifetime)");
  const pro = await findOrCreateProduct("Playstore Wizard Pro", {
    tier: "pro",
    description: "Unlimited apps, AI listings (50+ languages), ASO tools, compliance monitoring",
  });

  const proMonthly    = await createPrice(pro.id, 999,   "usd", "Pro Monthly",  "month",     { tier: "pro", billing: "monthly" });
  const proYearly     = await createPrice(pro.id, 9900,  "usd", "Pro Yearly",   "year",      { tier: "pro", billing: "yearly" });
  const proLifetime   = await createPrice(pro.id, 19900, "usd", "Pro Lifetime", undefined,   { tier: "pro", billing: "lifetime" });

  console.log("\n── Studio ($49.99/mo | $499/yr | $799 lifetime)");
  const studio = await findOrCreateProduct("Playstore Wizard Studio", {
    tier: "studio",
    description: "Everything in Pro + team mode (5 seats), white-label, agency client workspaces",
  });

  const studioMonthly    = await createPrice(studio.id, 4999,  "usd", "Studio Monthly",  "month",   { tier: "studio", billing: "monthly" });
  const studioYearly     = await createPrice(studio.id, 49900, "usd", "Studio Yearly",   "year",    { tier: "studio", billing: "yearly" });
  const studioLifetime   = await createPrice(studio.id, 79900, "usd", "Studio Lifetime", undefined, { tier: "studio", billing: "lifetime" });

  console.log("\n══ DONE — Copy these into wrangler.toml [vars] or set as Worker secrets:\n");
  console.log(`STRIPE_PRICE_PRO_MONTHLY="${proMonthly.id}"`);
  console.log(`STRIPE_PRICE_PRO_YEARLY="${proYearly.id}"`);
  console.log(`STRIPE_PRICE_PRO_LIFETIME="${proLifetime.id}"`);
  console.log(`STRIPE_PRICE_STUDIO_MONTHLY="${studioMonthly.id}"`);
  console.log(`STRIPE_PRICE_STUDIO_YEARLY="${studioYearly.id}"`);
  console.log(`STRIPE_PRICE_STUDIO_LIFETIME="${studioLifetime.id}"`);
  console.log(`
Then run for each:
  wrangler secret put STRIPE_PRICE_PRO_MONTHLY --name playstorewizard-pro
  wrangler secret put STRIPE_PRICE_PRO_YEARLY --name playstorewizard-pro
  ... etc
`);
})().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
