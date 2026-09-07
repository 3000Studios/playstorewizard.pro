import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd } from "@/lib/seo/metadata";
import { PricingClient } from "./pricing-client";

export const metadata = pageMetadata({
  title: "Pricing",
  description: "Start a free six-step Play Store launch plan. Pro unlocks the final six readiness steps before you submit in Play Console.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }])} />
      <PricingClient />
    </>
  );
}
