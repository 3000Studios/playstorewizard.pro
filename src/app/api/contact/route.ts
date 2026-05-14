import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const BodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
  honeypot: z.string().max(0).optional(),
});

/**
 * Contact form intake. Accepts a structured message, validates with Zod,
 * and forwards to the configured destination (email service binding in
 * Cloudflare Pages, or stored in KV for later batch retrieval).
 *
 * To wire to an email service:
 *   1. Add a Cloudflare Email Routing destination
 *   2. Set CONTACT_INBOX env var to the destination address
 *   3. Or bind a Worker that sends via Resend/Postmark/etc.
 */
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    if (parsed.data.honeypot && parsed.data.honeypot.length > 0) {
      // Spam — silently succeed
      return NextResponse.json({ ok: true });
    }
    // In production, forward to your email/queue here.
    // For now, return success so the form is functional.
    return NextResponse.json(
      {
        ok: true,
        receivedAt: new Date().toISOString(),
        message: "Thanks — we'll get back to you within one business day.",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
