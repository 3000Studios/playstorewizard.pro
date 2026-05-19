import { NextResponse } from "next/server";
import { z } from "zod";
import { generateReviewReply } from "@/lib/ai/review-reply";
import { getAiEnv } from "@/lib/ai/env";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const ReviewSchema = z.object({
  reviewId: z.string().min(1).max(120),
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  text: z.string().min(1).max(4000),
  language: z.string().min(2).max(10),
  authorName: z.string().max(200).optional(),
  appVersion: z.string().max(40).optional(),
  deviceModel: z.string().max(120).optional(),
});

const BodySchema = z.object({
  review: ReviewSchema,
  appName: z.string().min(1).max(120),
  supportEmail: z.string().email(),
  recentChanges: z.string().max(500).optional(),
  tone: z.enum(["warm", "professional", "playful"]).optional(),
});

export async function POST(req: Request) {
  // Protect Workers AI free quota (10k/day): 30 replies per IP per hour.
  const rl = await rateLimit(req, { scope: "ai-review-reply", limit: 30, windowSec: 3600 });
  if (!rl.ok) return rateLimitResponse(rl);

  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const out = await generateReviewReply(getAiEnv(), parsed.data);
    return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[ai/review-reply]", msg);
    return NextResponse.json({ error: "AI generation failed. Please try again." }, { status: 500 });
  }
}
