"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay in ms — useful when staggering siblings manually. */
  delay?: number;
  /** Threshold of visibility before triggering (0..1). */
  threshold?: number;
  /** Only run once (default). */
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export function Reveal({
  className,
  delay = 0,
  threshold = 0.15,
  once = true,
  as = "div",
  children,
  style,
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Honor reduced motion — show immediately.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const Component = as as "div";

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}
      {...props}
    >
      {children}
    </Component>
  );
}

interface StaggerProps {
  className?: string;
  children: React.ReactNode;
  /** Delay added per child, in ms. */
  step?: number;
  /** Starting delay for first child. */
  initial?: number;
  threshold?: number;
}

/**
 * Wraps direct children in <Reveal> with incrementing delays.
 * Use for hero stat rows, feature grids, etc.
 */
export function Stagger({ className, children, step = 80, initial = 0, threshold = 0.15 }: StaggerProps) {
  const kids = React.Children.toArray(children);
  return (
    <div className={className}>
      {kids.map((child, i) => (
        <Reveal key={i} delay={initial + i * step} threshold={threshold}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
