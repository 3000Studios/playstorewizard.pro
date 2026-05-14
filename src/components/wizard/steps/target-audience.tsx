"use client";
import { useWizard } from "@/lib/store";

const AGES = ["5 and under", "6-8", "9-12", "13-15", "16-17", "18+"];

export function StepTargetAudience() {
  const w = useWizard();
  function toggle(a: string) {
    const has = w.targetAgeGroups.includes(a);
    w.set({ targetAgeGroups: has ? w.targetAgeGroups.filter((x) => x !== a) : [...w.targetAgeGroups, a] });
  }
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">Age groups</p>
        <div className="flex flex-wrap gap-2">
          {AGES.map((a) => {
            const on = w.targetAgeGroups.includes(a);
            return (
              <button
                key={a}
                onClick={() => toggle(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                  on
                    ? "bg-brand-indigo/20 border-brand-indigo/50 text-indigo-100"
                    : "border-border text-text-muted hover:border-border-strong"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={w.targetsChildren} onChange={(e) => w.set({ targetsChildren: e.target.checked })} className="h-4 w-4 accent-indigo-500" />
        App is designed for children under 13
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={w.inFamiliesProgram} onChange={(e) => w.set({ inFamiliesProgram: e.target.checked })} className="h-4 w-4 accent-indigo-500" />
        App will participate in the Designed for Families program
      </label>
    </div>
  );
}
