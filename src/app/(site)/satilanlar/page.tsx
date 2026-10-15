import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { SoldCard } from "@/components/listings/sold-card";
import { Counter } from "@/components/motion/counter";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { daysOnMarket, getClosedListings, regionOf } from "@/lib/data";

export const metadata: Metadata = {
  title: "Satılanlar ve kiralananlar",
  description: "Revnak danışmanlığıyla satılan ve kiralanan konutlar. Ortalama satış süresi ve bölge dağılımı.",
  alternates: { canonical: "/satilanlar" },
};

/** Satılanlar & Kiralananlar (M03 / İP-19) */
export default async function SoldPage() {
  const closed = await getClosedListings();
  const sold = closed.filter((l) => l.status === "satildi");
  const days = closed.map((l) => daysOnMarket(l) ?? 0);
  const avgDays = Math.round(days.reduce((a, b) => a + b, 0) / Math.max(days.length, 1));
  const byRegion = new Map<string, number>();
  for (const l of closed) {
    const name = regionOf(l).name;
    byRegion.set(name, (byRegion.get(name) ?? 0) + 1);
  }

  return (
    <>
      <PageHero
        size="lg"
        image="1416331108676-a22ccb276e35"
        eyebrow="Referanslarımız"
        title={"Doğru fiyat,\ndoğru alıcı."}
        description="Satılan ilanlar silinmez; referans olarak burada kalır. Satış fiyatları yalnızca mülk sahibinin onayıyla paylaşılır."
        crumbs={[{ name: "Satılanlar", path: "/satilanlar" }]}
      />

      <section className="tone-dark border-y border-night-line" aria-label="Satış istatistikleri">
        <div className="container-site grid grid-cols-2 lg:grid-cols-4">
          <Stat value={closed.length} label="Son dönemde sonuçlanan" />
          <Stat value={sold.length} label="Satış" />
          <Stat value={avgDays} suffix=" gün" label="Ortalama sonuçlanma süresi" />
          <Stat value={byRegion.size} label="Bölgede işlem" />
        </div>
      </section>

      <section className="tone-dark py-20 md:py-28">
        <div className="container-site">
          <ul className="mb-14 flex flex-wrap gap-2" aria-label="Bölge dağılımı">
            {[...byRegion.entries()].map(([name, count]) => (
              <li key={name} className="rounded-full border border-night-line px-4 py-2 text-sm text-muted">
                {name} <span className="ml-1 font-semibold text-gold">{count}</span>
              </li>
            ))}
          </ul>
          <RevealGroup className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {closed.map((listing, i) => (
              <RevealItem key={listing.id}>
                <SoldCard listing={listing} index={i % 3} />
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="mt-20 flex flex-col items-start justify-between gap-6 rounded-[20px] border border-night-line bg-night-raised p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h2 className="text-h3">Evinizi de aynı özenle satalım.</h2>
              <p className="mt-2 text-muted">Ücretsiz değerleme ile başlayın; size özel pazarlama planını birlikte hazırlayalım.</p>
            </div>
            <ButtonLink href="/evimi-degerle" size="lg">
              Değerleme iste <ArrowRight size={18} />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  return (
    <div className="border-night-line py-12 text-center odd:border-r lg:border-r lg:last:border-r-0">
      <Counter value={value} suffix={suffix} className="tabular block font-serif text-5xl" />
      <span className="mt-3 block text-xs font-semibold tracking-[0.16em] text-muted uppercase">{label}</span>
    </div>
  );
}
