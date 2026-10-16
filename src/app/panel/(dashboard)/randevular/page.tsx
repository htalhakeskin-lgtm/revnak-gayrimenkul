import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { type CalendarItem, WeekCalendar } from "@/components/panel/week-calendar";
import { addDays, todayInIstanbul, weekdayOf } from "@/lib/availability";
import { getAgents, getAllListings, getAppointmentsOnDates, getPanelData } from "@/lib/data";

export const metadata: Metadata = { title: "Randevular" };

export default function PanelAppointmentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">M05 · Randevu</p>
        <h1 className="mt-2 text-h2">Haftalık takvim</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          Online alınan randevular çakışma kontrolünden geçerek veritabanına kaydedilir ve buraya düşer (yeşil
          çerçeve). Örnek randevular gri çerçevelidir.
        </p>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-[20px] bg-sand/60" aria-hidden />}>
        <CalendarContent />
      </Suspense>
    </div>
  );
}

async function CalendarContent() {
  await connection(); // "bugün"ü her istekte yeniden hesapla (Cache Components)
  const today = todayInIstanbul(new Date());
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const workdays = days.filter((d) => weekdayOf(d) !== 0);

  const [panel, agents, listings, realAppointments] = await Promise.all([
    getPanelData(),
    getAgents(),
    getAllListings(),
    getAppointmentsOnDates(days),
  ]);
  const listingNos = Object.fromEntries(listings.map((l) => [l.slug, l.no]));

  const items: CalendarItem[] = [
    ...panel.appointments.map((a) => ({
      id: a.id,
      date: workdays[a.dayOffset] ?? "",
      time: a.time,
      kind: a.kind,
      agentSlug: a.agentSlug,
      contact: a.contactName,
      listing: a.listingSlug ? listingNos[a.listingSlug] : undefined,
      source: "ornek" as const,
    })),
    ...realAppointments.map((a) => ({
      id: a.id,
      date: a.date,
      time: a.time,
      kind: a.kind as CalendarItem["kind"],
      agentSlug: a.agentSlug,
      contact: a.name,
      listing: a.listingSlug ? listingNos[a.listingSlug] : undefined,
      source: "gercek" as const,
    })),
  ];

  return (
    <WeekCalendar
      days={days}
      items={items}
      agents={agents.map((a) => ({ slug: a.slug, name: a.name }))}
    />
  );
}
