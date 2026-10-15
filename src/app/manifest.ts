import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/** PWA: ana ekrana eklenebilir (Bölüm 1.3) */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.fullName,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0e1114",
    theme_color: "#0e1114",
    lang: "tr",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
