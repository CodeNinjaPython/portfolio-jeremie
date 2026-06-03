import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://jeremiefavre.com/sitemap.xml",
    host: "https://jeremiefavre.com",
  };
}
