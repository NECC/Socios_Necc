import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://socios.necc.pt",
      lastModified: new Date(),
    },
  ];
}