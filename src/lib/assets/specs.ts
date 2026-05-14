/**
 * Every Google Play Store image asset spec, as code.
 *
 * The resizer reads from this file to know what dimensions to produce.
 * Update this file when Google updates their requirements.
 *
 * Source: https://support.google.com/googleplay/android-developer/answer/9866151
 */

export type AssetCategory =
  | "icon"
  | "feature-graphic"
  | "phone-screenshot"
  | "tablet-7-screenshot"
  | "tablet-10-screenshot"
  | "wear-screenshot"
  | "tv-screenshot"
  | "tv-banner";

export interface AssetSpec {
  category: AssetCategory;
  label: string;
  /** Plain-English explanation. */
  description: string;
  /** Output width in pixels. */
  width: number;
  /** Output height in pixels. Use 0 if the spec is aspect-ratio only. */
  height: number;
  /** Aspect ratio used when only a min/max size is enforced (e.g. screenshots). */
  aspectRatio?: { wide: number; tall: number };
  /** Required, recommended, or optional in the Play Console. */
  requirement: "required" | "recommended" | "optional";
  /** Acceptable file formats. */
  formats: ("png" | "jpg" | "webp")[];
  /** Maximum file size in MB. */
  maxFileSizeMb: number;
  /** Minimum and maximum acceptable dimensions when the spec is a range. */
  range?: {
    minDimension: number;
    maxDimension: number;
  };
}

export const ASSET_SPECS: AssetSpec[] = [
  {
    category: "icon",
    label: "App icon",
    description: "Shown in the Play Store and on the user's home screen. Must be a square PNG with no transparency at this output size — alpha is fine in source.",
    width: 512,
    height: 512,
    requirement: "required",
    formats: ["png"],
    maxFileSizeMb: 1,
  },
  {
    category: "feature-graphic",
    label: "Feature graphic",
    description: "The wide banner at the top of your store page and in promotional placements. No alpha. Keep critical content in the centered 924×400 safe zone — the edges can be cropped on some surfaces.",
    width: 1024,
    height: 500,
    requirement: "required",
    formats: ["png", "jpg"],
    maxFileSizeMb: 15,
  },
  {
    category: "phone-screenshot",
    label: "Phone screenshot",
    description: "Phone screenshots, minimum 2, maximum 8. Aspect ratio between 9:16 and 16:9. Min side 320px, max side 3840px.",
    width: 1080,
    height: 1920,
    aspectRatio: { wide: 16 / 9, tall: 9 / 16 },
    range: { minDimension: 320, maxDimension: 3840 },
    requirement: "required",
    formats: ["png", "jpg"],
    maxFileSizeMb: 8,
  },
  {
    category: "tablet-7-screenshot",
    label: "7-inch tablet screenshot",
    description: "7-inch tablet screenshots. Required if your app supports tablets. Same aspect-ratio rules as phone.",
    width: 1200,
    height: 1920,
    aspectRatio: { wide: 16 / 9, tall: 9 / 16 },
    range: { minDimension: 320, maxDimension: 3840 },
    requirement: "recommended",
    formats: ["png", "jpg"],
    maxFileSizeMb: 8,
  },
  {
    category: "tablet-10-screenshot",
    label: "10-inch tablet screenshot",
    description: "10-inch tablet screenshots. Required if your app supports tablets. Same aspect-ratio rules as phone.",
    width: 1600,
    height: 2560,
    aspectRatio: { wide: 16 / 9, tall: 9 / 16 },
    range: { minDimension: 1080, maxDimension: 7680 },
    requirement: "recommended",
    formats: ["png", "jpg"],
    maxFileSizeMb: 8,
  },
  {
    category: "wear-screenshot",
    label: "Wear OS screenshot",
    description: "Square or round Wear OS screenshots. Only required if your app supports Wear OS.",
    width: 384,
    height: 384,
    requirement: "optional",
    formats: ["png", "jpg"],
    maxFileSizeMb: 1,
  },
  {
    category: "tv-screenshot",
    label: "Android TV screenshot",
    description: "16:9 landscape Android TV screenshots. Required only if your app supports Android TV.",
    width: 1920,
    height: 1080,
    aspectRatio: { wide: 16 / 9, tall: 9 / 16 },
    requirement: "optional",
    formats: ["png", "jpg"],
    maxFileSizeMb: 8,
  },
  {
    category: "tv-banner",
    label: "Android TV banner",
    description: "Android TV banner that appears on the Leanback launcher. 16:9 ratio.",
    width: 1280,
    height: 720,
    requirement: "optional",
    formats: ["png", "jpg"],
    maxFileSizeMb: 8,
  },
];

export function getSpec(category: AssetCategory): AssetSpec | undefined {
  return ASSET_SPECS.find((s) => s.category === category);
}

export function getRequiredSpecs(): AssetSpec[] {
  return ASSET_SPECS.filter((s) => s.requirement === "required");
}
