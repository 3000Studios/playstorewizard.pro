import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "families-policy-children-apps";
const guide = getGuide(SLUG);
export const metadata = pageMetadata({ title: guide?.title ?? "", description: guide?.summary ?? "", path: `/guides/${SLUG}` });

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>If your app is designed for kids — even partially — you enter a different regulatory universe. The standard Play Store rules tighten significantly, additional rules layer on top, and several common monetization strategies stop being legal. This guide walks the rules that apply when your audience includes under-13 users.</p>

      <h2>What counts as &quot;designed for children&quot;</h2>
      <p>Google evaluates this based on multiple signals: your app&apos;s store-listing audience (set in the Target audience step of the wizard), the visual style (cartoon characters, bright colors, simple UI), the subject matter (kid-themed games, educational apps for early grades), and your declared content rating. If any of these say &quot;kids&quot;, the kids rules apply.</p>
      <p>The official threshold: if your app targets users under 13 OR includes a mixed audience that includes under-13s, you must comply. There is no &quot;just for older kids&quot; exception that bypasses the rules.</p>

      <h2>COPPA compliance</h2>
      <p>The US Children&apos;s Online Privacy Protection Act regulates data collection from children under 13. Even non-US developers must comply if they have US users — which means essentially every Play Store app. Key requirements:</p>
      <ul>
        <li>You cannot collect personal information from a child under 13 without verifiable parental consent.</li>
        <li>Behavioral advertising is prohibited.</li>
        <li>You cannot enable user-to-user communication features without explicit parental consent gates.</li>
        <li>You must publish a COPPA-specific privacy policy section that explains what data is collected from children, how it&apos;s used, and how parents can review or delete it.</li>
      </ul>

      <h2>Designed for Families program</h2>
      <p>Apps that target under-13 users can opt into the Designed for Families program. Acceptance brings benefits (featured placements in the Family category, badging on the store listing) and additional restrictions (stricter ad SDKs, content moderation requirements, mandatory parental gate before any external link).</p>
      <p>The Families program is opt-in but if your app is clearly for kids and you don&apos;t opt in, Google may apply the restrictions anyway and you miss the placement benefits. Most kid-app developers opt in deliberately.</p>

      <h2>Approved-only ad SDKs</h2>
      <p>This is where many indie kid-app developers get caught. The Families program restricts ad SDKs to a Google-maintained allow-list. AdMob is approved (with kid-friendly mediation). Most other ad networks are not. If your monetization relies on a niche ad SDK, you may need to switch to AdMob entirely to qualify for the Families program — and even then, you must configure AdMob in kid-safe mode, which significantly reduces eCPM.</p>
      <p>Alternative monetization for kid apps: paid up-front, in-app purchases (with parental gates), subscriptions (with parental gates), and licensing your IP to bigger players who handle distribution.</p>

      <h2>Parental gates</h2>
      <p>Any action with significant consequences — making a purchase, entering personal info, leaving the app to visit a website — must be gated behind a parental challenge that a child cannot easily solve. The typical implementation: a math problem (e.g., &quot;what is 3 + 5?&quot;) presented in a separate UI screen, written in adult-style language. The gate must not be a checkbox or a single-tap confirmation.</p>

      <h2>Mixed-audience apps</h2>
      <p>Apps for &quot;ages 6+&quot; or any range that includes under-13 users must implement a neutral age-gate at first launch. The age gate must not influence the user toward any answer (no smiling faces or sparkles around the &quot;over 13&quot; option). Users who declare under-13 get the kid-mode experience; users who declare 13+ get the standard experience.</p>
      <p>The age gate is one-shot — once a user has answered, you remember the answer and don&apos;t re-ask. Some implementations store the answer in encrypted form on-device only, never transmitting it server-side, to avoid age data becoming personal information.</p>

      <h2>How the wizard handles this</h2>
      <p>Step 8 (Target audience) asks if your app is designed for children. If yes, the wizard&apos;s compliance check verifies you have: in-app account deletion (heightened standard for kid accounts), an appropriate content rating (Everyone or Everyone 10+ for kid apps), COPPA disclosures in your generated privacy policy, and a parental-gate declaration. The pricing step warns against ad-based monetization unless you confirm AdMob in kid-safe mode.</p>
    </GuideLayout>
  );
}
