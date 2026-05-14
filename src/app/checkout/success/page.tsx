import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo/metadata";
import { SuccessClient } from "./success-client";

export const metadata = {
  ...pageMetadata({
    title: "Welcome to Pro",
    description: "Your subscription is active. Open the wizard and start shipping.",
    path: "/checkout/success",
  }),
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessClient />
    </Suspense>
  );
}
