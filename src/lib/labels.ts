import type { ListingStatus, PropertyType, TransactionType } from "@/data/types";

/** Kullanıcıya görünen enum etiketleri tek yerde (Bölüm 11.1). */

export const transactionLabels: Record<TransactionType, string> = {
  satilik: "Satılık",
  kiralik: "Kiralık",
};

export const propertyTypeLabels: Record<PropertyType, string> = {
  daire: "Daire",
  rezidans: "Rezidans",
  villa: "Villa",
  mustakil: "Müstakil ev",
  yali: "Yalı",
  yazlik: "Yazlık",
  ofis: "Ofis",
  arsa: "Arsa",
};

export const statusLabels: Record<ListingStatus, string> = {
  yayinda: "Yayında",
  opsiyonlu: "Opsiyonlu",
  satildi: "Satıldı",
  kiralandi: "Kiralandı",
};

export const featureFilterLabels = {
  bogaz: "Boğaz manzarası",
  deniz: "Deniz manzarası",
  havuz: "Havuz",
  bahce: "Bahçe",
  otopark: "Otopark",
  site: "Site içinde",
  esyali: "Eşyalı",
  kredi: "Krediye uygun",
  tbdy: "TBDY 2018 / güçlendirilmiş",
  video: "Videolu",
} as const;

export type FeatureFilterKey = keyof typeof featureFilterLabels;

export const sortLabels = {
  yeni: "En yeni",
  "fiyat-artan": "Fiyat (artan)",
  "fiyat-azalan": "Fiyat (azalan)",
  "m2-azalan": "Metrekare (büyükten)",
} as const;

export type SortKey = keyof typeof sortLabels;

export const roomOptions = ["1+1", "2+1", "3+1", "4+"] as const;
export type RoomOption = (typeof roomOptions)[number];
