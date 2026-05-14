import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "aab-vs-apk-explained";
const guide = getGuide(SLUG);
export const metadata = pageMetadata({ title: guide?.title ?? "", description: guide?.summary ?? "", path: `/guides/${SLUG}` });

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>If you have built Android apps before 2021, you remember APKs. Single file, ship as-is, easy to sideload. Then Google switched. Since August 2021, every new submission to the Play Store must be an Android App Bundle (AAB). APKs are still everywhere — sideloading, alternative stores, debug builds — but the official Google Play submission format is exclusively AAB.</p>

      <h2>What an AAB actually is</h2>
      <p>An AAB is a ZIP archive with a specific internal structure. It contains your app&apos;s code, resources, native libraries, and a manifest, organized by configuration: base module, dynamic feature modules (optional), per-architecture native code, per-language resources, per-density images. Crucially, an AAB is not directly installable on a device. Google&apos;s servers — or the open-source bundletool — split it into device-specific APKs at download time.</p>
      <p>For a typical app, the AAB is roughly the same size as the equivalent universal APK on disk. The savings happen on the user&apos;s end: instead of downloading every architecture and density, the user gets only their device&apos;s slice. App size drops 20–60% in practice.</p>

      <h2>Why Google forced the switch</h2>
      <p>Three reasons. First, install size: users with low storage and slow connections benefit massively. Second, dynamic delivery: AAB enables features like Play Asset Delivery (huge game assets downloaded post-install) and Play Feature Delivery (entire app modules installed only when needed). Third, signing-key management: AAB submissions require Play App Signing, where Google holds the production signing key. This makes it harder for malicious actors to publish modified versions of legitimate apps under a stolen developer account.</p>

      <h2>The signing-key tradeoff</h2>
      <p>Play App Signing is mandatory for new AAB submissions. Google holds your app&apos;s production signing key in their secure key management system; you upload AABs signed with an &quot;upload key&quot; (which you keep) and Google re-signs them with the production key before distribution.</p>
      <p>This is convenient (you can lose your upload key and recover by contacting Google) but irreversible (once Google has the production key, there is no path back to self-signing). New apps cannot opt out; existing apps that were self-signing before 2021 can continue, but if you migrate to AAB you accept Play App Signing.</p>

      <h2>How to build an AAB</h2>
      <p>From Android Studio: <em>Build &rarr; Generate Signed Bundle / APK &rarr; Android App Bundle</em>. From the command line: <code>./gradlew bundleRelease</code>. The output lands at <code>app/build/outputs/bundle/release/app-release.aab</code>.</p>
      <p>React Native: <code>cd android &amp;&amp; ./gradlew bundleRelease</code>. Flutter: <code>flutter build appbundle</code>. Unity: in the build settings, check &quot;Build App Bundle (Google Play)&quot;.</p>

      <h2>Testing an AAB locally</h2>
      <p>You cannot directly install an AAB on a device. To test, use Google&apos;s <code>bundletool</code>:</p>
      <pre><code>{`bundletool build-apks --bundle=app.aab --output=app.apks
bundletool install-apks --apks=app.apks`}</code></pre>
      <p>This generates the device-specific APK split for the connected device and installs it. Use this to verify your release AAB before uploading.</p>

      <h2>What the wizard reads</h2>
      <p>Step 2 of the wizard parses your AAB in the browser — no bundletool required. It reads the binary AndroidManifest.xml from <code>base/manifest/</code>, decodes the resource format, and pulls out: package name, version name and code, min and target SDK, and the full permission list. Your AAB never leaves your device.</p>

      <h2>When to still use APKs</h2>
      <p>APK is still the right format for: sideloading (direct installs without Play Store), alternative app stores (Amazon Appstore, F-Droid, Huawei AppGallery, Samsung Galaxy Store), enterprise distribution (MDM-pushed builds), and debug development. Most build systems produce both formats from the same source.</p>
    </GuideLayout>
  );
}
