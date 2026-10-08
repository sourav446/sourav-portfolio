"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, FileText, Github, Linkedin, Mail } from "lucide-react";
import { resumeClick } from "@/components/ResumeModal";
import { navLinks, profile } from "@/lib/content";
import { EASE } from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import { openContact } from "@/components/Contact";
import { whenIntroDone } from "@/components/Intro";
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
    // Sections below the hero are lazy-mounted after the intro, so pick them up as they appear.
    const seen = new Set<string>();
    const observeNew = () => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && !seen.has(id)) {
          seen.add(id);
          observer.observe(el);
        }
      });
      if (seen.size === ids.length) mutations.disconnect();
    };
    const mutations = new MutationObserver(observeNew);
    mutations.observe(document.body, { childList: true, subtree: true });
    observeNew();
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
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
  const { scrollY, scrollYProgress } = useScroll();
  // Logo ring: fills with page progress, smoothed so it glides rather than ticks.
  const ring = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  // Logo coin: desktop flips on hover; touch screens flip once on their own after load.
  const [coinFlipped, setCoinFlipped] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let back: ReturnType<typeof setTimeout>;
    let flip: ReturnType<typeof setTimeout>;
    // Wait for the intro, whose name lands in this coin, before flipping it.
    const stop = whenIntroDone(() => {
      flip = setTimeout(() => {
        setCoinFlipped(true);
        back = setTimeout(() => setCoinFlipped(false), 2600);
      }, 1800);
    });
    return () => {
      stop();
      clearTimeout(flip);
      clearTimeout(back);
    };
  }, []);
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
            className={`group/logo pointer-events-auto flex h-11 items-center gap-2 rounded-full pr-4 pl-1 transition-colors duration-500 ${
              open ? "text-background" : glass
            }`}
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
              {/* Scroll-progress ring around the initials */}
              <svg aria-hidden viewBox="0 0 44 44" className="pointer-events-none absolute -inset-[4px] h-[44px] w-[44px] -rotate-90">
                <circle cx="22" cy="22" r="20.5" fill="none" strokeWidth="1.5" className="stroke-foreground/10" />
                <motion.circle
                  cx="22"
                  cy="22"
                  r="20.5"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="stroke-accent"
                  style={{ pathLength: ring }}
                />
              </svg>
              {/* Coin: "SG" on the front, my face on the back */}
              {/* data-intro-target: the intro's full name flies into this coin */}
              <span data-intro-target className="relative h-9 w-9 [perspective:500px]">
                <span
                  className={`relative block h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.34,1.4,0.5,1)] [transform-style:preserve-3d] motion-safe:group-hover/logo:[transform:rotateY(180deg)] ${
                    coinFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  <span
                    data-intro-face
                    className={`absolute inset-0 flex items-center justify-center rounded-full font-display text-sm font-semibold tracking-tight transition-colors duration-500 [backface-visibility:hidden] ${
                      open ? "bg-background text-foreground" : "bg-foreground text-background"
                    }`}
                  >
                    SG
                  </span>
                  <span className="absolute inset-0 overflow-hidden rounded-full bg-[#fbe6da] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/Images/sourav-avatar.webp" alt="" width={36} height={36} className="h-full w-full object-cover" />
                  </span>
                </span>
              </span>
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
                onClick={resumeClick}
                fillClass="bg-foreground"
                className="h-11 bg-accent px-5 text-[13px] font-medium text-accent-foreground"
              >
                Résumé
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
            className="fixed inset-x-0 top-0 z-40 flex h-[100dvh] flex-col overflow-y-auto bg-foreground px-5 pt-24 pb-8 text-background sm:px-8 lg:hidden"
          >
            <ul className="divide-y divide-background/10 border-y border-background/10">
              {navLinks.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.a
                    href={link.href}
                    onClick={(e) => contactClick(e, link.href, () => setOpen(false))}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 }}
                    className="group/m flex items-center gap-4 py-3.5 font-display text-[26px] font-medium tracking-[-0.03em] sm:text-3xl"
                  >
                    <span className="font-mono text-[11px] tracking-normal opacity-50">
                      0{i + 1}
                    </span>
                    {link.label}
                    <ArrowUpRight className="ml-auto h-4 w-4 opacity-40 transition-opacity group-active/m:opacity-100" />
                  </motion.a>
                </li>
              ))}
            </ul>
            <a
              href={profile.resume}
              onClick={(e) => {
                setOpen(false);
                resumeClick(e);
              }}
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-background text-sm font-medium text-foreground"
            >
              <FileText className="h-4 w-4" /> View résumé
            </a>
            {/* Socials: right under the résumé so the phone's browser bar can never hide them */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: "LinkedIn", href: profile.linkedin, Icon: Linkedin, external: true },
                { label: "GitHub", href: profile.github, Icon: Github, external: true },
                { label: "Email", href: `mailto:${profile.email}`, Icon: Mail, external: false },
              ].map(({ label, href, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-background/20 text-[13px] font-medium transition-colors active:bg-background/10"
                >
                  <Icon className="h-4 w-4" /> {label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
