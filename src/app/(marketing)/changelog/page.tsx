import { Reveal } from "@/components/motion/reveal";
import { Eyebrow, Badge, Card } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils";
import { RELEASES } from "@/lib/content/releases";

export const metadata = pageMetadata({
  title: "Changelog",
  description: "Every release of Playstore Wizard — new features, bug fixes, and policy-rule updates.",
  path: "/changelog",
});

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
            Every release. Every policy-rule update. Every fix. Subscribe via{" "}
            <a href="/changelog/rss.xml" className="text-indigo-300 bg-bg-3 px-1.5 py-0.5 rounded font-mono text-xs hover:text-indigo-200">/changelog/rss.xml</a>.
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
