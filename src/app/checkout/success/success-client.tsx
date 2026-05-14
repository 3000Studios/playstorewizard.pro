"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Sparkles, ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { useLicense } from "@/lib/license-store";
import type { SignedLicense } from "@/lib/pro/tiers";

type Status = "loading" | "ok" | "error";

export function SuccessClient() {
  const search = useSearchParams();
  const setLicense = useLicense((s) => s.setLicense);

  const [status, setStatus] = React.useState<Status>("loading");
  const [message, setMessage] = React.useState<string>("Confirming your payment…");
  const ranRef = React.useRef(false);

  React.useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      try {
        // Stripe → ?session_id=cs_live_xxx
        // PayPal → ?token=ORDER_ID&PayerID=PAYER_ID  (or ?provider=paypal&token=...)
        const sessionId = search.get("session_id");
        const paypalToken = search.get("token");

        if (sessionId) {
          setMessage("Verifying with Stripe…");
          const r = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ provider: "stripe", sessionId }),
          });
          if (!r.ok) {
            const d = await r.json().catch(() => ({}));
            throw new Error(d.error ?? `Stripe verify failed (HTTP ${r.status})`);
          }
          const signed = (await r.json()) as SignedLicense;
          await setLicense(signed);
          setStatus("ok");
          setMessage(`You're on the ${signed.payload.tier === "studio" ? "Studio" : "Pro"} plan.`);
          return;
        }

        if (paypalToken) {
          setMessage("Capturing your PayPal payment…");
          // Step 1: capture the order on PayPal's side (this actually charges).
          const capRes = await fetch("/api/checkout/paypal/capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: paypalToken }),
          });
          if (!capRes.ok) {
            const d = await capRes.json().catch(() => ({}));
            throw new Error(d.error ?? `PayPal capture failed (HTTP ${capRes.status})`);
          }
          const cap = (await capRes.json()) as { status: string };
          if (cap.status !== "COMPLETED") {
            throw new Error(`PayPal status was '${cap.status}' (expected 'COMPLETED')`);
          }

          // Step 2: issue a signed license.
          setMessage("Activating your subscription…");
          const verRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ provider: "paypal", paypalOrderId: paypalToken }),
          });
          if (!verRes.ok) {
            const d = await verRes.json().catch(() => ({}));
            throw new Error(d.error ?? `License verify failed (HTTP ${verRes.status})`);
          }
          const signed = (await verRes.json()) as SignedLicense;
          await setLicense(signed);
          setStatus("ok");
          setMessage(`You're on the ${signed.payload.tier === "studio" ? "Studio" : "Pro"} plan.`);
          return;
        }

        // No identifier in the URL — show a generic confirmation page so the
        // user isn't stuck, but warn that we couldn't activate automatically.
        setStatus("error");
        setMessage(
          "We couldn't find your checkout reference in this URL. If you completed a payment, email hello@playstorewizard.pro and we'll activate your account."
        );
      } catch (e) {
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Activation failed");
      }
    })();
  }, [search, setLicense]);

  return (
    <section className="container max-w-2xl py-24">
      <Reveal>
        <Card className="p-10 text-center">
          {status === "loading" && (
            <>
              <div className="h-16 w-16 rounded-full bg-indigo-500/15 grid place-items-center mx-auto mb-6 border border-indigo-500/30">
                <Loader2 className="h-8 w-8 text-indigo-300 animate-spin" />
              </div>
              <Eyebrow className="justify-center">Hang tight</Eyebrow>
              <h1 className="mt-3 font-display font-bold text-4xl tracking-tight">Activating your account…</h1>
              <p className="mt-5 text-text-muted leading-relaxed max-w-md mx-auto">{message}</p>
            </>
          )}
          {status === "ok" && (
            <>
              <div className="h-16 w-16 rounded-full bg-emerald-500/15 grid place-items-center mx-auto mb-6 border border-emerald-500/30">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <Eyebrow className="justify-center">Payment confirmed</Eyebrow>
              <h1 className="mt-3 font-display font-bold text-4xl tracking-tight">
                Welcome to <span className="accent-italic text-aurora">Pro.</span>
              </h1>
              <p className="mt-5 text-text-muted leading-relaxed max-w-md mx-auto">{message}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/dashboard">
                  <Button variant="aurora" size="lg">
                    <Sparkles className="h-4 w-4" />
                    Open your dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/wizard">
                  <Button variant="outline" size="lg">
                    Wizard home
                  </Button>
                </Link>
              </div>
            </>
          )}
          {status === "error" && (
            <>
              <div className="h-16 w-16 rounded-full bg-amber-500/15 grid place-items-center mx-auto mb-6 border border-amber-500/30">
                <AlertTriangle className="h-8 w-8 text-amber-400" />
              </div>
              <Eyebrow className="justify-center">Activation issue</Eyebrow>
              <h1 className="mt-3 font-display font-bold text-4xl tracking-tight">
                We couldn&apos;t activate automatically
              </h1>
              <p className="mt-5 text-text-muted leading-relaxed max-w-md mx-auto">{message}</p>
              <p className="mt-3 text-xs text-text-dim font-mono">
                Your payment is safe. If it was charged, we&apos;ll honor it — email
                hello@playstorewizard.pro with your transaction ID.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a href="mailto:hello@playstorewizard.pro">
                  <Button variant="aurora" size="lg">
                    Email support
                  </Button>
                </a>
                <Link href="/pricing">
                  <Button variant="outline" size="lg">
                    Back to pricing
                  </Button>
                </Link>
              </div>
            </>
          )}
        </Card>
      </Reveal>
    </section>
  );
}
