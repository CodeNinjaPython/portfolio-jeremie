"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "#showreel", label: "Showreel" },
  { href: "#services", label: "Services" },
  { href: "#projets", label: "Projets" },
  { href: "#photos", label: "Photos" },
  { href: "#about", label: "À propos" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        const current = ids.find((id) => visible.has(id)) ?? "";
        setActiveId(current);
      },
      { rootMargin: "-20% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.6, 0.2, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-[color:var(--color-bg)]/70 border-b border-[color:var(--color-line)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:py-5">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="font-display text-xl font-bold tracking-tight">
            Jérémie<span className="text-[color:var(--color-accent)]">.</span>
          </span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-[color:var(--color-ink-muted)] md:inline">
            Vidéaste · Réunion
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const isActive = activeId === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative py-1 text-sm transition-colors ${
                  isActive
                    ? "text-[color:var(--color-ink)]"
                    : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
                }`}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] rounded-full bg-[color:var(--color-accent)]"
                    transition={{ type: "spring", stiffness: 380, damping: 36 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <a href="#contact" className="btn btn-primary hidden md:inline-flex text-sm">
          Devis
        </a>

        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="relative h-10 w-10 md:hidden"
        >
          <span
            className={`absolute left-2 top-3.5 h-[2px] w-6 bg-[color:var(--color-ink)] transition-transform ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-2 top-[18px] h-[2px] w-6 bg-[color:var(--color-ink)] transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-2 top-[22px] h-[2px] w-6 bg-[color:var(--color-ink)] transition-transform ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-0 top-full md:hidden border-b border-[color:var(--color-line)] bg-[color:var(--color-bg)]/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col gap-1 px-6 py-6">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-lg font-medium hover:bg-white/5"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="btn btn-primary mt-4 justify-center"
              >
                Demander un devis
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
