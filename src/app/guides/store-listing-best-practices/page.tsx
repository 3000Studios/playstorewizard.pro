import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "store-listing-best-practices";
const guide = getGuide(SLUG);
export const metadata = pageMetadata({ title: guide?.title ?? "", description: guide?.summary ?? "", path: `/guides/${SLUG}` });

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>Your Play Store listing is the difference between an install and a back-button. Users spend an average of 7 seconds deciding whether to install — most of that on the title, icon, first screenshot, and the truncated &quot;above the fold&quot; preview of your description. Every element matters. Here is how to write a listing that actually converts.</p>

      <h2>The title (30 characters)</h2>
      <p>Your title appears in search results, on the install page, and on the user&apos;s home screen after they install. The 30-character limit is hard. Most successful indie apps use the pattern <em>BrandName: Category Descriptor</em>. Example: &quot;Bloom: Habit Tracker&quot;. Brand name first because it&apos;s what you want to imprint; descriptor second so users searching for &quot;habit tracker&quot; find you.</p>
      <p>Do not stuff keywords. Google flags titles like &quot;Habit Tracker Daily Routine Planner Free&quot; as keyword-stuffed and either rejects them or down-ranks them in search.</p>

      <h2>The short description (80 characters)</h2>
      <p>The single most important piece of conversion copy in your listing. This is what users see in search results, recommendations, and the &quot;above the fold&quot; preview on your install page. Write it as a benefit, not a feature. &quot;Track unlimited habits with auto-reminders&quot; is feature copy. &quot;Build routines that actually stick — without streak guilt&quot; is benefit copy. Benefit wins.</p>
      <p>Aim for 60–80 characters. Lead with the most concrete user outcome you can promise. Avoid marketing fluff (&quot;revolutionary&quot;, &quot;ultimate&quot;, &quot;world-class&quot;) — it&apos;s noise that signals weak product confidence.</p>

      <h2>The full description (4000 characters)</h2>
      <p>The first 167 characters are visible before the user taps &quot;Read more&quot;. Treat those first 167 like another short description. They should be a complete sentence that ends naturally — Google&apos;s preview cuts mid-word and looks unprofessional if your opening runs long.</p>
      <p>After the fold, structure the description as: opening pitch (1 paragraph), bulleted features (5–8 bullets), social proof if any, call to action, contact info. Keep paragraphs short — most readers are on phones in landscape elevators.</p>
      <p>Aim for 800–2000 characters total. Longer descriptions don&apos;t convert better, and they look like effort filler.</p>

      <h2>Screenshots</h2>
      <p>Two screenshots is the minimum; the first three are the ones that actually get viewed. Lead with your strongest screen — usually the &quot;hero&quot; screen that shows what your app does in one glance. Avoid leading with a login screen, an empty state, or marketing collateral pretending to be a screenshot.</p>
      <p>Annotated screenshots (with captions explaining the feature) convert better than raw captures. Use a consistent visual style: same background color, same font, same caption placement. Sloppy variation reads as unfinished.</p>

      <h2>The feature graphic (1024×500)</h2>
      <p>Shown at the top of your listing on tablets and on featured placements. Treat it as a billboard: brand name, one-line value prop, optional product hero shot. Keep critical content in the center — Play crops the edges on small phones.</p>

      <h2>Icon design</h2>
      <p>A few rules: solid background (no transparency), bold simple shape that reads at 48px, distinct color from competitors in your category, no text (it&apos;s unreadable at small sizes). Adaptive icons are now mandatory — design the foreground and background layers separately and test how they look in round, square, and squircle masks.</p>

      <h2>Translations</h2>
      <p>Listings translated into local languages convert 2–3x better than English-only listings in non-English markets. Don&apos;t translate every market — pick the top 3 by your category&apos;s download distribution and translate those. Spanish (LatAm), Portuguese (Brazil), Japanese, German, French, and Hindi are usually high-value depending on category.</p>

      <h2>A/B testing</h2>
      <p>Play Console&apos;s Store Listing Experiments feature lets you split traffic between variants of your title, icon, screenshots, or description. Run one experiment at a time, give it at least two weeks for statistical significance, and avoid running experiments during major events (holidays, new device launches) that distort baseline.</p>
    </GuideLayout>
  );
}
