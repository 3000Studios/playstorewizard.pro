import { NextResponse } from "next/server";
import { parseBundle } from "@/lib/bundle/parser";

export const runtime = "edge";
export const maxDuration = 30;

/**
 * NOTE: Browser-side parsing is preferred (Step 2 of the wizard does this in the user's
 * browser so the bundle never leaves their device). This server endpoint exists as a
 * fallback for CLI integrations and the public API surface.
 */
export async function POST(req: Request) {
  try {
    const buf = await req.arrayBuffer();
    if (buf.byteLength === 0) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }
    if (buf.byteLength > 200 * 1024 * 1024) {
      return NextResponse.json({ error: "Bundle exceeds 200MB limit" }, { status: 413 });
    }
    const meta = await parseBundle(new Uint8Array(buf));
    return NextResponse.json(meta, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
