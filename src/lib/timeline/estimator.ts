/**
 * Realistic timeline estimator for getting an app live on Google Play.
 *
 * Numbers are based on Google's officially-stated review windows and the
 * mandatory closed-testing period that applies to personal developer accounts
 * created after 2023-11-13.
 *
 * Each `TimelineStage` has min/typical/max durations in days. The estimator
 * sums them and gives the user a calendar-date range.
 */

export interface TimelineInput {
  accountType: "personal" | "organization";
  accountCreatedDate?: string;
  isFirstApp: boolean;
  targetTrack: "internal" | "closed" | "open" | "production";
  /** Has the user already started closed testing? */
  closedTestStartedDate?: string;
  closedTestTesterCount?: number;
  /** Is this a fresh listing or an update to an existing app? */
  isUpdate: boolean;
}

export interface TimelineStage {
  id: string;
  label: string;
  /** Plain-English description shown in the timeline UI. */
  description: string;
  /** Days from when this stage starts to when it ends. */
  duration: { min: number; typical: number; max: number };
  /** Is this a hard requirement, or optional? */
  optional?: boolean;
  /** Reason the user might be in this stage longer than typical. */
  riskFactors?: string[];
}

export interface TimelineEstimate {
  stages: TimelineStage[];
  totalDays: { min: number; typical: number; max: number };
  startDate: Date;
  endDate: { min: Date; typical: Date; max: Date };
  /** Plain-English summary the UI displays prominently. */
  summary: string;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isPersonalAccountSubjectToClosedTest(input: TimelineInput): boolean {
  if (input.accountType !== "personal") return false;
  if (!input.isFirstApp) return false;
  if (!input.accountCreatedDate) return true; // assume subject if unknown
  return new Date(input.accountCreatedDate) >= new Date("2023-11-13");
}

export function estimateTimeline(input: TimelineInput, now: Date = new Date()): TimelineEstimate {
  const stages: TimelineStage[] = [];

  // ----- Stage: prep the bundle, assets, listing -----
  stages.push({
    id: "prep",
    label: "Prepare bundle, assets, and listing",
    description:
      "Build a signed AAB, generate icon and screenshots, write your store listing. This wizard cuts this from days down to under an hour.",
    duration: { min: 0, typical: 1, max: 3 },
  });

  // ----- Stage: internal testing (optional but recommended) -----
  if (input.targetTrack !== "internal") {
    stages.push({
      id: "internal-test",
      label: "Internal testing",
      description:
        "Push to internal testing first to catch crashes on real devices. Up to 100 trusted testers, available within minutes — no Google review wait.",
      duration: { min: 0, typical: 1, max: 2 },
      optional: true,
    });
  }

  // ----- Stage: closed test review (if going beyond internal) -----
  if (input.targetTrack === "closed" || input.targetTrack === "open" || input.targetTrack === "production") {
    stages.push({
      id: "closed-test-review",
      label: "Closed test review by Google",
      description:
        "Google reviews your closed-test release before testers can install. Usually about 24 hours, up to 3 days for new accounts.",
      duration: { min: 1, typical: 1, max: 3 },
      riskFactors: input.isFirstApp ? ["First app on a new account — reviews trend to the longer end"] : [],
    });
  }

  // ----- Stage: closed testing window (required for personal accounts to reach production) -----
  if (
    input.targetTrack === "production" &&
    isPersonalAccountSubjectToClosedTest(input)
  ) {
    stages.push({
      id: "closed-test-window",
      label: "14-day closed testing window",
      description:
        "Personal accounts must run a closed test with at least 12 testers continuously opted-in for 14 days before you can apply for production access. The 14-day clock only starts once you have 12 testers actively opted in.",
      duration: { min: 14, typical: 14, max: 21 },
      riskFactors: [
        "If a tester opts out and you drop below 12, the count must be rebuilt",
        "Finding 12 willing testers can take several days",
      ],
    });
  }

  // ----- Stage: open testing (optional intermediate) -----
  if (input.targetTrack === "open") {
    stages.push({
      id: "open-test-review",
      label: "Open test review",
      description:
        "Open testing makes your app discoverable on the Play Store with a 'Beta' label. Reviews follow the same window as closed.",
      duration: { min: 1, typical: 2, max: 5 },
    });
  }

  // ----- Stage: production access review -----
  if (input.targetTrack === "production") {
    if (isPersonalAccountSubjectToClosedTest(input)) {
      stages.push({
        id: "production-access-review",
        label: "Production access application review",
        description:
          "After your closed test, you apply for production access. Google reviews your testing logs, tester engagement, and app quality. Usually 7 days or less, occasionally longer.",
        duration: { min: 1, typical: 5, max: 14 },
        riskFactors: [
          "Inactive testers can cause rejection",
          "Application review can take longer if Google requests changes",
        ],
      });
    }
    stages.push({
      id: "production-rollout",
      label: "Production rollout",
      description:
        input.isUpdate
          ? "Updates roll out to users in waves over a few hours. You control the staged-rollout percentage."
          : "First-time production releases roll out worldwide over a few hours after approval.",
      duration: { min: 0, typical: 1, max: 2 },
    });
  }

  // ----- Sum durations and produce summary -----
  const totalDays = stages.reduce(
    (acc, s) => ({
      min: acc.min + s.duration.min,
      typical: acc.typical + s.duration.typical,
      max: acc.max + s.duration.max,
    }),
    { min: 0, typical: 0, max: 0 }
  );

  const startDate = now;
  const endDate = {
    min: addDays(startDate, totalDays.min),
    typical: addDays(startDate, totalDays.typical),
    max: addDays(startDate, totalDays.max),
  };

  const summary = buildSummary(input, totalDays);

  return { stages, totalDays, startDate, endDate, summary };
}

function buildSummary(
  input: TimelineInput,
  total: { min: number; typical: number; max: number }
): string {
  if (input.isUpdate) {
    return `Updates to an existing app typically reach users in ${total.typical} day${total.typical === 1 ? "" : "s"}, sometimes up to ${total.max}.`;
  }
  if (input.targetTrack === "internal") {
    return "Internal testing builds reach your testers within an hour of upload.";
  }
  if (input.targetTrack === "closed") {
    return `Closed testing typically takes ${total.typical} day${total.typical === 1 ? "" : "s"} from upload to your testers having access.`;
  }
  if (input.targetTrack === "open") {
    return `Open testing typically takes ${total.typical} days from upload to public beta availability.`;
  }
  if (input.targetTrack === "production") {
    if (input.accountType === "organization") {
      return `Production: organization accounts skip the 14-day closed-testing requirement. Typical end-to-end: ${total.typical} days, up to ${total.max}.`;
    }
    return `Production: personal accounts must complete a 14-day closed test with 12 testers, then production review. Plan for ${total.typical} days total, up to ${total.max} if reviewers ask for changes.`;
  }
  return `Estimated ${total.typical} days, up to ${total.max}.`;
}

/**
 * Quick lookup table the UI can show as a "Realistic expectations" panel.
 */
export const SCENARIO_BENCHMARKS = [
  {
    scenario: "Update to existing production app",
    typicalDays: 1,
    maxDays: 3,
    note: "Same-day rollouts are common once your account is established.",
  },
  {
    scenario: "Organization account, first production release",
    typicalDays: 7,
    maxDays: 14,
    note: "No 14-day closed-test requirement. Mostly waiting on the production review.",
  },
  {
    scenario: "Personal account, first production release",
    typicalDays: 24,
    maxDays: 42,
    note: "The 14-day closed-test requirement is the bottleneck. Start it on day one.",
  },
  {
    scenario: "Closed testing only",
    typicalDays: 2,
    maxDays: 5,
    note: "Review of your closed-test release, then your testers can install.",
  },
];
