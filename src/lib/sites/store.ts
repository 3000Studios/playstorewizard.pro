import { getSiteEventsKv, getUserSitesKv } from "@/lib/cloudflare";
import { GeneratedSiteSchema, type GeneratedSite } from "./schema";

const siteKey = (slug: string) => `site:${slug}`;
const eventKey = (siteId: string) => `event:${new Date().toISOString()}:${siteId}`;

export async function saveSite(site: GeneratedSite): Promise<GeneratedSite> {
  const parsed = GeneratedSiteSchema.parse({ ...site, updatedAt: new Date().toISOString() });
  await getUserSitesKv().put(siteKey(parsed.slug), JSON.stringify(parsed), {
    metadata: {
      status: parsed.status,
      ownerEmail: parsed.ownerEmail ?? "",
      updatedAt: parsed.updatedAt,
    },
  });
  return parsed;
}

export async function getSite(slug: string): Promise<GeneratedSite | null> {
  const value = await getUserSitesKv().get(siteKey(slug));
  if (!value) return null;
  return GeneratedSiteSchema.parse(JSON.parse(value));
}

export async function publishSite(site: GeneratedSite): Promise<GeneratedSite> {
  const published = await saveSite({
    ...site,
    status: "published",
    publishedAt: new Date().toISOString(),
  });
  await recordSiteEvent(published.id, "published", {
    slug: published.slug,
    url: `https://${published.slug}.playstorewizard.pro`,
  });
  return published;
}

export async function listSites(limit = 50): Promise<GeneratedSite[]> {
  const listed = await getUserSitesKv().list({ prefix: "site:", limit });
  const sites = await Promise.all(listed.keys.map((key) => getUserSitesKv().get(key.name)));
  return sites
    .filter((value): value is string => Boolean(value))
    .map((value) => GeneratedSiteSchema.parse(JSON.parse(value)))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function recordSiteEvent(siteId: string, action: string, data: Record<string, unknown>): Promise<void> {
  await getSiteEventsKv().put(eventKey(siteId), JSON.stringify({
    siteId,
    action,
    data,
    createdAt: new Date().toISOString(),
  }));
}

export async function getSiteStats(): Promise<{
  totalSites: number;
  publishedSites: number;
  draftSites: number;
  recentSites: GeneratedSite[];
}> {
  const sites = await listSites(100);
  return {
    totalSites: sites.length,
    publishedSites: sites.filter((site) => site.status === "published").length,
    draftSites: sites.filter((site) => site.status === "draft").length,
    recentSites: sites.slice(0, 10),
  };
}
