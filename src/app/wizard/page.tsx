import { redirect } from "next/navigation";
import { STEPS } from "@/lib/steps";

export const metadata = {
  title: "Wizard",
  robots: { index: false, follow: false },
};

export default function WizardIndex() {
  redirect(`/wizard/${STEPS[0].slug}`);
}
