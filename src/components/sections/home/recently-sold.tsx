import { ArrowRight } from "lucide-react";
import { SoldCard } from "@/components/listings/sold-card";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getClosedListings } from "@/lib/data";

/** Sahne 6 — Son satılanlar */
export async function RecentlySold() {
  const sold = await getClosedListings(3);
  return (
    <section className="tone-dark py-24 md:py-32" aria-labelledby="sold-title">
      <div className="container-site">
        <SectionHeading
          eyebrow="Referanslarımız"
          title={<span id="sold-title">Son satılan ve kiralananlar</span>}
          description="Her ilan, doğru fiyat ve doğru alıcıyla buluştuğunda buraya taşınır."
          action={
            <ButtonLink href="/satilanlar" variant="outline">
              Tüm referanslar <ArrowRight size={16} />
            </ButtonLink>
          }
        />
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {sold.map((listing, i) => (
            <SoldCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
