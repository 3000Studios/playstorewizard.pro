import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, Eyebrow, Badge } from "@/components/ui/primitives";
import { Reveal, Stagger } from "@/components/motion/reveal";
import { AdUnit } from "@/components/adsense/google-adsense";
import { AD_SLOTS } from "@/lib/adsense/slots";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd } from "@/lib/seo/metadata";
import {
  Sparkles,
  Rocket,
  ShieldCheck,
  Zap,
  Workflow,
  ImageIcon,
  Brain,
  Send,
  ArrowRight,
  Check,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbLd([{ name: "Home", path: "/" }])} />

      {/* ===================== HERO ===================== */}
      <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="container max-w-5xl">
          <Reveal>
            <div className="flex justify-center mb-8">
              <Badge variant="indigo" className="px-3 py-1.5 text-[11px]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping-slow" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Free to start · No credit card
              </Badge>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-center font-display font-extrabold tracking-tight text-5xl sm:text-7xl lg:text-8xl leading-[0.95] text-balance">
              Ship to Google Play
              <br />
              without <span className="accent-italic text-aurora">losing your mind.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-8 text-center text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed text-pretty">
              A guided publishing studio that organizes compliance, assets, and store details before you submit in Play Console.
              So you spend less time chasing paperwork.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/wizard">
                <Button variant="aurora" size="xl">
                  <Rocket className="h-5 w-5" />
                  Start the wizard — free
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="xl">
                  See how it works
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Reveal>

          {/* Stat strip */}
          <Stagger
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 max-w-3xl mx-auto"
            step={60}
            initial={300}
          >
            {[
              { num: "12", unit: "steps", label: "Launch plan" },
              { num: "6", unit: "free", label: "Steps to explore" },
              { num: "$0", unit: "", label: "To get started" },
              { num: "22", unit: "rules", label: "Auto-checked" },
            ].map((s) => (
              <div className="text-center" key={s.label}>
                <div className="font-display font-bold text-3xl sm:text-4xl tracking-tight leading-none">
                  {s.num}
                  {s.unit && <span className="accent-italic text-text-muted text-xl sm:text-2xl"> {s.unit}</span>}
                </div>
                <div className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="container py-20 sm:py-28">
        <Reveal>
          <div className="max-w-2xl mb-16">
            <Eyebrow>What you get</Eyebrow>
            <h2 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-balance">
              Everything Google asks for, <span className="accent-italic text-text-muted">in one place.</span>
            </h2>
            <p className="mt-4 text-text-muted text-lg">
              No more juggling Play Console tabs, image resizers, ChatGPT for descriptions, and a privacy policy template from 2019.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: ShieldCheck, title: "Compliance auto-check", body: "22 current Google Play rules baked in. Blockers show inline with one-click fixes. Updated for the August 2025 API 35 mandate and June 2026 fee changes." },
            { icon: ImageIcon, title: "Asset auto-resize", body: "Drop one icon and a few screenshots. We output every Play Store size — phone, tablets, feature graphic, TV — in your browser. Zero server cost." },
            { icon: Brain, title: "AI listings", body: "One sentence in, full listing out. Short description, 4000-char long description, ASO keywords. Validated against length limits before you submit." },
            { icon: Workflow, title: "Data Safety walkthrough", body: "The form everyone fears, broken down into yes/no questions. Answers feed the privacy policy generator automatically." },
            { icon: Send, title: "Submission-ready plan", body: "Review your launch details in one place, then submit through your own Play Console account." },
            { icon: Zap, title: "Launch requirements", body: "Plan around review windows, the 14-day closed-test gate, and production access requirements." },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <Card className="p-6 h-full hover-lift">
                <div className="h-10 w-10 rounded-lg bg-grad-aurora grid place-items-center mb-4">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-1.5 tracking-tight">{f.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{f.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== AD SLOT (between sections) ===================== */}
      <section className="container">
        <AdUnit slot={AD_SLOTS.home} />
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="container py-20 sm:py-28">
        <Reveal>
          <div className="max-w-2xl mb-16">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-balance">
              Twelve steps. <span className="accent-italic text-text-muted">No detours.</span>
            </h2>
            <p className="mt-4 text-text-muted text-lg">
              The wizard saves your progress automatically. Stop anytime, come back later, finish on a different device.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ["01", "App basics", "Name, package, free or paid."],
            ["02", "Bundle", "Drop your AAB — we read the manifest."],
            ["03", "Assets", "Auto-resize to every Play size."],
            ["04", "Listing", "AI writes it. You edit."],
            ["05", "Category", "Pick category and tags."],
            ["06", "Content rating", "Plain-English IARC questions."],
            ["07", "Data safety", "Yes/no walkthrough."],
            ["08", "Audience", "Age groups and Families."],
            ["09", "Privacy policy", "Auto-generated and hostable."],
            ["10", "Pricing", "Price, fees, countries."],
            ["11", "Release", "Internal, closed, open, production."],
            ["12", "Review & launch plan", "Final check before Play Console."],
          ].map(([num, title, body], i) => (
            <Reveal key={num} delay={i * 40}>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-bg-2/40 hover-lift">
                <span className="font-mono text-[10px] text-text-dim mt-1">{num}</span>
                <div>
                  <h3 className="font-display font-semibold text-sm">{title}</h3>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== TRUST ===================== */}
      <section className="container py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <Eyebrow>Built for indie devs</Eyebrow>
              <h2 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-balance">
                The tool that exists because <span className="accent-italic text-aurora">Play Console doesn&apos;t.</span>
              </h2>
              <p className="mt-6 text-text-muted text-lg leading-relaxed">
                Every indie developer has the same Day-One experience: open Play Console, see thirteen tabs, lose two
                hours, miss a requirement, get rejected, repeat. Playstore Wizard is what we wished existed —
                a single guided flow that knows the rules and applies them as you go.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "All 22 current policy rules built in",
                  "Updated for August 2025 API 35 mandate",
                  "Updated for June 2026 fee restructure",
                  "Works on every device — saves to your browser",
                  "No account required to start the wizard",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-muted">
                    <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Card className="p-8">
              <Eyebrow>Built in public</Eyebrow>
              <h3 className="mt-3 font-display font-bold text-2xl tracking-tight">
                A new tool, without invented testimonials.
              </h3>
              <p className="mt-4 text-sm text-text-muted leading-relaxed">
                We publish practical Google Play guidance and improve the wizard from real policy changes and user feedback.
                When customers choose to share their experience, we&apos;ll feature it with their permission.
              </p>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="container py-20 sm:py-28">
        <Reveal>
          <Card className="px-8 py-16 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 30% 0%, rgba(99,102,241,0.4), transparent 50%), radial-gradient(circle at 70% 100%, rgba(217,70,239,0.3), transparent 50%)",
              }}
            />
            <div className="relative">
              <Sparkles className="h-10 w-10 mx-auto text-indigo-300 mb-4" />
              <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-balance max-w-2xl mx-auto">
                Your app deserves a <span className="accent-italic text-aurora">smoother launch.</span>
              </h2>
              <p className="mt-5 text-text-muted text-lg max-w-xl mx-auto">
                Start with the first six steps free, then unlock the full launch plan when you&apos;re ready.
              </p>
              <Link href="/wizard" className="inline-block mt-8">
                <Button variant="aurora" size="xl">
                  <Rocket className="h-5 w-5" />
                  Start the wizard — free
                </Button>
              </Link>
            </div>
          </Card>
        </Reveal>
      </section>
    </>
  );
}
