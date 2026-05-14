"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-gradient-to-br from-bg-2/80 to-bg-1/80 backdrop-blur-xl shadow-2xl shadow-black/40",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pt-6 pb-4", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-6 pt-2 flex items-center gap-3", className)} {...props} />;
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-lg border border-border-strong bg-bg-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-colors",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-24 w-full rounded-lg border border-border-strong bg-bg-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-colors resize-y",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

type BadgeVariant = "default" | "indigo" | "emerald" | "amber" | "rose" | "muted";
const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-bg-3 text-text-muted border-border",
  indigo: "bg-brand-indigo/15 text-indigo-200 border-brand-indigo/30",
  emerald: "bg-brand-emerald/15 text-emerald-300 border-brand-emerald/30",
  amber: "bg-brand-amber/15 text-amber-200 border-brand-amber/30",
  rose: "bg-brand-rose/15 text-rose-200 border-brand-rose/30",
  muted: "bg-bg-3/50 text-text-dim border-border",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono font-medium uppercase tracking-wider",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 h-px bg-border", className)} />;
}

export function Eyebrow({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.15em] text-text-muted",
        className
      )}
    >
      {children}
    </div>
  );
}
