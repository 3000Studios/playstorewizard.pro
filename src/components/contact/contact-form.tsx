"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2 } from "lucide-react";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok"; msg: string } | { kind: "err"; msg: string };

const SUBJECTS = [
  "General inquiry",
  "Bug report",
  "Feature request",
  "Support — stuck on a step",
  "Billing or subscription",
  "Press / partnership",
] as const;

export function ContactForm() {
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState<(typeof SUBJECTS)[number]>("General inquiry");
  const [message, setMessage] = React.useState("");
  const [hp, setHp] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status.kind === "sending") return;
    setStatus({ kind: "sending" });
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, honeypot: hp }),
      });
      const d = (await r.json().catch(() => ({}))) as { ok?: boolean; message?: string; error?: string };
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      setStatus({ kind: "ok", msg: d.message ?? "Thanks — we'll be in touch shortly." });
      setName("");
      setEmail("");
      setMessage("");
      setSubject("General inquiry");
    } catch (err) {
      setStatus({ kind: "err", msg: err instanceof Error ? err.message : "Could not send" });
    }
  }

  if (status.kind === "ok") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-emerald-400/40 bg-emerald-500/[0.06] p-8 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
        <h2 className="font-display font-semibold text-xl">Message sent.</h2>
        <p className="mt-2 text-sm text-text-muted">{status.msg}</p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-5 text-xs text-indigo-300 hover:text-indigo-200 underline-offset-4 underline"
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-bg-2/40 p-6 sm:p-8 space-y-5"
      noValidate
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Name</span>
          <input
            required
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-lg bg-bg-1 border border-border px-3 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
            placeholder="Jane Developer"
          />
        </label>
        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg bg-bg-1 border border-border px-3 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Subject</span>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value as (typeof SUBJECTS)[number])}
          className="mt-1.5 w-full rounded-lg bg-bg-1 border border-border px-3 py-2.5 text-sm text-text focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Message</span>
        <textarea
          required
          rows={6}
          minLength={10}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5 w-full rounded-lg bg-bg-1 border border-border px-3 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 resize-y"
          placeholder="What's on your mind? Include the wizard step name if you're stuck somewhere."
        />
        <span className="mt-1 block text-[11px] text-text-dim font-mono">{message.length} / 5000</span>
      </label>

      {/* Honeypot — hidden from real users; bots fill it and get silently dropped */}
      <div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden>
        <label>
          Leave this empty
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
          />
        </label>
      </div>

      {status.kind === "err" && (
        <p role="alert" className="text-sm text-rose-300">
          {status.msg}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-text-dim">We reply within one business day.</p>
        <Button type="submit" variant="aurora" size="md" disabled={status.kind === "sending"}>
          <Send className="h-4 w-4" />
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
