"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Fixed scroll-progress hairline. (The full-screen paper-grain overlay was removed: a fixed,
 * blended layer over the whole page forced a full re-composite on every scroll frame.)
 */
export default function PageChrome() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent will-change-transform"
    />
  );
}
