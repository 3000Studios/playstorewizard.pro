import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description: "How Playstore Wizard uses cookies and similar tracking technologies.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbLd([{ name: "Home", path: "/" }, { name: "Cookie Policy", path: "/cookies" }])} />
      <article className="container max-w-3xl py-20">
        <Reveal>
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-5xl tracking-tight text-balance">Cookie Policy</h1>
          <p className="mt-4 text-sm text-text-muted">Last updated: May 13, 2026</p>
        </Reveal>
        <div className="prose-guide mt-10">
          <p>This Cookie Policy explains how Playstore Wizard uses cookies and similar tracking technologies. Read alongside our <a href="/privacy">Privacy Policy</a>.</p>
          <h2>What is a cookie?</h2>
          <p>A cookie is a small text file stored on your device by your browser. Cookies allow a website to remember your preferences and recognize you on return visits.</p>
          <h2>Cookies we use</h2>
          <h3>Strictly necessary</h3>
          <ul>
            <li><strong>Session cookie</strong> — keeps you signed in to paid accounts. Expires at the end of the browser session.</li>
            <li><strong>CSRF token</strong> — protects against cross-site request forgery on form submissions. Session-only.</li>
            <li><strong>Cookie consent</strong> — remembers your choice on the consent banner. Expires after one year.</li>
          </ul>
          <h3>Advertising (Google AdSense)</h3>
          <ul>
            <li>If Google AdSense is enabled after approval, Google may set cookies or similar technologies to serve and measure ads. Read <a href="https://policies.google.com/technologies/ads">Google&apos;s ad cookie policy</a> for details.</li>
          </ul>
          <h2>Managing cookies</h2>
          <p>You can disable or block cookies in your browser settings. Most browsers also offer a &quot;private&quot; or &quot;incognito&quot; mode that does not retain cookies between sessions. Note that some site features require cookies to function.</p>
          <p>EU/UK users see a consent banner on first visit. You can revisit this page for information about your choices.</p>
          <h2>Updates</h2>
          <p>This policy may be updated to reflect changes in the cookies we use. The &quot;last updated&quot; date at the top will reflect the latest revision.</p>
        </div>
      </article>
    </>
  );
}
