import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "Terms of service for using Playstore Wizard.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbLd([{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms" }])} />
      <article className="container max-w-3xl py-20">
        <Reveal>
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-5xl tracking-tight text-balance">Terms of Service</h1>
          <p className="mt-4 text-sm text-text-muted">Last updated: May 13, 2026</p>
        </Reveal>
        <div className="prose-guide mt-10">
          <p>These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Playstore Wizard website and services (the &quot;Service&quot;), operated by Mr. J. Swain and 3000 Studios (&quot;we&quot;, &quot;us&quot;).</p>
          <h2>1. Acceptance</h2>
          <p>By using the Service you agree to these Terms. If you do not agree, do not use the Service.</p>
          <h2>2. Account</h2>
          <p>The Free tier does not require an account. Paid tiers require a registered email and active subscription. You are responsible for keeping your account credentials secure. We reserve the right to suspend accounts that violate these Terms.</p>
          <h2>3. Acceptable use</h2>
          <p>You may not use the Service to:</p>
          <ul>
            <li>Submit malicious code, phishing apps, or apps that violate Google Play&apos;s policies</li>
            <li>Attempt to reverse-engineer or scrape the Service</li>
            <li>Resell access to the Service without a Studio-tier subscription</li>
            <li>Interfere with the Service&apos;s operation or other users</li>
          </ul>
          <h2>4. Subscriptions and billing</h2>
          <p>Paid subscriptions are billed monthly or annually as selected. Subscriptions automatically renew unless cancelled before the renewal date. Yearly subscriptions are eligible for a full refund within 30 days; monthly subscriptions end at the close of the billing period.</p>
          <h2>5. Intellectual property</h2>
          <p>The Service, including all content, code, branding, and design, is the property of Mr. J. Swain and 3000 Studios. You receive a non-exclusive, non-transferable license to use the Service for its intended purpose. The open-source portions of the codebase (compliance rules, AAB parser, privacy policy generator) are governed by their own license posted in the public repository.</p>
          <h2>6. Disclaimer</h2>
          <p>The Service is provided &quot;as is&quot;. We do not guarantee that submissions prepared through the Service will be approved by Google. Google retains sole discretion over Play Store policy enforcement. We are not affiliated with Google LLC.</p>
          <h2>7. Limitation of liability</h2>
          <p>To the maximum extent permitted by law, Mr. J. Swain and 3000 Studios are not liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our maximum liability for any claim is limited to the amount you paid for the Service in the 12 months preceding the claim.</p>
          <h2>8. Termination</h2>
          <p>You may stop using the Service at any time. We may terminate accounts that violate these Terms with 7 days notice, except for cause (e.g. fraud), in which case termination may be immediate.</p>
          <h2>9. Governing law</h2>
          <p>These Terms are governed by the laws of the State of Georgia, United States. Disputes will be resolved in the state or federal courts located in Cobb County, Georgia.</p>
          <h2>10. Changes</h2>
          <p>We may update these Terms. Material changes will be announced via email or in-app banner at least 14 days before they take effect.</p>
          <h2>11. Contact</h2>
          <p>Questions about these Terms: <a href="mailto:legal@playstorewizard.pro">legal@playstorewizard.pro</a>.</p>
        </div>
      </article>
    </>
  );
}
