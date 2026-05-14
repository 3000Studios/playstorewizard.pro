import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Disclaimer",
  description: "Disclaimer about Playstore Wizard's relationship with Google and the limitations of policy compliance tooling.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbLd([{ name: "Home", path: "/" }, { name: "Disclaimer", path: "/disclaimer" }])} />
      <article className="container max-w-3xl py-20">
        <Reveal>
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-5xl tracking-tight text-balance">Disclaimer</h1>
          <p className="mt-4 text-sm text-text-muted">Last updated: May 13, 2026</p>
        </Reveal>
        <div className="prose-guide mt-10">
          <h2>Not affiliated with Google</h2>
          <p>Playstore Wizard is an independent product built by 3000Studios. We are not affiliated with, endorsed by, or sponsored by Google LLC. &quot;Google Play&quot;, &quot;Play Store&quot;, &quot;Play Console&quot;, and &quot;Android&quot; are trademarks of Google LLC. We use these names solely to describe the platform our tool helps you publish to.</p>
          <h2>No guarantee of approval</h2>
          <p>The compliance check in this tool reflects our best understanding of current Google Play policies. Google retains sole discretion over policy enforcement and Play Store approval decisions. A &quot;ready to submit&quot; result does not guarantee approval. We strongly recommend reading Google&apos;s <a href="https://play.google.com/about/developer-content-policy/">Developer Program Policies</a> in full before submitting any app.</p>
          <h2>Not legal advice</h2>
          <p>Nothing in this tool, including the auto-generated privacy policies and compliance rule explanations, constitutes legal advice. If your app handles sensitive data (health, children&apos;s data, financial), if you operate in regulated industries (banking, healthcare), or if you have any doubt about compliance with applicable law, consult a qualified attorney.</p>
          <h2>Not financial advice</h2>
          <p>The pricing recommender and revenue projection features are illustrative, based on category averages and assumptions you provide. Actual revenue depends on factors beyond our visibility, including app quality, marketing, market conditions, and platform policy changes. Do not treat projections as forecasts.</p>
          <h2>Policy updates</h2>
          <p>Google Play policies change frequently. We aim to update the compliance engine within 7 days of any material policy announcement, but there may be a window during which the rules in this tool lag the live policy. Always cross-check critical decisions against the current Play Console documentation.</p>
          <h2>Third-party services</h2>
          <p>This tool integrates with Cloudflare Workers AI (for AI generation), Google Play Developer API (for submission), and Stripe (for paid subscriptions). Use of those services is governed by their respective terms. We are not responsible for outages, errors, or policy changes from upstream providers.</p>
        </div>
      </article>
    </>
  );
}
