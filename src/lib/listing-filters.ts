import { z } from "zod";
import type { Listing, PropertyType } from "@/data/types";
import {
  featureFilterLabels,
  propertyTypeLabels,
  roomOptions,
  sortLabels,
  type FeatureFilterKey,
  type RoomOption,
  type SortKey,
} from "./labels";

/**
 * İlan filtreleri URL'de saklanır (M02): paylaşılabilir ve SEO dostu.
 * Üretimde aynı parametreler Postgres / Meilisearch sorgusuna çevrilir (Bölüm 20.2).
 */

export const PAGE_SIZE = 9;

/** Bina yaşı hesabı için referans yıl. Render sırasında "şimdi" okunmaz (Cache Components). */
export const REFERENCE_YEAR = 2026;

export type ListingFilters = {
  islem?: "satilik" | "kiralik";
  tip?: PropertyType;
  bolge?: string;
  min?: number;
  max?: number;
  oda?: RoomOption;
  m2min?: number;
  yas?: number;
  ozellik: FeatureFilterKey[];
  q?: string;
  siralama: SortKey;
  sayfa: number;
};

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const all = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v : v ? [v] : []).flatMap((s) => s.split(","));

const positiveInt = z.coerce.number().int().positive().max(10_000_000_000);

function parseOptional<T>(schema: z.ZodType<T>, value: unknown): T | undefined {
  const result = schema.safeParse(value);
  return result.success ? result.data : undefined;
}

const typeKeys = Object.keys(propertyTypeLabels) as [PropertyType, ...PropertyType[]];
const featureKeys = Object.keys(featureFilterLabels) as [FeatureFilterKey, ...FeatureFilterKey[]];
const sortKeys = Object.keys(sortLabels) as [SortKey, ...SortKey[]];

/** Güvenilmeyen URL parametrelerini doğrulanmış filtre nesnesine çevirir. Hatalı değerler yok sayılır. */
export function parseListingFilters(raw: RawParams, fixedTransaction?: "satilik" | "kiralik"): ListingFilters {
  const q = first(raw.q)?.trim().slice(0, 80);
  return {
    islem: fixedTransaction ?? parseOptional(z.enum(["satilik", "kiralik"]), first(raw.islem)),
    tip: parseOptional(z.enum(typeKeys), first(raw.tip)),
    bolge: parseOptional(z.string().regex(/^[a-z0-9-]{2,40}$/), first(raw.bolge)),
    min: parseOptional(positiveInt, first(raw.min)),
    max: parseOptional(positiveInt, first(raw.max)),
    oda: parseOptional(z.enum(roomOptions), first(raw.oda)),
    m2min: parseOptional(positiveInt.max(100_000), first(raw.m2min)),
    yas: parseOptional(z.coerce.number().int().min(0).max(200), first(raw.yas)),
    ozellik: [...new Set(all(raw.ozellik))].filter((k): k is FeatureFilterKey =>
      (featureKeys as string[]).includes(k),
    ),
    q: q ? q : undefined,
    siralama: parseOptional(z.enum(sortKeys), first(raw.siralama)) ?? "yeni",
    sayfa: parseOptional(positiveInt.max(1000), first(raw.sayfa)) ?? 1,
  };
}

/** Filtre nesnesini URL sorgu dizesine çevirir (varsayılan değerler yazılmaz). */
export function filtersToSearchParams(filters: Partial<ListingFilters>, omitTransaction = false) {
  const params = new URLSearchParams();
  if (filters.islem && !omitTransaction) params.set("islem", filters.islem);
  if (filters.tip) params.set("tip", filters.tip);
  if (filters.bolge) params.set("bolge", filters.bolge);
  if (filters.min) params.set("min", String(filters.min));
  if (filters.max) params.set("max", String(filters.max));
  if (filters.oda) params.set("oda", filters.oda);
  if (filters.m2min) params.set("m2min", String(filters.m2min));
  if (filters.yas !== undefined) params.set("yas", String(filters.yas));
  if (filters.ozellik?.length) params.set("ozellik", filters.ozellik.join(","));
  if (filters.q) params.set("q", filters.q);
  if (filters.siralama && filters.siralama !== "yeni") params.set("siralama", filters.siralama);
  if (filters.sayfa && filters.sayfa > 1) params.set("sayfa", String(filters.sayfa));
  return params;
}

/** Türkçe duyarlı, aksan ve büyük/küçük harf bağımsız arama normalizasyonu */
export function normalizeTr(text: string) {
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
}

function roomCount(rooms: string) {
  const n = Number.parseInt(rooms, 10);
  return Number.isNaN(n) ? 0 : n;
}

const featureMatchers: Record<FeatureFilterKey, (l: Listing) => boolean> = {
  bogaz: (l) => l.view.includes("Boğaz"),
  deniz: (l) => l.view.some((v) => v === "Deniz" || v === "Boğaz"),
  havuz: (l) => l.buildingFeatures.some((f) => normalizeTr(f).includes("havuz")),
  bahce: (l) =>
    l.view.includes("Bahçe") ||
    l.interiorFeatures.includes("Özel bahçe") ||
    l.buildingFeatures.some((f) => normalizeTr(f).includes("bahce")),
  otopark: (l) => l.parking !== "Yok",
  site: (l) => l.inSite,
  esyali: (l) => l.furnished,
  kredi: (l) => l.creditEligible,
  tbdy: (l) => l.earthquake.regulation === "TBDY 2018",
  video: (l) => l.hasVideo,
};

export function matchesFilters(
  listing: Listing,
  filters: ListingFilters,
  regionName?: (slug: string) => string | undefined,
) {
  if (filters.islem && listing.transaction !== filters.islem) return false;
  if (filters.tip && listing.type !== filters.tip) return false;
  if (filters.bolge && listing.regionSlug !== filters.bolge) return false;
  if (filters.min && listing.price < filters.min) return false;
  if (filters.max && listing.price > filters.max) return false;
  if (filters.m2min && listing.grossM2 < filters.m2min) return false;
  if (filters.yas !== undefined && REFERENCE_YEAR - listing.yearBuilt > filters.yas) return false;
  if (filters.oda) {
    const count = roomCount(listing.rooms);
    if (filters.oda === "4+") {
      if (count < 4) return false;
    } else if (count !== roomCount(filters.oda)) {
      return false;
    }
  }
  if (filters.ozellik.some((key) => !featureMatchers[key](listing))) return false;
  if (filters.q) {
    const haystack = normalizeTr(
      [listing.title, listing.summary, listing.no, regionName?.(listing.regionSlug) ?? ""].join(" "),
    );
    const terms = normalizeTr(filters.q).split(/\s+/).filter(Boolean);
    if (!terms.every((t) => haystack.includes(t))) return false;
  }
  return true;
}

export function sortListings(items: Listing[], sort: SortKey) {
  const sorted = [...items];
  switch (sort) {
    case "fiyat-artan":
      return sorted.sort((a, b) => a.price - b.price);
    case "fiyat-azalan":
      return sorted.sort((a, b) => b.price - a.price);
    case "m2-azalan":
      return sorted.sort((a, b) => b.grossM2 - a.grossM2);
    default:
      return sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }
}

export function countActiveFilters(filters: ListingFilters) {
  return [
    filters.tip,
    filters.bolge,
    filters.min,
    filters.max,
    filters.oda,
    filters.m2min,
    filters.yas,
    filters.q,
  ].filter((v) => v !== undefined).length + filters.ozellik.length;
}
