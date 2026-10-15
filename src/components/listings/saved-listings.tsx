"use client";

import { GitCompare, Heart, X } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { compareStore, COMPARE_LIMIT, favoritesStore, toggleCompare, toggleFavorite } from "@/lib/demo-store";
import { useHydrated } from "@/lib/hooks";
import type { ListingSummary } from "@/lib/listing-utils";
import { cn } from "@/lib/utils";

/** Favoriler (M08): giriş yapmadan tarayıcıda tutulur. */
export function FavoritesView({ all }: { all: ListingSummary[] }) {
  const hydrated = useHydrated();
  const favorites = favoritesStore.use();
  const compare = compareStore.use();
  const items = favorites.map((slug) => all.find((l) => l.slug === slug)).filter((l) => l !== undefined);

  if (!hydrated) return <div className="h-64 animate-pulse rounded-[20px] bg-fg/5" aria-hidden />;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <Heart size={40} className="mx-auto text-accent" aria-hidden />
        <h2 className="mt-6 text-h3">Henüz favoriniz yok</h2>
        <p className="mt-3 text-fg-muted">İlan kartlarındaki kalp simgesine dokunarak beğendiğiniz evleri burada toplayın.</p>
        <ButtonLink href="/ilanlar" className="mt-8">
          İlanlara göz at
        </ButtonLink>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-fg-muted">
          <strong className="text-fg">{items.length}</strong> favori ilan · bu tarayıcıda saklanıyor
        </p>
        {compare.length > 1 ? (
          <ButtonLink href="/karsilastir" variant="dark">
            <GitCompare size={16} /> {compare.length} ilanı karşılaştır
          </ButtonLink>
        ) : (
          <p className="text-sm text-fg-muted">Karşılaştırmak için en az 2 ilan seçin (en fazla {COMPARE_LIMIT}).</p>
        )}
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((l) => {
          const inCompare = compare.includes(l.slug);
          return (
            <li key={l.slug} className="overflow-hidden rounded-[20px] border border-line bg-raised">
              <Link href={`/ilan/${l.slug}`} className="relative block aspect-[4/3] bg-night-raised">
                <Photo src={l.image} alt={l.title} fill sizes="(min-width: 1024px) 30vw, 92vw" className="object-cover" />
                {l.closed ? (
                  <span className="absolute top-3 left-3 rounded-full bg-success px-3 py-1 text-xs font-semibold text-ivory">{l.status}</span>
                ) : null}
              </Link>
              <div className="p-5">
                <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">{l.region}</p>
                <Link href={`/ilan/${l.slug}`} className="mt-1 line-clamp-2 block font-serif text-xl hover:text-accent">
                  {l.title}
                </Link>
                <p className="tabular mt-3 font-semibold">{l.price}</p>
                <p className="text-sm text-fg-muted">
                  {l.rooms} · {l.area}
                </p>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    aria-pressed={inCompare}
                    onClick={() => toggleCompare(l.slug)}
                    className={cn(
                      "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-colors",
                      inCompare ? "border-accent text-accent" : "border-line hover:border-accent",
                    )}
                  >
                    <GitCompare size={16} /> {inCompare ? "Karşılaştırmada" : "Karşılaştır"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(l.slug)}
                    className="grid size-10 place-items-center rounded-full border border-line hover:border-danger hover:text-danger"
                    aria-label={`${l.title} favorilerden çıkar`}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

const rows: [keyof ListingSummary, string][] = [
  ["price", "Fiyat"],
  ["pricePerM2", "m² fiyatı (brüt)"],
  ["region", "Bölge"],
  ["type", "Mülk tipi"],
  ["rooms", "Oda"],
  ["area", "Brüt / net alan"],
  ["bathrooms", "Banyo"],
  ["floor", "Kat"],
  ["yearBuilt", "Yapım yılı"],
  ["regulation", "Deprem yönetmeliği"],
  ["retrofitted", "Güçlendirme"],
  ["heating", "Isınma"],
  ["parking", "Otopark"],
  ["inSite", "Site"],
  ["dues", "Aidat"],
  ["deed", "Tapu"],
  ["iskan", "İskân"],
  ["view", "Manzara"],
];

/** İlan karşılaştırma (M08): en fazla 4 ilan yan yana */
export function CompareView({ all }: { all: ListingSummary[] }) {
  const hydrated = useHydrated();
  const compare = compareStore.use();
  const items = compare.map((slug) => all.find((l) => l.slug === slug)).filter((l) => l !== undefined);

  if (!hydrated) return <div className="h-64 animate-pulse rounded-[20px] bg-fg/5" aria-hidden />;

  if (items.length < 2) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <GitCompare size={40} className="mx-auto text-accent" aria-hidden />
        <h2 className="mt-6 text-h3">Karşılaştırmak için en az 2 ilan seçin</h2>
        <p className="mt-3 text-fg-muted">
          İlan sayfalarındaki “Karşılaştır” butonuyla en fazla {COMPARE_LIMIT} ilanı yan yana koyabilirsiniz.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/ilanlar">İlanlar</ButtonLink>
          <ButtonLink href="/favoriler" variant="outline">
            Favorilerim
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[20px] border border-line bg-raised" data-lenis-prevent-horizontal>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">İlan karşılaştırma tablosu</caption>
        <thead>
          <tr>
            <th scope="col" className="w-44 p-4 align-bottom text-xs font-semibold tracking-[0.12em] text-fg-muted uppercase">
              Özellik
            </th>
            {items.map((l) => (
              <th key={l.slug} scope="col" className="p-4 align-top font-normal">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-night-raised">
                  <Photo src={l.image} alt="" fill sizes="240px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => toggleCompare(l.slug)}
                    className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-night/70 text-ivory"
                    aria-label={`${l.title} karşılaştırmadan çıkar`}
                  >
                    <X size={14} />
                  </button>
                </div>
                <Link href={`/ilan/${l.slug}`} className="mt-3 line-clamp-2 block font-serif text-lg leading-snug hover:text-accent">
                  {l.title}
                </Link>
                <p className="mt-1 text-xs text-fg-muted">{l.no}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, label]) => (
            <tr key={key} className="border-t border-line">
              <th scope="row" className="p-4 font-normal text-fg-muted">
                {label}
              </th>
              {items.map((l) => (
                <td key={l.slug} className={cn("p-4", key === "price" ? "tabular font-semibold" : "")}>
                  {String(l[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
