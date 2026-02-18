import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const targetRef = useRef<HTMLDivElement>(null);
  const movingImageRef = useRef<HTMLDivElement>(null);
  const [landingOffset, setLandingOffset] = useState({ x: -680, y: 880 });
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const updateLandingOffset = () => {
      if (!movingImageRef.current) return;

      const aboutImageZone = document.getElementById("about-image-zone");
      if (!aboutImageZone) return;

      const imageRect = movingImageRef.current.getBoundingClientRect();
      const zoneRect = aboutImageZone.getBoundingClientRect();

      const imageCenterX = imageRect.left + imageRect.width / 2;
      const imageCenterY = imageRect.top + imageRect.height / 2;
      const zoneCenterX = zoneRect.left + zoneRect.width / 2;
      const zoneCenterY = zoneRect.top + zoneRect.height / 2;

      setLandingOffset({
        x: zoneCenterX - imageCenterX,
        y: zoneCenterY - imageCenterY,
      });
    };

    updateLandingOffset();
    window.addEventListener("resize", updateLandingOffset);
    window.addEventListener("load", updateLandingOffset);

    return () => {
      window.removeEventListener("resize", updateLandingOffset);
      window.removeEventListener("load", updateLandingOffset);
    };
  }, []);

  const x = useTransform(smoothProgress, [0, 0.8], [0, landingOffset.x]);
  const y = useTransform(smoothProgress, [0, 0.8], [0, landingOffset.y]);
  const scale = useTransform(smoothProgress, [0, 0.8], [1, 1.1]);
  const rotate = useTransform(smoothProgress, [0, 0.8], [3, 0]);

  // Keep opacity high so it doesn't hide
  const opacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [1, 1, 1, 1]);

  return (
    <section
      ref={targetRef}
      className="relative min-h-screen flex items-center justify-center overflow-visible pt-10 px-20"
    >
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.png"
          alt="Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/50 to-background" />
      </div>

      <div className="container mx-auto px-6 py-2 z-10 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 mb-4 border border-accent/30 rounded-full bg-accent/10 text-accent text-sm font-mono"
            >
              Associate Software Developer | React & Next.js
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Designing the <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-400 to-accent animate-pulse">
                Digital Future
              </span>
            </h1> 
            Hi, I&apos;m{" "}
            <span className="text-foreground font-semibold">
              Sourav Velusamy
            </span>
            Associate Software Developer specializing in React.js and Next.js. I
            build scalable, performance-focused web applications across LMS,
            E-commerce, and Project Management platforms, integrating backend
            APIs and delivering production-ready features in Agile environments.
            <div className="flex flex-wrap gap-4 py-6">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white border-0 shadow-lg shadow-primary/25"
              >
                {/* View My Work <ArrowRight className="ml-2 h-4 w-4" /> */}
                Resume
              </Button>
              <a
                href="https://www.linkedin.com/in/souravgokul11"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 cursor-pointer"
                >
                  LinkedIn
                </Button>
              </a>
              <a
                href="https://github.com/sourav446"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 hover:bg-white/5"
                >
                  GitHub
                </Button>
              </a>
            </div>
          </motion.div>

          <div className="relative hidden md:block">
            {/* The primary moving image - ensured z-index is high to stay on top */}
            <motion.div
              ref={movingImageRef}
              style={{ x, y, scale, opacity, rotate }}
              className="relative w-80 h-80 mx-auto z-100 will-change-transform"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-primary to-accent rounded-full blur-3xl opacity-30 animate-pulse" />
              <img
                src="/Images/Sourav.png"
                alt="Sourav Gokul"
                className="relative w-full h-full object-cover rounded-2xl border-2 border-white/10 shadow-2xl"
              />

              {/* Floating Badge 1 */}
              {/* <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -top-4 -right-4 bg-card/80 backdrop-blur border border-white/10 p-4 rounded-xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
                  <span className="text-sm font-medium text-nowrap">Available for hire</span>
                </div>
              </motion.div> */}

              {/* Floating Badge 2 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                className="absolute -bottom-6 -left-10 bg-card/80 backdrop-blur border border-white/10 px-4 py-4 rounded-xl shadow-xl max-w-39.5"
              >
                <div className="text-xs text-muted-foreground">
                  Designation :{" "}
                </div>
                <div className="text-sm font-bold whitespace-nowrap">
                  FrontEnd Developer
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="text-muted-foreground" />
      </motion.div>
    </section>
  );
}
