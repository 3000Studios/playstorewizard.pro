"use client";
import { useWizard } from "@/lib/store";
import type { DataType } from "@/lib/ai/privacy";

const COMMON_DATA: { id: DataType; label: string }[] = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "user-ids", label: "User ID" },
  { id: "device-ids", label: "Device ID" },
  { id: "location-approximate", label: "Approximate location" },
  { id: "location-precise", label: "Precise location" },
  { id: "photos", label: "Photos" },
  { id: "app-interactions", label: "In-app actions" },
  { id: "crash-logs", label: "Crash logs" },
  { id: "performance-data", label: "Performance data" },
];

export function StepDataSafety() {
  const w = useWizard();
  function toggle(id: DataType) {
    const has = w.dataTypes.includes(id);
    w.set({ dataTypes: has ? w.dataTypes.filter((d) => d !== id) : [...w.dataTypes, id] });
  }
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={w.collectsData} onChange={(e) => w.set({ collectsData: e.target.checked })} className="h-4 w-4 accent-indigo-500" />
        App collects user data
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={w.sharesData} onChange={(e) => w.set({ sharesData: e.target.checked })} className="h-4 w-4 accent-indigo-500" />
        App shares user data with third parties
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={w.usesAds} onChange={(e) => w.set({ usesAds: e.target.checked })} className="h-4 w-4 accent-indigo-500" />
        App displays advertising
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={w.usesAnalytics} onChange={(e) => w.set({ usesAnalytics: e.target.checked })} className="h-4 w-4 accent-indigo-500" />
        App uses analytics
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={w.allowsAccountCreation} onChange={(e) => w.set({ allowsAccountCreation: e.target.checked })} className="h-4 w-4 accent-indigo-500" />
        App lets users create accounts
      </label>
      {w.allowsAccountCreation && (
        <label className="flex items-center gap-2 text-sm pl-6">
          <input type="checkbox" checked={w.hasInAppAccountDeletion} onChange={(e) => w.set({ hasInAppAccountDeletion: e.target.checked })} className="h-4 w-4 accent-indigo-500" />
          App offers in-app account deletion (required by Google)
        </label>
      )}
      {w.collectsData && (
        <div className="pt-3">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">Data types collected</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_DATA.map((d) => {
              const on = w.dataTypes.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggle(d.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                    on
                      ? "bg-brand-indigo/20 border-brand-indigo/50 text-indigo-100"
                      : "border-border text-text-muted hover:border-border-strong"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
