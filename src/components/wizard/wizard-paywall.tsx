"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Lock, Check, ShieldCheck, Zap, Heart } from "lucide-react";
import { Card, Eyebrow, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { useWizard } from "@/lib/store";
import { STEPS } from "@/lib/steps";

const PRO_FEATURES_LEFT = [
  "Data Safety walkthrough and saved answers",
  "Privacy Policy generator",
  "Pricing and country rollout planning",
  "Release-track planning and release notes",
  "Final compliance review before Play Console",
  "Unlimited apps and advanced listing tools",
];

/**
 * Wizard wall — shown when a free user lands on step 7 or later.
 * Free users get steps 1-6 (real configuration work), then hit this.
 * Their progress is saved in localStorage so they can't lose it.
 */
export function WizardPaywall({ stepNum }: { stepNum: number }) {
  const data = useWizard();
  const [busy, setBusy] = React.useState<"pro-monthly" | "studio-monthly" | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  async function checkoutStripe(tier: "pro" | "studio") {
    setBusy(tier === "pro" ? "pro-monthly" : "studio-monthly");
    setErr(null);
    try {
      const r = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, billing: "monthly" }),
      });
      const d = (await r.json()) as { url?: string; error?: string };
      if (!r.ok || !d.url) throw new Error(d.error ?? "Could not start checkout");
      window.location.href = d.url;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Checkout failed");
      setBusy(null);
    }
  }

  // Rough estimate of minutes invested so far.
  const minutesInvested = React.useMemo(() => {
    let m = 0;
    if (data.appName) m += 3;
    if (data.versionName) m += 8; // bundle parse + review
    if (data.iconDataUrl || data.screenshotDataUrls.length > 0) m += 15;
    if (data.fullDescription) m += 10;
    if (data.category) m += 2;
    if (Object.keys(data.ratingAnswers).length > 0) m += 5;
    return m;
  }, [data]);

  const stepsDone = data.completedSteps.length;
  const stepsLeft = STEPS.length - stepNum + 1;

  return (
    <div className="space-y-6">
      {/* Sunk-cost banner */}
      <Card className="p-6 border-emerald-500/30 bg-emerald-500/[0.04]">
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="font-display font-medium text-base">
              You&apos;ve already done the hard part.
            </p>
            <p className="text-sm text-text-muted mt-0.5">
              {stepsDone > 0 ? `${stepsDone} steps complete · ` : ""}
              {minutesInvested > 0 ? `~${minutesInvested} minutes invested · ` : ""}
              your draft is saved on this device. Don&apos;t lose it.
            </p>
          </div>
        </div>
      </Card>

      {/* Main wall */}
      <Card className="p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grad-aurora opacity-[0.08] pointer-events-none" />
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-grad-aurora grid place-items-center shadow-lg">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <Badge variant="indigo" className="bg-grad-aurora !text-white border-transparent">
              {stepsLeft} steps left
            </Badge>
          </div>

          <Eyebrow>Almost there</Eyebrow>
          <h2 className="mt-2 font-display font-bold text-3xl tracking-tight text-balance">
            Unlock Pro to finish your
            <br />
            <span className="accent-italic text-aurora">launch plan with confidence.</span>
          </h2>

          <p className="mt-5 text-text-muted leading-relaxed max-w-xl">
            Your free launch plan covers the first six setup steps. Pro keeps the rest of your
            release details together: Data Safety, audience, privacy, pricing, release planning,
            and a final readiness review before you submit in Play Console.
          </p>

          {/* What Pro unlocks from here */}
          <div className="mt-7 grid sm:grid-cols-2 gap-2.5">
            {PRO_FEATURES_LEFT.map((f) => (
              <div key={f} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-text">{f}</span>
              </div>
            ))}
          </div>

          {/* Plan picker */}
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {/* Pro card */}
            <div className="rounded-xl border-2 border-indigo-400/50 bg-bg-2 p-5 relative shadow-xl shadow-indigo-500/10">
              <div className="absolute -top-2.5 left-4">
                <Badge variant="indigo" className="bg-grad-aurora !text-white border-transparent">
                  Recommended
                </Badge>
              </div>
              <div className="font-display font-semibold text-lg">Pro</div>
              <p className="text-xs text-text-muted">For indie devs shipping multiple apps</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display font-bold text-4xl tracking-tight">$9.99</span>
                <span className="text-sm text-text-muted accent-italic">/ mo</span>
              </div>
              <p className="text-[11px] text-text-dim font-mono mt-1">Cancel anytime</p>
              <div className="mt-4 space-y-2">
                <Button
                  variant="aurora"
                  size="md"
                  className="w-full"
                  onClick={() => checkoutStripe("pro")}
                  disabled={busy !== null}
                >
                  <Sparkles className="h-4 w-4" />
                  {busy === "pro-monthly" ? "Loading…" : "Unlock Pro — $9.99/mo"}
                </Button>
                <p className="text-[11px] text-text-dim text-center">
                  Secure card checkout via Stripe. Cancel anytime.
                </p>
              </div>
            </div>

            {/* Studio card */}
            <div className="rounded-xl border border-border bg-bg-2/60 p-5">
              <div className="font-display font-semibold text-lg">Studio</div>
              <p className="text-xs text-text-muted">For agencies + team workflows</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display font-bold text-4xl tracking-tight">$49.99</span>
                <span className="text-sm text-text-muted accent-italic">/ mo</span>
              </div>
              <p className="text-[11px] text-text-dim font-mono mt-1">
                Team mode · white-label · 5 seats
              </p>
              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={() => checkoutStripe("studio")}
                  disabled={busy !== null}
                >
                  Upgrade to Studio — $49.99/mo
                </Button>
                <p className="text-[11px] text-text-dim text-center">
                  Secure card checkout via Stripe. Cancel anytime.
                </p>
              </div>
            </div>
          </div>

          {err && (
            <div className="mt-5 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">
              {err}
            </div>
          )}

          <div className="mt-7 pt-6 border-t border-border flex items-center gap-2 text-xs text-text-dim">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Secure checkout via Stripe · Cancel anytime · Free tier stays usable</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-text-dim">
            <Zap className="h-3.5 w-3.5" />
            <span>Your wizard progress stays here — finish it the second you unlock.</span>
          </div>
        </div>
      </Card>

      {/* Escape hatch — not too prominent */}
      <div className="text-center">
        <Link
          href="/pricing"
          className="text-xs text-text-dim hover:text-text-muted underline-offset-4 hover:underline"
        >
          Compare plans →
        </Link>
      </div>
    </div>
  );
}
