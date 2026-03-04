import { motion } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiMongodb,
  SiTailwindcss,
  SiReactquery,
  SiSocketdotio,
  SiGit,
  SiGithub,
} from "react-icons/si";
import { Check, CodeXml } from "lucide-react";

type CoreTech = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  mobileOnly?: boolean;
};

const coreStack: CoreTech[] = [
  {
    name: "HTML & CSS",
    icon: CodeXml,
    iconColor: "text-red-600",
  },
  {
    name: "JavaScript (JS)",
    icon: SiJavascript,
    iconColor: "text-yellow-300",
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
    iconColor: "text-blue-300",
  },
  {
    name: "React",
    icon: SiReact,
    iconColor: "text-sky-300",
  },
  {
    name: "Next.js",
    icon: SiNextdotjs,
    iconColor: "text-foreground",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    iconColor: "text-foreground",
    mobileOnly: true,
  },
];

const skills = [
  { label: "HTML & CSS", icon:CodeXml, level: 90 },
  { label: "JavaScript", icon: SiJavascript, level: 88 },
  { label: "TypeScript", icon: SiTypescript, level: 80 },
  { label: "React.js", icon: SiReact, level: 90 },
  { label: "Next.js", icon: SiNextdotjs, level: 85 },
  { label: "Tailwind CSS", icon: SiTailwindcss, level: 90 },
  { label: "MongoDB", icon: SiMongodb, level: 70 },
  { label: "REST APIs", level: 85 },
  { label: "React Query", icon: SiReactquery, level: 80 },
  { label: "Socket.IO", icon: SiSocketdotio, level: 70 },
  { label: "Git", icon: SiGit, level: 85 },
  { label: "GitHub", icon: SiGithub, level: 85 },
];

const focusAreas = [
  "Clean Architecture",
  "API Integration",
  "Reusable Components",
  "Performance Optimization",
  "Agile Collaboration",
  "Scalable UI Patterns",
];

function SectionLabel({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="h-px flex-1 bg-border/70" />
      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground sm:text-sm">
        {title}
      </p>
      <div className="h-px flex-1 bg-border/70" />
    </div>
  );
}

export default function TechStack() {
  return (
    <section className="relative overflow-hidden border-y border-border/60 px-6 py-10 sm:py-14 md:px-10 lg:px-16">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 blur-[120px] rounded-full" />
      <div className="container relative mx-auto space-y-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-2xl font-bold text-foreground sm:text-5xl md:text-4xl">
            Tech Stack
          </h2>
          <p className="mt-4 text-md text-muted-foreground md:text-lg">
            Technologies I use to build scalable, production-ready web
            applications.
          </p>
        </motion.div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 justify-center">
          {coreStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className={`${tech.mobileOnly ? "lg:hidden" : ""} group relative rounded-2xl border border-border/60 bg-card/60 px-4 py-6
      shadow-[0_0_30px_rgba(59,130,246,0.12)] backdrop-blur
      flex flex-col items-center justify-center text-center" `}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl 
      group-hover:ring-1 group-hover:ring-blue-400/60 transition"
              />

              <tech.icon className={`h-14 w-14 ${tech.iconColor}`} />

              <p className="mt-4 text-sm font-medium text-foreground md:text-lg">
                {tech.name}
              </p>
            </motion.div>
          ))}
        </div>

        <SectionLabel title="Skills" />

        <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {skills.map((tool, index) => {
            const progress = tool.level || 75;
            const angle = (progress / 100) * 360;

            return (
              <motion.div
                key={tool.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="relative flex items-center justify-center gap-3 rounded-full border border-border/70 bg-card/60 px-4 py-3 text-sm text-foreground backdrop-blur"
              >
                {/* progress ring */}
                <div
                  className="relative flex items-center justify-center h-8 w-8 rounded-full"
                  style={{
                    background: `conic-gradient(#38bdf8 ${angle}deg, rgba(255,255,255,0.1) ${angle}deg)`,
                  }}
                >
                  <div className="absolute inset-0.75 rounded-full bg-background flex items-center justify-center">
                    {tool.icon ? (
                      <tool.icon className="h-3 w-3 text-cyan-300" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-cyan-300" />
                    )}
                  </div>
                </div>

                <span>{tool.label}</span>
              </motion.div>
            );
          })}
        </div>

        <SectionLabel title="Engineering Focus" />

        <div className="grid gap-3 text-lg text-foreground sm:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="flex items-center gap-2"
            >
              <Check className="h-5 w-5 text-blue-300" />
              <span>{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
