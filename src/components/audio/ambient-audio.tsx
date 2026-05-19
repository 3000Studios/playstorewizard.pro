"use client";

/**
 * AmbientAudio — procedural ambient soundscape using the Web Audio API.
 *
 * - Low, slow, randomised pad drones (random pentatonic root every cycle).
 * - Subtle "tick" on every click anywhere.
 * - Soft "knock" on link / button hover.
 * - Browsers block autoplay until a user gesture, so we attach a one-time
 *   capture listener to start the AudioContext on first interaction.
 *   This is the standard pattern; no audio files needed (zero bandwidth).
 * - Floating mute toggle in bottom-left. State persisted in localStorage.
 * - Respects prefers-reduced-motion: starts muted.
 */

import * as React from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "psw_ambient_muted";

// Pentatonic scale roots (Hz) — randomly chosen each pad cycle.
const ROOTS = [
  130.81, // C3
  146.83, // D3
  164.81, // E3
  196.00, // G3
  220.00, // A3
];

export function AmbientAudio() {
  const [ready, setReady] = React.useState(false);
  const [muted, setMuted] = React.useState(true);
  const ctxRef = React.useRef<AudioContext | null>(null);
  const masterRef = React.useRef<GainNode | null>(null);
  const padTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = React.useRef(false);

  // Load saved preference on mount.
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "false") setMuted(false);
    } catch { /* ignore */ }
  }, []);

  // Initialise context on first user gesture (autoplay-policy compliant).
  React.useEffect(() => {
    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const master = ctx.createGain();
        master.gain.value = 0; // start silent, fade up when unmuted
        master.connect(ctx.destination);
        ctxRef.current = ctx;
        masterRef.current = master;
        setReady(true);
      } catch {
        // Web Audio not supported — fail silently.
      }
    };
    window.addEventListener("pointerdown", start, { once: true, capture: true });
    window.addEventListener("keydown", start, { once: true, capture: true });
    window.addEventListener("touchstart", start, { once: true, capture: true });
    return () => {
      window.removeEventListener("pointerdown", start, true);
      window.removeEventListener("keydown", start, true);
      window.removeEventListener("touchstart", start, true);
    };
  }, []);

  // Schedule the next ambient pad chord.
  const schedulePad = React.useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const root = ROOTS[Math.floor(Math.random() * ROOTS.length)];
    // Build a chord: root, fifth, octave (random voicing).
    const intervals = [1, 1.5, 2, 2.25][Math.random() < 0.5 ? 0 : 1] === undefined
      ? [1, 1.5, 2]
      : [1, 1.5, 2];
    const voices = intervals;

    const padGain = ctx.createGain();
    padGain.gain.value = 0;
    padGain.connect(master);

    // Soft low-pass for a distant feel.
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    lp.Q.value = 0.4;
    padGain.connect(lp);
    lp.connect(master);

    const dur = 12 + Math.random() * 10; // 12–22s pad
    voices.forEach((mult) => {
      const osc = ctx.createOscillator();
      osc.type = Math.random() < 0.5 ? "sine" : "triangle";
      osc.frequency.value = root * mult;
      // Slow detune wobble for life.
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.07 + Math.random() * 0.13;
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.detune);
      osc.connect(padGain);
      osc.start(now);
      lfo.start(now);
      osc.stop(now + dur + 1);
      lfo.stop(now + dur + 1);
    });

    // Slow ADSR envelope.
    padGain.gain.linearRampToValueAtTime(0.16, now + 4);
    padGain.gain.linearRampToValueAtTime(0.16, now + dur - 4);
    padGain.gain.linearRampToValueAtTime(0, now + dur);

    // Schedule the next pad slightly overlapping for seamlessness.
    const next = (dur - 2 + Math.random() * 2) * 1000;
    padTimerRef.current = setTimeout(schedulePad, next);
  }, []);

  // Start / stop pad loop when (un)muted.
  React.useEffect(() => {
    if (!ready) return;
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;

    if (muted) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      if (padTimerRef.current) {
        clearTimeout(padTimerRef.current);
        padTimerRef.current = null;
      }
    } else {
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 1.2);
      if (!padTimerRef.current) schedulePad();
    }
  }, [muted, ready, schedulePad]);

  // Tick on click (subtle, only when audio is active).
  React.useEffect(() => {
    if (!ready) return;
    const onClick = () => {
      const ctx = ctxRef.current;
      const master = masterRef.current;
      if (!ctx || !master || muted) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 1800 + Math.random() * 400;
      g.gain.value = 0;
      osc.connect(g);
      g.connect(master);
      g.gain.linearRampToValueAtTime(0.035, now + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.06);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [muted, ready]);

  // Knock on hover over interactive elements.
  React.useEffect(() => {
    if (!ready) return;
    let last = 0;
    const onOver = (e: MouseEvent) => {
      if (muted) return;
      const target = e.target as HTMLElement | null;
      if (!target?.closest) return;
      if (!target.closest("a, button, [role=button], [role=link]")) return;
      const now = performance.now();
      if (now - last < 120) return; // throttle so it doesn't spam on big areas
      last = now;
      const ctx = ctxRef.current;
      const master = masterRef.current;
      if (!ctx || !master) return;
      const t = ctx.currentTime;
      // Synthesised knock: short noise burst through a lowpass.
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const env = 1 - i / data.length;
        data[i] = (Math.random() * 2 - 1) * env * env;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 320 + Math.random() * 120;
      const g = ctx.createGain();
      g.gain.value = 0.05;
      src.connect(lp);
      lp.connect(g);
      g.connect(master);
      src.start(t);
      src.stop(t + 0.1);
    };
    window.addEventListener("mouseover", onOver);
    return () => window.removeEventListener("mouseover", onOver);
  }, [muted, ready]);

  // Cleanup on unmount.
  React.useEffect(() => {
    return () => {
      if (padTimerRef.current) clearTimeout(padTimerRef.current);
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  const toggle = () => {
    setMuted((m) => {
      const next = !m;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? "Enable ambient sound" : "Mute ambient sound"}
      aria-pressed={!muted}
      title={muted ? "Enable ambient sound" : "Mute ambient sound"}
      className="fixed bottom-4 left-4 z-40 h-11 w-11 grid place-items-center rounded-full border border-white/10 bg-bg-0/70 backdrop-blur-xl text-text-muted hover:text-text hover:bg-bg-0/90 transition shadow-lg shadow-black/40"
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}
