"use client";

import { motion } from "framer-motion";

const skills = [
  "Sony A7 IV · FX30",
  "LUMIX S5II",
  "Drone DJI · FPV",
  "DaVinci Resolve",
  "Premiere Pro",
  "Étalonnage",
  "Sound design",
];

const approach = [
  {
    number: "01",
    title: "Brief & écriture",
    description:
      "On clarifie l'objectif, la cible et le format. Je vous propose un angle narratif et un plan de production réaliste.",
  },
  {
    number: "02",
    title: "Tournage",
    description:
      "Captation 4K maîtrisée, drone si pertinent, son propre. Une équipe et un workflow calibrés pour livrer du rush exploitable.",
  },
  {
    number: "03",
    title: "Post & livraison",
    description:
      "Montage, étalonnage, mix son et déclinaisons multi-formats. Master broadcast + versions réseaux livrés à la date prévue.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid items-start gap-16 lg:grid-cols-[1fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-32"
          >
            <span className="kicker">À propos</span>
            <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.4rem)] font-bold">
              Un partenaire
              <br />
              <span className="text-[color:var(--color-accent)]">de production.</span>
            </h2>
            <p className="mt-6 text-lg text-[color:var(--color-ink-soft)]">
              Vidéaste indépendant à La Réunion, j&apos;accompagne marques, institutions
              et artistes avec une approche méthodique : cadrage précis, exécution
              propre, livraison fiable.
            </p>
            <p className="mt-4 text-[color:var(--color-ink-soft)]">
              Mon rôle est d&apos;aligner la création avec vos objectifs business ou
              culturels — pas de faire joli sans raison.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface)]/60 px-3 py-1.5 text-xs font-medium text-[color:var(--color-ink-soft)]"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="space-y-4">
            {approach.map((step, i) => (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="group relative overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)]/60 p-8 transition-all hover:border-[color:var(--color-accent)]/40"
              >
                <div className="flex items-start gap-6">
                  <span className="font-display text-5xl font-bold text-[color:var(--color-accent)]/40 transition-colors group-hover:text-[color:var(--color-accent)]">
                    {step.number}
                  </span>
                  <div className="flex-1 pt-1">
                    <h3 className="font-display text-2xl font-bold">{step.title}</h3>
                    <p className="mt-3 text-[color:var(--color-ink-soft)]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
