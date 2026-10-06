"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { BookOpen, Captions, Check, FileText, CircleDot, ListChecks, Maximize, Pause, Plus, Trophy, Volume2 } from "lucide-react";
import { EASE } from "@/components/motion/Reveal";

/** Decorative product mockups for projects without a live demo. Same frame size as the demos. */

const frame =
  "relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-lg bg-white text-[#111827] ring-1 ring-black/10";

function useLooping(steps: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const t = setInterval(() => setStep((s) => (s + 1) % steps), ms);
    return () => clearInterval(t);
  }, [inView, reduce, steps, ms]);
  return { ref, inView, step };
}

/* ── LMS: lesson player (HLS) with course content, progress and a quiz result ── */
const LESSONS = [
  { title: "App Router basics", time: "8:12", done: true },
  { title: "Data fetching", time: "10:40", done: true },
  { title: "Caching & revalidation", time: "9:05", done: true },
  { title: "Streaming & Suspense", time: "12:30", now: true },
  { title: "Quiz · Rendering", time: "10 Qs", quiz: true },
];
// What the lesson "video" shows: code being written line by line on the instructor's screen.
const CODE: { t: string; c: string }[][] = [
  [{ t: "export default async function ", c: "#c792ea" }, { t: "Page", c: "#82aaff" }, { t: "() {", c: "#e5e7eb" }],
  [{ t: "  const ", c: "#c792ea" }, { t: "courses", c: "#e5e7eb" }, { t: " = await ", c: "#c792ea" }, { t: "getCourses", c: "#82aaff" }, { t: "();", c: "#e5e7eb" }],
  [{ t: "  return ", c: "#c792ea" }, { t: "(", c: "#e5e7eb" }],
  [{ t: "    <Suspense ", c: "#f07178" }, { t: "fallback", c: "#ffcb6b" }, { t: "={<Skeleton />}>", c: "#e5e7eb" }],
  [{ t: "      <CourseGrid ", c: "#f07178" }, { t: "data", c: "#ffcb6b" }, { t: "={courses} />", c: "#e5e7eb" }],
  [{ t: "    </Suspense>", c: "#f07178" }],
  [{ t: "  );", c: "#e5e7eb" }],
  [{ t: "}", c: "#e5e7eb" }],
];
const LESSON_LENGTH = 12 * 60 + 30;
const START = 4 * 60 + 12;
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function LmsVisual() {
  const { ref, inView, step } = useLooping(2, 3600);
  const reduce = useReducedMotion();
  // Playback clock: ticks every second while on screen, loops within the lesson.
  const [sec, setSec] = useState(START);
  useEffect(() => {
    if (!inView || reduce) return;
    const t = setInterval(() => setSec((s) => (s >= START + 40 ? START : s + 1)), 1000);
    return () => clearInterval(t);
  }, [inView, reduce]);
  const lines = Math.min(CODE.length, Math.floor((sec - START) / 3) + 2);
  const played = (sec / LESSON_LENGTH) * 100;

  return (
    <div ref={ref} aria-hidden className={`${frame} @container`}>
      {/* App bar */}
      <div className="flex items-center gap-2 border-b border-black/10 px-3 py-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#2563eb] text-white">
          <BookOpen className="h-3 w-3" />
        </span>
        <span className="text-[11px] font-bold">Learn</span>
        <span className="text-[8.5px] text-black/45">/ Next.js in Production</span>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-[#eef2ff] px-2 py-0.5 text-[8px] font-medium text-[#2563eb]">
          <Trophy className="h-2.5 w-2.5" /> 12-day streak
        </span>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-2.5 p-2.5 @md:grid-cols-[1fr_36%]">
        <div className="flex min-w-0 flex-col gap-2">
          {/* Player */}
          <div className="relative aspect-video overflow-hidden rounded-md bg-[#0b1020] @md:aspect-auto @md:min-h-[150px] @md:flex-1">
            {/* "Screen" in the video: an editor with code being typed */}
            <div className="absolute inset-0 p-2.5 pr-[30%] font-mono text-[7.5px] leading-[1.55]">
              <div className="mb-1.5 flex gap-1">
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                  <span key={c} className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
                ))}
                <span className="ml-1.5 text-[6.5px] text-white/40">app/courses/page.tsx</span>
              </div>
              {CODE.slice(0, lines).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="whitespace-pre"
                >
                  <span className="mr-2 text-white/25">{i + 1}</span>
                  {line.map((tok, k) => (
                    <span key={k} style={{ color: tok.c }}>
                      {tok.t}
                    </span>
                  ))}
                  {i === lines - 1 && <span className="ml-px inline-block h-2 w-[3px] animate-pulse bg-white/70 align-middle" />}
                </motion.p>
              ))}
            </div>

            {/* Instructor camera, picture-in-picture */}
            <div className="absolute top-2 right-2 flex h-[38%] w-[24%] flex-col items-center justify-center gap-1 rounded bg-gradient-to-b from-[#334155] to-[#1e293b] ring-1 ring-white/10">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6366f1] text-[7px] font-bold text-white">AK</span>
              <span className="flex h-2 items-end gap-[1.5px]">
                {[0, 1, 2, 3, 4].map((b) => (
                  <motion.span
                    key={b}
                    className="w-[1.5px] rounded-full bg-[#4ade80]"
                    animate={inView && !reduce ? { height: ["30%", "100%", "45%", "80%", "30%"] } : { height: "40%" }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: b * 0.12 }}
                  />
                ))}
              </span>
            </div>

            {/* Title + quality badge */}
            <div className="absolute inset-x-2 bottom-[22%] flex items-end justify-between">
              <span className="rounded bg-black/55 px-1.5 py-0.5 text-[7.5px] font-semibold text-white">
                Lesson 4 · Streaming &amp; Suspense
              </span>
            </div>

            {/* Controls */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pt-3 pb-1.5">
              <div className="relative h-[3px] rounded-full bg-white/20">
                <span className="absolute inset-y-0 left-0 rounded-full bg-white/35" style={{ width: `${Math.min(100, played + 14)}%` }} />
                <span className="absolute inset-y-0 left-0 rounded-full bg-[#3b82f6]" style={{ width: `${played}%` }} />
                <span
                  className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow"
                  style={{ left: `${played}%` }}
                />
              </div>
              <div className="mt-1 flex items-center gap-2 text-white">
                <Pause className="h-2.5 w-2.5" fill="currentColor" />
                <Volume2 className="h-2.5 w-2.5" />
                <span className="font-mono text-[7px] whitespace-nowrap tabular-nums">
                  {mmss(sec)} / {mmss(LESSON_LENGTH)}
                </span>
                <span className="ml-auto rounded bg-white/15 px-1 font-mono text-[6.5px] whitespace-nowrap">HLS · 720p</span>
                <Captions className="h-2.5 w-2.5" />
                <Maximize className="h-2.5 w-2.5" />
              </div>
            </div>
          </div>

          {/* Course progress */}
          <div className="rounded-md border border-black/10 px-2 py-1.5">
            <p className="flex justify-between text-[8.5px]">
              <span className="font-semibold">Course progress</span>
              <span className="font-mono text-black/50">3 of 5 · 64%</span>
            </p>
            <span className="mt-1 block h-1 overflow-hidden rounded-full bg-black/[0.06]">
              <motion.span
                className="block h-full rounded-full bg-[#2563eb]"
                initial={{ width: 0 }}
                animate={inView ? { width: "64%" } : undefined}
                transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
              />
            </span>
          </div>

          {/* Quiz result toggles in */}
          <motion.div
            animate={{ opacity: step === 1 ? 1 : 0, y: step === 1 ? 0 : 6 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex items-center gap-2 rounded-md bg-[#ecfdf5] px-2 py-1.5 text-[8.5px] text-[#047857]"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#10b981] text-white">
              <Check className="h-2.5 w-2.5" />
            </span>
            <span>
              Last quiz · <b>9 / 10</b> — progress saved
            </span>
          </motion.div>
        </div>

        {/* Course content */}
        <div className="flex flex-col rounded-md border border-black/10">
          <p className="border-b border-black/10 px-2 py-1.5 text-[8.5px] font-semibold">Course content</p>
          <ol className="flex flex-1 flex-col">
            {LESSONS.map((l, i) => (
              <li
                key={l.title}
                className={`flex max-h-9 flex-1 items-center gap-1.5 border-b border-black/[0.06] px-2 py-1.5 text-[8px] last:border-0 ${
                  l.now ? "bg-[#eef2ff]" : ""
                }`}
              >
                <span
                  className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[6.5px] font-bold ${
                    l.done ? "bg-[#10b981] text-white" : l.now ? "bg-[#2563eb] text-white" : "bg-black/[0.06] text-black/45"
                  }`}
                >
                  {l.done ? <Check className="h-2 w-2" /> : l.quiz ? <ListChecks className="h-2 w-2" /> : i + 1}
                </span>
                <span className={`min-w-0 flex-1 truncate ${l.now ? "font-semibold text-[#1d4ed8]" : ""}`}>{l.title}</span>
                {l.now ? (
                  <span className="flex h-2 items-end gap-[1.5px]">
                    {[0, 1, 2].map((b) => (
                      <motion.span
                        key={b}
                        className="w-[1.5px] rounded-full bg-[#2563eb]"
                        animate={inView && !reduce ? { height: ["35%", "100%", "35%"] } : { height: "60%" }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: b * 0.15 }}
                      />
                    ))}
                  </span>
                ) : (
                  <span className="font-mono text-[7px] text-black/40">{l.time}</span>
                )}
              </li>
            ))}
          </ol>
          {/* Lesson resources */}
          <div className="mt-auto hidden space-y-1 border-t border-black/10 p-2 @md:block">
            <p className="text-[7.5px] font-semibold tracking-wide text-black/45 uppercase">Resources</p>
            {["Lesson slides.pdf", "starter-code.zip"].map((f) => (
              <p key={f} className="flex items-center gap-1.5 rounded bg-black/[0.03] px-1.5 py-1 text-[7.5px]">
                <FileText className="h-2.5 w-2.5 text-[#2563eb]" /> {f}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PMT: sprint board where a task moves across columns, updated live ───── */
const COLUMNS = ["To do", "In progress", "Done"] as const;
const STATIC: Record<(typeof COLUMNS)[number], { id: string; title: string; tag: string }[]> = {
  "To do": [
    { id: "PMT-151", title: "Sprint report export", tag: "Reports" },
    { id: "PMT-148", title: "Approval reminders", tag: "Workflow" },
  ],
  "In progress": [{ id: "PMT-139", title: "Team workload chart", tag: "Dashboard" }],
  Done: [{ id: "PMT-131", title: "Role-based access", tag: "Auth" }],
};
const TAG: Record<string, string> = {
  Reports: "#0891b2",
  Workflow: "#7c3aed",
  Dashboard: "#2563eb",
  Auth: "#059669",
  Board: "#ff4d00",
};

function Task({ id, title, tag, live }: { id: string; title: string; tag: string; live?: boolean }) {
  return (
    <div
      className={`rounded-md border bg-white p-1.5 shadow-[0_1px_0_rgba(0,0,0,0.04)] ${
        live ? "border-[#ff4d00] shadow-[0_8px_20px_-8px_rgba(255,77,0,0.45)]" : "border-black/10"
      }`}
    >
      <p className="font-mono text-[7px] text-black/45">{id}</p>
      <p className="mt-0.5 text-[8.5px] leading-tight font-semibold">{title}</p>
      <span
        className="mt-1 inline-block rounded px-1 py-px text-[6.5px] font-semibold"
        style={{ color: TAG[tag], background: `${TAG[tag]}18` }}
      >
        {tag}
      </span>
    </div>
  );
}

export function PmtVisual() {
  const { ref, step } = useLooping(3, 1900);
  const moving = { id: "PMT-142", title: "Drag-and-drop board", tag: "Board" };

  return (
    <div ref={ref} aria-hidden className={frame}>
      <div className="flex items-center gap-2 border-b border-black/10 px-3 py-2">
        <span className="text-[11px] font-bold">Sprint 14</span>
        <span className="rounded-full bg-black/[0.05] px-1.5 py-0.5 text-[7.5px] text-black/60">Oct 1 – Oct 14</span>
        <span className="ml-auto flex items-center gap-1 text-[8px] text-[#059669]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#10b981] opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          </span>
          Live
        </span>
        <span className="flex -space-x-1.5">
          {["#2563eb", "#7c3aed", "#ff4d00"].map((c, i) => (
            <span key={c} className="h-4 w-4 rounded-full border-2 border-white" style={{ background: c, zIndex: 3 - i }} />
          ))}
        </span>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-2 bg-[#f6f7f9] p-2.5">
        {COLUMNS.map((col, ci) => (
          <div key={col} className="flex flex-col gap-1.5 rounded-md bg-black/[0.03] p-1.5">
            <p className="flex items-center justify-between text-[8.5px] font-semibold text-black/70">
              <span className="flex items-center gap-1">
                <CircleDot className="h-2.5 w-2.5" style={{ color: ["#94a3b8", "#2563eb", "#059669"][ci] }} />
                {col}
              </span>
              <span className="font-mono text-black/40">{STATIC[col].length + (step === ci ? 1 : 0)}</span>
            </p>
            {step === ci && (
              <motion.div layoutId="pmt-moving" transition={{ type: "spring", stiffness: 260, damping: 28 }}>
                <Task {...moving} live />
              </motion.div>
            )}
            {STATIC[col].map((t) => (
              <motion.div key={t.id} layout transition={{ type: "spring", stiffness: 260, damping: 28 }}>
                <Task {...t} />
              </motion.div>
            ))}
            <span className="mt-auto flex items-center gap-1 text-[7.5px] text-black/40">
              <Plus className="h-2 w-2" /> Add task
            </span>
          </div>
        ))}
      </div>

      {/* Live update toast (Socket.IO) */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE, delay: 0.25 }}
        className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-md bg-[#111827] px-2 py-1 text-[8px] whitespace-nowrap text-white shadow-lg"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d00]" />
        PMT-142 moved to <b>{COLUMNS[step]}</b> · synced live
      </motion.div>
    </div>
  );
}
