import type { Metadata } from "next";
import { MapSearch, type MapListing } from "@/components/map/map-search";
import { getActiveListings, regionOf } from "@/lib/data";
import { formatPriceShort } from "@/lib/format";
import { priceLabel, regionLabel } from "@/lib/listing-utils";

export const metadata: Metadata = {
  title: "Harita ile ara",
  description: "İstanbul ve Bodrum'daki satılık ve kiralık ilanları harita üzerinde keşfedin.",
  alternates: { canonical: "/harita" },
};

export default async function MapPage() {
  const listings = await getActiveListings();
  const items: MapListing[] = listings.map((l) => ({
    id: l.id,
    slug: l.slug,
    no: l.no,
    title: l.title,
    transaction: l.transaction,
    price: l.price,
    priceLabel: priceLabel(l),
    priceShort: l.transaction === "kiralik" ? `${formatPriceShort(l.price)}/ay` : formatPriceShort(l.price),
    lat: l.lat,
    lng: l.lng,
    image: l.images[0],
    rooms: l.rooms,
    netM2: l.netM2,
    regionLabel: regionLabel(regionOf(l)),
  }));

  return (
    <section className="tone-dark pt-[102px]">
      <h1 className="sr-only">Harita ile ara</h1>
      <MapSearch listings={items} />
    </section>
  );
}
