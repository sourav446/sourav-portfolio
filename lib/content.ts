export const profile = {
  name: "Sourav Gokul V",
  role: "MERN Stack Developer",
  company: "Aim Window Info Tech",
  location: "Bengaluru, India",
  timeZone: "Asia/Kolkata",
  email: "souravgokul4@gmail.com",
  linkedin: "https://www.linkedin.com/in/souravgokul11",
  github: "https://github.com/sourav446",
  resume: "/resume.pdf",
};

// Same order as the page sections.
export const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export type CaseStudy = {
  project: string;
  title: string;
  /** Highlight panel: one metric or capability. */
  result: { value: string; label: string; note: string };
  approach: string[];
  stack: string[];
};

/** Engineering case studies — one problem, one highlight, three decisions, the stack. */
export const caseStudies: CaseStudy[] = [
  {
    project: "Live Classroom · WebRTC",
    title: "Solving the class-start concurrency challenge",
    result: {
      value: "250+",
      label: "Participant capacity per class",
      note: "With up to 25 interactive camera/microphone publishers",
    },
    approach: [
      "Atomic capacity reservation in Redis to prevent race conditions during concurrent joins.",
      "Environment-driven limits for participants and camera/microphone publishers per class.",
      "Release participant slots through signed LiveKit webhooks, with a reconciliation job as a fallback.",
    ],
    stack: ["React", "TypeScript", "LiveKit", "Node.js", "MongoDB", "Redis"],
  },
  {
    project: "E-commerce · Next.js",
    title: "Turning a storefront into a faster shopping experience",
    result: {
      value: "10 → 80",
      label: "Google Lighthouse score",
      note: "SSR also cut initial load time by 50%",
    },
    approach: [
      "Implemented Next.js server-side rendering to improve initial page delivery and search-engine accessibility.",
      "Built responsive product listing and detail pages, cart, and checkout workflows.",
      "Integrated CCAvenue payment processing into the customer checkout journey.",
    ],
    stack: ["Next.js", "React", "JavaScript", "SSR", "CCAvenue"],
  },
  {
    project: "EdTech · LMS",
    title: "Building reusable interfaces for education workflows",
    result: {
      value: "50+",
      label: "Shared React component library",
      note: "Reusable UI building blocks for consistent application experiences",
    },
    approach: [
      "Developed reusable React components to maintain consistent UI patterns across screens.",
      "Integrated REST APIs and implemented data-driven frontend workflows.",
      "Built responsive interfaces and reusable layouts to simplify ongoing development.",
    ],
    stack: ["React", "Next.js", "TypeScript", "REST APIs", "Tailwind CSS"],
  },
];

/** Scannable facts shown next to the About bio. */
export const quickFacts = [
  { label: "Role", value: "Frontend Developer" },
  { label: "Company", value: "Aim Window Info Tech" },
  { label: "Experience", value: "1.7+ years · since Feb 2025" },
  { label: "Location", value: "Bengaluru, India" },
  { label: "Recognition", value: "Future UX Star Award" },
  { label: "Education", value: "B.Sc Software Systems · KEC" },
  { label: "Certification", value: "MERN Stack Development · Besant" },
  { label: "Looking for", value: "Frontend / MERN stack roles" },
];

export type Project = {
  title: string;
  /** Compact name for tooltips. */
  short: string;
  domain: string;
  /** Gets the "Featured" badge. */
  featured?: boolean;
  /** Which animated demo to show. */
  visual: "webrtc" | "store" | "lms" | "pmt";
  /** Live site, shown as a "Visit live site" link. */
  url?: string;
  /** Headline figure shown on the card. */
  stat: { value: string; label: string };
  summary: string;
  /** What I personally owned on the project. */
  role: string;
  highlights: string[];
  tech: string[];
};

// Order = order on the page: featured first, then the rest.
export const projects: Project[] = [
  {
    title: "Live Classroom Platform (WebRTC)",
    short: "Live Classroom",
    domain: "Real-time · EdTech",
    featured: true,
    visual: "webrtc",
    stat: { value: "250+", label: "concurrent participants per room" },
    summary:
      "Browser-based live classes on a LiveKit WebRTC SFU — video, screen share, chat and recording, integrated with the MGR ERP.",
    role: "Frontend owner — room UI, media controls and chat, plus the Node.js services for joins and capacity",
    highlights: [
      "LiveKit SFU media pipeline with STUN/TURN traversal for restrictive networks",
      "Load-tested at 1,000 simulated participants with LiveKit's load-testing and end-to-end media tools",
      "HMAC-signed join tokens and one-time entry links for secure, non-replayable access",
      "Video, screen sharing, virtual backgrounds and chat with mentions & file sharing",
      "Participant management and automatic Zoom / WebRTC routing by meeting type",
    ],
    tech: ["React 19", "TypeScript", "LiveKit / WebRTC", "STUN/TURN", "Socket.IO", "Node.js", "Redis"],
  },
  {
    title: "XL1 Super Sports — E-Commerce",
    short: "XL1 E-Commerce",
    domain: "Commerce · Sports retail",
    featured: true,
    visual: "store",
    url: "https://xcell1.com",
    stat: { value: "10 → 80", label: "Lighthouse score after SSR" },
    summary:
      "Customer-facing sports-gear storefront with 10k+ product listings — from product discovery to CCAvenue checkout.",
    role: "Frontend owner — SSR product pages, search, cart and CCAvenue checkout",
    highlights: [
      "SSR product pages — Lighthouse 10 → 80 and 50% faster initial load",
      "Product search with category and brand browsing (SS, SG, MRF, COSCO, Yonex…)",
      "Cart and checkout with CCAvenue payment gateway integration",
      "Admin panel for inventory and full order-lifecycle tracking",
      "SEO-friendly pages that improved organic search visibility",
    ],
    tech: ["Next.js", "TypeScript", "SSR", "CCAvenue", "Tailwind CSS", "SEO"],
  },
  {
    title: "Learning Management System",
    short: "LMS",
    visual: "lms",
    domain: "Education",
    stat: { value: "1k+", label: "learners across 15+ courses" },
    summary:
      "Role-based learning platform for admins, instructors and students — courses, lessons, enrolment, video and quizzes.",
    role: "Frontend owner — role-based dashboards, course flows, HLS player and quizzes",
    highlights: [
      "Role-based interfaces (RBAC) for admin, instructor and student",
      "Course, lesson and enrolment management",
      "HLS video streaming with chapter-based lesson navigation",
      "Interactive quiz engine with instant answer validation",
      "Learner progress tracking",
    ],
    tech: ["React.js", "Next.js", "TypeScript", "HLS.js", "REST APIs", "RBAC", "TanStack Query"],
  },
  {
    title: "Project Management Tool",
    short: "PMT",
    visual: "pmt",
    domain: "Productivity",
    stat: { value: "Real-time", label: "team collaboration" },
    summary: "Sprint planning, task tracking and live collaboration for teams.",
    role: "Frontend developer — task boards, live updates and approval workflows",
    highlights: [
      "Drag-and-drop task boards",
      "Live updates with Socket.IO",
      "Sprint and team dashboards",
    ],
    tech: ["React.js", "TypeScript", "React Query", "Socket.IO", "@dnd-kit"],
  },
];

export type Job = {
  period: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  award?: string;
  /** Contributions across all products. */
  points: string[];
};

/** The résumé's Work Experience entry. */
export const experience: Job[] = [
  {
    period: "Feb 2025 — Present",
    role: "Frontend Developer",
    company: "Aim Window Info Tech",
    location: "Bengaluru, India",
    summary:
      "Frontend developer with 1.7+ years building production web apps with React.js, Next.js and TypeScript — LMS, e-commerce and real-time WebRTC platforms, plus the admin panels behind them.",
    award: "Future UX Star Award",
    points: [
      "Own frontend delivery across three production platforms — an LMS, a WebRTC live-class system, and an e-commerce storefront — from component architecture through performance tuning and release.",
      "Built a shared component library of 50+ reusable React components (forms, tables, modals, data grids) adopted across all three platforms, reducing per-feature UI development time and standardising patterns across the team.",
      "Integrated 50+ REST API endpoints, partnering with backend engineers to define API contracts, debug integration issues, and optimise data-fetching and caching strategies with TanStack Query.",
      "Built customer-facing interfaces and internal admin panels that support real-time business workflows.",
      "Shipped product features end to end — LMS role-based access, enrolment and quizzes; e-commerce SSR pages, cart, checkout and CCAvenue payments; and an enterprise project-management tool with task tracking and approval workflows.",
      "Handled dynamic rendering, error states and loading indicators on every API-driven screen, so the UI stays clear while data loads or fails.",
      "Improved application performance with code splitting, lazy loading and component-level optimisations.",
      "Translated Figma designs into responsive production interfaces with Tailwind CSS across mobile and desktop breakpoints — awarded the Future UX Star Award for UI quality.",
      "Worked closely with UI/UX designers, backend developers and QA to take features from design to release.",
    ],
  },
];

/** Words to look for in a project's tech tags when a skill's label differs from the tag. */
const skillKeywords: Record<string, string[]> = {
  "React.js": ["React"],
  "WebRTC (LiveKit)": ["LiveKit", "WebRTC"],
  "Node.js / Express": ["Node.js"],
  "REST APIs": ["REST"],
  "Tailwind CSS": ["Tailwind"],
  "HLS streaming": ["HLS"],
};

/** Short names of the projects whose tech tags include this skill (for the Skills tooltips). */
export function projectsUsing(skill: string): string[] {
  const keys = (skillKeywords[skill] ?? [skill]).map((k) => k.toLowerCase());
  return projects
    .filter((p) => p.tech.some((t) => keys.some((k) => t.toLowerCase().includes(k))))
    .map((p) => p.short);
}

export const skills = [
  {
    group: "Core",
    items: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)"],
  },
  {
    group: "Frontend",
    items: ["React Query", "Zustand", "Tailwind CSS", "HTML", "CSS", "SSR", "Responsive design", "Bootstrap", "Figma"],
  },
  {
    group: "Real-time & backend",
    items: ["WebRTC (LiveKit)", "Socket.IO", "Node.js / Express", "Redis", "REST APIs", "MongoDB", "MySQL", "HLS streaming"],
  },
  {
    group: "Tools & practices",
    items: ["Git & GitHub", "Reusable components", "Agile", "Performance optimization", "Postman", "VS Code"],
  },
  {
    group: "Cloud & testing",
    items: ["AWS", "Hostinger", "Docker", "Load testing"],
  },
  {
    group: "AI",
    items: ["AI development", "Claude"],
  },
];

/**
 * Back-of-card details for each skill in the Skills section. Written only from real work:
 * the projects above, Experience, and the WebRTC_Platform repo — no proficiency scores.
 */
export const skillInfo: Record<string, { summary: string; points: string[] }> = {
  "React.js": {
    summary: "My main UI library — component architecture, hooks and state across every product I ship.",
    points: [
      "Reusable component libraries shared across products",
      "Role-based dashboards, complex forms and data-heavy views",
      "Real-time interfaces that update live from Socket.IO and WebRTC events",
    ],
  },
  "Next.js": {
    summary: "App framework for routing, server-side rendering and SEO-friendly pages.",
    points: [
      "Server-rendered, SEO-friendly product pages for the XL1 store",
      "LMS and product frontends built on Next.js",
      "SSR work that improved SEO, performance and Lighthouse scores",
    ],
  },
  TypeScript: {
    summary: "Typed React on every production product — safer refactors and self-documenting code.",
    points: [
      "Typed component props and API responses",
      "Used on all four products in Projects",
      "Catches integration mistakes at compile time instead of in production",
    ],
  },
  "JavaScript (ES6+)": {
    summary: "The foundation under everything — modern syntax, modules and async patterns.",
    points: [
      "async/await data flows and event-driven UI logic",
      "Node.js backend services for the live-classroom platform",
      "The base for React, Next.js and TypeScript work",
    ],
  },
  "React Query": {
    summary: "Server-state fetching and caching, so screens stay fast and in sync with the API.",
    points: [
      "Caching and background refetching for API data",
      "Used in the LMS and the Project Management Tool",
      "Part of optimizing data fetching across 50+ integrated REST endpoints",
    ],
  },
  Zustand: {
    summary: "Lightweight client-side state without boilerplate.",
    points: [
      "Room and UI state in the live-classroom (WebRTC) frontend",
      "Small, focused stores instead of one global blob",
      "Pairs with React Query: server state there, UI state here",
    ],
  },
  "Tailwind CSS": {
    summary: "Utility-first styling for fast, consistent, responsive UI.",
    points: [
      "Used in the LMS, the XL1 store and this portfolio",
      "Design tokens and responsive utilities instead of one-off CSS",
      "Keeps styling close to the component it belongs to",
    ],
  },
  HTML: {
    summary: "Semantic, accessible markup as the base of every page.",
    points: [
      "Landmarks, headings and labelled controls",
      "Accessible forms and dialogs",
      "SEO-friendly structure for server-rendered pages",
    ],
  },
  CSS: {
    summary: "Layouts, transitions and animation — the craft layer of the UI.",
    points: [
      "Flexbox and Grid layouts across breakpoints",
      "Transitions and scroll animations (like this portfolio's)",
      "Performance-aware: GPU-friendly transforms over costly filters",
    ],
  },
  SSR: {
    summary: "Server-side rendering with Next.js for fast first loads and SEO.",
    points: [
      "SEO-friendly product pages for the XL1 Super Sports store",
      "Implemented SSR to improve SEO, performance and Lighthouse scores",
      "Faster first paint on content-heavy pages",
    ],
  },
  "Responsive design": {
    summary: "Interfaces that work from phones to wide desktops.",
    points: [
      "Mobile-first layouts that adapt at each breakpoint",
      "A Zoom-style phone toolbar for the live-classroom room UI",
      "Touch-friendly controls and readable type on small screens",
    ],
  },
  "WebRTC (LiveKit)": {
    summary: "Real-time video for browser-based live classes, on a LiveKit SFU.",
    points: [
      "Video chat with adaptive camera quality and 3 Mbps screen sharing",
      "Host virtual backgrounds (blur / image) via LiveKit track processors",
      "Students request permission before sharing video or screen",
    ],
  },
  "Socket.IO": {
    summary: "Live, event-driven features alongside the video call.",
    points: [
      "Classroom chat with mentions and file sharing, reactions and presence",
      "Live updates in the Project Management Tool",
      "Redis adapter so events reach users on any backend instance",
    ],
  },
  "Node.js / Express": {
    summary: "Backend services for the live-classroom platform.",
    points: [
      "REST routes, auth (JWT, OTP login) and rate limiting",
      "Signed LiveKit webhooks and leader-locked background jobs",
      "/healthz and /readyz endpoints for deployment",
    ],
  },
  Redis: {
    summary: "Fast shared state that makes the real-time backend correct at scale.",
    points: [
      "Atomic capacity reservation that holds up under class-start join storms",
      "Presence, leader locks and a shared rate-limiter store",
      "Socket.IO adapter for multi-instance deployments",
    ],
  },
  "REST APIs": {
    summary: "Connecting frontends to backend services cleanly and efficiently.",
    points: [
      "Integrated 50+ REST API endpoints across products",
      "Optimized frontend data fetching and caching",
      "Built Express routes for the live-classroom backend",
    ],
  },
  MongoDB: {
    summary: "Document storage behind the live-classroom backend.",
    points: [
      "Stores live-class sessions and participation records",
      "Backs recordings and session reads (with access checks)",
      "Works alongside Redis: durable data here, hot state there",
    ],
  },
  "Git & GitHub": {
    summary: "Day-to-day version control and team collaboration.",
    points: [
      "Feature branches, pull requests and code review",
      "Commit hooks and conventional commit messages",
      "Shared repos with backend and frontend teammates",
    ],
  },
  "Reusable components": {
    summary: "Building blocks that make every new screen faster to ship.",
    points: [
      "Component libraries that sped up delivery across products",
      "Consistent patterns for tables, forms, dashboards and dialogs",
      "Shared room UI pieces (like the call footer) reused across views",
    ],
  },
  "Performance optimization": {
    summary: "Making apps feel instant — measured, not guessed.",
    points: [
      "SSR and data-fetching improvements that lifted Lighthouse scores",
      "Removing costly paint work (blurs, blends) from scroll paths",
      "Caching API data to avoid needless network round-trips",
    ],
  },
  Agile: {
    summary: "Working in sprints with product and backend teams.",
    points: [
      "Sprint planning and task tracking (I built a tool for it — the PMT)",
      "Close collaboration with backend teams on API contracts",
      "Iterating on real user feedback in production",
    ],
  },
  Bootstrap: {
    summary: "CSS framework for quick, responsive layouts with ready-made components.",
    points: [
      "Responsive layouts with Bootstrap's 12-column grid",
      "Prebuilt components — navbars, forms, modals and cards",
      "Utility classes for spacing and alignment, much like I now use Tailwind",
    ],
  },
  MySQL: {
    summary: "Relational database — tables, keys and SQL queries.",
    points: [
      "Writing SQL queries with joins, filters and aggregates",
      "Designing relational tables with primary and foreign keys",
      "Understanding the data model behind the APIs I integrate",
    ],
  },
  Postman: {
    summary: "My first stop when integrating or debugging an API.",
    points: [
      "Testing REST endpoints before wiring them into the UI",
      "Reproducing integration bugs with exact requests and payloads",
      "Checking API contracts with backend engineers",
    ],
  },
  "VS Code": {
    summary: "Daily editor for everything I build.",
    points: [
      "TypeScript, ESLint and Prettier integration for clean code",
      "Integrated terminal, Git and debugging in one place",
      "Tailwind CSS IntelliSense and React tooling",
    ],
  },
  Figma: {
    summary: "Where the UI starts — I turn Figma designs into production interfaces.",
    points: [
      "Translating Figma designs into responsive Tailwind CSS interfaces",
      "Matching spacing, type and states across mobile and desktop",
      "Work recognised with the Future UX Star Award for UI quality",
    ],
  },
  "HLS streaming": {
    summary: "Adaptive video streaming for course lessons.",
    points: [
      "HLS.js playback for LMS lesson videos",
      "Chapter-based lesson navigation",
      "Works alongside the quiz engine and learner progress tracking",
    ],
  },
  Docker: {
    summary: "Containers for consistent, reproducible environments.",
    points: [
      "Running apps and services in containers that match across machines",
      "Writing Dockerfiles and composing multi-service setups",
      "Spinning up databases and caches locally without manual installs",
    ],
  },
  AWS: {
    summary: "Cloud infrastructure for deploying and running production services.",
    points: [
      "Deploying and hosting application services in the cloud",
      "Managing environment configuration for staging and production",
      "Keeping deployments reliable as traffic grows",
    ],
  },
  Hostinger: {
    summary: "Hosting and domains for shipping web projects live.",
    points: [
      "Deploying and hosting websites and web apps",
      "Domain, DNS and SSL setup for live sites",
      "Taking projects from local build to a public URL",
    ],
  },
  "Load testing": {
    summary: "Proving the real-time platform holds up before real users arrive.",
    points: [
      "Load-tested the live classroom at 1,000 simulated participants",
      "Used LiveKit's load-testing and end-to-end media tools",
      "Checked capacity limits under class-start join storms",
    ],
  },
  "AI development": {
    summary: "Using AI as part of how I design, build and ship software.",
    points: [
      "AI-assisted coding, refactoring and debugging in daily work",
      "Faster prototyping — from idea to working UI in less time",
      "Reviewing and testing AI-generated code before it ships",
    ],
  },
  Claude: {
    summary: "Anthropic's AI model — my go-to AI pair programmer.",
    points: [
      "Claude Code for planning, writing and reviewing code",
      "Exploring unfamiliar codebases and tracing bugs faster",
      "Used to help build and refine this portfolio",
    ],
  },
};
