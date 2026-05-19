"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Public nav: focused on Play-Store-publishing surfaces.
// /dashboard and /admin are intentionally NOT in the public nav.
// /dashboard is the site-generator surface (unrelated to Play Store compliance)
// and /admin is staff-only — both still reachable by direct URL.
const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/guides", label: "Guides" },
  { href: "/faq", label: "FAQ" },
];

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on navigation
  React.useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "border-b border-border bg-bg-0/80 backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group illuminate"
          aria-label="Playstore Wizard home"
        >
          <Image
            src="/icons/logo.svg"
            alt="Playstore Wizard"
            width={320}
            height={64}
            priority
            unoptimized
            sizes="(min-width: 768px) 220px, 180px"
            className="h-10 w-auto transition-transform duration-200 group-hover:scale-[1.04] drop-shadow-[0_0_18px_rgba(139,92,246,0.35)] group-hover:drop-shadow-[0_0_28px_rgba(217,70,239,0.6)]"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "illuminate px-3 py-1.5 rounded-md text-[15px] font-medium transition-all duration-200",
                  active
                    ? "text-text bg-bg-3 shadow-[inset_0_0_0_1px_rgba(165,180,252,0.25)]"
                    : "text-text-muted hover:text-text hover:bg-bg-3"
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/wizard">
            <Button variant="aurora" size="sm">
              <Sparkles className="h-3.5 w-3.5" />
              Start free
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden h-10 w-10 grid place-items-center text-text rounded-md hover:bg-bg-3"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          className="md:hidden border-t border-border bg-bg-0/95 backdrop-blur-xl"
          aria-label="Mobile menu"
        >
          <div className="container py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 rounded-md text-[15px] text-text-muted hover:text-text hover:bg-bg-3 illuminate"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/wizard" className="mt-2">
              <Button variant="aurora" size="md" className="w-full">
                <Sparkles className="h-4 w-4" />
                Start the wizard — free
              </Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
