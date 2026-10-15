/** Göreli zaman etiketleri (panel akışı). Saf fonksiyonlar; sunucu ve tarayıcıda kullanılabilir. */

export function relativeTime(iso: string, now: number) {
  const diff = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60_000));
  if (diff < 1) return "az önce";
  if (diff < 60) return `${diff} dk önce`;
  if (diff < 60 * 24) return `${Math.round(diff / 60)} saat önce`;
  return `${Math.round(diff / 1440)} gün önce`;
}

export function minutesLabel(minutes: number) {
  if (minutes < 60) return `${minutes} dk önce`;
  return `${Math.round(minutes / 60)} saat önce`;
}

export type FeedItem = {
  id: string;
  text: string;
  time: string;
  local: boolean;
  icon: "lead" | "whatsapp" | "telefon" | "randevu";
};
