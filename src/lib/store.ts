"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { EMPTY_WIZARD, type WizardData } from "./types";

interface WizardStore extends WizardData {
  set: (patch: Partial<WizardData>) => void;
  markComplete: (stepNum: number) => void;
  reset: () => void;
}

export const useWizard = create<WizardStore>()(
  persist(
    (set) => ({
      ...EMPTY_WIZARD,
      set: (patch) => set((s) => ({ ...s, ...patch })),
      markComplete: (n) =>
        set((s) => ({
          completedSteps: Array.from(new Set([...s.completedSteps, n])),
        })),
      reset: () => set({ ...EMPTY_WIZARD }),
    }),
    {
      name: "playstorewizard-pro",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as unknown as Storage)
      ),
      partialize: (s) => {
        const data: Record<string, unknown> = { ...s };
        delete data.set;
        delete data.markComplete;
        delete data.reset;
        return data;
      },
    }
  )
);
