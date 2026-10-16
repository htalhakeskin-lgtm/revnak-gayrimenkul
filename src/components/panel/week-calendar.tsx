"use client";

import { Building2, Home, Video } from "lucide-react";
import { useMemo, useState } from "react";
import { weekdayOf } from "@/lib/availability";
import { cn } from "@/lib/utils";

const kindMeta = {
  yerinde: { label: "Yerinde gösterim", Icon: Home },
  ofis: { label: "Ofiste görüşme", Icon: Building2 },
  goruntulu: { label: "Görüntülü", Icon: Video },
} as const;

const dayFmt = new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "short", timeZone: "UTC" });

export interface CalendarItem {
  id: string;
  date: string;
  time: string;
  kind: keyof typeof kindMeta;
  agentSlug: string;
  contact: string;
  listing?: string;
  source: "gercek" | "ornek";
}

/**
 * Admin takvimi (M05): gün/hafta görünümü, danışman filtresi.
 * `days`, `real` (veritabanı) ve `sample` (örnek) sunucuda hesaplanır (K20).
 */
export function WeekCalendar({
  days,
  items,
  agents,
}: {
  days: string[];
  items: CalendarItem[];
  agents: { slug: string; name: string }[];
}) {
  const [agent, setAgent] = useState("hepsi");

  const filtered = useMemo(
    () => (agent === "hepsi" ? items : items.filter((i) => i.agentSlug === agent)),
    [items, agent],
  );

  const agentName = (slug: string) => agents.find((a) => a.slug === slug)?.name ?? slug;

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
      {/* Mobil: gün gün ajanda */}
      <div className="space-y-5 md:hidden">
        {days.map((d, i) => {
          const dayItems = filtered.filter((x) => x.date === d).sort((a, b) => a.time.localeCompare(b.time));
          const closed = weekdayOf(d) === 0;
          const [y, m, dd] = d.split("-").map(Number);
          return (
            <section key={d} aria-label={dayFmt.format(new Date(Date.UTC(y, m - 1, dd)))}>
              <h2 className={cn("mb-2 text-sm font-semibold capitalize", i === 0 && "text-accent")}>
                {i === 0 ? "Bugün · " : ""}
                {dayFmt.format(new Date(Date.UTC(y, m - 1, dd)))}
              </h2>
              {closed || dayItems.length === 0 ? (
                <p className="rounded-[12px] bg-sand/60 px-4 py-3 text-xs text-fg-muted">
                  {closed ? "Pazar · randevu ile" : "Randevu yok"}
                </p>
              ) : (
                <ul className="space-y-2">
                  {dayItems.map((x) => {
                    const { label, Icon } = kindMeta[x.kind];
                    return (
                      <li
                        key={x.id}
                        className={cn("flex items-center gap-4 rounded-[12px] border bg-raised p-3", x.source === "gercek" ? "border-success" : "border-line")}
                      >
                        <span className="tabular w-12 shrink-0 font-semibold">{x.time}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{x.contact}</p>
                          <p className="truncate text-xs text-fg-muted">
                            {label} · {agentName(x.agentSlug)}
                            {x.listing ? ` · ${x.listing}` : ""}
                          </p>
                          {x.source === "gercek" ? (
                            <p className="mt-0.5 text-[0.625rem] font-bold tracking-wide text-success uppercase">Gerçek</p>
                          ) : (
                            <p className="mt-0.5 text-[0.625rem] font-bold tracking-wide text-fg-muted uppercase">Örnek</p>
                          )}
                        </div>
                        <Icon size={16} className="shrink-0 text-accent" aria-hidden />
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {/* Masaüstü: haftalık ızgara */}
      <div className="-mx-5 hidden overflow-x-auto px-5 md:block lg:-mx-10 lg:px-10" data-lenis-prevent-horizontal>
        <div className="grid min-w-[1100px] grid-cols-7 gap-3">
          {days.map((d, i) => {
            const dayItems = filtered.filter((x) => x.date === d).sort((a, b) => a.time.localeCompare(b.time));
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
                      <li key={x.id} className={cn("rounded-[12px] border bg-raised p-3 text-sm", x.source === "gercek" ? "border-success" : "border-line")}>
                        <p className="tabular flex items-center justify-between font-semibold">
                          {x.time}
                          <Icon size={14} className="text-accent" aria-label={label} />
                        </p>
                        <p className="mt-1 truncate">{x.contact}</p>
                        <p className="truncate text-xs text-fg-muted">
                          {agentName(x.agentSlug)}
                          {x.listing ? ` · ${x.listing}` : ""}
                        </p>
                        {x.source === "gercek" ? (
                          <p className="mt-1 text-[0.625rem] font-bold tracking-wide text-success uppercase">Gerçek</p>
                        ) : (
                          <p className="mt-1 text-[0.625rem] font-bold tracking-wide text-fg-muted uppercase">Örnek</p>
                        )}
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
