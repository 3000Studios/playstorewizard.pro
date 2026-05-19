"use client";

/**
 * SupportChat — floating help widget bottom-right.
 * Calls /api/ai/support which is rate-limited and runs on Workers AI.
 * Conversation history is kept in component state only (no persistence).
 */

import * as React from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "How do I update my app on the Play Store?",
  "Why was my app rejected for data safety?",
  "How do I run the 14-day closed test?",
  "What does my store listing need?",
];

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hi! I'm the Playstore Wizard helper. Ask me anything about getting your Android app published or updated on the Google Play Store — listing requirements, the .aab build, content rating, data safety, rejections, anything.",
};

export function SupportChat() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Msg[]>([WELCOME]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const history = messages.filter((m) => m !== WELCOME);
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/ai/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const data = (await res.json().catch(() => null)) as
        | { reply?: string; error?: string; retryAfter?: number }
        | null;
      if (!res.ok || !data?.reply) {
        const err =
          data?.error ??
          (res.status === 429
            ? `Slow down — try again in ${data?.retryAfter ?? 60}s.`
            : `Sorry, something went wrong (HTTP ${res.status}).`);
        setMessages((prev) => [...prev, { role: "assistant", content: err }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply! }]);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Network error";
      setMessages((prev) => [...prev, { role: "assistant", content: `Sorry — ${msg}` }]);
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close help chat" : "Open help chat"}
        aria-expanded={open}
        className="fixed bottom-4 right-4 z-40 h-14 w-14 grid place-items-center rounded-full text-white shadow-lg shadow-fuchsia-900/40 transition hover:scale-105 active:scale-95"
        style={{
          backgroundImage:
            "linear-gradient(135deg,#6366f1 0%,#8b5cf6 35%,#d946ef 75%,#f43f5e 100%)",
        }}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Playstore Wizard support chat"
          className="fixed bottom-20 right-4 z-40 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[min(640px,calc(100vh-6rem))] flex flex-col rounded-2xl border border-white/10 bg-bg-0/95 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden"
        >
          <header
            className="flex items-center gap-2 px-4 py-3 border-b border-white/10"
            style={{
              backgroundImage:
                "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(217,70,239,0.12))",
            }}
          >
            <Sparkles className="h-4 w-4 text-indigo-300" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-text">Play Store help</div>
              <div className="text-[11px] text-text-muted">
                Free · powered by AI · trained on Play Console rules
              </div>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-[14px] leading-relaxed"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-indigo-500/20 border border-indigo-400/20 px-3.5 py-2.5 text-text"
                    : "mr-auto max-w-[90%] rounded-2xl rounded-tl-sm bg-bg-2/70 border border-white/5 px-3.5 py-2.5 text-text whitespace-pre-wrap"
                }
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="mr-auto max-w-[90%] rounded-2xl rounded-tl-sm bg-bg-2/70 border border-white/5 px-3.5 py-2.5 text-text-muted">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-bounce" />
                </span>
              </div>
            )}

            {messages.length === 1 && !busy && (
              <div className="pt-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="text-[12px] px-2.5 py-1 rounded-full border border-white/10 bg-bg-2/60 text-text-muted hover:text-text hover:bg-bg-3 hover:border-white/20 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="border-t border-white/10 p-2 flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask anything about Google Play…"
              className="flex-1 resize-none bg-bg-2/60 border border-white/10 rounded-xl px-3 py-2 text-[14px] text-text placeholder:text-text-muted/70 focus:outline-none focus:border-indigo-400/50 max-h-32"
              disabled={busy}
              maxLength={2000}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="h-9 w-9 grid place-items-center rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition hover:scale-105 active:scale-95"
              style={{
                backgroundImage:
                  "linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#d946ef 100%)",
              }}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
