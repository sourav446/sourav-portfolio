"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Award, X } from "lucide-react";
import { FiEye } from "react-icons/fi";
import { EASE } from "@/components/motion/Reveal";

const CERTIFICATE = "/Images/future-ux-star-certificate.webp";

/** Award badge; clicking it spins the certificate into view. */
export default function AwardButton({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [missing, setMissing] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  // Esc to close, lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        className="group mt-5 inline-flex items-center gap-2 rounded-full bg-[#fbe6da] px-4 py-2 text-sm font-medium cursor-pointer transition-transform duration-300 ease-out-expo hover:-translate-y-0.5"
      >
        <Award className="h-4 w-4 text-accent" aria-hidden />
        {label}
        <FiEye
          className="h-4 w-4 text-foreground/50 transition-colors group-hover:text-accent"
          aria-hidden
        />
        <span className="sr-only">— view certificate</span>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="award"
                role="dialog"
                aria-modal="true"
                aria-label={`${label} certificate`}
                data-lenis-prevent
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  type="button"
                  aria-label="Close"
                  tabIndex={-1}
                  onClick={close}
                  className="absolute inset-0 cursor-default bg-foreground/70"
                />

                <div className="relative [perspective:1600px]">
                  <motion.figure
                    className="relative max-h-[86svh] overflow-hidden rounded-xl bg-card shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)]"
                    initial={reduce ? { opacity: 0 } : { rotateY: -720, rotateZ: -12, scale: 0.2, opacity: 0 }}
                    animate={{ rotateY: 0, rotateZ: 0, scale: 1, opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { rotateY: 360, scale: 0.3, opacity: 0 }}
                    transition={{ duration: reduce ? 0.2 : 1.1, ease: EASE }}
                  >
                    {missing ? (
                      <div className="flex h-[60svh] w-[min(440px,86vw)] flex-col items-center justify-center gap-3 p-8 text-center">
                        <Award className="h-10 w-10 text-accent" aria-hidden />
                        <p className="font-display text-2xl font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">Aim Window Info Tech · June 2025</p>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={CERTIFICATE}
                        alt={`${label} — certificate of appreciation from Aim Window Info Tech`}
                        onError={() => setMissing(true)}
                        className="block max-h-[86svh] w-auto max-w-[90vw]"
                      />
                    )}
                  </motion.figure>

                  <button
                    ref={closeBtn}
                    type="button"
                    onClick={close}
                    aria-label="Close certificate"
                    className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-lg transition-transform duration-300 hover:rotate-90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
