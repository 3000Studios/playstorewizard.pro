import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";
import { GUIDES } from "@/lib/content/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const lastModFromDate = (d: string) => new Date(d);

  const staticPaths: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/features", changeFrequency: "monthly", priority: 0.9 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
    { path: "/how-it-works", changeFrequency: "monthly", priority: 0.8 },
    { path: "/compare", changeFrequency: "monthly", priority: 0.7 },
    { path: "/changelog", changeFrequency: "weekly", priority: 0.6 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.8 },
    { path: "/guides", changeFrequency: "weekly", priority: 0.8 },
    { path: "/wizard", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about", changeFrequency: "yearly", priority: 0.5 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.4 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
    { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
    { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const guideEntries: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: lastModFromDate(g.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...guideEntries];
}
