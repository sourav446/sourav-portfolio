"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { quickFacts } from "@/lib/content";
import { FadeIn, SectionHeader, item } from "@/components/motion/Reveal";
import HeroCollage from "@/components/HeroCollage";
import { useFinePointer } from "@/components/motion/useFinePointer";

export default function About() {
  const collageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(collageRef, { once: true, margin: "0px 0px -20% 0px" });
  const fine = useFinePointer();

  // Cursor (-1..1) over the section drives the collage parallax and code-card tilt.
  const spring = { stiffness: 90, damping: 20, mass: 0.6 };
  const mx = useSpring(useMotionValue(0), spring);
  const my = useSpring(useMotionValue(0), spring);
  const rotateY = useTransform(mx, (v) => v * 6);
  const rotateX = useTransform(my, (v) => -v * 6);

  return (
    <section
      id="about"
      onPointerMove={(e) => {
        if (!fine) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="shell scroll-mt-20 pb-20 md:pb-28"
    >
      <SectionHeader index="06" title="About" />

      <div className="grid-12 mt-10 items-center gap-y-16 md:mt-14">
        {/* Workspace collage + code card */}
        <div ref={collageRef} className="col-span-4 md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-1">
          <HeroCollage play={inView} mx={mx} my={my} rotateX={rotateX} rotateY={rotateY} />
        </div>

        {/* Bio + quick facts */}
        <div className="col-span-4 md:col-span-12 lg:col-span-5 lg:col-start-8">
          <FadeIn stagger={0.08} className="space-y-5">
            <motion.p
              variants={item}
              className="font-display text-2xl leading-[1.3] tracking-[-0.02em] md:text-[28px]"
            >
              Frontend developer with 1.7+ years building production web apps with{" "}
              <strong className="font-medium">React.js, Next.js and TypeScript</strong>.
            </motion.p>
            <motion.p variants={item} className="text-base leading-relaxed text-muted-foreground">
              At Aim Window Info Tech I own the frontend of three production
              platforms — a WebRTC live-class system for 250+ participants per
              room, an LMS serving 1k+ learners, and an e-commerce storefront
              with 10k+ products. I built the shared library of 50+ components
              they run on, and won the Future UX Star Award for UI quality.
            </motion.p>
          </FadeIn>

          <FadeIn as="dl" stagger={0.05} className="mt-10">
            {quickFacts.map((f) => (
              <motion.div
                key={f.label}
                variants={item}
                className="group relative flex justify-between gap-6 overflow-hidden border-t border-border py-3 last:border-b"
              >
                {/* Ink sweep on hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                />
                <dt className="label relative flex items-center gap-2 pt-0.5 transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-3 group-hover:!text-background/60">
                  <span className="h-1.5 w-0 rounded-full bg-accent transition-[width] duration-500 ease-out-expo group-hover:w-1.5" />
                  {f.label}
                </dt>
                <dd className="relative text-right text-sm font-medium transition-[color,transform] duration-500 ease-out-expo group-hover:-translate-x-3 group-hover:text-background">
                  {f.value}
                </dd>
              </motion.div>
            ))}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
