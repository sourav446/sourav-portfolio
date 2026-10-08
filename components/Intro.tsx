"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/content";

const SEEN_KEY = "intro-seen";

/** When the backdrop starts to clear (ms into its CSS animation) — the hero begins its entrance. */
const HAND_OVER_AT = 1300;

/**
 * Runs `cb` once the intro hands over to the page (or immediately if it was skipped / already seen).
 * The hero waits on this so its entrance plays as the intro clears, not underneath it.
 */
export function whenIntroDone(cb: () => void) {
  const w = window as Window & { __introDone?: boolean };
  if (w.__introDone || document.documentElement.dataset.intro === "skip") {
    cb();
    return () => {};
  }
  const run = () => cb();
  window.addEventListener("intro:done", run, { once: true });
  const failsafe = setTimeout(run, 4000);
  return () => {
    window.removeEventListener("intro:done", run);
    clearTimeout(failsafe);
  };
}

/**
 * Runs while the HTML is still being parsed (rendered right after the nav, so the coin exists):
 * measures how far the centred "SG" has to travel to land on the nav coin and how much to shrink,
 * stores that as CSS variables and switches the flight on. So the whole intro runs on the
 * compositor from the first paint and never waits for React to load.
 */
const FLY_SCRIPT = `(function(){try{var d=document.documentElement;if(d.dataset.intro==='skip')return;d.style.overflow='hidden';var c=document.querySelector('[data-intro-target]'),s=document.querySelector('.intro-sg');if(!c||!s)return;var a=c.getBoundingClientRect(),b=s.getBoundingClientRect();if(!a.width)return;var f=c.querySelector('[data-intro-face]')||c;d.style.setProperty('--fly-x',(a.left+a.width/2-(b.left+b.width/2))+'px');d.style.setProperty('--fly-y',(a.top+a.height/2-(b.top+b.height/2))+'px');d.style.setProperty('--fly-s',String(parseFloat(getComputedStyle(f).fontSize)/parseFloat(getComputedStyle(s).fontSize)));d.dataset.introGo='1'}catch(e){}})()`;

export function IntroFlyScript() {
  return <script dangerouslySetInnerHTML={{ __html: FLY_SCRIPT }} />;
}

/**
 * First-visit intro (all animation lives in globals.css, transform/opacity only):
 * the full name lands with a light sweep, an orange rule draws and the role rises; the name then
 * cross-fades into "SG", which glides into the round "SG" coin in the nav while the dark backdrop
 * clears and the home page appears. Once per browser session; tap / click / any key skips; never
 * shown with reduced motion (a script in <head> decides before first paint).
 */
export default function Intro() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const w = window as Window & { __introDone?: boolean };

    const handOver = () => {
      if (w.__introDone) return;
      w.__introDone = true;
      window.dispatchEvent(new Event("intro:done"));
      html.style.overflow = "";
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
    };
    const finish = () => {
      handOver();
      html.dataset.intro = "skip";
      delete html.dataset.introGo;
      setGone(true);
    };

    if (html.dataset.intro === "skip") {
      finish();
      return;
    }

    // Follow the CSS animations themselves (they started at first paint, before this code ran).
    const cssAnim = (sel: string, name: string) =>
      document
        .querySelector(sel)
        ?.getAnimations()
        .find((x) => (x as CSSAnimation).animationName === name);
    const backdropOut = cssAnim(".intro-backdrop", "intro-out");
    const fly = cssAnim(".intro-sg", "intro-fly");
    const sgOut = cssAnim(".intro-sg", "intro-out");

    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    timers.push(setTimeout(handOver, Math.max(0, HAND_OVER_AT - Number(backdropOut?.currentTime ?? HAND_OVER_AT))));
    // The coin answers with a small bounce as "SG" lands in it.
    fly?.finished.then(() => {
      if (cancelled) return;
      document
        .querySelector<HTMLElement>("[data-intro-target]")
        ?.animate([{ transform: "scale(1)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }], {
          duration: 420,
          easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        });
    }, () => {});
    Promise.all([backdropOut?.finished, sgOut?.finished]).then(() => !cancelled && finish(), () => {});
    timers.push(setTimeout(finish, 6000)); // never trap the page

    // Skip: fade everything out quickly.
    const skip = () => {
      timers.forEach(clearTimeout);
      handOver();
      html.dataset.introSkip = "1";
      timers.push(setTimeout(() => {
        delete html.dataset.introSkip;
        finish();
      }, 280));
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      html.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div id="intro" aria-hidden className="fixed inset-0 z-[200] cursor-pointer select-none">
      {/* Dark backdrop with a soft orange glow */}
      <div className="intro-backdrop absolute inset-0 bg-foreground">
        <span className="intro-glow pointer-events-none absolute top-1/2 left-1/2 h-[80vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,hsl(18_100%_55%/0.22),transparent)]" />
      </div>

      <div className="relative flex h-full flex-col items-center justify-center px-6">
        <div className="relative">
          <p className="intro-name font-display font-medium">{profile.name}</p>
          {/* Same size as the name, centred on it; fades in as the name fades out, then flies to the coin */}
          <span aria-hidden className="intro-sg font-display font-medium">
            SG
          </span>
        </div>
        <div className="intro-extras flex flex-col items-center">
          <span className="intro-rule mt-4 h-0.5 w-14 rounded-full bg-accent md:mt-5" />
          <span className="intro-role mt-4 font-mono text-[11px] tracking-[0.32em] text-background/70 uppercase md:mt-5 md:text-xs">
            MERN Stack Developer
          </span>
        </div>
      </div>
    </div>
  );
}
