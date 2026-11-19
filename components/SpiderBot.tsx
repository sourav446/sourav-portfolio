"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { profile } from "@/lib/content";

/*
 * The AI assistant's mascot: a robot spider. An orb web spins itself in the top-right corner, the
 * spider climbs out of the web's hub and lowers itself on a silk line to the bottom-right corner
 * and says hi. It lives on a small physics model: the silk is an elastic line from the hub, so you
 * can grab and drag the spider, let go and it swings back and settles. Left alone it does spider
 * things now and then (climbs to its web, spins a little web, looks around, naps, swings).
 * Scrolling fades the web and shortens the silk to a stub, so it stays in the corner as the chat
 * launcher. Scroll further and it lies down and falls asleep; back at the top it wakes up with a
 * stretch and carries on. A tap (no drag) opens the chat. CSS animations live in globals.css (spider-*).
 */

const first = profile.name.split(" ")[0];

/** Funny lines it says now and then. */
const QUIPS: [string, string][] = [
  ["Just hanging around 🕸️", `Ask me anything about ${first}`],
  ["I've got 8 hands to help 🖐️", "Projects, skills or experience?"],
  ["Caught in my web? 😄", "Good, let's chat"],
  ["I debug, I don't bug 🐞", "Promise"],
  ["Hiring? I'll spin a reply 🕸️", "Tap me to chat"],
];
const GREETING: [string, string] = ["Hi there! 👋", `I'm ${first}'s personal AI assistant`];

const APPEAR_DELAY = 1400; // ms: the spider comes out of the hub once the web is spun
const GREETING_MS = 2600;
const LINE_MS = 2200; // ms, how long a line stays up
const CLIMB_PULL_MS = 170; // one pull up the silk…
const CLIMB_REST_MS = 110; // …and the pause before the next (one pull + rest = half a leg cycle)
const FLY_MS = 750;
const SLEEP_AT = 420; // px scrolled: lies down and sleeps…
const WAKE_AT = 140; // …and wakes back up above this (the gap stops it flickering at the edge) // ms, the swing into the chat header
const ACTIVITY_EVERY: [number, number] = [9000, 15000]; // ms, random in this range

/** The drop + greeting play once per page load, not every time the chat is closed. */
let arrived = false;

/*
 * Geometry shared by the web and the silk, so the silk leaves exactly from the hub.
 * Web viewBox is 200×210 with the hub at (104, 108), just below the nav bar: on desktop the web is
 * drawn at 200px, so the hub sits 96px from the right edge, right above the spider's centre
 * (32px + half of the 129px spider). On phones it is scaled to match (12px + 49px).
 */
const WEB_W = 200;
const WEB_H = 210;
const HUB = { x: 104, y: 108 };
const LAYOUT = {
  // Heights follow the mech spider image (323×183)
  // Sizes follow the layered spider (viewBox 1700×735); right + w/2 lines up with the web hub
  desktop: { scale: 1, right: 21, bottom: 12, w: 150, h: 65 },
  phone: { scale: 65 / 96, right: 10, bottom: 8, w: 110, h: 48 },
};
const ATTACH = 2; // px below the top of the spider (top of its head) where the silk attaches

/** Hub and landed ("home") silk-attachment points in viewport px, plus the spider's size. */
function geometry() {
  const l = window.matchMedia("(min-width: 768px)").matches ? LAYOUT.desktop : LAYOUT.phone;
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  return {
    hub: { x: vw - (WEB_W - HUB.x) * l.scale, y: HUB.y * l.scale },
    home: { x: vw - l.right - l.w / 2, y: vh - l.bottom - l.h + ATTACH },
    w: l.w,
    h: l.h,
    vw,
    vh,
  };
}

/* Physics: gravity pulls the spider down, the silk pulls back only when stretched past its length. */
const GRAVITY = 900; // px/s²
const STIFFNESS = 200; // silk spring, 1/s²
const SILK_DAMPING = 10; // 1/s, along the silk while it is stretched (kills the bungee bounce quickly)
const AIR = 0.5; // 1/s, light air drag (swings last a few graceful seconds)
const SAG = GRAVITY / STIFFNESS; // how far the spider's weight stretches the silk at rest

/**
 * Where the spider lands in the open chat panel: the header avatar slot (48×40, 16px in from the
 * panel corner). Mirrors the panel layout in ChatAssistant.tsx: full screen on phones, a 400px card
 * 24px from the bottom-right corner on desktop. Returns the silk point + scale for that spot.
 */
function avatarTarget(g: ReturnType<typeof geometry>) {
  const scale = 48 / g.w;
  // Prefer the real slot once the panel has rendered (read every frame, so it tracks the panel
  // opening animation); fall back to the layout maths for the first frames.
  const slot = document.querySelector("[data-chat-avatar]")?.getBoundingClientRect();
  if (slot && slot.width) {
    return { x: slot.left + slot.width / 2, y: slot.top + slot.height / 2 - (g.h / 2 - ATTACH) * scale, scale };
  }
  const desk = window.matchMedia("(min-width: 768px)").matches;
  const panelH = Math.min(600, g.vh - 112);
  const cx = desk ? g.vw - 24 - 400 + 16 + 24 : 16 + 24;
  const cy = desk ? g.vh - 24 - panelH + 16 + 20 : 16 + 20;
  return { x: cx, y: cy - (g.h / 2 - ATTACH) * scale, scale };
}

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);

/** Small deterministic jitter, so the web looks hand-spun but renders the same every time. */
const jitter = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s) - 0.5; // -0.5 … 0.5
};

/** Corner orb web: irregular radial spokes from a hub, a sagging capture spiral, anchored to the walls. */
export function CornerWeb() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 260], [1, 0]);

  const { spokes, spiral, hub } = useMemo(() => {
    const f = (n: number) => n.toFixed(1);
    // Uneven angles like a real web (deg; SVG y points down).
    const angles = [-168, -128, -96, -64, -30, 2, 38, 74, 108, 142].map((a) => (a * Math.PI) / 180);
    // Distance from the hub to the edge of the box along each spoke (top/right edges are the walls).
    const reach = (a: number) => {
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      const tx = dx > 0 ? (WEB_W - HUB.x) / dx : dx < 0 ? -HUB.x / dx : Infinity;
      const ty = dy > 0 ? (WEB_H - HUB.y) / dy : dy < 0 ? -HUB.y / dy : Infinity;
      return Math.min(tx, ty);
    };
    const pt = (a: number, r: number) => [HUB.x + Math.cos(a) * r, HUB.y + Math.sin(a) * r] as const;

    const spokes = angles.map((a) => {
      const [x, y] = pt(a, reach(a) + 2);
      return `M${f(HUB.x)} ${f(HUB.y)} L${f(x)} ${f(y)}`;
    });

    // Capture spiral: one continuous thread winding outward, sagging toward the hub between spokes,
    // broken where it would leave the box.
    let spiral = "";
    let pen = false;
    const n = angles.length;
    for (let s = 0; s < n * 9; s++) {
      const i = s % n;
      const j = (i + 1) % n;
      const r1 = 12 + s + jitter(s) * 2.2; // the spiral widens ~10 units per turn
      const r2 = 12 + s + 1 + jitter(s + 1) * 2.2;
      const a1 = angles[i];
      let a2 = angles[j];
      if (a2 < a1) a2 += Math.PI * 2;
      if (r2 > reach(angles[j]) - 3 || r1 > reach(a1) - 3) {
        pen = false;
        continue;
      }
      const [x1, y1] = pt(a1, r1);
      const [x2, y2] = pt(a2, r2);
      const [mx, my] = pt((a1 + a2) / 2, ((r1 + r2) / 2) * 0.88);
      spiral += `${pen ? "" : `M${f(x1)} ${f(y1)} `}Q${f(mx)} ${f(my)} ${f(x2)} ${f(y2)} `;
      pen = true;
    }

    // Dense little mesh around the hub.
    const hub = [4, 7.5].map((r, k) =>
      angles
        .map((a, i) => {
          const [x, y] = pt(a, r + jitter(i + k * 10) * 1.2);
          return `${i ? "L" : "M"}${f(x)} ${f(y)}`;
        })
        .join(" ") + " Z",
    );
    return { spokes, spiral, hub };
  }, []);

  return (
    <motion.svg
      aria-hidden
      viewBox={`0 0 ${WEB_W} ${WEB_H}`}
      style={{ opacity }}
      className="pointer-events-none fixed top-0 right-0 z-40 h-[142px] w-[135px] md:h-[210px] md:w-[200px]"
    >
      <defs>
        {/* Silk fades out toward the open (bottom-left) side, like a web catching the light */}
        <radialGradient id="web-fade" cx="100%" cy="0%" r="115%">
          <stop offset="55%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="web-mask">
          <rect width={WEB_W} height={WEB_H} fill="url(#web-fade)" />
        </mask>
      </defs>
      <g mask="url(#web-mask)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {spokes.map((d, k) => (
          <path
            key={k}
            className="spider-web-spoke"
            style={{ animationDelay: `${k * 0.05}s` }}
            pathLength={1}
            d={d}
            stroke="rgba(110,96,82,0.6)"
            strokeWidth="0.85"
          />
        ))}
        <path className="spider-web-spiral" pathLength={1} d={spiral} stroke="rgba(110,96,82,0.5)" strokeWidth="0.65" />
        {hub.map((d, k) => (
          <path key={k} className="spider-web-ring" d={d} stroke="rgba(120,106,92,0.45)" strokeWidth="0.6" />
        ))}
      </g>
    </motion.svg>
  );
}

type Pose = "idle" | "walk" | "climb" | "rappel" | "curl" | "nap" | "sleep" | "wake";
type Activity = "climb" | "spin" | "look" | "nap" | "swing" | "quip";

/** The spider on its silk + speech bubble. A tap opens the chat; a drag swings it on the silk. */
export function SpiderLauncher({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // Captured once at mount (effects run twice in dev StrictMode, so not read inside effects).
  const [firstVisit] = useState(() => !arrived);
  const [line, setLine] = useState<[string, string] | null>(null);
  const [pose, setPose] = useState<Pose>("idle");
  const [landed, setLanded] = useState(false);

  const body = useRef<HTMLButtonElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const silk = useRef<SVGPathElement>(null);
  const mini = useRef<SVGGElement>(null);
  const eyes = useRef<SVGGElement>(null);

  // Everything the animation loop reads and writes, kept out of React state (60 updates a second).
  const sim = useRef({
    p: { x: -999, y: -999 },
    v: { x: 0, y: 0 },
    restK: 1, // silk length as a share of hub → home (climbing shortens it)
    shown: 1, // 0 → 1 as the spider comes out of the hub
    falling: false,
    still: 0, // seconds spent at rest after the drop
    drag: null as null | { x: number; y: number; dx: number; dy: number; sx: number; sy: number },
    moved: false, // the last press was a drag, so the click must not open the chat
    mouse: null as null | { x: number; y: number },
    look: false,
    busy: false,
    landed: false,
    away: false, // sitting in the chat header while the chat is open
    silkVis: 1, // silk visibility, fades out once the page is scrolled
    fly: null as null | { from: { x: number; y: number }; t0: number },
  });

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const lineTimer = useRef<ReturnType<typeof setTimeout>>();
  const say = useCallback((text: [string, string], ms = LINE_MS) => {
    setLine(text);
    clearTimeout(lineTimer.current);
    lineTimer.current = setTimeout(() => setLine(null), ms);
  }, []);

  /** Animate a sim value over time (eased); resolves when done. */
  const tween = useCallback(
    (key: "restK" | "shown", to: number, ms: number) =>
      new Promise<void>((done) => {
        const s = sim.current;
        const from = s[key];
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / ms);
          s[key] = from + (to - from) * ease(k);
          if (k < 1) requestAnimationFrame(step);
          else done();
        };
        requestAnimationFrame(step);
      }),
    [],
  );

  // ── Arrival: come out of the hub, then drop on the silk and bounce to rest ──
  useEffect(() => {
    arrived = true;
    const s = sim.current;
    const g = geometry();
    if (!firstVisit || reduce) {
      s.p = { ...g.home };
      s.shown = 1;
      s.restK = 1;
      s.landed = true;
      setLanded(true);
      return;
    }
    s.p = { ...g.hub };
    s.v = { x: 0, y: 0 };
    s.shown = 0;
    s.restK = 0.02;
    const t = setTimeout(async () => {
      await tween("shown", 1, 450);
      await new Promise((r) => setTimeout(r, 350));
      s.restK = 1; // let go: gravity takes it down, the silk catches it
      s.falling = true;
    }, APPEAR_DELAY);
    return () => clearTimeout(t);
  }, [firstVisit, reduce, tween]);

  // ── The animation loop: physics, then write transforms straight to the DOM ──
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const s = sim.current;

    const frame = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;
      const g = geometry();
      // Scrolling moves the silk's anchor from the hub down to a short stub above the spider.
      const scrolled = clamp(scrollY.get() / 320, 0, 1);
      const anchor = { x: g.hub.x, y: lerp(g.hub.y, g.home.y - 34, scrolled) };
      const rest = Math.max(4, (g.home.y - anchor.y) * s.restK - SAG);

      if (s.away) {
        if (body.current) {
          body.current.style.opacity = "0";
          body.current.style.pointerEvents = "none";
        }
        silk.current?.setAttribute("stroke-opacity", "0");
        raf = requestAnimationFrame(frame);
        return;
      }
      if (s.fly) {
        // Swing into the chat: an arc up and over to the header avatar, shrinking on the way;
        // the silk snaps back up to the web.
        const to = avatarTarget(g);
        const k = Math.min(1, (t - s.fly.t0) / FLY_MS);
        const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
        const u = 1 - e;
        const a = s.fly.from;
        const c1 = { x: a.x - 60, y: a.y - 170 };
        const c2 = { x: to.x + 90, y: to.y - 110 };
        const x = u ** 3 * a.x + 3 * u * u * e * c1.x + 3 * u * e * e * c2.x + e ** 3 * to.x;
        const y = u ** 3 * a.y + 3 * u * u * e * c1.y + 3 * u * e * e * c2.y + e ** 3 * to.y;
        const sc = lerp(1, to.scale, e);
        if (body.current) {
          body.current.style.transformOrigin = `${g.w / 2}px ${ATTACH}px`;
          body.current.style.transform = `translate(${x - g.w / 2}px, ${y - ATTACH}px) rotate(${Math.sin(e * Math.PI) * -32}deg) scale(${sc})`;
        }
        const back = Math.max(0, 1 - e * 2.2);
        silk.current?.setAttribute("d", `M${anchor.x} ${anchor.y} L${anchor.x} ${anchor.y + (a.y - anchor.y) * back}`);
        silk.current?.setAttribute("stroke-opacity", String(0.7 * back));
        if (k >= 1) {
          s.fly = null;
          s.away = true;
        }
        raf = requestAnimationFrame(frame);
        return;
      }

      if (s.drag) {
        const nx = clamp(s.drag.x - s.drag.dx, g.w / 2, g.vw - g.w / 2);
        const ny = clamp(s.drag.y - s.drag.dy, 8, g.vh - g.h + ATTACH);
        s.v = { x: lerp(s.v.x, (nx - s.p.x) / dt, 0.5), y: lerp(s.v.y, (ny - s.p.y) / dt, 0.5) };
        s.p = { x: nx, y: ny };
      } else if (!reduce) {
        const dx = s.p.x - anchor.x;
        const dy = s.p.y - anchor.y;
        const dist = Math.hypot(dx, dy) || 1;
        let ax = Math.sin(t / 1900) * 6; // a faint breeze, so it is never perfectly still
        let ay = s.shown < 1 ? 0 : GRAVITY;
        if (dist > rest) {
          const ux = dx / dist;
          const uy = dy / dist;
          const pull = STIFFNESS * (dist - rest) + SILK_DAMPING * (s.v.x * ux + s.v.y * uy);
          ax -= pull * ux;
          ay -= pull * uy;
        }
        ax -= s.v.x * AIR;
        ay -= s.v.y * AIR;
        s.v.x += ax * dt;
        s.v.y += ay * dt;
        s.p.x += s.v.x * dt;
        s.p.y += s.v.y * dt;
        // Screen edges: soft bounce
        const maxY = g.vh - g.h + ATTACH - 2;
        if (s.p.y > maxY) [s.p.y, s.v.y] = [maxY, s.v.y * -0.35];
        if (s.p.x < g.w / 2) [s.p.x, s.v.x] = [g.w / 2, Math.abs(s.v.x) * 0.4];
        if (s.p.x > g.vw - g.w / 2) [s.p.x, s.v.x] = [g.vw - g.w / 2, -Math.abs(s.v.x) * 0.4];
        // Landed once it has settled after the drop
        if (s.falling && !s.landed) {
          const settled = Math.hypot(s.v.x, s.v.y) < 12 && Math.abs(s.p.y - g.home.y) < 6;
          s.still = settled ? s.still + dt : 0;
          if (s.still > 0.3) {
            s.landed = true;
            setLanded(true);
          }
        }
      } else {
        s.p = { ...g.home };
      }

      // Silk: straight when taut, sagging when slack
      const dx = s.p.x - anchor.x;
      const dy = s.p.y - anchor.y;
      const slack = Math.max(0, rest + SAG - Math.hypot(dx, dy));
      const cx = (anchor.x + s.p.x) / 2;
      const cy = (anchor.y + s.p.y) / 2 + Math.min(90, slack * 0.6);
      silk.current?.setAttribute("d", `M${anchor.x} ${anchor.y} Q${cx} ${cy} ${s.p.x} ${s.p.y}`);
      // Once scrolled, the silk fades out and the spider just sits in the corner (no stub sticking
      // out of its back); grabbing it brings the silk back so the swing still makes sense.
      const silkTarget = s.drag || Math.hypot(s.v.x, s.v.y) > 60 ? 1 : 1 - clamp((scrollY.get() - 120) / 200, 0, 1);
      s.silkVis = lerp(s.silkVis, silkTarget, Math.min(1, dt * 8));
      silk.current?.setAttribute("stroke-opacity", String(0.7 * s.shown * s.silkVis));

      // Spider: hangs along the silk, a little bigger while held
      const tilt = clamp((-Math.atan2(dx, dy) * 180) / Math.PI, -60, 60);
      const scale = (s.drag ? 1.05 : 1) * lerp(0.35, 1, s.shown);
      if (body.current) {
        body.current.style.transformOrigin = `${g.w / 2}px ${ATTACH}px`;
        body.current.style.transform = `translate(${s.p.x - g.w / 2}px, ${s.p.y - ATTACH}px) rotate(${tilt}deg) scale(${scale})`;
        body.current.style.opacity = String(s.shown);
      }
      if (bubble.current) {
        bubble.current.style.transform = `translate(${s.p.x - g.w / 2 - 6}px, ${s.p.y + 4}px)`;
      }

      // Eyes follow the cursor (or scan left and right while looking around)
      let ex = 0;
      let ey = 0;
      if (s.look) ex = Math.sin(t / 300) * 3.5;
      else if (s.mouse) {
        const mx = s.mouse.x - s.p.x;
        const my = s.mouse.y - (s.p.y + g.h / 2);
        const m = Math.min(1, Math.hypot(mx, my) / 220);
        const a = Math.atan2(my, mx);
        ex = Math.cos(a) * 3 * m;
        ey = Math.sin(a) * 2.5 * m;
      }
      eyes.current?.setAttribute("transform", `translate(${ex.toFixed(2)} ${ey.toFixed(2)})`);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const onMove = (e: PointerEvent) => {
      s.mouse = { x: e.clientX, y: e.clientY };
      if (s.drag) {
        s.drag.x = e.clientX;
        s.drag.y = e.clientY;
        if (Math.hypot(e.clientX - s.drag.sx, e.clientY - s.drag.sy) > 6) s.moved = true;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce, scrollY]);

  // ── Sleep while the visitor reads further down, wake back up at the top ──
  const asleep = useRef(false);
  const sleptOnce = useRef(false);
  const toSleep = useCallback(() => {
    if (asleep.current) return;
    asleep.current = true;
    setPose("sleep");
    if (!sleptOnce.current && !sim.current.away) {
      sleptOnce.current = true;
      say(["Zzz… 😴", "Scroll up to wake me"], 2000);
    }
  }, [say]);
  const toWake = useCallback(() => {
    if (!asleep.current) return;
    asleep.current = false;
    if (sim.current.away) {
      setPose("idle");
      return;
    }
    setPose("wake"); // a big stretch (CSS), then back to normal
    later(() => setPose((p) => (p === "wake" ? "idle" : p)), 750);
    later(() => say(["I'm awake! 👋", "Missed me?"], 2000), 500);
  }, [later, say]);
  useMotionValueEvent(scrollY, "change", (y) => {
    if (!sim.current.landed) return;
    if (y > SLEEP_AT) toSleep();
    else if (y < WAKE_AT) toWake();
  });

  // ── Things a real spider does ──
  const quipN = useRef(0);
  const run = useCallback(
    async (a: Activity) => {
      const s = sim.current;
      if (s.busy || s.drag || s.away || s.fly || asleep.current) return;
      s.busy = true;
      const wait = (ms: number) => new Promise((r) => later(() => r(null), ms));
      try {
        if (a === "climb") {
          if (scrollY.get() > 40) return; // only up to the web when the web is on screen
          // Like a real spider on a dragline: reach up, pull, pause, repeat (diagonal legs taking
          // turns, see .spider-pose-climb), reeling the silk in a bit with each pull…
          setPose("climb");
          say(["Heading home 🕸️", "Back in a sec"], 1800);
          const steps = 12;
          for (let i = 0; i < steps; i++) {
            await tween("restK", lerp(1, 0.1, (i + 1) / steps), CLIMB_PULL_MS);
            await wait(CLIMB_REST_MS);
          }
          setPose("idle");
          say(["Checking my web…", "All good up here"], 1500);
          await wait(1400);
          // …then back down in one steady glide, paying the silk out, legs held in.
          setPose("rappel");
          await tween("restK", 1, 2200);
          setPose("idle");
        } else if (a === "spin") {
          setPose("walk");
          say(["Spinning a new one 🕸️", "Hold still"], 2600);
          spinMiniWeb(mini.current, s.p.x - 78, s.p.y + 28);
          await wait(2800);
          setPose("idle");
          later(() => mini.current?.replaceChildren(), 2200);
        } else if (a === "look") {
          s.look = true;
          say(["Anyone hiring? 👀", "I know a great developer"], 2600);
          await wait(2600);
          s.look = false;
        } else if (a === "nap") {
          setPose("nap");
          say(["Five more minutes 😴", "Tap me to wake me up"], 2400);
          await wait(5200);
          setPose((p) => (p === "nap" ? "idle" : p));
        } else if (a === "swing") {
          say(["Watch this! 🤸", "Wheee!"], 1800);
          s.v.x += (Math.random() < 0.5 ? -1 : 1) * 380;
          await wait(2400);
        } else {
          say(QUIPS[quipN.current++ % QUIPS.length], 3200);
          await wait(3200);
        }
      } finally {
        s.busy = false;
      }
    },
    [later, say, scrollY, tween],
  );

  // Greet on landing, then pick an activity every so often (not for reduced motion, not in a hidden tab).
  useEffect(() => {
    if (!landed) return;
    if (firstVisit) later(() => say(GREETING, GREETING_MS), 250);
    if (reduce) return;
    const acts: Activity[] = ["quip", "look", "swing", "spin", "climb", "nap", "quip"];
    let n = 0;
    const next = () => {
      const [lo, hi] = ACTIVITY_EVERY;
      later(() => {
        if (!document.hidden) run(acts[n++ % acts.length]);
        next();
      }, lo + Math.random() * (hi - lo));
    };
    next();
  }, [landed, firstVisit, reduce, later, say, run]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      clearTimeout(lineTimer.current);
    },
    [],
  );

  // ── Grab and drag ──
  const onPointerDown = (e: React.PointerEvent) => {
    const s = sim.current;
    if (reduce || !s.landed || s.away || s.fly) return;
    s.moved = false;
    s.drag = { x: e.clientX, y: e.clientY, dx: e.clientX - s.p.x, dy: e.clientY - s.p.y, sx: e.clientX, sy: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (pose === "nap") say(["Huh? I was resting 😳", "Okay, I'm up"]);
    setPose("curl");
  };
  const onPointerUp = () => {
    const s = sim.current;
    if (!s.drag) return;
    s.drag = null;
    if (s.moved) {
      say(Math.hypot(s.v.x, s.v.y) > 900 ? ["Wheee! 🎢", "Do it again!"] : ["Whoa, easy there 😅", "I'm a spider, not a yo-yo"]);
      setPose("walk");
      later(() => setPose(asleep.current ? "sleep" : "idle"), 1200);
    } else setPose(asleep.current ? "sleep" : "idle");
  };
  const onClick = () => {
    const s = sim.current;
    if (s.moved) {
      s.moved = false; // that was a drag, not a tap
      return;
    }
    if (s.away || s.fly) return;
    setLine(null);
    setPose("idle");
    asleep.current = false; // wakes up to fly into the chat
    if (reduce) s.away = true;
    else s.fly = { from: { ...s.p }, t0: performance.now() };
    if (body.current) body.current.style.zIndex = "90"; // above the chat panel (z-85) while it flies in
    onOpen();
  };

  // Chat closed: climb back out of the web on fresh silk and drop down again.
  useEffect(() => {
    const s = sim.current;
    if (open) {
      if (!s.fly) s.away = true; // opened some other way (or reduced motion)
      return;
    }
    if (!s.away && !s.fly) return;
    s.fly = null;
    s.away = false;
    if (body.current) {
      body.current.style.pointerEvents = "";
      body.current.style.zIndex = "";
    }
    const g = geometry();
    if (reduce) {
      s.p = { ...g.home };
      s.shown = 1;
      return;
    }
    s.p = { ...g.hub };
    s.v = { x: 0, y: 0 };
    s.shown = 0;
    s.restK = 0.02;
    let cancelled = false;
    (async () => {
      await new Promise((r) => setTimeout(r, 250));
      if (cancelled) return;
      await tween("shown", 1, 350);
      s.restK = 1;
      later(() => {
        // Still scrolled down: back to sleep. Otherwise say hello again.
        if (scrollY.get() > SLEEP_AT) toSleep();
        else say(["I'm back 👋", "Tap me anytime"], 2000);
      }, 1400);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, reduce, tween, later, say, scrollY, toSleep]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25 }}
      className={line ? "is-greeting" : ""}
    >
      {/* Silk (and the little webs it spins), drawn across the whole screen */}
      <svg aria-hidden className="pointer-events-none fixed inset-0 z-[79] h-full w-full overflow-visible">
        <path ref={silk} fill="none" stroke="#7d6e5f" strokeOpacity="0" strokeWidth="1.1" strokeLinecap="round" />
        <g ref={mini} fill="none" stroke="#7d6e5f" strokeOpacity="0.5" strokeWidth="0.7" />
      </svg>

      {/* Speech bubble: sits to the left of the spider and follows it */}
      <div ref={bubble} className="pointer-events-none fixed top-0 left-0 z-[80]">
        <AnimatePresence>
          {line && (
            <motion.button
              key={line[0]}
              type="button"
              onClick={onOpen}
              tabIndex={-1}
              aria-hidden
              initial={{ opacity: 0, x: 10, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className="pointer-events-auto absolute top-0 right-0 w-max max-w-[min(220px,calc(100vw-128px))] origin-right cursor-pointer rounded-2xl rounded-br-sm border border-border bg-background px-3.5 py-2 text-left text-[13px] leading-snug shadow-[0_12px_30px_-14px_rgba(0,0,0,0.4)]"
            >
              <span className="block font-semibold">{line[0]}</span>
              <span className="block text-muted-foreground">{line[1]}</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <button
        ref={body}
        type="button"
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label="Ask the AI assistant about Sourav"
        style={{ opacity: 0 }}
        className={`spider-pose-${pose} fixed top-0 left-0 z-[80] block touch-none cursor-grab select-none active:cursor-grabbing`}
      >
        <Spider />
      </button>
    </motion.div>
  );
}

/** Draws a little orb web, ring by ring, as if the spider were spinning it. */
function spinMiniWeb(g: SVGGElement | null, cx: number, cy: number) {
  if (!g) return;
  g.replaceChildren();
  const ns = "http://www.w3.org/2000/svg";
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + 0.2;
    const l = document.createElementNS(ns, "line");
    l.setAttribute("x1", String(cx));
    l.setAttribute("y1", String(cy));
    l.setAttribute("x2", String(cx + Math.cos(a) * 34));
    l.setAttribute("y2", String(cy + Math.sin(a) * 34));
    l.setAttribute("pathLength", "1");
    l.setAttribute("class", "spider-mini-spoke");
    l.style.animationDelay = `${i * 0.05}s`;
    g.appendChild(l);
  }
  for (let k = 0; k < 6; k++) {
    const c = document.createElementNS(ns, "circle");
    c.setAttribute("cx", String(cx));
    c.setAttribute("cy", String(cy));
    c.setAttribute("r", String(6 + k * 5.2));
    c.setAttribute("pathLength", "1");
    c.setAttribute("class", "spider-mini-ring");
    c.style.animationDelay = `${0.4 + k * 0.32}s`;
    g.appendChild(c);
  }
}

/**
 * The robot spider, night-hero edition: navy armour, pale steel helmet with a glass visor,
 * a short wine-red cape, a gold star emblem and gold leg tips. An original design.
 */
/** The spider as the chat header avatar (it lands here when you tap it). */
export function SpiderAvatar() {
  return <Spider className="w-12" />;
}

/*
 * The mech spider: Sourav's own AI-made render (white armour, orange power cores, SG badge).
 * It is split into layers from the one image: the body, plus its four big legs, each clipped out
 * and rotating at its hip joint, so the legs move independently (idle sway, walking ripple, curl
 * when grabbed, a wave while it talks). Coordinates are in the source image's 1700×925 space.
 */
const LEGS = [
  { id: "lo", side: "l", hip: [530, 335], under: "li", points: "600,250 470,240 330,250 200,295 110,375 40,465 5,600 5,830 115,830 150,640 205,520 300,470 375,430 440,400 500,392 600,380" },
  { id: "ro", side: "r", hip: [1210, 335], under: "ri", points: "1140,250 1270,240 1410,250 1540,295 1630,375 1700,465 1735,600 1735,830 1625,830 1590,640 1535,520 1440,470 1365,430 1300,400 1240,392 1140,380" },
  { id: "li", side: "l", hip: [590, 445], under: null, points: "665,420 600,378 520,383 430,408 368,470 328,560 285,640 262,760 282,905 345,905 402,760 422,660 472,600 545,560 650,545" },
  { id: "ri", side: "r", hip: [1135, 445], under: null, points: "1075,420 1140,378 1220,383 1310,408 1372,470 1412,560 1455,640 1478,760 1458,905 1395,905 1338,760 1318,660 1268,600 1195,560 1090,545" },
] as const;
const IMG = "/Images/spider-mech.png"; // 680×370 export of public/Images/spiderimage.png

function Spider({ className = "w-[110px] md:w-[150px]" }: { className?: string }) {
  const art = <image href={IMG} x="0" y="0" width="1700" height="925" />;
  return (
    <span className={`spider-img relative block ${className}`}>
      <svg viewBox="0 175 1700 735" className="block h-auto w-full overflow-visible" aria-hidden>
        <defs>
          {/* Each leg layer; an outer leg leaves out the inner leg in front of it, so no pixel
              belongs to two legs */}
          {LEGS.map((l) => (
            <mask key={l.id} id={`sp-leg-${l.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1700" height="925">
              <polygon points={l.points} fill="#fff" />
              {l.under && <polygon points={LEGS.find((o) => o.id === l.under)!.points} fill="#000" />}
            </mask>
          ))}
          {/* Behind the moving legs: a darkened copy of the body and leg roots, so a leg swinging
              away shows shadowed mech internals instead of a hole */}
          <clipPath id="sp-backfill" clipPathUnits="userSpaceOnUse">
            <ellipse cx="870" cy="500" rx="670" ry="260" />
          </clipPath>
          <filter id="sp-dim" x="0" y="0" width="100%" height="100%">
            <feColorMatrix type="matrix" values="0.3 0 0 0 0  0 0.3 0 0 0  0 0 0.3 0 0  0 0 0 1 0" />
          </filter>
          {/* Body = the image minus the four legs */}
          <mask id="sp-body" maskUnits="userSpaceOnUse" x="0" y="0" width="1700" height="925">
            <rect width="1700" height="925" fill="#fff" />
            {LEGS.map((l) => (
              <polygon key={l.id} points={l.points} fill="#000" />
            ))}
          </mask>
          <filter id="sp-eye-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        <g clipPath="url(#sp-backfill)">
          <g filter="url(#sp-dim)">{art}</g>
        </g>
        <g mask="url(#sp-body)">{art}</g>
        {LEGS.map((l) => (
          <g
            key={l.id}
            className={`spider-leg spider-leg-${l.side} spider-leg-${l.id}`}
            style={{ transformOrigin: `${l.hip[0]}px ${l.hip[1]}px` }}
          >
            <g mask={`url(#sp-leg-${l.id})`}>{art}</g>
          </g>
        ))}

        {/* Eye glow (pulses), eyelids (close while napping), the z it snores */}
        <g className="spider-eyeglow" filter="url(#sp-eye-blur)" fill="#ff8a2a">
          <ellipse cx="790" cy="398" rx="70" ry="42" />
          <ellipse cx="955" cy="398" rx="70" ry="42" />
        </g>
        <g className="spider-lids" fill="#0b0b0d">
          <rect x="735" y="352" width="280" height="92" rx="40" />
        </g>
        <text className="spider-zz" x="1060" y="250" fontSize="110" fontWeight="700" fill="#ff7a2e">
          z
        </text>
      </svg>
    </span>
  );
}
