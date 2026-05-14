import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "target-api-level-android-15";
const guide = getGuide(SLUG);

export const metadata = pageMetadata({
  title: guide?.title ?? "",
  description: guide?.summary ?? "",
  path: `/guides/${SLUG}`,
});

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>If your app bundle targets an Android version older than API 35, Google Play will reject your submission. This is not a warning, not a deprecation notice — it&apos;s a hard rejection that takes effect the moment you click submit. The rule has been live since August 2025, and the next step (API 36) lands in August 2026. Here&apos;s what the requirement means in practice, how to update your build, and how to think about the rolling deadlines so you stop reading this guide every year.</p>

      <h2>What &quot;target API level&quot; actually means</h2>
      <p>Every Android app declares two API levels in its manifest: <code>minSdkVersion</code> (the lowest version it will install on) and <code>targetSdkVersion</code> (the version it was built and tested against). The first controls device reach. The second controls how Android behaves toward your app — newer behaviors apply only if you opt into them by raising the target.</p>
      <p>Google&apos;s target-API rule exists because of the second one. When you target an old API level, Android serves your app legacy behaviors: relaxed permission checks, deprecated storage models, less-strict background limits. Over time, the gap between your app and modern Android grows, and the security model degrades for users.</p>

      <h2>The current rule</h2>
      <p>Since August 31, 2025, every new app and every app update on Google Play must target API 35 (Android 15) or higher. There is no waiver for indie developers, no exception for low-revenue apps, and no path to publish an update if you do not comply.</p>
      <p>For apps you have already published that have not been updated since the deadline: they remain available on the Play Store and existing users keep them. But you cannot push any update — bug fix, feature, or otherwise — until you bump the target.</p>

      <h2>The upcoming rule (August 2026)</h2>
      <p>Google announces these deadlines about a year in advance. The pattern is: each August, the minimum target jumps by one major version. Based on the published roadmap, August 2026 will require API 36 (Android 16) for new submissions and for updates to existing apps. The wizard&apos;s compliance check will start warning you about API 36 in February 2026 even though it&apos;s not yet a blocker, so you have lead time to plan.</p>

      <h2>How to update your target</h2>
      <p>The exact change depends on your build system. For most modern Android projects using Gradle:</p>
      <pre><code>{`android {
    compileSdk = 35
    defaultConfig {
        targetSdk = 35
        minSdk = 24 // or higher, your choice
    }
}`}</code></pre>
      <p>For React Native: open <code>android/build.gradle</code> and update <code>compileSdkVersion</code>, <code>targetSdkVersion</code>, and <code>buildToolsVersion</code> to 35. For Flutter: edit <code>android/app/build.gradle</code> with the same fields. For Cordova/Capacitor: similar locations.</p>
      <p>After the version bump, you must rebuild with the latest Android Studio (Hedgehog or later) or command-line SDK manager. The Play Console can read your bundle&apos;s manifest and will reject the upload at the bundle stage, not at submission — so failed uploads are diagnostic, not catastrophic.</p>

      <h2>The breaking changes that come with API 35</h2>
      <p>Bumping the target is more than a version number — Android applies new behaviors to your app automatically. Some that frequently break things:</p>
      <p><strong>Edge-to-edge by default.</strong> Apps targeting API 35 render full-screen by default. If your layout assumed a system status bar at the top or nav bar at the bottom, content now goes behind them. The fix is usually one ViewCompat call to apply window insets.</p>
      <p><strong>Foreground service types are stricter.</strong> If you use foreground services (downloads, location tracking, music playback), you must declare the service type in the manifest and the permission in the runtime. Apps with generic <code>android:foregroundServiceType=&quot;dataSync&quot;</code> declarations get extra scrutiny.</p>
      <p><strong>Photo Picker for media access.</strong> The legacy <code>READ_EXTERNAL_STORAGE</code> permission no longer grants access to all media on API 35. You should use the Photo Picker API for selecting specific photos/videos, and request <code>READ_MEDIA_IMAGES</code> or <code>READ_MEDIA_VIDEO</code> only if you genuinely need full library access.</p>
      <p><strong>Predictive back gesture.</strong> On API 35, the back-button animation previews where the user is going before they commit. Apps with non-standard back-press handling sometimes break visually.</p>

      <h2>How to test before submitting</h2>
      <p>Set up an Android 15 emulator or a physical device running Android 15. Run your app through the major user flows. Focus on: app launch, login/signup, navigation between screens, any media-picker or file-picker flows, foreground operations (downloads, location, audio), and the back gesture. The wizard&apos;s compliance check reads your bundle but cannot test runtime behavior — that part is on you.</p>

      <h2>What to do if you cannot update right now</h2>
      <p>Sometimes you have a published app you cannot or do not want to update yet — it&apos;s in maintenance mode, the codebase uses an abandoned SDK, the build pipeline is broken. Your options:</p>
      <ol>
        <li>Leave it as-is. The app stays on the Play Store but you cannot push updates. New installs continue, but you accept the gradual degradation as Android moves on.</li>
        <li>Apply for an extension. Google sometimes grants short extensions (typically up to 6 months) for apps with significant install bases facing genuine technical blockers. Apply via the Play Console help center; expect a manual review.</li>
        <li>Unpublish and rewrite. If the codebase is unsalvageable, unpublishing prevents new bad reviews while you rebuild on modern tooling.</li>
      </ol>

      <h2>How the wizard handles this</h2>
      <p>When you drop your AAB into Step 2 of the wizard, the bundle parser reads <code>targetSdkVersion</code> from your manifest. If it&apos;s below the current minimum (35 right now, 36 starting August 2026), the compliance step shows a blocker with the specific number you read and the number you need. There&apos;s no submitting around it — Google will reject anyway, so we reject it first to save you the round trip.</p>
    </GuideLayout>
  );
}
