/**
 * Ofis paneli vitrini için kurgusal CRM verisi (M10, M15, M17).
 * Zamanlar "bugün"e göreli (dayOffset / minutesAgo) tutulur; gerçek tarih tarayıcıda hesaplanır.
 */

export const pipelineStages = [
  "Yeni",
  "İletişim kuruldu",
  "Gösterim yapıldı",
  "Teklif",
  "Sözleşme",
  "Kazanıldı",
] as const;

export type PipelineStage = (typeof pipelineStages)[number];

export type ContactType = "Alıcı" | "Kiracı" | "Mülk sahibi" | "Yatırımcı";
export type LeadSource = "Web sitesi" | "Instagram" | "Portal" | "Tavsiye" | "Google";

export interface CrmContact {
  id: string;
  name: string;
  type: ContactType;
  source: LeadSource;
  budget: string;
  interest: string;
  agentSlug: string;
  stage: PipelineStage;
  lastActivity: string;
  daysAgo: number;
}

export const crmContacts: CrmContact[] = [
  { id: "c1", name: "Can Ö.", type: "Alıcı", source: "Instagram", budget: "50–65 Mn ₺", interest: "Bebek, 3+1, Boğaz", agentSlug: "kerem-aksoy", stage: "Gösterim yapıldı", lastActivity: "RVK-2041 gösterimi yapıldı", daysAgo: 1 },
  { id: "c2", name: "Leyla A.", type: "Kiracı", source: "Web sitesi", budget: "≤ 60 Bin ₺/ay", interest: "Moda, 2+1", agentSlug: "elif-tuncer", stage: "Yeni", lastActivity: "Web formu: RVK-3018 bilgi talebi", daysAgo: 0 },
  { id: "c3", name: "Hüseyin K.", type: "Mülk sahibi", source: "Tavsiye", budget: "—", interest: "Kandilli villası satış", agentSlug: "defne-yalcin", stage: "Sözleşme", lastActivity: "Yetkilendirme sözleşmesi imzalandı", daysAgo: 2 },
  { id: "c4", name: "Martina S.", type: "Alıcı", source: "Portal", budget: "90–110 Mn ₺", interest: "Yalıkavak villa", agentSlug: "nazli-ergin", stage: "Teklif", lastActivity: "RVK-2084 için teklif iletildi", daysAgo: 1 },
  { id: "c5", name: "Ozan T.", type: "Yatırımcı", source: "Google", budget: "15–20 Mn ₺", interest: "Ataşehir, kira getirisi", agentSlug: "mert-karaca", stage: "İletişim kuruldu", lastActivity: "Getiri karşılaştırması gönderildi", daysAgo: 3 },
  { id: "c6", name: "Zeynep ve Emre B.", type: "Alıcı", source: "Instagram", budget: "40–50 Mn ₺", interest: "Zekeriyaköy, bahçeli", agentSlug: "defne-yalcin", stage: "Gösterim yapıldı", lastActivity: "RVK-2096 ikinci gösterim", daysAgo: 0 },
  { id: "c7", name: "Ahmet Y.", type: "Mülk sahibi", source: "Web sitesi", budget: "—", interest: "Caddebostan 3+1 değerleme", agentSlug: "elif-tuncer", stage: "Yeni", lastActivity: "Değerleme sihirbazı dolduruldu", daysAgo: 0 },
  { id: "c8", name: "Global Lojistik A.Ş.", type: "Kiracı", source: "Tavsiye", budget: "≤ 450 Bin ₺/ay", interest: "Yeniköy müstakil, yönetici konutu", agentSlug: "defne-yalcin", stage: "Teklif", lastActivity: "Kira sözleşmesi taslağı paylaşıldı", daysAgo: 2 },
  { id: "c9", name: "Deniz M.", type: "Alıcı", source: "Portal", budget: "20–25 Mn ₺", interest: "Cihangir, manzaralı", agentSlug: "mert-karaca", stage: "İletişim kuruldu", lastActivity: "WhatsApp: RVK-2063 ilgisi", daysAgo: 1 },
  { id: "c10", name: "Selin G.", type: "Alıcı", source: "Google", budget: "30–35 Mn ₺", interest: "Caddebostan, yeni bina", agentSlug: "elif-tuncer", stage: "Kazanıldı", lastActivity: "Tapu devri tamamlandı", daysAgo: 6 },
  { id: "c11", name: "Rami H.", type: "Yatırımcı", source: "Instagram", budget: "60–80 Mn ₺", interest: "Nişantaşı ofis / daire", agentSlug: "mert-karaca", stage: "Gösterim yapıldı", lastActivity: "RVK-2105 gösterimi", daysAgo: 2 },
  { id: "c12", name: "Burcu E.", type: "Kiracı", source: "Web sitesi", budget: "≤ 170 Bin ₺/ay", interest: "Bebek, eşyalı", agentSlug: "kerem-aksoy", stage: "Yeni", lastActivity: "Online randevu: RVK-3015", daysAgo: 0 },
];

/** Son 30 gün, kaynağa göre gelen talep sayısı (M17 kanal analizi) */
export const leadsBySource: { source: LeadSource; count: number }[] = [
  { source: "Web sitesi", count: 48 },
  { source: "Instagram", count: 37 },
  { source: "Portal", count: 29 },
  { source: "Google", count: 21 },
  { source: "Tavsiye", count: 14 },
];

export interface PanelAppointment {
  id: string;
  dayOffset: number; // 0 = bugün, 1 = sonraki iş günü (Pazar atlanır)
  time: string;
  kind: "yerinde" | "ofis" | "goruntulu";
  agentSlug: string;
  listingSlug?: string;
  contactName: string;
}

export const panelAppointments: PanelAppointment[] = [
  { id: "a1", dayOffset: 0, time: "10:00", kind: "yerinde", agentSlug: "defne-yalcin", listingSlug: "zekeriyakoy-doga-icinde-4-1-ikiz-villa", contactName: "Zeynep ve Emre B." },
  { id: "a2", dayOffset: 0, time: "13:00", kind: "ofis", agentSlug: "elif-tuncer", contactName: "Ahmet Y." },
  { id: "a3", dayOffset: 0, time: "16:00", kind: "yerinde", agentSlug: "kerem-aksoy", listingSlug: "bebek-bogaz-manzarali-esyali-2-1-kiralik", contactName: "Burcu E." },
  { id: "a4", dayOffset: 0, time: "17:30", kind: "goruntulu", agentSlug: "nazli-ergin", listingSlug: "yalikavak-marina-manzarali-sonsuzluk-havuzlu-villa", contactName: "Martina S." },
  { id: "a5", dayOffset: 1, time: "11:30", kind: "yerinde", agentSlug: "mert-karaca", listingSlug: "cihangir-bogaz-ve-tarihi-yarimada-manzarali-2-1", contactName: "Deniz M." },
  { id: "a6", dayOffset: 1, time: "14:30", kind: "yerinde", agentSlug: "elif-tuncer", listingSlug: "moda-ferah-2-1-sahile-5-dakika-kiralik", contactName: "Leyla A." },
  { id: "a7", dayOffset: 2, time: "10:00", kind: "ofis", agentSlug: "mert-karaca", contactName: "Ozan T." },
  { id: "a8", dayOffset: 2, time: "16:00", kind: "yerinde", agentSlug: "defne-yalcin", listingSlug: "yenikoy-bahceli-mustakil-ev-uzun-donem-kiralik", contactName: "Global Lojistik A.Ş." },
  { id: "a9", dayOffset: 3, time: "13:00", kind: "yerinde", agentSlug: "kerem-aksoy", listingSlug: "bebek-bogaz-manzarali-yenilenmis-3-1-daire", contactName: "Can Ö." },
  { id: "a10", dayOffset: 4, time: "11:30", kind: "goruntulu", agentSlug: "selim-arikan", contactName: "Rami H." },
  { id: "a11", dayOffset: 5, time: "10:00", kind: "yerinde", agentSlug: "elif-tuncer", listingSlug: "caddebostan-yeni-binada-3-1-bagdat-caddesine-yurume", contactName: "Selin G. (referans)" },
];

export interface PanelActivity {
  id: string;
  minutesAgo: number;
  text: string;
  kind: "lead" | "whatsapp" | "randevu" | "ilan" | "sozlesme";
}

export const panelActivities: PanelActivity[] = [
  { id: "x1", minutesAgo: 12, text: "Leyla A. web formundan RVK-3018 için bilgi istedi", kind: "lead" },
  { id: "x2", minutesAgo: 38, text: "RVK-2063 ilanında WhatsApp tıklaması (Cihangir)", kind: "whatsapp" },
  { id: "x3", minutesAgo: 75, text: "Burcu E. RVK-3015 için online randevu aldı", kind: "randevu" },
  { id: "x4", minutesAgo: 140, text: "Elif Tuncer RVK-2109 ilanını yayına aldı", kind: "ilan" },
  { id: "x5", minutesAgo: 260, text: "Hüseyin K. ile yetkilendirme sözleşmesi imzalandı", kind: "sozlesme" },
  { id: "x6", minutesAgo: 410, text: "Ahmet Y. değerleme sihirbazını tamamladı", kind: "lead" },
];

/** Danışman bazlı aylık özet (M11 performans, M15 komisyon — kurgusal) */
export const agentMonth = [
  { agentSlug: "defne-yalcin", leads: 31, showings: 18, closed: 3 },
  { agentSlug: "elif-tuncer", leads: 38, showings: 22, closed: 4 },
  { agentSlug: "mert-karaca", leads: 27, showings: 15, closed: 2 },
  { agentSlug: "kerem-aksoy", leads: 22, showings: 13, closed: 2 },
  { agentSlug: "nazli-ergin", leads: 14, showings: 6, closed: 1 },
  { agentSlug: "selim-arikan", leads: 9, showings: 5, closed: 1 },
];
