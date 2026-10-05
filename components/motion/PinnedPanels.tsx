"use client";

import { Children, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Pinned panels with overscroll" — React port of GreenSock's
 * "Slides pinning – overscroll solution" (codepen.io/GreenSock/pen/bGRdvMy).
 *
 * Each panel pins when its bottom reaches the bottom of the viewport; the next panel then
 * slides up over it while the pinned one scales down and fades out. If a panel's content is
 * taller than the panel, the content is fake-scrolled first ("overscroll"), and a bottom
 * margin delays the next panel so it arrives exactly when that scrolling finishes.
 * The last panel is never pinned, so the page continues normally after it.
 */
export default function PinnedPanels({
  children,
  panelClassName = "",
}: {
  children: React.ReactNode;
  /** Classes for each panel (a function receives the panel index). */
  panelClassName?: string | ((index: number) => string);
}) {
  const root = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const [reduce, setReduce] = useState(false);
  const [build, setBuild] = useState(0);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // Rebuild on resize (panel/content heights change)…
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setBuild((n) => n + 1), 200);
    };
    window.addEventListener("resize", onResize);

    // …and refresh trigger positions whenever the page height changes (e.g. sections above
    // that size themselves after mounting), otherwise pins start at stale positions.
    let r: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(r);
      r = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.body);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      clearTimeout(t);
      clearTimeout(r);
    };
  }, []);

  useGSAP(
    () => {
      if (reduce) return;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", root.current);
      panels.pop(); // the last panel isn't pinned

      panels.forEach((panel) => {
        const inner = panel.querySelector<HTMLElement>("[data-panel-inner]");
        if (!inner) return;

        const contentHeight = inner.offsetHeight;
        const panelHeight = panel.clientHeight;
        const difference = contentHeight - panelHeight;

        // Share of the timeline spent fake-scrolling (the scale + fade takes one panel height).
        const fakeScrollRatio = difference > 0 ? difference / (difference + panelHeight) : 0;

        // Delay the next panel until the fake-scroll is done.
        if (fakeScrollRatio) gsap.set(panel, { marginBottom: contentHeight * fakeScrollRatio });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "bottom bottom",
            end: () => (fakeScrollRatio ? `+=${inner.offsetHeight}` : "bottom top"),
            pin: true,
            pinSpacing: false,
            scrub: true,
          },
        });

        if (fakeScrollRatio) {
          tl.to(inner, {
            yPercent: -100,
            y: panelHeight,
            duration: 1 / (1 - fakeScrollRatio) - 1,
            ease: "none",
          });
        }
        tl.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.84, opacity: 0.55, duration: 0.9, ease: "none" }).to(
          panel,
          { opacity: 0, duration: 0.1, ease: "none" },
        );
      });

      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [reduce, build], revertOnUpdate: true },
  );

  const cls = (i: number) =>
    typeof panelClassName === "function" ? panelClassName(i) : panelClassName;

  return (
    <div ref={root} className="space-y-6">
      {items.map((child, i) => (
        <div
          key={i}
          data-panel
          className={`relative overflow-hidden will-change-transform ${
            reduce ? "" : "h-[calc(100svh-7rem)]"
          } ${cls(i)}`}
        >
          <div data-panel-inner>{child}</div>
        </div>
      ))}
    </div>
  );
}
