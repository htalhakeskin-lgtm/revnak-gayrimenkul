import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { Photo } from "@/components/ui/photo";
import { getRegions } from "@/lib/data";

/**
 * Sahne 7 — "Evinizin değeri ne kadar?" tam genişlik CTA bandı.
 * Mini form değerleme sihirbazına (/evimi-degerle) ön dolu olarak geçer.
 */
export async function ValuationCta() {
  const regions = await getRegions();
  return (
    <section className="tone-dark relative isolate overflow-hidden" aria-labelledby="valuation-title">
      <Parallax className="absolute inset-0 -z-10" amount={8}>
        <Photo src="1600047509807-ba8f99d2cdde" alt="" fill sizes="100vw" className="object-cover" />
      </Parallax>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/85 to-night/40" />

      <div className="container-site grid gap-12 py-28 md:py-36 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="eyebrow mb-4">Ücretsiz değerleme</p>
          <h2 id="valuation-title" className="text-h1">
            Evinizin değeri
            <br />
            ne kadar?
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ivory/80">
            Birkaç bilgiyle başlayın; bölgedeki benzer satışlara dayanan ön değerlendirmeyi uzman
            danışmanımız 24 saat içinde sizinle paylaşsın.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <form
            action="/evimi-degerle"
            className="rounded-[20px] border border-white/10 bg-night/60 p-6 backdrop-blur-xl md:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">Konum</span>
                <select
                  name="bolge"
                  defaultValue=""
                  className="h-12 rounded-xl border border-night-line bg-night-raised px-4 text-ivory"
                >
                  <option value="">Bölge seçin</option>
                  {regions.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {r.name}, {r.district}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">Brüt m²</span>
                <input
                  name="m2"
                  type="number"
                  inputMode="numeric"
                  min={20}
                  max={5000}
                  placeholder="ör. 140"
                  className="h-12 rounded-xl border border-night-line bg-night-raised px-4 text-ivory placeholder:text-muted"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">Oda</span>
                <select
                  name="oda"
                  defaultValue="3+1"
                  className="h-12 rounded-xl border border-night-line bg-night-raised px-4 text-ivory"
                >
                  {["1+1", "2+1", "3+1", "4+1", "5+1 ve üzeri"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
            </div>
            <Magnetic className="mt-6 block w-full sm:inline-block sm:w-auto">
              <button
                type="submit"
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gold px-8 font-semibold text-night transition-colors hover:bg-[#d3b47f] sm:w-auto"
              >
                Değerlemeye devam et <ArrowRight size={18} />
              </button>
            </Magnetic>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
