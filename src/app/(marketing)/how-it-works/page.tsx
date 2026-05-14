import { Reveal, Stagger } from "@/components/motion/reveal";
import { Card, Eyebrow, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";
import { STEPS } from "@/lib/steps";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";

export const metadata = pageMetadata({
  title: "How it works",
  description: "The 12-step Playstore Wizard flow, explained. From app basics to one-click submit — with realistic timelines and zero guesswork.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbLd([{ name: "Home", path: "/" }, { name: "How it works", path: "/how-it-works" }])} />

      <section className="container max-w-4xl py-20">
        <Reveal>
          <Eyebrow>How it works</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-5xl sm:text-6xl tracking-tight text-balance">
            Twelve steps. <span className="accent-italic text-aurora">No detours.</span>
          </h1>
          <p className="mt-6 text-lg text-text-muted max-w-2xl">
            Open the wizard, save your progress automatically, finish on a different device if you want to.
            Each step shows the rule it&apos;s enforcing and why.
          </p>
        </Reveal>
      </section>

      <section className="container max-w-3xl py-12 pb-20">
        <div className="relative pl-8 sm:pl-12">
          <div className="absolute left-2 sm:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-brand-indigo via-brand-violet to-brand-fuchsia" />
          <Stagger className="space-y-8" step={70}>
            {STEPS.map((step) => (
              <div key={step.slug} className="relative">
                <div className="absolute -left-8 sm:-left-12 top-1 h-6 w-6 rounded-full bg-bg-0 border-2 border-brand-indigo grid place-items-center">
                  <span className="text-[10px] font-mono font-bold text-indigo-300">{step.num}</span>
                </div>
                <Card className="p-6 hover-lift">
                  <div className="flex items-baseline gap-3 mb-2">
                    <Badge variant="muted" className="!text-[10px]">Step {step.num}</Badge>
                    <h3 className="font-display font-semibold text-xl">{step.title}</h3>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">{step.description}</p>
                </Card>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="container py-16">
        <Reveal>
          <Card className="p-10 text-center max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl tracking-tight">
              Ready when you are.
            </h2>
            <p className="mt-3 text-text-muted">
              The wizard remembers where you left off. Start now, finish later.
            </p>
            <Link href="/wizard" className="inline-block mt-6">
              <Button variant="aurora" size="lg">
                <Rocket className="h-4 w-4" />
                Start the wizard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </Reveal>
      </section>
    </>
  );
}
