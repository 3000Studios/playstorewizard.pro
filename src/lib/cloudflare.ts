import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface KvNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number; metadata?: Record<string, unknown> }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
    keys: { name: string; expiration?: number; metadata?: unknown }[];
    list_complete: boolean;
    cursor?: string;
  }>;
}

interface RuntimeEnv {
  USER_SITES?: KvNamespace;
  SITE_EVENTS?: KvNamespace;
  AI?: unknown;
}

const memoryNamespaces = new Map<string, Map<string, string>>();

function memoryKv(name: string): KvNamespace {
  if (!memoryNamespaces.has(name)) memoryNamespaces.set(name, new Map());
  const store = memoryNamespaces.get(name)!;
  return {
    async get(key) {
      return store.get(key) ?? null;
    },
    async put(key, value) {
      store.set(key, value);
    },
    async delete(key) {
      store.delete(key);
    },
    async list(options) {
      const prefix = options?.prefix ?? "";
      const limit = options?.limit ?? 1000;
      const keys = Array.from(store.keys())
        .filter((name) => name.startsWith(prefix))
        .slice(0, limit)
        .map((name) => ({ name }));
      return { keys, list_complete: true };
    },
  };
}

export function getRuntimeEnv(): RuntimeEnv {
  try {
    return getCloudflareContext().env as unknown as RuntimeEnv;
  } catch {
    return {};
  }
}

export function getUserSitesKv(): KvNamespace {
  return getRuntimeEnv().USER_SITES ?? memoryKv("USER_SITES");
}

export function getSiteEventsKv(): KvNamespace {
  return getRuntimeEnv().SITE_EVENTS ?? memoryKv("SITE_EVENTS");
}
