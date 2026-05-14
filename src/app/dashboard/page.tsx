import type { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "User Dashboard · Playstore Wizard",
  description: "Generate, edit, save, and publish conversion-ready sites on Playstore Wizard subdomains.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
