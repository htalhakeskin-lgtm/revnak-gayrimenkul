import type { Metadata } from "next";
import { WeekCalendar } from "@/components/panel/week-calendar";
import { getAgents, getAllListings, getPanelData } from "@/lib/data";

export const metadata: Metadata = { title: "Randevular" };

export default async function PanelAppointmentsPage() {
  const [panel, agents, listings] = await Promise.all([getPanelData(), getAgents(), getAllListings()]);
  const listingNos = Object.fromEntries(listings.map((l) => [l.slug, l.no]));
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">M05 · Randevu</p>
        <h1 className="mt-2 text-h2">Haftalık takvim</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          Online alınan randevular çakışma kontrolünden geçerek buraya düşer. Sitede bir randevu alın; altın çerçeveyle burada görünür.
        </p>
      </div>
      <WeekCalendar
        mock={panel.appointments}
        agents={agents.map((a) => ({ slug: a.slug, name: a.name }))}
        listingNos={listingNos}
      />
    </div>
  );
}
