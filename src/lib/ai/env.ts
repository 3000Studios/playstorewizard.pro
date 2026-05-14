import type { AiEnv } from "./client";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Build an AiEnv from the runtime environment.
 *
 * On Cloudflare Pages, the AI binding is exposed as `process.env.AI` after
 * `@cloudflare/next-on-pages` bundles the function. In local dev, this is
 * undefined and the client falls back to Ollama if it's running, or returns
 * a 503-style error otherwise.
 */
export function getAiEnv(): AiEnv {
  let AI: AiEnv["AI"] | undefined;
  try {
    AI = (getCloudflareContext().env as unknown as { AI?: AiEnv["AI"] }).AI;
  } catch {
    AI = (process.env as unknown as { AI?: AiEnv["AI"] }).AI;
  }

  return {
    AI,
    OLLAMA_HOST: process.env.OLLAMA_HOST,
    OLLAMA_MODEL: process.env.OLLAMA_MODEL,
  };
}
