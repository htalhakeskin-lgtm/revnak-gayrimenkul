import type { MetadataRoute } from "next";
import { getAllListings, getAgents, getPosts, getRegions } from "@/lib/data";
import { listingUrl } from "@/lib/listing-utils";
import { siteConfig } from "@/lib/site-config";

/** Otomatik site haritası (M21). Satılan ilanlar da referans olarak yer alır. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const [listings, regions, posts, agents] = await Promise.all([getAllListings(), getRegions(), getPosts(), getAgents()]);

  const staticPaths = [
    "",
    "/ilanlar",
    "/ilanlar/satilik",
    "/ilanlar/kiralik",
    "/harita",
    "/satilanlar",
    "/bolgeler",
    "/blog",
    "/ekibimiz",
    "/hakkimizda",
    "/hizmetler",
    "/sss",
    "/iletisim",
    "/randevu",
    "/portfoy-ver",
    "/evimi-degerle",
    "/hesaplayicilar",
  ];

  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...listings.map((l) => ({
      url: `${base}${listingUrl(l)}`,
      lastModified: l.closedAt ?? l.publishedAt,
      changeFrequency: "daily" as const,
      priority: l.status === "yayinda" ? 0.9 : 0.4,
    })),
    ...regions.map((r) => ({ url: `${base}/bolgeler/${r.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.publishedAt, priority: 0.6 })),
    ...agents.map((a) => ({ url: `${base}/danisman/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
