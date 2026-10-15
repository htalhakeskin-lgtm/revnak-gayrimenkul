"use server";

import { getAgent, getListing, getListingByNo } from "@/lib/data";
import { addDays, BOOKING_WINDOW_DAYS, isSlotBusy, isSlotPast, slotsFor, todayInIstanbul } from "@/lib/availability";
import {
  appointmentSchema,
  formDataToObject,
  leadSchema,
  zodErrors,
  type FieldErrors,
} from "@/lib/schemas";

/**
 * Sunucu eylemleri (M09, M05). Girdiler her zaman sunucuda yeniden doğrulanır.
 * Demo: kalıcı kayıt ve e-posta yok (Bölüm 20.2). Üretimde burada
 * leads/contacts/consents kaydı + danışmana bildirim + Turnstile doğrulaması yapılır.
 */

export type ActionResult =
  | { ok: true; ref: string; message: string }
  | { ok: false; errors: FieldErrors; message: string };

function reference(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

export async function submitLead(formData: FormData): Promise<ActionResult> {
  // Bal küpü alanı: botlar doldurur, insanlar görmez
  if (formData.get("website")) {
    return { ok: true, ref: reference("T"), message: "Talebiniz alındı." };
  }

  const parsed = leadSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { ok: false, errors: zodErrors(parsed.error), message: "Lütfen işaretli alanları kontrol edin." };
  }

  const lead = parsed.data;
  if (lead.listingNo && !(await getListingByNo(lead.listingNo))) {
    return { ok: false, errors: { listingNo: "İlan bulunamadı." }, message: "İlan bulunamadı." };
  }

  return {
    ok: true,
    ref: reference("T"),
    message:
      lead.kind === "degerleme"
        ? "Değerleme talebiniz alındı. Uzman danışmanımız 24 saat içinde sizi arayacak."
        : "Talebiniz alındı. Danışmanımız en kısa sürede size dönüş yapacak.",
  };
}

export async function bookAppointment(formData: FormData): Promise<ActionResult> {
  const parsed = appointmentSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { ok: false, errors: zodErrors(parsed.error), message: "Lütfen işaretli alanları kontrol edin." };
  }
  const a = parsed.data;

  if (!(await getAgent(a.agentSlug))) {
    return { ok: false, errors: { agentSlug: "Danışman bulunamadı." }, message: "Danışman bulunamadı." };
  }
  if (a.listingSlug && !(await getListing(a.listingSlug))) {
    return { ok: false, errors: { listingSlug: "İlan bulunamadı." }, message: "İlan bulunamadı." };
  }

  const now = new Date();
  const today = todayInIstanbul(now);
  if (a.date < today || a.date > addDays(today, BOOKING_WINDOW_DAYS)) {
    return { ok: false, errors: { date: "Bu tarih için randevu alınamaz." }, message: "Geçersiz tarih." };
  }
  if (!slotsFor(a.date).includes(a.time)) {
    return { ok: false, errors: { time: "Bu saat çalışma saatleri dışında." }, message: "Geçersiz saat." };
  }
  if (isSlotPast(a.date, a.time, now)) {
    return { ok: false, errors: { time: "Bu saat geçti. Lütfen daha ileri bir saat seçin." }, message: "Geçmiş saat." };
  }
  // Çakışma kontrolü (İP-23): dolu saate ikinci randevu alınamaz
  if (isSlotBusy(a.agentSlug, a.date, a.time)) {
    return {
      ok: false,
      errors: { time: "Bu saat az önce doldu. Lütfen başka bir saat seçin." },
      message: "Seçtiğiniz saat dolu.",
    };
  }

  return {
    ok: true,
    ref: reference("R"),
    message: "Randevunuz oluşturuldu. Onay bilgisi telefonunuza ve e-postanıza gönderilecek.",
  };
}
