"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { ArrowUp, Square, X } from "lucide-react";
import { profile } from "@/lib/content";
import { EASE } from "@/components/motion/Reveal";

const MAX_CHARS = 500;
const GREET_AT = 2000; // ms after page load
const GREETING_MS = 2200; // how long the greeting stays up

/** One-tap starters shown while the chat is empty. */
const SUGGESTED_QUESTIONS = [
  "Tell me about Sourav's experience.",
  "Is he a fit for a React developer role?",
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
  // Greeting on every page load: 2s after load, shown briefly; the bot itself is there from the start.
  const [greeting, setGreeting] = useState(false);
  useEffect(() => {
    let hide: ReturnType<typeof setTimeout>;
    const show = setTimeout(() => {
      setGreeting(true);
      hide = setTimeout(() => setGreeting(false), GREETING_MS);
    }, Math.max(0, GREET_AT - performance.now()));
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

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
      {/* Launcher: a floating 3D AI bot; greets 2s after every page load, then just hovers */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={`fixed right-3 bottom-4 z-[80] flex items-center gap-2 md:right-5 md:bottom-5 ${greeting ? "is-greeting" : ""}`}
          >
            <AnimatePresence>
              {greeting && (
                <motion.button
                  type="button"
                  onClick={() => setOpen(true)}
                  tabIndex={-1}
                  aria-hidden
                  initial={{ opacity: 0, x: 10, scale: 0.85 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 8, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                  className="relative origin-right cursor-pointer rounded-2xl rounded-br-sm border border-border bg-background px-3.5 py-2 text-left text-[13px] leading-snug shadow-[0_12px_30px_-14px_rgba(0,0,0,0.4)]"
                >
                  <span className="block font-semibold">Hi there! 👋</span>
                  <span className="block text-muted-foreground">
                    I&apos;m {profile.name.split(" ")[0]}&apos;s personal AI assistant
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={() => setOpen(true)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Ask the AI assistant about Sourav"
              className="relative flex h-[100px] w-[76px] shrink-0 cursor-pointer items-end justify-center bg-transparent"
            >
              <Bot />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

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
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#fbe6da] ring-2 ring-accent/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Images/sourav-avatar.webp" alt="" className="h-full w-full object-cover" />
              </span>
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

/**
 * The launcher's mascot (pearl, graphite and champagne gold, to match the site): a chibi 3D-style robot — big glossy helmet with headphones, a glass
 * visor with glowing eyes, a glowing collar ring, a small body, arms and boots. Pure shaded SVG
 * (no image or 3D library); animations live in globals.css.
 */
function Bot() {
  return (
    <svg viewBox="0 0 100 132" className="bot-svg h-[100px] w-[76px] overflow-visible" aria-hidden>
      <defs>
        {/* White shell, lit from the top-left, shading to lavender */}
        <radialGradient id="cb-shell" cx="34%" cy="26%" r="85%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#f6f2ec" />
          <stop offset="78%" stopColor="#dcd3c8" />
          <stop offset="100%" stopColor="#b9ad9f" />
        </radialGradient>
        <radialGradient id="cb-body" cx="35%" cy="22%" r="90%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#ece6de" />
          <stop offset="100%" stopColor="#b5a99b" />
        </radialGradient>
        {/* Graphite plastic */}
        <radialGradient id="cb-violet" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#6e6864" />
          <stop offset="50%" stopColor="#2f2b29" />
          <stop offset="100%" stopColor="#141211" />
        </radialGradient>
        <radialGradient id="cb-violet-soft" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#a29a93" />
          <stop offset="60%" stopColor="#5d5752" />
          <stop offset="100%" stopColor="#34302d" />
        </radialGradient>
        {/* Glass visor */}
        <linearGradient id="cb-visor" x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor="#2e2925" />
          <stop offset="100%" stopColor="#0a0908" />
        </linearGradient>
        {/* Champagne-gold collar ring */}
        <linearGradient id="cb-ring" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a8844c" />
          <stop offset="50%" stopColor="#f5e3bd" />
          <stop offset="100%" stopColor="#a8844c" />
        </linearGradient>
        <radialGradient id="cb-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(20,16,12,0.3)" />
          <stop offset="100%" stopColor="rgba(20,16,12,0)" />
        </radialGradient>
        <filter id="cb-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse className="bot-shadow" cx="50" cy="127" rx="24" ry="4" fill="url(#cb-shadow)" />

      <g className="bot-float">
        {/* Legs + boots */}
        <g className="bot-leg-l">
          <rect x="34" y="104" width="12" height="16" rx="5" fill="url(#cb-body)" />
          <rect x="31.5" y="113" width="17" height="10" rx="5" fill="url(#cb-violet)" />
          <ellipse cx="37" cy="115.5" rx="3.5" ry="1.4" fill="#fff" opacity="0.45" />
        </g>
        <g className="bot-leg-r">
          <rect x="54" y="104" width="12" height="16" rx="5" fill="url(#cb-body)" />
          <rect x="51.5" y="113" width="17" height="10" rx="5" fill="url(#cb-violet)" />
          <ellipse cx="57" cy="115.5" rx="3.5" ry="1.4" fill="#fff" opacity="0.45" />
        </g>

        {/* Left arm (resting) */}
        <g className="bot-arm-l">
          <rect x="18" y="80" width="11" height="22" rx="5.5" fill="url(#cb-body)" transform="rotate(16 23.5 81)" />
          <circle cx="20" cy="102" r="5.4" fill="url(#cb-violet-soft)" />
        </g>

        {/* Right arm — waves when greeting (pivots at the shoulder) */}
        <g className="bot-hand">
          <rect x="71" y="80" width="11" height="22" rx="5.5" fill="url(#cb-body)" transform="rotate(-16 76.5 81)" />
          <circle cx="80" cy="102" r="5.4" fill="url(#cb-violet-soft)" />
        </g>

        {/* Body */}
        <rect x="27" y="76" width="46" height="34" rx="15" fill="url(#cb-body)" />
        <ellipse cx="39" cy="82" rx="8" ry="3" fill="#fff" opacity="0.75" />
        {/* Chest panel + light */}
        <rect x="39" y="86" width="22" height="14" rx="6" fill="url(#cb-violet)" />
        <circle className="bot-antenna" cx="50" cy="93" r="3.2" fill="#f3dcae" filter="url(#cb-glow)" />

        {/* Collar ring */}
        <ellipse cx="50" cy="76" rx="20" ry="5.5" fill="none" stroke="url(#cb-ring)" strokeWidth="4" filter="url(#cb-glow)" />

        {/* Headphone band */}
        <path d="M14 46 Q14 10 50 9 Q86 10 86 46" fill="none" stroke="url(#cb-violet)" strokeWidth="5" strokeLinecap="round" />

        {/* Helmet head */}
        <rect x="16" y="14" width="68" height="60" rx="28" fill="url(#cb-shell)" />
        {/* Top ridge */}
        <rect x="42" y="12" width="16" height="7" rx="3.5" fill="url(#cb-violet-soft)" />
        {/* Specular highlight */}
        <ellipse cx="33" cy="25" rx="12" ry="5" fill="#fff" opacity="0.9" transform="rotate(-24 33 25)" />

        {/* Ear cups */}
        <g>
          <ellipse cx="14" cy="46" rx="9" ry="12" fill="url(#cb-violet)" />
          <ellipse cx="13" cy="46" rx="5" ry="7.5" fill="url(#cb-violet-soft)" />
          <ellipse cx="11" cy="41" rx="2" ry="3" fill="#fff" opacity="0.55" />
        </g>
        <g>
          <ellipse cx="86" cy="46" rx="9" ry="12" fill="url(#cb-violet)" />
          <ellipse cx="87" cy="46" rx="5" ry="7.5" fill="url(#cb-violet-soft)" />
          <ellipse cx="84" cy="41" rx="2" ry="3" fill="#fff" opacity="0.5" />
        </g>

        {/* Visor */}
        <rect x="25" y="31" width="50" height="33" rx="15" fill="url(#cb-visor)" />
        <path d="M31 36.5 Q50 31.5 69 36.5" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="2.6" strokeLinecap="round" />

        {/* Glowing eyes (blink) */}
        <g className="bot-eyes" fill="#fbe7c4" filter="url(#cb-glow)">
          <rect x="35" y="42" width="8" height="12" rx="4" />
          <rect x="57" y="42" width="8" height="12" rx="4" />
        </g>
        <ellipse cx="37.5" cy="45" rx="1.3" ry="2" fill="#fff" opacity="0.9" />
        <ellipse cx="59.5" cy="45" rx="1.3" ry="2" fill="#fff" opacity="0.9" />
      </g>
    </svg>
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
