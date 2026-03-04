import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import ResumeViewer from "@/components/ui/ResumeViewer";

export default function Hero() {
  const targetRef = useRef<HTMLDivElement>(null);
  const movingImageRef = useRef<HTMLDivElement>(null);
  const [landingOffset, setLandingOffset] = useState({ x: -680, y: 880 });
  const [openResume, setOpenResume] = useState(false);
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
      className="relative flex min-h-screen items-center justify-center overflow-visible px-6  md:px-10 md:pt-10 lg:px-16"
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

      <div className="container relative z-10 mx-auto px-2 mt-19 md:px-6 md:py-2">
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
              className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[13px] md:text-sm font-mono text-accent"
            >
              Associate Software Developer | React & Next.js
            </motion.div>
            <h1 className="mb-6 text-4xl leading-tight font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              Designing the <br />
              <span className="bg-linear-to-r from-primary via-indigo-400 to-accent bg-clip-text text-transparent">
                Digital Future
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Hi, I&apos;m{" "}
              <span className="font-semibold text-foreground">
                Sourav Gokul V
              </span>
              , a Frontend Developer with hands-on experience building
              production-ready web applications using React.js and Next.js. I
              specialize in creating responsive, scalable, and
              performance-focused user interfaces while working closely with
              backend APIs and real-world business workflows.
              <br />
            </p>
            <div
              className="
    grid grid-cols-4 gap-3 py-8 md:py-6
    md:flex md:flex-wrap md:gap-4
  "
            >
              {/* Resume */}
              <Button
                size="lg"
                className="col-span-4 border-0 bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 md:col-auto"
                onClick={() => setOpenResume(true)}
              >
                Resume <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {/* Contact */}
              <a href="#contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-border/70 hover:bg-muted/60"
                >
                  <span className="hidden md:block">Contact Me</span>
                  <Mail className="block md:hidden h-4 w-4 mx-auto" />
                </Button>
              </a>

              {/* LinkedIn */}
              <Button
                size="lg"
                variant="outline"
                className="border-border/70 hover:bg-muted/60"
                asChild
              >
                <a
                  href="https://www.linkedin.com/in/souravgokul11"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="hidden md:block">LinkedIn</span>
                  <Linkedin className="block md:hidden h-4 w-4 mx-auto" />
                </a>
              </Button>

              {/* GitHub */}
              <Button
                variant="outline"
                className="border-border/70 hover:bg-muted/60"
                asChild
              >
                <a
                  href="https://github.com/sourav446"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="hidden md:block">GitHub</span>
                  <Github className="block md:hidden h-4 w-4 mx-auto" />
                </a>
              </Button>
              <Button
                variant="outline"
                className="block border-border/70 hover:bg-muted/60 md:hidden"
              >
                <a href="+919566943359" target="_blank" rel="noreferrer">
                  <Phone className="block md:hidden h-4 w-4 mx-auto" />
                </a>
              </Button>
            </div>
            <ResumeViewer open={openResume} onOpenChange={setOpenResume} />
          </motion.div>

          <div className="relative hidden md:block">
            {/* The primary moving image - ensured z-index is high to stay on top */}
            <motion.div
              ref={movingImageRef}
              style={{ x, y, scale, opacity, rotate }}
              className="relative z-40 mx-auto h-80 w-80 will-change-transform"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-primary to-accent rounded-full blur-3xl opacity-30 animate-pulse" />
              <img
                src="/Images/sourav.png"
                alt="Sourav Gokul"
                className="relative h-full w-full rounded-2xl border-2 border-border/70 object-cover shadow-2xl"
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
                className="absolute -bottom-6 -left-10 max-w-40 rounded-xl border border-border/70 bg-card/80 px-4 py-4 shadow-xl backdrop-blur"
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
        className="absolute bottom-5 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="text-muted-foreground" />
      </motion.div>
    </section>
  );
}
