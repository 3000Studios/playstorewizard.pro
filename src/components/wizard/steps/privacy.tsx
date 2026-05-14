"use client";
import { useWizard } from "@/lib/store";
import { Input, Label } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Sparkles, FileDown } from "lucide-react";
import { useState } from "react";

export function StepPrivacy() {
  const w = useWizard();
  const [generating, setGenerating] = useState(false);
  async function generate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/privacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName: w.appName,
          developerName: w.developerName,
          contactEmail: w.contactEmail,
          websiteUrl: w.websiteUrl,
          collectsData: w.collectsData,
          sharesData: w.sharesData,
          dataTypes: w.dataTypes,
          usesAds: w.usesAds,
          usesAnalytics: w.usesAnalytics,
          allowsAccountCreation: w.allowsAccountCreation,
          hasInAppAccountDeletion: w.hasInAppAccountDeletion,
          targetsChildren: w.targetsChildren,
        }),
      });
      const json = (await res.json()) as { html?: string };
      if (json.html) w.set({ privacyPolicyHtml: json.html });
    } finally {
      setGenerating(false);
    }
  }
  function download() {
    if (!w.privacyPolicyHtml) return;
    const blob = new Blob([w.privacyPolicyHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "privacy-policy.html";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Developer name</Label>
          <Input value={w.developerName} onChange={(e) => w.set({ developerName: e.target.value })} placeholder="3000Studios" />
        </div>
        <div>
          <Label>Contact email</Label>
          <Input value={w.contactEmail} onChange={(e) => w.set({ contactEmail: e.target.value })} placeholder="hello@example.com" />
        </div>
      </div>
      <div>
        <Label>Privacy policy URL (if you already have one)</Label>
        <Input value={w.privacyPolicyUrl} onChange={(e) => w.set({ privacyPolicyUrl: e.target.value })} placeholder="https://yourdomain.com/privacy" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="aurora" size="sm" onClick={generate} disabled={generating || !w.appName || !w.developerName}>
          <Sparkles className="h-3.5 w-3.5" />
          {generating ? "Building…" : "Generate from your Data Safety answers"}
        </Button>
        {w.privacyPolicyHtml && (
          <Button variant="outline" size="sm" onClick={download}>
            <FileDown className="h-3.5 w-3.5" />
            Download HTML
          </Button>
        )}
      </div>
    </div>
  );
}
