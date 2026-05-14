import type { AiEnv } from "./client";

/**
 * Build an AiEnv from the runtime environment.
 *
 * On Cloudflare Pages, the AI binding is exposed as `process.env.AI` after
 * `@cloudflare/next-on-pages` bundles the function. In local dev, this is
 * undefined and the client falls back to Ollama if it's running, or returns
 * a 503-style error otherwise.
 */
export function getAiEnv(): AiEnv {
  return {
    // The Cloudflare AI binding is injected by the runtime. Cast is unavoidable
    // because Node's process.env types don't model bindings.
    AI: (process.env as unknown as { AI?: AiEnv["AI"] }).AI,
    OLLAMA_HOST: process.env.OLLAMA_HOST,
    OLLAMA_MODEL: process.env.OLLAMA_MODEL,
  };
}
