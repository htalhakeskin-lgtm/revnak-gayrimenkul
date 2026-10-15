import type { Metadata } from "next";
import { Calculators } from "@/components/calculators/calculators";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Hesaplayıcılar",
  description: "Konut kredisi taksiti, tapu harcı ve masraflar, kira getirisi ve amortisman hesaplayıcıları.",
  alternates: { canonical: "/hesaplayicilar" },
};

export default function CalculatorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Araçlar"
        title="Hesaplayıcılar"
        description="Kredi taksitinizi, tapu masraflarını ve yatırımınızın kira getirisini birkaç saniyede hesaplayın."
        crumbs={[{ name: "Hesaplayıcılar", path: "/hesaplayicilar" }]}
        size="sm"
      />
      <section className="tone-light py-16 md:py-24">
        <div className="container-site">
          <Calculators />
        </div>
      </section>
    </>
  );
}
