"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Masked line reveal: each line slides up from behind its own clip box.
 * Pass one string per visual line so line breaks stay under our control.
 */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  play,
}: {
  lines: React.ReactNode[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Drive the reveal externally instead of waiting for it to scroll into view. */
  play?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = play ?? inView;

  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            initial={{ y: "110%" }}
            animate={show ? { y: "0%" } : undefined}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// Quick and subtle so content is readable almost as soon as it scrolls in.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Fade-and-rise for blocks of content. Children with `variants={item}` stagger. */
export function FadeIn({
  children,
  className,
  delay = 0,
  stagger = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "div" | "ul" | "ol" | "section" | "dl";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
      variants={{
        hidden: fadeUp.hidden,
        show: {
          ...(fadeUp.show as object),
          transition: {
            duration: 0.55,
            ease: EASE,
            delay,
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </Comp>
  );
}

export const item = fadeUp;

/** Plain, scannable section header: small index, clear title, one-line intro (or a control on the right). */
export function SectionHeader({
  index,
  title,
  intro,
  aside,
}: {
  index: string;
  title: string;
  intro?: string;
  /** Rendered where the intro would sit, e.g. a view switch. */
  aside?: React.ReactNode;
}) {
  return (
    <FadeIn className="flex flex-col gap-4 border-t border-foreground pt-5 md:flex-row md:items-end md:justify-between md:gap-10">
      <div>
        <span className="label">{index}</span>
        <h2 className="mt-2 font-display text-4xl font-medium tracking-[-0.04em] md:text-5xl">
          {title}
        </h2>
      </div>
      {intro && (
        <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground md:text-right">
          {intro}
        </p>
      )}
      {aside}
    </FadeIn>
  );
}
