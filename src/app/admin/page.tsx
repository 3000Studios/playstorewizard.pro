import type { Metadata } from "next";
import Link from "next/link";
import { Activity, CreditCard, Globe2, ShieldCheck, Users } from "lucide-react";
import { Badge, Card, CardContent, CardHeader } from "@/components/ui/primitives";
import { getSiteStats } from "@/lib/sites/store";

export const metadata: Metadata = {
  title: "Admin Dashboard · Playstore Wizard",
  description: "Operational dashboard for generated sites, subscriptions, publishing health, and launch readiness.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const stats = await getSiteStats();
  const cards = [
    { label: "Generated sites", value: stats.totalSites, icon: Globe2 },
    { label: "Published sites", value: stats.publishedSites, icon: Activity },
    { label: "Draft sites", value: stats.draftSites, icon: Users },
    { label: "Payment path", value: "PayPal live", icon: CreditCard },
  ];

  return (
    <main className="container py-10">
      <Badge variant="rose">Admin dashboard</Badge>
      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-6xl">Launch control</h1>
          <p className="mt-4 max-w-2xl text-text-muted">
            Monitor generated sites, publishing status, payment readiness, legal readiness, and product health from one place.
          </p>
        </div>
        <Link href="/dashboard" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-bg-0 transition hover:-translate-y-0.5">
          Open user dashboard
        </Link>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-5">
              <card.icon className="h-5 w-5 text-indigo-300" />
              <div className="mt-5 text-3xl font-black">{card.value}</div>
              <div className="mt-1 text-sm text-text-muted">{card.label}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <h2 className="font-display text-2xl font-bold">Recent sites</h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-bg-3 text-text-muted">
                  <tr>
                    <th className="px-4 py-3">Site</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Tier</th>
                    <th className="px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSites.length === 0 ? (
                    <tr><td className="px-4 py-8 text-text-muted" colSpan={4}>No generated sites yet.</td></tr>
                  ) : stats.recentSites.map((site) => (
                    <tr key={site.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div className="font-medium text-text">{site.name}</div>
                        <div className="text-xs text-text-muted">{site.slug}.playstorewizard.pro</div>
                      </td>
                      <td className="px-4 py-3 capitalize">{site.status}</td>
                      <td className="px-4 py-3 uppercase">{site.tier}</td>
                      <td className="px-4 py-3 text-text-muted">{new Date(site.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <h2 className="font-display text-2xl font-bold">Readiness</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              "AdSense publisher script and ads.txt are live.",
              "PayPal live checkout creates approval links.",
              "Generated sites are stored in Cloudflare KV.",
              "Wildcard subdomain route is configured in Wrangler.",
              "Legal pages, sitemap, robots, and privacy terms are live.",
              "Stripe card checkout remains safely disabled until a valid Stripe secret is configured.",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-border bg-bg-1 p-3 text-text-muted">{item}</div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
