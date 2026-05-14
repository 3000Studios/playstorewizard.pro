import { STEPS, stepIndex } from "@/lib/steps";
import { notFound } from "next/navigation";
import { WizardStep } from "@/components/wizard/wizard-step";

export function generateStaticParams() {
  return STEPS.map((s) => ({ step: s.slug }));
}

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function Page({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  const i = stepIndex(step);
  if (i === -1) notFound();
  return <WizardStep step={STEPS[i]} />;
}
