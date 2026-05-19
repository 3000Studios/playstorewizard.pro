/**
 * Minimal sliding-window rate limiter backed by Cloudflare KV.
 *
 * - Free: uses the SITE_EVENTS KV namespace (already deployed).
 * - Falls back to in-memory if no KV (dev/test).
 * - Per-IP keying via x-forwarded-for / CF-Connecting-IP header.
 *
 * Limits are intentionally conservative to protect the Workers AI free tier
 * (10,000 inferences/day). Adjust per route by passing different limits.
 */
import { getSiteEventsKv } from "@/lib/cloudflare";

const memoryWindow = new Map<string, number[]>();

export interface RateLimitOptions {
  /** Identifier for the limiter (used as KV prefix). */
  scope: string;
  /** Max requests allowed in the window. */
  limit: number;
  /** Window length in seconds. */
  windowSec: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetIn: number;
}

export function getClientIp(req: Request): string {
  // Cloudflare-set headers first, then the standard forwarded header.
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function rateLimit(
  req: Request,
  opts: RateLimitOptions
): Promise<RateLimitResult> {
  const ip = getClientIp(req);
  const key = `rl:${opts.scope}:${ip}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - opts.windowSec;

  let timestamps: number[];
  let useKv = true;
  try {
    const kv = getSiteEventsKv();
    const raw = await kv.get(key);
    timestamps = raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    useKv = false;
    timestamps = memoryWindow.get(key) ?? [];
  }

  // Drop expired entries
  timestamps = timestamps.filter((t) => t > windowStart);

  if (timestamps.length >= opts.limit) {
    const oldest = timestamps[0];
    return {
      ok: false,
      remaining: 0,
      resetIn: Math.max(1, oldest + opts.windowSec - now),
    };
  }

  timestamps.push(now);

  try {
    if (useKv) {
      const kv = getSiteEventsKv();
      await kv.put(key, JSON.stringify(timestamps), {
        expirationTtl: opts.windowSec + 60,
      });
    } else {
      memoryWindow.set(key, timestamps);
    }
  } catch {
    // KV write failures should not block the user; we already counted in-memory.
  }

  return {
    ok: true,
    remaining: opts.limit - timestamps.length,
    resetIn: opts.windowSec,
  };
}

export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please slow down.",
      retryAfter: result.resetIn,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(result.resetIn),
        "Cache-Control": "no-store",
      },
    }
  );
}
