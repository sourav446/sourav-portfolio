import Providers from "@/components/Providers";
import Navigation from "@/components/Navigation";
import Intro, { IntroFlyScript } from "@/components/Intro";
import Hero from "@/components/Hero";
import ContactDialog from "@/components/Contact";
import ResumeModal from "@/components/ResumeModal";
import LazySections, { LazyFooter } from "@/components/LazySections";

export default function Page() {
  return (
    <Providers>
      <a
        href="#projects"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to content
      </a>
      <Intro />
      <Navigation />
      {/* Measures the intro's flight to the nav coin while the HTML is still parsing */}
      <IntroFlyScript />
      <main>
        {/* 01 */}
        <Hero />
        {/* 02–06: code-split, mounted once the intro has handed over */}
        <LazySections />
      </main>
      <LazyFooter />
      <ContactDialog />
      <ResumeModal />
    </Providers>
  );
}
