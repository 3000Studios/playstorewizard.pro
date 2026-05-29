import { getUserSitesKv } from "@/lib/cloudflare";
import { BlogPostSchema, type BlogPost } from "./types";
import { SEED_POSTS } from "./seed";

// Generated posts live in the already-bound USER_SITES namespace under a prefix,
// so no extra KV namespace needs provisioning. Seed posts ship in the bundle.
const KEY_PREFIX = "blog:";
const postKey = (slug: string) => `${KEY_PREFIX}${slug}`;

export async function savePost(input: BlogPost): Promise<BlogPost> {
  const parsed = BlogPostSchema.parse({ ...input, updatedAt: new Date().toISOString() });
  await getUserSitesKv().put(postKey(parsed.slug), JSON.stringify(parsed), {
    metadata: { category: parsed.category, publishedAt: parsed.publishedAt },
  });
  return parsed;
}

async function listGeneratedPosts(limit = 200): Promise<BlogPost[]> {
  let posts: BlogPost[] = [];
  try {
    const listed = await getUserSitesKv().list({ prefix: KEY_PREFIX, limit });
    const values = await Promise.all(listed.keys.map((k) => getUserSitesKv().get(k.name)));
    posts = values
      .filter((v): v is string => Boolean(v))
      .map((v) => {
        const r = BlogPostSchema.safeParse(JSON.parse(v));
        return r.success ? r.data : null;
      })
      .filter((p): p is BlogPost => p !== null);
  } catch {
    posts = [];
  }
  return posts;
}

/** All posts (generated + seed), newest first, de-duplicated by slug. */
export async function listPosts(limit = 100): Promise<BlogPost[]> {
  const generated = await listGeneratedPosts();
  const bySlug = new Map<string, BlogPost>();
  for (const p of SEED_POSTS) bySlug.set(p.slug, p);
  for (const p of generated) bySlug.set(p.slug, p); // generated overrides seed
  return Array.from(bySlug.values())
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await getUserSitesKv().get(postKey(slug));
    if (raw) {
      const r = BlogPostSchema.safeParse(JSON.parse(raw));
      if (r.success) return r.data;
    }
  } catch {
    // fall through to seed
  }
  return SEED_POSTS.find((p) => p.slug === slug) ?? null;
}

/** Slugs known at build time (seed posts) for static generation. */
export function seedSlugs(): string[] {
  return SEED_POSTS.map((p) => p.slug);
}

/** Hours since the most recent post — used to decide if a fresh post is due. */
export async function hoursSinceLatest(): Promise<number> {
  const [latest] = await listPosts(1);
  if (!latest) return Number.POSITIVE_INFINITY;
  const last = new Date(latest.publishedAt).getTime();
  return (Date.now() - last) / 3_600_000;
}
