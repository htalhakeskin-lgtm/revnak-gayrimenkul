import Link from "next/link";
import { SoldStamp } from "@/components/motion/sold-stamp";
import { Photo } from "@/components/ui/photo";
import type { Listing } from "@/data/types";
import { daysOnMarket, regionOf } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { listingUrl, priceLabel, regionLabel } from "@/lib/listing-utils";

/** Satılan / kiralanan referans kartı (M03). Fiyat yalnızca mülk sahibi izin verdiyse görünür (K4b). */
export function SoldCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const region = regionOf(listing);
  const days = daysOnMarket(listing);
  const rented = listing.status === "kiralandi";

  return (
    <article className="group">
      <Link href={listingUrl(listing)} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-image)] bg-night-raised">
          <Photo
            src={listing.images[0]}
            alt={listing.title}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            className="object-cover grayscale-[35%] transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div aria-hidden className="absolute inset-0 bg-night/45" />
          <SoldStamp
            label={rented ? "Kiralandı" : "Satıldı"}
            sub={days !== undefined ? `${days} günde` : undefined}
            delay={0.15 + index * 0.12}
          />
        </div>
        <div className="pt-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            {regionLabel(region)}
          </p>
          <h3 className="mt-2 font-serif text-xl text-fg">{listing.title}</h3>
          <p className="mt-2 text-sm text-fg-muted">
            {listing.rooms} · {listing.netM2} m² net
            {listing.closedAt ? ` · ${formatDate(listing.closedAt)}` : ""}
          </p>
          <p className="mt-3 text-sm font-semibold text-fg">
            {listing.showClosedPrice ? priceLabel(listing) : "Fiyat mülk sahibinin talebiyle gizli"}
          </p>
        </div>
      </Link>
    </article>
  );
}
