"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects, type Project } from "@/lib/content";
import { EASE, SectionHeader } from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import LiveClassVisual from "@/components/LiveClassVisual";
import StoreVisual from "@/components/StoreVisual";
import { LmsVisual, PmtVisual } from "@/components/ProjectMocks";
import { useSpotlight } from "@/components/motion/useSpotlight";
import { useMediaQuery } from "@/components/motion/useMediaQuery";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Visual({ p }: { p: Project }) {
  switch (p.visual) {
    case "webrtc":
      return <LiveClassVisual />;
    case "store":
      return <StoreVisual />;
    case "lms":
      return <LmsVisual />;
    case "pmt":
      return <PmtVisual />;
  }
}

function Stat({ stat }: { stat: Project["stat"] }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="font-display text-4xl font-medium tracking-[-0.04em] text-accent">
        <CountUp value={stat.value} />
      </span>
      <span className="text-sm text-muted-foreground">{stat.label}</span>
    </p>
  );
}

function Highlights({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-[15px]">
      {items.map((h) => (
        <li key={h} className="flex gap-3">
          <span className="mt-[0.65em] h-px w-3 shrink-0 bg-foreground" />
          {h}
        </li>
      ))}
    </ul>
  );
}

function TechTags({ tech }: { tech: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Tech used">
      {tech.map((t) => (
        <li
          key={t}
          className="rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[11px] transition-[transform,background-color,color,border-color] duration-300 ease-out-expo hover:scale-110 hover:border-foreground hover:bg-foreground hover:text-background"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

const cardClass =
  "group relative h-full rounded-lg border border-border bg-card p-6 transition-[border-color,box-shadow] duration-300 hover:border-transparent md:p-8";

/** Project card with a cursor-following orange spotlight (surface + border). */
function SpotlightCard({ children, className }: { children: React.ReactNode; className: string }) {
  const { handlers } = useSpotlight(0);
  return (
    <article {...handlers} className={className}>
      <span aria-hidden className="spotlight-surface" />
      <span aria-hidden className="spotlight-border" />
      {children}
    </article>
  );
}

function Counter({ i, total }: { i: number; total: number }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
      <span className="text-foreground">{String(i + 1).padStart(2, "0")}</span> /{" "}
      {String(total).padStart(2, "0")}
    </span>
  );
}

/** Write-up on the left, the project's animated demo on the right. */
function ProjectCard({ p, i, total }: { p: Project; i: number; total: number }) {
  return (
    <SpotlightCard className={`${cardClass} grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10`}>
      <div className="relative flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex flex-wrap items-center gap-3">
            {p.featured && (
              <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-accent-foreground uppercase">
                Featured
              </span>
            )}
            <span className="label">{p.domain}</span>
          </span>
          <Counter i={i} total={total} />
        </div>
        <h3 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] md:text-4xl">{p.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{p.summary}</p>
        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="group/live mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Visit live site
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5" />
          </a>
        )}
        <div className="mt-6">
          <Stat stat={p.stat} />
        </div>
        <div className="mt-5">
          <Highlights items={p.highlights} />
        </div>
        <div className="mt-auto pt-6">
          <TechTags tech={p.tech} />
        </div>
      </div>
      <div className="relative">
        <Visual p={p} />
      </div>
    </SpotlightCard>
  );
}

/**
 * Desktop: the section pins (CSS sticky) and vertical scroll drives the cards sideways.
 * GSAP ScrollTrigger scrubs the track with a short catch-up (`scrub: 1.3`), so it glides
 * into place instead of following every wheel tick, and it runs on the same ticker as
 * Lenis. The pinned area is as tall as the horizontal travel, so overall speed matches scroll.
 */
function HorizontalGallery({ items }: { items: Project[] }) {
  const n = items.length;
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  // Horizontal travel = how much wider the track is than the viewport.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Rebuilt whenever the travel distance changes (the section's height changes with it).
  useGSAP(
    () => {
      const track = trackRef.current;
      const bar = barRef.current;
      if (!track || !bar || !distance) return;
      const setBar = gsap.quickSetter(bar, "scaleX");
      gsap.to(track, {
        x: () => -Math.max(0, track.scrollWidth - window.innerWidth),
        ease: "none",
        force3D: true,
        // Progress UI follows the smoothed position, so it stays in step with the cards.
        // (`this`, not the returned tween: GSAP calls this once while the tween is being created.)
        onUpdate: function (this: gsap.core.Tween) {
          const p = this.progress();
          setBar(p);
          setActive(Math.min(n - 1, Math.round(p * (n - 1))));
        },
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: reduce ? true : 1.3,
          invalidateOnRefresh: true,
        },
      });
      ScrollTrigger.refresh();
    },
    { scope: outerRef, dependencies: [distance, reduce, n], revertOnUpdate: true },
  );

  return (
    <div ref={outerRef} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-20 pb-6">
        <div
          ref={trackRef}
          className="flex w-max items-stretch gap-6 px-[max(3rem,calc((100vw-1440px)/2+3rem))] will-change-transform"
        >
          {items.map((p, i) => (
            // Each card on its own layer: a demo animating inside one card doesn't repaint the moving track.
            <div key={p.title} className="w-[min(1240px,90vw)] shrink-0 transform-gpu [contain:layout_paint]">
              <ProjectCard p={p} i={i} total={n} />
            </div>
          ))}
        </div>

        {/* Progress: bar + current project */}
        <div className="shell mt-8 flex items-center gap-6">
          <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
            <span className="text-foreground">{String(active + 1).padStart(2, "0")}</span> /{" "}
            {String(items.length).padStart(2, "0")}
          </span>
          <span className="relative h-px flex-1 overflow-hidden bg-border">
            <span
              ref={barRef}
              className="absolute inset-0 origin-left scale-x-0 bg-accent will-change-transform"
            />
          </span>
          <span className="flex gap-4">
            {items.map((p, i) => (
              <span
                key={p.title}
                className={`text-[12px] font-medium transition-colors duration-300 ${
                  i === active ? "text-foreground" : "text-muted-foreground/50"
                }`}
              >
                {p.short}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

// Tinted backdrop behind each demo in the carousel.
const TINTS = ["#fbe6da", "#e7ebf6", "#e6eefb", "#ece8e1"];

/** Carousel card: demo on top, the essentials below, highlights folded into a toggle. */
function CarouselCard({ p, i }: { p: Project; i: number }) {
  const [more, setMore] = useState(false);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_30px_60px_-40px_rgba(0,0,0,0.35)]">
      <div className="p-3" style={{ background: TINTS[i % TINTS.length] }}>
        <Visual p={p} />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {p.featured && (
            <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-accent-foreground uppercase">
              Featured
            </span>
          )}
          <span className="label">{p.domain}</span>
        </div>
        <h3 className="mt-3 font-display text-[26px] leading-[1.08] font-medium tracking-[-0.03em]">{p.title}</h3>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground">{p.summary}</p>

        <p className="mt-4 mb-4 flex items-baseline gap-2">
          <span className="font-display text-3xl font-medium tracking-[-0.04em] text-accent">
            <CountUp value={p.stat.value} />
          </span>
          <span className="text-sm text-muted-foreground">{p.stat.label}</span>
        </p>

        {/* Highlights + stack: folded by default so a whole card fits on a phone screen */}
        <button
          type="button"
          onClick={() => setMore((v) => !v)}
          aria-expanded={more}
          className="mt-auto flex cursor-pointer items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-left text-[14px] font-medium"
        >
          Key features &amp; stack
          <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            {p.highlights.length}
            <Plus className={`h-4 w-4 text-foreground transition-transform duration-300 ${more ? "rotate-45" : ""}`} />
          </span>
        </button>
        <AnimatePresence initial={false}>
          {more && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden"
            >
              <ul className="space-y-2 pt-3 text-[14px] leading-snug">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-[0.6em] h-px w-3 shrink-0 bg-accent" />
                    {h}
                  </li>
                ))}
              </ul>
              <ul className="flex flex-wrap pt-3 gap-1.5" aria-label="Tech used">
                {p.tech.map((t) => (
                  <li key={t} className="rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[11px]">
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
          >
            Visit live site <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}

/**
 * Phones, tablets and small laptops: a swipe carousel. Native scroll-snap does the physics
 * (so it feels right on touch); on every scroll frame each card is scaled, dimmed and tilted
 * by its distance from the centre — cards around the focused one recede in 3D.
 */
function ProjectCarousel({ items }: { items: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const centre = card.offsetLeft + card.offsetWidth / 2;
        const d = (centre - mid) / card.offsetWidth; // -1 … 1 for the neighbours
        if (Math.abs(d) < bestDist) {
          bestDist = Math.abs(d);
          best = i;
        }
        if (reduce) return;
        const a = Math.min(Math.abs(d), 1);
        const inner = card.firstElementChild as HTMLElement;
        inner.style.transform = `perspective(1200px) rotateY(${(-d * 10).toFixed(2)}deg) scale(${(1 - a * 0.08).toFixed(3)})`;
        inner.style.opacity = String(1 - a * 0.45);
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduce]);

  const go = (i: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[Math.max(0, Math.min(items.length - 1, i))];
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <div className="mt-10" role="region" aria-roledescription="carousel" aria-label="Projects">
      <div
        ref={trackRef}
        data-lenis-prevent-wheel
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(active + 1);
          if (e.key === "ArrowLeft") go(active - 1);
        }}
        tabIndex={0}
        className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-[7vw] pb-6 outline-none [scrollbar-width:none] sm:px-[14vw] lg:px-[calc(50vw-320px)] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((p, i) => (
          <div
            key={p.title}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}: ${p.title}`}
            className="w-[86vw] shrink-0 snap-center sm:w-[72vw] lg:w-[640px]"
          >
            <div className="h-full origin-center transition-[transform,opacity] duration-150 ease-out will-change-transform">
              <CarouselCard p={p} i={i} />
            </div>
          </div>
        ))}
      </div>

      {/* Controls: arrows, animated dots, counter */}
      <div className="shell mt-2 flex items-center justify-between gap-4">
        <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
          <span className="text-foreground">{String(active + 1).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")}
          <span className="ml-3 hidden text-foreground sm:inline">{items[active].short}</span>
        </span>

        <div className="flex items-center gap-1.5" aria-hidden>
          {items.map((p, i) => (
            <button
              key={p.title}
              type="button"
              tabIndex={-1}
              onClick={() => go(i)}
              className={`h-1.5 cursor-pointer rounded-full transition-all duration-500 ease-out-expo ${
                i === active ? "w-6 bg-accent" : "w-1.5 bg-foreground/20"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          {[
            { d: -1, label: "Previous project", Icon: ArrowLeft },
            { d: 1, label: "Next project", Icon: ArrowRight },
          ].map(({ d, label, Icon }) => {
            const disabled = d < 0 ? active === 0 : active === items.length - 1;
            return (
              <button
                key={d}
                type="button"
                onClick={() => go(active + d)}
                disabled={disabled}
                aria-label={label}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background disabled:cursor-default disabled:opacity-35 disabled:hover:border-border disabled:hover:bg-card disabled:hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  // The sideways gallery needs room for a full card: wide and tall enough. Otherwise a vertical list.
  const isLg = useMediaQuery("(min-width: 1280px) and (min-height: 700px)");

  return (
    <section id="projects" className="scroll-mt-20 pt-12 pb-16 md:pt-28 md:pb-28">
      <div className="shell">
        <SectionHeader
          index="02"
          title="Projects"
          intro="Live products used every day — real-time classrooms, online learning, e-commerce and team workflows, built end to end."
        />
      </div>

      {isLg ? (
        <HorizontalGallery items={projects} />
      ) : (
        // Phones, tablets and small laptops: swipe carousel.
        <ProjectCarousel items={projects} />
      )}
    </section>
  );
}
