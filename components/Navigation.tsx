"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Linkedin, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";

type NavigationProps = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

export default function Navigation({ theme, onToggleTheme }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Highlights", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 py-3 backdrop-blur-md"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-16 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold font-display tracking-tighter  transition-colors"
        >
          Sourav Gokul V
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-sm text-foreground">
            {/* {theme === "dark" ? (
              <Sun className="h-4 w-4 text-primary" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )} */}
            <Switch
              checked={theme === "dark"}
              onCheckedChange={onToggleTheme}
              aria-label="Toggle dark mode"
            />
            <span>{theme === "dark" ? (
              <Sun className="h-4 w-4 text-primary" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )}</span>
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
          {/* <a
            href="https://www.linkedin.com/in/souravgokul11"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/20 hover:text-primary-foreground ml-4">
              LinkedIn
            </Button>
          </a> */}
        </div>

        <button
          className="md:hidden text-foreground hover:text-accent transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-card border-b border-border md:hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <div className="flex items-center justify-between rounded-md border border-border/70 bg-card/70 px-3 py-2 text-foreground">
                <div className="flex items-center gap-2">
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-primary" />
                  ) : (
                    <Moon className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-sm font-medium">
                    {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={onToggleTheme}
                  aria-label="Toggle dark mode"
                />
              </div>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium hover:text-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex gap-4 mt-4 pt-4 border-t border-border">
                <a
                  href="https://www.linkedin.com/in/souravgokul11"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
