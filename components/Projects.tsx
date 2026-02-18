import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const highlights = [
  {
    title: "Reusable UI Component System",
    description:
      "Built and maintained reusable React UI components to improve consistency and development speed across modules.",
    tags: ["React.js", "Component Architecture", "Frontend"],
  },
  {
    title: "API Integration with React Query",
    description:
      "Integrated REST APIs using React Query for cleaner data flows, caching, and better client-side performance.",
    tags: ["React Query", "REST APIs", "State Management"],
  },
  {
    title: "Workflow and Real-Time Features",
    description:
      "Delivered approval workflows, modals, sprint planning views, drag-and-drop interactions, and Socket.IO chat issue fixes.",
    tags: ["@dnd-kit", "Socket.IO", "Product Features"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-22 bg-background relative overflow-hidden">
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
              className="rounded-2xl bg-card border border-white/5 p-6"
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
