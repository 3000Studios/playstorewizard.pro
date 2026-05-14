import { NextResponse } from "next/server";
import { getSiteStats } from "@/lib/sites/store";

export async function GET(req: Request) {
  const configuredToken = process.env.ADMIN_ACCESS_TOKEN;
  const providedToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (configuredToken && providedToken !== configuredToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getSiteStats();
  return NextResponse.json({
    ...stats,
    generatedAt: new Date().toISOString(),
  }, { headers: { "Cache-Control": "no-store" } });
}
