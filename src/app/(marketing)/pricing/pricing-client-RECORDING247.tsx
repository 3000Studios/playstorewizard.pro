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
  "ai-description-en": "AI listings (English)",
  "asset-resize": "Asset auto-resize",
  "asset-feature-graphic-gen": "Feature graphic generator",
  "manual-publish": "Manual publish",
  "compliance-check": "Compliance auto-check",
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
              Start with six steps.<br />
              <span className="accent-italic text-aurora">Finish all twelve with Pro.</span>
            </h1>
            <p className="mt-6 text-lg text-text-muted">
              Use the free steps to organize your app, assets, listing, category, and content rating.
              Pro unlocks the six final launch-planning steps before you submit in Play Console.
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

        <Stagger className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto" step={80}>
          {TIERS.filter((tier) => tier.id !== "studio").map((tier) => {
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
                a: "Yes. The Free tier includes the first six steps: app basics, bundle review, graphics and screenshots, an English store listing, category and tags, and content rating. No card is required to begin.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Monthly and yearly billing is handled in Stripe Checkout. For billing help or a cancellation request, contact hello@playstorewizard.pro.",
              },
              {
                q: "What does Pro unlock?",
                a: "Pro unlocks steps 7–12: Data Safety, target audience, privacy policy, pricing and countries, release planning, and final readiness review. The wizard prepares your launch details; you submit them in your own Google Play Console.",
              },
              {
                q: "What's the refund policy?",
                a: "Review the Terms before purchasing. For a billing issue, contact hello@playstorewizard.pro with the email used at checkout.",
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
        {loading === "stripe" ? "Loading…" : billing === "monthly" ? "Start monthly plan" : billing === "yearly" ? "Start yearly plan" : "Get lifetime access"}
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
