export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-line)] py-12 mt-24">
      <div className="mx-auto max-w-[1280px] px-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-bold">
            Jérémie Favre<span className="text-[color:var(--color-accent)]">.</span>
          </p>
          <p className="text-sm text-[color:var(--color-ink-soft)]">
            Vidéaste & réalisateur · La Réunion · © {new Date().getFullYear()}
          </p>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm text-[color:var(--color-ink-soft)]">
          <a href="#showreel" className="hover:text-[color:var(--color-ink)]">Showreel</a>
          <a href="#services" className="hover:text-[color:var(--color-ink)]">Services</a>
          <a href="#projets" className="hover:text-[color:var(--color-ink)]">Projets</a>
          <a href="#photos" className="hover:text-[color:var(--color-ink)]">Photos</a>
          <a
            href="https://www.instagram.com/j3remie_fvr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[color:var(--color-ink)]"
          >
            Instagram
          </a>
          <a
            href="https://wa.me/262693112398"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[color:var(--color-ink)]"
          >
            WhatsApp
          </a>
          <a
            href="mailto:fvjeremie@gmail.com"
            className="hover:text-[color:var(--color-ink)]"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
