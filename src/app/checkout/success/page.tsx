import Link from "next/link";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = {
  ...pageMetadata({
    title: "Welcome to Pro",
    description: "Your subscription is active. Open the wizard and start shipping.",
    path: "/checkout/success",
  }),
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <section className="container max-w-2xl py-24">
      <Reveal>
        <Card className="p-10 text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-500/15 grid place-items-center mx-auto mb-6 border border-emerald-500/30">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <Eyebrow className="justify-center">Payment confirmed</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-4xl tracking-tight">
            Welcome to <span className="accent-italic text-aurora">Pro.</span>
          </h1>
          <p className="mt-5 text-text-muted leading-relaxed max-w-md mx-auto">
            Your subscription is active. A receipt is on its way to your inbox. Open the wizard
            whenever you&apos;re ready — your settings will sync to your account on first launch.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/wizard">
              <Button variant="aurora" size="lg">
                <Sparkles className="h-4 w-4" />
                Open the wizard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">Back to home</Button>
            </Link>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
