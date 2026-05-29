/**
 * AdSense ad-unit slot IDs, sourced from env so real units created in the
 * AdSense dashboard can be wired in without code changes.
 *
 * Until a real slot ID is set (e.g. NEXT_PUBLIC_AD_SLOT_HOME in wrangler.toml
 * [vars]), the value is empty and <AdUnit> renders nothing in production
 * instead of emitting an invalid ad request. The site-wide AdSense
 * verification script still loads, so account/site approval is unaffected.
 */
export const AD_SLOTS = {
  /** Homepage, between sections. */
  home: process.env.NEXT_PUBLIC_AD_SLOT_HOME ?? "",
  /** List/feed pages (guides index, blog index). */
  feed: process.env.NEXT_PUBLIC_AD_SLOT_FEED ?? "",
  /** In-article (guides, blog posts). */
  article: process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE ?? "",
  /** Features page. */
  features: process.env.NEXT_PUBLIC_AD_SLOT_FEATURES ?? "",
  /** FAQ page. */
  faq: process.env.NEXT_PUBLIC_AD_SLOT_FAQ ?? "",
} as const;
