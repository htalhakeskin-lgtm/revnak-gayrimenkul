import { ArrowRight, Bath, BedDouble, Layers, Ruler } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Photo } from "@/components/ui/photo";
import type { Listing } from "@/data/types";
import { agentOf, regionOf } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { propertyTypeLabels, transactionLabels } from "@/lib/labels";
import { floorLabel, listingUrl, priceLabel, regionLabel } from "@/lib/listing-utils";
import { FavoriteButton } from "./favorite-button";

/** Liste görünümü için yatay ilan kartı (M02: Liste ↔ Izgara ↔ Harita) */
export function ListingRow({ listing, priority = false }: { listing: Listing; priority?: boolean }) {
  const region = regionOf(listing);
  const agent = agentOf(listing);

  return (
    <article className="group relative grid overflow-hidden rounded-[var(--radius-image)] border border-line bg-raised md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <Link href={listingUrl(listing)} className="relative block aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-72" tabIndex={-1} aria-hidden>
        <Photo
          src={listing.images[0]}
          alt=""
          fill
          preload={priority}
          sizes="(min-width: 768px) 40vw, 92vw"
          className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge tone={listing.transaction === "satilik" ? "gold" : "ivory"}>{transactionLabels[listing.transaction]}</Badge>
          {listing.status === "opsiyonlu" ? <Badge>Opsiyonlu</Badge> : null}
        </div>
      </Link>
      <div className="flex flex-col p-6 md:p-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
          {regionLabel(region)} · {listing.no}
        </p>
        <h3 className="mt-2 font-serif text-2xl leading-snug text-fg">
          <Link href={listingUrl(listing)} className="hover:text-accent">
            {listing.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-2 leading-relaxed text-fg-muted">{listing.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-muted">
          <li className="flex items-center gap-1.5">
            <BedDouble size={16} aria-hidden /> {listing.rooms}
          </li>
          <li className="flex items-center gap-1.5">
            <Ruler size={16} aria-hidden /> {formatNumber(listing.grossM2)} / {formatNumber(listing.netM2)} m²
          </li>
          <li className="flex items-center gap-1.5">
            <Bath size={16} aria-hidden /> {listing.bathrooms} banyo
          </li>
          <li className="flex items-center gap-1.5">
            <Layers size={16} aria-hidden /> {floorLabel(listing)}
          </li>
        </ul>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5 md:mt-8">
          <div>
            <p className="tabular text-2xl font-semibold text-fg">{priceLabel(listing)}</p>
            <p className="mt-1 text-xs text-fg-muted">
              {propertyTypeLabels[listing.type]} · Danışman: {agent.name}
            </p>
          </div>
          <Link
            href={listingUrl(listing)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            İlanı incele <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <FavoriteButton slug={listing.slug} title={listing.title} className="absolute top-3 right-3 z-10 md:right-auto md:left-[calc(40%-3.25rem)]" />
    </article>
  );
}
