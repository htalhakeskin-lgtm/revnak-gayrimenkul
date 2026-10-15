"use client";

import { Building2, Home, Video } from "lucide-react";
import { useMemo, useState } from "react";
import type { PanelAppointment } from "@/data/panel";
import { addDays, todayInIstanbul, weekdayOf } from "@/lib/availability";
import { appointmentsStore } from "@/lib/demo-store";
import { useHydrated } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const kindMeta = {
  yerinde: { label: "Yerinde gösterim", Icon: Home },
  ofis: { label: "Ofiste görüşme", Icon: Building2 },
  goruntulu: { label: "Görüntülü", Icon: Video },
} as const;

const dayFmt = new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "short", timeZone: "UTC" });

type Item = { id: string; date: string; time: string; kind: keyof typeof kindMeta; agentSlug: string; contact: string; listing?: string; local: boolean };

/** Admin takvimi (M05): gün/hafta görünümü, danışman filtresi. Bu tarayıcıda alınan randevular da görünür. */
export function WeekCalendar({
  mock,
  agents,
  listingNos,
}: {
  mock: PanelAppointment[];
  agents: { slug: string; name: string }[];
  listingNos: Record<string, string>;
}) {
  const hydrated = useHydrated();
  const local = appointmentsStore.use();
  const [agent, setAgent] = useState("hepsi");

  const days = useMemo(() => {
    if (!hydrated) return [];
    const today = todayInIstanbul(new Date());
    return Array.from({ length: 7 }, (_, i) => addDays(today, i));
  }, [hydrated]);

  const items: Item[] = useMemo(() => {
    if (!days.length) return [];
    // Örnek randevulardaki göreli gün, Pazar hariç n'inci iş günüdür
    const workdays = days.filter((d) => weekdayOf(d) !== 0);
    return [
      ...mock.map((a) => ({
        id: a.id,
        date: workdays[a.dayOffset] ?? "",
        time: a.time,
        kind: a.kind,
        agentSlug: a.agentSlug,
        contact: a.contactName,
        listing: a.listingSlug ? listingNos[a.listingSlug] : undefined,
        local: false,
      })),
      ...local.map((a) => ({
        id: a.id,
        date: a.date,
        time: a.time,
        kind: a.kind,
        agentSlug: a.agentSlug,
        contact: a.name,
        listing: a.listingSlug ? listingNos[a.listingSlug] : undefined,
        local: true,
      })),
    ].filter((i) => agent === "hepsi" || i.agentSlug === agent);
  }, [days, mock, local, agent, listingNos]);

  const agentName = (slug: string) => agents.find((a) => a.slug === slug)?.name ?? slug;

  if (!hydrated) return <div className="h-96 animate-pulse rounded-[20px] bg-sand/60" aria-hidden />;

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3 text-sm">
        <span className="text-fg-muted">Danışman</span>
        <select
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
          className="h-10 rounded-full border border-line bg-raised px-4"
        >
          <option value="hepsi">Tümü</option>
          {agents.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name}
            </option>
          ))}
        </select>
      </label>
      <div className="-mx-5 overflow-x-auto px-5 lg:-mx-10 lg:px-10" data-lenis-prevent-horizontal>
        <div className="grid min-w-[1100px] grid-cols-7 gap-3">
          {days.map((d, i) => {
            const dayItems = items.filter((x) => x.date === d).sort((a, b) => a.time.localeCompare(b.time));
            const closed = weekdayOf(d) === 0;
            const [y, m, dd] = d.split("-").map(Number);
            return (
              <section key={d} className={cn("rounded-[20px] p-3", i === 0 ? "bg-accent/10 ring-1 ring-accent/40" : "bg-sand/60")}>
                <h2 className="px-1 py-1 text-sm font-semibold capitalize">
                  {i === 0 ? "Bugün · " : ""}
                  {dayFmt.format(new Date(Date.UTC(y, m - 1, dd)))}
                </h2>
                <ul className="mt-2 space-y-2">
                  {closed ? <li className="px-1 text-xs text-fg-muted">Pazar · randevu ile</li> : null}
                  {dayItems.map((x) => {
                    const { label, Icon } = kindMeta[x.kind];
                    return (
                      <li key={x.id} className={cn("rounded-[12px] border bg-raised p-3 text-sm", x.local ? "border-gold" : "border-line")}>
                        <p className="tabular flex items-center justify-between font-semibold">
                          {x.time}
                          <Icon size={14} className="text-accent" aria-label={label} />
                        </p>
                        <p className="mt-1 truncate">{x.contact}</p>
                        <p className="truncate text-xs text-fg-muted">
                          {agentName(x.agentSlug)}
                          {x.listing ? ` · ${x.listing}` : ""}
                        </p>
                        {x.local ? <p className="mt-1 text-[0.625rem] font-bold tracking-wide text-gold-ink uppercase">Sizin randevunuz</p> : null}
                      </li>
                    );
                  })}
                  {!closed && dayItems.length === 0 ? <li className="px-1 text-xs text-fg-muted">Randevu yok</li> : null}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
