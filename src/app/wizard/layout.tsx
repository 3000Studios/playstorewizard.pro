"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { STEPS } from "@/lib/steps";
import { useWizard } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function WizardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const slug = path?.split("/").filter(Boolean).pop() ?? "app-info";
  const completed = useWizard((s) => s.completedSteps);
  const currentIdx = STEPS.findIndex((s) => s.slug === slug);
  const pct = currentIdx >= 0 ? ((currentIdx + 1) / STEPS.length) * 100 : 0;

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-text-muted">
            Step <span className="text-text font-semibold">{currentIdx + 1}</span> of {STEPS.length}
          </span>
          <span className="text-text-muted font-mono">{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-bg-3 overflow-hidden">
          <div
            className="h-full bg-grad-aurora transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <ol className="hidden md:grid grid-cols-12 gap-1 mt-4">
          {STEPS.map((s, i) => {
            const isDone = completed.includes(s.num);
            const isCurrent = i === currentIdx;
            return (
              <li key={s.slug}>
                <Link
                  href={`/wizard/${s.slug}`}
                  className={cn(
                    "block px-2 py-1.5 rounded-md text-[10px] font-medium truncate text-center",
                    isCurrent && "bg-brand-indigo/20 text-indigo-200 border border-brand-indigo/40",
                    !isCurrent && isDone && "text-emerald-300 hover:bg-bg-3",
                    !isCurrent && !isDone && "text-text-dim hover:bg-bg-3 hover:text-text-muted"
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {isDone && <Check className="h-3 w-3" />}
                    {s.num}. {s.short}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
      {children}
    </div>
  );
}
