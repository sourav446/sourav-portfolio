import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="container mx-auto px-6 py-18 md:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="text-2xl md:text-4xl font-bold ">Work Experience</h2>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </motion.div>

      <div className="relative ml-3 space-y-6 border-l border-border/60 md:ml-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative pl-8 md:pl-12"
        >
          <div className="absolute -left-1.5 top-2 h-3 w-3 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />

          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm transition-colors hover:bg-card/80 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
              <h3 className="text-xl  md:text-2xl font-bold text-foreground">
                Associate Software Developer (Frontend)
              </h3>
              <div className="flex items-center text-sm text-accent bg-accent/10 px-3 py-1 rounded-full w-fit">
                <Calendar className="w-4 h-4 mr-2" />
                Feb 17, 2025 - Present
              </div>
            </div>

            <div className="flex items-center text-sm md:text-lg text-muted-foreground mb-6">
              <Briefcase className="w-5 h-5 mr-2" />
              Aim Window Info Tech, Bengaluru
            </div>

            <ul className="space-y-3 text-muted-foreground  list-disc list-inside">
              <li>
                Developed scalable and reusable UI components using React.js and
                Next.js, following modular architecture and clean code
                principles across LMS, E-commerce, and Project Management (PMT)
                platforms.
              </li>

              {/* <li>
                Designed and integrated backend APIs for internal modules and
                portfolio projects, handling authentication, CRUD operations,
                and secure data flow.
              </li> */}

              <li>
                Integrated RESTful APIs using React Query with optimized
                caching, background refetching, and mutation handling to enhance
                performance and reduce unnecessary network requests.
              </li>

              <li>
                Collaborated closely with the backend development team to define
                API contracts, validate request/response structures, handle edge
                cases, and ensure seamless frontend–backend integration.
              </li>

              <li>
                Worked alongside the design team using Figma to translate UI/UX
                prototypes into responsive, pixel-accurate interfaces while
                maintaining design consistency and accessibility standards.
              </li>

              <li>
                Contributed to LMS platform development including real-time chat
                functionality, approval workflows, and role-based access control
                systems.
              </li>

              <li>
                Developed E-commerce modules such as product management, stock
                handling, order workflows, and dynamic pricing logic with
                responsive UI design.
              </li>

              <li>
                Implemented sprint planning and task management features in PMT
                with drag-and-drop functionality and dynamic state
                synchronization.
              </li>

              <li>
                Optimized state management using React Hooks and improved
                rendering performance to minimize re-renders and enhance UI
                responsiveness.
              </li>

              <li>
                Used Git and GitHub for version control, feature branching, pull
                requests, and collaborative code reviews within an Agile
                development workflow.
              </li>

              <li>
                Built and deployed a personal portfolio using Next.js with
                backend API integration, showcasing real-world project
                implementations and performance-focused design.
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
