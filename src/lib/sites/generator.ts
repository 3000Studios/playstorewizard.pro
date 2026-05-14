import { slugify } from "@/lib/utils";
import type { GenerateSiteInput, GeneratedSite, SiteSection } from "./schema";

const toneCopy: Record<GenerateSiteInput["tone"], { adjective: string; promise: string }> = {
  premium: { adjective: "polished", promise: "turns attention into confident action" },
  friendly: { adjective: "approachable", promise: "helps visitors feel guided from the first click" },
  bold: { adjective: "high-conviction", promise: "makes the offer impossible to miss" },
  technical: { adjective: "clear and precise", promise: "explains the value without fluff" },
  minimal: { adjective: "focused", promise: "keeps the path to conversion clean" },
};

export function generateSite(input: GenerateSiteInput): GeneratedSite {
  const now = new Date().toISOString();
  const slug = uniqueSlug(input.name);
  const tone = toneCopy[input.tone];
  const sections: SiteSection[] = [
    {
      id: "hero",
      kind: "hero",
      eyebrow: `${input.industry} launch page`,
      title: `${input.name} helps ${input.audience} ${input.offer}`,
      body: `A ${tone.adjective} web experience built to explain the offer quickly, earn trust, and move serious visitors toward the next step. Every section is structured for clarity, search visibility, accessibility, and conversion.`,
      items: [
        { title: "Fast to understand", body: "The page opens with a plain-language promise and a direct call to action." },
        { title: "Ready to publish", body: "SEO, privacy language, responsive layout, and mobile behavior are included from the start." },
      ],
    },
    {
      id: "features",
      kind: "features",
      eyebrow: "What visitors get",
      title: `A complete path from curiosity to conversion`,
      body: `${input.name} presents the core offer in a way that ${tone.promise}. The layout avoids filler and gives every visitor a clear reason to trust the brand.`,
      items: [
        { title: "Clear value story", body: `Explains why ${input.offer} matters for ${input.audience}.` },
        { title: "Conversion-ready sections", body: "Feature cards, proof, pricing, FAQs, and calls to action are already organized." },
        { title: "Mobile-first polish", body: "Every block uses readable spacing, accessible contrast, and quick scanning patterns." },
      ],
    },
    {
      id: "proof",
      kind: "proof",
      eyebrow: "Trust builders",
      title: `Designed to feel credible before the first sale`,
      body: `Strong landing pages reduce doubt. This draft includes trust language, practical benefits, transparent next steps, and enough detail for a visitor to understand what happens after they click.`,
      items: [
        { title: "No vague promises", body: "Copy is specific about the outcome and the type of customer it serves." },
        { title: "Real-world readiness", body: "The page includes privacy, contact, and support language so it feels like a real business." },
      ],
    },
    {
      id: "pricing",
      kind: "pricing",
      eyebrow: "Simple offer",
      title: `Start with one focused offer, then expand`,
      body: `The recommended launch structure is one clear primary offer, one premium upgrade, and one contact option for customers who need a custom plan. That keeps the first launch easy to understand while still leaving room for revenue growth.`,
      items: [
        { title: "Starter", body: "Best for first-time customers who want the core result without complexity." },
        { title: "Pro", body: "Best for repeat users who want speed, automation, or deeper support." },
        { title: "Custom", body: "Best for teams, agencies, or customers with a larger rollout." },
      ],
    },
    {
      id: "faq",
      kind: "faq",
      eyebrow: "Questions",
      title: `Answers before objections slow the sale`,
      body: `The page includes practical FAQ content so visitors understand fit, timing, pricing expectations, and support before they reach out.`,
      items: [
        { title: "Who is this for?", body: `${input.name} is built for ${input.audience} who need ${input.offer}.` },
        { title: "How fast can we start?", body: "Most customers can begin with the primary offer and upgrade when their needs grow." },
        { title: "How do I get help?", body: `Use the contact email ${input.contactEmail} for support, questions, and account help.` },
      ],
    },
    {
      id: "cta",
      kind: "cta",
      eyebrow: "Next step",
      title: `Give ${input.name} a focused launch page today`,
      body: `Publish the page, test the offer with real visitors, and use the editor to improve the message as you learn what converts.`,
      items: [],
    },
  ];

  return {
    id: crypto.randomUUID(),
    slug,
    ownerEmail: input.ownerEmail,
    tier: input.tier,
    status: "draft",
    name: input.name,
    industry: input.industry,
    offer: input.offer,
    audience: input.audience,
    tone: input.tone,
    palette: input.palette,
    primaryCta: "Start now",
    secondaryCta: "See plans",
    contactEmail: input.contactEmail,
    legalName: input.legalName,
    sections,
    seoTitle: `${input.name} | ${input.offer}`,
    seoDescription: `${input.name} helps ${input.audience} ${input.offer}. Explore the offer, pricing, FAQs, and contact options on one focused page.`,
    createdAt: now,
    updatedAt: now,
  };
}

function uniqueSlug(name: string): string {
  const base = slugify(name).slice(0, 42) || "site";
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}
