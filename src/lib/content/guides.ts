/**
 * Central registry of all long-form guide pages.
 * Each guide has a route at /guides/<slug> with real content (AdSense-quality).
 * Used by:
 *   - /guides (index page)
 *   - app/sitemap.ts (route discovery)
 *   - header/footer link rendering
 *   - related-guide suggestions
 */

export interface GuideMeta {
  slug: string;
  title: string;
  summary: string;
  category:
    | "Compliance"
    | "Submission"
    | "Listing & ASO"
    | "Monetization"
    | "Audience";
  readingTimeMin: number;
  publishedAt: string;
  updatedAt: string;
  /** Tags for keyword discovery. */
  tags: string[];
}

export const GUIDES: GuideMeta[] = [
  {
    slug: "google-play-console-setup",
    title: "Google Play Console Setup: A First-Time Developer's Walkthrough",
    summary:
      "Every screen you'll encounter setting up a Play Console account, from the $25 fee to verifying your identity, with the right answers for each section.",
    category: "Submission",
    readingTimeMin: 9,
    publishedAt: "2026-04-01",
    updatedAt: "2026-05-13",
    tags: ["play console", "developer account", "first-time", "setup"],
  },
  {
    slug: "target-api-level-android-15",
    title: "Target API Level Requirement: Why Your AAB Needs Android 15 (API 35)",
    summary:
      "Google now rejects every new submission below API 35. Here is what the rule means, how to update your gradle file, and what's coming for Android 16 in August 2026.",
    category: "Compliance",
    readingTimeMin: 7,
    publishedAt: "2026-04-03",
    updatedAt: "2026-05-13",
    tags: ["target api", "android 15", "api 35", "android 16", "compliance"],
  },
  {
    slug: "closed-testing-12-testers-14-days",
    title: "The 12-Tester, 14-Day Rule for Personal Developer Accounts",
    summary:
      "If you signed up after November 2023, you cannot skip the closed-testing requirement. Here's exactly how to set it up, recruit testers, and survive the wait.",
    category: "Compliance",
    readingTimeMin: 11,
    publishedAt: "2026-04-05",
    updatedAt: "2026-05-13",
    tags: ["closed testing", "personal account", "testers", "production access"],
  },
  {
    slug: "data-safety-form-walkthrough",
    title: "Data Safety Form: A Plain-English Walkthrough",
    summary:
      "The form that gets the most apps rejected. Every question explained, every option translated from policy-speak, with examples from real apps.",
    category: "Compliance",
    readingTimeMin: 14,
    publishedAt: "2026-04-08",
    updatedAt: "2026-05-13",
    tags: ["data safety", "privacy", "user data", "compliance"],
  },
  {
    slug: "content-rating-iarc-guide",
    title: "Content Rating (IARC): Every Question, Decoded",
    summary:
      "The IARC questionnaire's wording is technical and unforgiving. Here's what each question really asks and how to answer accurately without inflating your rating.",
    category: "Compliance",
    readingTimeMin: 10,
    publishedAt: "2026-04-10",
    updatedAt: "2026-05-13",
    tags: ["iarc", "content rating", "esrb", "pegi"],
  },
  {
    slug: "play-billing-fees-2026",
    title: "Google Play Service Fees in 2026: The 15%, 30%, and New 20%/10% Rules",
    summary:
      "Google is restructuring fees in June 2026. Here's the current system, what's changing, and what it means for your take-home revenue.",
    category: "Monetization",
    readingTimeMin: 8,
    publishedAt: "2026-04-12",
    updatedAt: "2026-05-13",
    tags: ["fees", "monetization", "billing", "subscriptions", "iap"],
  },
  {
    slug: "store-listing-best-practices",
    title: "Writing a Store Listing That Converts: Real Examples",
    summary:
      "Title, short description, full description, screenshots — every element of a Play Store listing, with side-by-side examples of high and low performers.",
    category: "Listing & ASO",
    readingTimeMin: 12,
    publishedAt: "2026-04-15",
    updatedAt: "2026-05-13",
    tags: ["store listing", "aso", "conversion", "description"],
  },
  {
    slug: "aab-vs-apk-explained",
    title: "AAB vs APK: Why Google Forces You to Use Bundles",
    summary:
      "What an Android App Bundle is, why it's smaller than an APK, what gets stripped per device, and what to do if your build pipeline still produces APKs.",
    category: "Submission",
    readingTimeMin: 6,
    publishedAt: "2026-04-17",
    updatedAt: "2026-05-13",
    tags: ["aab", "apk", "app bundle", "bundletool"],
  },
  {
    slug: "screenshot-sizes-guide",
    title: "Play Store Screenshot Sizes: Every Required Dimension",
    summary:
      "Phone, 7-inch tablet, 10-inch tablet, Wear OS, Android TV. The exact sizes, the aspect-ratio rules, and the file-size limits — plus what to do if you only have phone screenshots.",
    category: "Listing & ASO",
    readingTimeMin: 7,
    publishedAt: "2026-04-19",
    updatedAt: "2026-05-13",
    tags: ["screenshots", "graphics", "tablet", "wear os", "android tv"],
  },
  {
    slug: "feature-graphic-design",
    title: "The 1024×500 Feature Graphic: Designing Yours Right",
    summary:
      "The banner at the top of every Play Store listing. Composition rules, safe zones, what to avoid, and how to generate one from your icon if you don't have a designer.",
    category: "Listing & ASO",
    readingTimeMin: 6,
    publishedAt: "2026-04-21",
    updatedAt: "2026-05-13",
    tags: ["feature graphic", "banner", "design", "branding"],
  },
  {
    slug: "privacy-policy-requirements",
    title: "Privacy Policy Requirements for Google Play in 2026",
    summary:
      "Where the URL must live, what it must contain, why reviewers reject yours, and how to generate one that matches your Data Safety answers.",
    category: "Compliance",
    readingTimeMin: 9,
    publishedAt: "2026-04-24",
    updatedAt: "2026-05-13",
    tags: ["privacy policy", "gdpr", "ccpa", "compliance"],
  },
  {
    slug: "account-deletion-rule",
    title: "In-App Account Deletion: The Rule That Sneaks Up On Most Devs",
    summary:
      "If your app lets users create accounts, they must be able to delete them from inside the app — not via support email. Here is how to comply without rebuilding your auth.",
    category: "Compliance",
    readingTimeMin: 7,
    publishedAt: "2026-04-26",
    updatedAt: "2026-05-13",
    tags: ["account deletion", "user data", "compliance"],
  },
  {
    slug: "families-policy-children-apps",
    title: "Families Policy: What Changes When Your App Is For Kids",
    summary:
      "Stricter ad rules, certified SDKs only, parental consent flows. A guide for developers whose apps target users under 13.",
    category: "Audience",
    readingTimeMin: 10,
    publishedAt: "2026-04-28",
    updatedAt: "2026-05-13",
    tags: ["families", "children", "coppa", "designed for families"],
  },
  {
    slug: "permissions-justification",
    title: "Justifying Sensitive Permissions: Background Location, SMS, Contacts",
    summary:
      "Permissions that trigger extra Google review and how to justify each one — in your manifest, your in-app prompts, and your store listing.",
    category: "Compliance",
    readingTimeMin: 8,
    publishedAt: "2026-04-30",
    updatedAt: "2026-05-13",
    tags: ["permissions", "background location", "sms", "accessibility"],
  },
  {
    slug: "alternative-billing-explained",
    title: "Alternative Billing on Google Play: When It Saves You 4–5%",
    summary:
      "Google now allows alternative billing systems in some markets, with a fee discount. Here's who qualifies, how it works, and whether it's worth the integration cost.",
    category: "Monetization",
    readingTimeMin: 9,
    publishedAt: "2026-05-02",
    updatedAt: "2026-05-13",
    tags: ["alternative billing", "fees", "monetization", "play billing"],
  },
];

export function getGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getRelatedGuides(slug: string, count = 3): GuideMeta[] {
  const current = getGuide(slug);
  if (!current) return GUIDES.slice(0, count);
  return GUIDES.filter((g) => g.slug !== slug && g.category === current.category)
    .slice(0, count)
    .concat(GUIDES.filter((g) => g.slug !== slug && g.category !== current.category))
    .slice(0, count);
}

export function guidesByCategory(): Map<GuideMeta["category"], GuideMeta[]> {
  const map = new Map<GuideMeta["category"], GuideMeta[]>();
  for (const g of GUIDES) {
    const list = map.get(g.category) ?? [];
    list.push(g);
    map.set(g.category, list);
  }
  return map;
}
