import {
  Bath,
  BedDouble,
  CalendarClock,
  CheckCircle2,
  FileCheck2,
  Layers,
  Mountain,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { ListingContact } from "@/components/listing-detail/contact-card";
import { Gallery } from "@/components/listing-detail/gallery";
import { CompareButton, ShareButton } from "@/components/listing-detail/listing-tools";
import { MortgageMini } from "@/components/listing-detail/mortgage-mini";
import { FavoriteButton } from "@/components/listings/favorite-button";
import { ListingCard } from "@/components/listings/listing-card";
import { MiniMap } from "@/components/map/mini-map";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/page-hero";
import {
  agentOf,
  daysOnMarket,
  getAllListingSlugs,
  getListing,
  getSimilarListings,
  regionOf,
} from "@/lib/data";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { propertyTypeLabels, statusLabels, transactionLabels } from "@/lib/labels";
import { REFERENCE_YEAR } from "@/lib/listing-filters";
import {
  floorLabel,
  isClosedListing,
  listingUrl,
  priceLabel,
  pricePerM2,
  regionLabel,
  whatsappMessage,
} from "@/lib/listing-utils";
import { listingSchema } from "@/lib/seo";
import { unsplash } from "@/lib/utils";

export async function generateStaticParams() {
  return (await getAllListingSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/ilan/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const listing = await getListing(slug);
  if (!listing) return { title: "İlan bulunamadı" };
  const image = `${unsplash(listing.images[0])}?w=1200&h=630&fit=crop&q=75&auto=format`;
  return {
    title: `${listing.title} · ${listing.no}`,
    description: listing.summary,
    alternates: { canonical: listingUrl(listing) },
    openGraph: { title: listing.title, description: listing.summary, images: [{ url: image, width: 1200, height: 630 }] },
  };
}

export default function ListingPage(props: PageProps<"/ilan/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ListingDetail params={props.params} />
    </Suspense>
  );
}

async function ListingDetail({ params }: { params: PageProps<"/ilan/[slug]">["params"] }) {
  const { slug } = await params;
  const listing = await getListing(slug);
  if (!listing) notFound();

  const region = regionOf(listing);
  const agent = agentOf(listing);
  const similar = await getSimilarListings(listing, 3);
  const closed = isClosedListing(listing);
  const days = daysOnMarket(listing);
  const perM2 = pricePerM2(listing);
  const age = REFERENCE_YEAR - listing.yearBuilt;

  const facts: [string, ReactNode][] = [
    ["İlan no", listing.no],
    ["İlan tarihi", formatDate(listing.publishedAt)],
    ["İşlem", transactionLabels[listing.transaction]],
    ["Mülk tipi", propertyTypeLabels[listing.type]],
    ["Brüt / net alan", `${formatNumber(listing.grossM2)} / ${formatNumber(listing.netM2)} m²`],
    ["Oda", listing.rooms],
    ["Banyo", listing.bathrooms],
    ["Balkon", listing.balconies || "Yok"],
    ["Bulunduğu kat", floorLabel(listing)],
    ["Bina yaşı", `${age} (${listing.yearBuilt})`],
    ["Isınma", listing.heating],
    ["Eşya", listing.furnished ? "Eşyalı" : "Eşyasız"],
    ["Site içinde", listing.inSite ? (listing.siteName ?? "Evet") : "Hayır"],
    ["Otopark", listing.parking],
    ["Cephe", listing.facade.join(", ")],
    ["Aidat", listing.dues ? formatPrice(listing.dues) : "Yok"],
    ...(listing.deposit ? ([["Depozito", formatPrice(listing.deposit)]] as [string, ReactNode][]) : []),
    ["Tapu durumu", listing.deed],
    ["İskân", listing.iskan ? "Var" : "Yok"],
    ["Kullanım durumu", listing.usage],
    ...(listing.transaction === "satilik"
      ? ([["Krediye uygun", listing.creditEligible ? "Evet" : "Hayır"]] as [string, ReactNode][])
      : []),
  ];

  const quick = [
    { icon: BedDouble, label: "Oda", value: listing.rooms },
    { icon: Ruler, label: "Net alan", value: `${formatNumber(listing.netM2)} m²` },
    { icon: Bath, label: "Banyo", value: String(listing.bathrooms) },
    { icon: Layers, label: "Kat", value: floorLabel(listing) },
    { icon: CalendarClock, label: "Bina yaşı", value: `${age} yıl` },
  ];

  const eq = listing.earthquake;

  return (
    <>
      <JsonLd data={listingSchema(listing, region, agent)} />

      <section className="tone-dark pt-[118px] md:pt-[128px] md:pb-10">
        <div className="container-site hidden pb-6 md:block">
          <Breadcrumbs
            items={[
              { name: transactionLabels[listing.transaction], path: `/ilanlar/${listing.transaction}` },
              { name: region.name, path: `/ilanlar/${listing.transaction}?bolge=${region.slug}` },
              { name: listing.no, path: listingUrl(listing) },
            ]}
          />
        </div>
        <Gallery images={listing.images} title={listing.title} hasVideo={listing.hasVideo} hasTour360={listing.hasTour360} />
      </section>

      <section className="tone-light pt-10 pb-28 md:pt-14 md:pb-24">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            {/* Başlık bloğu */}
            <div className="flex flex-wrap gap-2">
              <Badge tone={listing.transaction === "satilik" ? "gold" : "muted"}>{transactionLabels[listing.transaction]}</Badge>
              <Badge tone="muted">{propertyTypeLabels[listing.type]}</Badge>
              {listing.status !== "yayinda" ? (
                <Badge tone={closed ? "success" : "outline"}>{statusLabels[listing.status]}</Badge>
              ) : null}
            </div>
            <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              {regionLabel(region)} / {region.city}
            </p>
            <h1 className="mt-3 text-h1">{listing.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">{listing.summary}</p>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-y border-line py-6">
              <div>
                {closed ? (
                  <p className="text-sm text-fg-muted">
                    {listing.showClosedPrice ? "Gerçekleşen fiyat" : "Fiyat mülk sahibinin talebiyle gizli"}
                  </p>
                ) : null}
                {!closed || listing.showClosedPrice ? (
                  <p className="tabular font-serif text-4xl text-fg md:text-5xl">{priceLabel(listing)}</p>
                ) : null}
                {perM2 && !closed ? (
                  <p className="tabular mt-1 text-sm text-fg-muted">
                    {formatPrice(perM2)} / m² (brüt) · Bölge ortalaması {formatPrice(region.avgPricePerM2)} / m²
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <FavoriteButton slug={listing.slug} title={listing.title} withLabel />
                <CompareButton slug={listing.slug} />
                <ShareButton title={listing.title} path={listingUrl(listing)} />
              </div>
            </div>

            {closed ? (
              <div className="mt-8 flex gap-4 rounded-[20px] border border-success/40 bg-success/10 p-6">
                <CheckCircle2 className="mt-0.5 shrink-0 text-success" aria-hidden />
                <div>
                  <p className="font-semibold">
                    Bu ilan {days !== undefined ? `${days} günde ` : ""}
                    {listing.status === "kiralandi" ? "kiralandı" : "satıldı"}
                    {listing.closedAt ? ` (${formatDate(listing.closedAt)})` : ""}.
                  </p>
                  <p className="mt-1 text-sm text-fg-muted">
                    Referans olarak yayında tutuyoruz. Benzer ilanlar aşağıda;{" "}
                    <Link href={`/ilanlar/${listing.transaction}?bolge=${region.slug}`} className="text-accent underline underline-offset-4">
                      {region.name} bölgesindeki tüm ilanlar
                    </Link>
                    .
                  </p>
                </div>
              </div>
            ) : null}

            <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-5">
              {quick.map(({ icon: Icon, label, value }) => (
                <li key={label} className="bg-raised p-5">
                  <Icon size={20} className="text-accent" aria-hidden />
                  <p className="mt-3 text-xs text-fg-muted">{label}</p>
                  <p className="font-semibold">{value}</p>
                </li>
              ))}
            </ul>

            <DetailSection title="Açıklama">
              <div className="prose-site max-w-none">
                {listing.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </DetailSection>

            <DetailSection title="Özellikler">
              <dl className="grid gap-x-10 sm:grid-cols-2">
                {facts.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-line py-3 text-[0.9375rem]">
                    <dt className="text-fg-muted">{label}</dt>
                    <dd className="text-right font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10 grid gap-8 md:grid-cols-2">
                <ChipGroup title="İç özellikler" items={listing.interiorFeatures} />
                <ChipGroup title="Bina ve site" items={listing.buildingFeatures} />
                {listing.view.length ? <ChipGroup title="Manzara" items={listing.view} icon={<Mountain size={14} />} /> : null}
              </div>
            </DetailSection>

            <DetailSection title="Bina ve deprem bilgisi" id="deprem">
              <div className="rounded-[20px] border border-line bg-raised p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <ShieldCheck className="text-accent" aria-hidden />
                  <p className="font-semibold">Güven kartı</p>
                  {eq.reportAvailable ? (
                    <Badge tone="success">
                      <FileCheck2 size={12} /> Belgesi dosyada
                    </Badge>
                  ) : null}
                </div>
                <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <Fact label="Yapı ruhsat yılı" value={String(eq.permitYear)} />
                  <Fact label="Uyulan yönetmelik" value={eq.regulation} />
                  <Fact label="Zemin sınıfı" value={eq.soilClass} />
                  <Fact label="Güçlendirme" value={eq.retrofitted ? "Yapıldı" : "Gerekmedi / yok"} />
                </dl>
                <p className="mt-6 text-sm leading-relaxed text-fg-muted">
                  Bilgiler mülk sahibinden alınan belgelere dayanır; rapor varsa gösterimde paylaşılır. Neye bakmanız
                  gerektiğini{" "}
                  <Link href="/blog/deprem-yonetmeligi-ve-bina-yasi-alici-kontrol-listesi" className="text-accent underline underline-offset-4">
                    alıcı kontrol listemizde
                  </Link>{" "}
                  anlattık.
                </p>
              </div>
            </DetailSection>

            <DetailSection title="Konum">
              <div className="overflow-hidden rounded-[20px] border border-line">
                <div className="h-80 md:h-96">
                  <MiniMap lat={listing.lat} lng={listing.lng} approximate={listing.approximateLocation} label={`${region.name}, ${region.district}`} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 bg-raised p-5">
                  <div>
                    <p className="font-semibold">
                      {region.name}, {region.district} / {region.city}
                    </p>
                    <p className="text-sm text-fg-muted">
                      {listing.approximateLocation
                        ? "Mahremiyet için yaklaşık konum gösterilir; açık adres randevu onayıyla paylaşılır."
                        : "Konum mülk sahibinin onayıyla gösterilmektedir."}
                    </p>
                  </div>
                  <Link href={`/bolgeler/${region.slug}`} className="text-sm font-semibold text-accent underline underline-offset-4">
                    {region.name} bölge rehberi
                  </Link>
                </div>
              </div>
            </DetailSection>

            {listing.transaction === "satilik" && !closed ? (
              <DetailSection title="Kredi hesaplama">
                <MortgageMini price={listing.price} />
              </DetailSection>
            ) : null}
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <ListingContact
                closed={closed}
                whatsappMessage={whatsappMessage(listing)}
                agent={{
                  slug: agent.slug,
                  name: agent.name,
                  title: agent.title,
                  photo: agent.photo,
                  phoneDisplay: agent.phoneDisplay,
                  whatsappE164: agent.whatsappE164,
                }}
                listing={{
                  slug: listing.slug,
                  no: listing.no,
                  title: listing.title,
                  agentSlug: listing.agentSlug,
                  locationLabel: `${region.name}, ${region.district}`,
                  priceLabel: closed && !listing.showClosedPrice ? statusLabels[listing.status] : priceLabel(listing),
                }}
              />
              <p className="mt-4 px-2 text-xs leading-relaxed text-fg-muted">
                Bu ilan {listing.stats.views.toLocaleString("tr-TR")} kez görüntülendi ve{" "}
                {listing.stats.favorites.toLocaleString("tr-TR")} kişi favorilerine ekledi (demo verisi).
              </p>
            </div>
          </aside>
        </div>
      </section>

      {similar.length ? (
        <section className="tone-light border-t border-line pt-16 pb-28 md:pb-24" aria-labelledby="similar-title">
          <div className="container-site">
            <Reveal>
              <p className="eyebrow mb-3">Benzer ilanlar</p>
              <h2 id="similar-title" className="text-h2">
                Bunlar da ilginizi çekebilir
              </h2>
            </Reveal>
            <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((l) => (
                <li key={l.id}>
                  <ListingCard listing={l} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}

function DetailSection({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section className="mt-14" id={id} aria-labelledby={id ? `${id}-title` : undefined}>
      <h2 id={id ? `${id}-title` : undefined} className="mb-6 text-h3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ChipGroup({ title, items, icon }: { title: string; items: string[]; icon?: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase">{title}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1.5 text-sm">
            {icon ?? <CheckCircle2 size={14} className="text-accent" aria-hidden />}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-fg-muted">{label}</dt>
      <dd className="mt-1 font-serif text-2xl">{value}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div aria-hidden>
      <div className="tone-dark pt-[128px] pb-10">
        <div className="container-site">
          <div className="h-[34rem] animate-pulse rounded-[var(--radius-image)] bg-night-raised" />
        </div>
      </div>
      <div className="tone-light py-14">
        <div className="container-site space-y-4">
          <div className="h-4 w-40 animate-pulse rounded bg-sand" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-sand" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-sand" />
        </div>
      </div>
    </div>
  );
}
