"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
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

/** Email address card that copies itself (falls back to the mail app if the clipboard is blocked). */
function EmailCard() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-background/[0.06] p-2 pl-4 ring-1 ring-background/10">
      <a href={`mailto:${profile.email}`} className="min-w-0 flex-1 py-1.5">
        <span className="block font-mono text-[10px] tracking-[0.14em] text-background/45 uppercase">Email</span>
        <span className="block truncate text-[15px] font-medium">{profile.email}</span>
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        className="flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-background/10 px-3.5 text-[13px] font-medium transition-colors active:bg-background/20"
      >
        {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/** One row in the links panel: label + arrow, full-width tap target. */
function LinkRow({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="flex items-center justify-between py-2.5 text-[15px] transition-colors active:text-accent"
      >
        {label}
        <ArrowUpRight className="h-4 w-4 text-background/40" />
      </a>
    </li>
  );
}

/**
 * Phones: a compact, product-style footer — CTA, email card, links panel, info strip.
 * Natural height (no full-screen stretch), so there are no empty bands.
 */
function MobileFooter() {
  const explore = navLinks.filter((l) => l.href !== "#contact");
  return (
    <div className="shell relative pt-14 pb-8 md:hidden">
      {/* CTA */}
      <motion.div {...rise()}>
        <span className="inline-flex items-center gap-2 rounded-full bg-background/[0.06] px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-background/70 uppercase ring-1 ring-background/10">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Open to frontend &amp; MERN roles
        </span>
        <h2 className="mt-5 font-display text-[40px] leading-[1] font-medium tracking-[-0.045em]">
          Have a role in mind?
          <span className="mt-1 block font-serif text-[36px] font-normal tracking-[-0.02em] text-[hsl(18_90%_68%)] italic">
            Let&apos;s build it together.
          </span>
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-background/60">
          Tell me about the team and what you&apos;re building — I&apos;d love to hear about it.
        </p>
      </motion.div>

      <motion.div {...rise(0.1)} className="mt-6 space-y-3">
        <button
          type="button"
          onClick={openContact}
          className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent text-[15px] font-medium text-white shadow-[0_18px_40px_-16px_hsl(18_100%_50%/0.7)] transition-transform active:scale-[0.98]"
        >
          Get in touch <ArrowUpRight className="h-5 w-5" />
        </button>
        <EmailCard />
      </motion.div>

      {/* Links panel */}
      <motion.div
        {...rise(0.15)}
        className="mt-8 grid grid-cols-2 gap-x-6 rounded-3xl bg-background/[0.04] px-5 py-4 ring-1 ring-background/10"
      >
        <div>
          <p className="pt-1 pb-1.5 font-mono text-[10px] tracking-[0.14em] text-background/45 uppercase">Explore</p>
          <ul className="divide-y divide-background/[0.07]">
            {explore.map((l) => (
              <LinkRow key={l.href} href={l.href} label={l.label} />
            ))}
          </ul>
        </div>
        <div>
          <p className="pt-1 pb-1.5 font-mono text-[10px] tracking-[0.14em] text-background/45 uppercase">Connect</p>
          <ul className="divide-y divide-background/[0.07]">
            <LinkRow href={profile.linkedin} label="LinkedIn" external />
            <LinkRow href={profile.github} label="GitHub" external />
            <LinkRow href={profile.resume} label="Résumé" external />
            <LinkRow href={`mailto:${profile.email}`} label="Email" />
          </ul>
        </div>
      </motion.div>

      {/* Info strip */}
      <motion.div {...rise(0.2)} className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-[15px] font-medium">{profile.location}</p>
          <p className="mt-0.5 font-mono text-[12px] text-background/55">
            <LocalTime timeZone={profile.timeZone} /> · local time
          </p>
        </div>
        <a
          href="#top"
          aria-label="Back to top"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-foreground transition-transform active:scale-95"
        >
          <ArrowUp className="h-5 w-5" />
        </a>
      </motion.div>

      {/* Bottom bar */}
      <div className="mt-8 flex items-center justify-between border-t border-background/10 pt-5 font-mono text-[10px] tracking-[0.12em] text-background/45 uppercase">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>
          Built by <span className="text-background">Sourav</span>
          <span className="text-accent">.</span>
        </span>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="relative scroll-mt-0 overflow-hidden bg-foreground text-background md:flex md:min-h-[100svh] md:flex-col">
      {/* Soft peach glow behind the call to action (gradient only — no blur filter) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[30%] left-1/2 h-[70%] w-[90%] -translate-x-1/2 bg-[radial-gradient(closest-side,hsl(18_100%_60%/0.16),transparent)]"
      />

      <MobileFooter />

      {/* Tablet and desktop: one full screen */}
      <div className="shell relative hidden w-full flex-1 flex-col pt-20 md:flex md:pt-[max(6rem,13svh)]">
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
            <Magnetic className="w-full md:w-auto">
              <FillButton
                type="button"
                onClick={openContact}
                fillClass="bg-background"
                className="h-14 w-full cursor-pointer bg-accent text-[15px] font-medium text-white transition-colors duration-500 hover:text-foreground md:h-[min(11rem,19svh)] md:w-[min(11rem,19svh)] md:text-sm"
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
