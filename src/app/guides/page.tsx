import Link from "next/link";
import { Reveal, Stagger } from "@/components/motion/reveal";
import { Eyebrow, Badge, Card } from "@/components/ui/primitives";
import { AdUnit } from "@/components/adsense/google-adsense";
import { AD_SLOTS } from "@/lib/adsense/slots";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";
import { GUIDES, guidesByCategory } from "@/lib/content/guides";
import { Clock, ArrowUpRight } from "lucide-react";

export const metadata = pageMetadata({
  title: "Guides",
  description: "In-depth guides for shipping to Google Play in 2026 — compliance, store listings, monetization, audience targeting, and submission.",
  path: "/guides",
});

export default function GuidesIndex() {
  const groups = guidesByCategory();
  const cats: ("Compliance" | "Submission" | "Listing & ASO" | "Monetization" | "Audience")[] = [
    "Compliance", "Submission", "Listing & ASO", "Monetization", "Audience",
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }])} />

      <section className="container max-w-4xl py-20">
        <Reveal>
          <Eyebrow>Guides</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-5xl sm:text-6xl tracking-tight text-balance">
            Everything you need to know about <span className="accent-italic text-aurora">Google Play.</span>
          </h1>
          <p className="mt-6 text-lg text-text-muted max-w-2xl">
            {GUIDES.length} in-depth guides on compliance, submission, listings, monetization, and audience targeting.
            Updated for 2026 policies. Free to read.
          </p>
        </Reveal>
      </section>

      {cats.map((cat, ci) => (
        <section key={cat} className="container max-w-4xl py-12 border-t border-border">
          <Reveal>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-display font-bold text-3xl tracking-tight">{cat}</h2>
              <span className="text-xs text-text-muted font-mono">
                {groups.get(cat)?.length ?? 0} guides
              </span>
            </div>
          </Reveal>
          <Stagger className="grid sm:grid-cols-2 gap-4" step={50}>
            {(groups.get(cat) ?? []).map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`}>
                <Card className="p-5 hover-lift h-full group">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge variant="muted" className="!text-[9px]">{g.category}</Badge>
                    <ArrowUpRight className="h-4 w-4 text-text-dim group-hover:text-text transition-colors" />
                  </div>
                  <h3 className="font-display font-semibold text-base leading-snug mb-1.5">{g.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4 line-clamp-2">{g.summary}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-text-dim font-mono">
                    <Clock className="h-3 w-3" />
                    {g.readingTimeMin} min read
                  </div>
                </Card>
              </Link>
            ))}
          </Stagger>
          {ci === 1 && (
            <div className="mt-12"><AdUnit slot={AD_SLOTS.feed} /></div>
          )}
        </section>
      ))}
    </>
  );
}
