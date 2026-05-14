import { NextResponse } from "next/server";
import { getSite, saveSite } from "@/lib/sites/store";
import { GeneratedSiteSchema } from "@/lib/sites/schema";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });
  return NextResponse.json({ site }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const current = await getSite(slug);
    if (!current) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    const body = await req.json();
    const parsed = GeneratedSiteSchema.safeParse({ ...current, ...body, slug: current.slug, id: current.id });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid site update", issues: parsed.error.issues }, { status: 400 });
    }
    const site = await saveSite(parsed.data);
    return NextResponse.json({ site }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[sites/update]", message);
    return NextResponse.json({ error: "Could not update site" }, { status: 500 });
  }
}
