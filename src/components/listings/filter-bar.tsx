"use client";

import { LayoutGrid, List, Loader2, Map, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { TransactionType } from "@/data/types";
import { formatNumber, formatPriceShort } from "@/lib/format";
import {
  featureFilterLabels,
  propertyTypeLabels,
  roomOptions,
  sortLabels,
  type FeatureFilterKey,
  type SortKey,
} from "@/lib/labels";
import { countActiveFilters, filtersToSearchParams, type ListingFilters } from "@/lib/listing-filters";
import { cn } from "@/lib/utils";

type RegionOption = { slug: string; name: string; district: string };

const priceOptions: Record<TransactionType, { min: number[]; max: number[] }> = {
  satilik: {
    min: [5_000_000, 10_000_000, 20_000_000, 40_000_000, 75_000_000],
    max: [10_000_000, 20_000_000, 40_000_000, 75_000_000, 150_000_000, 250_000_000],
  },
  kiralik: {
    min: [25_000, 50_000, 100_000, 200_000],
    max: [50_000, 100_000, 200_000, 500_000],
  },
};

const ageOptions = [5, 10, 20, 30];

const selectClass =
  "h-11 rounded-full border border-line bg-raised pr-9 pl-4 text-sm text-fg transition-colors hover:border-accent focus:border-accent focus:outline-none";

export function FilterBar({
  filters,
  fixedTransaction,
  basePath,
  view,
  total,
  regions,
}: {
  filters: ListingFilters;
  fixedTransaction?: TransactionType;
  basePath: string;
  view: "izgara" | "liste";
  total: number;
  regions: RegionOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState(filters.q ?? "");
  const transaction = fixedTransaction ?? filters.islem;
  const activeCount = countActiveFilters(filters);

  function hrefFor(next: ListingFilters, path = basePath, nextView = view) {
    const params = filtersToSearchParams(next, path !== "/ilanlar");
    if (nextView === "liste") params.set("gorunum", "liste");
    const qs = params.toString();
    return `${path}${qs ? `?${qs}` : ""}`;
  }

  function apply(patch: Partial<ListingFilters>) {
    const next = { ...filters, ...patch, sayfa: 1 };
    startTransition(() => router.replace(hrefFor(next), { scroll: false }));
  }

  const transactionLinks = [
    { label: "Tümü", path: "/ilanlar", value: undefined },
    { label: "Satılık", path: "/ilanlar/satilik", value: "satilik" as const },
    { label: "Kiralık", path: "/ilanlar/kiralik", value: "kiralik" as const },
  ];

  const chips: { label: string; remove: Partial<ListingFilters> }[] = [];
  if (filters.q) chips.push({ label: `“${filters.q}”`, remove: { q: undefined } });
  if (filters.bolge) {
    const r = regions.find((x) => x.slug === filters.bolge);
    chips.push({ label: r ? r.name : filters.bolge, remove: { bolge: undefined } });
  }
  if (filters.tip) chips.push({ label: propertyTypeLabels[filters.tip], remove: { tip: undefined } });
  if (filters.min) chips.push({ label: `En az ${formatPriceShort(filters.min)}`, remove: { min: undefined } });
  if (filters.max) chips.push({ label: `En çok ${formatPriceShort(filters.max)}`, remove: { max: undefined } });
  if (filters.oda) chips.push({ label: filters.oda, remove: { oda: undefined } });
  if (filters.m2min) chips.push({ label: `${formatNumber(filters.m2min)} m² ve üzeri`, remove: { m2min: undefined } });
  if (filters.yas !== undefined) chips.push({ label: `En fazla ${filters.yas} yaşında`, remove: { yas: undefined } });
  for (const key of filters.ozellik) {
    chips.push({
      label: featureFilterLabels[key],
      remove: { ozellik: filters.ozellik.filter((k) => k !== key) },
    });
  }

  // ------------------------------------------------------------ Parçalar

  const transactionSwitch = (
    <div className="inline-flex rounded-full border border-line bg-raised p-1" role="group" aria-label="İşlem tipi">
      {transactionLinks.map((t) => {
        const active = transaction === t.value;
        return (
          <Link
            key={t.label}
            href={hrefFor({ ...filters, islem: undefined, min: undefined, max: undefined, sayfa: 1 }, t.path)}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              active ? "bg-ink text-ivory" : "text-fg-muted hover:text-fg",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );

  const searchBox = (
    <form
      role="search"
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        apply({ q: query.trim() || undefined });
      }}
    >
      <label htmlFor="filter-q" className="sr-only">
        İlanlarda ara
      </label>
      <Search size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-fg-muted" />
      <input
        id="filter-q"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => {
          if ((query.trim() || undefined) !== filters.q) apply({ q: query.trim() || undefined });
        }}
        placeholder="Semt, ilan no, özellik…"
        className="h-11 w-full rounded-full border border-line bg-raised pr-4 pl-10 text-sm text-fg placeholder:text-fg-muted focus:border-accent focus:outline-none"
      />
    </form>
  );

  const regionSelect = (
    <Labeled label="Bölge">
      <select
        className={cn(selectClass, "w-full")}
        value={filters.bolge ?? ""}
        onChange={(e) => apply({ bolge: e.target.value || undefined })}
      >
        <option value="">Tüm bölgeler</option>
        {regions.map((r) => (
          <option key={r.slug} value={r.slug}>
            {r.name}, {r.district}
          </option>
        ))}
      </select>
    </Labeled>
  );

  const typeSelect = (
    <Labeled label="Mülk tipi">
      <select
        className={cn(selectClass, "w-full")}
        value={filters.tip ?? ""}
        onChange={(e) => apply({ tip: (e.target.value || undefined) as ListingFilters["tip"] })}
      >
        <option value="">Tüm tipler</option>
        {Object.entries(propertyTypeLabels).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </Labeled>
  );

  const priceSelects = transaction ? (
    <div className="grid grid-cols-2 gap-2">
      <Labeled label="En az fiyat">
        <select
          className={cn(selectClass, "w-full")}
          value={filters.min ?? ""}
          onChange={(e) => apply({ min: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Min ₺</option>
          {priceOptions[transaction].min.map((v) => (
            <option key={v} value={v}>
              {formatPriceShort(v)}
            </option>
          ))}
        </select>
      </Labeled>
      <Labeled label="En çok fiyat">
        <select
          className={cn(selectClass, "w-full")}
          value={filters.max ?? ""}
          onChange={(e) => apply({ max: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Max ₺</option>
          {priceOptions[transaction].max.map((v) => (
            <option key={v} value={v}>
              {formatPriceShort(v)}
            </option>
          ))}
        </select>
      </Labeled>
    </div>
  ) : (
    <p className="self-center text-xs text-fg-muted">Fiyat filtresi için Satılık veya Kiralık seçin.</p>
  );

  const roomButtons = (
    <div role="group" aria-label="Oda sayısı" className="flex gap-1.5">
      {roomOptions.map((room) => {
        const active = filters.oda === room;
        return (
          <button
            key={room}
            type="button"
            aria-pressed={active}
            onClick={() => apply({ oda: active ? undefined : room })}
            className={cn(
              "h-11 min-w-12 rounded-full border px-3 text-sm font-semibold transition-colors",
              active ? "border-ink bg-ink text-ivory" : "border-line bg-raised text-fg hover:border-accent",
            )}
          >
            {room}
          </button>
        );
      })}
    </div>
  );

  const sortSelect = (
    <label className="flex items-center gap-2 text-sm text-fg-muted">
      <span className="hidden sm:inline">Sırala:</span>
      <select
        className={selectClass}
        value={filters.siralama}
        onChange={(e) => apply({ siralama: e.target.value as SortKey })}
        aria-label="Sıralama"
      >
        {Object.entries(sortLabels).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );

  const viewToggle = (
    <div className="flex items-center gap-1" role="group" aria-label="Görünüm">
      <ViewLink href={hrefFor(filters, basePath, "izgara")} active={view === "izgara"} label="Izgara görünümü">
        <LayoutGrid size={18} />
      </ViewLink>
      <ViewLink href={hrefFor(filters, basePath, "liste")} active={view === "liste"} label="Liste görünümü">
        <List size={18} />
      </ViewLink>
      <ViewLink href="/harita" active={false} label="Harita görünümü">
        <Map size={18} />
      </ViewLink>
    </div>
  );

  return (
    <div className="sticky top-[72px] z-30 border-b border-line bg-ivory/92 backdrop-blur-xl">
      <div className="container-site py-4">
        {/* Masaüstü */}
        <div className="hidden flex-wrap items-center gap-3 lg:flex">
          {transactionSwitch}
          <div className="w-56">{searchBox}</div>
          <div className="w-52">{regionSelect}</div>
          <div className="w-40">{typeSelect}</div>
          <div className="w-64">{priceSelects}</div>
          {roomButtons}
          <Button variant="outline" size="md" onClick={() => setMoreOpen(true)} className="h-11">
            <SlidersHorizontal size={16} /> Daha fazla
          </Button>
        </div>

        {/* Mobil */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex-1">{searchBox}</div>
          <Button variant="dark" onClick={() => setMobileOpen(true)} className="h-11 shrink-0">
            <SlidersHorizontal size={16} /> Filtreler{activeCount ? ` (${activeCount})` : ""}
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-2 text-sm font-semibold text-fg" aria-live="polite">
              {pending ? (
                <span className="inline-flex items-center gap-2 text-fg-muted">
                  <Loader2 size={14} className="animate-spin" /> Güncelleniyor…
                </span>
              ) : (
                <>{formatNumber(total)} ilan</>
              )}
            </p>
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => apply(chip.remove)}
                className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink transition-colors hover:bg-[#e0d6c5]"
                aria-label={`${chip.label} filtresini kaldır`}
              >
                {chip.label} <X size={12} />
              </button>
            ))}
            {chips.length > 1 ? (
              <Link href={basePath} scroll={false} className="text-xs font-semibold text-accent underline underline-offset-4">
                Tümünü temizle
              </Link>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {sortSelect}
            <div className="hidden sm:block">{viewToggle}</div>
          </div>
        </div>
      </div>

      <Dialog open={moreOpen} onClose={() => setMoreOpen(false)} title="Daha fazla filtre">
        <MoreFilters
          filters={filters}
          onApply={(patch) => {
            setMoreOpen(false);
            apply(patch);
          }}
        />
      </Dialog>

      <Dialog open={mobileOpen} onClose={() => setMobileOpen(false)} title="Filtreler" size="full">
        <MobileFilters
          filters={filters}
          transaction={transaction}
          regions={regions}
          onApply={(next, path) => {
            setMobileOpen(false);
            startTransition(() => router.replace(hrefFor({ ...next, sayfa: 1 }, path), { scroll: false }));
          }}
        />
      </Dialog>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      {children}
    </label>
  );
}

function ViewLink({
  href,
  active,
  label,
  children,
}: {
  href: string;
  active: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-label={label}
      aria-current={active ? "true" : undefined}
      className={cn(
        "grid size-11 place-items-center rounded-full transition-colors",
        active ? "bg-ink text-ivory" : "text-fg-muted hover:bg-sand hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}

/** m², bina yaşı ve özellikler: tek seferde "Uygula" ile */
function MoreFilters({
  filters,
  onApply,
}: {
  filters: ListingFilters;
  onApply: (patch: Partial<ListingFilters>) => void;
}) {
  const [m2min, setM2min] = useState(filters.m2min ? String(filters.m2min) : "");
  const [yas, setYas] = useState(filters.yas !== undefined ? String(filters.yas) : "");
  const [features, setFeatures] = useState<FeatureFilterKey[]>(filters.ozellik);

  const inputClass =
    "h-11 w-full rounded-xl border border-line bg-raised px-4 text-sm text-fg focus:border-accent focus:outline-none";

  return (
    <div className="space-y-6 text-fg">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase">Brüt m² (en az)</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={m2min}
            onChange={(e) => setM2min(e.target.value)}
            placeholder="ör. 120"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase">Bina yaşı</span>
          <select value={yas} onChange={(e) => setYas(e.target.value)} className={inputClass}>
            <option value="">Fark etmez</option>
            {ageOptions.map((a) => (
              <option key={a} value={a}>
                En fazla {a} yaşında
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset>
        <legend className="mb-3 text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase">Özellikler</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(featureFilterLabels) as FeatureFilterKey[]).map((key) => {
            const active = features.includes(key);
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  setFeatures((prev) => (active ? prev.filter((k) => k !== key) : [...prev, key]))
                }
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  active ? "border-accent bg-accent text-ivory" : "border-line text-fg hover:border-accent",
                )}
              >
                {featureFilterLabels[key]}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="flex justify-end gap-3 border-t border-line pt-5">
        <Button
          variant="ghost"
          onClick={() => {
            setM2min("");
            setYas("");
            setFeatures([]);
          }}
        >
          Sıfırla
        </Button>
        <Button
          onClick={() =>
            onApply({
              m2min: Number(m2min) > 0 ? Math.round(Number(m2min)) : undefined,
              yas: yas ? Number(yas) : undefined,
              ozellik: features,
            })
          }
        >
          Uygula
        </Button>
      </div>
    </div>
  );
}

/**
 * Mobil filtre penceresi: seçimler taslakta tutulur ve "Sonuçları göster" ile
 * tek seferde uygulanır (her seçimde sayfa yenilenip pencere kapanmaz).
 */
function MobileFilters({
  filters,
  transaction,
  regions,
  onApply,
}: {
  filters: ListingFilters;
  transaction?: TransactionType;
  regions: RegionOption[];
  onApply: (next: ListingFilters, path: string) => void;
}) {
  const [draft, setDraft] = useState<ListingFilters>(filters);
  const [mode, setMode] = useState<TransactionType | undefined>(transaction);
  const set = (patch: Partial<ListingFilters>) => setDraft((d) => ({ ...d, ...patch }));
  const field = "h-12 w-full rounded-xl border border-line bg-raised px-4 text-fg focus:border-accent focus:outline-none";
  const label = "mb-2 block text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase";
  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
      active ? "border-ink bg-ink text-ivory" : "border-line bg-raised text-fg",
    );
  const modes: [TransactionType | undefined, string][] = [
    [undefined, "Tümü"],
    ["satilik", "Satılık"],
    ["kiralik", "Kiralık"],
  ];

  return (
    <div className="tone-light -mx-6 -my-6 flex min-h-full flex-col bg-ivory">
      <div className="flex-1 space-y-6 px-6 py-6">
        <div>
          <span className={label}>İşlem</span>
          <div className="flex gap-2" role="group" aria-label="İşlem tipi">
            {modes.map(([value, text]) => (
              <button
                key={text}
                type="button"
                aria-pressed={mode === value}
                onClick={() => {
                  if (value !== mode) set({ min: undefined, max: undefined });
                  setMode(value);
                }}
                className={chip(mode === value)}
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className={label}>Bölge</span>
          <select className={field} value={draft.bolge ?? ""} onChange={(e) => set({ bolge: e.target.value || undefined })}>
            <option value="">Tüm bölgeler</option>
            {regions.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}, {r.district}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={label}>Mülk tipi</span>
          <select
            className={field}
            value={draft.tip ?? ""}
            onChange={(e) => set({ tip: (e.target.value || undefined) as ListingFilters["tip"] })}
          >
            <option value="">Tüm tipler</option>
            {Object.entries(propertyTypeLabels).map(([key, text]) => (
              <option key={key} value={key}>
                {text}
              </option>
            ))}
          </select>
        </label>

        {mode ? (
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={label}>En az</span>
              <select
                className={field}
                value={draft.min ?? ""}
                onChange={(e) => set({ min: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">Min ₺</option>
                {priceOptions[mode].min.map((v) => (
                  <option key={v} value={v}>
                    {formatPriceShort(v)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={label}>En çok</span>
              <select
                className={field}
                value={draft.max ?? ""}
                onChange={(e) => set({ max: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">Max ₺</option>
                {priceOptions[mode].max.map((v) => (
                  <option key={v} value={v}>
                    {formatPriceShort(v)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <p className="text-sm text-fg-muted">Fiyat aralığı için Satılık veya Kiralık seçin.</p>
        )}

        <div>
          <span className={label}>Oda sayısı</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Oda sayısı">
            {roomOptions.map((room) => (
              <button
                key={room}
                type="button"
                aria-pressed={draft.oda === room}
                onClick={() => set({ oda: draft.oda === room ? undefined : room })}
                className={chip(draft.oda === room)}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className={label}>Brüt m² (en az)</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={draft.m2min ?? ""}
              onChange={(e) =>
                set({ m2min: Number(e.target.value) > 0 ? Math.round(Number(e.target.value)) : undefined })
              }
              placeholder="ör. 120"
              className={field}
            />
          </label>
          <label className="block">
            <span className={label}>Bina yaşı</span>
            <select
              className={field}
              value={draft.yas ?? ""}
              onChange={(e) => set({ yas: e.target.value ? Number(e.target.value) : undefined })}
            >
              <option value="">Fark etmez</option>
              {ageOptions.map((a) => (
                <option key={a} value={a}>
                  En fazla {a} yıl
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset>
          <legend className={label}>Özellikler</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(featureFilterLabels) as FeatureFilterKey[]).map((key) => {
              const active = draft.ozellik.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    set({ ozellik: active ? draft.ozellik.filter((k) => k !== key) : [...draft.ozellik, key] })
                  }
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    active ? "border-accent bg-accent text-ivory" : "border-line bg-raised text-fg",
                  )}
                >
                  {featureFilterLabels[key]}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="sticky bottom-0 flex gap-3 border-t border-line bg-ivory/95 px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            setMode(transaction);
            setDraft({ ozellik: [], siralama: filters.siralama, sayfa: 1, q: filters.q });
          }}
        >
          Sıfırla
        </Button>
        <Button className="flex-[2]" onClick={() => onApply({ ...draft, islem: undefined }, mode ? `/ilanlar/${mode}` : "/ilanlar")}>
          Sonuçları göster
        </Button>
      </div>
    </div>
  );
}
