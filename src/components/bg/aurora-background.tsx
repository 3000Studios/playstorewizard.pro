"use client";

import * as React from "react";

interface AuroraProps {
  className?: string;
  /** Max particles on desktop. Halved on mobile, zero on prefers-reduced-motion. */
  density?: number;
}

/**
 * Aurora background — a layered CSS gradient + canvas particle field.
 * Particle count adapts to viewport size and motion preference.
 * Pauses RAF when the tab is hidden.
 */
export function AuroraBackground({ className, density = 60 }: AuroraProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? Math.floor(density / 2) : density;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // cap DPR for perf

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;

    const colors = [
      { r: 99, g: 102, b: 241 },   // indigo
      { r: 139, g: 92, b: 246 },   // violet
      { r: 217, g: 70, b: 239 },   // fuchsia
      { r: 56, g: 189, b: 248 },   // sky
    ];

    interface P { x: number; y: number; vx: number; vy: number; r: number; ci: number; }
    let particles: P[] = [];

    function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

    function setup() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (!canvas) return;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.scale(dpr, dpr);
      particles = Array.from({ length: count }, () => ({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-0.15, 0.15),
        vy: rand(-0.15, 0.15),
        r: rand(60, 180),
        ci: Math.floor(rand(0, colors.length)),
      }));
    }

    function frame() {
      if (!running || !ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -p.r) p.x = width + p.r;
        if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        if (p.y > height + p.r) p.y = -p.r;

        const c = colors[p.ci];
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.18)`);
        grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function onResize() {
      cancelAnimationFrame(raf);
      setup();
      frame();
    }

    function onVis() {
      running = !document.hidden;
      if (running) frame();
      else cancelAnimationFrame(raf);
    }

    setup();
    frame();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 ${className ?? ""}`}
      style={{ contain: "strict" }}
    >
      {/* Layer 1 — CSS aurora gradients (always present, no JS needed) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(1200px 800px at 15% 0%, rgba(99,102,241,0.20), transparent 55%),
            radial-gradient(1100px 700px at 90% 20%, rgba(217,70,239,0.14), transparent 55%),
            radial-gradient(900px 800px at 50% 100%, rgba(56,189,248,0.10), transparent 55%)
          `,
        }}
      />
      {/* Layer 2 — Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 mix-blend-screen opacity-70"
      />
      {/* Layer 3 — Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
