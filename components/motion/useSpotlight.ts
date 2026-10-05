"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useFinePointer } from "./useFinePointer";

/**
 * Cursor spotlight + optional 3D tilt for a card.
 * Writes --x/--y (cursor position inside the element) for the `.spotlight` CSS layers,
 * and returns springy rotateX/rotateY for framer's `style`.
 */
export function useSpotlight(maxTilt = 0) {
  const enabled = useFinePointer();
  const spring = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    e.currentTarget.style.setProperty("--x", `${x}px`);
    e.currentTarget.style.setProperty("--y", `${y}px`);
    if (!enabled || !maxTilt) return;
    rotateY.set((x / r.width - 0.5) * 2 * maxTilt);
    rotateX.set(-(y / r.height - 0.5) * 2 * maxTilt);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return {
    handlers: { onPointerMove, onPointerLeave },
    tiltStyle: enabled && maxTilt ? { rotateX, rotateY, transformPerspective: 1100 } : {},
  };
}
