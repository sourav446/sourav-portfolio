"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { navLinks, profile } from "@/lib/content";
import LocalTime from "@/components/motion/LocalTime";
import { EASE } from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import FillButton from "@/components/motion/FillButton";
import { openContact } from "@/components/Contact";

const SOCIALS = [
  { label: "LinkedIn", href: profile.linkedin, external: true },
  { label: "GitHub", href: profile.github, external: true },
  { label: "Email", href: `mailto:${profile.email}`, external: false },
  { label: "Résumé", href: profile.resume, external: true },
];

/** Link whose label slides up and is replaced by an accent copy on hover. */
function RollLink({ href, children, external }: { href: string; children: string; external?: boolean }) {
  return (
    <a
      href={href}
      onClick={
        href === "#contact"
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
              openContact();
            }
          : undefined
      }
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group/roll inline-flex items-center gap-2 py-[min(0.25rem,0.4svh)]"
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover/roll:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full text-accent transition-transform duration-500 ease-out-expo group-hover/roll:translate-y-0"
        >
          {children}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden
        className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-500 ease-out-expo group-hover/roll:translate-x-0 group-hover/roll:text-accent group-hover/roll:opacity-100"
      />
    </a>
  );
}

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -10% 0px" },
  transition: { duration: 0.9, ease: EASE, delay },
});

export default function Footer() {
  return (
    <footer id="contact" className="relative flex min-h-[100svh] scroll-mt-0 flex-col overflow-hidden bg-foreground text-background">
      {/* Soft peach glow behind the call to action (gradient only — no blur filter) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[30%] left-1/2 h-[70%] w-[90%] -translate-x-1/2 bg-[radial-gradient(closest-side,hsl(18_100%_60%/0.16),transparent)]"
      />

      <div className="shell relative flex w-full flex-1 flex-col pt-20 md:pt-[max(6rem,13svh)]">
        {/* Call to action */}
        <div className="grid-12 items-end gap-y-6 md:gap-y-10">
          <motion.div {...rise()} className="col-span-4 md:col-span-8">
            <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-background/60 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-accent" />
              </span>
              Open to frontend &amp; MERN stack roles
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,min(6vw,8.5svh),5.75rem)] leading-[0.98] font-medium tracking-[-0.045em]">
              Have a role in mind?
              <br />
              <span className="font-serif font-normal tracking-[-0.02em] text-[hsl(18_90%_68%)] italic">
                Let&apos;s build it together.
              </span>
            </h2>
          </motion.div>

          <motion.div {...rise(0.15)} className="col-span-4 md:col-span-4 md:justify-self-end">
            <Magnetic>
              <FillButton
                type="button"
                onClick={openContact}
                fillClass="bg-background"
                className="h-28 w-28 cursor-pointer bg-accent text-sm font-medium text-white transition-colors duration-500 hover:text-foreground md:h-[min(11rem,19svh)] md:w-[min(11rem,19svh)]"
              >
                Get in touch
                <ArrowUpRight className="h-5 w-5 transition-transform duration-500 ease-out-expo group-hover/fill:rotate-45" />
              </FillButton>
            </Magnetic>
          </motion.div>
        </div>

        {/* Email */}
        <motion.a
          {...rise(0.1)}
          href={`mailto:${profile.email}`}
          className="group/mail mt-[min(2rem,3.5svh)] mb-[min(2.5rem,4svh)] inline-flex self-start items-center gap-3 font-display text-[clamp(1.4rem,3vw,2.4rem)] font-medium tracking-[-0.03em]"
        >
          <span className="relative">
            {profile.email}
            <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-background/30 transition-transform duration-700 ease-out-expo group-hover/mail:origin-left group-hover/mail:scale-x-0" />
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform delay-150 duration-700 ease-out-expo group-hover/mail:scale-x-100" />
          </span>
          <ArrowUpRight className="h-6 w-6 text-accent transition-transform duration-500 ease-out-expo group-hover/mail:translate-x-1 group-hover/mail:-translate-y-1" />
        </motion.a>

        {/* Link columns */}
        <div className="grid-12 mt-auto gap-y-8 border-t border-background/15 pt-8">
          <motion.div {...rise()} className="hidden md:col-span-3 md:block">
            <p className="mb-4 font-mono text-[11px] tracking-[0.14em] text-background/50 uppercase">Index</p>
            <ul className="space-y-1 text-[15px]">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <RollLink href={l.href}>{l.label}</RollLink>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...rise(0.08)} className="col-span-2 md:col-span-3">
            <p className="mb-4 font-mono text-[11px] tracking-[0.14em] text-background/50 uppercase">Elsewhere</p>
            <ul className="space-y-1 text-[15px]">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <RollLink href={s.href} external={s.external}>
                    {s.label}
                  </RollLink>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...rise(0.16)} className="col-span-2 md:col-span-3">
            <p className="mb-4 font-mono text-[11px] tracking-[0.14em] text-background/50 uppercase">Based in</p>
            <p className="text-[15px]">{profile.location}</p>
            <p className="mt-1 font-mono text-[13px] text-background/60">
              <LocalTime timeZone={profile.timeZone} />
            </p>
          </motion.div>

          <motion.div {...rise(0.24)} className="hidden md:col-span-3 md:flex md:justify-end">
            <Magnetic>
              <a
                href="#top"
                aria-label="Back to top"
                className="group/top flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-background/25 transition-colors duration-500 hover:border-accent hover:bg-accent"
              >
                <span className="relative block h-5 w-5 overflow-hidden">
                  <ArrowUp className="absolute inset-0 h-5 w-5 transition-transform duration-500 ease-out-expo group-hover/top:-translate-y-6" />
                  <ArrowUp className="absolute inset-0 h-5 w-5 translate-y-6 transition-transform duration-500 ease-out-expo group-hover/top:translate-y-0" />
                </span>
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-background/15 py-6 font-mono text-[11px] tracking-[0.14em] uppercase md:flex-row md:items-center md:justify-between">
          <span className="text-background/50">
            © {new Date().getFullYear()} {profile.name}
          </span>

          <span className="text-background/50">
            Designed &amp; built by <span className="text-background">{profile.name}</span>
            <span className="text-accent">.</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
