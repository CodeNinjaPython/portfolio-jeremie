"use client";

import { motion } from "framer-motion";

const packs = [
  {
    name: "Capsule sociale",
    price: "à partir de 850 €",
    tagline: "Format vertical · Reels & TikTok",
    description:
      "Idéal pour activer une marque, lancer un produit ou alimenter votre ligne éditoriale avec des contenus courts et impactants.",
    features: [
      "1 journée de tournage",
      "3 capsules verticales (15 à 30 s)",
      "Étalonnage & sound design",
      "Livraison 7 jours",
    ],
    accent: false,
  },
  {
    name: "Film de marque",
    price: "à partir de 2 400 €",
    tagline: "Brand film · Pub · Corporate",
    description:
      "Une signature cinématique pour incarner votre marque. Pré-production complète, équipe, captation multi-formats et finition broadcast.",
    features: [
      "Direction artistique & écriture",
      "1 à 2 jours de tournage 4K",
      "Drone DJI inclus",
      "Master 16:9 + déclinaisons 9:16 / 1:1",
      "Étalonnage avancé + mix son",
    ],
    accent: true,
  },
  {
    name: "Documentaire",
    price: "sur devis",
    tagline: "Territoire · Portrait · Long format",
    description:
      "Un récit incarné, un travail de fond. Pour les institutions culturelles, marques engagées et porteurs de projets singuliers.",
    features: [
      "Repérages & interviews",
      "Tournage multi-journées",
      "Sound design original",
      "Master + version courte teaser",
      "Accompagnement diffusion",
    ],
    accent: false,
  },
];

const addons = [
  { icon: <DroneIcon />, label: "Drone FPV / DJI", desc: "Plans aériens dynamiques" },
  { icon: <CameraIcon />, label: "Photo plateau", desc: "Captation simultanée" },
  { icon: <MicIcon />, label: "Sound design", desc: "Mix & habillage sonore" },
  { icon: <SlidersIcon />, label: "Étalonnage avancé", desc: "Look cinéma DaVinci" },
];

function DroneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.5"/>
      <line x1="12" y1="9.5" x2="6" y2="5.5"/>
      <line x1="12" y1="9.5" x2="18" y2="5.5"/>
      <line x1="12" y1="14.5" x2="6" y2="18.5"/>
      <line x1="12" y1="14.5" x2="18" y2="18.5"/>
      <circle cx="5" cy="4.5" r="2.5"/>
      <circle cx="19" cy="4.5" r="2.5"/>
      <circle cx="5" cy="19.5" r="2.5"/>
      <circle cx="19" cy="19.5" r="2.5"/>
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="8" y1="22" x2="16" y2="22"/>
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14"/>
      <line x1="4" y1="10" x2="4" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12" y2="3"/>
      <line x1="20" y1="21" x2="20" y2="16"/>
      <line x1="20" y1="12" x2="20" y2="3"/>
      <line x1="1" y1="14" x2="7" y2="14"/>
      <line x1="9" y1="8" x2="15" y2="8"/>
      <line x1="17" y1="16" x2="23" y2="16"/>
    </svg>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="kicker">Services & tarifs</span>
          <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.4rem)] font-bold">
            Trois formules,
            <br />
            <span className="text-[color:var(--color-accent)]">un seul standard.</span>
          </h2>
          <p className="mt-5 text-lg text-[color:var(--color-ink-soft)]">
            Des fourchettes claires pour cadrer votre projet. Chaque devis final est
            adapté à votre brief, votre durée et vos livrables.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {packs.map((pack, i) => (
            <motion.article
              key={pack.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative flex flex-col rounded-3xl border p-8 transition-all duration-500 hover:-translate-y-1 ${
                pack.accent
                  ? "border-[color:var(--color-accent)]/40 bg-gradient-to-b from-[color:var(--color-accent)]/8 to-transparent shadow-[0_0_60px_-20px_rgba(59,155,255,0.4)]"
                  : "border-[color:var(--color-line)] bg-[color:var(--color-surface)]/60 hover:border-[color:var(--color-ink)]/20"
              }`}
            >
              {pack.accent && (
                <span className="absolute -top-3 left-8 rounded-full bg-[color:var(--color-accent)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-bg)]">
                  Le plus demandé
                </span>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
                    {pack.tagline}
                  </p>
                  <h3 className="font-display mt-2 text-2xl font-bold">{pack.name}</h3>
                </div>
              </div>

              <p className="mt-4 font-display text-[1.6rem] font-bold text-[color:var(--color-ink)]">
                {pack.price}
              </p>

              <p className="mt-3 text-sm text-[color:var(--color-ink-soft)]">
                {pack.description}
              </p>

              <ul className="mt-6 flex-1 space-y-3 border-t border-[color:var(--color-line)] pt-6">
                {pack.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check accent={pack.accent} />
                    <span className="text-[color:var(--color-ink-soft)]">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                  pack.accent
                    ? "bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:shadow-[0_18px_40px_-10px_rgba(59,155,255,0.55)]"
                    : "border border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]/40"
                }`}
              >
                Demander un devis →
              </a>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-soft)]/40 p-8 md:p-10"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
                Options à la carte
              </p>
              <h3 className="font-display mt-2 text-2xl font-bold">
                Modules complémentaires
              </h3>
            </div>
            <p className="max-w-md text-sm text-[color:var(--color-ink-soft)]">
              À ajouter à n&apos;importe quelle formule pour enrichir votre livrable.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {addons.map((a) => (
              <div
                key={a.label}
                className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)]/60 p-5 transition-all hover:border-[color:var(--color-accent)]/40"
              >
                <div className="text-2xl">{a.icon}</div>
                <p className="mt-3 font-semibold">{a.label}</p>
                <p className="mt-1 text-sm text-[color:var(--color-ink-soft)]">
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Check({ accent }: { accent: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={accent ? "var(--color-accent)" : "var(--color-ink)"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
