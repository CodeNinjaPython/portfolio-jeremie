"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Photo = { src: string; w: number; h: number; alt: string };

const photos: Photo[] = [
  { src: "/images/gallery/photo-01.jpg", w: 1600, h: 900, alt: "Photographie — La Réunion" },
  { src: "/images/gallery/photo-07.jpg", w: 1200, h: 1600, alt: "Portrait" },
  { src: "/images/gallery/photo-02.jpg", w: 1600, h: 900, alt: "Reportage" },
  { src: "/images/gallery/photo-09.jpg", w: 1600, h: 1066, alt: "Drone — vue aérienne" },
  { src: "/images/gallery/photo-03.jpg", w: 1600, h: 1066, alt: "Scène de vie" },
  { src: "/images/gallery/photo-08.jpg", w: 1600, h: 1200, alt: "Tournage" },
  { src: "/images/gallery/photo-04.jpg", w: 1600, h: 900, alt: "Paysage réunionnais" },
  { src: "/images/gallery/photo-10.jpg", w: 1600, h: 1066, alt: "Drone — littoral" },
  { src: "/images/gallery/photo-05.jpg", w: 1600, h: 900, alt: "Lumière naturelle" },
  { src: "/images/gallery/photo-06.jpg", w: 1600, h: 1066, alt: "Détail" },
];

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    []
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    []
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, prev, next]);

  return (
    <section id="photos" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="kicker">Photographie</span>
          <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.4rem)] font-bold">
            L&apos;œil au-delà
            <br />
            <span className="text-[color:var(--color-accent)]">de la vidéo.</span>
          </h2>
          <p className="mt-5 text-lg text-[color:var(--color-ink-soft)]">
            Portraits, reportage, paysages et prises de vue aériennes — une sélection
            de tirages réalisés à La Réunion.
          </p>
        </motion.div>

        <div className="mt-14 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          {photos.map((p, i) => (
            <motion.button
              key={p.src}
              type="button"
              onClick={() => setIndex(i)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative block w-full overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)]"
              aria-label={`Agrandir : ${p.alt}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.w}
                height={p.h}
                sizes="(max-width: 768px) 50vw, 33vw"
                className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label="Galerie photo"
          >
            <button
              onClick={close}
              className="absolute right-6 top-6 z-10 text-3xl text-white/80 hover:text-white"
              aria-label="Fermer"
            >
              ×
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 md:left-8"
              aria-label="Photo précédente"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 md:right-8"
              aria-label="Photo suivante"
            >
              ›
            </button>

            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[85vh] w-auto max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[index].src}
                alt={photos[index].alt}
                width={photos[index].w}
                height={photos[index].h}
                sizes="90vw"
                className="max-h-[85vh] w-auto rounded-xl object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
