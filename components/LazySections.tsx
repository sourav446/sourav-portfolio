"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { whenIntroDone } from "@/components/Intro";

/*
 * Load order: the intro and the hero ship with the page; everything below the hero is split into
 * its own chunks, which start downloading while the intro plays.
 *   - Projects mounts the moment the intro hands over, together with the hero.
 *   - The rest mounts right after, in browser idle time, so it never competes with the intro or
 *     the hero's entrance for the main thread.
 */
const loadWork = () => import("@/components/Work");
const restLoaders = [
  () => import("@/components/CaseStudies"),
  () => import("@/components/TechStack"),
  () => import("@/components/Experience"),
  () => import("@/components/About"),
  () => import("@/components/Footer"),
];
const Work = dynamic(loadWork, { ssr: false });
const CaseStudies = dynamic(restLoaders[0], { ssr: false });
const TechStack = dynamic(restLoaders[1], { ssr: false });
const Experience = dynamic(restLoaders[2], { ssr: false });
const About = dynamic(restLoaders[3], { ssr: false });
const Footer = dynamic(restLoaders[4], { ssr: false });

let workReady: Promise<unknown> | null = null;
let restReady: Promise<unknown> | null = null;
const preloadWork = () => (workReady ??= loadWork());
const preloadRest = () => (restReady ??= Promise.all(restLoaders.map((load) => load())));

/**
 * True once the intro has handed over and the given chunks are downloaded, so mounting never waits.
 * `immediate` mounts at hand-over; otherwise in the next browser idle moment.
 */
function useAfterIntro(loaded: () => Promise<unknown>, immediate = false) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let alive = true;
    const ready = loaded();
    // Deep link (e.g. /#skills): mount straight away so the page can jump there.
    if (window.location.hash) {
      ready.then(() => alive && setShow(true));
      return () => {
        alive = false;
      };
    }
    let idle: number | undefined;
    const stop = whenIntroDone(() => {
      ready.then(() => {
        if (!alive) return;
        const mount = () => alive && setShow(true);
        if (immediate) return mount();
        idle = window.requestIdleCallback
          ? window.requestIdleCallback(mount, { timeout: 600 })
          : window.setTimeout(mount, 120);
      });
    });
    return () => {
      alive = false;
      stop();
      if (idle !== undefined) (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return show;
}

/** Projects (with the hero) → Case studies, Skills, Experience, About (right after). */
export default function LazySections() {
  const showProjects = useAfterIntro(preloadWork, true);
  const showRest = useAfterIntro(preloadRest);

  // Deep link: once the sections exist, jump to the requested one.
  useEffect(() => {
    if (!showRest || !window.location.hash) return;
    let tries = 0;
    const id = window.setInterval(() => {
      const el = document.querySelector(window.location.hash);
      if (el || ++tries > 20) {
        window.clearInterval(id);
        el?.scrollIntoView();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [showRest]);

  return (
    <>
      {/* 02 */}
      {showProjects && <Work />}
      {showRest && (
        <>
          {/* 03 */}
          <CaseStudies />
          {/* 04 */}
          <TechStack />
          {/* 05 */}
          <Experience />
          {/* 06 */}
          <About />
        </>
      )}
    </>
  );
}

/** The footer, mounted together with the sections above it. */
export function LazyFooter() {
  const show = useAfterIntro(preloadRest);
  return show ? <Footer /> : null;
}
