import { z } from "zod";

export const BLOG_CATEGORIES = [
  "Policy Updates",
  "Submission",
  "Listing & ASO",
  "Monetization",
  "Compliance",
] as const;

export const BlogPostSchema = z.object({
  slug: z.string().min(1).max(120),
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(400),
  /** Markdown-lite body: `## heading`, blank-line-separated paragraphs, `- ` bullets. */
  body: z.string().min(1).max(40000),
  category: z.enum(BLOG_CATEGORIES),
  tags: z.array(z.string().max(40)).max(10).default([]),
  author: z.string().max(80).default("Playstore Wizard Editorial"),
  readingTimeMin: z.number().int().min(1).max(60).default(4),
  publishedAt: z.string(),
  updatedAt: z.string(),
  /** "seed" posts ship in the bundle; "generated" posts come from the AI job. */
  source: z.enum(["seed", "generated"]).default("generated"),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

export function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\da-z]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
