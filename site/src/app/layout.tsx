import type { Metadata, Viewport } from "next";
import { Manrope, Syne } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const GA_ID = "G-ZSLE032V4E";

export const viewport: Viewport = {
  themeColor: "#07090c",
  width: "device-width",
  initialScale: 1,
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jeremiefavre.com"),
  title: {
    default: "Jérémie Favre — Réalisateur & Vidéaste · La Réunion",
    template: "%s — Jérémie Favre",
  },
  description:
    "Réalisation, captation, drone FPV et post-production haut de gamme à La Réunion. Films de marque, documentaires, événements premium.",
  keywords: [
    "vidéaste La Réunion",
    "réalisateur La Réunion",
    "film de marque",
    "captation drone",
    "drone FPV",
    "vidéo entreprise",
    "documentaire",
    "montage vidéo",
  ],
  authors: [{ name: "Jérémie Favre" }],
  creator: "Jérémie Favre",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Jérémie Favre — Réalisateur & Vidéaste",
    description:
      "Films de marque, documentaires, contenu social et captation drone à La Réunion.",
    url: "https://jeremiefavre.com",
    siteName: "Jérémie Favre",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Jérémie Favre — Réalisateur & Vidéaste à La Réunion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jérémie Favre — Réalisateur & Vidéaste",
    description:
      "Réalisation, captation, drone et post-production haut de gamme à La Réunion.",
    images: ["/og.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Jérémie Favre — Réalisateur & Vidéaste",
  description:
    "Réalisation, captation, drone FPV et post-production haut de gamme à La Réunion.",
  url: "https://jeremiefavre.com",
  email: "fvjeremie@gmail.com",
  telephone: "+262693112398",
  image: "https://jeremiefavre.com/og.jpg",
  priceRange: "€€",
  areaServed: { "@type": "Place", name: "La Réunion" },
  address: {
    "@type": "PostalAddress",
    addressRegion: "La Réunion",
    addressCountry: "FR",
  },
  founder: { "@type": "Person", name: "Jérémie Favre", jobTitle: "Réalisateur & Vidéaste" },
  sameAs: [
    "https://www.instagram.com/j3remie_fvr",
    "https://www.tiktok.com/@jerem_fvr",
  ],
  knowsAbout: [
    "Film de marque",
    "Documentaire",
    "Captation drone",
    "Montage & étalonnage",
    "Sound design",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
      <GoogleAnalytics gaId={GA_ID} />
    </html>
  );
}
