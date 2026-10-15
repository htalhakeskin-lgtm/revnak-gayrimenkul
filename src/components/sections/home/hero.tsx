import { FadeUp, SplitText } from "@/components/motion/split-text";
import { Photo } from "@/components/ui/photo";
import { getRegions } from "@/lib/data";
import { HeroSearch } from "./hero-search";

const baseImage = "1600585154340-be6161a56a0c";
const cycleImages = [
  "1613553507747-5f8d62ad5904",
  "1599809275671-b5942cabc7a2",
  "1589561454226-796a8aa89b05",
];

/**
 * Sahne 1 — Hero (Bölüm 6). Video yerine sinematik görsel döngüsü:
 * taban görsel ilk karede hazırdır (LCP), diğerleri yalnızca masaüstünde yüklenir (kural 5).
 */
export async function Hero() {
  const regions = await getRegions();

  return (
    <section className="tone-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="animate-ken-burns absolute inset-0">
          <Photo
            src={baseImage}
            alt=""
            fill
            preload
            fade={false}
            sizes="100vw"
            quality={75}
            className="object-cover"
          />
        </div>
        {cycleImages.map((id, i) => (
          <div
            key={id}
            className="hero-slide absolute inset-0 hidden md:block"
            style={{ animationDelay: `${(i + 1) * 6}s` }}
          >
            <Photo src={id} alt="" fill sizes="100vw" quality={60} className="object-cover" />
          </div>
        ))}
        <div className="fade-to-night absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/70 via-night/20 to-transparent" />
      </div>

      <div className="container-site flex flex-1 flex-col justify-end pt-40 pb-14 md:pb-20">
        <FadeUp delay={0.1}>
          <p className="eyebrow mb-6">Boğaz · Anadolu yakası · Bodrum</p>
        </FadeUp>
        <SplitText
          text={"Boğaz'dan Ege'ye,\nseçkin yaşam alanları."}
          className="max-w-4xl text-display text-ivory"
          delay={0.2}
        />
        <FadeUp delay={0.75}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/80 md:text-lg">
            Belgesi hazır, deprem bilgisi açık, danışmanı ulaşılabilir ilanlar. Aradığınız evi birlikte
            bulalım.
          </p>
        </FadeUp>
        <FadeUp delay={0.95} className="mt-10">
          <HeroSearch regions={regions.map((r) => ({ slug: r.slug, name: r.name, district: r.district }))} />
        </FadeUp>
      </div>

      <div aria-hidden className="absolute right-8 bottom-10 hidden flex-col items-center gap-3 lg:flex">
        <span className="text-[0.625rem] tracking-[0.3em] text-ivory/60 uppercase [writing-mode:vertical-rl]">
          Kaydırın
        </span>
        <span className="relative h-16 w-px overflow-hidden bg-ivory/20">
          <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-gold" />
        </span>
      </div>
    </section>
  );
}
