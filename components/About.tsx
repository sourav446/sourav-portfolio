import { motion } from "framer-motion";
import { User, Code2, Globe2, Coffee } from "lucide-react";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const stats = [
    {
      icon: Code2,
      label: "Experience",
      value: "1 Year",
      color: "text-blue-400",
    },
    {
      icon: Globe2,
      label: "Location",
      value: "Bengaluru",
      color: "text-purple-400",
    },
    {
      icon: Coffee,
      label: "Joined",
      value: "Feb 2025",
      color: "text-amber-400",
      hideOnMobile: true,
    },
  ];

  return (
    <section
      id="about"
      className="relative z-0 overflow-visible bg-background px-6 py-0 md:py-24 md:px-10 lg:px-16"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-20 items-center"
        >
          <motion.div
            variants={itemVariants}
            className="relative order-2 md:order-1 flex justify-center md:justify-start"
          >
            <div
              id="about-image-zone"
              className="relative hidden h-80 w-80 items-center justify-center rounded-3xl border border-border/60 bg-card/30 md:block"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-primary/5 to-accent/5 opacity-50" />
              {/* <div className="text-white/5 font-display text-lg select-none">IMAGE.ZONE</div> */}
            </div>

            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse" />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-6 order-1 md:order-2 relative z-10"
          >
            <div className="space-y-2">
              <h2 className="text-2xl md:text-5xl font-bold font-display flex items-center gap-3">
                <User className="text-primary w-8 h-8" /> About Me
              </h2>
              <div className="h-1.5 w-24 bg-linear-to-tr from-primary to-accent rounded-full" />
            </div>

            <p className=" text-md md:text-xl text-muted-foreground leading-relaxed">
              I am an Associate Software Developer specializing in React.js and
              Next.js, based in Bengaluru. At Aim Window Info Tech, I build
              scalable web applications across LMS, E-commerce, and Project
              Management platforms. I focus on reusable UI architecture, REST
              API integration, real-time features, and performance optimization
              while collaborating closely with design and backend teams in Agile
              environments.
            </p>

            <div className="grid grid-cols-2 gap-4  sm:grid-cols-3 md:gap-6">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{
                    y: -5,
                    backgroundColor: "rgba(148,163,184,0.12)",
                  }}
                  className={`
        rounded-2xl border border-border/60 bg-card/30 p-4 text-center transition-colors
        ${stat.hideOnMobile ? "hidden sm:block" : ""}
      `}
                >
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-xl md:text-2xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <p className=" text-md md:text-xl text-muted-foreground leading-relaxed">
              Core Stack: React.js, Next.js, TypeScript, JavaScript, React
              Query, Node.js, MongoDB, REST APIs, Socket.IO, Tailwind CSS, Git &
              GitHub.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
