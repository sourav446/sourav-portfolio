"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/queryClient";

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground">
        <TooltipProvider>
          <Toaster />
          <Navigation />
          <main>
            <Hero />
            <About />
            <TechStack />
            <Experience />
            <Projects />
            <Contact />
          </main>
        </TooltipProvider>

        <footer className="py-8 text-center text-sm text-muted-foreground border-t border-white/5">
          <p>&copy; {new Date().getFullYear()} Sourav Velusamy. All rights reserved.</p>
        </footer>
      </div>
    </QueryClientProvider>
  );
}
