import { SearchX } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import type { TransactionType } from "@/data/types";
import { getRegions, queryListings } from "@/lib/data";
import { transactionLabels } from "@/lib/labels";
import { filtersToSearchParams, parseListingFilters } from "@/lib/listing-filters";
import { FilterBar } from "./filter-bar";
import { ListingCard } from "./listing-card";
import { ListingRow } from "./listing-row";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const heroCopy = {
  all: {
    title: "Tüm ilanlar",
    description: "Boğaz hattından Anadolu yakasına, Bodrum'a kadar portföyümüzdeki satılık ve kiralık tüm konutlar.",
  },
  satilik: {
    title: "Satılık konutlar",
    description: "Tapu, iskân ve deprem bilgisi açık; gösterime hazır satılık daire, villa ve yazlıklar.",
  },
  kiralik: {
    title: "Kiralık konutlar",
    description: "Uzun dönem kiralık daireler ve müstakil evler. Kurumsal ve yabancı kiracılara tam destek.",
  },
} as const;

export function basePathFor(transaction?: TransactionType) {
  return transaction ? `/ilanlar/${transaction}` : "/ilanlar";
}

/**
 * İlan listesi (İP-16). Başlık statik kabukta; URL'ye bağlı sonuçlar
 * Suspense içinde akışla gelir (Cache Components).
 */
export function ListingsPage({
  transaction,
  searchParams,
}: {
  transaction?: TransactionType;
  searchParams: SearchParams;
}) {
  const copy = heroCopy[transaction ?? "all"];
  const crumbs = [{ name: "İlanlar", path: "/ilanlar" }];
  if (transaction) crumbs.push({ name: transactionLabels[transaction], path: basePathFor(transaction) });

  return (
    <>
      <PageHero eyebrow="Portföy" title={copy.title} description={copy.description} crumbs={crumbs} size="sm" />
      <section className="tone-light min-h-[60vh] pb-24">
        <Suspense fallback={<ResultsSkeleton />}>
          <ListingsResults transaction={transaction} searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

async function ListingsResults({
  transaction,
  searchParams,
}: {
  transaction?: TransactionType;
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const filters = parseListingFilters(raw, transaction);
  const view = raw.gorunum === "liste" ? "liste" : "izgara";
  const [result, regions] = await Promise.all([queryListings(filters), getRegions()]);
  const basePath = basePathFor(transaction);

  const pageHref = (page: number) => {
    const params = filtersToSearchParams({ ...filters, sayfa: page }, Boolean(transaction));
    if (view === "liste") params.set("gorunum", "liste");
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <FilterBar
        key={JSON.stringify(filters) + view}
        filters={filters}
        fixedTransaction={transaction}
        basePath={basePath}
        view={view}
        total={result.total}
        regions={regions.map((r) => ({ slug: r.slug, name: r.name, district: r.district }))}
      />

      <div className="container-site pt-10">
        {result.items.length === 0 ? (
          <div className="mx-auto max-w-lg py-20 text-center">
            <SearchX size={40} className="mx-auto text-accent" aria-hidden />
            <h2 className="mt-6 text-h3">Kriterlerinize uygun ilan bulunamadı</h2>
            <p className="mt-3 text-fg-muted">
              Filtrelerin bir kısmını kaldırmayı deneyin ya da aradığınız evi bize anlatın; eşleşen bir ilan
              girildiğinde size haber verelim.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href={basePath} variant="outline">
                Filtreleri temizle
              </ButtonLink>
              <ButtonLink href="/iletisim?konu=talep" variant="dark">
                Aradığımı bulamadım
              </ButtonLink>
            </div>
          </div>
        ) : view === "liste" ? (
          <ul className="space-y-6">
            {result.items.map((listing, i) => (
              <li key={listing.id}>
                <ListingRow listing={listing} priority={i < 2} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {result.items.map((listing, i) => (
              <li key={listing.id}>
                <ListingCard listing={listing} priority={i < 3} />
              </li>
            ))}
          </ul>
        )}

        {result.pageCount > 1 ? (
          <nav aria-label="Sayfalar" className="mt-16 flex items-center justify-center gap-2">
            {Array.from({ length: result.pageCount }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={pageHref(page)}
                aria-current={page === result.page ? "page" : undefined}
                className={
                  page === result.page
                    ? "grid size-11 place-items-center rounded-full bg-ink font-semibold text-ivory"
                    : "grid size-11 place-items-center rounded-full border border-line font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
                }
              >
                {page}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </>
  );
}

function ResultsSkeleton() {
  return (
    <div aria-hidden>
      <div className="h-[132px] border-b border-line bg-raised/60" />
      <div className="container-site grid gap-x-8 gap-y-14 pt-10 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/3] rounded-[var(--radius-image)] bg-sand" />
            <div className="mt-5 h-3 w-1/3 rounded bg-sand" />
            <div className="mt-3 h-5 w-4/5 rounded bg-sand" />
            <div className="mt-6 h-5 w-1/2 rounded bg-sand" />
          </div>
        ))}
      </div>
    </div>
  );
}
