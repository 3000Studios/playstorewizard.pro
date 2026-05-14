import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "google-play-console-setup";
const guide = getGuide(SLUG);

export const metadata = pageMetadata({
  title: guide?.title ?? "",
  description: guide?.summary ?? "",
  path: `/guides/${SLUG}`,
});

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>If you have never set up a Google Play Console account before, the process feels deceptively simple — until it isn&apos;t. The signup flow is short, but the decisions you make in the first hour shape what you can do for the next year. This guide walks every screen you&apos;ll see, what the right answer usually is, and the traps that catch first-time developers.</p>

      <h2>Before you start</h2>
      <p>You will need three things ready before you begin: a Google account you do not mind being permanently associated with this developer identity, a working payment method that supports international transactions (Google charges a one-time fee in USD), and a government-issued photo ID matching the name you plan to register under. If you intend to publish under a company name, you also need a verifiable business address and proof of registration.</p>
      <p>Plan to spend about 45 minutes on initial setup, then 1–14 days waiting for identity verification before you can submit anything.</p>

      <h2>Step 1: Pick your account type</h2>
      <p>Google offers two account types: <em>personal</em> and <em>organization</em>. The choice has consequences that last forever.</p>
      <p>A <strong>personal account</strong> registers an individual developer. It costs $25 USD one-time. As of November 2023, personal accounts are subject to the closed-testing requirement: before you can request production access for your first app, you must run a closed test with at least 12 testers continuously opted in for 14 days. There is no way around this rule for personal accounts created after that date.</p>
      <p>An <strong>organization account</strong> registers a registered legal entity (LLC, corporation, sole proprietorship in some jurisdictions). It costs the same $25, but you must provide a D-U-N-S number (free from Dun &amp; Bradstreet but takes a few weeks to obtain), a working business website, and a phone number that Google may call to verify. Organization accounts are exempt from the 12-tester rule.</p>
      <p>If your goal is to ship one app as a hobby, personal is fine. If you plan to build a business around your apps or you absolutely cannot wait for closed-testing, set up an LLC and register as an organization. The legal cost is typically $50–300 depending on your state, and the time investment is worth avoiding the 2–3 week tester recruitment window later.</p>

      <h2>Step 2: Accept the Developer Distribution Agreement</h2>
      <p>This is the contract between you and Google. Read it once — it is not long — and pay attention to two clauses: the indemnification clause (you accept liability if your app harms users or violates third-party rights) and the takedown clause (Google can remove your app from the Play Store at their discretion). Once accepted, the agreement is binding on every app you publish.</p>

      <h2>Step 3: Pay the registration fee</h2>
      <p>The $25 fee is one-time, not annual. Google&apos;s billing system supports most major cards and PayPal. Some payment methods (prepaid cards, virtual cards, regional cards in certain countries) get rejected without explanation; if your first attempt fails, try a different card before opening a support ticket.</p>

      <h2>Step 4: Identity verification</h2>
      <p>You will be asked to upload a photo of your government ID. The name on the ID must match the name you registered with — no nicknames, no abbreviations. Google&apos;s system is automated for the initial review and a human looks at edge cases. Common rejection reasons: blurry photo, expired ID, name mismatch, glare on the laminate. Use natural light, place the ID flat on a dark surface, and avoid cropping the edges.</p>
      <p>Verification typically completes in 1–3 days. During this window, your Play Console account is technically active but most features (creating apps, submitting bundles) are gated.</p>

      <h2>Step 5: Set up your developer profile</h2>
      <p>The developer name you choose here appears on every Play Store listing forever. You can change it later, but the change goes through a review process and may take days to propagate. Choose carefully. Generic names like &quot;John Smith Apps&quot; are fine but generic; brand-style names like &quot;Bloom Studio&quot; project more legitimacy to potential users browsing the store. Avoid anything that implies affiliation with Google, Android, or other major brands — Google rejects names that could cause confusion.</p>
      <p>You will also provide a developer contact email (publicly displayed on your store listings), a website (optional but improves trust signals), and a phone number (private, used for account recovery and Google&apos;s outreach). The contact email gets spam quickly once you publish — consider using a dedicated address rather than your personal email.</p>

      <h2>Step 6: Set up a merchant account (if you plan to charge)</h2>
      <p>If your app will be paid up-front, contain in-app purchases, or run subscriptions, you need a Google Payments merchant account. This is a separate signup inside Play Console with its own verification: tax forms (W-9 for US, W-8BEN for non-US), bank account details, and additional identity documents. Allow another week for this verification to clear.</p>
      <p>Pro tip: even if your first app is free, set up the merchant account early. The verification timeline is independent of your app submission, so getting it out of the way means you can flip on monetization later without waiting.</p>

      <h2>Step 7: Familiarize yourself with the console</h2>
      <p>Before you create your first app, spend 15 minutes clicking through the empty console. The left sidebar contains everything you&apos;ll touch over the next few weeks: <em>All apps</em> for your portfolio, <em>Inbox</em> for Google notifications about policy violations, <em>Statistics</em> for performance data, <em>Download reports</em> for revenue and crash data, and <em>Setup</em> for the API access, brand assets, and team settings.</p>
      <p>The most important location to bookmark is <strong>Policy &amp; programs &rarr; App content</strong>. Almost every rejection comes from a missing or incorrect declaration here: Data Safety form, content rating, target audience, ads declaration, news app declaration, COVID-19 contact tracing declaration, and so on. The wizard handles all of these for you, but knowing they exist in the console is useful when you need to verify something post-submission.</p>

      <h2>What to do while you wait</h2>
      <p>The 1–3 day verification window is dead time only if you make it so. Use it to: prepare your AAB build with target SDK 35 or higher, write a one-sentence pitch for the AI listing generator, sketch out your privacy policy answers, take screenshots of your app on at least one phone form factor, and recruit your 12 closed-test testers if you signed up as a personal account.</p>
      <p>By the time Google clears your identity verification, you should be ready to start the actual wizard for your first app — and the wizard handles every remaining decision, with current policy rules built in.</p>
    </GuideLayout>
  );
}
