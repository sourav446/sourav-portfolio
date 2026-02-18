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
import { Check } from "lucide-react";

type CoreTech = {
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
};

const coreStack: CoreTech[] = [
  {
    name: "React",
    subtitle: "React",
    icon: SiReact,
    iconColor: "text-sky-300",
  },
  {
    name: "Next.js",
    subtitle: "Next.js",
    icon: SiNextdotjs,
    iconColor: "text-white",
  },
  {
    name: "TypeScript",
    subtitle: "TypeScript",
    icon: SiTypescript,
    iconColor: "text-blue-300",
  },
  {
    name: "JavaScript (JS)",
    subtitle: "JavaScript",
    icon: SiJavascript,
    iconColor: "text-yellow-300",
  },
];

const supportingTools = [
  { label: "MongoDB", icon: SiMongodb },
  { label: "REST APIs" },
  { label: "React Query", icon: SiReactquery },
  { label: "Socket.IO", icon: SiSocketdotio },
  { label: "Tailwind CSS", icon: SiTailwindcss },
  { label: "Git & GitHub", icon: SiGit, extraIcon: SiGithub },
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
      <div className="h-px flex-1 bg-white/15" />
      <p className="text-xs sm:text-sm tracking-[0.28em] uppercase text-white/65">
        {title}
      </p>
      <div className="h-px flex-1 bg-white/15" />
    </div>
  );
}

export default function TechStack() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 py-10 sm:py-14 px-22">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 blur-[120px] rounded-full" />
      <div className="container relative mx-auto space-y-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Tech Stack
          </h2>
          <p className="mt-4 text-lg text-slate-300/90">
            Technologies I use to build scalable, production-ready web
            applications.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 justify-center">
          {coreStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="group relative rounded-2xl bg-slate-900/45 px-4 py-6 
      shadow-[0_0_30px_rgba(59,130,246,0.2)] backdrop-blur 
      flex flex-col items-center justify-center text-center"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl 
      group-hover:ring-1 group-hover:ring-blue-400/60 transition"
              />

              <tech.icon className={`h-14 w-14 ${tech.iconColor}`} />

              <p className="mt-4 text-lg font-medium text-slate-300">
                {tech.name}
              </p>
            </motion.div>
          ))}
        </div>

        <SectionLabel title="Supporting Tools" />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {supportingTools.map((tool, index) => (
            <motion.div
              key={tool.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="flex items-center justify-center gap-2 rounded-full border border-blue-200/20 bg-slate-900/35 px-4 py-3 text-sm text-slate-200"
            >
              {tool.icon ? (
                <tool.icon className="h-4 w-4 text-cyan-300" />
              ) : null}
              {tool.extraIcon ? (
                <tool.extraIcon className="h-4 w-4 text-slate-200" />
              ) : null}
              <span>{tool.label}</span>
            </motion.div>
          ))}
        </div>

        <SectionLabel title="Engineering Focus" />

        <div className="grid gap-3 text-lg text-slate-200 sm:grid-cols-2 lg:grid-cols-3">
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
