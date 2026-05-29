import { generate, type AiEnv } from "@/lib/ai/client";
import { getRuntimeEnv } from "@/lib/cloudflare";
import { BLOG_CATEGORIES, BlogPostSchema, estimateReadingTime, slugify, type BlogPost } from "./types";
import { listPosts, savePost } from "./store";

const TOPIC_POOL: Record<(typeof BLOG_CATEGORIES)[number], string[]> = {
  "Policy Updates": [
    "the latest Google Play target API level requirement and how to comply",
    "what changed in Play's data safety enforcement and how to avoid rejection",
    "Google Play account deletion requirements for apps with sign-in",
  ],
  Submission: [
    "passing the 12-tester closed-testing requirement without delays",
    "the most common reasons a first production release gets rejected",
    "preparing an AAB that uploads cleanly to Play Console",
  ],
  "Listing & ASO": [
    "writing a store listing short description that converts browsers into installs",
    "designing a feature graphic that survives at thumbnail size",
    "choosing screenshots that lift install rate",
  ],
  Monetization: [
    "calculating real net revenue after Play billing fees",
    "deciding between subscriptions and one-time purchases on Play",
    "qualifying for and keeping the 15 percent small-business service fee",
  ],
  Compliance: [
    "completing the data safety form without triggering a policy flag",
    "writing a privacy policy that meets Play's requirements",
    "justifying sensitive permissions to avoid rejection",
  ],
};

function pickTopic(): { category: (typeof BLOG_CATEGORIES)[number]; topic: string } {
  const cats = BLOG_CATEGORIES;
  const category = cats[Math.floor(Math.random() * cats.length)];
  const topics = TOPIC_POOL[category];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  return { category, topic };
}

const SYSTEM_PROMPT = `You are the editorial writer for Playstore Wizard, a tool that helps developers publish Android apps to the Google Play Store. Write accurate, specific, practical articles for app developers. No fluff, no invented statistics, no fake quotes. Use only well-established Google Play facts. Output STRICT JSON only — no markdown fences, no commentary.`;

function buildUserPrompt(category: string, topic: string, existingTitles: string[]): string {
  return `Write a blog post about: ${topic}.
Category: ${category}.
Avoid duplicating these existing titles: ${existingTitles.slice(0, 20).join(" | ") || "(none)"}.

Return JSON with exactly these keys:
{
  "title": "specific, SEO-friendly, under 100 chars",
  "excerpt": "1-2 sentence summary under 300 chars",
  "tags": ["3-5 lowercase tags"],
  "body": "600-900 words. Use '## Heading' for sections (3-5 sections), blank lines between paragraphs, and '- ' for bullet lists. No markdown links, no images, no code fences."
}`;
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in AI output");
  return JSON.parse(raw.slice(start, end + 1));
}

/** Generates one post via the available AI backend, validates it, and persists it to KV. */
export async function generateAndSavePost(): Promise<BlogPost> {
  const env = getRuntimeEnv() as unknown as AiEnv;
  const existing = await listPosts(40);
  const existingTitles = existing.map((p) => p.title);
  const { category, topic } = pickTopic();

  const { text } = await generate(env, {
    system: SYSTEM_PROMPT,
    user: buildUserPrompt(category, topic, existingTitles),
    maxTokens: 1400,
    temperature: 0.7,
  });

  const parsed = extractJson(text) as {
    title?: string;
    excerpt?: string;
    tags?: string[];
    body?: string;
  };
  if (!parsed.title || !parsed.excerpt || !parsed.body) {
    throw new Error("AI output missing required fields");
  }

  let slug = slugify(parsed.title);
  if (existing.some((p) => p.slug === slug)) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  const now = new Date().toISOString();
  const post = BlogPostSchema.parse({
    slug,
    title: parsed.title.slice(0, 200),
    excerpt: parsed.excerpt.slice(0, 400),
    body: parsed.body.slice(0, 40000),
    category,
    tags: (parsed.tags ?? []).slice(0, 8).map((t) => String(t).toLowerCase().slice(0, 40)),
    author: "Playstore Wizard Editorial",
    readingTimeMin: estimateReadingTime(parsed.body),
    publishedAt: now,
    updatedAt: now,
    source: "generated",
  });

  return savePost(post);
}
