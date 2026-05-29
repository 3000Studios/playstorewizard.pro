import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Refund Policy",
  description:
    "Playstore Wizard's refund and cancellation policy for subscriptions, lifetime licenses, and digital services.",
  path: "/refunds",
});

export default function RefundsPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Refund Policy", path: "/refunds" },
        ])}
      />
      <article className="container max-w-3xl py-20">
        <Reveal>
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-5xl tracking-tight text-balance">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="mt-4 text-sm text-text-muted">Last updated: May 29, 2026</p>
        </Reveal>
        <div className="prose-guide mt-10">
          <h2>Digital services — no refunds</h2>
          <p>
            Playstore Wizard sells access to digital software and AI-powered generation
            services. Because access, compute, and generated output are delivered
            instantly and consumed on demand, all sales are final and{" "}
            <strong>non-refundable</strong> once a subscription or license is activated.
            By completing a purchase you acknowledge that you are buying immediate access
            to a digital service and you waive any statutory cooling-off period to the
            extent permitted by applicable law.
          </p>

          <h2>Subscriptions</h2>
          <p>
            Monthly and annual plans renew automatically until cancelled. You may cancel
            at any time from your account or by emailing{" "}
            <a href="mailto:Mr.jwswain@gmail.com">Mr.jwswain@gmail.com</a>. Cancellation
            stops the next renewal; it does not refund the current billing period. You
            retain paid access until the end of the period you already paid for.
          </p>

          <h2>Lifetime licenses</h2>
          <p>
            Lifetime licenses are one-time purchases of perpetual access to the then-current
            feature set. They are non-refundable once issued. &quot;Lifetime&quot; refers to
            the operational lifetime of the Playstore Wizard product, not the lifetime of the
            purchaser.
          </p>

          <h2>Limited exceptions</h2>
          <p>
            We will issue a refund only where required by law or in the following cases,
            verified at our discretion:
          </p>
          <ul>
            <li>
              <strong>Duplicate charge.</strong> You were billed more than once for the same
              plan in the same period due to a processing error.
            </li>
            <li>
              <strong>Service never delivered.</strong> A verified, sustained outage on our
              side prevented you from accessing the paid service for the entire billing
              period and our team could not restore access.
            </li>
            <li>
              <strong>Unauthorized charge.</strong> A charge was made without the
              cardholder&apos;s authorization and is confirmed as fraudulent.
            </li>
          </ul>
          <p>
            Approved refunds are returned to the original payment method within 5–10 business
            days. We do not refund for change of mind, lack of use, failure to cancel before
            renewal, or because Google Play declined to approve your app — app approval is
            controlled solely by Google and is outside our service.
          </p>

          <h2>No guarantee of Play Store approval</h2>
          <p>
            Playstore Wizard helps you prepare compliant submissions, but Google retains sole
            discretion over Play Store approval. A rejection by Google is not grounds for a
            refund. See our <a href="/disclaimer">Disclaimer</a> for details.
          </p>

          <h2>Chargebacks</h2>
          <p>
            Please contact us before initiating a chargeback so we can resolve the issue
            directly. Chargebacks filed without first contacting us may result in suspension
            of your account and license.
          </p>

          <h2>How to request a refund</h2>
          <p>
            Email <a href="mailto:Mr.jwswain@gmail.com">Mr.jwswain@gmail.com</a> from the
            address associated with your purchase, including the transaction ID or receipt.
            We respond to refund requests within 5 business days.
          </p>

          <p className="text-sm text-text-dim">
            This policy is provided for general information and does not override
            non-waivable consumer-protection rights in your jurisdiction. For binding legal
            certainty, consult a qualified attorney.
          </p>
        </div>
      </article>
    </>
  );
}
