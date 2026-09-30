"use client";

import * as React from "react";

const STORAGE_KEY = "psw-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function grant() {
  try {
    localStorage.setItem(STORAGE_KEY, "granted");
  } catch {
    /* storage unavailable — banner will show again next visit */
  }
  try {
    window.gtag?.("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
  } catch {
    /* gtag unavailable — harmless */
  }
}

function deny() {
  try {
    localStorage.setItem(STORAGE_KEY, "denied");
  } catch {
    /* storage unavailable — banner will show again next visit */
  }
}

/**
 * GDPR/ePrivacy consent banner for AdSense + analytics.
 * Shows only when no choice is stored. Matches the `psw-consent`
 * key read by the inline consent-default script in the root layout.
 */
export function ConsentBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (!stored) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-xl rounded-xl border border-border bg-bg-0/95 p-4 shadow-2xl backdrop-blur sm:left-auto sm:right-6 sm:bottom-6"
    >
      <p className="text-sm text-text-muted leading-relaxed">
        We use cookies for ads and analytics. Accept to enable personalized ads and measurement, or
        decline to continue with essential-only storage.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => {
            deny();
            setVisible(false);
          }}
          className="flex-1 rounded-md border border-border px-4 py-2 text-sm text-text hover:bg-white/5"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => {
            grant();
            setVisible(false);
          }}
          className="flex-1 rounded-md bg-brand-indigo px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
