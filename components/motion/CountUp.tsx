"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Counts the last number in a value like "250+" or "10 → 80" up from 0 when it scrolls
 * into view. Non-numeric values ("SSR", "Real-time") render as-is.
 */
export default function CountUp({ value, duration = 1.4 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^(.*?)([\d,]+)([^\d]*)$/);
  const target = match ? Number(match[2].replace(/,/g, "")) : 0;
  const [current, setCurrent] = useState(match && !reduce ? 0 : target);

  useEffect(() => {
    if (!match || !inView || reduce) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCurrent(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, target, duration]);

  if (!match) return <span ref={ref}>{value}</span>;
  return (
    // Screen readers get the final value, not the ticking one.
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{value}</span>
      <span aria-hidden>
        {match[1]}
        {current.toLocaleString("en-US")}
        {match[3]}
      </span>
    </span>
  );
}
