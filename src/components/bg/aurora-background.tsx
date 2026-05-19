"use client";

import * as React from "react";

interface AuroraProps {
  className?: string;
  /** Max particles on desktop. Halved on mobile, zero on prefers-reduced-motion. */
  density?: number;
}

/**
 * Aurora background — layered CSS gradient + canvas particle field +
 * cursor-reactive parallax. Acts as a live responsive wallpaper.
 * Pauses RAF when the tab is hidden, respects prefers-reduced-motion.
 */
export function AuroraBackground({ className, density = 70 }: AuroraProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const layerRef = React.useRef<HTMLDivElement | null>(null);

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
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const colors = [
      { r: 99, g: 102, b: 241 },
      { r: 139, g: 92, b: 246 },
      { r: 217, g: 70, b: 239 },
      { r: 56, g: 189, b: 248 },
      { r: 244, g: 63, b: 94 },
    ];

    interface P { x: number; y: number; vx: number; vy: number; r: number; ci: number; phase: number; }
    let particles: P[] = [];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    function setup() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (!canvas) return;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(1, 0, 0, 1, 0, 0);
      ctx?.scale(dpr, dpr);
      mouseX = width / 2;
      mouseY = height / 2;
      targetX = mouseX;
      targetY = mouseY;
      particles = Array.from({ length: count }, () => ({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-0.18, 0.18),
        vy: rand(-0.18, 0.18),
        r: rand(80, 220),
        ci: Math.floor(rand(0, colors.length)),
        phase: rand(0, Math.PI * 2),
      }));
    }

    function frame() {
      if (!running || !ctx) return;

      // Smooth-track mouse position
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      // Parallax shift on the css-gradient layer
      if (layerRef.current) {
        const px = ((mouseX / width) - 0.5) * 30;
        const py = ((mouseY / height) - 0.5) * 30;
        layerRef.current.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      const t = performance.now() * 0.0005;

      for (const p of particles) {
        // Gentle drift + breathing radius
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.005;

        // Attraction toward cursor (very subtle)
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 360000) {
          const f = 0.00008 * (1 - d2 / 360000);
          p.vx += dx * f;
          p.vy += dy * f;
        }

        // Soft velocity clamp
        p.vx = Math.max(-0.5, Math.min(0.5, p.vx * 0.995));
        p.vy = Math.max(-0.5, Math.min(0.5, p.vy * 0.995));

        if (p.x < -p.r) p.x = width + p.r;
        if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        if (p.y > height + p.r) p.y = -p.r;

        const radius = p.r * (0.85 + 0.15 * Math.sin(p.phase + t));
        const c = colors[p.ci];
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.20)`);
        grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
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

    function onMove(e: PointerEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    function onTouch(e: TouchEvent) {
      const t0 = e.touches[0];
      if (t0) {
        targetX = t0.clientX;
        targetY = t0.clientY;
      }
    }

    setup();
    frame();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [density]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className ?? ""}`}
      style={{ contain: "strict" }}
    >
      {/* Layer 1 — CSS aurora gradients with cursor-driven parallax */}
      <div
        ref={layerRef}
        className="absolute -inset-16 transition-transform duration-300 ease-out will-change-transform"
        style={{
          backgroundImage: `
            radial-gradient(1200px 800px at 15% 0%, rgba(99,102,241,0.22), transparent 55%),
            radial-gradient(1100px 700px at 90% 20%, rgba(217,70,239,0.16), transparent 55%),
            radial-gradient(900px 800px at 50% 100%, rgba(56,189,248,0.12), transparent 55%),
            radial-gradient(700px 600px at 75% 85%, rgba(244,63,94,0.10), transparent 55%)
          `,
        }}
      />
      {/* Layer 2 — Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 mix-blend-screen opacity-80"
      />
      {/* Layer 3 — Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
