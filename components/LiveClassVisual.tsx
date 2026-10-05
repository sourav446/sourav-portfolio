"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Check,
  Hand,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  SmilePlus,
  Sparkles,
  Users,
  VideoOff,
} from "lucide-react";
import { EASE } from "@/components/motion/Reveal";

/**
 * Decorative demo of the live-classroom app, styled after the real room UI
 * (WebRTC_Platform: black stage, 6px tiles, navy Zoom-style footer, sky-blue active
 * state, green Share). Cycles video chat → screen share → virtual background.
 * No photos: every participant is shown with their camera off.
 */

// Colours taken from the real FooterBar / room.
const C = {
  stage: "#0b0b0f",
  footer: "rgba(11,18,32,0.97)",
  border: "#1e293b",
  text: "#e2e8f0",
  active: "#38bdf8",
  activeBg: "rgba(56,189,248,0.12)",
  share: "#4ade80",
  shareOn: "#22c55e",
  danger: "#f87171",
  panel: "rgba(15,23,42,0.96)",
  panelBorder: "#334155",
};

const PEOPLE = [
  { name: "Sourav (Host)", initials: "SG", tint: "#ff6a2b" },
  { name: "Anita", initials: "A", tint: "#6366f1" },
  { name: "Rahul", initials: "R", tint: "#10b981" },
  { name: "Mei", initials: "M", tint: "#a855f7" },
];

type Scene = "video" | "screen" | "background";
const SCENES: { id: Scene; label: string }[] = [
  { id: "video", label: "Video chat" },
  { id: "screen", label: "Screen share" },
  { id: "background", label: "Virtual background" },
];

/* ── Tiles ───────────────────────────────────────────────────────────── */

function NameTag({ name, muted, speaking }: { name: string; muted?: boolean; speaking?: boolean }) {
  return (
    <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white/90 sm:text-[10px]">
      {speaking ? (
        <span className="flex h-2.5 items-end gap-[2px]">
          {[0, 1, 2].map((b) => (
            <motion.span
              key={b}
              className="w-[2px] rounded-full"
              style={{ background: C.active }}
              animate={{ height: ["30%", "100%", "45%", "85%", "30%"] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: b * 0.12 }}
            />
          ))}
        </span>
      ) : muted ? (
        <MicOff className="h-2.5 w-2.5 text-red-400" />
      ) : (
        <Mic className="h-2.5 w-2.5" />
      )}
      {name}
    </span>
  );
}

/** Camera-off tile: avatar initials; a soft pulse around the avatar while speaking. */
function Tile({
  person,
  speaking = false,
  muted = false,
  small = false,
}: {
  person: (typeof PEOPLE)[number];
  speaking?: boolean;
  muted?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className="relative flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-md bg-[#1a1d26] transition-shadow duration-300"
      style={{ boxShadow: speaking ? `inset 0 0 0 2px ${C.active}` : undefined }}
    >
      <span className="relative flex items-center justify-center">
        {speaking && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: person.tint }}
            animate={{ scale: [1, 1.35], opacity: [0.35, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span
          className={`relative flex items-center justify-center rounded-full font-semibold text-white ${
            small ? "h-7 w-7 text-[10px]" : "h-10 w-10 text-xs sm:h-12 sm:w-12 sm:text-sm"
          }`}
          style={{ background: person.tint }}
        >
          {person.initials}
        </span>
      </span>
      {!small && (
        <span className="flex items-center gap-1 text-[9px] text-white/45">
          <VideoOff className="h-2.5 w-2.5" /> Camera off
        </span>
      )}
      <NameTag name={person.name} muted={muted} speaking={speaking} />
    </div>
  );
}

/* ── Scene 1: video chat — speaking indicator moves around the room ────── */

function VideoScene() {
  const [speaker, setSpeaker] = useState(0);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const s = setInterval(() => setSpeaker((n) => (n + 1) % PEOPLE.length), 1100);
    const j = setTimeout(() => setJoined(true), 1500);
    return () => {
      clearInterval(s);
      clearTimeout(j);
    };
  }, []);

  return (
    <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
      {PEOPLE.map((p, i) => (
        <Tile key={p.name} person={p} speaking={i === speaker} muted={i !== speaker && i % 2 === 1} />
      ))}
      <AnimatePresence>
        {joined && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] whitespace-nowrap text-white"
            style={{ background: C.panel, borderColor: C.panelBorder }}
          >
            <Hand className="h-3 w-3" style={{ color: C.active }} /> Mei raised a hand
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Scene 2: screen share — shared screen + filmstrip ─────────────────── */

function ScreenScene() {
  return (
    <div className="grid h-full grid-cols-[1fr_26%] gap-2">
      <div className="relative overflow-hidden rounded-md bg-[#15171d]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="absolute inset-2 overflow-hidden rounded bg-[#f4f2ee]"
        >
          <div className="flex items-center gap-1 border-b border-black/10 bg-white px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[8px] text-black/50">Lecture 12 — React Hooks.pdf</span>
          </div>
          <div className="space-y-1.5 p-2.5">
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[11px] font-semibold text-[#111] sm:text-xs"
            >
              useEffect: syncing with the outside world
            </motion.p>
            {[92, 78, 85, 60].map((w, i) => (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                animate={{ width: `${w}%` }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.4 + i * 0.1 }}
                className="h-1.5 rounded-full bg-black/15"
              />
            ))}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-2 rounded bg-[#1e1e2e] p-1.5 font-mono text-[7px] leading-relaxed text-[#cdd6f4] sm:text-[8px]"
            >
              <span className="text-[#cba6f7]">useEffect</span>(() =&gt; {"{"}
              <br />
              &nbsp;&nbsp;socket.<span className="text-[#89b4fa]">on</span>(
              <span className="text-[#a6e3a1]">&quot;join&quot;</span>, onJoin);
              <br />
              {"}"}, []);
            </motion.div>
          </div>
        </motion.div>
        <motion.span
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold text-[#052e16]"
          style={{ background: C.shareOn }}
        >
          <MonitorUp className="h-3 w-3" /> You are sharing
        </motion.span>
      </div>

      {/* Filmstrip */}
      <div className="grid grid-rows-3 gap-2">
        <Tile person={PEOPLE[0]} speaking small />
        <Tile person={PEOPLE[1]} muted small />
        <Tile person={PEOPLE[2]} muted small />
      </div>
    </div>
  );
}

/* ── Scene 3: virtual background on the host's self-view (CSS only) ────── */

const BG_OPTIONS = [
  { key: "none", label: "None" },
  { key: "blur", label: "Blur" },
  { key: "image", label: "Background" },
] as const;

function BackgroundScene({ onPick }: { onPick: (i: number) => void }) {
  const [pick, setPick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPick((n) => (n + 1) % BG_OPTIONS.length), 1200);
    return () => clearInterval(t);
  }, []);
  // Tell the parent (it renders the Background popup) which option is selected.
  useEffect(() => onPick(pick), [pick, onPick]);
  const effect = BG_OPTIONS[pick].key;

  return (
    <div className="relative h-full overflow-hidden rounded-md" style={{ boxShadow: `inset 0 0 0 2px ${C.active}` }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={effect}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {effect === "none" && (
            // Plain room
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,#3a3d48,#15171d_75%)]" />
          )}
          {effect === "blur" && (
            // Blurred room: soft colour shapes
            <div className="absolute inset-0 scale-110 bg-[radial-gradient(circle_at_25%_35%,#7c8db0,transparent_40%),radial-gradient(circle_at_75%_30%,#c98b5e,transparent_38%),radial-gradient(circle_at_60%_80%,#4d6b5c,transparent_45%),#2b2f3a] blur-md" />
          )}
          {effect === "image" && (
            // Replacement background: warm studio gradient with a window
            <div className="absolute inset-0 bg-gradient-to-b from-[#ffb07a] via-[#ff7a59] to-[#7c3aed]">
              <span className="absolute top-[14%] left-[10%] h-[40%] w-[30%] rounded-sm border-4 border-white/70 bg-white/20" />
              <span className="absolute right-[12%] bottom-[18%] h-2 w-[28%] rounded-sm bg-black/25" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Host avatar (camera off) stays in front */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full text-base font-semibold text-white shadow-lg ring-4 ring-black/20 sm:h-16 sm:w-16"
          style={{ background: PEOPLE[0].tint }}
        >
          {PEOPLE[0].initials}
        </span>
        <span className="rounded bg-black/45 px-1.5 py-0.5 text-[9px] text-white/80">Preview · camera off</span>
      </div>

      <span
        className="absolute top-2 left-2 flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[9px] text-white"
        style={{ background: C.panel, borderColor: C.panelBorder }}
      >
        <Sparkles className="h-3 w-3" style={{ color: C.active }} /> Effect: {BG_OPTIONS[pick].label}
      </span>
      <NameTag name="You" />
    </div>
  );
}

/* ── Footer: same layout as the real FooterBar ─────────────────────────── */

function FooterButton({
  icon: Icon,
  label,
  active = false,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  color?: string;
  bg?: string;
}) {
  return (
    <span
      className="flex min-w-[34px] flex-1 flex-col items-center justify-center gap-0.5 px-0.5 transition-colors duration-300 sm:min-w-[44px] sm:flex-none sm:px-1.5"
      style={{ color: color ?? (active ? C.active : C.text), background: bg ?? (active ? C.activeBg : "transparent") }}
    >
      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      <span className="text-[7.5px] whitespace-nowrap sm:text-[9px]">{label}</span>
    </span>
  );
}

export default function LiveClassVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [scene, setScene] = useState(0);
  const [seconds, setSeconds] = useState(42 * 60 + 18);
  const [bgPick, setBgPick] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const s = setInterval(() => setScene((n) => (n + 1) % SCENES.length), 4200);
    const c = setInterval(() => setSeconds((n) => n + 1), 1000);
    return () => {
      clearInterval(s);
      clearInterval(c);
    };
  }, [inView, reduce]);

  const active = SCENES[scene].id;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-lg bg-black text-white ring-1 ring-black/10"
    >
      {/* Stage */}
      <div className="relative flex-1 p-2" style={{ background: C.stage }}>
        {/* Top overlay chips, like the room's floating pills */}
        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between">
          <span
            className="flex items-center gap-1.5 rounded-lg border px-2 py-1 font-mono text-[9px] tracking-wide"
            style={{ background: C.panel, borderColor: C.panelBorder }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            REC · {mm}:{ss}
          </span>
          <motion.span
            key={active}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border px-2 py-1 text-[9px] font-medium"
            style={{ background: C.panel, borderColor: C.panelBorder, color: C.active }}
          >
            {SCENES[scene].label}
          </motion.span>
        </div>

        <div className="relative h-full">
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 pt-9"
            >
              {active === "video" && <VideoScene />}
              {active === "screen" && <ScreenScene />}
              {active === "background" && <BackgroundScene onPick={setBgPick} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* "Background" popup above Effects, as in VirtualBackgroundControl */}
        <AnimatePresence>
          {active === "background" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="absolute right-[34%] bottom-2 z-20 w-[128px] rounded-[10px] border p-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.5)] sm:w-[150px]"
              style={{ background: C.panel, borderColor: C.panelBorder }}
            >
              <p className="px-2 pt-1 pb-1.5 text-[8px] font-bold tracking-[0.06em] text-[#64748b] uppercase">
                Background
              </p>
              {BG_OPTIONS.map((o, i) => {
                const on = i === bgPick;
                return (
                  <span
                    key={o.key}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] transition-colors duration-300"
                    style={{ background: on ? "rgba(59,130,246,0.2)" : "transparent", color: on ? "#93c5fd" : C.text }}
                  >
                    <span className="flex-1">{o.label}</span>
                    {on && <Check className="h-3 w-3" />}
                  </span>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer bar */}
      <div
        className="flex h-12 shrink-0 items-stretch border-t sm:h-[52px]"
        style={{ background: C.footer, borderColor: C.border }}
      >
        <div className="flex flex-1 items-stretch justify-center gap-0.5 sm:gap-1">
          <FooterButton icon={Mic} label="Mute" />
          <FooterButton icon={VideoOff} label="Start Video" color={C.danger} />
          <FooterButton
            icon={MonitorUp}
            label={active === "screen" ? "Stop Share" : "Share"}
            color={active === "screen" ? C.shareOn : C.share}
            bg={active === "screen" ? "rgba(34,197,94,0.12)" : undefined}
          />
          <FooterButton icon={Sparkles} label="Effects" active={active === "background"} />
        </div>
        <div className="hidden items-stretch gap-0.5 pr-1 sm:flex">
          <FooterButton icon={Users} label="People" active={active === "video"} />
          <FooterButton icon={MessageSquare} label="Chat" />
          <FooterButton icon={SmilePlus} label="React" />
          <FooterButton icon={Hand} label="Raise" />
        </div>
        <FooterButton icon={PhoneOff} label="Leave" color={C.danger} />
      </div>
    </div>
  );
}
