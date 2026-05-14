import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "About",
  description: "Playstore Wizard is built by 3000Studios — an indie developer studio shipping mobile apps and helping others do the same.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <article className="container max-w-3xl py-20">
        <Reveal>
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-5xl tracking-tight text-balance">
            The tool that exists because <span className="accent-italic text-aurora">Play Console doesn&apos;t.</span>
          </h1>
        </Reveal>
        <div className="prose-guide mt-10">
          <h2>Why we built this</h2>
          <p>Every indie developer goes through the same Day-One experience: open Google Play Console, see thirteen tabs and a hundred form fields, lose two hours, miss a requirement, get rejected, and start over. Then they discover the 14-day closed-testing rule. Then they discover the Data Safety form. Then they realize their target API level is too low. Each of those discoveries adds days, sometimes weeks, to a launch.</p>
          <p>Playstore Wizard is what we wished existed when we shipped our first app — a single guided flow that knows every current Google Play policy and applies it as you go. We built it for ourselves first, then for the developers we kept meeting at meetups who described the exact same pain.</p>
          <h2>Who&apos;s behind it</h2>
          <p>3000Studios is an indie developer studio based in Acworth, Georgia. We ship mobile apps, automation tools, and developer infrastructure. Everything we build follows a single rule: production-ready or don&apos;t ship it.</p>
          <h2>How we make money</h2>
          <p>The Free tier is genuinely free, forever — one app, no expiry, no credit card. We make money from the Pro tier (indie developers shipping multiple apps), the Studio tier (agencies managing client apps), and modest ad revenue on our content pages. We never sell or share user data, and we never use a free user as a stepping stone to extract a payment.</p>
          <h2>What we promise</h2>
          <p>The rules encoded in this tool stay current. When Google announces a policy change, the compliance engine updates within 7 days. When a rule is ambiguous, we err on the side of caution and tell you why. When you ask us a question, a human answers.</p>
          <h2>What we&apos;re not</h2>
          <p>We are not Google. We are not affiliated with Google LLC. We are not lawyers, and nothing in this product is legal advice. The compliance check is a strong signal that your submission is likely to pass, but Google has final discretion. We cannot guarantee approval, and any reputable tool that claims otherwise should be treated with suspicion.</p>
        </div>
      </article>
    </>
  );
}
