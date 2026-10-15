/**
 * Demo veri tipleri — proje_plani.md Bölüm 8 (veri modeli) ile uyumlu sadeleştirme.
 * Üretimde bu tipler Payload koleksiyonlarından üretilen tiplere eşlenir (Bölüm 20.8).
 */

export type TransactionType = "satilik" | "kiralik";

export type PropertyType =
  | "daire"
  | "rezidans"
  | "villa"
  | "mustakil"
  | "yali"
  | "yazlik"
  | "ofis"
  | "arsa";

export type ListingStatus = "yayinda" | "opsiyonlu" | "satildi" | "kiralandi";

export type HeatingType =
  | "Yerden ısıtma"
  | "Kombi (doğalgaz)"
  | "Merkezi (pay ölçer)"
  | "Isı pompası"
  | "VRF klima";

export type DeedType = "Kat mülkiyeti" | "Kat irtifakı" | "Müstakil tapu" | "Hisseli tapu";

export type UsageStatus = "Boş" | "Mülk sahibi" | "Kiracılı";

export interface Region {
  slug: string;
  name: string; // Mahalle / semt
  district: string; // İlçe
  city: string; // İl
  lat: number;
  lng: number;
  image: string; // Unsplash kimliği
  /** Görselin kırpma odağı (CSS object-position), ör. "center 75%" */
  imageFocus?: string;
  tagline: string;
  intro: string;
  highlights: string[];
  transport: string[];
  schools: string[];
  lifestyle: string[];
  avgPricePerM2: number; // ₺/m² (kurgusal)
  avgRentPerM2: number; // ₺/m²/ay (kurgusal)
}

export interface Agent {
  slug: string;
  name: string;
  title: string;
  photo: string; // Unsplash kimliği
  phoneDisplay: string;
  whatsappE164: string;
  email: string;
  languages: string[];
  regions: string[]; // Region slug
  bio: string;
  yearsExperience: number;
  soldCount: number;
  rating: number;
}

export interface EarthquakeInfo {
  permitYear: number; // Yapı ruhsat yılı
  regulation: "TBDY 2018" | "DBYBHY 2007" | "1998 Yönetmeliği";
  soilClass: "ZA" | "ZB" | "ZC" | "ZD";
  retrofitted: boolean;
  reportAvailable: boolean;
}

export interface Listing {
  id: string;
  no: string; // İlan numarası, ör. RVK-2041
  slug: string;
  title: string;
  summary: string; // Tek cümlelik çarpıcı özet (Bölüm 12.2)
  description: string[]; // Paragraflar
  transaction: TransactionType;
  type: PropertyType;
  status: ListingStatus;
  featured: boolean;
  publishedAt: string; // ISO tarih
  agentSlug: string;

  price: number;
  currency: "TRY";
  negotiable: boolean;
  dues?: number; // Aidat (aylık)
  deposit?: number; // Depozito (kiralık)
  creditEligible: boolean;

  grossM2: number;
  netM2: number;
  rooms: string; // "3+1"
  bathrooms: number;
  balconies: number;
  floor: string; // "4", "Bahçe katı", "Villa katı"
  totalFloors: number;
  yearBuilt: number;
  heating: HeatingType;
  furnished: boolean;
  inSite: boolean;
  siteName?: string;
  parking: "Kapalı otopark" | "Açık otopark" | "Kapalı + açık" | "Yok";
  facade: string[];
  view: string[];
  buildingFeatures: string[];
  interiorFeatures: string[];

  deed: DeedType;
  iskan: boolean;
  usage: UsageStatus;
  earthquake: EarthquakeInfo;

  regionSlug: string;
  lat: number;
  lng: number;
  approximateLocation: boolean;

  images: string[]; // Unsplash kimlikleri, ilki kapak
  hasVideo: boolean;
  hasTour360: boolean;

  stats: { views: number; favorites: number; whatsapp: number; appointments: number };

  // Sonuç (satılan/kiralanan)
  closedAt?: string;
  showClosedPrice?: boolean;
}

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "listing"; slug: string }
  | { type: "callout"; title: string; text: string; href: string; cta: string };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: "Alıcı rehberi" | "Satıcı rehberi" | "Yatırım" | "Bölgeler" | "Mevzuat";
  cover: string;
  coverAlt: string;
  authorSlug: string;
  publishedAt: string;
  readingMinutes: number;
  blocks: PostBlock[];
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  source: "Google" | "Video referans" | "Müşteri formu";
  agentSlug?: string;
}

export interface Faq {
  q: string;
  a: string;
  group: "Alıcılar" | "Satıcılar" | "Kiracılar" | "Genel";
}

export interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  kind: "post" | "reels";
  likes: number;
  listingSlug?: string;
}
