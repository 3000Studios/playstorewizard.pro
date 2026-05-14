/**
 * Unified AI client.
 *
 * Routes generation requests to whichever free backend is available:
 *
 *   1. Cloudflare Workers AI binding (when deployed to Cloudflare Pages).
 *      Free tier: 10,000 neurons/day. Llama 3.1 8B and Llama 3.3 70B Instruct
 *      cost about 11 neurons per 1k input tokens — covers thousands of
 *      generations per day at zero cost.
 *
 *   2. Local Ollama (when running `pnpm dev` on a developer machine).
 *      Free, runs entirely locally, supports any model the user has pulled.
 *
 *   3. Error response with a clear "set up one of the above" message.
 *
 * No paid API is ever called. No API keys are required for the user.
 */

export type AiBackend = "cloudflare" | "ollama" | "none";

export interface AiEnv {
  /** Cloudflare AI binding, present when running on Workers/Pages with binding configured. */
  AI?: CloudflareAiBinding;
  /** Override the Ollama host, defaults to http://localhost:11434 */
  OLLAMA_HOST?: string;
  /** Override the Ollama model, defaults to qwen2.5-coder:7b */
  OLLAMA_MODEL?: string;
}

interface CloudflareAiBinding {
  run(model: string, input: Record<string, unknown>): Promise<{ response?: string; result?: { response?: string } }>;
}

export interface GenerateInput {
  system: string;
  user: string;
  /** Max tokens for the completion. */
  maxTokens?: number;
  /** Temperature 0-1. Lower = more deterministic. */
  temperature?: number;
}

export interface GenerateResult {
  text: string;
  backend: AiBackend;
}

const CLOUDFLARE_MODEL = "@cf/meta/llama-3.1-8b-instruct";

export async function detectBackend(env: AiEnv): Promise<AiBackend> {
  if (env.AI) return "cloudflare";
  const host = env.OLLAMA_HOST ?? "http://localhost:11434";
  try {
    const res = await fetch(`${host}/api/tags`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return "ollama";
  } catch {
    // ignore — Ollama not reachable
  }
  return "none";
}

export async function generate(env: AiEnv, input: GenerateInput): Promise<GenerateResult> {
  const backend = await detectBackend(env);
  if (backend === "cloudflare") return generateCloudflare(env, input);
  if (backend === "ollama") return generateOllama(env, input);
  throw new Error(
    "No AI backend available. Either bind Cloudflare Workers AI in your Pages settings, or run `ollama serve` locally and pull a model (e.g. `ollama pull qwen2.5-coder:7b`)."
  );
}

async function generateCloudflare(env: AiEnv, input: GenerateInput): Promise<GenerateResult> {
  if (!env.AI) throw new Error("CF AI binding missing");
  const response = await env.AI.run(CLOUDFLARE_MODEL, {
    messages: [
      { role: "system", content: input.system },
      { role: "user", content: input.user },
    ],
    max_tokens: input.maxTokens ?? 800,
    temperature: input.temperature ?? 0.6,
  });
  const text =
    (response as { response?: string }).response ??
    (response as { result?: { response?: string } }).result?.response ??
    "";
  if (!text) throw new Error("CF AI returned empty response");
  return { text: text.trim(), backend: "cloudflare" };
}

async function generateOllama(env: AiEnv, input: GenerateInput): Promise<GenerateResult> {
  const host = env.OLLAMA_HOST ?? "http://localhost:11434";
  const model = env.OLLAMA_MODEL ?? "qwen2.5-coder:7b";
  const res = await fetch(`${host}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: "system", content: input.system },
        { role: "user", content: input.user },
      ],
      options: {
        num_predict: input.maxTokens ?? 800,
        temperature: input.temperature ?? 0.6,
      },
    }),
  });
  if (!res.ok) throw new Error(`Ollama returned ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { message?: { content?: string } };
  const text = json.message?.content ?? "";
  if (!text) throw new Error("Ollama returned empty response");
  return { text: text.trim(), backend: "ollama" };
}
