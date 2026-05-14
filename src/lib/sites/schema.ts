import { z } from "zod";

export const SiteSectionSchema = z.object({
  id: z.string().min(1).max(60),
  kind: z.enum(["hero", "features", "proof", "pricing", "faq", "cta"]),
  eyebrow: z.string().max(120).optional(),
  title: z.string().min(1).max(140),
  body: z.string().min(1).max(1200),
  items: z.array(z.object({
    title: z.string().min(1).max(100),
    body: z.string().min(1).max(400),
  })).max(12).default([]),
});

export const GeneratedSiteSchema = z.object({
  id: z.string().min(8).max(80),
  slug: z.string().regex(/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/),
  ownerEmail: z.string().email().optional(),
  tier: z.enum(["free", "pro", "studio"]).default("free"),
  status: z.enum(["draft", "published"]).default("draft"),
  name: z.string().min(2).max(80),
  industry: z.string().min(2).max(80),
  offer: z.string().min(4).max(180),
  audience: z.string().min(2).max(120),
  tone: z.enum(["premium", "friendly", "bold", "technical", "minimal"]).default("premium"),
  palette: z.enum(["aurora", "emerald", "solar", "mono", "rose"]).default("aurora"),
  primaryCta: z.string().min(2).max(60).default("Get started"),
  secondaryCta: z.string().min(2).max(60).default("View pricing"),
  contactEmail: z.string().email(),
  legalName: z.string().min(2).max(120),
  sections: z.array(SiteSectionSchema).min(4).max(8),
  seoTitle: z.string().min(8).max(70),
  seoDescription: z.string().min(40).max(180),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
});

export const GenerateSiteInputSchema = z.object({
  name: z.string().min(2).max(80),
  industry: z.string().min(2).max(80),
  offer: z.string().min(4).max(180),
  audience: z.string().min(2).max(120),
  tone: z.enum(["premium", "friendly", "bold", "technical", "minimal"]).default("premium"),
  palette: z.enum(["aurora", "emerald", "solar", "mono", "rose"]).default("aurora"),
  contactEmail: z.string().email(),
  legalName: z.string().min(2).max(120),
  ownerEmail: z.string().email().optional(),
  tier: z.enum(["free", "pro", "studio"]).default("free"),
});

export type SiteSection = z.infer<typeof SiteSectionSchema>;
export type GeneratedSite = z.infer<typeof GeneratedSiteSchema>;
export type GenerateSiteInput = z.infer<typeof GenerateSiteInputSchema>;
