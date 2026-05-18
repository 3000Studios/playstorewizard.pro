import type { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Launch Page Builder · Playstore Wizard",
  description: "Generate, edit, and publish a marketing landing page for your Android app on a free Playstore Wizard subdomain.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
