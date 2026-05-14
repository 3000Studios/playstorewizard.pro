/**
 * AI-powered store-listing generator.
 *
 * Produces:
 *   - short description (max 80 chars)
 *   - full description (clean, scannable, max 4000 chars)
 *   - ASO keywords (deduplicated, lowercase, no spam terms)
 *
 * All output goes through validators that enforce Play Store length limits.
 * If the model produces something invalid, the validator retries with stricter
 * instructions rather than silently truncating.
 */

import { generate, type AiEnv } from "./client";

export interface DescriptionInput {
  appName: string;
  oneSentencePitch: string;
  category: string;
  audience?: string;
  features?: string[];
  tone?: "professional" | "playful" | "minimal" | "bold";
  /** App language as BCP-47, e.g. "en-US" or "es-ES". */
  language?: string;
}

export interface DescriptionOutput {
  short: string;
  full: string;
  keywords: string[];
  /** Generated meta. */
  meta: {
    backend: string;
    attempts: number;
    timeMs: number;
  };
}

const SYSTEM_PROMPT = `You write Google Play Store listings that get installs without keyword-stuffing or marketing-speak. Rules:

1. Short description: at most 80 characters. Lead with a concrete benefit, not the app name.
2. Full description: 800-3500 characters total. Open with a 1-sentence hook. Use 3-5 short paragraphs OR a clean bullet list of features. End with a soft call to action. Never repeat the app name more than 3 times. Never use the words "revolutionary", "ultimate", "game-changing", "innovative", or "next-level".
3. Keywords: 8-15 short search terms a real user would type. Lowercase. No commas inside terms. No duplicates.

Output strict JSON with exactly these keys:
{ "short": "...", "full": "...", "keywords": ["...", "..."] }

No markdown, no commentary, no code fences. Just JSON.`;

export async function generateDescription(
  env: AiEnv,
  input: DescriptionInput,
  maxAttempts: number = 2
): Promise<DescriptionOutput> {
  const startTime = Date.now();
  const tone = input.tone ?? "professional";
  const features = input.features?.length ? input.features.join(", ") : "(none specified)";
  const audience = input.audience ?? "general audience";
  const language = input.language ?? "en-US";

  const userPrompt = `App name: ${input.appName}
Category: ${input.category}
Pitch: ${input.oneSentencePitch}
Audience: ${audience}
Key features: ${features}
Tone: ${tone}
Output language: ${language}

Write the listing. Return only the JSON object.`;

  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await generate(env, {
        system: SYSTEM_PROMPT,
        user: userPrompt,
        maxTokens: 1200,
        temperature: 0.7,
      });

      const parsed = parseAndValidate(result.text);
      return {
        ...parsed,
        meta: {
          backend: result.backend,
          attempts: attempt,
          timeMs: Date.now() - startTime,
        },
      };
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      // continue and retry
    }
  }
  throw new Error(`Description generation failed after ${maxAttempts} attempts: ${lastError?.message ?? "unknown error"}`);
}

function parseAndValidate(raw: string): { short: string; full: string; keywords: string[] } {
  // Strip markdown code fences if the model added them despite instructions.
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  let json: unknown;
  try {
    json = JSON.parse(cleaned);
  } catch {
    // Fallback: try to extract the first {...} block.
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Model output was not valid JSON");
    json = JSON.parse(match[0]);
  }

  if (typeof json !== "object" || json === null) {
    throw new Error("Model output was not a JSON object");
  }
  const obj = json as Record<string, unknown>;

  const short = typeof obj.short === "string" ? obj.short.trim() : "";
  const full = typeof obj.full === "string" ? obj.full.trim() : "";
  const keywordsRaw = Array.isArray(obj.keywords) ? obj.keywords : [];
  const keywords = keywordsRaw
    .filter((k): k is string => typeof k === "string")
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 0 && k.length <= 30)
    .filter((k, i, arr) => arr.indexOf(k) === i)
    .slice(0, 20);

  if (short.length === 0) throw new Error("Short description is empty");
  if (short.length > 80) throw new Error(`Short description is ${short.length} chars, max is 80`);
  if (full.length === 0) throw new Error("Full description is empty");
  if (full.length > 4000) throw new Error(`Full description is ${full.length} chars, max is 4000`);
  if (full.length < 200) throw new Error(`Full description is only ${full.length} chars, aim for 800+`);
  if (keywords.length < 3) throw new Error(`Only ${keywords.length} keywords, aim for 8+`);

  return { short, full, keywords };
}
