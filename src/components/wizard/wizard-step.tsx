"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { useWizard } from "@/lib/store";
import { STEPS, type StepDef, nextStep, prevStep } from "@/lib/steps";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { WizardPaywall } from "./wizard-paywall";

import { StepAppInfo } from "./steps/app-info";
import { StepBundle } from "./steps/bundle";
import { StepAssets } from "./steps/assets";
import { StepListing } from "./steps/listing";
import { StepCategorization } from "./steps/categorization";
import { StepContentRating } from "./steps/content-rating";
import { StepDataSafety } from "./steps/data-safety";
import { StepTargetAudience } from "./steps/target-audience";
import { StepPrivacy } from "./steps/privacy";
import { StepPricing } from "./steps/pricing";
import { StepRelease } from "./steps/release";
import { StepReview } from "./steps/review";

const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  "app-info": StepAppInfo,
  "bundle": StepBundle,
  "assets": StepAssets,
  "listing": StepListing,
  "categorization": StepCategorization,
  "content-rating": StepContentRating,
  "data-safety": StepDataSafety,
  "target-audience": StepTargetAudience,
  "privacy": StepPrivacy,
  "pricing": StepPricing,
  "release": StepRelease,
  "review": StepReview,
};

export function WizardStep({ step }: { step: StepDef }) {
  const router = useRouter();
  const markComplete = useWizard((s) => s.markComplete);
  const Component = STEP_COMPONENTS[step.slug];
  const prev = prevStep(step.slug);
  const next = nextStep(step.slug);

  if (tier === "free" && step.num >= 7) {
    return <WizardPaywall stepNum={step.num} />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="font-mono text-[11px] uppercase tracking-widest text-text-muted mb-2">
          Step {step.num} of {STEPS.length}
        </div>
        <h1 className="font-display font-bold text-3xl tracking-tight">{step.title}</h1>
        <p className="text-sm text-text-muted mt-2 leading-relaxed">{step.description}</p>
      </CardHeader>
      <CardContent>
        {Component ? <Component /> : <div className="text-text-muted">Step not implemented.</div>}

        <div className="flex items-center justify-between gap-3 pt-6 mt-8 border-t border-border">
          <Button
            variant="outline"
            disabled={!prev}
            onClick={() => prev && router.push(`/wizard/${prev}`)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="aurora"
            onClick={() => {
              markComplete(step.num);
              if (next) router.push(`/wizard/${next}`);
            }}
          >
            {next ? (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Done
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
