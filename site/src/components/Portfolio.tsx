"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Project = {
  id: string;
  title: string;
  category: "Pub & Marque" | "Documentaire" | "Narration" | "Social";
  description: string;
  videoId: string;
};

const projects: Project[] = [
  {
    id: "venum",
    title: "VENUM — Publicité",
    category: "Pub & Marque",
    description: "Spot dynamique premium orienté conversion et image de marque.",
    videoId: "_q7MnK_2QFI",
  },
  {
    id: "aurora",
    title: "AURORA",
    category: "Narration",
    description: "Court-métrage visuel, travail de lumière et rythme cinématique.",
    videoId: "1J_S1kuRwHQ",
  },
  {
    id: "mafate",
    title: "Projet Alimentaire — Mafate",
    category: "Documentaire",
    description: "Film de territoire, approche authentique et utile.",
    videoId: "I3Msiw9MSdM",
  },
];

const filters = ["Tous", "Pub & Marque", "Documentaire", "Narration", "Social"] as const;

export default function Portfolio() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tous");
  const [active, setActive] = useState<Project | null>(null);

  const filtered = projects.filter((p) => filter === "Tous" || p.category === filter);

  return (
    <section id="projets" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <span className="kicker">Sélection</span>
            <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.4rem)] font-bold">
              Projets récents
            </h2>
            <p className="mt-4 text-lg text-[color:var(--color-ink-soft)]">
              Une sélection représentative entre films de marque, narration et territoire.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                  filter === f
                    ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-[color:var(--color-bg)]"
                    : "border-[color:var(--color-line)] text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-ink)]/40 hover:text-[color:var(--color-ink)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.length === 0 && (
              <p className="col-span-full py-10 text-center text-[color:var(--color-ink-soft)]">
                Aucun projet dans cette catégorie pour l&apos;instant.
              </p>
            )}
            {filtered.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => setActive(p)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(p)}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] transition-all hover:-translate-y-1 hover:border-[color:var(--color-accent)]/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <Image
                    src={`https://i.ytimg.com/vi/${p.videoId}/maxresdefault.jpg`}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium backdrop-blur">
                    {p.category}
                  </span>
                  <span className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-[color:var(--color-bg)] opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <svg width="14" height="16" viewBox="0 0 22 26" fill="currentColor">
                      <path d="M21 11.27a2 2 0 0 1 0 3.46l-18 10.39A2 2 0 0 1 0 23.39V2.6A2 2 0 0 1 3 .88z" />
                    </svg>
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">
                    {p.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setActive(null)}
              className="absolute right-6 top-6 text-3xl text-white/80 hover:text-white"
              aria-label="Fermer"
            >
              ×
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${active.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={active.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
