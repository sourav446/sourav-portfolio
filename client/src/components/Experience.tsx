import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="py-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-4xl font-bold mb-6">Work Experience</h2>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </motion.div>

      <div className="relative border-l border-white/10 ml-3 md:ml-6 space-y-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative pl-8 md:pl-12"
        >
          {/* Timeline Dot */}
          <div className="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
          
          <div className="bg-card/50 backdrop-blur-sm border border-white/10 p-6 md:p-8 rounded-2xl hover:bg-card/80 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
              <h3 className="text-2xl font-bold text-foreground">Frontend Developer</h3>
              <div className="flex items-center text-sm text-accent bg-accent/10 px-3 py-1 rounded-full w-fit">
                <Calendar className="w-4 h-4 mr-2" />
                Present (1 Year)
              </div>
            </div>
            
            <div className="flex items-center text-lg text-muted-foreground mb-6">
              <Briefcase className="w-5 h-5 mr-2" />
              Aim Window Infp Tech, Bangalore
            </div>

            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                Developed and maintained responsive user interfaces using React.js and modern CSS frameworks.
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                Collaborated with UX designers to translate Figma mockups into pixel-perfect code.
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                Optimized application performance, reducing load times by 20% through code splitting and lazy loading.
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                Integrated RESTful APIs for dynamic data fetching and state management.
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
