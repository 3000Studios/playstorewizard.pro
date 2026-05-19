"use client";

import * as React from "react";
import Link from "next/link";
import { Card, Eyebrow, Badge } from "@/components/ui/primitives";
import { Reveal, Stagger } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { TIERS, ANNUAL_PRICES, LIFETIME_PRICES } from "@/lib/pro/tiers";
import { cn } from "@/lib/utils";

const FEATURE_LABELS: Record<string, string> = {
  "single-app": "1 app",
  "unlimited-apps": "Unlimited apps",
  "ai-description-en": "AI listings (English)",
  "ai-description-multi-lang": "AI listings (50+ languages)",
  "ai-translate-listing": "Auto-translate listings",
  "ai-review-replies": "AI review reply drafts",
  "ai-screenshot-captions": "AI screenshot captions",
  "ai-aso-keywords": "ASO keyword analysis",
  "ai-aso-monitoring": "ASO monitoring",
  "asset-resize": "Asset auto-resize",
  "asset-device-frames": "Device-frame mockups",
  "asset-screenshot-capture-emulator": "Emulator screenshot capture",
  "asset-feature-graphic-gen": "Feature graphic generator",
  "manual-publish": "Manual publish",
  "auto-publish": "Auto-publish",
  "scheduled-release": "Scheduled releases",
  "staged-rollout-control": "Staged rollout control",
  "multi-track-management": "Multi-track management",
  "compliance-check": "Compliance auto-check",
  "compliance-monitoring": "Compliance monitoring",
  "policy-change-alerts": "Policy-change alerts",
  "basic-stats": "Basic stats",
  "review-tracking": "Review tracking",
  "competitor-tracking": "Competitor tracking",
  "keyword-ranking": "Keyword ranking",
  "ab-test-listings": "A/B test listings",
  "team-mode": "Team mode (5 seats)",
  "white-label": "White-label",
  "bulk-update": "Bulk update across apps",
  "client-mode": "Client workspaces",
};

type Billing = "monthly" | "yearly" | "lifetime";

export function PricingClient() {
  const [billing, setBilling] = React.useState<Billing>("yearly");

  function priceFor(tierId: "free" | "pro" | "studio"): { display: string; unit: string; sub: string } {
    if (tierId === "free") return { display: "$0", unit: "", sub: "Forever. No card required." };
    if (billing === "monthly") {
      const t = TIERS.find((x) => x.id === tierId);
      if (!t) return { display: "—", unit: "", sub: "" };
      return { display: `$${t.priceUsd}`, unit: "/ mo", sub: "Billed monthly · cancel anytime" };
    }
    if (billing === "yearly") {
      const annual = ANNUAL_PRICES[tierId];
      if (!annual) return { display: "—", unit: "", sub: "" };
      return {
        display: `$${Math.floor(annual / 12)}`,
        unit: "/ mo",
        sub: `$${annual} billed yearly`,
      };
    }
    const lt = LIFETIME_PRICES[tierId];
    if (!lt) return { display: "—", unit: "", sub: "" };
    return { display: `$${lt}`, unit: "once", sub: "Pay once. Use forever." };
  }

  return (
    <>
      <section className="container max-w-6xl py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <Eyebrow>Pricing</Eyebrow>
            <h1 className="mt-3 font-display font-bold text-5xl sm:text-6xl tracking-tight text-balance">
              Free for your first app.<br />
              <span className="accent-italic text-aurora">Pro for every one after.</span>
            </h1>
            <p className="mt-6 text-lg text-text-muted">
              Everything you need to ship is free, forever. Pro adds automation, multi-language listings,
              and the analytics that move the needle.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 flex justify-center">
            <div className="inline-flex bg-bg-2 border border-border rounded-full p-1">
              {(["monthly", "yearly", "lifetime"] as Billing[]).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium transition-all",
                    billing === b
                      ? "bg-text text-bg-0 shadow-lg"
                      : "text-text-muted hover:text-text"
                  )}
                >
                  {b === "monthly" && "Monthly"}
                  {b === "yearly" && (
                    <>
                      Yearly <span className="font-mono text-[10px] text-emerald-400">SAVE 17%</span>
                    </>
                  )}
                  {b === "lifetime" && "Lifetime"}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5" step={80}>
          {TIERS.map((tier) => {
            const isFeatured = tier.id === "pro";
            const price = priceFor(tier.id as "free" | "pro" | "studio");
            return (
              <div key={tier.id} className="relative">
                {isFeatured && (
                  <div className="absolute -top-3 right-6 z-10">
                    <Badge variant="indigo" className="bg-grad-aurora !text-white border-transparent shadow-lg">
                      Most popular
                    </Badge>
                  </div>
                )}
                <Card
                  className={cn(
                    "p-7 h-full flex flex-col relative",
                    isFeatured &&
                      "before:absolute before:inset-0 before:rounded-2xl before:p-px before:bg-grad-aurora before:-z-10 shadow-2xl shadow-indigo-500/20"
                  )}
                >
                  <h2 className="font-display font-semibold text-xl">{tier.name}</h2>
                  <p className="text-sm text-text-muted mt-1 min-h-[40px]">{tier.description}</p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="font-display font-bold text-5xl tracking-tight leading-none">
                      {price.display}
                    </span>
                    <span className="accent-italic text-text-muted text-base">{price.unit}</span>
                  </div>
                  <p className="text-xs text-text-dim font-mono mt-1.5">{price.sub}</p>

                  <CheckoutButton
                    tier={tier.id as "free" | "pro" | "studio"}
                    billing={billing}
                    isFeatured={isFeatured}
                  />

                  <ul className="mt-7 space-y-2.5 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                        <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{FEATURE_LABELS[f] ?? f}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            );
          })}
        </Stagger>
      </section>

      <section className="container max-w-3xl py-16">
        <Reveal>
          <Eyebrow>Frequently asked</Eyebrow>
          <h2 className="mt-3 font-display font-bold text-3xl tracking-tight">Pricing questions</h2>
          <div className="mt-8 space-y-4">
            {[
              {
                q: "Is the Free tier really free forever?",
                a: "Yes. The Free tier covers one app and includes compliance checks, AI listings (English), asset resizing, manual publishing, and review tracking. No credit card required, no time limit.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Monthly and yearly plans cancel from your account settings. Cancellation stops the next renewal; your current paid period remains active through its end date. No refunds or credits are issued for the unused portion (see our Terms for the full no-refund policy and statutory exceptions).",
              },
              {
                q: "What counts as an 'app' on the Pro tier?",
                a: "Unlimited apps with the same Play Console account. Each app has its own wizard state, listing, and asset library.",
              },
              {
                q: "Do you offer student or open-source discounts?",
                a: "Yes — open-source apps with a public repo get 50% off Pro. Students with a .edu email get 6 months of Pro free. Email hello@playstorewizard.pro.",
              },
              {
                q: "What's the refund policy?",
                a: "All sales are final. We don't issue refunds, credits, or proration for unused time on monthly, yearly, or lifetime plans — including for forgotten cancellations or change of mind. The Free tier is unlimited so you can fully evaluate the product before paying. We honor refund requirements imposed by applicable law in your jurisdiction (e.g. statutory EU/UK cooling-off rights).",
              },
              {
                q: "Why is PayPal only shown for lifetime plans?",
                a: "PayPal in this app handles one-time purchases only. To avoid customers expecting auto-renewal that won't happen, monthly and yearly are card-only via Stripe. Lifetime accepts both.",
              },
            ].map((f) => (
              <details key={f.q} className="rounded-xl border border-border bg-bg-2/40 p-5 group">
                <summary className="cursor-pointer font-display font-medium text-base list-none flex items-center justify-between">
                  {f.q}
                  <span className="text-text-muted group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="text-sm text-text-muted mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}

// ============================================================================
// CheckoutButton — Stripe (primary, all billing) + PayPal (lifetime-only)
// ============================================================================
type Provider = "stripe" | "paypal";

function CheckoutButton({
  tier,
  billing,
  isFeatured,
}: {
  tier: "free" | "pro" | "studio";
  billing: Billing;
  isFeatured: boolean;
}) {
  const [loading, setLoading] = React.useState<null | Provider>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function startCheckout(provider: Provider) {
    setLoading(provider);
    setError(null);
    try {
      const endpoint = provider === "stripe" ? "/api/checkout/stripe" : "/api/checkout/paypal";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, billing }),
      });
      const data = (await res.json()) as { url?: string; approveUrl?: string; error?: string };
      const redirectUrl = data.url ?? data.approveUrl;
      if (!res.ok || !redirectUrl) {
        throw new Error(data.error || `Checkout failed (HTTP ${res.status})`);
      }
      window.location.href = redirectUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoading(null);
    }
  }

  if (tier === "free") {
    return (
      <Link href="/wizard" className="block mt-6">
        <Button variant="outline" size="md" className="w-full">Start free</Button>
      </Link>
    );
  }

  const showPaypal = billing === "lifetime";
  const billingLabel = billing === "lifetime" ? "Pay once, use forever." : "Cancel anytime.";

  return (
    <div className="mt-6 space-y-2">
      <Button
        variant={isFeatured ? "aurora" : "outline"}
        size="md"
        className="w-full"
        onClick={() => startCheckout("stripe")}
        disabled={loading !== null}
        aria-label={`Pay with card`}
      >
        <Sparkles className="h-4 w-4" />
        {loading === "stripe" ? "Loading…" : "Pay with card"}
      </Button>

      {showPaypal && (
        <Button
          variant="outline"
          size="md"
          className="w-full"
          onClick={() => startCheckout("paypal")}
          disabled={loading !== null}
          aria-label={`Pay with PayPal`}
        >
          {loading === "paypal" ? "Loading…" : "Pay with PayPal"}
        </Button>
      )}

      <p className="text-[11px] text-text-dim text-center">
        Secure checkout via {showPaypal ? "Stripe or PayPal" : "Stripe"}. {billingLabel}
      </p>

      {error && (
        <p className="text-[11px] text-rose-300 mt-1.5 text-center" role="alert">{error}</p>
      )}
    </div>
  );
}
