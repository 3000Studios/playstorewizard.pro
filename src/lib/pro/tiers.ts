/**
 * Pro tier feature gating and license management.
 *
 * Tiers:
 *   - free:    Single app, manual workflow, English-only AI
 *   - pro:     Unlimited apps, automation, multi-language, advanced AI ($14.99/mo)
 *   - studio:  Pro + team mode, white-label, agency tools ($49.99/mo)
 *
 * License keys are HMAC-signed JWTs issued at checkout. The wizard validates
 * them client-side using a public key, with periodic server revalidation
 * against a free Cloudflare KV namespace storing revoked keys.
 */

// ---------------------------------------------------------------------
//  Feature definitions
// ---------------------------------------------------------------------
export type Tier = "free" | "pro" | "studio";

export type Feature =
  // Core wizard features
  | "single-app"
  | "unlimited-apps"

  // AI features
  | "ai-description-en"
  | "ai-description-multi-lang"
  | "ai-translate-listing"
  | "ai-review-replies"
  | "ai-screenshot-captions"
  | "ai-aso-keywords"
  | "ai-aso-monitoring"

  // Asset features
  | "asset-resize"
  | "asset-device-frames"
  | "asset-screenshot-capture-emulator"
  | "asset-feature-graphic-gen"

  // Publishing features
  | "manual-publish"
  | "auto-publish"
  | "scheduled-release"
  | "staged-rollout-control"
  | "multi-track-management"

  // Compliance features
  | "compliance-check"
  | "compliance-monitoring"
  | "policy-change-alerts"

  // Analytics features
  | "basic-stats"
  | "review-tracking"
  | "competitor-tracking"
  | "keyword-ranking"
  | "ab-test-listings"

  // Team and agency
  | "team-mode"
  | "white-label"
  | "bulk-update"
  | "client-mode";

export interface TierDef {
  id: Tier;
  name: string;
  priceUsd: number;
  billing: "monthly" | "yearly" | "one-time";
  description: string;
  features: Feature[];
}

export const TIERS: TierDef[] = [
  {
    id: "free",
    name: "Free",
    priceUsd: 0,
    billing: "monthly",
    description: "Everything you need to publish your first app.",
    features: [
      "single-app",
      "ai-description-en",
      "asset-resize",
      "asset-feature-graphic-gen",
      "manual-publish",
      "compliance-check",
      "basic-stats",
      "review-tracking",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceUsd: 9.99,
    billing: "monthly",
    description: "Built for indie developers shipping multiple apps.",
    features: [
      "unlimited-apps",
      "ai-description-en",
      "ai-description-multi-lang",
      "ai-translate-listing",
      "ai-review-replies",
      "ai-screenshot-captions",
      "ai-aso-keywords",
      "asset-resize",
      "asset-device-frames",
      "asset-feature-graphic-gen",
      "asset-screenshot-capture-emulator",
      "manual-publish",
      "auto-publish",
      "scheduled-release",
      "staged-rollout-control",
      "multi-track-management",
      "compliance-check",
      "compliance-monitoring",
      "policy-change-alerts",
      "basic-stats",
      "review-tracking",
      "keyword-ranking",
      "ab-test-listings",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    priceUsd: 49.99,
    billing: "monthly",
    description: "For agencies and studios managing client apps.",
    features: [
      // Includes everything in Pro
      "unlimited-apps",
      "ai-description-en",
      "ai-description-multi-lang",
      "ai-translate-listing",
      "ai-review-replies",
      "ai-screenshot-captions",
      "ai-aso-keywords",
      "ai-aso-monitoring",
      "asset-resize",
      "asset-device-frames",
      "asset-feature-graphic-gen",
      "asset-screenshot-capture-emulator",
      "manual-publish",
      "auto-publish",
      "scheduled-release",
      "staged-rollout-control",
      "multi-track-management",
      "compliance-check",
      "compliance-monitoring",
      "policy-change-alerts",
      "basic-stats",
      "review-tracking",
      "competitor-tracking",
      "keyword-ranking",
      "ab-test-listings",
      // Studio-only
      "team-mode",
      "white-label",
      "bulk-update",
      "client-mode",
    ],
  },
];

// Alternative annual prices, with a 17% discount.
export const ANNUAL_PRICES: Partial<Record<Tier, number>> = {
  pro: 99,     // ~$8.25/mo (17% off monthly)
  studio: 499, // ~$41.58/mo
};

// One-time lifetime license option (early-bird strategy).
export const LIFETIME_PRICES: Partial<Record<Tier, number>> = {
  pro: 199,
  studio: 799,
};

// ---------------------------------------------------------------------
//  Feature gating
// ---------------------------------------------------------------------
export function hasFeature(tier: Tier, feature: Feature): boolean {
  const def = TIERS.find((t) => t.id === tier);
  return def?.features.includes(feature) ?? false;
}

/** Find the cheapest tier that includes the given feature. */
export function tierForFeature(feature: Feature): Tier | null {
  for (const t of TIERS) {
    if (t.features.includes(feature)) return t.id;
  }
  return null;
}

/** Upsell helper: what would the user need to upgrade to in order to use this feature? */
export function upgradeFromTo(currentTier: Tier, feature: Feature): Tier | null {
  if (hasFeature(currentTier, feature)) return null;
  return tierForFeature(feature);
}

// ---------------------------------------------------------------------
//  License keys
// ---------------------------------------------------------------------
export interface License {
  tier: Tier;
  email: string;
  /** Stripe customer ID — for support correlation. */
  customerId?: string;
  /** ISO date string when this license expires (annual/monthly) or "never". */
  validUntil: string;
  /** Optional device limit (Studio: 5, Pro: 3, Free: 1). */
  deviceLimit: number;
  /** When the license was issued. */
  issuedAt: string;
}

export interface SignedLicense {
  payload: License;
  /** Base64url-encoded HMAC-SHA256 signature over the JSON payload. */
  signature: string;
}

/**
 * Sign a license payload on the server (or build server). Public-key
 * crypto on the client only verifies — never signs.
 */
export async function signLicense(payload: License, secret: string): Promise<SignedLicense> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const data = new TextEncoder().encode(JSON.stringify(payload));
  const sig = await crypto.subtle.sign("HMAC", key, data);
  return { payload, signature: base64url(new Uint8Array(sig)) };
}

/**
 * Verify a license on the client. Returns the validated payload or null.
 */
export async function verifyLicense(signed: SignedLicense, secret: string): Promise<License | null> {
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const data = new TextEncoder().encode(JSON.stringify(signed.payload));
    const sigBytes = base64urlDecode(signed.signature);
    const ok = await crypto.subtle.verify("HMAC", key, sigBytes.buffer as ArrayBuffer, data);
    if (!ok) return null;
    if (signed.payload.validUntil !== "never" && new Date(signed.payload.validUntil) < new Date()) {
      return null;
    }
    return signed.payload;
  } catch {
    return null;
  }
}

function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// ---------------------------------------------------------------------
//  Stripe checkout URLs
// ---------------------------------------------------------------------

/**
 * Build a Stripe Checkout URL for upgrading.
 * Set these `priceId` constants once you create the prices in Stripe Dashboard.
 */
export interface CheckoutConfig {
  proMonthlyPriceId: string;
  proYearlyPriceId: string;
  proLifetimePriceId: string;
  studioMonthlyPriceId: string;
  studioYearlyPriceId: string;
  studioLifetimePriceId: string;
  successUrl: string;
  cancelUrl: string;
}

export function buildCheckoutSession(
  config: CheckoutConfig,
  tier: "pro" | "studio",
  billing: "monthly" | "yearly" | "one-time"
): {
  priceId: string;
  mode: "subscription" | "payment";
} {
  const map: Record<string, string> = {
    "pro-monthly": config.proMonthlyPriceId,
    "pro-yearly": config.proYearlyPriceId,
    "pro-one-time": config.proLifetimePriceId,
    "studio-monthly": config.studioMonthlyPriceId,
    "studio-yearly": config.studioYearlyPriceId,
    "studio-one-time": config.studioLifetimePriceId,
  };
  const priceId = map[`${tier}-${billing}`];
  if (!priceId) throw new Error(`No Stripe price configured for ${tier}-${billing}`);
  return {
    priceId,
    mode: billing === "one-time" ? "payment" : "subscription",
  };
}
