import Link from "next/link";
import { Reveal, Stagger } from "@/components/motion/reveal";
import { Eyebrow, Badge, Card } from "@/components/ui/primitives";
import { AdUnit } from "@/components/adsense/google-adsense";
import { AD_SLOTS } from "@/lib/adsense/slots";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";
import { listPosts } from "@/lib/blog/store";
import { formatDate } from "@/lib/utils";
import { Clock, ArrowUpRight, Rss } from "lucide-react";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Fresh Google Play publishing insight — policy updates, store-listing tactics, monetization math, and compliance, updated continuously.",
  path: "/blog",
});

// Posts live in KV at runtime; never statically cache the index.
export const dynamic = "force-dynamic";

export default async function BlogIndex() {
  const posts = await listPosts(60);
  const [featured, ...rest] = posts;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />

      <section className="container max-w-4xl py-20">
        <Reveal>
          <div className="flex items-center justify-between gap-4">
            <Eyebrow>Blog</Eyebrow>
            <Link
              href="/blog/rss.xml"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
            >
              <Rss className="h-3.5 w-3.5" /> RSS
            </Link>
          </div>
          <h1 className="mt-3 font-display font-bold text-5xl sm:text-6xl tracking-tight text-balance">
            The <span className="accent-italic text-aurora">Playstore Wizard</span> blog.
          </h1>
          <p className="mt-6 text-lg text-text-muted max-w-2xl">
            Continuously updated coverage of Google Play policy, store-listing conversion,
            monetization, and compliance. Free to read.
          </p>
        </Reveal>
      </section>

      {featured && (
        <section className="container max-w-4xl pb-12">
          <Reveal>
            <Link href={`/blog/${featured.slug}`}>
              <Card className="p-8 hover-lift group">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <Badge variant="indigo">{featured.category}</Badge>
                  <ArrowUpRight className="h-5 w-5 text-text-dim group-hover:text-text transition-colors" />
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl leading-tight tracking-tight mb-3">
                  {featured.title}
                </h2>
                <p className="text-text-muted leading-relaxed mb-5 max-w-2xl">{featured.excerpt}</p>
                <div className="flex items-center gap-2 text-[11px] text-text-dim font-mono">
                  <Clock className="h-3 w-3" />
                  {featured.readingTimeMin} min read
                  <span className="text-text-dim">·</span>
                  <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time>
                </div>
              </Card>
            </Link>
          </Reveal>
        </section>
      )}

      <section className="container max-w-4xl pb-20 border-t border-border pt-12">
        <Stagger className="grid sm:grid-cols-2 gap-4" step={50}>
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`}>
              <Card className="p-5 hover-lift h-full group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Badge variant="muted" className="!text-[9px]">{p.category}</Badge>
                  <ArrowUpRight className="h-4 w-4 text-text-dim group-hover:text-text transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-base leading-snug mb-1.5">{p.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4 line-clamp-2">{p.excerpt}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-text-dim font-mono">
                  <Clock className="h-3 w-3" />
                  {p.readingTimeMin} min read
                  <span className="text-text-dim">·</span>
                  <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
                </div>
              </Card>
            </Link>
          ))}
        </Stagger>

        <div className="mt-12"><AdUnit slot={AD_SLOTS.feed} /></div>
      </section>
    </>
  );
}
