"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Home,
  Mail,
  Sparkles,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import ResumeViewer from "@/components/ui/ResumeViewer";

type NavigationProps = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

export default function Navigation({ theme, onToggleTheme }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [openResume, setOpenResume] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("home");
      const heroBottom = heroSection
        ? heroSection.offsetTop + heroSection.offsetHeight - 120
        : window.innerHeight * 0.8;

      setScrolled(window.scrollY > 50);
      setShowMobileNav(window.scrollY >= heroBottom);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "#home", icon: Home },
    { name: "About", href: "#about", icon: Sparkles },
    { name: "Experience", href: "#experience", icon: BriefcaseBusiness },
    // { name: "Work", href: "#projects", icon: FolderKanban },
    { name: "Contact", href: "#contact", icon: Mail },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border/60 bg-background/80 py-3 backdrop-blur-md"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-5 py-2 md:px-8 lg:px-16">
          <Link
            href="/"
            className=" hidden lg:block max-w-[11rem] text-lg font-bold tracking-tighter transition-colors sm:max-w-none sm:text-2xl"
          >
            Sourav Gokul V
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-foreground">
              <Switch
                checked={theme === "dark"}
                onCheckedChange={onToggleTheme}
                aria-label="Toggle dark mode"
              />
              <span></span>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium hover:text-accent transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center justify-between w-full lg:hidden px-2">
            {/* LEFT: Name */}
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight whitespace-nowrap max-w-[120px]"
            >
              Sourav Gokul V
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <div className="flex items-center rounded-full px-2 py-1 text-foreground bg-muted/40 backdrop-blur-md">
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={onToggleTheme}
                    aria-label="Toggle dark mode"
                  />
                </div>
              </div>

              {/* RIGHT: Resume Button */}
              {/* <button
                type="button"
                onClick={() => setOpenResume(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary px-3 py-1 text-xs shadow-md shadow-primary/20 transition hover:bg-primary/90"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>CV</span>
              </button> */}
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-x-0 bottom-4 z-[60] mb-2 flex justify-center px-10 transition-all duration-500 ease-out lg:hidden ${
          showMobileNav
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-24 opacity-0"
        }`}
      >
        <div className="flex w-full max-w-2xl items-center justify-between gap-1 rounded-4xl border border-border/60 bg-card/85 px-2 py-0.5 shadow-2xl backdrop-blur-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={link.name}
                href={link.href}
                className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-[1.4rem] px-2 py-2 text-center text-[11px] font-medium text-muted-foreground transition hover:bg-muted/40 hover:text-foreground sm:text-xs"
              >
                <Icon className="mb-1 h-4 w-4 text-foreground sm:h-5 sm:w-5" />
                <span className="truncate text-foreground">{link.name}</span>
              </a>
            );
          })}
        </div>
      </div>

      <ResumeViewer open={openResume} onOpenChange={setOpenResume} />
    </>
  );
}
