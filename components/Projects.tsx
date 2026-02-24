import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const highlights = [
  {
    title: "Reusable UI Component System",
    description:
      "Designed and maintained a scalable React component system to improve development efficiency and ensure consistency across LMS and E-commerce platforms.",
    tags: ["React.js", "Component Architecture", "Frontend"],
  },
  {
    title: "API Integration with React Query",
    description:
      "Implemented optimized API integration using React Query with intelligent caching, background refetching, mutation handling, and structured error management to enhance data consistency, reliability, and overall frontend performance.",
    tags: ["React Query", "REST APIs", "State Management"],
  },
  {
    title: "Workflow and Real-Time Features",
    description:
      "Built approval workflows, sprint planning views, drag-and-drop interactions, real-time chat, and integrated HLS-based video upload and streaming for LMS e-learning modules.",
    tags: ["@dnd-kit", "Socket.IO", "HLS"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden bg-background px-6 py-16 md:px-10 lg:px-16">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Professional Highlights</h2>
          <p className="text-muted-foreground">Key contributions from my current role at Aim Window Info Tech.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-white/5 bg-card p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-primary/20"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-secondary/50 hover:bg-secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
