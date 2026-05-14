import { NextResponse } from "next/server";
import { z } from "zod";
import {
  generatePrivacyPolicy,
  type DataType,
  type DataPurpose,
} from "@/lib/ai/privacy";


const DATA_TYPE = z.enum([
  "name", "email", "phone", "address", "user-ids", "device-ids",
  "location-approximate", "location-precise",
  "photos", "videos", "audio", "files-and-docs",
  "contacts", "calendar", "sms-mms", "call-logs",
  "health-fitness", "financial-info", "payment-info",
  "purchase-history", "credit-info",
  "app-interactions", "in-app-search-history",
  "crash-logs", "performance-data",
  "diagnostic-info", "other-app-performance-data",
  "ip-address", "browser-history",
  "voice-recordings", "racial-ethnic-data", "political-info",
  "religious-info", "sexual-orientation",
]);

const DATA_PURPOSE = z.enum([
  "account-management", "app-functionality", "analytics",
  "developer-communications", "advertising-marketing",
  "fraud-prevention", "compliance", "personalization",
]);

const BodySchema = z.object({
  appName: z.string().min(1).max(120),
  developerName: z.string().min(1).max(200),
  contactEmail: z.string().email(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  jurisdiction: z.string().max(200).optional(),
  collectsData: z.boolean(),
  sharesData: z.boolean(),
  dataTypes: z.array(DATA_TYPE).default([]),
  dataPurposes: z.record(DATA_TYPE, z.array(DATA_PURPOSE)).default({}),
  usesAds: z.boolean(),
  adNetworks: z.array(z.string().max(100)).optional(),
  usesAnalytics: z.boolean(),
  analyticsProviders: z.array(z.string().max(100)).optional(),
  allowsAccountCreation: z.boolean(),
  hasInAppAccountDeletion: z.boolean(),
  targetsChildren: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    // websiteUrl may be empty string from form — normalize to undefined for the lib.
    const input = {
      ...parsed.data,
      websiteUrl: parsed.data.websiteUrl || undefined,
      // dataPurposes must be a full record over DataType. Default empties for missing.
      dataPurposes: parsed.data.dataPurposes as Record<DataType, DataPurpose[]>,
    };
    const out = generatePrivacyPolicy(input);
    return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
