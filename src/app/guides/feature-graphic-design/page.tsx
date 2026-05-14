import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "feature-graphic-design";
const guide = getGuide(SLUG);
export const metadata = pageMetadata({ title: guide?.title ?? "", description: guide?.summary ?? "", path: `/guides/${SLUG}` });

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>The feature graphic is a 1024 × 500 image that sits at the top of your Play Store listing on tablets and in featured placements. It&apos;s mandatory — you cannot publish without one. And it&apos;s where most indie apps make a bad first impression because it requires actual graphic design, not screenshot capture.</p>

      <h2>The required dimensions</h2>
      <p>Exactly 1024 × 500 pixels. No transparency. JPEG or 24-bit PNG. Maximum file size 1 MB. Smaller files load faster on slow connections — aim for 200–400 KB after compression.</p>

      <h2>Where it actually appears</h2>
      <p>On phones, the feature graphic is hidden. The store shows your icon, title, short description, and screenshots — the feature graphic doesn&apos;t appear unless you&apos;re featured by Google. On tablets, it sits at the top of every listing visit. In Google&apos;s editorial placements (Editor&apos;s Choice, Top Charts, category banners), it&apos;s often the primary visual.</p>
      <p>The implication: design for the cases where it matters. Tablet users and Google editors. Both of those audiences are predisposed to like good design — your feature graphic should look like marketing material, not a screenshot.</p>

      <h2>Composition rules</h2>
      <p><strong>Safe zone:</strong> keep critical content within the center 924 × 400 region. Play sometimes crops the edges, especially on smaller tablets in landscape orientation.</p>
      <p><strong>Text size:</strong> if you include text (and you probably should), keep it large — at least 36px equivalent at 1024 wide. The graphic is viewed at thumbnail sizes too, where small text becomes unreadable.</p>
      <p><strong>Focal point:</strong> place your primary subject left-of-center. Tablet listings put a small play button overlay in the right portion of the graphic; right-aligned content can get covered.</p>

      <h2>What to put in it</h2>
      <p>The three components that work, in order: brand name, one-line value prop, product imagery.</p>
      <p>The brand name appears even though it&apos;s already in your title and icon, because the graphic is sometimes the only branded element shown in editorial placements.</p>
      <p>The one-line value prop is your short description re-skinned as a billboard. &quot;Build habits that actually stick&quot;. &quot;The fastest way to convert your invoices&quot;. &quot;A calmer way to track your money&quot;. Concrete, benefit-led, short enough to read in one glance.</p>
      <p>Product imagery — a hero shot of your icon, a stylized device frame with a screenshot, an illustration of your product in use — gives the eye something to land on after reading the text.</p>

      <h2>What not to put in it</h2>
      <ul>
        <li><strong>Awards and accolades.</strong> &quot;Editor&apos;s Choice 2025&quot;, &quot;5-star rated&quot;, &quot;Featured by TechCrunch&quot; — Google rejects these as misleading promotional claims unless documented.</li>
        <li><strong>Pricing claims.</strong> &quot;Free&quot;, &quot;Limited time&quot;, &quot;50% off&quot; — same rejection category as awards.</li>
        <li><strong>Call-to-action buttons.</strong> &quot;Download Now&quot; or &quot;Install Free&quot; faked as a button. Misleading and rejected.</li>
        <li><strong>Device frames that look like competitors&apos; devices.</strong> An iPhone-shaped device frame for an Android app violates Google&apos;s policy against misleading branding.</li>
      </ul>

      <h2>Designing one if you&apos;re not a designer</h2>
      <p>The wizard&apos;s asset studio includes a feature graphic generator. You provide your icon and a brand color; it produces a 1024 × 500 graphic with your icon centered-left, your app name and short description rendered in the brand color&apos;s contrast pair, and a subtle background gradient. The output isn&apos;t art-directed for a flagship app, but it&apos;s clean, professional, and meets Google&apos;s requirements.</p>
      <p>If you want to hire it out, expect to pay $50–200 for a competent freelancer on Fiverr or Dribbble. Provide them with your app icon, brand colors, and 2–3 examples of feature graphics in your category that you like the look of.</p>

      <h2>Iteration over time</h2>
      <p>Your feature graphic is updateable. Many successful indies refresh it 2–4 times a year — seasonal art, new feature highlights, holiday tie-ins. Play Console doesn&apos;t treat graphic updates as a new app review, so changes go live within an hour. This is a low-cost lever for keeping your listing feeling alive.</p>
    </GuideLayout>
  );
}
