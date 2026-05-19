import { NextResponse } from "next/server";
import { z } from "zod";
import { getSiteEventsKv } from "@/lib/cloudflare";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";


const BodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
  honeypot: z.string().max(0).optional(),
});

/**
 * Contact form intake.
 *
 * Persists each message to the SITE_EVENTS KV namespace under the key
 *   contact:{ISO_TIMESTAMP}:{8-char-random}
 * so messages survive deploy/restart and can be read out of band via
 * `wrangler kv:key list` or the admin stats endpoint.
 *
 * To forward to email instead/in-addition: wire a Cloudflare Email Routing
 * destination or send to Resend/Postmark from this handler.
 */
export async function POST(req: Request) {
  // Lightly rate-limit so the form can't be used as a spam relay
  // (the honeypot catches bots; the rate limit catches scripts that strip it).
  const rl = await rateLimit(req, { scope: "contact", limit: 5, windowSec: 600 });
  if (!rl.ok) return rateLimitResponse(rl);

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

    const now = new Date().toISOString();
    const rand = Math.random().toString(36).slice(2, 10);
    const key = `contact:${now}:${rand}`;
    const record = {
      ...parsed.data,
      receivedAt: now,
      ip:
        req.headers.get("cf-connecting-ip") ??
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        null,
      userAgent: req.headers.get("user-agent") ?? null,
    };

    try {
      await getSiteEventsKv().put(key, JSON.stringify(record), {
        // 90 days — long enough to respond, short enough to not fill KV.
        expirationTtl: 60 * 60 * 24 * 90,
      });
    } catch (e) {
      // KV failures should not lose the message — log to stdout (wrangler tail)
      // so it's still recoverable.
      console.error("[contact] KV put failed:", e, record);
    }

    // Always also log to stdout so it shows in wrangler tail.
    console.log(`[contact] ${parsed.data.email} — ${parsed.data.subject}`);

    return NextResponse.json(
      {
        ok: true,
        receivedAt: now,
        message: "Thanks — we'll get back to you within one business day.",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[contact]", msg);
    return NextResponse.json({ error: "Could not deliver message. Please try again." }, { status: 500 });
  }
}
