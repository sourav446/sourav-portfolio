"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls, useReducedMotion, type PanInfo } from "framer-motion";
import { Download, ExternalLink, FileText, Loader2, X } from "lucide-react";
import { profile } from "@/lib/content";
import { EASE } from "@/components/motion/Reveal";
import { useMediaQuery } from "@/components/motion/useMediaQuery";

const OPEN_EVENT = "resume:open";
const FILE_NAME = "Sourav-Gokul-V-Resume.pdf";

/** Opens the résumé popup from anywhere (hero, menu, contact, footer). */
export function openResume() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/** onClick for links that point at the PDF: open the popup instead of a new tab. */
export function resumeClick(e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  openResume();
}

/**
 * Renders the PDF pages to canvases with pdf.js — works on every device (phones can't show
 * PDFs in an iframe). pdf.js is imported only when the popup opens, so it costs nothing on load.
 */
function PdfPages({ url }: { url: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const doc = await pdfjs.getDocument(url).promise;
        if (cancelled) return;

        const render = async () => {
          const box = boxRef.current;
          if (!box) return;
          const width = box.clientWidth;
          const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
          const canvases: HTMLCanvasElement[] = [];
          for (let n = 1; n <= doc.numPages; n++) {
            const page = await doc.getPage(n);
            const base = page.getViewport({ scale: 1 });
            const viewport = page.getViewport({ scale: (width / base.width) * dpr });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.width = "100%";
            canvas.className = "block rounded-lg bg-white shadow-[0_20px_50px_-25px_rgba(0,0,0,0.35)] ring-1 ring-black/5";
            canvas.setAttribute("aria-label", `Résumé page ${n}`);
            await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
            canvases.push(canvas);
          }
          if (cancelled || !boxRef.current) return;
          boxRef.current.replaceChildren(...canvases);
          setState("ready");
        };

        await render();
        // Re-render sharply after resizes (rotation, window changes).
        let t: ReturnType<typeof setTimeout>;
        const onResize = () => {
          clearTimeout(t);
          t = setTimeout(render, 250);
        };
        window.addEventListener("resize", onResize);
        cleanup = () => {
          window.removeEventListener("resize", onResize);
          clearTimeout(t);
          doc.destroy();
        };
      } catch {
        if (!cancelled) setState("error");
      }
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [url]);

  return (
    <div className="relative">
      <div ref={boxRef} className="space-y-4" />
      {state === "loading" && (
        <div className="flex aspect-[1/1.414] w-full flex-col items-center justify-center gap-3 rounded-lg bg-card ring-1 ring-border">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">Loading résumé…</p>
        </div>
      )}
      {state === "error" && (
        <div className="flex aspect-[1/1.414] w-full flex-col items-center justify-center gap-3 rounded-lg bg-card p-6 text-center ring-1 ring-border">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">The preview couldn&apos;t load here — download the PDF instead.</p>
          <a href={url} download={FILE_NAME} className="text-sm font-medium text-accent underline underline-offset-4">
            Download résumé
          </a>
        </div>
      )}
    </div>
  );
}

function DownloadButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={profile.resume}
      download={FILE_NAME}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-accent font-medium text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.98] ${className}`}
    >
      <Download className="h-4 w-4" />
      Download PDF
    </a>
  );
}

/**
 * Résumé popup. Desktop/tablet: centred modal. Phones: full-screen sheet that slides up —
 * close with ✕, Esc, or by swiping the top bar down (like iOS sheets).
 */
export default function ResumeModal() {
  const [open, setOpen] = useState(false);
  const isPhone = useMediaQuery("(max-width: 767px)");
  const reduce = useReducedMotion();
  const dragControls = useDragControls();
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpen = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus?.();
  }, []);

  // Esc to close, lock the page behind.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, close]);

  // Swipe down past ~120px (or flick) to dismiss.
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) close();
  };

  const header = (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <FileText className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p id="resume-title" className="font-display text-lg leading-tight font-medium tracking-[-0.02em]">
          Résumé
        </p>
        <p className="truncate font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
          {profile.name} · PDF
        </p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="resume"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-title"
          className="fixed inset-0 z-[95]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label="Close résumé"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 cursor-default bg-foreground/60"
          />

          {isPhone ? (
            /* ── Phones: full-screen sheet ── */
            <motion.div
              data-lenis-prevent
              drag={reduce ? false : "y"}
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.7 }}
              onDragEnd={onDragEnd}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 380, damping: 40, mass: 0.9 }}
              className="absolute inset-x-0 top-2 bottom-0 flex flex-col overflow-hidden rounded-t-[22px] bg-background shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.5)]"
            >
              {/* Drag zone: grab handle + header */}
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="shrink-0 touch-none border-b border-border px-4 pt-2 pb-3 select-none"
              >
                <span aria-hidden className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-foreground/20" />
                <div className="flex items-center gap-2">
                  {header}
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    onPointerDown={(e) => e.stopPropagation()}
                    aria-label="Close résumé"
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#ece9e4] p-3">
                <PdfPages url={profile.resume} />
                <p className="mt-3 text-center font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  Swipe down to close
                </p>
              </div>

              <div className="shrink-0 border-t border-border bg-background p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <DownloadButton className="h-12 w-full text-[15px]" />
              </div>
            </motion.div>
          ) : (
            /* ── Tablet / desktop: centred modal ── */
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 md:p-8">
              <motion.div
                data-lenis-prevent
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.97 }}
                transition={{ duration: reduce ? 0.2 : 0.55, ease: EASE }}
                className="pointer-events-auto flex h-[min(92svh,1100px)] w-full max-w-[860px] flex-col overflow-hidden rounded-2xl bg-background shadow-[0_40px_120px_-30px_rgba(0,0,0,0.55)] ring-1 ring-black/10"
              >
                <div className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-4">
                  {header}
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open in a new tab"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <DownloadButton className="h-10 px-5 text-sm" />
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    aria-label="Close résumé"
                    className="group/x flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    <X className="h-4 w-4 transition-transform duration-300 group-hover/x:rotate-90" />
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#ece9e4] p-4 md:p-8">
                  <div className="mx-auto max-w-[720px]">
                    <PdfPages url={profile.resume} />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
