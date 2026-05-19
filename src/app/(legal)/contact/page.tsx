import { Reveal } from "@/components/motion/reveal";
import { Eyebrow, Card } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbLd, pageMetadata } from "@/lib/seo/metadata";
import { Mail, MessageSquare, Github, Bug, Lightbulb } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with the Playstore Wizard team. Email support, bug reports, feature requests, and partnership inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <section className="container max-w-3xl py-20">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-5xl tracking-tight text-balance">
            A human will <span className="accent-italic text-aurora">actually reply.</span>
          </h1>
          <p className="mt-6 text-lg text-text-muted">
            We aim for a response within one business day. For policy-related questions, please include your country and account type.
          </p>
        </Reveal>
        <div className="mt-12">
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
        <div className="mt-10 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-text-dim">Or email us directly</p>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {[
            { icon: Mail, title: "General inquiries", desc: "Anything that doesn't fit the other categories.", href: "mailto:hello@playstorewizard.pro", action: "hello@playstorewizard.pro" },
            { icon: Bug, title: "Bug reports", desc: "Found something broken? Include your browser and the wizard step.", href: "mailto:bugs@playstorewizard.pro", action: "bugs@playstorewizard.pro" },
            { icon: Lightbulb, title: "Feature requests", desc: "Tell us what's missing. We read every one.", href: "mailto:ideas@playstorewizard.pro", action: "ideas@playstorewizard.pro" },
            { icon: MessageSquare, title: "Support", desc: "Stuck on a step? Send a screenshot and the wizard step name.", href: "mailto:support@playstorewizard.pro", action: "support@playstorewizard.pro" },
            { icon: Github, title: "Open source bits", desc: "Bug reports for the open-source compliance rules and AAB parser go on GitHub.", href: "https://github.com/3000Studios/playstorewizard.pro/issues", action: "Open an issue" },
          ].map((c) => (
            <a key={c.title} href={c.href} className="block">
              <Card className="p-5 hover-lift h-full">
                <c.icon className="h-5 w-5 text-indigo-300 mb-3" />
                <h3 className="font-display font-semibold text-base mb-1">{c.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed mb-3">{c.desc}</p>
                <p className="text-xs text-indigo-300 font-mono">{c.action}</p>
              </Card>
            </a>
          ))}
        </div>
        <div className="mt-12 p-5 rounded-xl bg-bg-2/40 border border-border text-xs text-text-muted">
          <p><strong className="text-text">Mailing address (for legal notices only):</strong></p>
          <p className="mt-2">3000Studios<br />Acworth, Georgia, USA</p>
        </div>
      </section>
    </>
  );
}
