import { NextResponse } from "next/server";
import { GenerateSiteInputSchema } from "@/lib/sites/schema";
import { generateSite } from "@/lib/sites/generator";
import { saveSite, recordSiteEvent } from "@/lib/sites/store";
import { getVerifiedLicenseFromRequest } from "@/lib/auth/license";

export async function POST(req: Request) {
  try {
    const parsed = GenerateSiteInputSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const license = await getVerifiedLicenseFromRequest(req);
    const site = await saveSite(generateSite({
      ...parsed.data,
      tier: license?.tier ?? "free",
      ownerEmail: license?.email ?? parsed.data.ownerEmail,
    }));
    await recordSiteEvent(site.id, "generated", { slug: site.slug, name: site.name });
    return NextResponse.json({
      site,
      editUrl: `/dashboard?site=${site.slug}`,
      publishUrl: `/api/sites/${site.slug}/publish`,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[sites/generate]", message);
    return NextResponse.json({ error: "Could not generate site" }, { status: 500 });
  }
}
