"use client";

import { useEffect, useRef, useState, useCallback, forwardRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";

/* ─── Data ──────────────────────────────────────────────────────────────── */
const highlights = [
  {
    title: "Reusable UI Component System",
    description:
      "Built reusable and scalable React components to maintain UI consistency across LMS, E-commerce, and internal tools. Focused on clean architecture and responsive design using Tailwind CSS.",
    tags: ["React.js", "Component Architecture", "Tailwind"],
  },
  {
    title: "Efficient API Integration",
    description:
      "Implemented API integration using React Query with caching, background refetching, and error handling to improve performance and maintain reliable frontend data flow.",
    tags: ["React Query", "REST APIs"],
  },
  {
    title: "Real-Time Collaboration Features",
    description:
      "Developed real-time chat and workflow updates using Socket.IO, enabling seamless communication and live task updates within internal applications.",
    tags: ["Socket.IO", "Real-time"],
  },
  {
    title: "Drag-and-Drop Sprint Planning",
    description:
      "Built interactive sprint boards with drag-and-drop functionality using @dnd-kit to improve task prioritization and team workflow visibility.",
    tags: ["@dnd-kit", "Sprint Planning"],
  },
  {
    title: "Role-Based Access Control",
    description:
      "Implemented role-based access control to manage permissions across admin, managers, and team members, ensuring secure and structured workflows.",
    tags: ["RBAC", "Security"],
  },
  {
    title: "E-Commerce Platform Modules",
    description:
      "Developed product listings, cart, checkout flows, and order management dashboards to support scalable e-commerce operations.",
    tags: ["E-commerce", "Orders"],
  },
  {
    title: "Enterprise Project Management Tool",
    description:
      "Built task management interfaces, approval flows, and sprint dashboards to support enterprise project workflows.",
    tags: ["PMT", "Workflow"],
  },
  {
    title: "Performance Optimization",
    description:
      "Improved application performance through lazy loading, optimized hooks, and responsive UI design based on Figma layouts.",
    tags: ["Performance", "UX"],
  },
];

const CONTENT_COUNT = highlights.length;
const INNER_TOTAL = CONTENT_COUNT + 2;
const NEEDS_BLANK = INNER_TOTAL % 2 !== 0;
const TOTAL_PAGES = INNER_TOTAL + (NEEDS_BLANK ? 1 : 0);
const LAST_PAGE = TOTAL_PAGES - 1;

/* ─── Shared helpers ─────────────────────────────────────────────────────── */
const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")";

function Tag({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <span
      style={{
        fontSize: "clamp(8px,1vw,10px)",
        padding: "2px 8px",
        borderRadius: 999,
        fontWeight: 600,
        border: dark ? "1px solid rgba(255,255,255,0.28)" : "1px solid #d4ad7a",
        background: dark ? "rgba(255,255,255,0.12)" : "rgba(212,173,122,0.2)",
        color: dark ? "#f0dfc0" : "#7a4f1e",
      }}
    >
      {label}
    </span>
  );
}

/* ─── Page components — ALL must use forwardRef, ALL must render a real div ─ */

// Front cover — styled like the reference design
const techIcons = [
  { Icon: SiReact, color: "#61DAFB", label: "React" },
  { Icon: SiNextdotjs, color: "#ffffff", label: "Next.js" },
  { Icon: SiTypescript, color: "#3178C6", label: "TypeScript" },
  { Icon: SiTailwindcss, color: "#38BDF8", label: "Tailwind" },
];
const bulletPoints = [
  "Building LMS & E-Commerce Platforms",
  "Developing Admin Dashboards & APIs",
  "Optimizing Performance for Scalable Web Apps",
];

const FrontCoverPage = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} data-density="hard" style={{ width: "100%", height: "100%" }}>
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at 40% 30%, #4a2255 0%, #2d1040 45%, #1a0828 100%)",
        color: "#f0e6d3",
        overflow: "hidden",
        boxSizing: "border-box",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      {/* Grain texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage: grain,
          backgroundSize: "160px",
          pointerEvents: "none",
        }}
      />

      {/* Subtle star-field dots */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.25,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />

      {/* Top-left & bottom-right gold corner accents */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          width: 18,
          height: 18,
          borderTop: "2px solid #c9a84c",
          borderLeft: "2px solid #c9a84c",
          borderRadius: "3px 0 0 0",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 18,
          height: 18,
          borderTop: "2px solid #c9a84c",
          borderRight: "2px solid #c9a84c",
          borderRadius: "0 3px 0 0",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          width: 18,
          height: 18,
          borderBottom: "2px solid #c9a84c",
          borderLeft: "2px solid #c9a84c",
          borderRadius: "0 0 0 3px",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          width: 18,
          height: 18,
          borderBottom: "2px solid #c9a84c",
          borderRight: "2px solid #c9a84c",
          borderRadius: "0 0 3px 0",
          opacity: 0.8,
        }}
      />

      {/* Decorative border frame */}
      <div
        style={{
          position: "absolute",
          inset: 14,
          border: "1px solid rgba(201,168,76,0.35)",
          borderRadius: 4,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "clamp(22px,5%,32px) clamp(18px,4%,28px)",
          gap: 0,
        }}
      >
        {/* Top label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: "clamp(8px,2%,14px)",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(201,168,76,0.5))",
            }}
          />
          <span
            className="py-2"
            style={{
              fontSize: "clamp(7px,1vw,9px)",
              letterSpacing: "0.25em",
              color: "#c9a84c",
              fontFamily: "sans-serif",
              fontWeight: 600,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Professional Experience
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to left, transparent, rgba(201,168,76,0.5))",
            }}
          />
        </div>

        {/* Main title */}
        <h2
          style={{
            fontSize: "clamp(0.9rem,4vw,1.35rem)",
            fontWeight: 800,
            lineHeight: 1.18,
            margin: "0 0 clamp(4px,1%,8px)",
            textAlign: "center",
            color: "#f0e6d3",
            letterSpacing: "-0.01em",
          }}
        >
          Frontend Development
          <br />
          Highlights
        </h2>

        {/* Subtitle */}
        <p
          className="py-2"
          style={{
            fontSize: "clamp(0.6rem,1.3vw,0.72rem)",
            color: "rgba(220,200,170,0.8)",
            textAlign: "center",
            lineHeight: 1.5,
            margin: "0 0 clamp(6px,1.5%,12px)",
            fontFamily: "sans-serif",
          }}
        >
          Key projects and accomplishments in React.js,
          <br />
          Next.js, and TypeScript
        </p>

        {/* Diamond divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            margin: "0 0 clamp(6px,1.5%,10px)",
          }}
        >
          <div
            style={{ width: 24, height: 1, background: "rgba(201,168,76,0.4)" }}
          />
          <div
            style={{
              width: 5,
              height: 5,
              background: "#c9a84c",
              transform: "rotate(45deg)",
              opacity: 0.7,
            }}
          />
          <div
            style={{ width: 24, height: 1, background: "rgba(201,168,76,0.4)" }}
          />
        </div>

        {/* Tech icons on a glowing platform */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            margin: "0 0 clamp(6px,1.5%,12px)",
          }}
        >
          {/* Platform glow ellipse */}
          <div
            style={{
              position: "absolute",
              bottom: -4,
              left: "50%",
              transform: "translateX(-50%)",
              width: "85%",
              height: 14,
              background:
                "radial-gradient(ellipse, rgba(97,218,251,0.22) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(4px)",
            }}
          />
          {/* Platform surface */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              height: 6,
              background:
                "linear-gradient(to right, transparent, rgba(180,180,220,0.15) 30%, rgba(180,180,220,0.25) 50%, rgba(180,180,220,0.15) 70%, transparent)",
              borderRadius: "50%",
              border: "1px solid rgba(180,180,220,0.2)",
            }}
          />

          <div
            className="py-3"
            style={{
              display: "flex",
              gap: "clamp(6px,2vw,12px)",
              alignItems: "flex-end",
              paddingBottom: 6,
              position: "relative",
              zIndex: 1,
            }}
          >
            {techIcons.map(({ Icon, color, label }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <div
                  style={{
                    width: "clamp(28px,6vw,42px)",
                    height: "clamp(28px,6vw,42px)",
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "clamp(6px,1.2vw,10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 14px rgba(0,0,0,0.4), 0 0 8px ${color}33`,
                  }}
                >
                  <Icon style={{ fontSize: "clamp(14px,3vw,22px)", color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bullet points */}
        <div
          className="py-5 px-7"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(3px,0.8%,6px)",
            margin: "0 0 clamp(6px,1.5%,10px)",
          }}
        >
          {bulletPoints.map((pt) => (
            <div
              key={pt}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 7,
                fontFamily: "sans-serif",
              }}
            >
              <span
                style={{
                  color: "#c9a84c",
                  fontSize: "clamp(9px,1.5vw,12px)",
                  marginTop: 1,
                  flexShrink: 0,
                }}
              >
                ✓
              </span>
              <span
                style={{
                  fontSize: "clamp(0.58rem,1.1vw,0.7rem)",
                  color: "rgba(220,200,170,0.85)",
                  lineHeight: 1.4,
                }}
              >
                {pt}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom diamond divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginBottom: "clamp(6px,1.5%,10px)",
          }}
        >
          <div
            style={{ width: 24, height: 1, background: "rgba(201,168,76,0.4)" }}
          />
          <div
            style={{
              width: 5,
              height: 5,
              background: "#c9a84c",
              transform: "rotate(45deg)",
              opacity: 0.7,
            }}
          />
          <div
            style={{ width: 24, height: 1, background: "rgba(201,168,76,0.4)" }}
          />
        </div>

        {/* Author name */}
        <p
          style={{
            textAlign: "center",
            fontSize: "clamp(0.7rem,2vw,1rem)",
            fontWeight: 700,
            color: "#e8d5a3",
            letterSpacing: "0.06em",
            margin: 0,
          }}
        >
          Sourav Gokul V
        </p>
      </div>
    </div>
  </div>
));
FrontCoverPage.displayName = "FrontCoverPage";

const BackCoverPage = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} data-density="hard" style={{ width: "100%", height: "100%" }}>
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at 60% 70%, #3d1d4a 0%, #240e35 50%, #150620 100%)",
        color: "#f0e6d3",
        overflow: "hidden",
        boxSizing: "border-box",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage: grain,
          backgroundSize: "160px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          width: 18,
          height: 18,
          borderTop: "2px solid #c9a84c",
          borderLeft: "2px solid #c9a84c",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 18,
          height: 18,
          borderTop: "2px solid #c9a84c",
          borderRight: "2px solid #c9a84c",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          width: 18,
          height: 18,
          borderBottom: "2px solid #c9a84c",
          borderLeft: "2px solid #c9a84c",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          width: 18,
          height: 18,
          borderBottom: "2px solid #c9a84c",
          borderRight: "2px solid #c9a84c",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 14,
          border: "1px solid rgba(201,168,76,0.3)",
          borderRadius: 4,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "clamp(22px,5%,32px) clamp(18px,4%,28px)",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(201,168,76,0.5))",
            }}
          />
          <div
            style={{
              width: 5,
              height: 5,
              background: "#c9a84c",
              transform: "rotate(45deg)",
              opacity: 0.8,
            }}
          />
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to left, transparent, rgba(201,168,76,0.5))",
            }}
          />
        </div>
        <p
          style={{
            fontSize: "clamp(0.58rem,1.1vw,0.7rem)",
            color: "rgba(220,200,170,0.7)",
            lineHeight: 1.6,
            margin: 0,
            fontFamily: "sans-serif",
            fontStyle: "italic",
          }}
        >
          More pages will be added
          <br />
          as new features ship.
        </p>
        <p
          style={{
            fontSize: "clamp(0.72rem,1.6vw,0.92rem)",
            fontWeight: 700,
            color: "#e8d5a3",
            letterSpacing: "0.08em",
            margin: 0,
          }}
        >
          Sourav Gokul V
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(201,168,76,0.5))",
            }}
          />
          <div
            style={{
              width: 5,
              height: 5,
              background: "#c9a84c",
              transform: "rotate(45deg)",
              opacity: 0.8,
            }}
          />
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to left, transparent, rgba(201,168,76,0.5))",
            }}
          />
        </div>
      </div>
    </div>
  </div>
));
BackCoverPage.displayName = "BackCoverPage";

const BlankPage = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} style={{ width: "100%", height: "100%" }}>
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "linear-gradient(160deg,#fdf5e6,#f0dfc6)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.055,
          backgroundImage: grain,
          backgroundSize: "180px",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 27px,#8b6914 27px,#8b6914 28px)",
          backgroundPositionY: 54,
        }}
      />
    </div>
  </div>
));
BlankPage.displayName = "BlankPage";

interface CProps {
  title: string;
  description: string;
  tags: string[];
  pageNo: number;
  side: "left" | "right";
}
const ContentPage = forwardRef<HTMLDivElement, CProps>(
  ({ title, description, tags, pageNo, side }, ref) => (
    <div ref={ref} className="w-full h-full">
      <div className="relative w-full h-full overflow-hidden box-border bg-white text-[#3d2e1a]">
        {/* grain texture */}
        <div
          className="absolute inset-0 opacity-[0.055] bg-size-[180px]"
          style={{ backgroundImage: grain }}
        />

        {/* notebook lines */}
        <div className="absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(0deg,transparent,transparent_27px,#8b6914_27px,#8b6914_28px)] bg-[position-y:54px]" />

        {/* top highlight */}
        <div className="absolute top-0 left-0 right-0 h-9.5 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.32),transparent)]" />

        {/* book fold shadow */}
        {side === "right" ? (
          <div className="absolute left-0 top-0 bottom-0 w-5.5 bg-[linear-gradient(to_right,rgba(0,0,0,0.12),transparent)]" />
        ) : (
          <div className="absolute right-0 top-0 bottom-0 w-5.5 bg-[linear-gradient(to_left,rgba(0,0,0,0.12),transparent)]" />
        )}

        {/* corner fold */}
        <div className="absolute bottom-0 right-0 w-7 h-7 rounded-tl-full bg-[linear-gradient(225deg,rgba(185,140,80,0.28)_0%,transparent_65%)]" />

        {/* content */}
        <div className="relative z-1 flex flex-col h-full p-[clamp(14px,3vw,22px)]">
          <div className="flex flex-wrap gap-1.25 mb-4">
            {tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>

          <h3 className="text-[clamp(0.8rem,1.8vw,1rem)] font-bold leading-[1.3] mb-2.5">
            {title}
          </h3>

          <p className="text-[clamp(0.64rem,1.1vw,0.76rem)] leading-[1.72] text-[#6b5a45] flex-1 m-0">
            {description}
          </p>

          <div className="text-[9px] tracking-[0.22em] opacity-30 mt-2.5 uppercase font-medium">
            Page {pageNo}
          </div>
        </div>
      </div>
    </div>
  ),
);
ContentPage.displayName = "ContentPage";

const BOOK_PAGES: React.ReactElement[] = [
  <FrontCoverPage key="front" />,
  ...highlights.map((h, i) => (
    <ContentPage
      key={`page-${i}`}
      title={h.title}
      description={h.description}
      tags={h.tags}
      pageNo={i + 2}
      side={i % 2 === 0 ? "right" : "left"}
    />
  )),
  ...(NEEDS_BLANK ? [<BlankPage key="blank" />] : []),
  <BackCoverPage key="back" />,
];

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function Projects() {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [phase, setPhase] = useState<"reading" | "flipping-over">("reading");
  const [bookFlipAngle, setBookFlipAngle] = useState(0);

  const busyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animRef = useRef<number | null>(null);
  /*
   * isHoveredRef tracks whether the user's mouse is over the book.
   * When true, scheduleNext() will NOT queue the next auto-flip.
   * When the mouse leaves, resumeAfterHover() restarts the timer.
   * We use a ref (not state) so the timer callbacks always read the
   * latest value without needing to be re-created.
   */
  const isHoveredRef = useRef(false);

  const [dimensions, setDimensions] = useState({ width: 380, height: 480 });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw < 640)
        setDimensions({
          width: Math.min(vw * 0.42, 190),
          height: Math.min(vw * 0.56, 260),
        });
      else if (vw < 1024)
        setDimensions({
          width: Math.min(vw * 0.36, 320),
          height: Math.min(vw * 0.48, 400),
        });
      else setDimensions({ width: 370, height: 460 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pf = useCallback(() => bookRef.current?.pageFlip(), []);

  const doFlipOver = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setPhase("flipping-over");
    busyRef.current = true;

    const TOTAL_DURATION = 1100;
    const start = performance.now();
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    let resetDone = false;

    const tick = (now: number) => {
      const raw = Math.min((now - start) / TOTAL_DURATION, 1);
      const eased = ease(raw);
      const angle = eased * 360;
      setBookFlipAngle(angle);

      if (!resetDone && angle >= 180) {
        resetDone = true;
        pf()?.turnToPage(0);
        setCurrentPage(0);
      }

      if (raw < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setBookFlipAngle(0);
        setPhase("reading");
        busyRef.current = false;
        scheduleNext();
      }
    };
    animRef.current = requestAnimationFrame(tick);
  }, [pf]);

  const scheduleNext = useCallback(() => {
    // Clear any existing timer first
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      // ── PAUSE ON HOVER ──────────────────────────────────────────────
      // If the user is hovering, do nothing. resumeAfterHover() will
      // call scheduleNext() again once the mouse leaves.
      if (isHoveredRef.current) return;
      if (busyRef.current) return;

      const book = pf();
      if (!book) return;
      const cur = book.getCurrentPageIndex();
      if (cur < LAST_PAGE - 1) {
        busyRef.current = true;
        book.flipNext();
      } else {
        doFlipOver();
      }
    }, 3200);
  }, [pf, doFlipOver]);

  const onFlipSettled = useCallback(() => {
    setIsFlipping(false);
    busyRef.current = false;
    const book = pf();
    if (!book) return;
    setCurrentPage(book.getCurrentPageIndex());
    scheduleNext();
  }, [pf, scheduleNext]);

  /* ── Hover handlers ─────────────────────────────────────────────────── */
  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    // Cancel the currently pending timer so the flip doesn't fire
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    // Only resume auto-flip if we're in reading phase and not mid-animation
    if (phase === "reading" && !busyRef.current) {
      scheduleNext();
    }
  }, [phase, scheduleNext]);

  /* ── Manual controls ────────────────────────────────────────────────── */
  const goNext = () => {
    if (phase !== "reading" || isFlipping || busyRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const book = pf();
    if (!book) return;
    const cur = book.getCurrentPageIndex();
    if (cur >= LAST_PAGE - 1) {
      doFlipOver();
    } else {
      busyRef.current = true;
      book.flipNext();
    }
  };
  const goPrev = () => {
    if (phase !== "reading" || isFlipping || busyRef.current) return;
    busyRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    pf()?.flipPrev();
  };
  const goTo = (spreadIndex: number) => {
    if (phase !== "reading" || isFlipping || busyRef.current) return;
    busyRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    pf()?.flip(spreadIndex * 2);
  };

  const onInit = useCallback(() => {
    scheduleNext();
  }, [scheduleNext]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    },
    [],
  );

  const totalSpreads = Math.ceil(TOTAL_PAGES / 2);
  const currentSpread = Math.floor(currentPage / 2);
  const isFlippingOver = phase === "flipping-over";
  const canNext = phase === "reading" && !isFlipping;
  const canPrev = phase === "reading" && !isFlipping && currentPage > 0;

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-background py-12 px-4 md:py-16 md:px-10 lg:px-16"
    >
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Professional Highlights
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Key contributions from my current role at Aim Window Info Tech.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl flex flex-col items-center">
          <div className="h-6 mb-2">
            {isFlippingOver && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground/50 tracking-widest uppercase text-center"
              >
                Starting over…
              </motion.p>
            )}
          </div>

          {/*
           * onMouseEnter — pause: cancel pending timer, set hovered flag
           * onMouseLeave — resume: clear flag, restart timer
           */}
          <div
            style={{
              filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.4))",
              perspective: "1800px",
              transform: `rotateY(${bookFlipAngle}deg)`,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* @ts-ignore */}
            <HTMLFlipBook
              ref={bookRef}
              width={dimensions.width}
              height={dimensions.height}
              size="fixed"
              minWidth={100}
              maxWidth={500}
              minHeight={160}
              maxHeight={700}
              showCover={true}
              flippingTime={650}
              usePortrait={false}
              startPage={0}
              drawShadow={true}
              mobileScrollSupport={false}
              clickEventForward={true}
              useMouseEvents={phase === "reading"}
              swipeDistance={30}
              showPageCorners={phase === "reading"}
              disableFlipByClick={isFlippingOver}
              style={{}}
              className=""
              onFlip={() => setIsFlipping(true)}
              onChangeState={(e: any) => {
                if (e.data === "read") onFlipSettled();
              }}
              onInit={onInit}
            >
              {BOOK_PAGES}
            </HTMLFlipBook>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between w-full max-w-lg px-1 relative z-30">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!canPrev}
              className="border-border/70 bg-card text-foreground hover:bg-muted/60 disabled:opacity-30"
              onClick={goPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalSpreads }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === currentSpread ? 22 : 8,
                    height: 8,
                    borderRadius: 999,
                    border: "none",
                    cursor: phase === "reading" ? "pointer" : "default",
                    background:
                      i === currentSpread
                        ? "#a07aaa"
                        : "rgba(160,122,170,0.28)",
                    transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!canNext}
              className="border-border/70 bg-card text-foreground hover:bg-muted/60 disabled:opacity-30"
              onClick={goNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-center mt-3 text-xs text-muted-foreground/60 tracking-widest uppercase">
            {currentSpread + 1} / {totalSpreads}
          </p>
        </div>
      </div>
    </section>
  );
}
