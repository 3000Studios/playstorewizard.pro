/**
 * Google Play Store compliance rules — current as of 2026-05.
 * Source citations are in the `source` field on each rule for the wizard's
 * "why does this matter?" tooltips.
 *
 * When Google changes a rule, update only this file and every check downstream
 * picks it up. The wizard surfaces violations in real time as the user fills
 * out each step.
 */

export type RuleSeverity = "blocker" | "warning" | "info";

export type RuleCategory =
  | "technical"      // SDK levels, ABI support, bundle format
  | "testing"        // closed/open/production track requirements
  | "policy"         // Play policy — data safety, account deletion, etc.
  | "metadata"       // store listing requirements
  | "monetization"   // billing, subscriptions, IAP rules
  | "audience";      // target audience, families program

export interface ComplianceRule {
  id: string;
  category: RuleCategory;
  severity: RuleSeverity;
  title: string;
  /** Plain-English explanation shown to the user. */
  description: string;
  /** Plain-English fix instruction. */
  fix: string;
  /** Official Google documentation URL. */
  source: string;
  /** Effective date if applicable (ISO YYYY-MM-DD). */
  effectiveDate?: string;
  /** Applies only if this returns true. */
  appliesIf?: (ctx: ComplianceContext) => boolean;
}

/**
 * Snapshot of wizard state that compliance rules check against.
 * Keep this minimal — only the fields rules actually need.
 */
export interface ComplianceContext {
  // From bundle parse
  targetSdk?: number;
  minSdk?: number;
  bundleFormat?: "aab" | "apk";
  hasSixteenKbPageSupport?: boolean;

  // From account info
  accountType: "personal" | "organization";
  accountCreatedDate?: string; // ISO
  isFirstApp: boolean;

  // From listing
  appName: string;
  shortDescription: string;
  fullDescription: string;
  hasFeatureGraphic: boolean;
  screenshotCount: number;

  // From data safety
  collectsData: boolean;
  sharesData: boolean;
  hasPrivacyPolicyUrl: boolean;
  privacyPolicyAccessible?: boolean;

  // From app config
  allowsAccountCreation: boolean;
  hasInAppAccountDeletion: boolean;

  // From audience
  targetsChildren: boolean;
  inFamiliesProgram: boolean;

  // From monetization
  hasInAppPurchases: boolean;
  hasSubscriptions: boolean;

  // Sensitive permissions declared in manifest
  declaredPermissions: string[];

  // Track being released to
  targetTrack: "internal" | "closed" | "open" | "production";

  // Closed testing state (for new personal accounts targeting production)
  closedTestTesterCount?: number;
  closedTestDaysActive?: number;
}

// ---------------------------------------------------------------------
// THE RULES
// ---------------------------------------------------------------------

export const COMPLIANCE_RULES: ComplianceRule[] = [
  // ===== TECHNICAL =====
  {
    id: "target-sdk-android-15",
    category: "technical",
    severity: "blocker",
    title: "Target Android 15 (API level 35) or higher",
    description:
      "Every new app and update submitted to Google Play must target Android 15 (API 35) or higher. Apps targeting older versions are rejected at submission.",
    fix: "Open your build.gradle (or build.gradle.kts) and set targetSdk to 35. Also update compileSdk to 35. Rebuild your AAB.",
    source: "https://developer.android.com/google/play/requirements/target-sdk",
    effectiveDate: "2025-08-31",
    appliesIf: (c) => (c.targetSdk ?? 0) < 35,
  },
  {
    id: "target-sdk-android-16",
    category: "technical",
    severity: "warning",
    title: "Plan to target Android 16 (API 36) by August 2026",
    description:
      "As of August 31, 2026, new apps and updates must target Android 16 (API 36) or higher. Update soon to avoid being blocked from submitting.",
    fix: "Bump targetSdk and compileSdk to 36 in your build.gradle when Android 16 SDK is available. Test thoroughly — runtime behavior changes at every SDK bump.",
    source: "https://developer.android.com/google/play/requirements/target-sdk",
    effectiveDate: "2026-08-31",
    appliesIf: (c) => (c.targetSdk ?? 0) >= 35 && (c.targetSdk ?? 0) < 36,
  },
  {
    id: "use-aab-not-apk",
    category: "technical",
    severity: "blocker",
    title: "Submit an Android App Bundle (AAB), not an APK",
    description:
      "Google Play has required the AAB format for all new apps since August 2021. APKs are no longer accepted for new app submissions.",
    fix: "In Android Studio: Build > Generate Signed Bundle/APK > select 'Android App Bundle'. Upload the resulting .aab file.",
    source: "https://developer.android.com/guide/app-bundle",
    appliesIf: (c) => c.bundleFormat === "apk",
  },
  {
    id: "sixteen-kb-page-size",
    category: "technical",
    severity: "warning",
    title: "Support 16 KB memory page sizes",
    description:
      "Android 15+ devices increasingly use 16 KB memory pages. Apps with native libraries (NDK) must be rebuilt with 16 KB support or they will crash on these devices.",
    fix: "If your app has no native code (.so files), you're already fine. If it does, rebuild with NDK r27+ and verify with the 16 KB alignment check.",
    source: "https://developer.android.com/guide/practices/page-sizes",
    appliesIf: (c) => c.hasSixteenKbPageSupport === false,
  },

  // ===== TESTING =====
  {
    id: "closed-test-12-testers",
    category: "testing",
    severity: "blocker",
    title: "12 testers opted-in for 14 consecutive days",
    description:
      "New personal developer accounts (created after November 13, 2023) must run a closed test with at least 12 testers opted-in for 14 consecutive days before applying for production access. Organization accounts are exempt.",
    fix: "Create a closed testing track in Play Console. Add 12+ testers' Gmail addresses. Share the opt-in link. Wait 14 full days from when you have 12 testers active. Then apply for production access.",
    source: "https://support.google.com/googleplay/android-developer/answer/14151465",
    appliesIf: (c) =>
      c.accountType === "personal" &&
      c.targetTrack === "production" &&
      c.isFirstApp &&
      // Personal accounts created after Nov 13 2023 are subject
      (c.accountCreatedDate === undefined ||
        new Date(c.accountCreatedDate) >= new Date("2023-11-13")) &&
      ((c.closedTestTesterCount ?? 0) < 12 || (c.closedTestDaysActive ?? 0) < 14),
  },
  {
    id: "internal-test-recommended",
    category: "testing",
    severity: "info",
    title: "Run internal testing first",
    description:
      "Internal testing lets you distribute to up to 100 trusted testers instantly, with no review wait. Use it to catch crashes before paying the cost of the closed-testing review cycle.",
    fix: "In Play Console, go to Testing > Internal testing. Upload your AAB. Add your own email and a few teammates. Test for at least an hour on real devices before promoting to closed testing.",
    source: "https://support.google.com/googleplay/android-developer/answer/9845334",
  },

  // ===== POLICY =====
  {
    id: "data-safety-declaration",
    category: "policy",
    severity: "blocker",
    title: "Complete the Data Safety form",
    description:
      "Every app on Google Play must declare what user data it collects, what it shares, and what security practices it follows. Submissions are blocked without this form completed.",
    fix: "The wizard's Data Safety step will walk you through every required answer. Complete it before submitting.",
    source: "https://support.google.com/googleplay/android-developer/answer/10787469",
  },
  {
    id: "privacy-policy-url",
    category: "policy",
    severity: "blocker",
    title: "Privacy policy URL is required",
    description:
      "If your app collects any personal or sensitive user data, you must provide a publicly accessible privacy policy URL. The URL must remain live — Google reviewers will check it.",
    fix: "Use the wizard's Privacy Policy step to generate one, or paste a URL to your existing policy. Host it on your domain, GitHub Pages, or any free static host.",
    source: "https://support.google.com/googleplay/android-developer/answer/9859455",
    appliesIf: (c) => c.collectsData && !c.hasPrivacyPolicyUrl,
  },
  {
    id: "privacy-policy-reachable",
    category: "policy",
    severity: "blocker",
    title: "Privacy policy URL must load successfully",
    description:
      "The privacy policy URL you provided returns an error or is not publicly reachable. Reviewers will reject the app if they cannot open it.",
    fix: "Verify the URL loads in a fresh browser session (no login needed). If you used a GitHub Gist or Google Doc, switch to a static URL like a GitHub Pages site, a Cloudflare Pages site, or a section of your own domain.",
    source: "https://support.google.com/googleplay/android-developer/answer/9859455",
    appliesIf: (c) => c.hasPrivacyPolicyUrl && c.privacyPolicyAccessible === false,
  },
  {
    id: "account-deletion-required",
    category: "policy",
    severity: "blocker",
    title: "In-app account deletion is required",
    description:
      "Any app that lets users create an account must also let them delete that account and their data, from within the app itself. A web link is not enough.",
    fix: "Add an account deletion option in your app's settings or profile screen. It must be discoverable without leaving the app. Also offer a web-based deletion option for users who can no longer access the app.",
    source: "https://support.google.com/googleplay/android-developer/answer/13327111",
    appliesIf: (c) => c.allowsAccountCreation && !c.hasInAppAccountDeletion,
  },
  {
    id: "sensitive-permissions-justification",
    category: "policy",
    severity: "warning",
    title: "Justify sensitive permissions",
    description:
      "Permissions like background location, SMS access, contacts, and accessibility services trigger extra review. You must justify each one in your app description and in-app prompts.",
    fix: "Either remove the permission from your manifest if you don't truly need it, or be prepared to explain (in the listing AND inside the app) exactly why each is needed before you ask the user for it.",
    source: "https://support.google.com/googleplay/android-developer/answer/9888170",
    appliesIf: (c) => {
      const sensitive = [
        "android.permission.ACCESS_BACKGROUND_LOCATION",
        "android.permission.READ_SMS",
        "android.permission.SEND_SMS",
        "android.permission.RECEIVE_SMS",
        "android.permission.READ_CALL_LOG",
        "android.permission.WRITE_CALL_LOG",
        "android.permission.READ_CONTACTS",
        "android.permission.BIND_ACCESSIBILITY_SERVICE",
        "android.permission.PACKAGE_USAGE_STATS",
      ];
      return c.declaredPermissions.some((p) => sensitive.includes(p));
    },
  },

  // ===== METADATA =====
  {
    id: "app-name-length",
    category: "metadata",
    severity: "blocker",
    title: "App name must be 30 characters or fewer",
    description:
      "Google enforces a 30-character maximum on the app name shown on your store listing.",
    fix: "Shorten the app name. Save subtitles, slogans, or feature lists for the short description.",
    source: "https://support.google.com/googleplay/android-developer/answer/9866151",
    appliesIf: (c) => c.appName.length > 30,
  },
  {
    id: "short-description-required",
    category: "metadata",
    severity: "blocker",
    title: "Short description is required (up to 80 chars)",
    description:
      "Every store listing needs a short description. This is the first text users see in the Play Store. Maximum 80 characters.",
    fix: "Use the wizard's Listing step to write or AI-generate one. Lead with the user benefit, not the feature list.",
    source: "https://support.google.com/googleplay/android-developer/answer/9866151",
    appliesIf: (c) => c.shortDescription.trim().length === 0,
  },
  {
    id: "full-description-required",
    category: "metadata",
    severity: "blocker",
    title: "Full description is required (up to 4000 chars)",
    description:
      "Every store listing needs a full description. Aim for 1000-3000 characters with clear paragraphs and concrete benefits. Keyword-stuffed listings get rejected.",
    fix: "Use the wizard's Listing step. AI generation produces a clean, keyword-balanced description from a one-sentence pitch.",
    source: "https://support.google.com/googleplay/android-developer/answer/9866151",
    appliesIf: (c) => c.fullDescription.trim().length === 0,
  },
  {
    id: "feature-graphic-required",
    category: "metadata",
    severity: "blocker",
    title: "Feature graphic is required (1024×500 px)",
    description:
      "Every store listing needs a feature graphic. It appears at the top of your store page and in promotional placements.",
    fix: "Use the wizard's Assets step to upload one image — it will auto-generate the feature graphic if you don't have one ready.",
    source: "https://support.google.com/googleplay/android-developer/answer/9866151",
    appliesIf: (c) => !c.hasFeatureGraphic,
  },
  {
    id: "screenshots-minimum",
    category: "metadata",
    severity: "blocker",
    title: "At least 2 phone screenshots are required",
    description:
      "Phone screenshots are required for every store listing. Tablet screenshots are also required if your app supports tablets.",
    fix: "Use the wizard's Assets step. Upload screenshots once and the resizer auto-pads them to every required dimension.",
    source: "https://support.google.com/googleplay/android-developer/answer/9866151",
    appliesIf: (c) => c.screenshotCount < 2,
  },

  // ===== MONETIZATION =====
  {
    id: "use-play-billing-for-digital-goods",
    category: "monetization",
    severity: "blocker",
    title: "Use Google Play Billing for in-app digital goods",
    description:
      "If your app sells digital content, features, subscriptions, or in-game items, you must use Google Play Billing (or now, an approved alternative billing system in some regions).",
    fix: "Integrate Google Play Billing Library. Physical goods and services consumed outside the app are exempt — you can use any payment method for those.",
    source: "https://support.google.com/googleplay/android-developer/answer/9858738",
    appliesIf: (c) => c.hasInAppPurchases || c.hasSubscriptions,
  },
  {
    id: "subscription-disclosure",
    category: "monetization",
    severity: "warning",
    title: "Disclose subscription price, term, and renewal clearly",
    description:
      "Subscription apps must clearly state the price, billing period, what's included, and that the subscription auto-renews — all before the user pays.",
    fix: "Show the price and billing frequency on your paywall screen. Use clear language: 'Then $9.99/month. Cancel anytime.' Repeat this in your store listing.",
    source: "https://support.google.com/googleplay/android-developer/answer/9858738",
    appliesIf: (c) => c.hasSubscriptions,
  },

  // ===== AUDIENCE =====
  {
    id: "families-policy-extra-rules",
    category: "audience",
    severity: "warning",
    title: "Families Policy applies — extra requirements",
    description:
      "Apps targeting children under 13 (or in the Designed for Families program) must follow stricter rules: no third-party ads with behavioral targeting, no data collection without parental consent, certified ad SDKs only.",
    fix: "Read the Families Policy in full before submitting. Remove any ad networks not on the certified list. Implement parental consent flows if collecting any data.",
    source: "https://support.google.com/googleplay/android-developer/answer/9893335",
    appliesIf: (c) => c.targetsChildren || c.inFamiliesProgram,
  },
];

// ---------------------------------------------------------------------
// Helpers consumed by the checker
// ---------------------------------------------------------------------

export function getRulesByCategory(category: RuleCategory): ComplianceRule[] {
  return COMPLIANCE_RULES.filter((r) => r.category === category);
}

export function getRuleById(id: string): ComplianceRule | undefined {
  return COMPLIANCE_RULES.find((r) => r.id === id);
}
