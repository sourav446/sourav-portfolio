"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { ArrowUp, Square, X } from "lucide-react";
import { profile } from "@/lib/content";
import { EASE } from "@/components/motion/Reveal";
import { CornerWeb, SpiderAvatar, SpiderLauncher } from "@/components/SpiderBot";

const MAX_CHARS = 500;

/** One-tap starters shown while the chat is empty. */
const SUGGESTED_QUESTIONS = [
  "Tell me about Sourav's experience.",
  "Is he a fit for a React developer role?",
  "Is he a fit for a MERN Stack developer role?",
  "How can I contact him?",
];

const textOf = (m: UIMessage) =>
  m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .replace(/\*\*(.+?)\*\*/g, "$1"); // the model is asked for plain text; strip stray bold just in case

/** The route answers errors as JSON ({ error }); show that message, never a raw stack. */
function friendly(error: Error | undefined) {
  if (!error) return null;
  try {
    const parsed = JSON.parse(error.message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {}
  return error.message && error.message.length < 200
    ? error.message
    : `Something went wrong — please email me at ${profile.email}.`;
}

/**
 * "Ask about Sourav": a floating launcher that opens a chat panel (full-screen sheet on phones).
 * Answers stream from /api/chat (Gemini via the Vercel AI SDK) and are grounded in the portfolio's
 * own content.
 */
export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop, clearError } = useChat();
  const busy = status === "submitted" || status === "streaming";
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  const ask = (text: string) => {
    const q = text.trim().slice(0, MAX_CHARS);
    if (!q || busy) return;
    clearError();
    sendMessage({ text: q });
    setInput("");
  };

  // Keep the newest message in view while answers stream in.
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Esc closes; focus the field on open; lock the page behind the full-screen sheet on phones.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const phone = window.matchMedia("(max-width: 767px)").matches;
    if (phone) document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => field.current?.focus({ preventScroll: true }), 250);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (phone) document.documentElement.style.overflow = "";
      clearTimeout(t);
    };
  }, [open]);

  const errorText = friendly(error);

  return (
    <>
      {/* Launcher: the robot spider on its web (see SpiderBot.tsx) */}
      <CornerWeb />
      {/* Stays mounted while the chat is open: it swings into the header, then drops back on close */}
      <SpiderLauncher open={open} onOpen={() => setOpen(true)} />

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Chat with the AI assistant"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-[85] flex flex-col bg-background md:inset-auto md:right-6 md:bottom-6 md:h-[min(600px,calc(100dvh-7rem))] md:w-[400px] md:origin-bottom-right md:overflow-hidden md:rounded-3xl md:border md:border-border md:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]"
          >
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-border px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3.5 md:pt-4">
              {/* The spider lands here when you tap it (SpiderLauncher flies to this 48×40 slot) */}
              <motion.span
                aria-hidden
                data-chat-avatar
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.62, duration: 0.18 }}
                className="flex h-10 w-12 shrink-0 items-center justify-center"
              >
                <SpiderAvatar />
              </motion.span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15px] leading-tight font-semibold">Ask about {profile.name.split(" ")[0]}</p>
                <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.06em] text-muted-foreground uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3ddc84]" />
                  AI assistant
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border transition-colors hover:bg-card"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Messages */}
            <div ref={scroller} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-5">
              <Bubble role="assistant">
                Hi! I&apos;m {profile.name.split(" ")[0]}&apos;s AI assistant. Ask me about his projects, skills or
                experience — or how to get in touch.
              </Bubble>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => ask(q)}
                      className="cursor-pointer rounded-full border border-border bg-card px-3.5 py-2 text-left text-[13px] transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m) => {
                const text = textOf(m);
                // The callback tool's progress, if the assistant used it in this message
                const callback = m.parts.find((p) => p.type === "tool-requestCallback") as
                  | { state: string; output?: { ok?: boolean } }
                  | undefined;
                if (!text && !callback) return null;
                return (
                  <div key={m.id} className="space-y-2">
                    {callback && <CallbackStatus state={callback.state} ok={callback.output?.ok} />}
                    {text && <Bubble role={m.role === "user" ? "user" : "assistant"}>{text}</Bubble>}
                  </div>
                );
              })}

              {status === "submitted" && (
                <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}

              {errorText && (
                <p className="rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3 text-[13px] leading-relaxed text-foreground">
                  {errorText}
                </p>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="border-t border-border px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-border bg-card px-3 py-2 transition-colors focus-within:border-foreground/40">
                <textarea
                  ref={field}
                  rows={1}
                  value={input}
                  maxLength={MAX_CHARS}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      ask(input);
                    }
                  }}
                  placeholder="Ask about projects, skills, experience…"
                  aria-label="Your question"
                  className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent py-1.5 text-[14px] outline-none placeholder:text-muted-foreground"
                />
                {busy ? (
                  <button
                    type="button"
                    onClick={() => stop()}
                    aria-label="Stop answering"
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-foreground text-background"
                  >
                    <Square className="h-3.5 w-3.5 fill-current" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Send question"
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-white transition-opacity disabled:cursor-default disabled:opacity-40"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-center font-mono text-[10px] tracking-[0.04em] text-muted-foreground">
                AI can make mistakes — check the résumé for details.
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const user = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap ${
        user
          ? "ml-auto rounded-br-md bg-foreground text-background"
          : "rounded-bl-md border border-border bg-card text-foreground"
      }`}
    >
      {children}
    </motion.div>
  );
}

/** Small status line while the assistant emails Sourav a recruiter's callback request. */
function CallbackStatus({ state, ok }: { state: string; ok?: boolean }) {
  const done = state === "output-available";
  const failed = state === "output-error" || (done && ok === false);
  return (
    <p
      className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-[0.04em] ${
        failed
          ? "border-accent/40 bg-accent/5 text-foreground"
          : done
            ? "border-[#3ddc84]/40 bg-[#3ddc84]/10 text-foreground"
            : "border-border bg-card text-muted-foreground"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          failed ? "bg-accent" : done ? "bg-[#3ddc84]" : "animate-pulse bg-muted-foreground"
        }`}
      />
      {failed ? "Couldn't send — use the email below" : done ? "Sent to Sourav's inbox" : "Sending to Sourav…"}
    </p>
  );
}
