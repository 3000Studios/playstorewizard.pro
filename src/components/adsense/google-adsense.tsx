"use client";

import * as React from "react";

const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5800977493749262";

// The AdSense library itself is loaded by a plain executing <script> tag in
// the root layout's <head> (src/app/layout.tsx). It used to load here via
// next/script with strategy="afterInteractive", which only emitted a
// <link rel="preload"> in the served HTML — no executing loader tag — so
// Auto ads never loaded for Google's crawler.

declare global {
  interface Window {
    adsbygoogle: object[];
  }
}

interface AdUnitProps {
  slot: string;
  /** "auto", "fluid", "rectangle", etc. */
  format?: string;
  /** Responsive full-width recommended. */
  fullWidthResponsive?: boolean;
  /** Layout key (for in-article/native). */
  layoutKey?: string;
  /** "in-article" or "in-feed" — for native ad units. */
  layout?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Optional label shown above the unit. */
  showLabel?: boolean;
}

/**
 * Renders one AdSense ad unit. Pushes to the queue after mount.
 * In dev (no client ID configured), shows a placeholder so layout shifts stay testable.
 */
export function AdUnit({
  slot,
  format = "auto",
  fullWidthResponsive = true,
  layoutKey,
  layout,
  className,
  style,
  showLabel = true,
}: AdUnitProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [pushed, setPushed] = React.useState(false);

  const adsConfigured =
    Boolean(ADSENSE_CLIENT_ID) && ADSENSE_CLIENT_ID !== "ca-pub-0000000000000000";
  const slotConfigured = Boolean(slot);

  React.useEffect(() => {
    if (!adsConfigured || !slotConfigured) return;
    if (pushed) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setPushed(true);
    } catch (e) {
      console.warn("AdSense push failed:", e);
    }
  }, [pushed, adsConfigured, slotConfigured]);

  // No real ad-unit slot configured yet: render a dev placeholder so layout
  // stays testable, but emit nothing in production (avoids invalid requests).
  if (!slotConfigured) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div className={`my-8 ${className ?? ""}`} aria-hidden>
        {showLabel && (
          <div className="text-[10px] uppercase tracking-widest text-text-dim mb-2 font-mono">
            Advertisement
          </div>
        )}
        <div
          className="w-full rounded-xl border border-dashed border-border-strong bg-bg-2/30 grid place-items-center text-text-dim text-xs font-mono"
          style={{ minHeight: 120, ...style }}
        >
          AdSense slot · unconfigured
        </div>
      </div>
    );
  }

  const isPlaceholder = !adsConfigured;

  if (isPlaceholder) {
    return (
      <div
        ref={containerRef}
        className={`my-8 ${className ?? ""}`}
        aria-hidden
      >
        {showLabel && (
          <div className="text-[10px] uppercase tracking-widest text-text-dim mb-2 font-mono">
            Advertisement
          </div>
        )}
        <div
          className="w-full rounded-xl border border-dashed border-border-strong bg-bg-2/30 grid place-items-center text-text-dim text-xs font-mono"
          style={{ minHeight: 120, ...style }}
        >
          AdSense slot · {slot}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`my-8 ${className ?? ""}`}>
      {showLabel && (
        <div className="text-[10px] uppercase tracking-widest text-text-dim mb-2 font-mono">
          Advertisement
        </div>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-ad-layout-key={layoutKey}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}

/**
 * In-article variant — narrower, fluid layout, native style.
 * Use inside long-form prose.
 */
export function InArticleAd({ slot, className }: { slot: string; className?: string }) {
  return (
    <AdUnit
      slot={slot}
      format="fluid"
      layout="in-article"
      fullWidthResponsive
      className={className}
    />
  );
}
