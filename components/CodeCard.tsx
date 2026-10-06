"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";

type Tok = { t: string; c?: "kw" | "str" | "num" | "key" | "com" | "bool" | "pun" };

// A small TypeScript "profile" object, tokenised for syntax colouring.
const LINES: Tok[][] = [
  [{ t: "const ", c: "kw" }, { t: "sourav" }, { t: ": ", c: "pun" }, { t: "Developer", c: "kw" }, { t: " = {", c: "pun" }],
  [{ t: "  role", c: "key" }, { t: ": ", c: "pun" }, { t: '"Frontend Developer"', c: "str" }, { t: ",", c: "pun" }],
  [{ t: "  stack", c: "key" }, { t: ": [", c: "pun" }, { t: '"React"', c: "str" }, { t: ", ", c: "pun" }, { t: '"Next.js"', c: "str" }, { t: ", ", c: "pun" }, { t: '"TypeScript"', c: "str" }, { t: "],", c: "pun" }],
  [{ t: "  realtime", c: "key" }, { t: ": ", c: "pun" }, { t: '"LiveKit · WebRTC"', c: "str" }, { t: ",", c: "pun" }],
  [{ t: "  award", c: "key" }, { t: ": ", c: "pun" }, { t: '"Future UX Star"', c: "str" }, { t: ",", c: "pun" }],
  [{ t: "  productsShipped", c: "key" }, { t: ": ", c: "pun" }, { t: "4", c: "num" }, { t: ",", c: "pun" }],
  [{ t: "  basedIn", c: "key" }, { t: ": ", c: "pun" }, { t: '"Bengaluru"', c: "str" }, { t: ",", c: "pun" }],
  [{ t: "  openToWork", c: "key" }, { t: ": ", c: "pun" }, { t: "true", c: "bool" }, { t: ",", c: "pun" }, { t: "  // let's talk", c: "com" }],
  [{ t: "};", c: "pun" }],
];

const COLOR: Record<NonNullable<Tok["c"]>, string> = {
  kw: "text-[#c792ea]",
  str: "text-[#ffb37a]",
  num: "text-[#ff7a3d]",
  key: "text-[#9ecbff]",
  com: "text-white/35 italic",
  bool: "text-[#ff4d00]",
  pun: "text-white/55",
};

const TOTAL = LINES.reduce((n, line) => n + line.reduce((m, tok) => m + tok.t.length, 0) + 1, 0);

/** Editor-style card that types out a profile object once it starts. */
export default function CodeCard({
  play,
  rotateX,
  rotateY,
}: {
  play: boolean;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!play) return;
    if (reduce) {
      setShown(TOTAL);
      return;
    }
    let n = 0;
    const id = setInterval(() => {
      n += 3;
      setShown(Math.min(n, TOTAL));
      if (n >= TOTAL) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [play, reduce]);

  // Render tokens up to `shown` characters; track where the caret should sit.
  let budget = shown;
  let caretLine = 0;

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#141414] shadow-[0_40px_90px_-40px_rgba(255,77,0,0.45)]"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[11px] text-white/50">sourav.ts</span>
        <span className="ml-auto font-mono text-[10px] tracking-[0.12em] text-white/35 uppercase">
          TypeScript
        </span>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto px-4 py-5 font-mono text-[10.5px] leading-[1.9] min-[400px]:text-[11.5px] sm:text-[13px]">
        <code>
          {LINES.map((line, li) => {
            const visible: React.ReactNode[] = [];
            for (const [ti, tok] of line.entries()) {
              if (budget <= 0) break;
              const text = tok.t.slice(0, budget);
              budget -= tok.t.length;
              visible.push(
                <span key={ti} className={tok.c ? COLOR[tok.c] : "text-white/90"}>
                  {text}
                </span>,
              );
            }
            if (budget > 0) {
              budget -= 1; // the newline
              caretLine = li + 1;
            } else if (visible.length) {
              caretLine = li;
            }
            return (
              <span key={li} className="flex">
                <span className="mr-4 inline-block w-5 shrink-0 text-right text-white/20 select-none">
                  {li + 1}
                </span>
                <span className="whitespace-pre">
                  {visible}
                  {li === Math.min(caretLine, LINES.length - 1) && (
                    <span className="ml-px inline-block h-[1.1em] w-[7px] translate-y-[3px] animate-pulse bg-accent" />
                  )}
                </span>
              </span>
            );
          })}
        </code>
      </pre>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 font-mono text-[10px] text-white/40">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
          0 errors · strict
        </span>
        <span>Ln {Math.min(caretLine + 1, LINES.length)}, UTF-8</span>
      </div>
    </motion.div>
  );
}
