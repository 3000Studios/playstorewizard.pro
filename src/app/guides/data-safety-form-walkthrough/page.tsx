import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "data-safety-form-walkthrough";
const guide = getGuide(SLUG);

export const metadata = pageMetadata({
  title: guide?.title ?? "",
  description: guide?.summary ?? "",
  path: `/guides/${SLUG}`,
});

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>The Data Safety form is the single most-rejected element of a Google Play submission. It is also the most misunderstood, because Google&apos;s wording is precise legal language describing technical realities that even careful developers misinterpret. This is the question-by-question walkthrough we wish existed when we filed our first one.</p>

      <h2>Why this form is hard</h2>
      <p>The Data Safety form asks you to describe — accurately, comprehensively, and in Google&apos;s own categorical language — what data your app collects, what it shares with third parties, how it secures that data, and whether the user can opt out. Inaccurate answers result in policy strikes, which compound over time and eventually trigger account suspension. So Google encourages developers to answer carefully. But the form&apos;s categories often do not match how developers think about their app&apos;s data flow.</p>

      <h2>Section 1: Data collection and security</h2>
      <p><strong>Does your app collect or share any of the required user data types?</strong> Almost always yes, even for simple apps. If your app uses crash reporting (Firebase Crashlytics, Sentry, etc.), it collects diagnostic data. If it uses any analytics, it collects user actions. If it has any kind of account system, it collects user identifiers. Saying &quot;no&quot; here when any of these are true is the most common form of misreporting.</p>
      <p><strong>Is all of the user data collected by your app encrypted in transit?</strong> The answer should be yes unless your app makes deliberate plain-HTTP requests. Modern Android already enforces HTTPS by default. If you have a backend, you almost certainly use HTTPS. Answer yes and verify by spot-checking your network calls.</p>
      <p><strong>Do you provide a way for users to request that their data is deleted?</strong> If your app has any account system or persistent user data, the answer must be yes. As of 2023, in-app account deletion is a separate enforceable policy. The answer should reflect both in-app deletion (a button inside the app) and an external deletion path (a web form or support email).</p>

      <h2>Section 2: Data types collected</h2>
      <p>Google groups data into 14 categories. Some non-obvious mappings:</p>
      <ul>
        <li><strong>Approximate location</strong> — IP-based geolocation counts. If you ever read a country, region, or city from the user&apos;s IP, you collect approximate location.</li>
        <li><strong>Precise location</strong> — GPS, Wi-Fi triangulation, or anything more precise than city-level.</li>
        <li><strong>User IDs</strong> — Firebase user IDs, your own custom user IDs, even pseudonymous handles. If you store an identifier that links across sessions, you collect a user ID.</li>
        <li><strong>Device or other IDs</strong> — Advertising ID, Android ID, install ID. Most analytics SDKs collect at least one of these.</li>
        <li><strong>App activity / In-app interactions</strong> — Any behavioral analytics: screen views, button clicks, time on page. Even &quot;privacy-preserving&quot; analytics collect this.</li>
        <li><strong>Crash logs</strong> — Crash reporting, structured error logs.</li>
        <li><strong>Diagnostics</strong> — Performance metrics, frame rate, network latency, similar.</li>
      </ul>

      <h2>Section 3: Purpose</h2>
      <p>For each data type collected, Google asks the purpose: app functionality, analytics, developer communications, advertising, fraud prevention, personalization, or account management. Multiple purposes can apply to one data type. Pick all that genuinely apply — over-declaring is safer than under-declaring.</p>
      <p>One trap: if you collect email addresses for &quot;account management&quot; and also send them marketing newsletters, you must also declare &quot;developer communications&quot;. Failing to declare a purpose Google can detect (e.g. via outbound traffic patterns or store-listing screenshots) triggers a review.</p>

      <h2>Section 4: Sharing</h2>
      <p>This trips up developers who use analytics, ad networks, or backend-as-a-service providers. Google&apos;s definition of &quot;sharing&quot; is broad: data is shared if it&apos;s transferred to a third party for that party&apos;s purposes, including their own analytics or fraud detection. If you use Firebase Analytics, technically Google is the third party — but Google has carved out an exception for first-party Google services, so Firebase doesn&apos;t count as sharing.</p>
      <p>Third-party ad networks, third-party crash reporting (Sentry, Bugsnag), third-party analytics (Mixpanel, Amplitude), CRM integrations, and customer-support tools (Intercom, Zendesk) all count as sharing.</p>

      <h2>Section 5: Optional fields</h2>
      <p>You can mark each data type as optional or required. Optional means the user can decline to provide it and still use the app. Required means the data is necessary for the app to function. Marking everything as required is technically allowed but reduces your trust signal — be honest about what&apos;s genuinely required versus enhancement.</p>

      <h2>The validation step</h2>
      <p>After filling the form, Google scans your most recent AAB against the declarations. If your AAB makes network calls or has SDKs not consistent with your declarations, you get a warning. Common mismatches: your app includes an ad SDK but you declared no advertising, your app uses Firebase Analytics but you declared no analytics, your app reads contacts but you didn&apos;t declare contacts. Fix mismatches before submitting — they slow review and sometimes trigger rejection.</p>

      <h2>How the wizard handles this</h2>
      <p>The wizard&apos;s Data Safety step asks every question in yes/no form, with plain-English explanations of what each category really covers. Answers feed both the Data Safety form export (for paste into Play Console) and the auto-generated privacy policy, so the two are always consistent.</p>
    </GuideLayout>
  );
}
