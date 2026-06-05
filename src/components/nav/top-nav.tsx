"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { Menu, X, Sparkles, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { signOut } from "@/lib/firebase/auth";

// Public nav: focused on Play-Store-publishing surfaces.
// /dashboard and /admin are intentionally NOT in the public nav.
// /dashboard is the site-generator surface (unrelated to Play Store compliance)
// and /admin is staff-only — both still reachable by direct URL.
const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

function UserAvatar({ user }: { user: NonNullable<ReturnType<typeof useAuth>["user"]> }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const ref = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const initial =
    (user.displayName?.[0] ?? user.email?.[0] ?? "?").toUpperCase();

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-bg-3 transition-colors"
        aria-label="User menu"
        aria-expanded={open ? "true" : "false"}
      >
        <span
          className="h-7 w-7 rounded-full bg-grad-aurora grid place-items-center text-white text-xs font-bold select-none shadow-[0_0_12px_rgba(99,102,241,0.5)]"
          aria-hidden
        >
          {initial}
        </span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-text-muted transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-bg-1/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
          <div className="px-3 py-2.5 border-b border-border">
            <p className="text-xs text-text-muted truncate">{user.displayName ?? user.email}</p>
          </div>
          <div className="p-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text hover:bg-bg-3 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-text-muted" />
              Dashboard
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text hover:bg-bg-3 transition-colors"
            >
              <LogOut className="h-4 w-4 text-text-muted" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { user, loading } = useAuth();

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
          {!loading && (
            <>
              {user ? (
                <UserAvatar user={user} />
              ) : (
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign in
                  </Button>
                </Link>
              )}
            </>
          )}
          <Link href="/wizard">
            <Button variant="aurora" size="sm">
              <Sparkles className="h-3.5 w-3.5" />
              Start free
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden h-10 w-10 grid place-items-center text-text rounded-md hover:bg-bg-3"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open ? "true" : "false"}
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
            {!loading && (
              user ? (
                <Link
                  href="/dashboard"
                  className="px-3 py-2.5 rounded-md text-[15px] text-text-muted hover:text-text hover:bg-bg-3 illuminate"
                >
                  Dashboard
                </Link>
              ) : (
                <Link href="/auth/signin" className="mt-1">
                  <Button variant="outline" size="md" className="w-full">
                    Sign in
                  </Button>
                </Link>
              )
            )}
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
