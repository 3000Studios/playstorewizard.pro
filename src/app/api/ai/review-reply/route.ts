import { NextResponse } from "next/server";
import { z } from "zod";
import { generateReviewReply } from "@/lib/ai/review-reply";
import { getAiEnv } from "@/lib/ai/env";

export const runtime = "edge";

const BodySchema = z.object({
  review: z.object({
    reviewId: z.string().min(1).max(200),
    rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    text: z.string().min(1).max(4000),
    language: z.string().max(10).default("en"),
    authorName: z.string().max(200).optional(),
    appVersion: z.string().max(40).optional(),
    deviceModel: z.string().max(80).optional(),
  }),
  appName: z.string().min(1).max(120),
  supportEmail: z.string().email(),
  recentChanges: z.string().max(500).optional(),
  tone: z.enum(["warm", "professional", "playful"]).optional(),
});

export async function POST(req: Request) {
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
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
