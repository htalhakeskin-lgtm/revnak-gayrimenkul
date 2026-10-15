import { Bus, GraduationCap, Sparkles, Sun } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { AgentCard } from "@/components/agents/agent-card";
import { ListingCard } from "@/components/listings/listing-card";
import { MiniMap } from "@/components/map/mini-map";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { getAgents, getRegion, getRegionListings, getRegions } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export async function generateStaticParams() {
  return (await getRegions()).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata(props: PageProps<"/bolgeler/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const region = await getRegion(slug);
  if (!region) return { title: "Bölge bulunamadı" };
  return {
    title: `${region.name} bölge rehberi`,
    description: `${region.name}, ${region.district}: ${region.tagline}. Ulaşım, okullar, yaşam ve ortalama fiyatlar.`,
    alternates: { canonical: `/bolgeler/${region.slug}` },
  };
}

export default function RegionPage(props: PageProps<"/bolgeler/[slug]">) {
  return (
    <Suspense fallback={<div className="tone-dark min-h-[80vh]" />}>
      <RegionDetail params={props.params} />
    </Suspense>
  );
}

async function RegionDetail({ params }: { params: PageProps<"/bolgeler/[slug]">["params"] }) {
  const { slug } = await params;
  const region = await getRegion(slug);
  if (!region) notFound();
  const [listings, agents] = await Promise.all([getRegionListings(slug), getAgents()]);
  const experts = agents.filter((a) => a.regions.includes(slug));

  return (
    <>
      <PageHero
        size="lg"
        image={region.image}
        imageFocus={region.imageFocus}
        eyebrow={`${region.district} · ${region.city}`}
        title={region.name}
        description={region.tagline}
        crumbs={[
          { name: "Bölgeler", path: "/bolgeler" },
          { name: region.name, path: `/bolgeler/${region.slug}` },
        ]}
      />

      <section className="tone-light py-20 md:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-serif text-2xl leading-relaxed md:text-3xl">{region.intro}</p>
            </Reveal>
            <div className="mt-14 grid gap-10 sm:grid-cols-2">
              <InfoList title="Öne çıkanlar" icon={<Sparkles size={18} />} items={region.highlights} />
              <InfoList title="Ulaşım" icon={<Bus size={18} />} items={region.transport} />
              <InfoList title="Eğitim" icon={<GraduationCap size={18} />} items={region.schools} />
              <InfoList title="Yaşam" icon={<Sun size={18} />} items={region.lifestyle} />
            </div>
          </div>
          <aside className="space-y-6 lg:col-span-5">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line">
              <Metric label="Ort. satış fiyatı" value={`${formatPrice(region.avgPricePerM2)}`} unit="/ m²" />
              <Metric label="Ort. kira" value={`${formatPrice(region.avgRentPerM2)}`} unit="/ m² / ay" />
              <Metric label="Aktif ilan" value={String(listings.length)} />
              <Metric
                label="Brüt kira getirisi"
                value={`%${((region.avgRentPerM2 * 12 * 100) / region.avgPricePerM2).toFixed(1).replace(".", ",")}`}
                unit="yıllık"
              />
            </div>
            <div className="h-72 overflow-hidden rounded-[20px] border border-line">
              <MiniMap lat={region.lat} lng={region.lng} approximate label={region.name} />
            </div>
            <p className="text-xs text-fg-muted">Fiyat ortalamaları kurgusaldır (demo).</p>
          </aside>
        </div>
      </section>

      <section className="tone-light border-t border-line py-20" aria-labelledby="region-listings">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="region-listings" className="text-h2">
              {region.name} ilanları
            </h2>
            <ButtonLink href={`/ilanlar?bolge=${region.slug}`} variant="outline">
              Tümünü filtreyle gör
            </ButtonLink>
          </div>
          {listings.length ? (
            <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => (
                <li key={l.id}>
                  <ListingCard listing={l} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-fg-muted">Bu bölgede şu an yayında ilan yok. Talebinizi bırakın, ilk siz haberdar olun.</p>
          )}
        </div>
      </section>

      {experts.length ? (
        <section className="tone-light border-t border-line py-20" aria-labelledby="region-experts">
          <div className="container-site">
            <h2 id="region-experts" className="text-h2">
              Bölge uzmanlarımız
            </h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {experts.map((a) => (
                <AgentCard key={a.slug} agent={a} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function InfoList({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-accent uppercase">
        {icon}
        {title}
      </h3>
      <div className="prose-site mt-4 text-[0.9375rem]">
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Metric({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="bg-raised p-6">
      <p className="text-xs text-fg-muted">{label}</p>
      <p className="tabular mt-2 font-serif text-2xl">{value}</p>
      {unit ? <p className="text-xs text-fg-muted">{unit}</p> : null}
    </div>
  );
}
