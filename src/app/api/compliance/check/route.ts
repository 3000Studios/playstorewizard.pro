import { NextResponse } from "next/server";
import { z } from "zod";
import { checkCompliance } from "@/lib/compliance/checker";

export const runtime = "edge";

const BodySchema = z.object({
  targetSdk: z.number().int().optional(),
  minSdk: z.number().int().optional(),
  bundleFormat: z.enum(["aab", "apk"]).optional(),
  accountType: z.enum(["personal", "organization"]).default("personal"),
  isFirstApp: z.boolean().default(true),
  appName: z.string().default(""),
  shortDescription: z.string().default(""),
  fullDescription: z.string().default(""),
  hasFeatureGraphic: z.boolean().default(false),
  screenshotCount: z.number().int().default(0),
  collectsData: z.boolean().default(false),
  sharesData: z.boolean().default(false),
  hasPrivacyPolicyUrl: z.boolean().default(false),
  allowsAccountCreation: z.boolean().default(false),
  hasInAppAccountDeletion: z.boolean().default(false),
  targetsChildren: z.boolean().default(false),
  inFamiliesProgram: z.boolean().default(false),
  hasInAppPurchases: z.boolean().default(false),
  hasSubscriptions: z.boolean().default(false),
  declaredPermissions: z.array(z.string()).default([]),
  targetTrack: z.enum(["internal", "closed", "open", "production"]).default("production"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const report = checkCompliance(parsed.data);
    return NextResponse.json(report, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
