/**
 * Firma bilgileri tek yerden yönetilir (K17, K18).
 * Telefon/WhatsApp ve Instagram gerçek (kullanıcının); adres, e-posta ve yetki belgesi no örnektir.
 */
export const siteConfig = {
  /** Demo modu: noindex ve demo şeridi (K15). İletişimde hangi kanalların gerçek olduğu: liveChannels */
  demo: true,
  /** Gerçek bağlantı açan kanallar; diğerleri (e-posta) demo penceresi gösterir (K18) */
  liveChannels: ["whatsapp", "telefon"] as readonly string[],
  name: "Revnak",
  legalName: "Revnak Gayrimenkul Danışmanlığı",
  fullName: "Revnak Gayrimenkul",
  tagline: "Gayrimenkul Danışmanlığı",
  /** "Revnak": parıltı, ışıltı, göz alıcı güzellik (eski Türkçe) */
  nameMeaning: "parıltı, ışıltı",
  description:
    "İstanbul Boğaz hattı, Anadolu yakası ve Bodrum'da seçkin konutlar. Satılık ve kiralık ilanlar, ücretsiz değerleme ve kişisel danışmanlık.",
  locale: "tr_TR",
  url: process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  contact: {
    phoneDisplay: "0542 311 58 88",
    phoneE164: "+905423115888",
    whatsappE164: "905423115888",
    /** Örnek adres (gerçek e-posta verilmedi): demo penceresi açar */
    email: "info@revnak.example",
    addressLine: "Cevdet Paşa Caddesi, Bebek",
    district: "Beşiktaş",
    city: "İstanbul",
    postalCode: "34342",
    lat: 41.0779,
    lng: 29.0418,
  },
  hours: [
    { days: "Pazartesi – Cuma", time: "09:30 – 19:00" },
    { days: "Cumartesi", time: "10:00 – 18:00" },
    { days: "Pazar", time: "Randevu ile" },
  ],
  /** Mesai saatleri (WhatsApp butonunda "dönüş yapacağız" notu için) */
  businessHours: { weekdays: [9.5, 19], saturday: [10, 18] },
  licenseNo: "3400000",
  founded: 2009,
  social: {
    instagram: "https://www.instagram.com/talla.ks/",
  } as { instagram: string; youtube?: string; linkedin?: string },
  instagramHandle: "talla.ks",
} as const;

export const mainNav = [
  { label: "Satılık", href: "/ilanlar/satilik" },
  { label: "Kiralık", href: "/ilanlar/kiralik" },
  { label: "Harita", href: "/harita" },
  { label: "Satılanlar", href: "/satilanlar" },
  { label: "Bölgeler", href: "/bolgeler" },
  { label: "Hizmetler", href: "/hizmetler" },
  { label: "Ekibimiz", href: "/ekibimiz" },
  { label: "Blog", href: "/blog" },
] as const;

export const footerNav = [
  {
    title: "İlanlar",
    links: [
      { label: "Satılık konutlar", href: "/ilanlar/satilik" },
      { label: "Kiralık konutlar", href: "/ilanlar/kiralik" },
      { label: "Harita ile ara", href: "/harita" },
      { label: "Satılanlar", href: "/satilanlar" },
      { label: "Favorilerim", href: "/favoriler" },
    ],
  },
  {
    title: "Hizmetler",
    links: [
      { label: "Evimin değeri ne kadar?", href: "/evimi-degerle" },
      { label: "Portföyümü vermek istiyorum", href: "/portfoy-ver" },
      { label: "Randevu al", href: "/randevu" },
      { label: "Hesaplayıcılar", href: "/hesaplayicilar" },
      { label: "Bölge rehberleri", href: "/bolgeler" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Ekibimiz", href: "/ekibimiz" },
      { label: "Blog", href: "/blog" },
      { label: "Sıkça sorulan sorular", href: "/sss" },
      { label: "İletişim", href: "/iletisim" },
    ],
  },
] as const;

export const legalNav = [
  { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
  { label: "Çerez Politikası", href: "/cerez-politikasi" },
  { label: "Kullanım Koşulları", href: "/kullanim-kosullari" },
] as const;
