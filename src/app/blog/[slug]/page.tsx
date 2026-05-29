import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Eyebrow, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/reveal";
import { InArticleAd } from "@/components/adsense/google-adsense";
import { AD_SLOTS } from "@/lib/adsense/slots";
import { JsonLd } from "@/components/seo/json-ld";
import { buildArticleLd, buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";
import { getPost, listPosts } from "@/lib/blog/store";
import { renderBody } from "@/lib/blog/render";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return pageMetadata({ title: "Post not found", description: "", path: `/blog/${slug}`, noIndex: true });
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = (await listPosts(40))
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          buildArticleLd({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: post.author,
          }),
          buildBreadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <article className="container max-w-3xl py-16">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-1.5 text-xs text-text-muted">
              <li><Link href="/" className="hover:text-text">Home</Link></li>
              <li><ChevronRight className="h-3 w-3 text-text-dim" /></li>
              <li><Link href="/blog" className="hover:text-text">Blog</Link></li>
              <li><ChevronRight className="h-3 w-3 text-text-dim" /></li>
              <li className="text-text truncate">{post.title}</li>
            </ol>
          </nav>

          <Eyebrow>{post.category}</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-balance">
            {post.title}
          </h1>
          <p className="mt-6 text-lg text-text-muted leading-relaxed text-pretty">{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span>By {post.author}</span>
            <span className="text-text-dim">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTimeMin} min read
            </span>
            <span className="text-text-dim">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.updatedAt}>Updated {formatDate(post.updatedAt)}</time>
            </span>
            {post.tags.length > 0 && (
              <>
                <span className="text-text-dim">·</span>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="muted" className="!text-[9px]">{t}</Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        </Reveal>

        <hr className="my-10 border-border" />

        <Reveal>
          <div className="prose-guide">{renderBody(post.body)}</div>
        </Reveal>

        <InArticleAd slot={AD_SLOTS.article} className="my-12" />

        {related.length > 0 && (
          <Reveal>
            <div className="mt-16 pt-8 border-t border-border">
              <Eyebrow>Keep reading</Eyebrow>
              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="block p-4 rounded-xl border border-border bg-bg-2/40 hover-lift"
                  >
                    <Badge variant="muted" className="!text-[9px] mb-2">{r.category}</Badge>
                    <h3 className="font-display font-semibold text-sm leading-snug">{r.title}</h3>
                    <p className="text-xs text-text-muted mt-1.5 line-clamp-2">{r.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </article>
    </>
  );
}
