import { BarChart3, Camera, FileCheck2, Users } from "lucide-react";
import type { Metadata } from "next";
import { SelectField, TextField } from "@/components/forms/fields";
import { LeadForm } from "@/components/forms/lead-form";
import { PageHero } from "@/components/ui/page-hero";
import { getRegions } from "@/lib/data";
import { propertyTypeLabels } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Portföyümü vermek istiyorum",
  description: "Evinizi satmak veya kiraya vermek için bize ulaşın: değerleme, profesyonel çekim ve hedefli pazarlama.",
  alternates: { canonical: "/portfoy-ver" },
};

const promises = [
  { Icon: BarChart3, title: "Gerekçeli fiyat", text: "Benzer satışlara dayalı değerleme raporu." },
  { Icon: Camera, title: "Profesyonel çekim", text: "Fotoğraf, video ve 360° tur bizden." },
  { Icon: Users, title: "Hazır alıcı listesi", text: "Kriterleri eşleşen alıcılara ilk gün bildirim." },
  { Icon: FileCheck2, title: "Aylık rapor", text: "Görüntülenme, gösterim ve geri bildirimler." },
];

export default async function PortfolioPage() {
  const regions = await getRegions();
  return (
    <>
      <PageHero
        size="lg"
        image="1613977257363-707ba9348227"
        eyebrow="Mülk sahipleri için"
        title="Evinizi bize emanet edin"
        description="Satış veya kiralama: değerlemeden tapu gününe kadar tek bir sorumlu danışman ve şeffaf bir süreç."
        crumbs={[{ name: "Portföy ver", path: "/portfoy-ver" }]}
      />
      <section className="tone-light py-16 md:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <aside className="grid gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {promises.map(({ Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-fg-muted">{text}</p>
                </div>
              </div>
            ))}
          </aside>
          <div className="rounded-[20px] border border-line bg-raised p-6 md:p-10 lg:col-span-8">
            <h2 className="text-h3">Mülkünüzü anlatın</h2>
            <p className="mt-2 mb-8 text-fg-muted">Bölgenizin uzmanı 24 saat içinde sizi arasın.</p>
            <LeadForm
              kind="portfoy"
              idPrefix="portfoy"
              submitLabel="Başvuruyu gönder"
              extraFields={
                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField id="portfoy-region" name="region" label="Bölge" defaultValue="">
                    <option value="">Seçin</option>
                    {regions.map((r) => (
                      <option key={r.slug} value={r.slug}>
                        {r.name}, {r.district}
                      </option>
                    ))}
                    <option value="diger">Diğer</option>
                  </SelectField>
                  <SelectField id="portfoy-type" name="propertyType" label="Mülk tipi" defaultValue="daire">
                    {Object.entries(propertyTypeLabels).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField id="portfoy-intent" name="condition" label="Amacınız" defaultValue="satis">
                    <option value="satis">Satmak istiyorum</option>
                    <option value="kiralama">Kiraya vermek istiyorum</option>
                    <option value="karar">Henüz karar vermedim</option>
                  </SelectField>
                  <TextField id="portfoy-m2" name="m2" label="Brüt m²" type="number" inputMode="numeric" min={15} optional />
                </div>
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}
