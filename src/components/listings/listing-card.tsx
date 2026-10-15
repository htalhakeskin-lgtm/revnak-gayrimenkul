import { Bath, BedDouble, Layers, Play, Ruler, Rotate3d } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Photo } from "@/components/ui/photo";
import type { Listing } from "@/data/types";
import { regionOf } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { propertyTypeLabels, transactionLabels } from "@/lib/labels";
import { floorLabel, listingUrl, priceLabel, regionLabel } from "@/lib/listing-utils";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "./favorite-button";

const sizesGrid = "(min-width: 1280px) 400px, (min-width: 768px) 45vw, 92vw";

/**
 * İlan kartı (İP-16). Hover'da görsel yakınlaşır ve ikinci fotoğrafa geçer (Bölüm 6, sahne 2).
 * Saf CSS; yalnızca transform ve opacity.
 */
export function ListingCard({
  listing,
  priority = false,
  className,
}: {
  listing: Listing;
  priority?: boolean;
  className?: string;
}) {
  const region = regionOf(listing);
  const [cover, second] = listing.images;

  return (
    <article className={cn("group relative", className)}>
      <Link href={listingUrl(listing)} className="block" aria-label={listing.title}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-image)] bg-night-raised">
          <Photo
            src={cover}
            alt={listing.title}
            fill
            sizes={sizesGrid}
            preload={priority}
            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
          />
          {second ? (
            <Photo
              src={second}
              alt=""
              fill
              sizes={sizesGrid}
              className="hidden opacity-0! object-cover [@media(hover:hover)]:block transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06] group-hover:opacity-100!"
            />
          ) : null}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-night/20" />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge tone={listing.transaction === "satilik" ? "gold" : "ivory"}>
              {transactionLabels[listing.transaction]}
            </Badge>
            {listing.status === "opsiyonlu" ? <Badge tone="glass">Opsiyonlu</Badge> : null}
          </div>

          <div className="absolute bottom-4 left-4 flex gap-2">
            {listing.hasVideo ? (
              <span className="grid size-8 place-items-center rounded-full bg-night/60 text-ivory backdrop-blur-md" title="Video">
                <Play size={14} className="fill-current" />
                <span className="sr-only">Videolu ilan</span>
              </span>
            ) : null}
            {listing.hasTour360 ? (
              <span className="grid size-8 place-items-center rounded-full bg-night/60 text-ivory backdrop-blur-md" title="360° tur">
                <Rotate3d size={15} />
                <span className="sr-only">360 derece tur</span>
              </span>
            ) : null}
          </div>
        </div>

        <div className="pt-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            {regionLabel(region)}
          </p>
          <h3 className="mt-2 line-clamp-2 font-serif text-xl leading-snug text-fg transition-colors group-hover:text-accent">
            {listing.title}
          </h3>
          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-muted">
            <li className="flex items-center gap-1.5">
              <BedDouble size={16} aria-hidden /> {listing.rooms}
            </li>
            <li className="flex items-center gap-1.5">
              <Ruler size={16} aria-hidden /> {formatNumber(listing.netM2)} m²
            </li>
            <li className="flex items-center gap-1.5">
              <Bath size={16} aria-hidden /> {listing.bathrooms}
            </li>
            <li className="hidden items-center gap-1.5 sm:flex">
              <Layers size={16} aria-hidden /> {floorLabel(listing)}
            </li>
          </ul>
          <div className="mt-4 flex items-end justify-between gap-4 border-t border-line pt-4">
            <p className="tabular text-xl font-semibold text-fg">{priceLabel(listing)}</p>
            <p className="text-xs text-fg-muted">
              {propertyTypeLabels[listing.type]} · {listing.no}
            </p>
          </div>
        </div>
      </Link>
      <FavoriteButton slug={listing.slug} title={listing.title} className="absolute top-3 right-3 z-10" />
    </article>
  );
}

/** Koyu vitrin şeritleri için: metin görselin üzerinde */
export function ListingCardOverlay({ listing, priority = false }: { listing: Listing; priority?: boolean }) {
  const region = regionOf(listing);
  return (
    <article className="group relative">
      <Link
        href={listingUrl(listing)}
        className="relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-image)] bg-night-raised"
      >
        <Photo
          src={listing.images[0]}
          alt={listing.title}
          fill
          sizes="(min-width: 1024px) 420px, 80vw"
          preload={priority}
          className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
        />
        {listing.images[1] ? (
          <Photo
            src={listing.images[1]}
            alt=""
            fill
            sizes="(min-width: 1024px) 420px, 80vw"
            className="hidden opacity-0! object-cover [@media(hover:hover)]:block transition-[opacity,transform] duration-700 group-hover:scale-[1.07] group-hover:opacity-100!"
          />
        ) : null}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
        <div className="absolute top-4 left-4">
          <Badge tone={listing.transaction === "satilik" ? "gold" : "ivory"}>
            {transactionLabels[listing.transaction]}
          </Badge>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
          <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
            {regionLabel(region)}
          </p>
          <h3 className="mt-2 line-clamp-2 font-serif text-2xl leading-tight">{listing.title}</h3>
          <div className="mt-4 flex items-center justify-between gap-4 text-sm">
            <span className="tabular text-lg font-semibold">{priceLabel(listing)}</span>
            <span className="text-ivory/70">
              {listing.rooms} · {formatNumber(listing.netM2)} m²
            </span>
          </div>
        </div>
      </Link>
      <FavoriteButton slug={listing.slug} title={listing.title} className="absolute top-3 right-3 z-10" />
    </article>
  );
}
