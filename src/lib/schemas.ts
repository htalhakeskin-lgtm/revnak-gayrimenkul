import { z } from "zod";

/**
 * Form doğrulama şemaları (M09, M05). Aynı şema hem tarayıcıda hem sunucuda çalışır (Bölüm 11.1).
 */

/** Türkiye telefon numarası: 05xx…, 5xx…, +90…, 0212… biçimlerini kabul eder; +90XXXXXXXXXX'e normalize eder. */
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[^\d]/g, ""))
  .transform((digits) => digits.replace(/^(90|0)/, ""))
  .refine((d) => /^[2-5]\d{9}$/.test(d), "Geçerli bir telefon numarası girin (ör. 0532 123 45 67).")
  .transform((d) => `+90${d}`);

const nameSchema = z
  .string()
  .trim()
  .min(3, "Adınızı ve soyadınızı yazın.")
  .max(80, "En fazla 80 karakter.");

const emailOptional = z
  .string()
  .trim()
  .max(120)
  .refine((v) => v === "" || z.email().safeParse(v).success, "Geçerli bir e-posta adresi girin.")
  .transform((v) => (v === "" ? undefined : v))
  // Boş alanlar FormData'dan düşürülür; alanın hiç gelmemesi de geçerlidir.
  .optional();

const kvkkSchema = z.literal("on", { error: "Devam etmek için aydınlatma metnini onaylayın." });
const iysSchema = z
  .literal("on")
  .optional()
  .transform((v) => v === "on");

export const leadKinds = ["iletisim", "ilan-bilgi", "portfoy", "degerleme"] as const;

export const leadSchema = z.object({
  kind: z.enum(leadKinds),
  name: nameSchema,
  phone: phoneSchema,
  email: emailOptional,
  message: z.string().trim().max(1500, "En fazla 1500 karakter.").optional(),
  listingNo: z
    .string()
    .regex(/^RVK-\d{4}$/)
    .optional(),
  // Portföy / değerleme formlarının ek alanları
  region: z.string().max(40).optional(),
  propertyType: z.string().max(40).optional(),
  m2: z.coerce.number().int().min(15, "Geçerli bir metrekare girin.").max(20_000).optional(),
  rooms: z.string().max(20).optional(),
  buildingAge: z.string().max(20).optional(),
  condition: z.string().max(40).optional(),
  kvkk: kvkkSchema,
  iys: iysSchema,
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

export const appointmentKinds = ["yerinde", "ofis", "goruntulu"] as const;

export const appointmentSchema = z.object({
  agentSlug: z.string().regex(/^[a-z-]{3,40}$/, "Danışman seçin."),
  listingSlug: z
    .string()
    .regex(/^[a-z0-9-]{3,120}$/)
    .optional(),
  kind: z.enum(appointmentKinds, { error: "Randevu tipini seçin." }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih seçin."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Saat seçin."),
  name: nameSchema,
  phone: phoneSchema,
  email: emailOptional,
  note: z.string().trim().max(600).optional(),
  kvkk: kvkkSchema,
  iys: iysSchema,
});

export type Appointment = z.output<typeof appointmentSchema>;

/** FormData → düz nesne (boş alanlar yok sayılır, onay kutuları "on") */
export function formDataToObject(data: FormData) {
  const obj: Record<string, string> = {};
  for (const [key, value] of data.entries()) {
    if (typeof value === "string" && value !== "") obj[key] = value;
  }
  return obj;
}

export type FieldErrors = Record<string, string>;

export function zodErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
