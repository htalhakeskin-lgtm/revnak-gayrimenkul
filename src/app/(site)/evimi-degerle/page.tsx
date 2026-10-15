import type { Metadata } from "next";
import { Suspense } from "react";
import { ValuationWizard } from "@/components/forms/valuation-wizard";
import { PageHero } from "@/components/ui/page-hero";
import { getRegions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Evimin değeri ne kadar?",
  description: "Birkaç adımda evinizin bilgilerini girin; bölgedeki benzer satışlara dayalı ücretsiz değerleme isteyin.",
  alternates: { canonical: "/evimi-degerle" },
};

export default async function ValuationPage() {
  const regions = (await getRegions()).map((r) => ({
    slug: r.slug,
    name: r.name,
    district: r.district,
    avgPricePerM2: r.avgPricePerM2,
  }));
  return (
    <>
      <PageHero
        eyebrow="Ücretsiz değerleme"
        title="Evinizin değeri ne kadar?"
        description="Beş kısa adım. Sonunda kaba bir ön tahmin görecek, dilerseniz uzmanımızdan gerekçeli değerleme isteyeceksiniz."
        crumbs={[{ name: "Evimi değerle", path: "/evimi-degerle" }]}
        size="sm"
      />
      <section className="tone-light py-16 md:py-24">
        <div className="container-site max-w-5xl">
          <div className="rounded-[20px] border border-line bg-raised p-6 md:p-12">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-[14px] bg-fg/5" aria-hidden />}>
              <ValuationWizard regions={regions} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
