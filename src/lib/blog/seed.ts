import type { BlogPost } from "./types";

/**
 * Bundled seed posts. They guarantee the blog is never empty (good for SEO and
 * AdSense review) and act as the editorial baseline. Generated posts are layered
 * on top from KV at runtime.
 */
export const SEED_POSTS: BlogPost[] = [
  {
    slug: "google-play-2026-policy-roundup",
    title: "Google Play in 2026: The Policy Changes That Actually Affect Your Launch",
    excerpt:
      "Target API 35, the 12-tester rule, tightened data-safety enforcement, and account deletion — the changes most likely to get a 2026 submission rejected, and how to stay clear.",
    category: "Policy Updates",
    tags: ["google play", "policy", "2026", "compliance"],
    author: "Playstore Wizard Editorial",
    readingTimeMin: 6,
    publishedAt: "2026-05-20",
    updatedAt: "2026-05-20",
    source: "seed",
    body: `Google ships dozens of policy updates a year, but only a handful change what you must do before you can hit "submit." Here are the ones that matter most for a 2026 launch.

## Target API level 35 is now mandatory

Every new app and every update must target Android 15 (API level 35). Submissions below that threshold are rejected at upload. If your Gradle config still points at an older compile or target SDK, fix it before anything else — no listing work matters until the bundle is accepted.

## The 12-tester, 14-day rule still bites new accounts

Personal developer accounts created after November 2023 must run a closed test with at least 12 testers for 14 continuous days before requesting production access. Plan for this early; it is the single biggest cause of "why can't I publish?" support tickets.

## Data safety enforcement got stricter

Google now cross-checks your declared data collection against the SDKs detected in your bundle. A mismatch — declaring "no data collected" while bundling an analytics SDK — is a fast rejection. Declare every SDK that touches user data, including crash reporters.

## Account deletion is non-negotiable for accounts apps

If your app lets users create an account, you must provide an in-app and web path to request account and data deletion. Missing this is a common last-minute blocker.

## How to stay clear

Run a full compliance pass before you build your store listing. Fixing a bundle-level issue after you've written descriptions and uploaded screenshots wastes the most time. Playstore Wizard checks all of the above automatically before you submit.`,
  },
  {
    slug: "store-listing-conversion-checklist",
    title: "The Store Listing Conversion Checklist: Turning Impressions Into Installs",
    excerpt:
      "Your install rate is decided in the first three seconds. A field-by-field checklist for the icon, first two screenshots, and short description that move the needle.",
    category: "Listing & ASO",
    tags: ["aso", "store listing", "conversion", "screenshots"],
    author: "Playstore Wizard Editorial",
    readingTimeMin: 5,
    publishedAt: "2026-05-22",
    updatedAt: "2026-05-22",
    source: "seed",
    body: `Most developers obsess over keywords and ignore the assets that actually convert a browser into an installer. Ranking gets you the impression; the listing earns the install.

## The icon does more work than the title

On a crowded results page, the icon is the first and often only thing a user evaluates. Keep it simple, high-contrast, and legible at 48px. Avoid text inside the icon — it turns to mush at small sizes.

## The first two screenshots decide everything

Google shows the first two or three screenshots inline. Treat them as a billboard, not a gallery. Lead with your single strongest benefit, captioned in plain language. Save the feature tour for screenshots four through eight.

## Write the short description for a skimmer

The 80-character short description appears above the fold. State what the app does and who it's for — not a slogan. "Track workouts and see your progress" beats "Your fitness journey starts here."

## Localize the assets, not just the text

A translated description with English screenshots converts poorly. If a market matters, localize the captions inside the screenshots too.

## Measure, then iterate

Use Play Console's store listing experiments to A/B test the icon and first screenshot. Conversion lifts of 15–30% from a single asset swap are common.`,
  },
  {
    slug: "play-billing-fees-what-you-keep",
    title: "Play Billing Fees in 2026: What You Actually Keep",
    excerpt:
      "Service fee tiers, the 15% small-business rate, alternative billing, and the math that decides whether a subscription or one-time purchase nets you more.",
    category: "Monetization",
    tags: ["play billing", "fees", "monetization", "subscriptions"],
    author: "Playstore Wizard Editorial",
    readingTimeMin: 5,
    publishedAt: "2026-05-25",
    updatedAt: "2026-05-25",
    source: "seed",
    body: `Before you price anything, you need to know what Google keeps. The headline "30%" is rarely the number that applies to you.

## The 15% small-business rate

Through the Play Console small-business program, your first $1M in annual revenue is charged a 15% service fee, not 30%. Most independent developers never cross that threshold, so 15% is the rate to plan around.

## Subscriptions are 15% after the program

Auto-renewing subscriptions are charged 15% once enrolled in the relevant programs, making recurring revenue meaningfully cheaper to operate than one-time purchases at the standard rate.

## Alternative billing changes the math

In eligible regions, offering an alternative billing system reduces Google's fee by a few points — but you take on payment processing, fraud, and support costs. For most small developers the net is a wash; only scale makes it worth the operational burden.

## Run the real net calculation

Decide pricing on net revenue per user, not list price. A $4.99 subscription at 15% nets more over a year than a $9.99 one-time purchase at 30% for any user who stays more than four months. Playstore Wizard's pricing recommender runs this comparison for your category automatically.`,
  },
];
