"use client";

import { FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, FileText, Github, Linkedin, Loader2, Mail, MapPin, X } from "lucide-react";
import { resumeClick } from "@/components/ResumeModal";
import { profile } from "@/lib/content";
import { useContactMutation } from "@/hooks/useContactQuery";
import { EASE } from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import FillButton from "@/components/motion/FillButton";
import { useSpotlight } from "@/components/motion/useSpotlight";

const EMPTY = { name: "", email: "", subject: "", message: "", company: "" };

function Field({
  index,
  label,
  multiline,
  ...props
}: {
  index: string;
  label: string;
  multiline?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const base =
    "peer w-full resize-none border-0 border-b border-input bg-transparent pt-2 pb-3 text-lg outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground focus-visible:outline-none";
  return (
    <div className="group relative">
      <label htmlFor={id} className="label flex gap-3 group-focus-within:!text-foreground">
        <span>{index}</span>
        {label}
      </label>
      {multiline ? (
        <textarea id={id} rows={4} className={base} {...props} />
      ) : (
        <input id={id} className={base} {...props} />
      )}
      {/* Accent underline grows on focus */}
      <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo peer-focus:scale-x-100" />
    </div>
  );
}

/** Email address that copies itself on click, with a small "Copied" toast. */
/** Phones: email card in the details grid — tap to copy. */
function MobileEmailCard() {
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
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email address copied" : `Copy email address ${profile.email}`}
      className="flex min-w-0 cursor-pointer flex-col rounded-2xl border border-border bg-card px-3.5 py-3 text-left active:bg-background"
    >
      <span className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
          {copied ? "Copied" : "Email"}
        </span>
        {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
      </span>
      <span className="mt-2 flex items-center gap-1.5 truncate text-[13px] font-medium">
        <Mail className="h-3.5 w-3.5 shrink-0 text-accent" />
        <span className="truncate">{profile.email}</span>
      </span>
    </button>
  );
}

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked (permissions, insecure context) — fall back to the mail app.
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy email address ${email}`}
        className="group/copy inline-flex items-center gap-1.5 font-medium underline-offset-4 transition-colors hover:text-accent hover:underline"
      >
        {email}
        {copied ? (
          <Check className="h-3.5 w-3.5 text-accent" />
        ) : (
          <Copy className="h-3.5 w-3.5 opacity-50 transition-opacity group-hover/copy:opacity-100" />
        )}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
      <AnimatePresence>
        {copied && (
          <motion.span
            aria-hidden
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="absolute right-0 bottom-full mb-2 rounded-full bg-foreground px-3 py-1 font-mono text-[10px] tracking-[0.12em] whitespace-nowrap text-background uppercase"
          >
            Copied ✓
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

const OPEN_EVENT = "contact:open";

/** Opens the contact panel from anywhere (footer "Get in touch", hero "Let's Talk"). */
export function openContact() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/**
 * Contact panel: slides up over the page when opened with `openContact()`.
 * Mounted once on the page; Esc, the close button or the backdrop close it.
 */
export default function ContactDialog() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

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
    returnFocus.current?.focus();
  }, []);

  // Esc to close, lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="contact"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-title"
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close contact"
            tabIndex={-1}
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 cursor-default bg-foreground/60"
          />

          {/* Panel: rises from the bottom edge with a rounded clip reveal */}
          <motion.div
            data-lenis-prevent
            initial={{ y: "18%", clipPath: "inset(100% 0% 0% 0% round 32px 32px 0 0)" }}
            animate={{ y: "0%", clipPath: "inset(0% 0% 0% 0% round 32px 32px 0 0)" }}
            exit={{ y: "12%", clipPath: "inset(100% 0% 0% 0% round 32px 32px 0 0)" }}
            transition={{ duration: 0.85, ease: EASE }}
            className="absolute inset-x-0 top-[3svh] bottom-0 overflow-y-auto overscroll-contain bg-background md:top-[5svh]"
          >
            <div className="shell relative pt-6 pb-16 md:pt-8 md:pb-20">
              <div className="flex items-center justify-between">
                <p className="label flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Contact
                </p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close contact"
                  className="group/close flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-border transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  <X className="h-5 w-5 transition-transform duration-500 ease-out-expo group-hover/close:rotate-90" />
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              >
                <ContactBody />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContactBody() {
  const [form, setForm] = useState(EMPTY);
  const mutation = useContactMutation();
  const formSpot = useSpotlight(0);

  const set =
    (key: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(form, { onSuccess: () => setForm(EMPTY) });
  };

  return (
    <>
      <div className="grid-12 mt-4 gap-y-6 md:mt-10 md:gap-y-12">
        <div className="col-span-4 flex flex-col gap-5 md:col-span-5 md:gap-8">
          <div>
            <h2 id="contact-title" className="font-display text-[42px] leading-none font-medium tracking-[-0.04em] md:text-7xl">
              Let&apos;s talk<span className="text-accent">.</span>
            </h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground md:mt-4 md:text-base">
              Open to Frontend and MERN stack developer roles. Email me
              directly, or use the form to send a message.
            </p>
          </div>

          <div className="hidden flex-wrap gap-3 md:flex">
            <Magnetic>
              <FillButton
                href={`mailto:${profile.email}`}
                className="h-12 bg-foreground px-6 text-sm font-medium text-background"
              >
                <Mail className="h-4 w-4" /> Email me
              </FillButton>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.resume}
                onClick={resumeClick}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-foreground px-6 text-sm font-medium transition-colors duration-300 hover:bg-foreground hover:text-background"
              >
                <FileText className="h-4 w-4" /> Résumé
              </a>
            </Magnetic>
          </div>

          {/* Phones: personal details as a 2×2 grid */}
          <div className="grid grid-cols-2 gap-2.5 md:hidden">
            <MobileEmailCard />
            {[
              { k: "LinkedIn", v: "souravgokul11", href: profile.linkedin, Icon: Linkedin },
              { k: "GitHub", v: "sourav446", href: profile.github, Icon: Github },
              { k: "Location", v: "Bengaluru, IN", Icon: MapPin },
            ].map(({ k, v, href, Icon }) => {
              const body = (
                <>
                  <span className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">{k}</span>
                    {href ? <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" /> : <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
                  </span>
                  <span className="mt-2 flex items-center gap-1.5 truncate text-[13px] font-medium">
                    {href && <Icon className="h-3.5 w-3.5 shrink-0 text-accent" />}
                    {v}
                  </span>
                </>
              );
              const cls = "flex min-w-0 flex-col rounded-2xl border border-border bg-card px-3.5 py-3";
              return href ? (
                <a key={k} href={href} target="_blank" rel="noreferrer" className={`${cls} active:bg-background`}>
                  {body}
                </a>
              ) : (
                <div key={k} className={cls}>
                  {body}
                </div>
              );
            })}
          </div>

          <dl className="hidden text-sm md:block">
            <div className="flex items-center justify-between gap-4 border-t border-border py-3">
              <dt className="label pt-0.5">Email</dt>
              <dd>
                <CopyEmail email={profile.email} />
              </dd>
            </div>
            {[
              { k: "LinkedIn", v: "in/souravgokul11", href: profile.linkedin },
              { k: "GitHub", v: "sourav446", href: profile.github },
              { k: "Location", v: profile.location },
            ].map((row) => (
              <div key={row.k} className="flex justify-between gap-4 border-t border-border py-3 last:border-b">
                <dt className="label pt-0.5">{row.k}</dt>
                <dd className="font-medium">
                  {row.href ? (
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link inline-flex items-center gap-1 underline-offset-4 transition-colors hover:text-accent hover:underline"
                    >
                      {row.v}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  ) : (
                    row.v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          {...formSpot.handlers}
          className="group relative col-span-4 rounded-2xl border border-border bg-card p-5 md:col-span-7 md:rounded-md md:col-start-6 md:p-8 [&>*:not(.spotlight-surface):not(.spotlight-border)]:relative"
        >
          <span aria-hidden className="spotlight-surface" />
          <span aria-hidden className="spotlight-border" />
          <AnimatePresence mode="wait" initial={false}>
            {mutation.isSuccess ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: EASE }}
                role="status"
                className="flex min-h-[420px] flex-col items-start justify-center gap-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Check className="h-5 w-5" />
                </span>
                <h3 className="font-display text-4xl font-medium tracking-[-0.04em] md:text-5xl">
                  Message received.
                </h3>
                <p className="max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                  Thanks for reaching out — I&apos;ll get back to you by email
                  soon.
                </p>
                <button
                  type="button"
                  onClick={() => mutation.reset()}
                  className="label !text-foreground underline underline-offset-4 hover:!text-accent"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: EASE }}
                onSubmit={handleSubmit}
                aria-busy={mutation.isPending}
                className="space-y-7 md:space-y-10"
              >
                {/* Honeypot: hidden from people and screen readers; bots fill it and get dropped. */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  value={form.company}
                  onChange={set("company")}
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />
                <div className="grid gap-7 sm:grid-cols-2 md:gap-10">
                  <Field
                    index="01"
                    label="Your name"
                    required
                    maxLength={100}
                    autoComplete="name"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Name"
                  />
                  
                  <Field
                    index="02"
                    label="Email"
                    required
                    type="email"
                    maxLength={200}
                    autoComplete="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="Email Address"
                  />
                </div>
                <Field
                  index="03"
                  label="Subject"
                  required
                  maxLength={150}
                  value={form.subject}
                  onChange={set("subject")}
                  placeholder="Frontend role at…"
                />
                <Field
                  index="04"
                  label="Message"
                  multiline
                  required
                  maxLength={5000}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Tell me about the team and what you're building."
                />

                <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div role="alert" className="min-h-5 text-sm">
                    {mutation.isError && (
                      <p className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-destructive">
                        {mutation.error instanceof Error
                          ? mutation.error.message
                          : "Unable to send your message right now."}{" "}
                        <a href={`mailto:${profile.email}`} className="font-medium underline underline-offset-2">
                          Email me instead
                        </a>
                      </p>
                    )}
                  </div>
                  <Magnetic>
                    <FillButton
                      type="submit"
                      disabled={mutation.isPending}
                      className="h-14 gap-3 bg-foreground px-8 text-sm font-medium text-background disabled:cursor-wait disabled:opacity-70"
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Sending
                        </>
                      ) : (
                        <>
                          Send message
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/fill:translate-x-0.5 group-hover/fill:-translate-y-0.5" />
                        </>
                      )}
                    </FillButton>
                  </Magnetic>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
