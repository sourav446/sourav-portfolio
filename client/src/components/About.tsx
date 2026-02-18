import { motion } from "framer-motion";
import { User, Code2, Globe2, Coffee } from "lucide-react";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const stats = [
    { icon: Code2, label: "Experience", value: "1+ Year", color: "text-blue-400" },
    { icon: Globe2, label: "Projects", value: "15+", color: "text-purple-400" },
    { icon: Coffee, label: "Coffee", value: "∞", color: "text-amber-400" }
  ];

  return (
    <section id="about" className="py-24 relative z-0 overflow-visible bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-20 items-center"
        >
          {/* Landing zone for the Hero image - Positioned on the LEFT */}
          <motion.div 
            variants={itemVariants}
            className="relative order-2 md:order-1 flex justify-center md:justify-start"
          >
            <div className="w-80 h-80 rounded-3xl border border-white/5 bg-white/[0.02] relative flex items-center justify-center">
              {/* This space is intentionally transparent to allow the floating hero image to be seen above it */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 opacity-50" />
              <div className="text-white/5 font-display text-lg select-none">IMAGE.ZONE</div>
            </div>
            
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse" />
          </motion.div>

          {/* Content Side - Positioned on the RIGHT */}
          <motion.div variants={itemVariants} className="space-y-8 order-1 md:order-2 relative z-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold font-display flex items-center gap-3">
                <User className="text-primary w-8 h-8" /> About Me
              </h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-accent rounded-full" />
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed">
              I am a passionate <span className="text-foreground font-semibold">Frontend Developer</span> based in Bangalore, 
              currently crafting elegant solutions at <span className="text-accent">Aim Window Infp Tech</span>. 
              My journey is fueled by a curiosity for new technologies and a commitment to building 
              inclusive, high-performance web experiences.
            </p>

            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="p-4 rounded-2xl bg-card/30 border border-white/5 text-center transition-colors"
                >
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              With over a year of professional experience, I've honed my skills in React, TypeScript, 
              and modern CSS. I believe that good design is invisible—it just works.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
