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
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          {/* Visual Side */}
          <motion.div 
            variants={itemVariants}
            className="relative order-2 md:order-1"
          >
            {/* This is where the image from Hero will appear to "land" */}
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 group relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 group-hover:opacity-0 transition-opacity duration-500" />
              <img 
                src="/avatar.png" 
                alt="About Sourav" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse" />
          </motion.div>

          {/* Content Side */}
          <motion.div variants={itemVariants} className="space-y-8 order-1 md:order-2">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold font-display flex items-center gap-3">
                <User className="text-primary" /> About Me
              </h2>
              <div className="h-1 w-20 bg-primary rounded-full" />
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed">
              I am a passionate <span className="text-foreground font-semibold">Frontend Developer</span> based in Bangalore, 
              currently crafting elegant solutions at <span className="text-accent">Aim Window Infp Tech</span>. 
              My journey is fueled by a curiosity for new technologies and a commitment to building 
              inclusive, high-performance web experiences.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -5 }}
                  className="p-4 rounded-2xl bg-card/50 border border-white/5 text-center"
                >
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <p className="text-muted-foreground">
              With over a year of professional experience, I've honed my skills in React, TypeScript, 
              and modern CSS. I believe that good design is invisible—it just works.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
