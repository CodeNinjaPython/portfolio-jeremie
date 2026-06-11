"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const SHOWREEL_ID = "1J_S1kuRwHQ";

const stats = [
  { value: "5+", label: "années" },
  { value: "50+", label: "projets" },
  { value: "4K", label: "RAW · drone FPV" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate min-h-[100svh] overflow-hidden pt-28 pb-20 md:pt-32 md:pb-28"
    >
      <motion.div
        style={{ y, scale, opacity }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--color-bg)] via-transparent to-[color:var(--color-bg)] z-10" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage: `url(https://i.ytimg.com/vi/${SHOWREEL_ID}/maxresdefault.jpg)`,
          }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-[1280px] px-6">
        <div className="grid items-end gap-16 lg:grid-cols-[1.2fr_1fr]">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
            }}
            className="max-w-2xl"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            >
              <span className="kicker">Réalisateur · Cadreur · Drone</span>
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8, ease: [0.2, 0.6, 0.2, 1] }}
              className="font-display mt-6 text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.95]"
            >
              Des images qui
              <br />
              <span className="text-[color:var(--color-accent)] italic">
                marquent
              </span>{" "}
              les esprits.
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="mt-7 max-w-xl text-lg text-[color:var(--color-ink-soft)] md:text-xl"
            >
              Réalisation, captation et post-production haut de gamme à La Réunion.
              Pour les marques, institutions et artistes qui cherchent une signature
              cinématique.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a href="#projets" className="btn btn-primary">
                Voir les projets
                <Arrow />
              </a>
              <button
                onClick={() => setPlaying(true)}
                className="btn btn-ghost"
                aria-label="Lancer le showreel"
              >
                <Play />
                Voir le showreel
              </button>
            </motion.div>

            <motion.dl
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
              transition={{ delay: 0.9 }}
              className="mt-14 grid grid-cols-3 gap-6 border-t border-[color:var(--color-line)] pt-8 max-w-md"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-3xl font-bold text-[color:var(--color-ink)]">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-xs uppercase tracking-widest text-[color:var(--color-ink-muted)]">
                    {s.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            id="showreel"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.2, 0.6, 0.2, 1] }}
            className="relative"
          >
            <button
              onClick={() => setPlaying(true)}
              className="group relative block aspect-video w-full overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-black shadow-2xl"
              aria-label="Lancer le showreel"
            >
              <Image
                src={`https://i.ytimg.com/vi/${SHOWREEL_ID}/maxresdefault.jpg`}
                alt="Aperçu du showreel"
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-[color:var(--color-bg)] shadow-[0_0_60px_rgba(59,155,255,0.6)] transition-transform duration-300 group-hover:scale-110">
                <svg width="22" height="26" viewBox="0 0 22 26" fill="currentColor">
                  <path d="M21 11.27a2 2 0 0 1 0 3.46l-18 10.39A2 2 0 0 1 0 23.39V2.6A2 2 0 0 1 3 .88z" />
                </svg>
              </span>

              <span className="absolute bottom-5 left-5 flex items-center gap-3 text-sm">
                <span className="rounded-full bg-[color:var(--color-accent)] px-2 py-0.5 text-xs font-bold text-[color:var(--color-bg)]">
                  SHOWREEL
                </span>
                <span className="text-[color:var(--color-ink)]">2026 · Sélection</span>
              </span>
            </button>

            <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-3xl border border-[color:var(--color-accent)]/30" />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden="true"
      >
        <motion.span
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-muted)]"
        >
          Défiler
        </motion.span>
        <div className="relative h-12 w-px overflow-hidden bg-[color:var(--color-line)]">
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear", repeatDelay: 0.3 }}
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-[color:var(--color-accent)] to-transparent"
          />
        </div>
      </motion.div>

      {playing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setPlaying(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Showreel"
        >
          <button
            type="button"
            onClick={() => setPlaying(false)}
            className="absolute right-6 top-6 text-3xl text-white/80 hover:text-white"
            aria-label="Fermer"
          >
            ×
          </button>
          <div
            className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${SHOWREEL_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="Showreel Jérémie Favre"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      )}
    </section>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function Play() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
