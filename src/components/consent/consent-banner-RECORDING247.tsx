"use client";

import * as React from "react";
import Link from "next/link";

/**
 * GDPR/AdSense consent banner using Google Consent Mode v2.
 *
 * The consent *default* (everything denied) is set in a beforeInteractive
 * script in the root layout, so AdSense never sets non-essential cookies
 * before a choice is made. This component only records the user's choice and
 * sends a `consent: update` signal.
 *
 * - Accept  → personalized ads + analytics granted
 * - Reject  → stays denied; AdSense still serves non-personalized ads
 */

const STORAGE_KEY = "psw-consent";
const COOKIE_NAME = "psw-consent";
const ONE_YEAR = 60 * 60 * 24 * 365;

type Choice = "granted" | "denied";

function gtagConsentUpdate(choice: Choice) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  // gtag stub mirrors the one defined in the layout's consent-default script.
  const gtag = w.gtag ?? ((...args: unknown[]) => w.dataLayer!.push(args));
  gtag("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
}

function persist(choice: Choice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* storage may be unavailable */
  }
  try {
    document.cookie = `${COOKIE_NAME}=${choice}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

export function ConsentBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored !== "granted" && stored !== "denied") {
      setVisible(true);
    }
  }, []);

  const decide = React.useCallback((choice: Choice) => {
    persist(choice);
    gtagConsentUpdate(choice);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-border-strong bg-bg-2/95 backdrop-blur-xl p-4 sm:p-5 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-muted leading-relaxed">
            We use cookies for essential functionality and, with your consent,
            Google AdSense advertising. You can accept personalized ads or
            continue with non-personalized ads only.{" "}
            <Link href="/cookies" className="text-text underline underline-offset-2 hover:text-white">
              Cookie policy
            </Link>
            .
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => decide("denied")}
              className="min-h-11 rounded-lg border border-border-strong px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-white hover:border-white/30"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => decide("granted")}
              className="min-h-11 rounded-lg bg-brand-indigo px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
