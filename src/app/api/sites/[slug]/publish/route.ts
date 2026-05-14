import { NextResponse } from "next/server";
import { getSite, publishSite } from "@/lib/sites/store";
import { getVerifiedLicenseFromRequest } from "@/lib/auth/license";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const site = await getSite(slug);
    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });
    const license = await getVerifiedLicenseFromRequest(req);
    if (!license || (license.tier !== "pro" && license.tier !== "studio")) {
      return NextResponse.json({
        error: "Publishing to a live subdomain requires an active Pro or Studio subscription.",
        upgradeUrl: "/pricing",
      }, { status: 402 });
    }

    const published = await publishSite({ ...site, tier: license.tier, ownerEmail: license.email });
    return NextResponse.json({
      site: published,
      url: `https://${published.slug}.playstorewizard.pro`,
      status: "published",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[sites/publish]", message);
    return NextResponse.json({ error: "Could not publish site" }, { status: 500 });
  }
}
