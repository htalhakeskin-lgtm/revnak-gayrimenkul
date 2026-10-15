import type { Listing, Region } from "@/data/types";
import { formatNumber, formatPrice } from "./format";
import { propertyTypeLabels, statusLabels, transactionLabels } from "./labels";
import { siteConfig } from "./site-config";

/** "Bebek · Beşiktaş"; semt adı ilçeyle aynıysa tek kez yazılır ("Ataşehir") */
export function regionLabel(region: Pick<Region, "name" | "district">) {
  return region.name === region.district ? region.name : `${region.name} · ${region.district}`;
}

export function listingUrl(listing: Pick<Listing, "slug">) {
  return `/ilan/${listing.slug}`;
}

export function priceLabel(listing: Pick<Listing, "price" | "transaction">) {
  return listing.transaction === "kiralik" ? `${formatPrice(listing.price)} / ay` : formatPrice(listing.price);
}

export function pricePerM2(listing: Listing) {
  return listing.transaction === "satilik" ? Math.round(listing.price / listing.grossM2) : undefined;
}

export function listingKicker(listing: Listing, region: Region) {
  return `${transactionLabels[listing.transaction]} ${propertyTypeLabels[listing.type].toLocaleLowerCase("tr-TR")} · ${region.name}, ${region.district}`;
}

export function isClosedListing(listing: Listing) {
  return listing.status === "satildi" || listing.status === "kiralandi";
}

export function statusLabel(listing: Listing) {
  return statusLabels[listing.status];
}

/** İlan bazlı WhatsApp mesajı: ilan no ve başlıkla hazır dolu gelir (M06) */
export function whatsappMessage(listing: Listing) {
  return `Merhaba, ${listing.no} numaralı “${listing.title}” ilanı hakkında bilgi almak istiyorum. ${siteConfig.url}${listingUrl(listing)}`;
}

/** İstemci bileşenlerine gönderilecek küçük, serileştirilebilir ilan özeti (favoriler, karşılaştırma) */
export function toSummary(listing: Listing, region: Region) {
  const perM2 = pricePerM2(listing);
  return {
    slug: listing.slug,
    no: listing.no,
    title: listing.title,
    image: listing.images[0],
    status: statusLabels[listing.status],
    closed: isClosedListing(listing),
    transaction: transactionLabels[listing.transaction],
    type: propertyTypeLabels[listing.type],
    price: priceLabel(listing),
    pricePerM2: perM2 ? formatPrice(perM2) : "–",
    region: regionLabel(region),
    rooms: listing.rooms,
    area: `${formatNumber(listing.grossM2)} / ${formatNumber(listing.netM2)} m²`,
    bathrooms: String(listing.bathrooms),
    floor: floorLabel(listing),
    yearBuilt: String(listing.yearBuilt),
    heating: listing.heating,
    parking: listing.parking,
    inSite: listing.inSite ? (listing.siteName ?? "Evet") : "Hayır",
    dues: listing.dues ? formatPrice(listing.dues) : "Yok",
    deed: listing.deed,
    iskan: listing.iskan ? "Var" : "Yok",
    regulation: listing.earthquake.regulation,
    retrofitted: listing.earthquake.retrofitted ? "Yapıldı" : "Yok",
    view: listing.view.join(", ") || "–",
  };
}

export type ListingSummary = ReturnType<typeof toSummary>;

export function floorLabel(listing: Listing) {
  return /^\d+$/.test(listing.floor) ? `${listing.floor}. kat / ${listing.totalFloors}` : listing.floor;
}

export function areaLabel(listing: Listing) {
  return `${formatNumber(listing.netM2)} m² net`;
}
