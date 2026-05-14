import type { DataType, DataPurpose } from "./ai/privacy";

export type ReleaseTrack = "internal" | "closed" | "open" | "production";

export interface WizardData {
  // Step 1: app-info
  appName: string;
  packageName: string;
  defaultLanguage: string;
  appOrGame: "app" | "game";
  freeOrPaid: "free" | "paid";

  // Step 2: bundle
  bundleFormat?: "aab" | "apk";
  versionName?: string;
  versionCode?: number;
  minSdk?: number;
  targetSdk?: number;
  declaredPermissions: string[];

  // Step 3: assets
  iconDataUrl?: string;
  featureGraphicDataUrl?: string;
  screenshotDataUrls: string[];

  // Step 4: listing
  oneSentencePitch: string;
  shortDescription: string;
  fullDescription: string;
  keywords: string[];

  // Step 5: categorization
  category: string;
  tags: string[];

  // Step 6: content-rating
  ratingAnswers: Record<string, "yes" | "no">;
  derivedRating?: "everyone" | "everyone-10" | "teen" | "mature-17" | "adults-18";

  // Step 7: data-safety
  collectsData: boolean;
  sharesData: boolean;
  dataTypes: DataType[];
  dataPurposes: Partial<Record<DataType, DataPurpose[]>>;
  usesAds: boolean;
  usesAnalytics: boolean;
  hasInAppAccountDeletion: boolean;
  allowsAccountCreation: boolean;

  // Step 8: target-audience
  targetAgeGroups: string[];
  targetsChildren: boolean;
  inFamiliesProgram: boolean;

  // Step 9: privacy
  developerName: string;
  contactEmail: string;
  websiteUrl: string;
  privacyPolicyUrl: string;
  privacyPolicyHtml?: string;

  // Step 10: pricing
  price?: number;
  currency: string;
  countries: string[];

  // Step 11: release
  track: ReleaseTrack;
  releaseNotes: Record<string, string>;

  // Meta
  completedSteps: number[];
  accountType: "personal" | "organization";
  isFirstApp: boolean;
}

export const EMPTY_WIZARD: WizardData = {
  appName: "",
  packageName: "",
  defaultLanguage: "en-US",
  appOrGame: "app",
  freeOrPaid: "free",
  declaredPermissions: [],
  screenshotDataUrls: [],
  oneSentencePitch: "",
  shortDescription: "",
  fullDescription: "",
  keywords: [],
  category: "",
  tags: [],
  ratingAnswers: {},
  collectsData: false,
  sharesData: false,
  dataTypes: [],
  dataPurposes: {},
  usesAds: false,
  usesAnalytics: false,
  hasInAppAccountDeletion: false,
  allowsAccountCreation: false,
  targetAgeGroups: [],
  targetsChildren: false,
  inFamiliesProgram: false,
  developerName: "",
  contactEmail: "",
  websiteUrl: "",
  privacyPolicyUrl: "",
  currency: "USD",
  countries: [],
  track: "internal",
  releaseNotes: {},
  completedSteps: [],
  accountType: "personal",
  isFirstApp: true,
};
