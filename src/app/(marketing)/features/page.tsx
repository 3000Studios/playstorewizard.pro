import { Reveal, Stagger } from "@/components/motion/reveal";
import { Card, Eyebrow, Badge } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd } from "@/lib/seo/metadata";
import { pageMetadata } from "@/lib/seo/metadata";
import { AdUnit } from "@/components/adsense/google-adsense";
import {
  ShieldCheck, Brain, ImageIcon, Send, Workflow, Zap, BarChart3,
  FileCheck, Languages, Megaphone, Bell, Layers, Calendar, Database,
} from "lucide-react";

export const metadata = pageMetadata({
  title: "Features",
  description: "Every feature in Playstore Wizard — compliance auto-check, AI listings, asset auto-resize, Data Safety walkthrough, one-click publish, and more.",
  path: "/features",
});

const GROUPS = [
  {
    name: "Compliance",
    intro: "Every Google Play rule encoded as data. Updated for the August 2025 API 35 mandate, August 2026 API 36 deadline, and the June 2026 fee restructure.",
    items: [
      { icon: ShieldCheck, title: "22 policy rules built in", body: "Auto-checked as you fill in the wizard. Blockers and warnings inline with the fix." },
      { icon: FileCheck, title: "Data Safety walkthrough", body: "The form everyone fears, broken down into yes/no questions you can actually answer." },
      { icon: Calendar, title: "14-day closed-test tracker", body: "Personal accounts need 12 testers for 14 consecutive days. We track the clock for you." },
      { icon: Bell, title: "Policy-change alerts", body: "Pro tier. Get notified when Google publishes a rule that affects your published apps." },
    ],
  },
  {
    name: "Listing & ASO",
    intro: "Turn one sentence into a complete, validated, conversion-tuned Play Store listing.",
    items: [
      { icon: Brain, title: "AI listing generator", body: "One-sentence pitch → short description, 4000-char long description, ASO keywords." },
      { icon: Languages, title: "Multi-language translation", body: "Pro tier. 50+ languages, with cultural-context tuning per locale." },
      { icon: Megaphone, title: "ASO keyword scoring", body: "Title, descriptions, keyword diversity, readability — all scored against best practices." },
      { icon: BarChart3, title: "A/B test listings", body: "Pro tier. Two variants, traffic split, conversion tracking." },
    ],
  },
  {
    name: "Assets",
    intro: "Drop your icon and a few screenshots. We output every required dimension — phone, tablet, feature graphic, TV banner.",
    items: [
      { icon: ImageIcon, title: "Browser-side resizer", body: "Phone, 7-inch, 10-inch tablet, feature graphic — generated client-side. Zero server cost." },
      { icon: Layers, title: "Auto-generated feature graphic", body: "Don't have a 1024×500? We build one from your icon and brand color." },
      { icon: Database, title: "ZIP download", body: "One click to bundle everything into a flat folder for upload to Play Console." },
    ],
  },
  {
    name: "Publishing",
    intro: "When you're done, click publish. The Play Developer API does the rest.",
    items: [
      { icon: Send, title: "One-click submit", body: "Direct API integration. No more juggling the manual upload form." },
      { icon: Workflow, title: "Scheduled releases", body: "Pro tier. Pick a launch time and have it submitted automatically." },
      { icon: Zap, title: "Staged rollout control", body: "Pro tier. Set initial percentage, ramp curve, and halt criteria." },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbLd([{ name: "Home", path: "/" }, { name: "Features", path: "/features" }])} />

      <section className="container max-w-4xl py-20">
        <Reveal>
          <Eyebrow>Features</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-5xl sm:text-6xl tracking-tight text-balance">
            Everything Google asks for, <span className="accent-italic text-aurora">in one place.</span>
          </h1>
          <p className="mt-6 text-lg text-text-muted max-w-2xl">
            No more juggling Play Console tabs, image resizers, AI tools for descriptions, and a privacy policy template
            from 2019. Playstore Wizard knows the rules and applies them as you go.
          </p>
        </Reveal>
      </section>

      {GROUPS.map((group, idx) => (
        <section key={group.name} className="container py-16 border-t border-border">
          <Reveal>
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <Eyebrow>{`0${idx + 1}`} · {group.name}</Eyebrow>
                <h2 className="mt-2 font-display font-bold text-3xl tracking-tight">{group.name}</h2>
                <p className="mt-3 text-text-muted text-sm leading-relaxed">{group.intro}</p>
              </div>
              <div className="lg:col-span-2">
                <Stagger className="grid sm:grid-cols-2 gap-4" step={60}>
                  {group.items.map((item) => (
                    <Card key={item.title} className="p-5 h-full hover-lift">
                      <div className="h-9 w-9 rounded-lg bg-grad-aurora grid place-items-center mb-3">
                        <item.icon className="h-4.5 w-4.5 text-white" />
                      </div>
                      <h3 className="font-display font-semibold text-base mb-1">{item.title}</h3>
                      <p className="text-xs text-text-muted leading-relaxed">{item.body}</p>
                    </Card>
                  ))}
                </Stagger>
              </div>
            </div>
          </Reveal>
        </section>
      ))}

      <section className="container py-12">
        <AdUnit slot="3456789012" />
      </section>
    </>
  );
}
