"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { navLinks, profile } from "@/lib/content";
import { EASE } from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import { openContact } from "@/components/Contact";
import FillButton from "@/components/motion/FillButton";

/** Which section is currently in the middle band of the viewport. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return active;
}

// Solid (not backdrop-blurred): a blur behind fixed elements is recomputed on every scroll frame.
const glass = "border border-border/80 bg-background/95";

/** "Contact" opens the contact panel instead of jumping to the footer. */
function contactClick(e: React.MouseEvent, href: string, after?: () => void) {
  if (href !== "#contact") return after?.();
  e.preventDefault();
  e.stopPropagation(); // keep Lenis from also scrolling to the footer
  after?.();
  openContact();
}


export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const { scrollY } = useScroll();
  // "top" is observed too, so scrolling back into the hero clears the highlight.
  const active = useActiveSection(["top", ...navLinks.map((l) => l.href.slice(1))]);

  // Once the big hero name has scrolled away, the monogram expands to the full name.
  useMotionValueEvent(scrollY, "change", (y) => setPastHero(y > window.innerHeight * 0.45));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <nav
          className="shell relative flex h-20 items-center justify-between"
          aria-label="Primary"
        >
          {/* Monogram → full name */}
          <a
            href="#top"
            aria-label={`${profile.name} — back to top`}
            className={`pointer-events-auto flex h-11 items-center gap-2 rounded-full pr-4 pl-1 transition-colors duration-500 ${
              open ? "text-background" : glass
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-semibold tracking-tight transition-colors duration-500 ${
                open ? "bg-background text-foreground" : "bg-foreground text-background"
              }`}
            >
              SG
            </span>
            <span className="relative overflow-hidden font-display text-[15px] font-medium tracking-tight whitespace-nowrap">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={pastHero ? "name" : "short"}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="block"
                >
                  {pastHero ? (
                    <>
                      Sourav Gokul V<span className="text-accent">.</span>
                    </>
                  ) : (
                    "Portfolio"
                  )}
                </motion.span>
              </AnimatePresence>
            </span>
          </a>

          {/* Centered pill with a sliding active-section highlight */}
          <ul
            className={`pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full p-1 lg:flex ${glass}`}
          >
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.href} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-foreground"
                    />
                  )}
                  <a
                    href={link.href}
                    onClick={(e) => contactClick(e, link.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative block rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                      isActive ? "text-background" : "hover:text-accent"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Status + résumé */}
          <div className="pointer-events-auto hidden items-center gap-2 lg:flex">
            <span className={`hidden h-11 items-center gap-2 rounded-full px-4 xl:flex ${glass}`}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="text-[13px] font-medium">Available</span>
            </span>
            <Magnetic strength={0.3}>
              <FillButton
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                fillClass="bg-foreground"
                className="h-11 bg-accent px-5 text-[13px] font-medium text-accent-foreground"
              >
                Résumé ↗
              </FillButton>
            </Magnetic>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`pointer-events-auto flex h-11 items-center rounded-full px-5 text-[13px] font-medium transition-colors lg:hidden ${
              open ? "bg-background text-foreground" : glass
            }`}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col bg-foreground px-5 pt-28 pb-8 text-background sm:px-8 lg:hidden"
          >
            <ul className="space-y-1">
              {navLinks.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.a
                    href={link.href}
                    onClick={(e) => contactClick(e, link.href, () => setOpen(false))}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 }}
                    className="flex items-baseline gap-4 font-display text-5xl font-medium tracking-[-0.04em]"
                  >
                    <span className="font-mono text-[11px] tracking-normal opacity-50">
                      0{i + 1}
                    </span>
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-background text-sm font-medium text-foreground"
            >
              View résumé
            </a>
            <div className="mt-auto flex justify-between pt-8 font-mono text-[11px] uppercase tracking-[0.14em] opacity-60">
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a href={`mailto:${profile.email}`}>Email ↗</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
