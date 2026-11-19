"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { profile, type CaseStudy, type Project } from "@/lib/content";
import { EASE } from "@/components/motion/Reveal";
import LiveClassVisual from "@/components/LiveClassVisual";
import StoreVisual from "@/components/StoreVisual";
import { LmsVisual, PmtVisual } from "@/components/ProjectMocks";

/*
 * A project's full case study (/work/<slug>). Everything shown comes from lib/content.ts — the
 * project card (summary, role, highlights, tech, stat) and its case study (title, result, the
 * three key decisions, stack) — so the page never says more than the portfolio already claims.
 */

const TINTS: Record<Project["visual"], string> = {
  webrtc: "#fbe6da",
  store: "#e7ebf6",
  lms: "#e6eefb",
  pmt: "#ece8e1",
};

function Visual({ p }: { p: Project }) {
  switch (p.visual) {
    case "webrtc":
      return <LiveClassVisual />;
    case "store":
      return <StoreVisual />;
    case "lms":
      return <LmsVisual />;
    case "pmt":
      return <PmtVisual />;
  }
}

/** Fades a block up as it scrolls into view. */
function In({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** One section: a small label on the left, the content on the right (stacked on phones). */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <In className="grid gap-4 border-t border-border py-10 md:grid-cols-[200px_1fr] md:gap-10 md:py-14">
      <h2 className="label pt-1">{label}</h2>
      <div>{children}</div>
    </In>
  );
}

export default function CaseStudyView({
  index,
  total,
  project: p,
  study,
  next,
}: {
  index: number;
  total: number;
  project: Project;
  study: CaseStudy;
  next: { slug: string; title: string };
}) {
  const [owner, ...rest] = p.role.split(" — ");
  return (
    <main className="min-h-[100svh] bg-background text-foreground">
      {/* Top bar */}
      <header className="shell flex h-20 items-center justify-between">
        <a
          href="/#projects"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          All projects
        </a>
        <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          Case study · {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </header>

      <article className="shell pb-20">
        {/* Hero */}
        <In className="pt-8 md:pt-14">
          <p className="label">{p.domain}</p>
          <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(2.2rem,5.5vw,4.4rem)] leading-[1.02] font-medium tracking-[-0.04em]">
            {study.title}
          </h1>
          <p className="mt-4 font-serif text-[clamp(1.3rem,2.4vw,1.9rem)] text-[hsl(18_70%_62%)] italic">{p.title}</p>
          <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-muted-foreground">{p.summary}</p>
        </In>

        {/* Facts strip */}
        <In delay={0.1} className="mt-10 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
          <div>
            <p className="label">My role</p>
            <p className="mt-2 text-[15px] font-medium">{owner}</p>
          </div>
          <div>
            <p className="label">Stack</p>
            <p className="mt-2 text-[15px] font-medium">{study.stack.join(" · ")}</p>
          </div>
          <div>
            <p className="label">Headline</p>
            <p className="mt-2 text-[15px] font-medium">
              <span className="text-accent">{p.stat.value}</span> {p.stat.label}
            </p>
          </div>
        </In>

        {/* Live demo */}
        <In delay={0.15} className="mt-10 overflow-hidden rounded-[28px] p-3 md:p-6" >
          <div className="rounded-[22px] p-3 md:p-6" style={{ background: TINTS[p.visual] }}>
            <Visual p={p} />
          </div>
        </In>

        <div className="mt-10">
          <Section label="My role">
            <p className="max-w-[62ch] text-[17px] leading-relaxed">
              <span className="font-medium">{owner}</span>
              {rest.length > 0 && <span className="text-muted-foreground"> — {rest.join(" — ")}</span>}
            </p>
          </Section>

          {p.slug === "live-classroom" && (
            <Section label="Architecture">
              <LiveClassArchitecture />
            </Section>
          )}

          <Section label="Key decisions">
            <ol className="space-y-6">
              {study.approach.map((a, i) => (
                <li key={a} className="grid grid-cols-[44px_1fr] gap-3">
                  <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <p className="max-w-[60ch] text-[17px] leading-relaxed">{a}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section label="What I built">
            <ul className="grid gap-3 sm:grid-cols-2">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 rounded-2xl border border-border bg-card p-4 text-[15px] leading-snug">
                  <span className="mt-[0.55em] h-px w-3 shrink-0 bg-accent" />
                  {h}
                </li>
              ))}
            </ul>
          </Section>

          <Section label="Result">
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <p className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-none font-medium tracking-[-0.05em] text-accent">
                {study.result.value}
              </p>
              <p className="mt-3 text-lg font-medium">{study.result.label}</p>
              <p className="mt-1 text-muted-foreground">{study.result.note}</p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech used">
              {p.tech.map((t) => (
                <li key={t} className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[12px]">
                  {t}
                </li>
              ))}
            </ul>
            {p.url && (
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                Visit live site <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </Section>
        </div>

        {/* Talk + next case study */}
        <In className="mt-6 grid gap-4 md:grid-cols-2">
          <a
            href={`mailto:${profile.email}`}
            className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 transition-colors hover:border-foreground md:p-8"
          >
            <span className="label">Hiring for a similar role?</span>
            <span className="mt-6 flex items-center justify-between font-display text-2xl font-medium tracking-[-0.02em]">
              Let&apos;s talk
              <ArrowUpRight className="h-6 w-6 text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </a>
          <a
            href={`/work/${next.slug}`}
            className="group flex flex-col justify-between rounded-3xl bg-foreground p-6 text-background md:p-8"
          >
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase opacity-60">Next case study</span>
            <span className="mt-6 flex items-center justify-between gap-4 font-display text-2xl font-medium tracking-[-0.02em]">
              {next.title}
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform duration-300 group-hover:-rotate-45">
                <ArrowRight className="h-5 w-5" />
              </span>
            </span>
          </a>
        </In>
      </article>
    </main>
  );
}

/**
 * How the live classroom fits together — only the parts named in the project's own write-up:
 * React room UI, the Node.js join/capacity service with HMAC-signed tokens, Redis capacity
 * reservation, the LiveKit SFU (media + signed webhooks) and STUN/TURN.
 */
function LiveClassArchitecture() {
  const box = "fill-card stroke-border";
  const t = "fill-foreground";
  const m = "fill-muted-foreground";
  return (
    <svg viewBox="0 0 640 260" className="h-auto w-full" role="img" aria-labelledby="arch-title">
      <title id="arch-title">
        Browser joins through the Node.js join service, which reserves capacity in Redis and returns a signed token; media
        flows between the browser and the LiveKit SFU, through STUN/TURN when needed; LiveKit webhooks release slots.
      </title>
      <defs>
        <marker id="arch-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" className="fill-muted-foreground" />
        </marker>
      </defs>
      <g fontFamily="inherit" fontSize="13" textAnchor="middle">
        <rect x="10" y="100" width="150" height="62" rx="14" className={box} />
        <text x="85" y="127" className={t} fontWeight="500">Browser</text>
        <text x="85" y="146" className={m} fontSize="11.5">React room UI</text>

        <rect x="245" y="14" width="170" height="62" rx="14" className="fill-[#fbeee2] stroke-[#efc7a7]" />
        <text x="330" y="41" fill="#8a4a22" fontWeight="500">Node.js join service</text>
        <text x="330" y="60" fill="#b0743f" fontSize="11.5">HMAC-signed join tokens</text>

        <rect x="470" y="14" width="160" height="62" rx="14" className={box} />
        <text x="550" y="41" className={t} fontWeight="500">Redis</text>
        <text x="550" y="60" className={m} fontSize="11.5">atomic capacity reservation</text>

        <rect x="245" y="186" width="170" height="62" rx="14" className="fill-foreground" />
        <text x="330" y="213" className="fill-background" fontWeight="500">LiveKit SFU</text>
        <text x="330" y="232" className="fill-background" opacity="0.7" fontSize="11.5">video, screen share, chat</text>

        <rect x="470" y="186" width="160" height="62" rx="14" className={box} />
        <text x="550" y="213" className={t} fontWeight="500">STUN / TURN</text>
        <text x="550" y="232" className={m} fontSize="11.5">restrictive networks</text>
      </g>
      <g fill="none" strokeWidth="1.3" className="stroke-muted-foreground">
        <path d="M160 118 Q200 60 243 48" markerEnd="url(#arch-ar)" />
        <path d="M415 45 L468 45" markerEnd="url(#arch-ar)" />
        <path d="M160 146 Q200 205 243 214" markerEnd="url(#arch-ar)" markerStart="url(#arch-ar)" />
        <path d="M415 217 L468 217" markerEnd="url(#arch-ar)" markerStart="url(#arch-ar)" />
        <path d="M330 184 L330 78" strokeDasharray="5 4" markerEnd="url(#arch-ar)" />
      </g>
      <g fontSize="11" textAnchor="middle" className="fill-muted-foreground">
        <text x="188" y="66">join</text>
        <text x="442" y="38">reserve</text>
        <text x="186" y="196">WebRTC media</text>
        <text x="392" y="134" textAnchor="start">signed webhooks</text>
        <text x="392" y="149" textAnchor="start">release the slot</text>
      </g>
    </svg>
  );
}
