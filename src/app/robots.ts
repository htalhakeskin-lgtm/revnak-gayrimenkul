import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/** Demo: kurgusal ilanlar taranmasın (K15). siteConfig.demo = false olunca açılır. */
export default function robots(): MetadataRoute.Robots {
  if (siteConfig.demo) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/panel", "/favoriler", "/karsilastir"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
