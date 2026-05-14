/**
 * Google Play service fee calculator and revenue projection engine.
 *
 * Two fee regimes are supported:
 *
 *  1. Current (until June 30, 2026 in US/UK/EEA; later for other regions):
 *     - 15% on the first $1M/year of paid app sales and in-app purchases
 *     - 30% above $1M/year
 *     - 15% on all subscription revenue from day one
 *
 *  2. Post-June-2026 (announced March 4, 2026, rolling out US/UK/EEA first):
 *     - 20% base on in-app purchases for new installs
 *     - 10% on recurring subscriptions
 *     - 15% via the Apps Experience or Games Level Up programs
 *     - Optional 5% Play Billing fee on top, skippable with alternative billing
 *
 * Sources:
 *  - https://support.google.com/googleplay/android-developer/answer/112622
 *  - https://support.google.com/googleplay/android-developer/answer/10632485
 *  - https://support.google.com/googleplay/android-developer/answer/16954621
 */

export type FeeRegime = "current" | "post-june-2026";

export type MonetizationModel =
  | "free"               // free app, no IAP — 0% fee
  | "paid-up-front"      // one-time download charge
  | "iap"                // free download, in-app purchases
  | "subscription"       // recurring subscription
  | "hybrid";            // mix

export type Region = "us" | "uk" | "eea" | "australia" | "korea" | "japan" | "rest-of-world";

export interface FeeCalcInput {
  regime: FeeRegime;
  monetization: MonetizationModel;
  /** Annual gross revenue from Play before fees (USD). */
  annualGrossUsd: number;
  /** True if the developer is enrolled in Apps Experience or Games Level Up. */
  inExperienceProgram?: boolean;
  /** True if using alternative billing (skips the 5% Play Billing fee post-June-2026; saves 4% under current regime in some markets). */
  usesAlternativeBilling?: boolean;
}

export interface FeeBreakdown {
  /** Effective service fee percentage applied. */
  effectiveServiceFeePct: number;
  /** Effective Play Billing fee percentage (0 if not applicable). */
  effectiveBillingFeePct: number;
  /** Total combined fee percentage. */
  totalFeePct: number;
  /** Google's cut in USD on the input revenue. */
  googleCutUsd: number;
  /** Your take-home revenue in USD. */
  netRevenueUsd: number;
  /** Human-readable explanation rendered in the UI. */
  explanation: string;
}

// ---------------------------------------------------------------------
// Current regime (pre-June-2026)
// ---------------------------------------------------------------------
function calcCurrent(input: FeeCalcInput): FeeBreakdown {
  const { monetization, annualGrossUsd, usesAlternativeBilling } = input;

  if (monetization === "free" || annualGrossUsd <= 0) {
    return {
      effectiveServiceFeePct: 0,
      effectiveBillingFeePct: 0,
      totalFeePct: 0,
      googleCutUsd: 0,
      netRevenueUsd: annualGrossUsd,
      explanation: "Free apps without paid features pay no service fee. 97% of Play developers are in this bucket.",
    };
  }

  // Subscriptions: 15% from day one, regardless of revenue.
  if (monetization === "subscription") {
    const pct = usesAlternativeBilling ? 11 : 15;
    const cut = annualGrossUsd * (pct / 100);
    return {
      effectiveServiceFeePct: pct,
      effectiveBillingFeePct: 0,
      totalFeePct: pct,
      googleCutUsd: cut,
      netRevenueUsd: annualGrossUsd - cut,
      explanation: usesAlternativeBilling
        ? "Subscriptions: 15% normally, reduced by 4% (to 11%) when using approved alternative billing in markets where it's allowed."
        : "Subscriptions: flat 15% from day one regardless of total revenue.",
    };
  }

  // Paid apps + IAP + hybrid: tiered 15% under $1M, 30% above.
  const FIRST_TIER_LIMIT = 1_000_000;
  const firstTierRevenue = Math.min(annualGrossUsd, FIRST_TIER_LIMIT);
  const secondTierRevenue = Math.max(0, annualGrossUsd - FIRST_TIER_LIMIT);

  const firstTierRate = usesAlternativeBilling ? 0.11 : 0.15;
  const secondTierRate = usesAlternativeBilling ? 0.26 : 0.30;

  const cut = firstTierRevenue * firstTierRate + secondTierRevenue * secondTierRate;
  const effectivePct = annualGrossUsd > 0 ? (cut / annualGrossUsd) * 100 : 0;

  let explanation: string;
  if (annualGrossUsd <= FIRST_TIER_LIMIT) {
    explanation = usesAlternativeBilling
      ? "Under $1M/year via alternative billing: 11% (15% normal rate minus 4% billing-fee reduction)."
      : "Under $1M/year: 15% service fee on every transaction.";
  } else {
    explanation = usesAlternativeBilling
      ? `Over $1M/year via alternative billing: 11% on the first $1M, 26% on the rest. Effective blended rate: ${effectivePct.toFixed(1)}%.`
      : `Over $1M/year: 15% on the first $1M, 30% on the rest. Effective blended rate: ${effectivePct.toFixed(1)}%.`;
  }

  return {
    effectiveServiceFeePct: effectivePct,
    effectiveBillingFeePct: 0,
    totalFeePct: effectivePct,
    googleCutUsd: cut,
    netRevenueUsd: annualGrossUsd - cut,
    explanation,
  };
}

// ---------------------------------------------------------------------
// Post-June-2026 regime
// ---------------------------------------------------------------------
function calcPostJune2026(input: FeeCalcInput): FeeBreakdown {
  const { monetization, annualGrossUsd, inExperienceProgram, usesAlternativeBilling } = input;

  if (monetization === "free" || annualGrossUsd <= 0) {
    return {
      effectiveServiceFeePct: 0,
      effectiveBillingFeePct: 0,
      totalFeePct: 0,
      googleCutUsd: 0,
      netRevenueUsd: annualGrossUsd,
      explanation: "Free apps without paid features still pay no service fee.",
    };
  }

  // Subscriptions drop to 10%.
  if (monetization === "subscription") {
    const servicePct = 10;
    const billingPct = usesAlternativeBilling ? 0 : 5;
    const totalPct = servicePct + billingPct;
    const cut = annualGrossUsd * (totalPct / 100);
    return {
      effectiveServiceFeePct: servicePct,
      effectiveBillingFeePct: billingPct,
      totalFeePct: totalPct,
      googleCutUsd: cut,
      netRevenueUsd: annualGrossUsd - cut,
      explanation: usesAlternativeBilling
        ? "Subscriptions: 10% service fee with your own billing — total 10%."
        : "Subscriptions: 10% service fee plus optional 5% Play Billing fee — total 15%.",
    };
  }

  // IAP, paid-up-front, hybrid: 20% base, 15% if in Experience Program.
  const servicePct = inExperienceProgram ? 15 : 20;
  const billingPct = usesAlternativeBilling ? 0 : 5;
  const totalPct = servicePct + billingPct;
  const cut = annualGrossUsd * (totalPct / 100);

  const programNote = inExperienceProgram
    ? "You're in the Apps Experience / Games Level Up Program — 15% service fee."
    : "Default service fee for in-app purchases. Join the Apps Experience Program to drop to 15%.";
  const billingNote = usesAlternativeBilling
    ? "Using your own payment processor — no Play Billing fee."
    : "Using Google Play Billing — 5% billing fee on top.";

  return {
    effectiveServiceFeePct: servicePct,
    effectiveBillingFeePct: billingPct,
    totalFeePct: totalPct,
    googleCutUsd: cut,
    netRevenueUsd: annualGrossUsd - cut,
    explanation: `${programNote} ${billingNote} Combined: ${totalPct}%.`,
  };
}

export function calculateFees(input: FeeCalcInput): FeeBreakdown {
  return input.regime === "current" ? calcCurrent(input) : calcPostJune2026(input);
}

/**
 * Regional rollout schedule for the new fee structure.
 * Returns which regime applies in a given region on a given date.
 */
export function regimeForRegion(region: Region, asOf: Date = new Date()): FeeRegime {
  const rolloutDates: Record<Region, string> = {
    us: "2026-06-30",
    uk: "2026-06-30",
    eea: "2026-06-30",
    australia: "2026-09-30",
    korea: "2026-12-31",
    japan: "2026-12-31",
    "rest-of-world": "2027-09-30",
  };
  return asOf >= new Date(rolloutDates[region]) ? "post-june-2026" : "current";
}

// ---------------------------------------------------------------------
// Price recommender
// ---------------------------------------------------------------------

export type AppCategory =
  | "productivity" | "tools" | "education" | "health-fitness"
  | "finance" | "lifestyle" | "photography" | "communication"
  | "social" | "entertainment" | "music" | "video"
  | "books" | "news" | "shopping" | "travel"
  | "weather" | "business" | "games-casual" | "games-puzzle"
  | "games-action" | "games-rpg" | "games-strategy" | "games-other";

export interface PriceRecommenderInput {
  category: AppCategory;
  /** 1-5: how unique/differentiated is your app? */
  uniqueness: 1 | 2 | 3 | 4 | 5;
  /** 1-5: how much ongoing value (vs one-time utility)? */
  ongoingValue: 1 | 2 | 3 | 4 | 5;
  monetization: MonetizationModel;
  /** Estimated monthly active downloads in the first 12 months. */
  expectedMonthlyDownloads?: number;
}

export interface PriceRecommendation {
  monetizationModel: MonetizationModel;
  /** Suggested price point in USD. */
  suggestedPriceUsd: number;
  /** Alternative price points to A/B test. */
  alternatives: number[];
  /** Plain-English rationale. */
  rationale: string;
  /** Comparable apps that hit this price band (illustrative, not specific apps). */
  benchmarkRange: { min: number; max: number };
  /** Expected first-year gross revenue assuming the input downloads. */
  expectedYearOneGrossUsd?: number;
  /** Expected take-home after Google's cut, current regime. */
  expectedYearOneNetUsd?: number;
}

// Category-level price benchmarks. Numbers reflect typical paid/subscription
// pricing observed on the Play Store. Adjust here as the market shifts.
const CATEGORY_BENCHMARKS: Record<AppCategory, { paidMin: number; paidMax: number; subMin: number; subMax: number }> = {
  "productivity":     { paidMin: 2.99, paidMax: 9.99,  subMin: 4.99,  subMax: 14.99 },
  "tools":            { paidMin: 0.99, paidMax: 4.99,  subMin: 2.99,  subMax: 9.99  },
  "education":        { paidMin: 1.99, paidMax: 14.99, subMin: 4.99,  subMax: 19.99 },
  "health-fitness":   { paidMin: 2.99, paidMax: 9.99,  subMin: 9.99,  subMax: 29.99 },
  "finance":          { paidMin: 0,    paidMax: 0,     subMin: 4.99,  subMax: 19.99 }, // overwhelmingly subscription
  "lifestyle":        { paidMin: 1.99, paidMax: 4.99,  subMin: 4.99,  subMax: 14.99 },
  "photography":      { paidMin: 2.99, paidMax: 9.99,  subMin: 4.99,  subMax: 14.99 },
  "communication":    { paidMin: 0,    paidMax: 4.99,  subMin: 2.99,  subMax: 9.99  },
  "social":           { paidMin: 0,    paidMax: 0,     subMin: 2.99,  subMax: 9.99  },
  "entertainment":    { paidMin: 0.99, paidMax: 4.99,  subMin: 4.99,  subMax: 14.99 },
  "music":            { paidMin: 0,    paidMax: 4.99,  subMin: 4.99,  subMax: 14.99 },
  "video":            { paidMin: 0,    paidMax: 4.99,  subMin: 6.99,  subMax: 17.99 },
  "books":            { paidMin: 0,    paidMax: 4.99,  subMin: 4.99,  subMax: 14.99 },
  "news":             { paidMin: 0,    paidMax: 0,     subMin: 2.99,  subMax: 14.99 },
  "shopping":         { paidMin: 0,    paidMax: 0,     subMin: 0,     subMax: 0     }, // free + IAP only
  "travel":           { paidMin: 0.99, paidMax: 4.99,  subMin: 0,     subMax: 0     },
  "weather":          { paidMin: 0.99, paidMax: 4.99,  subMin: 1.99,  subMax: 4.99  },
  "business":         { paidMin: 4.99, paidMax: 19.99, subMin: 9.99,  subMax: 49.99 },
  "games-casual":     { paidMin: 0.99, paidMax: 2.99,  subMin: 0,     subMax: 0     },
  "games-puzzle":     { paidMin: 0.99, paidMax: 4.99,  subMin: 2.99,  subMax: 9.99  },
  "games-action":     { paidMin: 0.99, paidMax: 6.99,  subMin: 0,     subMax: 0     },
  "games-rpg":        { paidMin: 4.99, paidMax: 14.99, subMin: 0,     subMax: 0     },
  "games-strategy":   { paidMin: 1.99, paidMax: 9.99,  subMin: 0,     subMax: 0     },
  "games-other":      { paidMin: 0.99, paidMax: 4.99,  subMin: 0,     subMax: 0     },
};

export function recommendPrice(input: PriceRecommenderInput): PriceRecommendation {
  const bench = CATEGORY_BENCHMARKS[input.category];
  const isSubscription = input.monetization === "subscription";

  if (input.monetization === "free") {
    return {
      monetizationModel: "free",
      suggestedPriceUsd: 0,
      alternatives: [],
      rationale:
        "Free apps with no paid features dominate downloads. Plan a monetization route (IAP, subscription, or paid up-front) once you have validated audience interest.",
      benchmarkRange: { min: 0, max: 0 },
    };
  }

  const min = isSubscription ? bench.subMin : bench.paidMin;
  const max = isSubscription ? bench.subMax : bench.paidMax;

  if (min === 0 && max === 0) {
    return {
      monetizationModel: input.monetization,
      suggestedPriceUsd: 0,
      alternatives: [],
      rationale: `${input.category} apps overwhelmingly use a different monetization model. Consider switching strategy.`,
      benchmarkRange: { min, max },
    };
  }

  // Position within the band by uniqueness + ongoing value.
  // Score 2-10 maps to 0%-100% of the band.
  const score = input.uniqueness + input.ongoingValue;
  const bandPosition = Math.max(0, Math.min(1, (score - 2) / 8));
  const raw = min + (max - min) * bandPosition;

  // Snap to a common psychological price point.
  const suggested = snapToPricePoint(raw);
  const alternatives = [
    snapToPricePoint(raw * 0.7),
    snapToPricePoint(raw * 1.3),
  ].filter((p) => p !== suggested && p > 0);

  // Revenue projection.
  let yearGross: number | undefined;
  let yearNet: number | undefined;
  if (input.expectedMonthlyDownloads && input.expectedMonthlyDownloads > 0) {
    if (isSubscription) {
      // Subscription revenue projection: monthly downloads * 12 months
      // with a conversion-to-paid assumption of 3% (a common indie baseline)
      // and average sub lifetime of 4 months.
      const yearlyConverted = input.expectedMonthlyDownloads * 12 * 0.03;
      yearGross = yearlyConverted * suggested * 4;
    } else {
      // Paid up-front: monthly downloads * 12 * price
      // Use 80% of expected downloads since not every install pays
      yearGross = input.expectedMonthlyDownloads * 12 * suggested * 0.8;
    }
    const breakdown = calculateFees({
      regime: "current",
      monetization: input.monetization,
      annualGrossUsd: yearGross,
    });
    yearNet = breakdown.netRevenueUsd;
  }

  return {
    monetizationModel: input.monetization,
    suggestedPriceUsd: suggested,
    alternatives,
    rationale: buildPriceRationale(input, suggested, min, max, score),
    benchmarkRange: { min, max },
    expectedYearOneGrossUsd: yearGross,
    expectedYearOneNetUsd: yearNet,
  };
}

function snapToPricePoint(raw: number): number {
  const tiers = [0.99, 1.99, 2.99, 3.99, 4.99, 5.99, 6.99, 7.99, 8.99, 9.99, 14.99, 19.99, 24.99, 29.99, 39.99, 49.99];
  return tiers.reduce((best, t) => (Math.abs(t - raw) < Math.abs(best - raw) ? t : best), tiers[0]);
}

function buildPriceRationale(
  input: PriceRecommenderInput,
  suggested: number,
  min: number,
  max: number,
  score: number
): string {
  const bandPos =
    suggested <= min + (max - min) / 3 ? "low end" :
    suggested >= max - (max - min) / 3 ? "premium end" : "middle";
  const sub = input.monetization === "subscription" ? "subscription" : "paid";
  return `Comparable ${input.category} ${sub} apps run $${min.toFixed(2)}–$${max.toFixed(2)}. Your uniqueness + ongoing-value score of ${score}/10 puts you at the ${bandPos} of that band. Suggested: $${suggested.toFixed(2)}.`;
}

/**
 * Quick break-even calculator. How many sales/subs to clear the $25 dev fee
 * plus any operating cost?
 */
export function breakEvenSales(
  pricePerSaleUsd: number,
  feePct: number,
  upfrontCostsUsd: number = 25
): number {
  const netPerSale = pricePerSaleUsd * (1 - feePct / 100);
  if (netPerSale <= 0) return Infinity;
  return Math.ceil(upfrontCostsUsd / netPerSale);
}
