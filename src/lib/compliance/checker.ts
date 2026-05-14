/**
 * Compliance checker.
 *
 * Takes a `ComplianceContext` (snapshot of the wizard's current state) and
 * returns every rule violation, grouped and counted for the UI.
 */

import {
  COMPLIANCE_RULES,
  type ComplianceContext,
  type ComplianceRule,
  type RuleCategory,
  type RuleSeverity,
} from "./rules";

export interface Violation extends ComplianceRule {
  // Currently no per-instance data, but a stable type lets us add it later
  // (e.g. ruleId-specific values like "your name is 32 chars, max is 30").
}

export interface ComplianceReport {
  /** All violations, in the order the rules array defines (stable). */
  violations: Violation[];

  /** Violations grouped by severity. */
  blockers: Violation[];
  warnings: Violation[];
  infos: Violation[];

  /** Violations grouped by category. */
  byCategory: Record<RuleCategory, Violation[]>;

  /** Quick summary numbers for the dashboard. */
  summary: {
    totalRulesEvaluated: number;
    totalViolations: number;
    blockerCount: number;
    warningCount: number;
    infoCount: number;
    readyToSubmit: boolean; // true iff zero blockers
  };
}

const EMPTY_BY_CATEGORY: Record<RuleCategory, Violation[]> = {
  technical: [],
  testing: [],
  policy: [],
  metadata: [],
  monetization: [],
  audience: [],
};

export function checkCompliance(ctx: ComplianceContext): ComplianceReport {
  const violations: Violation[] = [];

  for (const rule of COMPLIANCE_RULES) {
    if (rule.appliesIf) {
      try {
        if (!rule.appliesIf(ctx)) continue;
      } catch {
        // A rule's `appliesIf` should never throw, but if it does (e.g. due to
        // an undefined field), treat the rule as not applicable rather than
        // breaking the whole check.
        continue;
      }
    } else {
      // No predicate means "always applies, but treat as a checklist reminder"
      // — only surface as 'info' severity by convention.
      if (rule.severity !== "info") continue;
    }
    violations.push(rule);
  }

  const blockers = violations.filter((v) => v.severity === "blocker");
  const warnings = violations.filter((v) => v.severity === "warning");
  const infos = violations.filter((v) => v.severity === "info");

  const byCategory: Record<RuleCategory, Violation[]> = {
    ...EMPTY_BY_CATEGORY,
    technical: violations.filter((v) => v.category === "technical"),
    testing: violations.filter((v) => v.category === "testing"),
    policy: violations.filter((v) => v.category === "policy"),
    metadata: violations.filter((v) => v.category === "metadata"),
    monetization: violations.filter((v) => v.category === "monetization"),
    audience: violations.filter((v) => v.category === "audience"),
  };

  return {
    violations,
    blockers,
    warnings,
    infos,
    byCategory,
    summary: {
      totalRulesEvaluated: COMPLIANCE_RULES.length,
      totalViolations: violations.length,
      blockerCount: blockers.length,
      warningCount: warnings.length,
      infoCount: infos.length,
      readyToSubmit: blockers.length === 0,
    },
  };
}

/**
 * Per-step compliance — returns just the violations relevant to the user's
 * current wizard step. Used to highlight issues inline instead of waiting
 * until the review screen.
 */
export function checkStep(
  ctx: ComplianceContext,
  stepCategories: RuleCategory[]
): Violation[] {
  const report = checkCompliance(ctx);
  return report.violations.filter((v) => stepCategories.includes(v.category));
}

/**
 * Group label helpers for the UI.
 */
export function severityLabel(s: RuleSeverity): string {
  return { blocker: "Must fix", warning: "Should fix", info: "Tip" }[s];
}

export function categoryLabel(c: RuleCategory): string {
  return {
    technical: "Technical",
    testing: "Testing",
    policy: "Play policy",
    metadata: "Store listing",
    monetization: "Monetization",
    audience: "Audience",
  }[c];
}
