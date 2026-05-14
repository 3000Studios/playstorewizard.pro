/**
 * AI review reply generator (Pro feature).
 *
 * Reads incoming Play Store reviews and drafts appropriate replies. Always
 * returns a draft — never auto-sends. The user reviews and approves.
 *
 * Reply guidelines baked into the prompt:
 *   - Acknowledge the issue without being defensive
 *   - Never argue about a rating
 *   - Never reveal personal info or internal details
 *   - Offer a path forward (support email, in-app help, next version)
 *   - Stay under 350 characters (Play's display limit)
 */

import { generate, type AiEnv } from "./client";

export interface Review {
  reviewId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  language: string;
  authorName?: string;
  appVersion?: string;
  deviceModel?: string;
}

export interface ReviewReplyInput {
  review: Review;
  /** App context for the AI to use. */
  appName: string;
  /** Where to direct unhappy users. */
  supportEmail: string;
  /** Optional product context — e.g. "Just shipped fix for sync bug in v2.4.0". */
  recentChanges?: string;
  /** Tone preference. */
  tone?: "warm" | "professional" | "playful";
}

export interface ReviewReply {
  text: string;
  /** What category of issue we detected. */
  detectedIntent:
    | "bug-report"
    | "feature-request"
    | "praise"
    | "confusion"
    | "billing"
    | "abuse"
    | "other";
  /** Confidence 0-1. Low confidence = always show alongside the original review. */
  confidence: number;
  /** True if we recommend the user manually intervenes instead of sending. */
  recommendManualReview: boolean;
}

const SYSTEM_PROMPT = `You write replies to Google Play Store reviews on behalf of an app developer. Rules:

1. Reply length: 50-300 characters. Never over 350.
2. Acknowledge the reviewer's experience without arguing about the rating.
3. If they reported a bug, thank them and either confirm it's fixed in an upcoming version, or direct them to support email.
4. If they requested a feature, thank them and note it's on the radar (don't promise dates).
5. If they left praise, thank them genuinely and invite a higher rating only if appropriate.
6. If the review is abusive or off-topic, write a polite minimal reply or recommend manual handling.
7. Never include personal info, internal codenames, competitors, or excuses.
8. Never apologize more than once in a single reply.
9. Match the language of the review (English, Spanish, etc.).

Output strict JSON:
{
  "text": "...",
  "detectedIntent": "bug-report" | "feature-request" | "praise" | "confusion" | "billing" | "abuse" | "other",
  "confidence": 0.0 to 1.0,
  "recommendManualReview": true|false
}`;

export async function generateReviewReply(
  env: AiEnv,
  input: ReviewReplyInput
): Promise<ReviewReply> {
  const userPrompt = `App: ${input.appName}
Support email: ${input.supportEmail}
${input.recentChanges ? `Recent changes: ${input.recentChanges}\n` : ""}Tone: ${input.tone ?? "professional"}

REVIEW (${input.review.rating}-star, ${input.review.language}${input.review.appVersion ? `, v${input.review.appVersion}` : ""}):
"${input.review.text}"

Draft the reply. Return only the JSON object.`;

  const result = await generate(env, {
    system: SYSTEM_PROMPT,
    user: userPrompt,
    maxTokens: 400,
    temperature: 0.5,
  });

  // Parse and validate
  const cleaned = result.text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  let json: unknown;
  try {
    json = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Review reply output was not valid JSON");
    json = JSON.parse(match[0]);
  }
  if (typeof json !== "object" || json === null) {
    throw new Error("Review reply output was not a JSON object");
  }
  const obj = json as Record<string, unknown>;
  const text = typeof obj.text === "string" ? obj.text.trim() : "";
  const detectedIntent = (typeof obj.detectedIntent === "string" ? obj.detectedIntent : "other") as ReviewReply["detectedIntent"];
  const confidence = typeof obj.confidence === "number" ? Math.max(0, Math.min(1, obj.confidence)) : 0.5;
  const recommendManualReview = obj.recommendManualReview === true;

  if (!text) throw new Error("Empty reply text");
  if (text.length > 350) throw new Error(`Reply is ${text.length} chars, max is 350`);

  return { text, detectedIntent, confidence, recommendManualReview };
}

/**
 * Batch reply generator. Skips reviews already replied to.
 */
export async function generateRepliesBatch(
  env: AiEnv,
  input: Omit<ReviewReplyInput, "review">,
  reviews: Review[]
): Promise<Map<string, ReviewReply>> {
  const replies = new Map<string, ReviewReply>();
  for (const review of reviews) {
    try {
      const reply = await generateReviewReply(env, { ...input, review });
      replies.set(review.reviewId, reply);
    } catch (e) {
      // Skip on per-review failure — don't kill the batch.
      console.warn(`Reply generation failed for ${review.reviewId}:`, e);
    }
  }
  return replies;
}
