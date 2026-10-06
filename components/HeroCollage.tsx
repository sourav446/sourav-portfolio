"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EASE } from "@/components/motion/Reveal";
import CodeCard from "@/components/CodeCard";

// Stock photos (Unsplash licence), in themed sets of three that match the work.
// Order within a set = main frame, left frame, small square.
const SETS = [
  {
    label: "Workspace",
    photos: [
      { src: "/Images/hero/coder-workspace.jpg", pos: "object-[50%_30%]" },
      { src: "/Images/hero/laptop-coding.jpg", pos: "object-[70%_45%]" },
      { src: "/Images/hero/code-screen.jpg", pos: "object-[40%_40%]" },
    ],
  },
  {
    label: "Live classes & learning",
    photos: [
      { src: "/Images/hero/video-call.jpg", pos: "object-[62%_40%]" },
      { src: "/Images/hero/online-learning.jpg", pos: "object-[55%_45%]" },
      { src: "/Images/hero/ui-wireframes.jpg", pos: "object-[45%_50%]" },
    ],
  },
  {
    label: "Commerce & teamwork",
    photos: [
      { src: "/Images/hero/cricket.jpg", pos: "object-[50%_40%]" },
      { src: "/Images/hero/online-checkout.jpg", pos: "object-[40%_50%]" },
      { src: "/Images/hero/kanban-notes.jpg", pos: "object-[70%_45%]" },
    ],
  },
];
type Photo = (typeof SETS)[number]["photos"][number];

// Frames the photos rotate through.
const SLOTS = [
  // Tall main image, top right
  { box: "right-0 top-0 w-[58%] aspect-[3/4]", depth: 10, delay: 0.25 },
  // Left, sits a little lower
  { box: "left-0 top-[14%] w-[44%] aspect-[4/5]", depth: -16, delay: 0.38 },
  // Small square, bottom right
  { box: "right-[6%] bottom-[2%] w-[36%] aspect-square", depth: 22, delay: 0.5 },
];

// Swap: the new photo wipes in from the travel direction while zooming out of a scale-up;
// the old one eases back and dims underneath it.
const swap = {
  enter: (dir: number) => ({
    clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
    scale: 1.25,
    zIndex: 2,
  }),
  center: { clipPath: "inset(0% 0% 0% 0%)", scale: 1, zIndex: 2, filter: "brightness(1)" },
  exit: { zIndex: 1, scale: 1.08, filter: "brightness(0.55)" },
};

function Slot({
  slot,
  slotIndex,
  photo,
  dir,
  play,
  mx,
  my,
}: {
  slot: (typeof SLOTS)[number];
  slotIndex: number;
  photo: Photo;
  dir: number;
  play: boolean;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const x = useTransform(mx, (v) => v * slot.depth);
  const y = useTransform(my, (v) => v * slot.depth);
  return (
    <motion.div style={{ x, y }} className={`absolute ${slot.box}`}>
      {/* First-view reveal */}
      <motion.div
        initial={{ clipPath: "inset(100% 0 0 0 round 18px)" }}
        animate={play ? { clipPath: "inset(0% 0 0 0 round 18px)" } : undefined}
        transition={{ duration: 1.2, ease: EASE, delay: slot.delay }}
        className="group relative h-full w-full overflow-hidden rounded-[18px] bg-foreground shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/5"
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={photo.src}
            custom={dir}
            variants={swap}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.1, ease: EASE, delay: slotIndex * 0.09 }}
            className="absolute inset-0"
          >
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 22vw, 50vw"
              className={`object-cover ${photo.pos} transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]`}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/** Layered photo collage with the code card in front; layers drift with the cursor. */
export default function HeroCollage({
  play,
  mx,
  my,
  rotateX,
  rotateY,
}: {
  play: boolean;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
}) {
  const cardX = useTransform(mx, (v) => v * -8);
  const cardY = useTransform(my, (v) => v * -8);
  const [[index, dir], setState] = useState([0, 1]);
  const n = SETS.length;
  const go = (d: number) => setState(([i]) => [(i + d + n) % n, d]);

  return (
    <div className="relative flex flex-col lg:block">
      <div aria-hidden className="relative h-[420px] sm:h-[520px] lg:h-[560px]">
        {SLOTS.map((s, si) => (
          <Slot
            key={si}
            slot={s}
            slotIndex={si}
            photo={SETS[index].photos[si]}
            dir={dir}
            play={play}
            mx={mx}
            my={my}
          />
        ))}
      </div>

      {/* Photo controls, top left above the left frame */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={play ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
        // Phones: below the collage and code card. Desktop: top-left over the collage.
        className="order-last mt-6 flex flex-wrap items-center gap-2 lg:absolute lg:top-0 lg:left-0 lg:z-20 lg:mt-0"
      >
        {[
          { d: -1, label: "Previous photos", Icon: ArrowLeft },
          { d: 1, label: "Next photos", Icon: ArrowRight },
        ].map(({ d, label, Icon }) => (
          <button
            key={d}
            type="button"
            onClick={() => go(d)}
            aria-label={label}
            className="group/nav relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-background text-foreground transition-colors duration-300 hover:border-foreground hover:text-background"
          >
            <span className="absolute inset-0 scale-0 rounded-full bg-foreground transition-transform duration-500 ease-out-expo group-hover/nav:scale-100" />
            <Icon
              className={`relative h-4 w-4 transition-transform duration-500 ease-out-expo ${
                d > 0 ? "group-hover/nav:translate-x-0.5" : "group-hover/nav:-translate-x-0.5"
              }`}
            />
          </button>
        ))}
        <span className="ml-1 flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase tabular-nums" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          <span className="h-px w-4 bg-border" aria-hidden />
          <span className="relative inline-flex overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={SETS[index].label}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="whitespace-nowrap"
              >
                {SETS[index].label}
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
      </motion.div>

      {/* Code card overlapping the lower-left of the collage */}
      <motion.div
        aria-hidden
        style={{ x: cardX, y: cardY }}
        className="relative z-10 -mt-40 w-[92%] sm:-mt-48 sm:w-[78%] lg:absolute lg:bottom-[-6%] lg:left-[-3%] lg:mt-0 lg:w-[80%]"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease: EASE, delay: 0.7 }}
        >
          <CodeCard play={play} rotateX={rotateX} rotateY={rotateY} />
        </motion.div>
      </motion.div>
    </div>
  );
}
