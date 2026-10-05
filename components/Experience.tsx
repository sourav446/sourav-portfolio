"use client";

import { motion } from "framer-motion";
import AwardButton from "@/components/AwardButton";
import { experience } from "@/lib/content";
import { FadeIn, SectionHeader, item } from "@/components/motion/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="shell scroll-mt-20 pb-20 md:pb-28">
      <SectionHeader index="05" title="Experience" />

      <div className="mt-10 space-y-5 md:mt-12">
        {experience.map((job) => (
          <div key={job.role} className="rounded-md border border-border bg-card p-6 md:p-8 lg:p-10">
            <FadeIn className="grid-12 gap-y-8">
              {/* Role */}
              <motion.div variants={item} className="col-span-4 md:col-span-4 lg:sticky lg:top-28 lg:self-start">
                <p className="label flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {job.period}
                </p>
                <h3 className="mt-3 font-display text-3xl font-medium tracking-[-0.03em]">{job.role}</h3>
                <p className="mt-1 text-muted-foreground">
                  {job.company} · {job.location}
                </p>
                <p className="mt-5 text-[15px] leading-relaxed text-foreground/75">{job.summary}</p>
                {job.award && <AwardButton label={job.award} />}
              </motion.div>

              {/* Contributions across all products */}
              <div className="col-span-4 md:col-span-8">
                <p className="label mb-3">Key contributions</p>
                <FadeIn as="ul" stagger={0.05} className="space-y-1">
                  {job.points.map((point) => (
                    <motion.li
                      key={point}
                      variants={item}
                      className="group -mx-3 flex gap-3 rounded-md px-3 py-1.5 text-[15px] leading-relaxed text-foreground/75 transition-colors duration-300 hover:bg-background hover:text-foreground"
                    >
                      {/* Dot stretches into an orange marker on hover */}
                      <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground transition-[width,background-color] duration-500 ease-out-expo group-hover:w-5 group-hover:bg-accent" />
                      <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                        {point}
                      </span>
                    </motion.li>
                  ))}
                </FadeIn>
              </div>
            </FadeIn>
          </div>
        ))}
      </div>
    </section>
  );
}
