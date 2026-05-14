import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for Playstore Wizard — what data we collect, how we use it, and how to delete it.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbLd([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }])} />
      <article className="container max-w-3xl py-20">
        <Reveal>
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-5xl tracking-tight text-balance">Privacy Policy</h1>
          <p className="mt-4 text-sm text-text-muted">Last updated: May 13, 2026</p>
        </Reveal>
        <div className="prose-guide mt-10">
          <p>This Privacy Policy explains how 3000Studios (&quot;we&quot;, &quot;us&quot;) collects, uses, and protects information when you use the Playstore Wizard website and services (the &quot;Service&quot;).</p>
          <h2>1. Information we collect</h2>
          <h3>1.1 Information you provide</h3>
          <p>The wizard state — your app information, listing copy, screenshots, AAB metadata, Data Safety answers, and similar — is stored in your browser&apos;s localStorage. It is not sent to our servers unless you explicitly click an action that requires server processing (such as &quot;Generate listing with AI&quot; or &quot;Submit to Play Console&quot;).</p>
          <h3>1.2 Account information (Pro and Studio users)</h3>
          <p>If you create a paid account, we collect your email address, payment processor identifier (e.g. Stripe customer ID), and subscription state. We do not store credit card numbers — those go directly to Stripe.</p>
          <h3>1.3 Usage data</h3>
          <p>We collect basic anonymized analytics: page views, wizard completion rates, browser type, screen size. No personally identifying information is associated with these events.</p>
          <h3>1.4 Cookies</h3>
          <p>We use a minimal set of essential cookies for authentication (when logged in) and a single first-party analytics cookie. We do not use third-party advertising cookies for behavioral targeting, except as set by Google AdSense — see Section 4.</p>
          <h2>2. How we use your information</h2>
          <p>We use collected information solely to operate, maintain, and improve the Service. We do not sell user data. We do not share user data with third parties except as required to deliver the Service (payment processor, hosting provider) or to comply with legal obligations.</p>
          <h2>3. Data sent to AI providers</h2>
          <p>When you click &quot;Generate&quot; on an AI-powered field, the text you have typed (and only that text) is sent to Cloudflare Workers AI for processing. Cloudflare does not retain prompt data for model training under our service agreement. If you have configured a local Ollama endpoint, prompts go to your local machine instead and never leave your device.</p>
          <h2>4. Advertising (AdSense)</h2>
          <p>Our content pages display ads via Google AdSense. Google may use cookies and similar technologies to serve ads based on your previous visits to our or other websites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads">Google&apos;s ad settings</a>. EU/UK users will see a consent banner before any non-essential cookies are set.</p>
          <h2>5. Data retention</h2>
          <p>Wizard state remains in your browser indefinitely until you clear it. Account data is retained while your subscription is active and for 90 days after cancellation, then permanently deleted unless legally required to retain longer.</p>
          <h2>6. Your rights</h2>
          <p>You may request access, correction, or deletion of your data at any time by emailing <a href="mailto:privacy@playstorewizard.pro">privacy@playstorewizard.pro</a>. We respond within 30 days. EU residents have the rights described in the GDPR; California residents have the rights described in the CCPA/CPRA.</p>
          <h2>7. Children</h2>
          <p>The Service is not intended for users under 16. We do not knowingly collect data from children under 16.</p>
          <h2>8. Changes to this policy</h2>
          <p>We may update this Privacy Policy from time to time. Material changes will be announced via email or an in-app banner.</p>
          <h2>9. Contact</h2>
          <p>Questions about this policy: <a href="mailto:privacy@playstorewizard.pro">privacy@playstorewizard.pro</a>.</p>
        </div>
      </article>
    </>
  );
}
