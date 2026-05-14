import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "play-billing-fees-2026";
const guide = getGuide(SLUG);

export const metadata = pageMetadata({
  title: guide?.title ?? "",
  description: guide?.summary ?? "",
  path: `/guides/${SLUG}`,
});

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>Google Play&apos;s service fees are about to change in the biggest restructure since 2022. Starting June 2026, the standard 30% rate gets a new 20%/10% split structure for many developers. Here&apos;s what fees you pay today, what changes in June, and how the new rules affect your take-home revenue.</p>

      <h2>The current fee structure</h2>
      <p><strong>Standard rate: 30%.</strong> Google charges 30% of revenue on most in-app purchases and one-time app purchases. This has been the historical default since the Play Store launched.</p>
      <p><strong>Small business reduced rate: 15%.</strong> The first $1 million in annual revenue per developer account is charged at 15%, dropping back to 30% on revenue above the threshold. The threshold resets each calendar year. To qualify, you enroll once in the Play Console; eligibility is essentially automatic for developers under the threshold.</p>
      <p><strong>Subscription rate: 15%.</strong> All subscription revenue is charged at 15% from day one. Previously this was 30% for the first year and 15% afterward — Google moved everything to a flat 15% in 2022.</p>
      <p><strong>Media app rate: 10%.</strong> A small set of media apps (ebooks, audiobooks, on-demand music) qualify for a 10% rate under the Play Media Experience Program. The bar is high and acceptance is by invitation.</p>

      <h2>What changes in June 2026</h2>
      <p>Google announced a new fee structure in early 2026, with a phased rollout starting June 1. The headline change: a 20%/10% split that applies to most developers, replacing the legacy 30%/15% defaults for many transaction types.</p>
      <p>Under the new structure:</p>
      <ul>
        <li><strong>20% on the first year of any user&apos;s purchases.</strong> When a user first makes a purchase in your app, that user&apos;s purchases for the next 12 months are charged at 20%.</li>
        <li><strong>10% on subsequent years.</strong> After 12 months from a user&apos;s first purchase, their ongoing purchases (renewing subscriptions, repeat in-app purchases) drop to 10%.</li>
        <li><strong>Small business program continues at 15%.</strong> Developers under $1M annual revenue still qualify for the alternative 15% flat rate; you choose between the new tiered structure and the small-business flat rate based on what&apos;s cheaper for you.</li>
      </ul>

      <h2>Who benefits, who pays more</h2>
      <p>The new structure favors developers with high subscription retention. If your average subscriber stays past 12 months, you go from paying 15% indefinitely under the old structure to paying 10% on year-2+ revenue under the new — a 5 percentage-point improvement. For a subscription business at $500k annual revenue with 60% retention past year one, that&apos;s roughly $15k/year more in your pocket.</p>
      <p>Pure paid-up-front apps lose under the new structure. Their fee goes from 15% (small business) or 30% (standard) to 20% on the first sale and no second-year benefit (no recurring transactions). Many paid app developers will stay on the small-business flat rate as long as they qualify.</p>
      <p>High-volume IAP developers (consumable purchases like in-game currency) are mixed. New users pay 20%, returning users with old purchase history drop to 10%. Whether the change helps depends on what fraction of revenue comes from repeat purchasers.</p>

      <h2>Regional variations</h2>
      <p>The fee rate also varies by region. In South Korea, the 15% Korea rate was introduced after the 2021 law requiring alternative billing options. In India, regulatory pressure has produced reduced rates for specific app categories. The European Union&apos;s Digital Markets Act has produced its own special rules around alternative billing systems and external payment links — those are covered in our <a href="/guides/alternative-billing-explained">alternative billing guide</a>.</p>

      <h2>What you pay in practice</h2>
      <p>When a user makes a purchase, Google calculates the fee based on the user&apos;s region, your enrolled programs, the purchase type, and the timing relative to the user&apos;s first purchase. The remainder goes to your developer payout, after tax withholding for applicable jurisdictions.</p>
      <p>Payouts happen monthly, on the 15th, for revenue earned 30+ days prior. So revenue from January gets paid out around March 15.</p>

      <h2>Taxes on top of fees</h2>
      <p>Google handles indirect tax (VAT, GST, sales tax) collection and remittance in many jurisdictions. In others, you remit the tax yourself. The Play Console&apos;s tax settings page shows which is which based on your business location and your buyers&apos; locations.</p>
      <p>The fee is calculated on the post-tax revenue Google forwards to you, not on the gross transaction value. Your effective take-home is therefore: gross price minus tax minus service fee.</p>

      <h2>How the wizard handles this</h2>
      <p>The pricing calculator in Step 10 of the wizard uses your monetization model, region, and enrolled programs to compute your projected fees under both the current and June-2026 structures. You see the projected year-1 revenue, Google&apos;s cut, and your take-home, with a toggle to compare regimes. The numbers are illustrative — actual revenue depends on user behavior we cannot predict — but the fee math is exact.</p>
    </GuideLayout>
  );
}
