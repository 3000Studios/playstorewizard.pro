"use client";
import { useWizard } from "@/lib/store";
import { Badge } from "@/components/ui/primitives";
import { checkCompliance } from "@/lib/compliance/checker";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function StepReview() {
  const w = useWizard();
  const report = checkCompliance({
    targetSdk: w.targetSdk,
    minSdk: w.minSdk,
    bundleFormat: w.bundleFormat,
    accountType: w.accountType,
    isFirstApp: w.isFirstApp,
    appName: w.appName,
    shortDescription: w.shortDescription,
    fullDescription: w.fullDescription,
    hasFeatureGraphic: !!w.featureGraphicDataUrl || !!w.iconDataUrl,
    screenshotCount: w.screenshotDataUrls.length,
    collectsData: w.collectsData,
    sharesData: w.sharesData,
    hasPrivacyPolicyUrl: !!w.privacyPolicyUrl || !!w.privacyPolicyHtml,
    allowsAccountCreation: w.allowsAccountCreation,
    hasInAppAccountDeletion: w.hasInAppAccountDeletion,
    targetsChildren: w.targetsChildren,
    inFamiliesProgram: w.inFamiliesProgram,
    hasInAppPurchases: false,
    hasSubscriptions: false,
    declaredPermissions: w.declaredPermissions,
    targetTrack: w.track,
  });
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-xl bg-bg-2 border border-border">
        <div className="flex items-center gap-3">
          {report.summary.readyToSubmit ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-amber-400" />
          )}
          <div>
            <p className="font-semibold">
              {report.summary.readyToSubmit ? "Ready to submit" : `${report.summary.blockerCount} blocker(s) to fix`}
            </p>
            <p className="text-xs text-text-muted">
              {report.summary.warningCount} warnings · {report.summary.totalRulesEvaluated - report.summary.totalViolations} checks passed
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {report.blockers.map((b) => (
          <div key={b.id} className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/5">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="rose">Must fix</Badge>
              <p className="text-sm font-medium">{b.title}</p>
            </div>
            <p className="text-xs text-text-muted">{b.fix}</p>
          </div>
        ))}
        {report.warnings.map((b) => (
          <div key={b.id} className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="amber">Should fix</Badge>
              <p className="text-sm font-medium">{b.title}</p>
            </div>
            <p className="text-xs text-text-muted">{b.fix}</p>
          </div>
        ))}
      </div>
      <p className="rounded-lg border border-border bg-bg-2/50 px-4 py-3 text-xs text-text-muted">
        Use the checklist above to resolve any blockers, then submit through your own Play Console account.
      </p>
    </div>
  );
}
