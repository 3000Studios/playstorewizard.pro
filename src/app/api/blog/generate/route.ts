import { NextResponse } from "next/server";
import { getEnv } from "@/lib/cloudflare";
import { generateAndSavePost } from "@/lib/blog/generator";
import { hoursSinceLatest } from "@/lib/blog/store";

export const dynamic = "force-dynamic";

// Posts are due every 4 hours. A small grace window lets a cron that fires
// slightly early still produce a post.
const INTERVAL_HOURS = 4;

async function authorize(req: Request): Promise<NextResponse | null> {
  const configuredToken = getEnv("ADMIN_ACCESS_TOKEN");
  if (!configuredToken) {
    return NextResponse.json({ error: "Generation endpoint not configured" }, { status: 503 });
  }
  const provided = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!provided || provided !== configuredToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function POST(req: Request) {
  const denied = await authorize(req);
  if (denied) return denied;

  const url = new URL(req.url);
  const force = url.searchParams.get("force") === "1";

  if (!force) {
    const hours = await hoursSinceLatest();
    if (hours < INTERVAL_HOURS - 0.25) {
      return NextResponse.json(
        { skipped: true, reason: `Last post ${hours.toFixed(1)}h ago; interval is ${INTERVAL_HOURS}h` },
        { headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  try {
    const post = await generateAndSavePost();
    return NextResponse.json(
      { ok: true, slug: post.slug, title: post.title, publishedAt: post.publishedAt },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
