"use client";

import { useEffect, useState } from "react";

/**
 * True only for a real mouse/trackpad on a device that can hover, and when the
 * visitor hasn't asked for reduced motion. Cursor-reactive effects gate on this,
 * so touch screens and reduced-motion users get the static page.
 */
export function useFinePointer() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  return enabled;
}
