export type ReleaseTag = "new" | "improved" | "fixed" | "policy";

export interface ReleaseChange {
  type: ReleaseTag;
  text: string;
}

export interface Release {
  version: string;
  date: string;
  tags: ReleaseTag[];
  changes: ReleaseChange[];
}

export const RELEASES: Release[] = [
  {
    version: "0.1.0",
    date: "2026-05-13",
    tags: ["new", "policy"],
    changes: [
      { type: "new", text: "Initial release: 12-step wizard, compliance auto-check, AI listings, asset auto-resize." },
      { type: "policy", text: "Compliance engine knows about the August 2025 API 35 mandate." },
      { type: "policy", text: "Compliance engine knows about the August 2026 API 36 deadline." },
      { type: "policy", text: "Pricing calculator updated for the June 2026 service-fee restructure." },
      { type: "policy", text: "Compliance engine enforces the 12-tester, 14-day rule for personal accounts." },
      { type: "new", text: "Browser-side AAB parser — no bundletool required." },
      { type: "new", text: "Privacy policy generator from Data Safety answers." },
      { type: "new", text: "AI runs on Cloudflare Workers AI free tier, with Ollama fallback for local dev." },
    ],
  },
];
