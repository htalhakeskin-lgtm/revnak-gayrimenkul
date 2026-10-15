import type { Metadata } from "next";
import { FavoritesView } from "@/components/listings/saved-listings";
import { PageHero } from "@/components/ui/page-hero";
import { getAllListings, regionOf } from "@/lib/data";
import { toSummary } from "@/lib/listing-utils";

export const metadata: Metadata = {
  title: "Favorilerim",
  robots: { index: false },
};

export default async function FavoritesPage() {
  const all = (await getAllListings()).map((l) => toSummary(l, regionOf(l)));
  return (
    <>
      <PageHero
        eyebrow="Hesabım"
        title="Favorilerim"
        description="Giriş yapmadan beğendiğiniz ilanları burada saklıyoruz. Gerçek sürümde üye olunca hesabınıza taşınır."
        crumbs={[{ name: "Favorilerim", path: "/favoriler" }]}
        size="sm"
      />
      <section className="tone-light min-h-[50vh] py-16">
        <div className="container-site">
          <FavoritesView all={all} />
        </div>
      </section>
    </>
  );
}
