"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { queryClient } from "@/lib/queryClient";

gsap.registerPlugin(ScrollTrigger);

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Native scrolling is the better experience for reduced-motion users.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Lenis is driven by GSAP's ticker (not its own rAF loop) and tells ScrollTrigger about
    // every scroll update, so smooth scrolling and all GSAP scroll animations run on the same
    // frame clock — no jitter between them.
    // Anchor jumps (nav, project index) glide with an expo ease-out instead of snapping.
    const lenis = new Lenis({
      lerp: 0.1,
      anchors: { duration: 1.4, easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)) },
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </QueryClientProvider>
  );
}
