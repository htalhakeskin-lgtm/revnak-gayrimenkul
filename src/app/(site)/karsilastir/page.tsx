import type { Metadata } from "next";
import { CompareView } from "@/components/listings/saved-listings";
import { PageHero } from "@/components/ui/page-hero";
import { getAllListings, regionOf } from "@/lib/data";
import { toSummary } from "@/lib/listing-utils";

export const metadata: Metadata = {
  title: "İlan karşılaştırma",
  robots: { index: false },
};

export default async function ComparePage() {
  const all = (await getAllListings()).map((l) => toSummary(l, regionOf(l)));
  return (
    <>
      <PageHero
        eyebrow="Karşılaştır"
        title="Yan yana karşılaştırın"
        description="Fiyat, metrekare, bina ve deprem bilgilerini tek tabloda görün."
        crumbs={[{ name: "Karşılaştır", path: "/karsilastir" }]}
        size="sm"
      />
      <section className="tone-light min-h-[50vh] py-16">
        <div className="container-site">
          <CompareView all={all} />
        </div>
      </section>
    </>
  );
}
