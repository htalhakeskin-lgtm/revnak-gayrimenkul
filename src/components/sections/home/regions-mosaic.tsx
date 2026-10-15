import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Photo } from "@/components/ui/photo";
import { SectionHeading } from "@/components/ui/section-heading";
import { getRegionListingCounts, getRegions } from "@/lib/data";
import { cn } from "@/lib/utils";

// Büyük-küçük karışık mozaik (Bölüm 6, sahne 4). 4 kolonda boşluksuz:
// 1. satır: [Bebek ][Bebek ][Yeniköy][Moda]
// 2. satır: [Bebek ][Bebek ][Nişantaşı     ]
// 3. satır: [Zekeriyaköy   ][Yalıkavak     ]
const order = ["bebek", "yenikoy", "moda", "nisantasi", "zekeriyakoy", "yalikavak"];
const layout = [
  "sm:col-span-2 md:row-span-2",
  "",
  "",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
];

/** Sahne 4 — Bölgeler: mahalle mozaiği, hover'da yakınlaşma + ilan sayısı rozeti */
export async function RegionsMosaic() {
  const [regions, counts] = await Promise.all([getRegions(), getRegionListingCounts()]);
  const shown = order
    .map((slug) => regions.find((r) => r.slug === slug))
    .filter((r) => r !== undefined);

  return (
    <section className="tone-dark py-24 md:py-32" aria-labelledby="regions-title">
      <div className="container-site">
        <SectionHeading
          eyebrow="Bölge rehberleri"
          title={<span id="regions-title">Yaşamak istediğiniz semti seçin</span>}
          description="Her bölgenin ulaşımını, okullarını, sosyal yaşamını ve ortalama fiyatlarını danışmanlarımızın gözünden anlattık."
          action={
            <Link href="/bolgeler" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline">
              Tüm bölgeler <ArrowUpRight size={16} />
            </Link>
          }
        />
        <RevealGroup className="mt-14 grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[17rem] md:grid-cols-4">
          {shown.map((region, i) => (
            <RevealItem key={region.slug} className={cn("h-full", layout[i])}>
              <Link
                href={`/bolgeler/${region.slug}`}
                className="group relative block h-full overflow-hidden rounded-[var(--radius-image)] bg-night-raised"
              >
                <Photo
                  src={region.image}
                  alt={`${region.name}, ${region.district}`}
                  fill
                  sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
                  style={{ objectPosition: region.imageFocus }}
                  className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent" />
                <span className="absolute top-4 right-4 rounded-full bg-night/60 px-3 py-1 text-xs font-semibold text-ivory backdrop-blur-md">
                  {counts[region.slug] ?? 0} ilan
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">{region.district}</p>
                  <h3 className={cn("mt-1 font-serif text-ivory", i === 0 ? "text-4xl" : "text-2xl")}>
                    {region.name}
                  </h3>
                  <p className="mt-2 max-w-xs translate-y-2 text-sm text-ivory/75 opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    {region.tagline}
                  </p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
