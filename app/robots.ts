import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/card", "/backoffice", "/api/"],
    },
    sitemap: "https://socios.necc.pt/sitemap.xml",
  };
}
