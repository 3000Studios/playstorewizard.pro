import { NextResponse } from "next/server";
import { z } from "zod";
import { generateDescription } from "@/lib/ai/description";
import { getAiEnv } from "@/lib/ai/env";


const BodySchema = z.object({
  appName: z.string().min(1).max(120),
  oneSentencePitch: z.string().min(1).max(500),
  category: z.string().min(1).max(60),
  audience: z.string().max(200).optional(),
  features: z.array(z.string().max(120)).max(20).optional(),
  tone: z.enum(["professional", "playful", "minimal", "bold"]).optional(),
  language: z.string().max(10).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const out = await generateDescription(getAiEnv(), parsed.data);
    return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
