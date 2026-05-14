import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateFees } from "@/lib/pricing/calculator";

export const runtime = "edge";

const BodySchema = z.object({
  regime: z.enum(["current", "post-june-2026"]).default("current"),
  monetization: z.enum(["free", "paid-up-front", "iap", "subscription", "hybrid"]),
  annualGrossUsd: z.number().nonnegative().default(0),
  inExperienceProgram: z.boolean().optional(),
  usesAlternativeBilling: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const result = calculateFees(parsed.data);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
