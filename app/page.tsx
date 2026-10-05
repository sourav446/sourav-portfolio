import Providers from "@/components/Providers";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import CaseStudies from "@/components/CaseStudies";
import TechStack from "@/components/TechStack";
import Experience from "@/components/Experience";
import About from "@/components/About";
import ContactDialog from "@/components/Contact";
import Footer from "@/components/Footer";
import PageChrome from "@/components/motion/PageChrome";

export default function Page() {
  return (
    <Providers>
      <a
        href="#projects"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to content
      </a>
      <PageChrome />
      <Navigation />
      <main>
        {/* 01 */}
        <Hero />
        {/* 02 */}
        <Work />
        {/* 03 */}
        <CaseStudies />
        {/* 04 */}
        <TechStack />
        {/* 05 */}
        <Experience />
        {/* 06 */}
        <About />
      </main>
      <Footer />
      <ContactDialog />
    </Providers>
  );
}
