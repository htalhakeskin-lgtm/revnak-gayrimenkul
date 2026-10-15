import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/ui/page-hero";
import { Photo } from "@/components/ui/photo";
import { getRegionListingCounts, getRegions } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Bölge rehberleri",
  description: "Bebek, Yeniköy, Nişantaşı, Moda, Caddebostan, Yalıkavak ve diğer bölgeler: ulaşım, okullar, yaşam ve ortalama fiyatlar.",
  alternates: { canonical: "/bolgeler" },
};

export default async function RegionsPage() {
  const [regions, counts] = await Promise.all([getRegions(), getRegionListingCounts()]);
  return (
    <>
      <PageHero
        eyebrow="Bölge rehberleri"
        title="Semtleri danışmanlarımızın gözünden tanıyın"
        description="Ulaşım, okullar, sosyal yaşam ve metrekare fiyatları. Hangi semtin size uygun olduğuna birlikte karar verelim."
        crumbs={[{ name: "Bölgeler", path: "/bolgeler" }]}
      />
      <section className="tone-dark pb-24">
        <div className="container-site">
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((region) => (
              <RevealItem key={region.slug}>
                <Link
                  href={`/bolgeler/${region.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-image)] bg-night-raised"
                >
                  <Photo
                    src={region.image}
                    alt={`${region.name}, ${region.district}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                    style={{ objectPosition: region.imageFocus }}
                    className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
                  <span className="absolute top-4 right-4 rounded-full bg-night/60 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                    {counts[region.slug] ?? 0} aktif ilan
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
                      {region.district} · {region.city}
                    </p>
                    <h2 className="mt-2 flex items-center justify-between font-serif text-3xl">
                      {region.name}
                      <ArrowUpRight className="text-gold transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </h2>
                    <p className="mt-2 text-sm text-ivory/75">{region.tagline}</p>
                    <p className="tabular mt-4 text-xs text-muted">
                      Ort. {formatPrice(region.avgPricePerM2)} / m² · Kira {formatPrice(region.avgRentPerM2)} / m²
                    </p>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
          <p className="mt-10 text-xs text-muted">Ortalama fiyatlar kurgusaldır (demo).</p>
        </div>
      </section>
    </>
  );
}
