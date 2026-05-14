import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd } from "@/lib/seo/metadata";
import { PricingClient } from "./pricing-client";

export const metadata = pageMetadata({
  title: "Pricing",
  description: "Free for your first app. Pro for unlimited apps and automation. Studio for agencies. Monthly, yearly, or lifetime pricing.",
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
