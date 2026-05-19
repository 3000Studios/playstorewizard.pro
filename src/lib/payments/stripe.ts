import Stripe from "stripe";
import { getEnv } from "@/lib/cloudflare";

/**
 * Stripe client (server-side only).
 *
 * The STRIPE_SECRET_KEY env var lives in Cloudflare encrypted secrets — never in the repo
 * and never sent to the browser. Edge runtime compatible via Stripe's fetch HTTP client.
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  // Don't cache across requests in case the key wasn't available on first call.
  const key = getEnv("STRIPE_SECRET_KEY");
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured. Set it as a Cloudflare secret.");
  }
  if (_stripe) return _stripe;
  _stripe = new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
    httpClient: Stripe.createFetchHttpClient(),
    typescript: true,
  });
  return _stripe;
}

/**
 * Tier → Stripe Price ID mapping.
 *
 * These need to be created in your Stripe dashboard once. The script
 * `scripts/setup-stripe-prices.mjs` creates them programmatically.
 *
 * Until they exist, the API route falls back to inline price_data using the
 * tier's USD price — which works but creates a one-off, non-reusable price
 * object on each checkout (fine for testing, not ideal for production analytics).
 */
export const STRIPE_PRICE_IDS: Record<string, { monthly?: string; yearly?: string; lifetime?: string }> = {
  free: {},
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
    lifetime: process.env.STRIPE_PRICE_PRO_LIFETIME,
  },
  studio: {
    monthly: process.env.STRIPE_PRICE_STUDIO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_STUDIO_YEARLY,
    lifetime: process.env.STRIPE_PRICE_STUDIO_LIFETIME,
  },
};
