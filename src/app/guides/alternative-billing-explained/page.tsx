import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "alternative-billing-explained";
const guide = getGuide(SLUG);
export const metadata = pageMetadata({ title: guide?.title ?? "", description: guide?.summary ?? "", path: `/guides/${SLUG}` });

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>Google now allows alternative billing systems on Play Store in many markets, with a discount on the service fee in exchange for handling payment processing yourself. The economics are tempting — 4-5 percentage points off your fee for some categories of revenue — but the integration cost is real and the rules are complex. Here&apos;s when alternative billing makes sense, how it works, and how to think about whether to integrate it.</p>

      <h2>How alternative billing works</h2>
      <p>By default, every purchase in your app — paid app, in-app purchase, subscription — flows through Google Play Billing. Google handles the payment, settles with your bank, and takes their service fee out of the gross.</p>
      <p>Alternative billing lets you skip Google Play Billing for some or all transactions. You integrate a third-party payment processor (Stripe, Adyen, PayPal, etc.) directly into your app, handle the transaction yourself, and pay Google a reduced service fee that covers their platform costs without the payment-processing component.</p>

      <h2>Where it&apos;s allowed</h2>
      <p>Alternative billing eligibility is region-specific. The rules grew out of regulatory pressure and litigation in various jurisdictions, so the rollout has been uneven:</p>
      <ul>
        <li><strong>European Union</strong> (under the Digital Markets Act): alternative billing required to be allowed; eligibility is broad.</li>
        <li><strong>South Korea</strong> (under the Telecommunications Business Act): alternative billing required; lower fee tier.</li>
        <li><strong>United States</strong>: limited program in specific categories. Most app developers can opt in.</li>
        <li><strong>India</strong>: developer choice program with category restrictions.</li>
        <li><strong>Brazil, Japan, Australia, others</strong>: pilot programs with category and revenue threshold rules.</li>
      </ul>
      <p>Outside these regions, all transactions must still go through Google Play Billing. You cannot use alternative billing as a global default — you have to scope it per region.</p>

      <h2>The fee math</h2>
      <p>The fee discount is typically 3–4 percentage points off the standard service fee. So a developer paying 15% under the small-business program pays roughly 11–12% with alternative billing. A developer paying 30% pays roughly 26–27%.</p>
      <p>Whether this discount is worth it depends on your payment-processing costs and refund/chargeback risk. Stripe charges roughly 2.9% + $0.30 per transaction. Adyen charges roughly 2.5%. Add chargeback risk (1–3% of revenue for high-risk categories), customer-support cost (handling payment disputes the user would have escalated to Google before), and currency-conversion overhead.</p>
      <p>For most low-to-medium volume apps, alternative billing nets you 1–2 percentage points of margin improvement. Not nothing, but not transformational either. The math gets more attractive at high volume, where you can negotiate lower processor rates and amortize the support cost.</p>

      <h2>Integration complexity</h2>
      <p>Alternative billing requires:</p>
      <ul>
        <li>Integration with a payment processor SDK or API.</li>
        <li>UI for showing the alternative payment option, with the disclosure language Google requires.</li>
        <li>Reporting infrastructure — you must report each transaction to Google&apos;s billing API so they can calculate their fee.</li>
        <li>Customer support for payment issues, refunds, and disputes (Google&apos;s normal channels don&apos;t apply).</li>
        <li>Compliance with regional payments regulations (PCI DSS for card storage, PSD2 for EU transactions, etc.).</li>
      </ul>
      <p>For most indie developers, the cost of building and maintaining this integration outweighs the fee savings. The economics flip somewhere around $50k–$100k monthly revenue, depending on the category.</p>

      <h2>What Google does and doesn&apos;t handle when you use alternative billing</h2>
      <p>Google still handles: app distribution, platform fee processing, regulatory disclosures, the general Play Store experience.</p>
      <p>You handle: payment authorization, settlement, refunds, chargebacks, payment-related customer support, fraud detection, tax remittance in some jurisdictions, and reporting to Google.</p>

      <h2>The user-experience tradeoff</h2>
      <p>Users trust Google Play Billing. They know what to expect: a familiar checkout, payment methods they&apos;ve already saved, a refund process they understand. Alternative billing introduces friction — new checkout UI, possibly a re-entered payment method, unfamiliar refund channels. Conversion rates typically drop 5–15% when switching from Play Billing to alternative billing, depending on the implementation quality and region.</p>
      <p>The net effect on revenue is therefore: fee savings minus conversion-rate drop minus operational overhead. For most apps, the math is positive but small. For some apps with payment-savvy audiences (B2B SaaS, developer tools), the conversion impact is minimal and the fee savings dominate.</p>

      <h2>How the wizard handles this</h2>
      <p>The pricing calculator in Step 10 includes an alternative-billing toggle. When enabled for an eligible region, it shows the projected fee impact alongside the standard Play Billing path so you can compare net revenue side by side. Integration of alternative billing into your actual app is outside the wizard&apos;s scope — that&apos;s a code-change project that lives with the payment processor you choose.</p>
    </GuideLayout>
  );
}
