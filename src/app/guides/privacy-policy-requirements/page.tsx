import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "privacy-policy-requirements";
const guide = getGuide(SLUG);
export const metadata = pageMetadata({ title: guide?.title ?? "", description: guide?.summary ?? "", path: `/guides/${SLUG}` });

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>Every app on Google Play needs a privacy policy — a publicly reachable URL containing specific disclosures about what data you collect, how you use it, and how users exercise their rights. Submission gets rejected at this step more than almost any other. Here is what the URL needs to contain, where to host it, and how to write one that survives reviewer scrutiny.</p>

      <h2>When a privacy policy is required</h2>
      <p>The short answer is: always, for new submissions. Google&apos;s current rule treats every app as collecting at least diagnostic information through the install process, so every app needs the URL. Even apps with zero user-facing data collection (offline calculators, simple utilities) are no longer exempt.</p>
      <p>For apps that collect any personal data — even just an email or a user ID — the requirements are stricter. Apps in the Families program (designed for under-13 audiences) face additional COPPA and Designed for Families disclosure requirements on top of the general rule.</p>

      <h2>What the URL must point to</h2>
      <p>A publicly accessible HTML page (no login wall, no geo-blocking from major markets, no JavaScript-only rendering that crawlers can&apos;t see). The URL must remain stable — Google revisits it periodically, and a broken link triggers a re-review and possible app suspension. The page must be in the same language as your app&apos;s primary listing locale, with translations recommended but not required for other listing locales.</p>

      <h2>What the policy must contain</h2>
      <p>At minimum:</p>
      <ul>
        <li>The developer&apos;s legal name and a working contact email.</li>
        <li>The categories of personal data the app collects.</li>
        <li>The purposes for which each category is collected.</li>
        <li>Whether the data is shared with third parties, and if so, which ones (or which categories of recipients).</li>
        <li>How long data is retained.</li>
        <li>How users can exercise their rights — access, correction, deletion, portability.</li>
        <li>Specific GDPR disclosures for EU users (data controller, legal basis, supervisory authority).</li>
        <li>Specific CCPA/CPRA disclosures for California users.</li>
        <li>Specific COPPA disclosures if the app is directed at children under 13.</li>
        <li>The date of last update.</li>
      </ul>
      <p>The policy must match your Data Safety form answers. Mismatches between the two are one of the most common review-triggering issues. If you declare crash logs in the Data Safety form but your privacy policy doesn&apos;t mention them, expect a back-and-forth.</p>

      <h2>Where to host it</h2>
      <p>Your own domain is best — it signals legitimacy and you control uptime. If you don&apos;t have a domain, GitHub Pages, Notion public pages, Cloudflare Pages, and Vercel all offer free static hosting on subdomains that Google accepts.</p>
      <p>Free privacy-policy hosting services (TermsFeed, FreePrivacyPolicy, app-privacy-policy-generator) exist but are weaker signals. They&apos;re accepted but Google&apos;s reviewers occasionally flag them as &quot;template policies&quot; and request more specificity.</p>

      <h2>What the wizard generates</h2>
      <p>Step 9 of the wizard reads your Data Safety answers (Step 7) and generates a complete privacy policy in HTML. The output covers the required sections above, populates them with the specific data types and purposes you declared, and includes the GDPR/CCPA/COPPA blocks where your audience requires them. You can download the HTML and host it anywhere static, or paste it into your existing site.</p>
      <p>The generated policy is meant to be a strong starting point, not a final legal document. For apps handling regulated data (health information, financial information, children&apos;s data at scale, EU users in regulated industries), consult an attorney to review the generated policy before submission.</p>
    </GuideLayout>
  );
}
