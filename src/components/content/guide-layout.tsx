import Link from "next/link";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Eyebrow, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/reveal";
import { InArticleAd } from "@/components/adsense/google-adsense";
import { JsonLd } from "@/components/seo/json-ld";
import { buildArticleLd, buildBreadcrumbLd } from "@/lib/seo/metadata";
import { getGuide, getRelatedGuides, type GuideMeta } from "@/lib/content/guides";
import { formatDate } from "@/lib/utils";

interface GuideLayoutProps {
  slug: string;
  children: React.ReactNode;
  /** Pass a slot ID once you have AdSense ad units configured. */
  midAdSlot?: string;
  /** Index in the prose where the mid-ad shows. Default 1 (after first H2). */
  midAdAfterSection?: number;
}

export function GuideLayout({ slug, children }: GuideLayoutProps) {
  const guide = getGuide(slug);
  if (!guide) return null;
  const related = getRelatedGuides(slug, 3);

  return (
    <>
      <JsonLd
        data={[
          buildArticleLd({
            title: guide.title,
            description: guide.summary,
            path: `/guides/${guide.slug}`,
            datePublished: guide.publishedAt,
            dateModified: guide.updatedAt,
            author: "Mr. J. Swain",
          }),
          buildBreadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ]),
        ]}
      />

      <article className="container max-w-3xl py-16">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-1.5 text-xs text-text-muted">
              <li><Link href="/" className="hover:text-text">Home</Link></li>
              <li><ChevronRight className="h-3 w-3 text-text-dim" /></li>
              <li><Link href="/guides" className="hover:text-text">Guides</Link></li>
              <li><ChevronRight className="h-3 w-3 text-text-dim" /></li>
              <li className="text-text truncate">{guide.title}</li>
            </ol>
          </nav>

          <Eyebrow>{guide.category}</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-balance">
            {guide.title}
          </h1>
          <p className="mt-6 text-lg text-text-muted leading-relaxed text-pretty">
            {guide.summary}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span>
              By{" "}
              <Link href="/about" className="text-text hover:text-indigo-200 underline decoration-indigo-500/30 underline-offset-4">
                Mr. J. Swain
              </Link>
              , 3000 Studios
            </span>
            <span className="text-text-dim">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {guide.readingTimeMin} min read
            </span>
            <span className="text-text-dim">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={guide.updatedAt}>Updated {formatDate(guide.updatedAt)}</time>
            </span>
            <span className="text-text-dim">·</span>
            <div className="flex flex-wrap gap-1.5">
              {guide.tags.slice(0, 3).map((t) => (
                <Badge key={t} variant="muted" className="!text-[9px]">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </Reveal>

        <hr className="my-10 border-border" />

        <Reveal>
          <div className="prose-guide">{children}</div>
        </Reveal>

        <InArticleAd slot="2345678901" className="my-12" />

        <Reveal>
          <div className="mt-16 pt-8 border-t border-border">
            <Eyebrow>Keep reading</Eyebrow>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {related.map((r: GuideMeta) => (
                <Link
                  key={r.slug}
                  href={`/guides/${r.slug}`}
                  className="block p-4 rounded-xl border border-border bg-bg-2/40 hover-lift"
                >
                  <Badge variant="muted" className="!text-[9px] mb-2">{r.category}</Badge>
                  <h3 className="font-display font-semibold text-sm leading-snug">{r.title}</h3>
                  <p className="text-xs text-text-muted mt-1.5 line-clamp-2">{r.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </article>
    </>
  );
}
