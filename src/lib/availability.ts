/**
 * Danışman müsaitliği (M05). Demoda doluluk deterministik olarak üretilir:
 * aynı danışman + tarih + saat her zaman aynı sonucu verir, böylece sunucu ve tarayıcı tutarlıdır.
 * Üretimde `availability` ve `appointments` koleksiyonlarından okunur.
 */

/** Gösterim 60 dk + 30 dk tampon = 90 dk aralıklı başlangıç saatleri */
const WEEKDAY_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];
const SATURDAY_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00"];

export const APPOINTMENT_MINUTES = 60;
export const BOOKING_WINDOW_DAYS = 21;

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** YYYY-MM-DD → haftanın günü (0 = Pazar), saat dilimi bağımsız */
export function weekdayOf(dateIso: string) {
  const [y, m, d] = dateIso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function slotsFor(dateIso: string) {
  const day = weekdayOf(dateIso);
  if (day === 0) return [];
  return day === 6 ? SATURDAY_SLOTS : WEEKDAY_SLOTS;
}

export function isSlotBusy(agentSlug: string, dateIso: string, time: string) {
  return hash(`${agentSlug}|${dateIso}|${time}`) % 100 < 32;
}

/** Aynı gün için en az bu kadar dakika sonrası alınabilir */
export const LEAD_MINUTES = 60;

/** Bugünün geçmiş (veya ön süreden yakın) saatleri. `now` yalnızca istek anında / tarayıcıda verilir. */
export function isSlotPast(dateIso: string, time: string, now: Date) {
  if (dateIso !== todayInIstanbul(now)) return dateIso < todayInIstanbul(now);
  const tr = new Date(now.getTime() + 3 * 3_600_000);
  const nowMinutes = tr.getUTCHours() * 60 + tr.getUTCMinutes();
  const [hh, mm] = time.split(":").map(Number);
  return hh * 60 + mm < nowMinutes + LEAD_MINUTES;
}

export function getSlots(agentSlug: string, dateIso: string, now?: Date) {
  return slotsFor(dateIso).map((time) => ({
    time,
    busy: isSlotBusy(agentSlug, dateIso, time) || (now ? isSlotPast(dateIso, time, now) : false),
  }));
}

/** Türkiye saatine göre bugünün tarihi (YYYY-MM-DD). Yalnızca istek anında / tarayıcıda çağrılır. */
export function todayInIstanbul(now: Date) {
  const tr = new Date(now.getTime() + 3 * 3_600_000);
  return tr.toISOString().slice(0, 10);
}

export function addDays(dateIso: string, days: number) {
  const [y, m, d] = dateIso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** Bugünden itibaren randevu alınabilecek günler (Pazar hariç) */
export function bookableDays(todayIso: string) {
  const days: string[] = [];
  for (let i = 0; i <= BOOKING_WINDOW_DAYS && days.length < 14; i++) {
    const d = addDays(todayIso, i);
    if (weekdayOf(d) !== 0) days.push(d);
  }
  return days;
}
