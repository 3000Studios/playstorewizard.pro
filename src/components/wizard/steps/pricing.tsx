"use client";
import { useWizard } from "@/lib/store";
import { Input, Label, Badge } from "@/components/ui/primitives";
import { calculateFees } from "@/lib/pricing/calculator";

export function StepPricing() {
  const w = useWizard();
  const yearly = (w.price ?? 0) * 12000; // illustrative
  const fees = calculateFees({
    regime: "current",
    monetization: w.freeOrPaid === "paid" ? "paid-up-front" : "free",
    annualGrossUsd: yearly,
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm text-text-muted">Pricing model:</p>
        <Badge variant="indigo">{w.freeOrPaid}</Badge>
      </div>
      {w.freeOrPaid === "paid" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Base price</Label>
            <Input
              type="number"
              step="0.01"
              value={w.price ?? ""}
              onChange={(e) => w.set({ price: parseFloat(e.target.value) || undefined })}
            />
          </div>
          <div>
            <Label>Currency</Label>
            <Input value={w.currency} onChange={(e) => w.set({ currency: e.target.value })} maxLength={3} />
          </div>
        </div>
      )}
      {w.freeOrPaid === "paid" && w.price && (
        <div className="p-4 rounded-xl bg-bg-2 border border-border text-sm space-y-1">
          <p className="text-text-muted">Estimated illustrative year-1 (assuming 1000 sales/month):</p>
          <p>Gross: <span className="text-text font-semibold">${fees.googleCutUsd > 0 ? (yearly).toLocaleString() : 0}</span></p>
          <p>Google takes: <span className="text-rose-300">-${Math.round(fees.googleCutUsd).toLocaleString()}</span></p>
          <p>You keep: <span className="text-emerald-300 font-semibold">${Math.round(fees.netRevenueUsd).toLocaleString()}</span></p>
        </div>
      )}
    </div>
  );
}
