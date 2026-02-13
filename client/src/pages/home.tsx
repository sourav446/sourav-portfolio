import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground">
      <Navigation />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Experience />
        <Projects />
        <Contact />
      </main>
      
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} Sourav Gokul. All rights reserved.</p>
      </footer>
    </div>
  );
}
