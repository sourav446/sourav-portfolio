"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects, type Project } from "@/lib/content";
import { EASE, SectionHeader } from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import { ArrowUpRight } from "lucide-react";
import LiveClassVisual from "@/components/LiveClassVisual";
import StoreVisual from "@/components/StoreVisual";
import { LmsVisual, PmtVisual } from "@/components/ProjectMocks";
import { useSpotlight } from "@/components/motion/useSpotlight";
import { useIsLg } from "@/components/motion/useIsLg";

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

export default function Work() {
  const isLg = useIsLg();

  return (
    <section id="projects" className="scroll-mt-20 pt-20 pb-20 md:pt-28 md:pb-28">
      <div className="shell">
        <SectionHeader
          index="02"
          title="Projects"
          intro="Three production platforms I build and maintain at Aim Window Info Tech, plus an enterprise project management tool."
        />
      </div>

      {isLg ? (
        <HorizontalGallery items={projects} />
      ) : (
        // Phones / small tablets: a simple vertical list with a fade-up.
        <div className="shell mt-10 space-y-5">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <ProjectCard p={p} i={i} total={projects.length} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
