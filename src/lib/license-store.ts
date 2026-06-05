"use client";

/**
 * License store
 * -----------------------------------------------------------
 * Holds the user's signed Pro/Studio license in localStorage.
 *
 * The license is a JSON payload + HMAC-SHA256 signature minted by the
 * server (Cloudflare Pages function) at /api/checkout/verify after a
 * successful Stripe checkout or PayPal capture.
 *
 * The client cannot forge a license because it doesn't know the signing
 * secret. Verification uses crypto.subtle.verify with the same secret —
 * the client knows it as a "public verification key" baked at build time
 * via NEXT_PUBLIC_LICENSE_VERIFY_KEY. (This is technically symmetric, so
 * a determined attacker reading the bundle COULD forge offline-only
 * licenses, but the wizard re-verifies with the server-side webhook log
 * on every Pro API call — which catches forgeries server-side.)
 *
 * In other words: the localStorage license is a UX hint for fast wizard
 * gating; the real authority is the Stripe/PayPal webhook log on the
 * server. Free users can't pirate Pro server-side AI generation, listing
 * publishing, or any other paid feature because every paid API checks
 * Authorization headers against the server's record.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SignedLicense, License, Tier } from "@/lib/pro/tiers";
import { verifyLicense as verifyLicensePayload } from "@/lib/pro/tiers";

const VERIFY_KEY = process.env.NEXT_PUBLIC_LICENSE_VERIFY_KEY ?? "";

interface LicenseStore {
  signed: SignedLicense | null;
  verified: License | null;
  /** Replace the stored license (used by the success page). */
  setLicense: (signed: SignedLicense) => Promise<boolean>;
  /** Clear the stored license (sign out / dev reset). */
  clear: () => void;
  /** Reverify the current license against the verify key. */
  revalidate: () => Promise<boolean>;
}

export const useLicense = create<LicenseStore>()(
  persist(
    (set, get) => ({
      signed: null,
      verified: null,
      setLicense: async (signed) => {
        if (!VERIFY_KEY) {
          // No client-side key configured. Trust server-issued licenses — real
          // verification happens on every paid server-side API call via webhook records.
          set({ signed, verified: signed.payload });
          return true;
        }
        const ok = await verifyLicensePayload(signed, VERIFY_KEY);
        if (!ok) {
          set({ signed, verified: null });
          return false;
        }
        set({ signed, verified: ok });
        return true;
      },
      clear: () => set({ signed: null, verified: null }),
      revalidate: async () => {
        const s = get().signed;
        if (!s || !VERIFY_KEY) return false;
        const ok = await verifyLicensePayload(s, VERIFY_KEY);
        set({ verified: ok });
        return ok !== null;
      },
    }),
    {
      name: "playstorewizard-license",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as unknown as Storage)
      ),
      // Only persist the signed payload — `verified` is re-derived on hydrate.
      partialize: (s) => ({ signed: s.signed }),
      onRehydrateStorage: () => (state) => {
        if (!state?.signed) return;
        if (!VERIFY_KEY) {
          // Trust persisted server-issued license when no verify key is configured.
          useLicense.setState({ verified: state.signed.payload });
          return;
        }
        verifyLicensePayload(state.signed, VERIFY_KEY).then((ok) => {
          useLicense.setState({ verified: ok });
        });
      },
    }
  )
);

/**
 * Convenience hook — returns the user's active tier or "free".
 * Re-evaluates whenever the license store changes.
 */
export function useTier(): Tier {
  const verified = useLicense((s) => s.verified);
  if (!verified) return "free";
  if (verified.validUntil !== "never" && new Date(verified.validUntil) < new Date()) return "free";
  return verified.tier;
}
