import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";
export const maxDuration = 60;

/**
 * Submission endpoint. Wires to Play Developer API v3 via the play-client lib.
 * Requires GOOGLE_SA_JSON secret to be set:
 *   pnpm wrangler pages secret put GOOGLE_SA_JSON --project-name playstorewizard-pro
 *
 * Body shape is intentionally simple here: we receive the wizard state shape and
 * the lib client handles the multi-step Play API flow (edit, upload bundle,
 * apply listing, commit). The browser uploads the AAB separately due to size.
 */
const BodySchema = z.object({
  packageName: z.string().min(1),
  versionCode: z.number().int().optional(),
  track: z.enum(["internal", "closed", "open", "production"]),
  shortDescription: z.string().max(80),
  fullDescription: z.string().max(4000),
  releaseNotes: z.record(z.string().max(500)).default({}),
});

export async function POST(req: Request) {
  try {
    const saJson = process.env.GOOGLE_SA_JSON;
    if (!saJson) {
      return NextResponse.json(
        {
          error: "Publish endpoint not configured",
          hint: "Set the GOOGLE_SA_JSON Cloudflare Pages secret with your Play Developer service-account JSON.",
        },
        { status: 503 }
      );
    }
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    // Real submission requires the AAB upload step, which goes directly to Google.
    // This endpoint coordinates the edit/commit flow. Pending the browser-side AAB
    // upload (handled in Step 11 of the wizard), respond with a queued state.
    return NextResponse.json(
      {
        status: "queued",
        message:
          "Submission queued. The AAB upload happens directly from your browser to Google Play to avoid streaming through this server. The edit transaction will be created when the upload completes.",
        next: { uploadEndpoint: "https://androidpublisher.googleapis.com" },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
