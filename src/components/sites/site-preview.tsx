"use client";

import type { GeneratedSite } from "@/lib/sites/schema";
import { cn } from "@/lib/utils";

const paletteClasses: Record<GeneratedSite["palette"], string> = {
  aurora: "from-indigo-500 via-fuchsia-500 to-emerald-400",
  emerald: "from-emerald-400 via-teal-500 to-sky-500",
  solar: "from-amber-300 via-rose-500 to-indigo-500",
  mono: "from-zinc-200 via-zinc-500 to-zinc-900",
  rose: "from-rose-400 via-fuchsia-500 to-orange-300",
};

export function SitePreview({ site, framed = true }: { site: GeneratedSite; framed?: boolean }) {
  const hero = site.sections.find((section) => section.kind === "hero") ?? site.sections[0];
  return (
    <article
      className={cn(
        "overflow-hidden bg-[#080a12] text-white",
        framed ? "rounded-2xl border border-white/10 shadow-2xl shadow-black/40" : "min-h-screen"
      )}
    >
      <section className="relative isolate px-6 py-16 sm:px-10 lg:px-16">
        <div className={cn("absolute inset-0 -z-10 bg-gradient-to-br opacity-40", paletteClasses[site.palette])} />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.20),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,.10),transparent_22%),linear-gradient(180deg,transparent,rgba(8,10,18,.95))]" />
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/70">{hero.eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-display text-4xl font-black tracking-tight sm:text-6xl">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">{hero.body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={`mailto:${site.contactEmail}`} className="rounded-lg bg-white px-5 py-3 text-center text-sm font-bold text-[#080a12] transition hover:-translate-y-0.5">
            {site.primaryCta}
          </a>
          <a href="#pricing" className="rounded-lg border border-white/20 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10">
            {site.secondaryCta}
          </a>
        </div>
      </section>

      {site.sections.filter((section) => section.kind !== "hero").map((section) => (
        <section key={section.id} id={section.kind} className="border-t border-white/10 px-6 py-12 sm:px-10 lg:px-16">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/45">{section.eyebrow}</p>
          <h2 className="mt-3 max-w-3xl text-2xl font-black tracking-tight sm:text-4xl">{section.title}</h2>
          <p className="mt-4 max-w-3xl leading-7 text-white/68">{section.body}</p>
          {section.items.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <div key={`${section.id}-${item.title}`} className="rounded-xl border border-white/10 bg-white/[0.06] p-5">
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/64">{item.body}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      <footer className="border-t border-white/10 px-6 py-8 text-sm text-white/50 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</span>
          <a className="hover:text-white" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
        </div>
      </footer>
    </article>
  );
}
