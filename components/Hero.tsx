"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, MessageCircle, Sparkles } from "lucide-react";
import { EASE } from "@/components/motion/Reveal";
import { openContact } from "@/components/Contact";
import Magnetic from "@/components/motion/Magnetic";
import FillButton from "@/components/motion/FillButton";
import { useFinePointer } from "@/components/motion/useFinePointer";

// Transparent WebP (background already removed) — keep it WebP/PNG so the transparency survives.
const PORTRAIT = "/Images/sourav-portrait.webp";

// Core four first (as in the mock), then the rest of the stack so the marquee loop has length.
const HERO_SKILLS = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Node.js",
  "JavaScript",
  "Tailwind CSS",
  "React Query",
  "Zustand",
  "Socket.IO",
  "WebRTC",
  "Redis",
  "REST APIs",
];
const ACCENT_WORDS = ["MERN", "Stack", "Developer."];

/**
 * "MERN Stack Developer." — a one-time smoke reveal on first load: each word drifts
 * up out of a heavy blur and settles, then stays still.
 */
function AccentLine({ play }: { play: boolean }) {
  return (
    <p
      aria-label={ACCENT_WORDS.join(" ")}
      className="mt-3 flex flex-wrap gap-x-[0.3em] font-serif text-[clamp(1.7rem,2.8vw,2.6rem)] leading-[1.15] tracking-[-0.01em] text-[hsl(18_70%_62%)] italic"
    >
      {ACCENT_WORDS.map((word, i) => (
        <motion.span
          key={word}
          aria-hidden
          initial={{ opacity: 0, y: "40%", scale: 1.08, filter: "blur(14px)" }}
          animate={play ? { opacity: 1, y: "0%", scale: 1, filter: "blur(0px)" } : undefined}
          transition={{ duration: 1.2, ease: EASE, delay: 0.35 + i * 0.22 }}
          className="inline-block pb-[0.12em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

/**
 * Endless skills marquee under the buttons. The list is rendered twice so the
 * -50% loop is seamless; edges fade out and hovering pauses it.
 */
function HeroSkills({ play }: { play: boolean }) {
  const row = (copy: number) =>
    HERO_SKILLS.map((skill) => (
      <li
        key={`${copy}-${skill}`}
        aria-hidden={copy > 0 || undefined}
        className="flex shrink-0 items-center gap-6 pr-6 text-sm font-medium whitespace-nowrap text-foreground/60 transition-colors duration-300 hover:text-accent"
      >
        {skill}
        <span aria-hidden className="h-1 w-1 rounded-full bg-accent/70" />
      </li>
    ));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={play ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
      className="group mt-8 max-w-xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
    >
      <ul
        aria-label="Skills"
        className="flex w-max animate-[marquee_28s_linear_infinite] group-hover:[animation-play-state:paused]"
      >
        {row(0)}
        {row(1)}
      </ul>
    </motion.div>
  );
}

export default function Hero() {
  // Entrance plays once the page has hydrated.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const fine = useFinePointer();

  // Scroll-linked motion as the hero leaves the viewport.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.0005 });
  const line1X = useTransform(p, [0, 1], ["0%", "-10%"]);
  const line3X = useTransform(p, [0, 1], ["0%", "-16%"]);
  const textOpacity = useTransform(p, [0, 0.55], [1, 0]);
  const textY = useTransform(p, [0, 1], ["0%", "-18%"]);
  const portraitY = useTransform(p, [0, 1], ["0%", "-14%"]);
  const portraitScale = useTransform(p, [0, 1], [1, 1.12]);
  const portraitRotate = useTransform(p, [0, 1], [0, -5]);
  const glowScale = useTransform(p, [0, 1], [1, 1.45]);

  // 3D sticker tilt toward the cursor.
  const spring = { stiffness: 110, damping: 18, mass: 0.6 };
  const mx = useSpring(useMotionValue(0), spring);
  const my = useSpring(useMotionValue(0), spring);
  const rotateY = useTransform(mx, (v) => v * 9);
  const rotateX = useTransform(my, (v) => -v * 7);
  const glowX = useTransform(mx, (v) => v * 30);
  const glowY = useTransform(my, (v) => v * 30);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!fine) return;
    mx.set((e.clientX / window.innerWidth - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const line = (delay: number) => ({
    initial: { y: "110%" },
    animate: ready ? { y: "0%" } : undefined,
    transition: { duration: 1.1, ease: EASE, delay },
  });
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      // Phones: grows with content (photo sits below the text). Desktop: exactly one screen.
      className="relative min-h-[100svh] overflow-hidden lg:h-[100svh] lg:min-h-[640px]"
    >
      {/* Peach glow behind the portrait */}
      <motion.div
        aria-hidden
        style={{ scale: glowScale, x: glowX, y: glowY }}
        className="pointer-events-none absolute top-[10%] right-[-12%] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle,hsl(18_100%_76%/0.38)_0%,hsl(18_100%_84%/0.17)_40%,transparent_70%)] will-change-transform lg:right-[2%]"
      />

      {/* Copy — vertically centred on the left (top area on phones) */}
      <div className="shell relative z-10 flex items-start pt-28 lg:h-full lg:items-center lg:pt-16">
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="w-full max-w-xl lg:max-w-[48%]"
        >
          <motion.span
            {...fade(0.1)}
            className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.06em] text-foreground/65 uppercase"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            Available for MERN stack roles
          </motion.span>

          <h1 className="mt-5 font-display text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[1.06] font-medium tracking-[-0.035em]">
            <motion.span style={{ x: line1X }} className="block overflow-hidden pb-[0.08em]">
              <motion.span {...line(0.15)} className="block">
                I Build Digital Products That Make an Impact.
              </motion.span>
            </motion.span>
          </h1>

          <motion.div style={{ x: line3X }}>
            <AccentLine play={ready} />
          </motion.div>

          <motion.p
            {...fade(0.5)}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-[17px]"
          >
            I&apos;m Sourav Gokul V, building responsive,
            production-ready applications with MongoDB, Express, React and Node.js. From
            e-commerce to real-time WebRTC platforms, I turn complex requirements into
            seamless user experiences.
          </motion.p>

          <motion.div {...fade(0.65)} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <FillButton
                href="#projects"
                className="h-12 bg-foreground px-6 text-sm font-medium text-background shadow-[0_14px_30px_-10px_rgba(0,0,0,0.45)]"
              >
                View My Work
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/fill:translate-x-0.5 group-hover/fill:-translate-y-0.5" />
              </FillButton>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={openContact}
                className="group inline-flex cursor-pointer h-12 items-center gap-2 rounded-full border border-foreground/15 bg-background/80 px-6 text-sm font-medium transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
              >
                Let&apos;s Talk
                <MessageCircle className="h-4 w-4" />
              </button>
            </Magnetic>
          </motion.div>

          <HeroSkills play={ready} />
        </motion.div>
      </div>

      {/* Portrait — transparent photo used as-is, so the page and peach glow show around it */}
      <motion.div
        style={{ y: portraitY, scale: portraitScale, rotate: portraitRotate }}
        // Phones: in the normal flow below the text so it never covers it. Desktop: bottom-right.
        className="relative mt-4 aspect-[1402/1122] w-full origin-bottom sm:mx-auto sm:w-[80%] lg:absolute lg:right-[4vw] lg:bottom-0 lg:mx-0 lg:mt-0 lg:h-[calc(90%+20px)] lg:w-auto lg:max-w-[78%]"
      >
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.96 }}
          animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
          style={{ rotateX, rotateY, transformPerspective: 1400 }}
          className="relative h-full w-full [mask-image:linear-gradient(to_bottom,#000_78%,transparent_100%)]"
        >
          <Image
            src={PORTRAIT}
            alt="Sourav Gokul V"
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-contain object-bottom"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
