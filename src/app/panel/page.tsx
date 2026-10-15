import { ArrowUpRight, CalendarDays, Eye, Home, Inbox } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ActivityFeed } from "@/components/panel/local-feed";
import { SourceChart } from "@/components/panel/source-chart";
import { Photo } from "@/components/ui/photo";
import { getActiveListings, getAgents, getPanelData } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { listingUrl } from "@/lib/listing-utils";
import { minutesLabel, type FeedItem } from "@/lib/time";

export const metadata: Metadata = { title: "Pano" };

const kindLabels = { yerinde: "Yerinde gösterim", ofis: "Ofiste görüşme", goruntulu: "Görüntülü görüşme" } as const;

/** Admin ana panosu (M17 / İP-15) */
export default async function PanelHome() {
  const [panel, listings, agents] = await Promise.all([getPanelData(), getActiveListings(), getAgents()]);
  const agentName = (slug: string) => agents.find((a) => a.slug === slug)?.name ?? slug;
  const today = panel.appointments.filter((a) => a.dayOffset === 0);
  const totalLeads = panel.leadsBySource.reduce((a, b) => a + b.count, 0);
  const totalViews = listings.reduce((a, l) => a + l.stats.views, 0);
  const popular = [...listings].sort((a, b) => b.stats.views - a.stats.views).slice(0, 5);
  const listingTitle = (slug?: string) => listings.find((l) => l.slug === slug);
  const mockFeed: FeedItem[] = panel.activities.map((a) => ({
    id: a.id,
    text: a.text,
    time: minutesLabel(a.minutesAgo),
    local: false,
    icon: a.kind === "whatsapp" ? "whatsapp" : a.kind === "randevu" ? "randevu" : "lead",
  }));

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Pano</p>
        <h1 className="mt-2 text-h2">Hoş geldiniz, Selim</h1>
        <p className="mt-2 text-fg-muted">Ofisin bugünkü durumu. Rakamlar kurgusaldır; sitede yaptığınız işlemler canlı olarak eklenir.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile icon={<Inbox size={18} />} label="Yeni talep (30 gün)" value={formatNumber(totalLeads)} note="+18% önceki döneme göre" href="/panel/talepler" />
        <StatTile icon={<CalendarDays size={18} />} label="Bugünkü randevular" value={String(today.length)} note={`${panel.appointments.length} randevu bu hafta`} href="/panel/randevular" />
        <StatTile icon={<Home size={18} />} label="Aktif ilan" value={String(listings.length)} note="1 opsiyonlu" href="/panel/ilanlar" />
        <StatTile icon={<Eye size={18} />} label="İlan görüntülenme" value={formatNumber(totalViews)} note="Son 30 gün" />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <SourceChart data={panel.leadsBySource} title="Kaynağa göre talepler · son 30 gün" />
        </Card>
        <Card className="xl:col-span-2" title="Bugünkü randevular" action={<Link href="/panel/randevular" className="text-sm font-semibold text-accent">Takvim</Link>}>
          <ul className="divide-y divide-line">
            {today.map((a) => {
              const l = listingTitle(a.listingSlug);
              return (
                <li key={a.id} className="flex gap-4 py-3">
                  <span className="tabular w-12 shrink-0 font-semibold">{a.time}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{a.contactName}</p>
                    <p className="truncate text-xs text-fg-muted">
                      {kindLabels[a.kind]} · {agentName(a.agentSlug)}
                      {l ? ` · ${l.no}` : ""}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3" title="En çok görüntülenen ilanlar">
          <div className="-mx-6 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs text-fg-muted">
                <tr>
                  <th scope="col" className="px-6 py-2 font-medium">İlan</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Görüntülenme</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Favori</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">WhatsApp</th>
                  <th scope="col" className="px-6 py-2 text-right font-medium">Randevu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {popular.map((l) => (
                  <tr key={l.id}>
                    <td className="px-6 py-3">
                      <Link href={listingUrl(l)} className="flex max-w-[17rem] items-center gap-3 hover:text-accent">
                        <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-sand">
                          <Photo src={l.images[0]} alt="" fill sizes="40px" className="object-cover" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{l.title}</span>
                          <span className="block text-xs text-fg-muted">{l.no}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="tabular px-3 py-3 text-right">{formatNumber(l.stats.views)}</td>
                    <td className="tabular px-3 py-3 text-right">{formatNumber(l.stats.favorites)}</td>
                    <td className="tabular px-3 py-3 text-right">{formatNumber(l.stats.whatsapp)}</td>
                    <td className="tabular px-6 py-3 text-right">{l.stats.appointments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="xl:col-span-2" title="Son hareketler">
          <ActivityFeed mock={mockFeed} />
        </Card>
      </div>

      <Card title="Danışman performansı · bu ay">
        <div className="-mx-6 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs text-fg-muted">
              <tr>
                <th scope="col" className="px-6 py-2 font-medium">Danışman</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Talep</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Gösterim</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Dönüşüm</th>
                <th scope="col" className="px-6 py-2 text-right font-medium">Kapanan işlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {panel.agentMonth.map((row) => (
                <tr key={row.agentSlug}>
                  <td className="px-6 py-3 font-semibold">{agentName(row.agentSlug)}</td>
                  <td className="tabular px-3 py-3 text-right">{row.leads}</td>
                  <td className="tabular px-3 py-3 text-right">{row.showings}</td>
                  <td className="tabular px-3 py-3 text-right">%{Math.round((row.showings / row.leads) * 100)}</td>
                  <td className="tabular px-6 py-3 text-right">{row.closed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Card({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[20px] border border-line bg-raised p-6 ${className ?? ""}`}>
      {title ? (
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-semibold">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

function StatTile({ icon, label, value, note, href }: { icon: ReactNode; label: string; value: string; note: string; href?: string }) {
  const body = (
    <>
      <div className="flex items-center justify-between text-fg-muted">
        <span className="text-sm">{label}</span>
        <span className="grid size-9 place-items-center rounded-full bg-accent/12 text-accent">{icon}</span>
      </div>
      <p className="tabular mt-4 font-serif text-4xl">{value}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-fg-muted">
        {note}
        {href ? <ArrowUpRight size={12} /> : null}
      </p>
    </>
  );
  return href ? (
    <Link href={href} className="block rounded-[20px] border border-line bg-raised p-6 transition-colors hover:border-accent">
      {body}
    </Link>
  ) : (
    <div className="rounded-[20px] border border-line bg-raised p-6">{body}</div>
  );
}
