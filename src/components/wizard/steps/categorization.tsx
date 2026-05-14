"use client";
import { useWizard } from "@/lib/store";
import { Input, Label } from "@/components/ui/primitives";

const CATEGORIES = [
  "Productivity","Tools","Education","Health & Fitness","Finance","Lifestyle","Photography",
  "Communication","Social","Entertainment","Music & Audio","Video Players & Editors","Books & Reference",
  "News & Magazines","Shopping","Travel & Local","Weather","Business","Games — Casual","Games — Puzzle",
  "Games — Action","Games — Role Playing","Games — Strategy",
];

export function StepCategorization() {
  const w = useWizard();
  return (
    <div className="space-y-5">
      <div>
        <Label>Category</Label>
        <select
          className="h-10 w-full rounded-lg border border-border-strong bg-bg-2 px-3 text-sm text-text"
          value={w.category}
          onChange={(e) => w.set({ category: e.target.value })}
        >
          <option value="">Choose one…</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <Label>Tags (comma-separated, up to 5)</Label>
        <Input
          value={w.tags.join(", ")}
          onChange={(e) =>
            w.set({
              tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5),
            })
          }
          placeholder="productivity, habits, mindfulness"
        />
      </div>
    </div>
  );
}
