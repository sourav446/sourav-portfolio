"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  SiAmazonwebservices,
  SiBootstrap,
  SiClaude,
  SiCss3,
  SiDocker,
  SiFigma,
  SiGit,
  SiHostinger,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostman,
  SiReact,
  SiReactquery,
  SiRedis,
  SiSocketdotio,
  SiTailwindcss,
  SiTypescript,
  SiWebrtc,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import {
  Activity,
  Blocks,
  ChevronRight,
  Gauge,
  LayoutList,
  Maximize,
  Minimize,
  MonitorPlay,
  Sparkles,
  MonitorSmartphone,
  Network,
  RefreshCw,
  Server,
  Store,
  Users,
  X,
} from "lucide-react";
import { projectsUsing, skillInfo, skills } from "@/lib/content";
import { EASE, SectionHeader } from "@/components/motion/Reveal";
import { gsap } from "gsap";
import { useIsLg } from "@/components/motion/useIsLg";
import { useFinePointer } from "@/components/motion/useFinePointer";
import { useMediaQuery } from "@/components/motion/useMediaQuery";

type IconType = React.ComponentType<{
  className?: string;
  style?: React.CSSProperties;
}>;

// Logo + brand colour per skill (line icons for non-brand skills).
const ICONS: Record<string, { icon: IconType; color: string }> = {
  "React.js": { icon: SiReact, color: "#149eca" },
  "Next.js": { icon: SiNextdotjs, color: "#111111" },
  TypeScript: { icon: SiTypescript, color: "#3178c6" },
  "JavaScript (ES6+)": { icon: SiJavascript, color: "#e3b600" },
  "React Query": { icon: SiReactquery, color: "#ff4154" },
  Zustand: { icon: Store, color: "#7c5a3a" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06b6d4" },
  HTML: { icon: SiHtml5, color: "#e34f26" },
  CSS: { icon: SiCss3, color: "#1572b6" },
  SSR: { icon: Server, color: "#111111" },
  "Responsive design": { icon: MonitorSmartphone, color: "#ff4d00" },
  "WebRTC (LiveKit)": { icon: SiWebrtc, color: "#333333" },
  "Socket.IO": { icon: SiSocketdotio, color: "#111111" },
  "Node.js / Express": { icon: SiNodedotjs, color: "#5fa04e" },
  Redis: { icon: SiRedis, color: "#dc382d" },
  "REST APIs": { icon: Network, color: "#ff4d00" },
  MongoDB: { icon: SiMongodb, color: "#47a248" },
  "Git & GitHub": { icon: SiGit, color: "#f05032" },
  "Reusable components": { icon: Blocks, color: "#ff4d00" },
  "Performance optimization": { icon: Gauge, color: "#ff4d00" },
  Agile: { icon: Users, color: "#ff4d00" },
  Bootstrap: { icon: SiBootstrap, color: "#7952b3" },
  MySQL: { icon: SiMysql, color: "#4479a1" },
  Postman: { icon: SiPostman, color: "#ff6c37" },
  "VS Code": { icon: VscVscode, color: "#007acc" },
  Docker: { icon: SiDocker, color: "#2496ed" },
  AWS: { icon: SiAmazonwebservices, color: "#ff9900" },
  Hostinger: { icon: SiHostinger, color: "#673de6" },
  "Load testing": { icon: Activity, color: "#ff4d00" },
  "AI development": { icon: Sparkles, color: "#ff4d00" },
  Claude: { icon: SiClaude, color: "#d97757" },
  Figma: { icon: SiFigma, color: "#f24e1e" },
  "HLS streaming": { icon: MonitorPlay, color: "#2563eb" },
};

const iconFor = (skill: string) =>
  ICONS[skill] ?? { icon: Blocks, color: "#ff4d00" };
const groupOf = (skill: string) =>
  skills.find((g) => g.items.includes(skill))?.group ?? "";
const slug = (s: string) => s.replace(/\W+/g, "-");

/** Tile in the grid. Its layoutId lets it morph into the popup card when clicked. */
function SkillTile({
  skill,
  onOpen,
}: {
  skill: string;
  onOpen: (skill: string, el: HTMLButtonElement) => void;
}) {
  const { icon: Icon, color } = iconFor(skill);
  return (
    <motion.button
      type="button"
      layoutId={`skill-${slug(skill)}`}
      onClick={(e) => onOpen(skill, e.currentTarget)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      aria-haspopup="dialog"
      className="group relative flex min-h-14 items-center gap-3 overflow-hidden rounded-xl border border-border bg-card px-3 py-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background">
        <Icon
          className="h-5 w-5 transition-transform duration-500 ease-out-expo group-hover:scale-110"
          style={{ color }}
        />
      </span>
      <span className="min-w-0 flex-1 text-[13px] leading-tight font-medium">
        {skill}
      </span>
      <RefreshCw
        aria-hidden
        className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-transform duration-500 group-hover:rotate-180 sm:block"
      />
      {/* Brand-colour wash on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
        style={{ background: color }}
      />
    </motion.button>
  );
}

/**
 * Popup: the tile morphs into a large card (front: logo + name), which then flips 180° to
 * show the details on its back. Esc, the × button or clicking outside closes it.
 */
function SkillCard({ skill, onClose }: { skill: string; onClose: () => void }) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { icon: Icon, color } = iconFor(skill);
  const info = skillInfo[skill];
  const usedIn = projectsUsing(skill);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    // Lock the page behind the popup (the overlay is data-lenis-prevent, so Lenis ignores it too).
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-lenis-prevent
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-foreground/55"
      />

      {/* Shared-layout wrapper (morph from tile) */}
      <motion.div
        layoutId={`skill-${slug(skill)}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-card-title"
        className="relative h-[min(560px,82svh)] w-[min(440px,92vw)] rounded-2xl [perspective:1400px]"
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        {/* The card that flips */}
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 180 }}
          exit={{ rotateY: 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.9, ease: EASE, delay: 0.35 }
          }
        >
          {/* Front face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-2xl border border-border bg-card shadow-2xl [backface-visibility:hidden]">
            <Icon className="h-20 w-20" style={{ color }} />
            <p className="font-display text-3xl font-medium tracking-[-0.03em]">
              {skill}
            </p>
            <span className="label">{groupOf(skill)}</span>
          </div>

          {/* Back face (pre-rotated so it reads correctly after the flip) */}
          <div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-foreground text-background shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex items-center justify-between gap-3 border-b border-background/10 px-6 py-4">
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                  <Icon className="h-6 w-6" style={{ color }} />
                </span>
                <span>
                  <span
                    id="skill-card-title"
                    className="block font-display text-xl font-medium tracking-[-0.02em]"
                  >
                    {skill}
                  </span>
                  <span className="block font-mono text-[10px] tracking-[0.14em] text-background/50 uppercase">
                    {groupOf(skill)}
                  </span>
                </span>
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close skill details"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              className="flex-1 space-y-6 overflow-y-auto px-6 py-5"
              data-lenis-prevent
            >
              {info && (
                <p className="text-[15px] leading-relaxed text-background/85">
                  {info.summary}
                </p>
              )}

              {info && (
                <div>
                  <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-background/50 uppercase">
                    What I&apos;ve done with it
                  </p>
                  <ul className="space-y-2.5">
                    {info.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex gap-3 text-sm leading-relaxed"
                      >
                        <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {usedIn.length > 0 && (
                <div>
                  <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-background/50 uppercase">
                    Used in
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {usedIn.map((p) => (
                      <a
                        key={p}
                        href="#projects"
                        onClick={onClose}
                        className="rounded-full border border-background/15 px-3 py-1 text-xs transition-colors hover:border-accent hover:bg-accent"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Proximity-cloud tuning — same defaults as GSAP's "Proximity scale grid" demo
// (demos.gsap.com/demo/proximity-scale-grid, codepen.io/GreenSock/pen/zxKyeEm).
const RADIUS = 200; // px — how far the cursor's influence reaches
const MAX_SCALE = 1.6; // size of the item right under the cursor (demo default is 2.5)
const LEAVE_DURATION = 0.7; // s — settle back when the cursor leaves (demo: dur × 2)

// Group colours for the legend dots.
const GROUP_COLORS = ["#ff4d00", "#3178c6", "#47a248", "#a855f7", "#f59e0b", "#d97757"];

// ── Touch "All" view: bento grid ──────────────────────────────────────────────────────────
// Core skills get the big tiles, a couple of key skills get wide tiles, everything else is a
// compact icon tile with a group-colour dot. Tiles pop in with a stagger the first time the grid
// scrolls into view, and keep the layoutId morph into the flip card.

/** Shorter labels for the compact tiles (the full name stays as the accessible name). */
const SHORT: Record<string, string> = {
  "JavaScript (ES6+)": "JavaScript",
  "Performance optimization": "Performance",
  "Reusable components": "Components",
  "Responsive design": "Responsive",
  "WebRTC (LiveKit)": "WebRTC",
  "Node.js / Express": "Node.js",
  "HLS streaming": "HLS",
  "Git & GitHub": "Git",
  "AI development": "AI dev",
};

const BENTO_SIZE: Record<string, "hero" | "wide"> = {
  "React.js": "hero",
  "Next.js": "wide",
  TypeScript: "wide",
  "JavaScript (ES6+)": "wide",
  "Node.js / Express": "wide",
  "WebRTC (LiveKit)": "wide",
};
const BENTO_NOTE: Record<string, string> = {
  "React.js": "Daily driver",
  "Next.js": "SSR · SEO",
  TypeScript: "Typed React",
  "JavaScript (ES6+)": "ES6+",
  "Node.js / Express": "Backend",
  "WebRTC (LiveKit)": "Live video",
};

function SkillBento({
  onOpen,
}: {
  onOpen: (skill: string, el: HTMLButtonElement) => void;
}) {
  const reduce = useReducedMotion();
  // Featured tiles first (in this order), then the rest in group order.
  const featured = Object.keys(BENTO_SIZE);
  const ordered = [
    ...featured,
    ...skills.flatMap((g) => g.items).filter((s) => !featured.includes(s)),
  ];

  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.03 } } }}
      className="grid grid-flow-dense grid-cols-4 auto-rows-[80px] gap-2 sm:grid-cols-6 sm:auto-rows-[88px]"
    >
      {ordered.map((skill) => {
        const { icon: Icon, color } = iconFor(skill);
        const size = BENTO_SIZE[skill];
        const gi = skills.findIndex((g) => g.items.includes(skill));
        const dot = GROUP_COLORS[gi % GROUP_COLORS.length];
        const hero = size === "hero";
        return (
          <motion.li
            key={skill}
            variants={{
              hidden: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 12 },
              show: { opacity: 1, scale: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className={hero ? "col-span-2 row-span-2" : size === "wide" ? "col-span-2" : ""}
          >
            <motion.button
              type="button"
              layoutId={`skill-${slug(skill)}`}
              onClick={(e) => onOpen(skill, e.currentTarget)}
              whileTap={{ scale: 0.96 }}
              aria-haspopup="dialog"
              aria-label={skill}
              className={`relative flex h-full w-full overflow-hidden rounded-2xl border text-left outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                hero
                  ? "flex-col justify-between border-foreground bg-foreground p-4 text-background"
                  : size
                    ? "items-center gap-3 border-border bg-card px-3"
                    : "flex-col items-center justify-center gap-1.5 border-border bg-card px-1"
              }`}
            >
              {hero ? (
                <>
                  <Icon className="h-11 w-11 motion-safe:animate-[spin_14s_linear_infinite]" style={{ color }} />
                  <span>
                    <span className="block font-display text-[22px] leading-none font-medium tracking-[-0.03em]">
                      React
                    </span>
                    <span className="mt-1.5 block font-mono text-[10px] tracking-[0.12em] text-background/60 uppercase">
                      {BENTO_NOTE[skill]}
                    </span>
                  </span>
                </>
              ) : size ? (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background">
                    <Icon className="h-5 w-5" style={{ color }} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] leading-tight font-medium">
                      {SHORT[skill] ?? skill}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[9.5px] tracking-[0.1em] text-muted-foreground uppercase">
                      {BENTO_NOTE[skill]}
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <Icon className="h-6 w-6" style={{ color }} />
                  <span className="w-full truncate text-center text-[10.5px] leading-tight font-medium">
                    {SHORT[skill] ?? skill}
                  </span>
                </>
              )}
              {/* Group colour */}
              <span
                aria-hidden
                className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full"
                style={{ background: dot }}
              />
            </motion.button>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

/** Deterministic pseudo-random in [-1, 1] so the scatter is identical on every render. */
const jitter = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

/**
 * Scatter positions (in % of the stage) for n items: a jittered grid of up to maxCols columns with
 * alternate rows offset (honeycomb-ish); a short last row is centred. Kept clear of the
 * edges (6–94% across, 7–93% down) so long labels never spill out of the stage.
 */
function scatter(n: number, maxCols = 7) {
  const cols = Math.min(maxCols, Math.max(1, n));
  const rows = Math.ceil(n / cols);
  return Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / cols);
    const inRow = Math.min(cols, n - row * cols);
    const col = (i % cols) + (cols - inRow) / 2;
    const offset = row % 2 && rows > 1 ? 0.5 : 0;
    const x =
      6 +
      ((col + 0.5 + offset * 0.6) / (cols + 0.3)) * 88 +
      jitter(i + 1) * 1.8;
    const y = 7 + ((row + 0.5) / rows) * 86 + jitter(i + 7) * (14 / rows);
    return { x, y };
  });
}

/**
 * "Proximity scale grid": skills scattered across a stage; each one scales up the closer the
 * cursor is, so neighbours swell in sequence. Item centres are cached (scaling never moves
 * them) and the cursor is read once per frame, so there's no layout work on mouse moves.
 * The motion itself matches GSAP's demo: linear falloff, gsap.to with overwrite + power2.out,
 * a slow settle on leave, and a slight tilt per item.
 *
 * Filter tabs narrow it to one group: the others fade out and the rest glide into a fresh
 * layout. `fullscreen` lets the stage fill the screen.
 */
function SkillCloud({
  onOpen,
  fullscreen,
  onToggleFullscreen,
}: {
  onOpen: (skill: string, el: HTMLButtonElement) => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}) {
  const all = skills.flatMap((g, gi) =>
    g.items.map((skill) => ({ skill, gi })),
  );
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const measureRef = useRef<() => void>(() => {});
  const [focusGroup, setFocusGroup] = useState<number | null>(null);
  const [filter, setFilter] = useState<number | null>(null); // null = all groups
  // Narrower screens get one column fewer so long labels keep their space.
  const maxCols = useMediaQuery("(min-width: 1280px)") ? 7 : 6;

  // Positions for the visible skills only, so a filtered group spreads across the stage.
  const visible = all.map((s) => filter === null || s.gi === filter);
  const shown = scatter(visible.filter(Boolean).length, maxCols);
  const full = scatter(all.length, maxCols); // home spots, kept by filtered-out items
  let k = 0;
  const positions = all.map((_, i) => (visible[i] ? shown[k++] : null));

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];

    // Centres relative to the stage (the wrapper's left/top is the visual centre).
    let centres = items.map((el) => ({ x: el.offsetLeft, y: el.offsetTop }));
    const measure = () =>
      (centres = items.map((el) => ({ x: el.offsetLeft, y: el.offsetTop })));
    measureRef.current = measure;
    window.addEventListener("resize", measure);

    let frame = 0;
    let px = 0;
    let py = 0;
    const update = () => {
      frame = 0;
      const rect = stage.getBoundingClientRect();
      const lx = px - rect.left;
      const ly = py - rect.top;
      // Position the orange glow behind the cursor.
      stage.style.setProperty("--x", `${lx}px`);
      stage.style.setProperty("--y", `${ly}px`);
      centres.forEach((c, i) => {
        if (items[i].dataset.hidden === "true") return; // filtered out
        // Exactly the demo's maths: linear falloff, clamped to 0–1.
        const p = gsap.utils.clamp(
          0,
          1,
          gsap.utils.mapRange(0, RADIUS, 1, 0, Math.hypot(lx - c.x, ly - c.y)),
        );
        const s = 1 + (MAX_SCALE - 1) * p;
        gsap.to(items[i], { scale: s, overwrite: true, ease: "power2.out" });
        items[i].style.zIndex = String(Math.round(s * 10));
      });
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () =>
      items.forEach((el) =>
        gsap.to(el, {
          scale: 1,
          duration: LEAVE_DURATION,
          overwrite: true,
          ease: "power2.out",
        }),
      );

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
      gsap.killTweensOf(items);
    };
  }, []);

  // Re-measure once items finish gliding to new spots (filter change, or the stage resizing
  // when entering / leaving full screen).
  useEffect(() => {
    const t = setTimeout(() => measureRef.current(), 800);
    return () => clearTimeout(t);
  }, [filter, fullscreen, maxCols]);

  const tab = (on: boolean) =>
    `flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors duration-300 ${
      on
        ? "border-foreground bg-foreground text-background"
        : "border-border bg-card hover:border-foreground/40"
    }`;

  return (
    <div className={fullscreen ? "flex min-h-0 flex-1 flex-col" : ""}>
      {/* Filter tabs: click to show one group; hover to spotlight it */}
      <div className="flex flex-wrap items-center gap-2">
        <div
          role="tablist"
          aria-label="Filter skills by group"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filter === null}
            onClick={() => setFilter(null)}
            className={tab(filter === null)}
          >
            All
            <span className="font-mono text-[10px] opacity-60">
              {all.length}
            </span>
          </button>
          {skills.map((g, gi) => (
            <button
              key={g.group}
              type="button"
              role="tab"
              aria-selected={filter === gi}
              onClick={() => setFilter(filter === gi ? null : gi)}
              onPointerEnter={() => setFocusGroup(gi)}
              onPointerLeave={() => setFocusGroup(null)}
              onFocus={() => setFocusGroup(gi)}
              onBlur={() => setFocusGroup(null)}
              className={tab(filter === gi)}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: GROUP_COLORS[gi % GROUP_COLORS.length] }}
              />
              {g.group}
              <span className="font-mono text-[10px] opacity-60">
                {g.items.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stage */}
      <motion.div
        ref={stageRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.8 }}
        className={`group/stage relative mt-6 rounded-2xl border border-border bg-[radial-gradient(circle_at_50%_40%,hsl(var(--card)),hsl(var(--background))_70%)] ${
          fullscreen ? "min-h-0 flex-1" : "h-[640px]"
        }`}
      >
        {/* Soft orange glow that follows the cursor, behind the skills */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/stage:opacity-100"
          style={{
            background:
              "radial-gradient(260px circle at var(--x, 50%) var(--y, 50%), hsl(18 100% 72% / 0.1), transparent 65%)",
          }}
        />
        <p className="pointer-events-none absolute top-4 left-6 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          Move your cursor · click a skill to flip its card
        </p>

        {/* Full screen, like a video player: Esc (or this button) exits */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          aria-label={fullscreen ? "Exit full screen" : "Enter full screen"}
          className="group/fs absolute top-3 right-3 z-30 flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-1.5 text-[12px] font-medium transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
        >
          {fullscreen ? (
            <>
              <Minimize className="h-3.5 w-3.5" /> Exit
              <kbd className="rounded border border-current/30 px-1 font-mono text-[10px] opacity-70">
                Esc
              </kbd>
            </>
          ) : (
            <>
              <Maximize className="h-3.5 w-3.5 transition-transform duration-300 group-hover/fs:scale-110" />{" "}
              Full screen
            </>
          )}
        </button>

        {all.map(({ skill, gi }, i) => {
          const { icon: Icon, color } = iconFor(skill);
          const pos = positions[i];
          const hidden = pos === null;
          const dim = !hidden && focusGroup !== null && focusGroup !== gi;
          return (
            <button
              key={skill}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              aria-haspopup="dialog"
              aria-hidden={hidden || undefined}
              tabIndex={hidden ? -1 : undefined}
              data-hidden={hidden}
              onClick={(e) => onOpen(skill, e.currentTarget)}
              style={{
                // Filtered-out items stay where they were and fade away.
                left: `${(pos ?? full[i]).x}%`,
                top: `${(pos ?? full[i]).y}%`,
                rotate: `${Math.round(jitter(i + 3) * 4)}deg`,
              }}
              className={`group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-xl p-2 outline-none transition-[left,top,opacity] duration-700 ease-out-expo will-change-transform focus-visible:ring-2 focus-visible:ring-accent ${
                hidden
                  ? "pointer-events-none opacity-0"
                  : dim
                    ? "opacity-20"
                    : "opacity-100"
              }`}
            >
              <span className="relative">
                <Icon
                  className={
                    fullscreen
                      ? "h-10 w-10 drop-shadow-sm"
                      : "h-8 w-8 drop-shadow-sm"
                  }
                  style={{ color }}
                />
                <span
                  aria-hidden
                  className="absolute -top-1 -right-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ background: GROUP_COLORS[gi % GROUP_COLORS.length] }}
                />
              </span>
              <span
                className={`font-medium whitespace-nowrap ${fullscreen ? "text-[12px]" : "text-[11px]"}`}
              >
                {skill}
              </span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

/**
 * Quick view: every skill grouped by category in plain cards — fast to scan, no hunting with
 * the cursor. Each row still opens the flip card.
 */
function SkillList({
  onOpen,
}: {
  onOpen: (skill: string, el: HTMLButtonElement) => void;
}) {
  return (
    <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
      {skills.map((group, gi) => (
        <motion.div
          key={group.group}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: gi * 0.06 }}
          className="mb-4 break-inside-avoid rounded-2xl border border-border bg-card p-5"
        >
          <h3 className="flex items-center gap-2.5 text-[15px] font-semibold">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: GROUP_COLORS[gi % GROUP_COLORS.length] }}
            />
            {group.group}
            <span className="ml-auto rounded-full bg-background px-2 py-0.5 font-mono text-[11px] font-normal text-muted-foreground">
              {group.items.length}
            </span>
          </h3>
          <ul className="mt-3 -mx-2">
            {group.items.map((skill) => {
              const { icon: Icon, color } = iconFor(skill);
              const used = projectsUsing(skill);
              return (
                <li key={skill}>
                  <button
                    type="button"
                    onClick={(e) => onOpen(skill, e.currentTarget)}
                    aria-haspopup="dialog"
                    className="group/row flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-200 outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-border transition-colors group-hover/row:bg-card">
                      <Icon className="h-4 w-4" style={{ color }} />
                    </span>
                    <span className="flex-1 text-[14px] font-medium">
                      {skill}
                    </span>
                    {used.length > 0 && (
                      <span className="hidden font-mono text-[10px] tracking-wide text-muted-foreground sm:inline">
                        {used.length} project{used.length > 1 ? "s" : ""}
                      </span>
                    )}
                    <ChevronRight className="h-3.5 w-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-300 group-hover/row:translate-x-0 group-hover/row:text-accent group-hover/row:opacity-100" />
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

type View = "interactive" | "quick";
const VIEWS: { id: View; label: string; Icon: typeof Sparkles }[] = [
  { id: "interactive", label: "Interactive", Icon: Sparkles },
  { id: "quick", label: "Quick view", Icon: LayoutList },
];
const VIEW_KEY = "skills-view";

/** Segmented switch between the two views; the active pill slides between options. */
function ViewSwitch({
  view,
  onChange,
}: {
  view: View;
  onChange: (v: View) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Skills view"
      className="inline-flex rounded-full border border-border bg-card p-1"
    >
      {VIEWS.map(({ id, label, Icon }) => {
        const on = view === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(id)}
            className={`relative flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
              on
                ? "text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {on && (
              <motion.span
                layoutId="skills-view-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full bg-foreground"
              />
            )}
            <Icon className="relative h-3.5 w-3.5" />
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function TechStack() {
  const [open, setOpen] = useState<string | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const isLg = useIsLg();
  const fine = useFinePointer();
  const [view, setView] = useState<View>("interactive");
  const [mobileFilter, setMobileFilter] = useState(-1); // touch layout: -1 = all groups

  // Full screen (browser Fullscreen API, so Esc exits just like a video). The flip card is
  // rendered inside the same element, so it still shows while in full screen.
  // If the browser refuses (older Safari, embedded iframes), fall back to a window-filling
  // overlay that Esc also closes.
  const fsRef = useRef<HTMLDivElement>(null);
  const [nativeFs, setNativeFs] = useState(false);
  const [overlayFs, setOverlayFs] = useState(false);
  const fullscreen = nativeFs || overlayFs;
  useEffect(() => {
    const sync = () =>
      setNativeFs(document.fullscreenElement === fsRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  // Read through a ref so opening a flip card doesn't re-run (and re-stack) the scroll lock below.
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    if (!overlayFs) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !openRef.current) setOverlayFs(false); // an open flip card takes Esc first
    };
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [overlayFs]);
  const toggleFullscreen = () => {
    if (fullscreen) {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      setOverlayFs(false);
      return;
    }
    const el = fsRef.current;
    if (el?.requestFullscreen)
      el.requestFullscreen().catch(() => setOverlayFs(true));
    else setOverlayFs(true);
  };

  // Remember the visitor's choice (per browser; falls back to the default if storage is blocked).
  useEffect(() => {
    try {
      if (localStorage.getItem(VIEW_KEY) === "quick") setView("quick");
    } catch {}
  }, []);
  const changeView = (v: View) => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {}
  };

  const onOpen = (skill: string, el: HTMLButtonElement) => {
    opener.current = el;
    setOpen(skill);
  };
  // Stable identity so the popup's open/close effect doesn't re-run on every render.
  const onClose = useCallback(() => {
    setOpen(null);
    // Return focus to the skill that opened the card.
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }, []);

  return (
    <section id="skills" className="shell scroll-mt-20 pb-20 md:pb-28">
      <SectionHeader
        index="04"
        title="Skills"
        intro="Tap any skill to flip its card and see where I've used it."
      />

      <div
        ref={fsRef}
        data-lenis-prevent={fullscreen || undefined}
        className={
          fullscreen
            ? `flex h-screen flex-col overflow-auto bg-background p-6 md:p-10 ${overlayFs ? "fixed inset-0 z-[70]" : ""}`
            : "mt-10 md:mt-12"
        }
      >
        {isLg && fine ? (
          // Desktop with a mouse: proximity skill cloud by default, or the quick list.
          <>
            {fullscreen ? (
              <p className="mb-5 flex items-center gap-3 font-display text-2xl font-medium tracking-[-0.03em]">
                Skills
                <span className="font-mono text-[11px] font-normal tracking-[0.14em] text-muted-foreground uppercase">
                  Full screen · Esc to exit
                </span>
              </p>
            ) : (
              <div className="mb-5 flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  {view === "interactive"
                    ? "Move your cursor across the skills — or switch to a quick list."
                    : "Every skill by category. Click any one for details."}
                </p>
                <ViewSwitch view={view} onChange={changeView} />
              </div>
            )}
            {view === "interactive" || fullscreen ? (
              <motion.div
                key="interactive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className={fullscreen ? "flex min-h-0 flex-1 flex-col" : ""}
              >
                <SkillCloud
                  onOpen={onOpen}
                  fullscreen={fullscreen}
                  onToggleFullscreen={toggleFullscreen}
                />
              </motion.div>
            ) : (
              <SkillList key="quick" onOpen={onOpen} />
            )}
          </>
        ) : (
          // Touch / smaller screens: filter chips (swipe sideways) + compact grouped tiles.
          <div>
            {/* Sticks under the menu while scrolling the skills; edge fade hints there are more chips */}
            <div className="sticky top-[84px] z-20 -mx-5 mb-5 bg-background/95 py-2 sm:static sm:mx-0 sm:bg-transparent sm:py-0">
              <div
                role="tablist"
                aria-label="Filter skills by group"
                className="flex gap-2 overflow-x-auto px-5 pb-1 [mask-image:linear-gradient(to_right,#000_85%,transparent)] [scrollbar-width:none] sm:flex-wrap sm:px-0 sm:[mask-image:none] [&::-webkit-scrollbar]:hidden"
              >
                {[
                  { group: "All", items: skills.flatMap((g) => g.items) },
                  ...skills,
                ].map((g, i) => {
                  const gi = i - 1; // -1 = All
                  const on = mobileFilter === gi;
                  return (
                    <button
                      key={g.group}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setMobileFilter(gi)}
                      className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium whitespace-nowrap transition-colors duration-300 ${
                        on
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-card"
                      }`}
                    >
                      {gi >= 0 && (
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            background: GROUP_COLORS[gi % GROUP_COLORS.length],
                          }}
                        />
                      )}
                      {g.group}
                      <span className="font-mono text-[10px] opacity-60">
                        {g.items.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {mobileFilter === -1 ? (
              <SkillBento onOpen={onOpen} />
            ) : (
              <div className="space-y-8">
                {skills.map((group, gi) =>
                  mobileFilter !== gi ? null : (
                    <motion.div
                      key={group.group}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        ease: EASE,
                        delay: 0,
                      }}
                    >
                      <h3 className="label mb-3 flex items-center gap-3 !text-foreground">
                        <span className="text-accent">
                          {String(gi + 1).padStart(2, "0")}
                        </span>
                        {group.group}
                        <span className="h-px flex-1 bg-border" />
                      </h3>
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                        {group.items.map((skill) => (
                          <SkillTile key={skill} skill={skill} onOpen={onOpen} />
                        ))}
                      </div>
                    </motion.div>
                  ),
                )}
              </div>
            )}
          </div>
        )}

        <AnimatePresence>
          {open && <SkillCard key={open} skill={open} onClose={onClose} />}
        </AnimatePresence>
      </div>
    </section>
  );
}
