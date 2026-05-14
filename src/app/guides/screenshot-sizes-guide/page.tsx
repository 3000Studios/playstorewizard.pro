import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "screenshot-sizes-guide";
const guide = getGuide(SLUG);
export const metadata = pageMetadata({ title: guide?.title ?? "", description: guide?.summary ?? "", path: `/guides/${SLUG}` });

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>Google Play has six possible screenshot categories, each with its own dimensions, aspect ratios, and minimum/maximum file counts. Submit the wrong size and your upload is rejected. Submit too few and your listing looks unfinished. Here is every dimension, what it&apos;s for, and what to do if you only have phone screenshots.</p>

      <h2>Phone screenshots</h2>
      <p><strong>Required.</strong> Minimum 2, maximum 8. Aspect ratio between 16:9 and 9:16. Recommended size: 1080 × 1920 (portrait) or 1920 × 1080 (landscape). Minimum dimension on either side: 320 pixels. Maximum: 3840 pixels. JPEG or 24-bit PNG, no alpha.</p>
      <p>Phone screenshots are non-negotiable. They appear on every device that views your listing. Two is the absolute minimum to publish — three to five is the sweet spot.</p>

      <h2>7-inch tablet screenshots</h2>
      <p>Optional but strongly recommended. Up to 8 screenshots, between 16:9 and 9:16 aspect. Common size: 1200 × 1920 portrait. If your app has a tablet-specific layout, show it. If your app just stretches the phone UI, you can omit these — but Google&apos;s ranking algorithm slightly favors apps with tablet screenshots.</p>

      <h2>10-inch tablet screenshots</h2>
      <p>Optional. Up to 8. Common size: 1600 × 2560 portrait or 2560 × 1600 landscape. Same considerations as 7-inch: include if your app has a real tablet layout, skip otherwise.</p>

      <h2>Android TV screenshots</h2>
      <p>Required only if you target Android TV. Up to 8. Landscape only, exactly 1920 × 1080. TV screenshots are taken from inside the TV emulator or device, not resized from phone captures.</p>

      <h2>Wear OS screenshots</h2>
      <p>Required only if you target Wear OS. Up to 8. Square, typically 400 × 400 or 384 × 384. Captured from the watch face or watch emulator.</p>

      <h2>Chromebook screenshots</h2>
      <p>Optional and rarely seen. Up to 8 landscape screenshots at 1280 × 800 or similar. Worth including only if your app has a Chromebook-optimized layout.</p>

      <h2>The padded-screenshot trick</h2>
      <p>You don&apos;t have a 7-inch tablet but want to include tablet screenshots for the ranking boost? Pad your phone screenshots with a solid-color background to hit tablet aspect ratios. This is technically allowed and unfortunately common. The wizard&apos;s asset studio does this automatically — your phone screenshot becomes a centered image on a brand-colored background sized to whichever tablet dimension you need.</p>
      <p>Padded screenshots look slightly worse than real tablet captures but better than missing tablet screenshots entirely. Google&apos;s ranking signal seems to count any tablet screenshot regardless of whether it&apos;s padded.</p>

      <h2>What to put in your screenshots</h2>
      <p>Lead with your hero screen — the screen that immediately communicates what the app does. Not the login screen, not the loading screen, not a marketing collage. Show the actual product.</p>
      <p>Annotated screenshots (caption text overlaid on top, explaining what feature is shown) convert 30–60% better than unannotated. Keep annotations short — three or four words max. Pick a single brand color for annotations and stick to it.</p>

      <h2>Common rejection reasons</h2>
      <ul>
        <li>Dimensions outside the allowed range.</li>
        <li>Screenshots that include UI from other apps (e.g. the Android status bar still showing other notifications).</li>
        <li>Screenshots that show competing brands or copyrighted content you don&apos;t own.</li>
        <li>Misleading screenshots — showing features the app does not actually have.</li>
        <li>Promotional copy that promises something the app doesn&apos;t deliver.</li>
      </ul>

      <h2>How the wizard handles this</h2>
      <p>Drop your phone screenshots in Step 3. The asset studio auto-resizes them to every required dimension: phone (multiple aspect ratios if needed), 7-inch tablet, 10-inch tablet. You get a ZIP with everything labeled and named correctly for direct upload to Play Console.</p>
    </GuideLayout>
  );
}
