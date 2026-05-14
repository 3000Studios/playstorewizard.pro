import Link from "next/link";
import { GUIDES } from "@/lib/content/guides";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/compare", label: "Compare" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/guides", label: "All guides" },
      { href: "/faq", label: "FAQ" },
      { href: "/wizard", label: "Start the wizard" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
      { href: "/cookies", label: "Cookies" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export function Footer() {
  const topGuides = GUIDES.slice(0, 6);

  return (
    <footer className="border-t border-border bg-bg-0/70 relative z-10">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="relative h-8 w-8 rounded-lg bg-grad-aurora overflow-hidden">
                <div className="absolute inset-[3px] rounded-md bg-gradient-to-br from-white/40 to-transparent" />
              </div>
              <span className="font-display font-bold text-base">Playstore Wizard</span>
            </Link>
            <p className="text-sm text-text-muted max-w-xs leading-relaxed">
              A guided publishing studio for Google Play. Compliance, listings, and submission — done right the first time.
            </p>
            <p className="text-xs text-text-dim mt-6 font-mono">
              © {new Date().getFullYear()} Mr. J. Swain · 3000 Studios.
              <br />
              All rights reserved. Not affiliated with Google LLC.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-3">
                {col.heading}
              </h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-text-muted hover:text-text transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-4">
            Popular guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {topGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="text-sm text-text-muted hover:text-text transition-colors truncate"
              >
                {g.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
