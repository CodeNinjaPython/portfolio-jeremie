"use client";

import { motion } from "framer-motion";

const clients = [
  "VENUM",
  "Régal Azot",
  "Gala Danse",
  "Mafate",
  "Sony · A7 IV",
  "DJI · FPV",
  "DaVinci Resolve",
];

export default function LogosStrip() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8 }}
      className="border-y border-[color:var(--color-line)] bg-[color:var(--color-bg-soft)]/40 py-8 overflow-hidden"
      aria-label="Outils & clients"
    >
      <div className="marquee text-[color:var(--color-ink-muted)]">
        {[...clients, ...clients].map((c, i) => (
          <span
            key={i}
            className="font-display whitespace-nowrap text-2xl font-bold uppercase tracking-wider opacity-70 md:text-3xl"
          >
            {c} <span className="mx-8 text-[color:var(--color-accent)]">✱</span>
          </span>
        ))}
      </div>
    </motion.section>
  );
}
