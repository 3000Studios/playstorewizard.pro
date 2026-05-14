export interface StepDef {
  slug: string;
  num: number;
  title: string;
  short: string;
  description: string;
}

export const STEPS: StepDef[] = [
  { num: 1,  slug: "app-info",        title: "App basics",            short: "Basics",    description: "Tell us your app's name, package, and whether it's free or paid." },
  { num: 2,  slug: "bundle",          title: "Upload your app",       short: "Bundle",    description: "Drop your AAB or APK — we read the version and permissions for you." },
  { num: 3,  slug: "assets",          title: "Graphics & screenshots",short: "Assets",    description: "Auto-resize your icon and screenshots to every Play Store dimension." },
  { num: 4,  slug: "listing",         title: "Store listing",         short: "Listing",   description: "AI writes the short description, long description, and ASO keywords." },
  { num: 5,  slug: "categorization",  title: "Category and tags",     short: "Category",  description: "Pick the right category and up to five tags." },
  { num: 6,  slug: "content-rating",  title: "Content rating",        short: "Rating",    description: "Plain-English IARC questionnaire — no jargon, no surprises." },
  { num: 7,  slug: "data-safety",     title: "Data safety",           short: "Data",      description: "The form everyone fears. We make it a series of yes/no questions." },
  { num: 8,  slug: "target-audience", title: "Target audience",       short: "Audience",  description: "Age groups and Families program eligibility." },
  { num: 9,  slug: "privacy",         title: "Privacy policy",        short: "Privacy",   description: "Auto-generate a hostable privacy policy from your Data Safety answers." },
  { num: 10, slug: "pricing",         title: "Pricing & countries",   short: "Pricing",   description: "Set your price, see what Google takes, choose where to launch." },
  { num: 11, slug: "release",         title: "Release track",         short: "Release",   description: "Internal, closed, open, or production — with release notes." },
  { num: 12, slug: "review",          title: "Review & submit",       short: "Review",    description: "Final compliance check, then submit to the Play Console." },
];

export function stepIndex(slug: string): number {
  return STEPS.findIndex((s) => s.slug === slug);
}

export function nextStep(slug: string): string | null {
  const i = stepIndex(slug);
  if (i === -1 || i === STEPS.length - 1) return null;
  return STEPS[i + 1].slug;
}

export function prevStep(slug: string): string | null {
  const i = stepIndex(slug);
  if (i <= 0) return null;
  return STEPS[i - 1].slug;
}
