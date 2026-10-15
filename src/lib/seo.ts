import type { Agent, Listing, Post, Region } from "@/data/types";
import { listingUrl } from "./listing-utils";
import { siteConfig } from "./site-config";
import { unsplash } from "./utils";

/** schema.org yapılandırılmış verileri (M21) */

const abs = (path: string) => `${siteConfig.url}${path}`;

export function organizationSchema() {
  const { contact } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": abs("/#organization"),
    name: siteConfig.fullName,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    description: siteConfig.description,
    telephone: contact.phoneE164,
    email: contact.email,
    foundingDate: String(siteConfig.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.addressLine,
      addressLocality: contact.district,
      addressRegion: contact.city,
      postalCode: contact.postalCode,
      addressCountry: "TR",
    },
    geo: { "@type": "GeoCoordinates", latitude: contact.lat, longitude: contact.lng },
    sameAs: Object.values(siteConfig.social),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function listingSchema(listing: Listing, region: Region, agent: Agent) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.summary,
    url: abs(listingUrl(listing)),
    datePosted: listing.publishedAt,
    image: listing.images.slice(0, 4).map(unsplash),
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "TRY",
      availability:
        listing.status === "yayinda" || listing.status === "opsiyonlu"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      businessFunction:
        listing.transaction === "kiralik" ? "https://schema.org/LeaseOut" : "https://schema.org/Sell",
      seller: { "@id": abs("/#organization") },
    },
    about: {
      "@type": listing.type === "villa" || listing.type === "mustakil" ? "SingleFamilyResidence" : "Apartment",
      numberOfRooms: Number.parseInt(listing.rooms, 10) || undefined,
      numberOfBathroomsTotal: listing.bathrooms,
      floorSize: { "@type": "QuantitativeValue", value: listing.netM2, unitCode: "MTK" },
      yearBuilt: listing.yearBuilt,
      address: {
        "@type": "PostalAddress",
        addressLocality: region.district,
        addressRegion: region.city,
        addressCountry: "TR",
      },
    },
    provider: { "@type": "Person", name: agent.name },
  };
}

export function articleSchema(post: Post, author: Agent) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: unsplash(post.cover),
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: author.name },
    publisher: { "@id": abs("/#organization") },
    mainEntityOfPage: abs(`/blog/${post.slug}`),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
