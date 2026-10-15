/** Bölüm 12.4: fiyat `4.250.000 ₺`, alan `120 m²`, tarih `15 Ekim 2026` */

const tryFormatter = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });

export function formatNumber(value: number) {
  return tryFormatter.format(value);
}

export function formatPrice(value: number, currency: "TRY" | "USD" | "EUR" = "TRY") {
  const symbol = currency === "TRY" ? "₺" : currency === "USD" ? "$" : "€";
  return `${tryFormatter.format(value)} ${symbol}`;
}

/** Harita etiketleri gibi dar alanlar için: 45,5 Mn ₺ / 120 Bin ₺ */
export function formatPriceShort(value: number) {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    const text = m >= 100 ? Math.round(m).toString() : m.toFixed(1).replace(/\.0$/, "");
    return `${text.replace(".", ",")} Mn ₺`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)} Bin ₺`;
  }
  return `${value} ₺`;
}

export function formatArea(m2: number) {
  return `${tryFormatter.format(m2)} m²`;
}

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});

/** ISO tarih (YYYY-MM-DD) → "15 Ekim 2026" */
export function formatDate(iso: string) {
  return dateFormatter.format(new Date(`${iso}T12:00:00+03:00`));
}

/** İki ISO tarih arasındaki gün farkı (saf hesap; render sırasında "şimdi" kullanılmaz) */
export function daysBetween(fromIso: string, toIso: string) {
  const from = Date.UTC(...isoParts(fromIso));
  const to = Date.UTC(...isoParts(toIso));
  return Math.round((to - from) / 86_400_000);
}

function isoParts(iso: string): [number, number, number] {
  const [y, m, d] = iso.split("-").map(Number);
  return [y, m - 1, d];
}

export function pluralTr(count: number, word: string) {
  // Türkçede sayıdan sonra isim tekil kalır: "3 ilan"
  return `${formatNumber(count)} ${word}`;
}
