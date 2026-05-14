"use client";
import { useWizard } from "@/lib/store";
import { Input, Label } from "@/components/ui/primitives";

export function StepAppInfo() {
  const w = useWizard();
  return (
    <div className="grid gap-5">
      <div>
        <Label>App name (max 30 chars)</Label>
        <Input
          value={w.appName}
          onChange={(e) => w.set({ appName: e.target.value })}
          placeholder="Bloom: Habit Tracker"
          maxLength={30}
        />
        <p className="text-[11px] text-text-dim mt-1 font-mono">{w.appName.length}/30</p>
      </div>
      <div>
        <Label>Package name</Label>
        <Input
          value={w.packageName}
          onChange={(e) => w.set({ packageName: e.target.value })}
          placeholder="com.yourcompany.yourapp"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <select
            className="h-10 w-full rounded-lg border border-border-strong bg-bg-2 px-3 text-sm text-text"
            value={w.appOrGame}
            onChange={(e) => w.set({ appOrGame: e.target.value as "app" | "game" })}
          >
            <option value="app">App</option>
            <option value="game">Game</option>
          </select>
        </div>
        <div>
          <Label>Pricing</Label>
          <select
            className="h-10 w-full rounded-lg border border-border-strong bg-bg-2 px-3 text-sm text-text"
            value={w.freeOrPaid}
            onChange={(e) => w.set({ freeOrPaid: e.target.value as "free" | "paid" })}
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>
      <div>
        <Label>Account type</Label>
        <select
          className="h-10 w-full rounded-lg border border-border-strong bg-bg-2 px-3 text-sm text-text"
          value={w.accountType}
          onChange={(e) => w.set({ accountType: e.target.value as "personal" | "organization" })}
        >
          <option value="personal">Personal — subject to the 14-day closed-test rule</option>
          <option value="organization">Organization — exempt</option>
        </select>
      </div>
    </div>
  );
}
