"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Click ripple — drops a soft ripple at the click location.
 * Wrap any clickable element with <Ripple><button>...</button></Ripple>.
 * Respects prefers-reduced-motion.
 */
export function Ripple({
  children,
  className,
  color = "rgba(255,255,255,0.35)",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev, { id, x, y, size }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
    },
    []
  );

  return (
    <span
      ref={ref}
      onClick={handleClick}
      className={cn("relative inline-block overflow-hidden", className)}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            background: color,
            transform: "scale(0)",
            opacity: 0.5,
            animation: "ripple-out 700ms ease-out forwards",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple-out {
          to {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}
