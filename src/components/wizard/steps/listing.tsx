"use client";
import { useWizard } from "@/lib/store";
import { Input, Label, Textarea, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export function StepListing() {
  const w = useWizard();
  const [generating, setGenerating] = useState(false);
  async function generate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName: w.appName,
          oneSentencePitch: w.oneSentencePitch,
          category: w.category || "tools",
        }),
      });
      const json = await res.json() as { short?: string; full?: string; keywords?: string[] };
      if (json.short) w.set({ shortDescription: json.short });
      if (json.full) w.set({ fullDescription: json.full });
      if (json.keywords) w.set({ keywords: json.keywords });
    } finally {
      setGenerating(false);
    }
  }
  return (
    <div className="space-y-5">
      <div>
        <Label>One-sentence pitch</Label>
        <Input
          value={w.oneSentencePitch}
          onChange={(e) => w.set({ oneSentencePitch: e.target.value })}
          placeholder="A calm habit tracker that uses living plants instead of streaks."
        />
        <Button variant="aurora" size="sm" className="mt-3" onClick={generate} disabled={generating || !w.oneSentencePitch}>
          <Sparkles className="h-3.5 w-3.5" />
          {generating ? "Generating…" : "Generate listing"}
        </Button>
      </div>
      <div>
        <Label>Short description (max 80)</Label>
        <Input value={w.shortDescription} onChange={(e) => w.set({ shortDescription: e.target.value })} maxLength={80} />
        <p className="text-[11px] text-text-dim mt-1 font-mono">{w.shortDescription.length}/80</p>
      </div>
      <div>
        <Label>Full description (max 4000)</Label>
        <Textarea
          rows={8}
          value={w.fullDescription}
          onChange={(e) => w.set({ fullDescription: e.target.value })}
          maxLength={4000}
        />
        <p className="text-[11px] text-text-dim mt-1 font-mono">{w.fullDescription.length}/4000</p>
      </div>
      {w.keywords.length > 0 && (
        <div>
          <Label>ASO Keywords</Label>
          <div className="flex flex-wrap gap-1.5">
            {w.keywords.map((k) => (
              <Badge key={k} variant="indigo">{k}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
