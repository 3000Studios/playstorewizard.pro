import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, buildFaqLd, pageMetadata } from "@/lib/seo/metadata";
import { AdUnit } from "@/components/adsense/google-adsense";
import { AD_SLOTS } from "@/lib/adsense/slots";

export const metadata = pageMetadata({
  title: "FAQ",
  description: "Frequently asked questions about Playstore Wizard, Google Play Console, and the publishing process for Android apps.",
  path: "/faq",
});

const FAQS = [
  {
    section: "Getting started",
    items: [
      {
        question: "Do I need a Google Play Developer account?",
        answer: "Yes. The wizard helps you prepare everything you need, but the actual submission goes to your own Play Console account. A one-time $25 USD fee from Google opens that account.",
      },
      {
        question: "Can I use the wizard before I have an app built?",
        answer: "You can step through everything except the bundle upload. We'll save your listing copy, content rating, Data Safety answers, and privacy policy. When your AAB is ready, drop it in.",
      },
      {
        question: "How long does the whole wizard take?",
        answer: "About an hour for a first-time submission, assuming you have your AAB, icon, and a few screenshots ready. Most of that hour is the Data Safety form, which the wizard makes much faster.",
      },
      {
        question: "Does the wizard work on mobile?",
        answer: "Yes. The entire flow is mobile-optimized. Some steps (asset upload, AAB parsing) work best on a laptop, but everything else is fine on a phone.",
      },
    ],
  },
  {
    section: "Compliance",
    items: [
      {
        question: "Does Playstore Wizard guarantee my app gets approved?",
        answer: "No tool can promise that. Google has discretion, and content/policy reviews are not deterministic. What we do guarantee: every encoded rule is current, and our compliance check catches the blockers that cause about 80% of first-submission rejections.",
      },
      {
        question: "What about the API 35 / API 36 requirements?",
        answer: "Google requires new submissions to target API 35 (Android 15) since August 2025, and API 36 starting August 2026. The wizard reads your AAB's targetSdkVersion and flags any submission below the current minimum as a blocker.",
      },
      {
        question: "How do you handle the 12-tester, 14-day rule?",
        answer: "If you marked your account as personal (signed up after November 2023), the wizard adds a tester-tracking widget. It reminds you of the deadline, helps you generate a tester invite link, and won't enable production-track submission until the rule's met.",
      },
    ],
  },
  {
    section: "Pricing",
    items: [
      {
        question: "Is the Free tier really free?",
        answer: "Yes. Free, forever, one app. Includes compliance check, AI listings in English, asset resize, manual publishing, and review tracking. No credit card.",
      },
      {
        question: "What unlocks on Pro?",
        answer: "Unlimited apps, multi-language listings (50+ languages), AI review reply drafts, ASO keyword ranking, A/B test listings, scheduled releases, staged rollout control, and policy-change alerts.",
      },
      {
        question: "Do you offer a refund?",
        answer: "No. All sales are final on monthly, yearly, and lifetime plans. The Free tier is unlimited so you can fully evaluate the product before purchasing. Cancelling stops the next renewal but doesn't refund the current period. We honor statutory refund rights where required by law in your jurisdiction (e.g. EU/UK cooling-off rules).",
      },
    ],
  },
  {
    section: "AI features",
    items: [
      {
        question: "What AI model powers the listing generator?",
        answer: "By default, Cloudflare Workers AI on the free tier — about 10,000 free generations per day. For local development, the wizard auto-routes to a local Ollama install if it's running. We never use paid APIs unless you explicitly enable them.",
      },
      {
        question: "Is my data sent anywhere?",
        answer: "Only the text you type into AI prompts, and only when you click 'Generate'. The wizard state lives in your browser's localStorage. We do not store your AAB, screenshots, or wizard answers on our servers.",
      },
      {
        question: "Can I disable AI completely?",
        answer: "Yes. Every AI-generated field is also fully editable — you can ignore the Generate button and write everything yourself. No feature requires AI.",
      },
    ],
  },
  {
    section: "Technical",
    items: [
      {
        question: "What format does my app bundle need to be in?",
        answer: "Google requires AAB (Android App Bundle) for all new submissions since August 2021. APK submissions are rejected. The wizard parses both formats but warns you if you're using APK.",
      },
      {
        question: "How does the AAB parser work without bundletool?",
        answer: "AAB is a ZIP. The wizard unzips it in your browser, reads the binary AndroidManifest.xml from base/manifest/, and decodes the resource format directly. No Java, no server, no upload — your bundle never leaves your device.",
      },
      {
        question: "Is the source code open?",
        answer: "Parts of it. The compliance rule definitions, the AAB parser, and the privacy policy generator are open-source. The wizard UI and Pro features are source-available for paying customers.",
      },
    ],
  },
];

const FLAT_FAQS = FAQS.flatMap((s) => s.items).map((f) => ({
  question: f.question,
  answer: f.answer,
}));

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]),
          buildFaqLd(FLAT_FAQS),
        ]}
      />

      <section className="container max-w-3xl py-20">
        <Reveal>
          <Eyebrow>Frequently asked</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-5xl tracking-tight text-balance">
            Questions, <span className="accent-italic text-aurora">answered.</span>
          </h1>
          <p className="mt-6 text-lg text-text-muted">
            Don&apos;t see yours? Email <a href="mailto:hello@playstorewizard.pro" className="text-indigo-300 hover:text-indigo-200 underline decoration-indigo-500/40 underline-offset-4">hello@playstorewizard.pro</a>.
          </p>
        </Reveal>

        {FAQS.map((section, sIdx) => (
          <section key={section.section} className="mt-14">
            <Reveal>
              <Eyebrow className="mb-3">{section.section}</Eyebrow>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <details key={item.question} className="rounded-xl border border-border bg-bg-2/40 p-5 group">
                    <summary className="cursor-pointer font-display font-medium text-base flex items-start justify-between gap-3 list-none">
                      <span className="text-text">{item.question}</span>
                      <span className="text-text-muted group-open:rotate-180 transition-transform flex-shrink-0">▾</span>
                    </summary>
                    <p className="text-sm text-text-muted mt-3 leading-relaxed">{item.answer}</p>
                  </details>
                ))}
              </div>
            </Reveal>
            {sIdx === 1 && <div className="mt-8"><AdUnit slot={AD_SLOTS.faq} /></div>}
          </section>
        ))}
      </section>
    </>
  );
}
