import { ArrowRight } from "lucide-react";
import { ListingCardOverlay } from "@/components/listings/listing-card";
import { ButtonLink } from "@/components/ui/button";
import { ScrollStrip } from "@/components/ui/scroll-strip";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedListings } from "@/lib/data";

/** Sahne 2 — Öne çıkan ilanlar: sürüklenebilir yatay kart şeridi */
export async function FeaturedListings() {
  const featured = await getFeaturedListings(8);
  return (
    <section className="tone-dark py-24 md:py-32" aria-labelledby="featured-title">
      <div className="container-site">
        <SectionHeading
          eyebrow="Seçkin portföy"
          title={<span id="featured-title">Öne çıkan ilanlar</span>}
          description="Danışmanlarımızın bu hafta öne çıkardığı, belgeleri hazır ve gösterime açık evler."
          action={
            <ButtonLink href="/ilanlar" variant="outline">
              Tüm ilanlar <ArrowRight size={16} />
            </ButtonLink>
          }
        />
      </div>
      <ScrollStrip label="Öne çıkan ilanlar" className="mt-14" itemClassName="w-[80vw] sm:w-[44vw] lg:w-[26rem]">
        {featured.map((listing) => (
          <ListingCardOverlay key={listing.id} listing={listing} />
        ))}
      </ScrollStrip>
    </section>
  );
}
