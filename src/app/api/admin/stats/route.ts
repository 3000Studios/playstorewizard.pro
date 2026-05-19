import { NextResponse } from "next/server";
import { getSiteStats } from "@/lib/sites/store";
import { getEnv } from "@/lib/cloudflare";

export async function GET(req: Request) {
  const configuredToken = getEnv("ADMIN_ACCESS_TOKEN");

  // CRITICAL: fail closed. If no token is configured, the endpoint is locked.
  // The previous code allowed any request to read admin stats if the secret
  // happened to be unset in production.
  if (!configuredToken) {
    return NextResponse.json(
      { error: "Admin endpoint not configured" },
      { status: 503 }
    );
  }

  const providedToken = req.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");
  if (!providedToken || providedToken !== configuredToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getSiteStats();
  return NextResponse.json(
    { ...stats, generatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
