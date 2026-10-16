"use server";

import { getAgent, getListing, getListingByNo } from "@/lib/data";
import { addDays, BOOKING_WINDOW_DAYS, isSlotBusy, isSlotPast, slotsFor, todayInIstanbul } from "@/lib/availability";
import { hasConfirmedAppointment, insertAppointment, insertLead } from "@/db/queries";
import {
  appointmentSchema,
  formDataToObject,
  leadSchema,
  zodErrors,
  type FieldErrors,
} from "@/lib/schemas";

/**
 * Sunucu eylemleri (M09, M05). Girdiler her zaman sunucuda yeniden doğrulanır.
 * Formlar ve randevular gerçek veritabanına (Neon Postgres, K20) kaydedilir ve
 * parola korumalı panelde (/panel/talepler, /panel/randevular) görünür. E-posta/SMS
 * bildirimi ve Turnstile doğrulaması henüz yok (bir sonraki adım).
 */

export type ActionResult =
  | { ok: true; ref: string; message: string }
  | { ok: false; errors: FieldErrors; message: string };

const DB_ERROR: ActionResult = {
  ok: false,
  errors: { form: "Şu anda kaydedilemedi, lütfen birazdan tekrar deneyin." },
  message: "Sunucu hatası. Lütfen tekrar deneyin.",
};

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

  const ref = reference("T");
  try {
    await insertLead({
      id: crypto.randomUUID(),
      ref,
      kind: lead.kind,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      message: lead.message,
      listingNo: lead.listingNo,
      region: lead.region,
      propertyType: lead.propertyType,
      m2: lead.m2,
      rooms: lead.rooms,
      buildingAge: lead.buildingAge,
      condition: lead.condition,
      iysConsent: lead.iys,
      consentVersion: "v0.1-demo",
    });
  } catch (error) {
    console.error("submitLead: insertLead başarısız", error);
    return DB_ERROR;
  }

  return {
    ok: true,
    ref,
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
  // Çakışma kontrolü (İP-23): örnek doluluk + veritabanındaki gerçek randevular
  if (isSlotBusy(a.agentSlug, a.date, a.time)) {
    return {
      ok: false,
      errors: { time: "Bu saat az önce doldu. Lütfen başka bir saat seçin." },
      message: "Seçtiğiniz saat dolu.",
    };
  }
  try {
    if (await hasConfirmedAppointment(a.agentSlug, a.date, a.time)) {
      return {
        ok: false,
        errors: { time: "Bu saat az önce doldu. Lütfen başka bir saat seçin." },
        message: "Seçtiğiniz saat dolu.",
      };
    }
  } catch (error) {
    console.error("bookAppointment: çakışma kontrolü başarısız", error);
    return DB_ERROR;
  }

  const ref = reference("R");
  try {
    await insertAppointment({
      id: crypto.randomUUID(),
      ref,
      agentSlug: a.agentSlug,
      listingSlug: a.listingSlug,
      kind: a.kind,
      date: a.date,
      time: a.time,
      name: a.name,
      phone: a.phone,
      email: a.email,
      note: a.note,
      iysConsent: a.iys,
      status: "onaylandi",
    });
  } catch (error) {
    console.error("bookAppointment: insertAppointment başarısız", error);
    return DB_ERROR;
  }

  return {
    ok: true,
    ref,
    message: "Randevunuz oluşturuldu. Danışmanınız randevu saatinden önce sizi arayarak teyit edecek.",
  };
}
