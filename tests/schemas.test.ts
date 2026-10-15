import { describe, expect, it } from "vitest";
import { getSlots, isSlotBusy, slotsFor, weekdayOf } from "@/lib/availability";
import { buildIcs } from "@/lib/ics";
import { appointmentSchema, leadSchema, phoneSchema } from "@/lib/schemas";

describe("phoneSchema", () => {
  it.each([
    ["0532 123 45 67", "+905321234567"],
    ["+90 (532) 123-45-67", "+905321234567"],
    ["5321234567", "+905321234567"],
    ["0212 000 00 00", "+902120000000"],
  ])("%s → %s", (input, expected) => {
    expect(phoneSchema.parse(input)).toBe(expected);
  });

  it("geçersiz numaraları reddeder", () => {
    expect(phoneSchema.safeParse("12345").success).toBe(false);
    expect(phoneSchema.safeParse("0932 123 45 67").success).toBe(false);
  });
});

describe("leadSchema", () => {
  const valid = { kind: "iletisim", name: "Ayşe Yılmaz", phone: "05321234567", kvkk: "on" };

  it("KVKK onayı olmadan kabul etmez (Bölüm 13.2)", () => {
    const r = leadSchema.safeParse({ ...valid, kvkk: undefined });
    expect(r.success).toBe(false);
  });

  it("ticari ileti iznini isteğe bağlı boolean'a çevirir", () => {
    expect(leadSchema.parse(valid).iys).toBe(false);
    expect(leadSchema.parse({ ...valid, iys: "on" }).iys).toBe(true);
  });

  it("boş e-postayı yok sayar, hatalı e-postayı reddeder", () => {
    expect(leadSchema.parse({ ...valid, email: "" }).email).toBeUndefined();
    expect(leadSchema.safeParse({ ...valid, email: "x@" }).success).toBe(false);
  });
});

describe("randevu müsaitliği", () => {
  it("pazar günü randevu yoktur", () => {
    expect(weekdayOf("2026-10-18")).toBe(0);
    expect(slotsFor("2026-10-18")).toEqual([]);
  });

  it("doluluk deterministiktir (sunucu ve tarayıcı aynı sonucu verir)", () => {
    const a = getSlots("kerem-aksoy", "2026-10-20");
    const b = getSlots("kerem-aksoy", "2026-10-20");
    expect(a).toEqual(b);
    for (const slot of a) expect(slot.busy).toBe(isSlotBusy("kerem-aksoy", "2026-10-20", slot.time));
  });

  it("randevu şeması saat biçimini doğrular", () => {
    const r = appointmentSchema.safeParse({
      agentSlug: "kerem-aksoy",
      kind: "ofis",
      date: "2026-10-20",
      time: "25-00",
      name: "Ali Veli",
      phone: "05321234567",
      kvkk: "on",
    });
    expect(r.success).toBe(false);
  });
});

describe("buildIcs", () => {
  it("Türkiye saatini UTC'ye çevirir", () => {
    const ics = buildIcs({
      uid: "R-TEST",
      date: "2026-10-20",
      time: "10:00",
      durationMinutes: 60,
      title: "Gösterim",
      description: "Test",
      location: "Bebek",
      stamp: "2026-10-16T10:00:00.000Z",
    });
    expect(ics).toContain("DTSTART:20261020T070000Z");
    expect(ics).toContain("DTEND:20261020T080000Z");
  });
});

describe("geçmiş saatler", () => {
  it("bugünün geçmiş ve 1 saatten yakın saatlerini kapatır", async () => {
    const { isSlotPast } = await import("@/lib/availability");
    // 20 Ekim 2026 11:10 TSİ = 08:10 UTC
    const now = new Date(Date.UTC(2026, 9, 20, 8, 10));
    expect(isSlotPast("2026-10-20", "10:00", now)).toBe(true);
    expect(isSlotPast("2026-10-20", "11:30", now)).toBe(true); // 60 dk ön süre
    expect(isSlotPast("2026-10-20", "13:00", now)).toBe(false);
    expect(isSlotPast("2026-10-21", "10:00", now)).toBe(false);
    expect(isSlotPast("2026-10-19", "17:30", now)).toBe(true);
  });
});
