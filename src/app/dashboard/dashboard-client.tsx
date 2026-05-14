"use client";

import * as React from "react";
import { Check, Globe2, Loader2, Palette, Rocket, Save, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Card, CardContent, CardHeader, Input, Label, Textarea } from "@/components/ui/primitives";
import { SitePreview } from "@/components/sites/site-preview";
import { encodeLicenseForHeader } from "@/lib/auth/license";
import { useLicense } from "@/lib/license-store";
import type { GeneratedSite, GenerateSiteInput } from "@/lib/sites/schema";

const starter: GenerateSiteInput = {
  name: "LaunchPilot",
  industry: "SaaS",
  offer: "turn visitors into booked demos with a sharper landing page",
  audience: "small business owners",
  tone: "premium",
  palette: "aurora",
  contactEmail: "support@playstorewizard.pro",
  legalName: "3000 Studios",
  tier: "pro",
};

export function DashboardClient() {
  const [form, setForm] = React.useState(starter);
  const [site, setSite] = React.useState<GeneratedSite | null>(null);
  const [selectedSection, setSelectedSection] = React.useState(0);
  const [status, setStatus] = React.useState<string>("Ready");
  const [busy, setBusy] = React.useState(false);
  const signedLicense = useLicense((state) => state.signed);
  const activeTier = signedLicense?.payload.tier ?? "free";

  function authHeaders(): Record<string, string> {
    return signedLicense ? { Authorization: `License ${encodeLicenseForHeader(signedLicense)}` } : {};
  }

  async function generate() {
    setBusy(true);
    setStatus("Generating a polished site...");
    try {
      const res = await fetch("/api/sites/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ ...form, tier: activeTier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setSite(data.site);
      setSelectedSection(0);
      setStatus("Generated. Edit anything, then publish.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!site) return;
    setBusy(true);
    setStatus("Saving edits...");
    try {
      const res = await fetch(`/api/sites/${site.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(site),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setSite(data.site);
      setStatus("Saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!site) return;
    setBusy(true);
    setStatus("Publishing to subdomain...");
    try {
      const res = await fetch(`/api/sites/${site.slug}/publish`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Publish failed");
      setSite(data.site);
      setStatus(`Published at ${data.url}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Publish failed");
    } finally {
      setBusy(false);
    }
  }

  const active = site?.sections[selectedSection];

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="emerald">User dashboard</Badge>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-6xl">Generate, edit, and publish sites</h1>
          <p className="mt-4 max-w-2xl text-text-muted">
            Create a premium landing page, edit the page copy visually, save it, then publish it to a live Playstore Wizard subdomain.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-2 px-4 py-3 text-sm text-text-muted">
          <span className="text-text">Status:</span> {busy ? "Working..." : status}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-indigo-300" />
                <h2 className="font-display text-2xl font-bold">Generator</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Site name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
              <Field label="Industry" value={form.industry} onChange={(industry) => setForm({ ...form, industry })} />
              <div>
                <Label>Core offer</Label>
                <Textarea value={form.offer} onChange={(e) => setForm({ ...form, offer: e.target.value })} />
              </div>
              <Field label="Audience" value={form.audience} onChange={(audience) => setForm({ ...form, audience })} />
              <Field label="Contact email" value={form.contactEmail} onChange={(contactEmail) => setForm({ ...form, contactEmail })} />
              <div className="grid grid-cols-2 gap-3">
                <Select label="Tone" value={form.tone} onChange={(tone) => setForm({ ...form, tone: tone as typeof form.tone })} options={["premium", "friendly", "bold", "technical", "minimal"]} />
                <Select label="Palette" value={form.palette} onChange={(palette) => setForm({ ...form, palette: palette as typeof form.palette })} options={["aurora", "emerald", "solar", "mono", "rose"]} />
              </div>
              <Button variant="aurora" className="w-full" onClick={generate} disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                Generate site
              </Button>
            </CardContent>
          </Card>

          {site && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-fuchsia-300" />
                  <h2 className="font-display text-2xl font-bold">Editor</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {site.sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(index)}
                      className={`rounded-full border px-3 py-1 text-xs ${index === selectedSection ? "border-indigo-300 bg-indigo-500/20 text-white" : "border-border text-text-muted"}`}
                    >
                      {section.kind}
                    </button>
                  ))}
                </div>
                {active && (
                  <>
                    <Field label="Section title" value={active.title} onChange={(title) => updateSection(site, setSite, selectedSection, { title })} />
                    <div>
                      <Label>Section body</Label>
                      <Textarea value={active.body} onChange={(e) => updateSection(site, setSite, selectedSection, { body: e.target.value })} />
                    </div>
                  </>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={save} disabled={busy}><Save className="h-4 w-4" />Save</Button>
                  <Button variant="aurora" onClick={publish} disabled={busy}><Rocket className="h-4 w-4" />Publish</Button>
                </div>
                <div className="rounded-lg border border-border bg-bg-1 p-3 text-xs text-text-muted">
                  <Globe2 className="mr-1 inline h-3.5 w-3.5" />
                  {site.status === "published" ? (
                    <a className="text-indigo-200 hover:text-white" href={`https://${site.slug}.playstorewizard.pro`} target="_blank" rel="noreferrer">
                      {site.slug}.playstorewizard.pro
                    </a>
                  ) : (
                    <>Publish creates {site.slug}.playstorewizard.pro</>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="min-h-[760px]">
          {site ? (
            <SitePreview site={site} />
          ) : (
            <div className="grid min-h-[760px] place-items-center rounded-2xl border border-dashed border-border bg-bg-2/50 p-8 text-center">
              <div>
                <Check className="mx-auto h-10 w-10 text-emerald-300" />
                <h2 className="mt-4 font-display text-3xl font-bold">Your live preview appears here</h2>
                <p className="mt-3 max-w-md text-text-muted">Fill in the generator, create a site, then edit the copy and publish the result.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-border-strong bg-bg-2 px-3 text-sm text-text"
      >
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}

function updateSection(
  site: GeneratedSite,
  setSite: React.Dispatch<React.SetStateAction<GeneratedSite | null>>,
  index: number,
  patch: Partial<GeneratedSite["sections"][number]>
) {
  setSite({
    ...site,
    sections: site.sections.map((section, i) => i === index ? { ...section, ...patch } : section),
  });
}
