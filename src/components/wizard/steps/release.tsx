"use client";
import { useWizard } from "@/lib/store";
import { Label, Textarea } from "@/components/ui/primitives";

export function StepRelease() {
  const w = useWizard();
  return (
    <div className="space-y-4">
      <div>
        <Label>Release track</Label>
        <select
          className="h-10 w-full rounded-lg border border-border-strong bg-bg-2 px-3 text-sm text-text"
          value={w.track}
          onChange={(e) => w.set({ track: e.target.value as "internal" | "closed" | "open" | "production" })}
        >
          <option value="internal">Internal testing — 100 testers, no review wait</option>
          <option value="closed">Closed testing — invited testers, reviewed</option>
          <option value="open">Open testing — public beta</option>
          <option value="production">Production — live on Play Store</option>
        </select>
      </div>
      <div>
        <Label>Release notes (en-US, max 500)</Label>
        <Textarea
          rows={5}
          value={w.releaseNotes["en-US"] ?? ""}
          onChange={(e) => w.set({ releaseNotes: { ...w.releaseNotes, "en-US": e.target.value } })}
          maxLength={500}
          placeholder="• New: …\n• Fixed: …\n• Improved: …"
        />
      </div>
    </div>
  );
}
