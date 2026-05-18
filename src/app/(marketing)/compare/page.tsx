import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";
import { Check, X, Minus } from "lucide-react";

export const metadata = pageMetadata({
  title: "Playstore Wizard vs the alternatives",
  description: "Side-by-side comparison of Playstore Wizard with manual Play Console submission, Fastlane, and hiring a contractor.",
  path: "/compare",
});

type Cell = "yes" | "no" | "partial" | string;

const ROWS: { feature: string; us: Cell; manual: Cell; fastlane: Cell; contractor: Cell }[] = [
  { feature: "Step-by-step guided flow", us: "yes", manual: "no", fastlane: "no", contractor: "partial" },
  { feature: "Compliance auto-check against current rules", us: "yes", manual: "no", fastlane: "no", contractor: "partial" },
  { feature: "Data Safety form walkthrough", us: "yes", manual: "no", fastlane: "no", contractor: "yes" },
  { feature: "AI listing generator", us: "yes", manual: "no", fastlane: "no", contractor: "partial" },
  { feature: "Asset auto-resize", us: "yes", manual: "no", fastlane: "partial", contractor: "yes" },
  { feature: "Privacy policy generator", us: "yes", manual: "no", fastlane: "no", contractor: "yes" },
  { feature: "One-click submission", us: "yes", manual: "partial", fastlane: "yes", contractor: "yes" },
  { feature: "No command line required", us: "yes", manual: "yes", fastlane: "no", contractor: "yes" },
  { feature: "Saves progress automatically", us: "yes", manual: "yes", fastlane: "no", contractor: "no" },
  { feature: "Works on mobile", us: "yes", manual: "partial", fastlane: "no", contractor: "yes" },
  { feature: "Updated for 2026 policies", us: "yes", manual: "yes", fastlane: "partial", contractor: "partial" },
  { feature: "Cost for first app", us: "Free", manual: "Free", fastlane: "Free", contractor: "$500–$2000" },
  { feature: "Time to first submission", us: "~1 hour", manual: "1–2 days", fastlane: "1–3 days setup", contractor: "1–2 weeks" },
];

function Icon({ v }: { v: Cell }) {
  if (v === "yes") {
    return (
      <>
        <Check aria-hidden="true" className="h-4 w-4 text-emerald-400 mx-auto" />
        <span className="sr-only">Supported</span>
      </>
    );
  }
  if (v === "no") {
    return (
      <>
        <X aria-hidden="true" className="h-4 w-4 text-rose-400 mx-auto" />
        <span className="sr-only">Not supported</span>
      </>
    );
  }
  if (v === "partial") {
    return (
      <>
        <Minus aria-hidden="true" className="h-4 w-4 text-amber-400 mx-auto" />
        <span className="sr-only">Partial support</span>
      </>
    );
  }
  return <span className="text-xs text-text-muted font-mono">{v}</span>;
}

export default function ComparePage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbLd([{ name: "Home", path: "/" }, { name: "Compare", path: "/compare" }])} />

      <section className="container max-w-5xl py-20">
        <Reveal>
          <Eyebrow>Comparison</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-5xl tracking-tight text-balance">
            How Playstore Wizard <span className="accent-italic text-aurora">stacks up.</span>
          </h1>
          <p className="mt-6 text-lg text-text-muted max-w-2xl">
            Side-by-side against the three things indie developers actually do today: handle it in Play Console manually,
            wire up Fastlane, or pay someone to do it.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 rounded-2xl border border-border bg-bg-2/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-2/80">
                    <th className="text-left p-4 font-display font-semibold">Feature</th>
                    <th className="p-4 font-display font-semibold text-center min-w-[110px]">
                      <span className="text-aurora">Playstore Wizard</span>
                    </th>
                    <th className="p-4 font-display font-semibold text-center min-w-[110px] text-text-muted">Play Console (manual)</th>
                    <th className="p-4 font-display font-semibold text-center min-w-[110px] text-text-muted">Fastlane</th>
                    <th className="p-4 font-display font-semibold text-center min-w-[110px] text-text-muted">Hired contractor</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.feature} className="border-b border-border last:border-b-0">
                      <td className="p-4 text-text">{row.feature}</td>
                      <td className="p-4 text-center"><Icon v={row.us} /></td>
                      <td className="p-4 text-center"><Icon v={row.manual} /></td>
                      <td className="p-4 text-center"><Icon v={row.fastlane} /></td>
                      <td className="p-4 text-center"><Icon v={row.contractor} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 grid sm:grid-cols-3 gap-4 text-xs text-text-muted">
            <div className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Fully supported</div>
            <div className="flex items-start gap-2"><Minus className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" /> Partial or with caveats</div>
            <div className="flex items-start gap-2"><X className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" /> Not supported</div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
