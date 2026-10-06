"use client";

import { caseStudies } from "@/lib/content";
import { SectionHeader } from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import PinnedPanels from "@/components/motion/PinnedPanels";

// Each panel gets its own surface so the sequence has rhythm: light → ink → peach.
const THEMES = [
  {
    panel: "bg-card border border-border text-foreground",
    muted: "text-muted-foreground",
    rule: "border-border",
    resultBox: "bg-foreground text-background",
    ghost: "text-foreground/[0.04]",
  },
  {
    panel: "bg-foreground text-background",
    muted: "text-background/60",
    rule: "border-background/15",
    resultBox: "bg-background/[0.06] ring-1 ring-background/10 text-background",
    ghost: "text-background/[0.05]",
  },
  {
    panel: "bg-[#fbe6da] text-foreground",
    muted: "text-foreground/60",
    rule: "border-foreground/10",
    resultBox: "bg-foreground text-background",
    ghost: "text-foreground/[0.05]",
  },
];

/** Engineering stories as GSAP pinned panels with overscroll. */
export default function CaseStudies() {
  return (
    <section id="case-studies" className="scroll-mt-20 pb-20 md:pb-28">
      <div className="shell">
        <SectionHeader
          index="03"
          title="Case Studies"
          intro="The engineering decisions behind the work — and what they changed."
        />
      </div>

      <div className="shell mt-10 md:mt-12">
        <PinnedPanels panelClassName={(i) => `rounded-[28px] ${THEMES[i % THEMES.length].panel}`}>
          {caseStudies.map((cs, i) => {
            const t = THEMES[i % THEMES.length];
            const n = String(i + 1).padStart(2, "0");
            return (
              <article key={cs.title} className="relative flex min-h-[calc(100svh-7rem)] flex-col p-6 md:p-10 lg:p-14">
                {/* Oversized case number in the corner */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -right-4 -bottom-10 font-display text-[clamp(10rem,22vw,22rem)] leading-none font-medium tracking-[-0.06em] select-none ${t.ghost}`}
                >
                  {n}
                </span>

                {/* Top row */}
                <div className="relative flex items-center justify-between gap-4">
                  <span className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
                      Case {n}
                    </span>
                    <span className={`h-px w-8 border-t ${t.rule}`} />
                    <span className={`hidden font-mono text-[11px] tracking-[0.14em] uppercase sm:inline ${t.muted}`}>
                      {cs.project}
                    </span>
                  </span>
                  <span className={`shrink-0 font-mono text-[11px] tracking-[0.14em] whitespace-nowrap ${t.muted}`}>
                    {n} / {String(caseStudies.length).padStart(2, "0")}
                  </span>
                </div>
                <p className={`relative mt-2 font-mono text-[11px] tracking-[0.14em] uppercase sm:hidden ${t.muted}`}>
                  {cs.project}
                </p>

                {/* Title */}
                <h3 className="relative mt-6 max-w-4xl font-display text-[clamp(2.2rem,4.6vw,4.6rem)] leading-[1.02] font-medium tracking-[-0.04em]">
                  {cs.title}
                </h3>

                {/* Body */}
                <div className="relative mt-auto grid gap-10 pt-10 md:grid-cols-12 md:gap-8 lg:gap-12">
                  {/* Highlight panel */}
                  <div className="md:col-span-5">
                    <div className={`rounded-2xl p-6 md:p-8 ${t.resultBox}`}>
                      <p className="font-display text-5xl leading-none font-medium tracking-[-0.04em] text-accent md:text-6xl">
                        <CountUp value={cs.result.value} duration={1.6} />
                      </p>
                      <p className="mt-3 text-[17px] font-medium">{cs.result.label}</p>
                      <p className="mt-1 text-sm opacity-70">{cs.result.note}</p>
                    </div>
                  </div>

                  {/* Approach */}
                  <div className="md:col-span-7">
                    <p className={`mb-3 font-mono text-[11px] tracking-[0.14em] uppercase ${t.muted}`}>Approach</p>
                    <ol className="space-y-3">
                      {cs.approach.map((step, k) => (
                        <li key={step} className="flex gap-4 text-[15px] leading-relaxed">
                          <span
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] ${t.rule}`}
                          >
                            {k + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Footer: tech stack */}
                <p className={`relative mt-8 border-t pt-5 font-mono text-[12px] tracking-[0.08em] ${t.rule} ${t.muted}`}>
                  {cs.stack.join(" · ")}
                </p>
              </article>
            );
          })}
        </PinnedPanels>
      </div>
    </section>
  );
}
