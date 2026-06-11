"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/mgvkgnjg", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2rem] border border-[color:var(--color-line)] bg-gradient-to-br from-[color:var(--color-accent)]/10 via-[color:var(--color-surface)] to-[color:var(--color-surface)] p-8 md:p-14"
        >
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[color:var(--color-accent)] opacity-20 blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <span className="kicker">Contact</span>
              <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.4rem)] font-bold">
                Parlons de votre
                <br />
                <span className="text-[color:var(--color-accent)]">prochain film.</span>
              </h2>
              <p className="mt-6 text-lg text-[color:var(--color-ink-soft)]">
                Donnez-moi le contexte, la date cible et le format souhaité. Je reviens
                vers vous sous 24h avec une proposition claire, un délai et un budget
                transparent.
              </p>

              <div className="mt-10 space-y-4">
                <a
                  href="https://wa.me/262693112398"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg)]/40 p-4 transition-all hover:border-[color:var(--color-accent)]/40"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--color-accent)]/15 text-xl">
                    💬
                  </span>
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <p className="text-sm text-[color:var(--color-ink-soft)]">
                      +262 693 11 23 98 · réponse rapide
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:fvjeremie@gmail.com"
                  className="flex items-center gap-4 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg)]/40 p-4 transition-all hover:border-[color:var(--color-accent)]/40"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--color-accent)]/15 text-xl">
                    ✉️
                  </span>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-[color:var(--color-ink-soft)]">
                      fvjeremie@gmail.com
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="name" label="Votre nom" required />
                <Field name="email" type="email" label="Email" required />
              </div>
              <Field name="subject" label="Type de projet (film, doc, social…)" />
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-[color:var(--color-ink-muted)]">
                  Brief
                </label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Contexte, format, date cible, budget approximatif…"
                  className="w-full resize-none rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg)]/50 p-4 text-[color:var(--color-ink)] outline-none transition-colors placeholder:text-[color:var(--color-ink-muted)]/60 focus:border-[color:var(--color-accent)]"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn btn-primary mt-2 w-full justify-center disabled:opacity-60"
              >
                {status === "sending" ? "Envoi…" : "Envoyer la demande"}
              </button>

              {status === "sent" && (
                <p className="mt-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                  ✓ Message reçu. Réponse sous 24h ouvrées.
                </p>
              )}
              {status === "error" && (
                <p className="mt-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  Une erreur est survenue. Écrivez-moi directement à fvjeremie@gmail.com.
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-widest text-[color:var(--color-ink-muted)]">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg)]/50 p-4 text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-accent)]"
      />
    </div>
  );
}
