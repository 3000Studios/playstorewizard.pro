import { Reveal } from "@/components/motion/reveal";
import { Eyebrow, Badge, Card } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Changelog",
  description: "Every release of Playstore Wizard — new features, bug fixes, and policy-rule updates.",
  path: "/changelog",
});

interface Release {
  version: string;
  date: string;
  tags: ("new" | "improved" | "fixed" | "policy")[];
  changes: { type: "new" | "improved" | "fixed" | "policy"; text: string }[];
}

const RELEASES: Release[] = [
  {
    version: "0.1.0",
    date: "2026-05-13",
    tags: ["new", "policy"],
    changes: [
      { type: "new", text: "Initial release: 12-step wizard, compliance auto-check, AI listings, asset auto-resize." },
      { type: "policy", text: "Compliance engine knows about the August 2025 API 35 mandate." },
      { type: "policy", text: "Compliance engine knows about the August 2026 API 36 deadline." },
      { type: "policy", text: "Pricing calculator updated for the June 2026 service-fee restructure." },
      { type: "policy", text: "Compliance engine enforces the 12-tester, 14-day rule for personal accounts." },
      { type: "new", text: "Browser-side AAB parser — no bundletool required." },
      { type: "new", text: "Privacy policy generator from Data Safety answers." },
      { type: "new", text: "AI runs on Cloudflare Workers AI free tier, with Ollama fallback for local dev." },
    ],
  },
];

const TAG_COLOR: Record<string, "indigo" | "emerald" | "amber" | "rose"> = {
  new: "indigo",
  improved: "emerald",
  fixed: "amber",
  policy: "rose",
};

export default function ChangelogPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbLd([{ name: "Home", path: "/" }, { name: "Changelog", path: "/changelog" }])} />

      <section className="container max-w-3xl py-20">
        <Reveal>
          <Eyebrow>Changelog</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-5xl tracking-tight text-balance">
            What&apos;s <span className="accent-italic text-aurora">new.</span>
          </h1>
          <p className="mt-6 text-lg text-text-muted">
            Every release. Every policy-rule update. Every fix. Subscribe to RSS at <code className="text-indigo-300 bg-bg-3 px-1.5 py-0.5 rounded font-mono text-xs">/changelog/rss.xml</code> (coming soon).
          </p>
        </Reveal>

        <div className="mt-12 space-y-8">
          {RELEASES.map((r) => (
            <Reveal key={r.version}>
              <Card className="p-7">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h2 className="font-display font-bold text-2xl tracking-tight">v{r.version}</h2>
                  <span className="text-sm text-text-muted">— {formatDate(r.date)}</span>
                  {r.tags.map((t) => (
                    <Badge key={t} variant={TAG_COLOR[t]}>{t}</Badge>
                  ))}
                </div>
                <ul className="mt-5 space-y-2">
                  {r.changes.map((c, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <Badge variant={TAG_COLOR[c.type]} className="flex-shrink-0 mt-0.5">
                        {c.type}
                      </Badge>
                      <span className="text-text-muted leading-relaxed">{c.text}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
