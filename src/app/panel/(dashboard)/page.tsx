import { ArrowUpRight, CalendarDays, Eye, Home, Inbox } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";
import { ActivityFeed } from "@/components/panel/local-feed";
import { SourceChart } from "@/components/panel/source-chart";
import { Photo } from "@/components/ui/photo";
import { addDays, todayInIstanbul } from "@/lib/availability";
import {
  getActiveListings,
  getAgents,
  getAppointmentsOnDates,
  getPanelData,
  getRecentLeadsCount,
  getRecentLeadsList,
} from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { listingUrl } from "@/lib/listing-utils";
import { minutesLabel, relativeTime, type FeedItem } from "@/lib/time";

export const metadata: Metadata = { title: "Pano" };

const kindLabels = { yerinde: "Yerinde gösterim", ofis: "Ofiste görüşme", goruntulu: "Görüntülü görüşme" } as const;
const leadKindLabels = {
  iletisim: "İletişim formu",
  "ilan-bilgi": "İlan bilgi talebi",
  portfoy: "Portföy başvurusu",
  degerleme: "Değerleme talebi",
} as const;

/** Admin ana panosu (M17 / İP-15). Gerçek talep/randevu sayıları veritabanından (K20). */
export default function PanelHome() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Pano</p>
        <h1 className="mt-2 text-h2">Hoş geldiniz, Selim</h1>
        <p className="mt-2 text-fg-muted">
          Talep ve randevu sayıları gerçektir (veritabanından). İlan istatistikleri, kanal dağılımı ve danışman
          performansı örnek veridir.
        </p>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <PanelHomeContent />
      </Suspense>
    </div>
  );
}

async function PanelHomeContent() {
  await connection(); // "şimdi"yi her istekte yeniden hesapla (Cache Components)
  const now = new Date();
  const today = todayInIstanbul(now);
  const since30 = addDays(today, -30);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const [panel, listings, agents, leadCount30, recentLeads, weekAppointments] = await Promise.all([
    getPanelData(),
    getActiveListings(),
    getAgents(),
    getRecentLeadsCount(`${since30}T00:00:00.000Z`),
    getRecentLeadsList(5),
    getAppointmentsOnDates(weekDates),
  ]);

  const agentName = (slug: string) => agents.find((a) => a.slug === slug)?.name ?? slug;
  const listingTitle = (slug?: string | null) => listings.find((l) => l.slug === slug);
  const totalViews = listings.reduce((a, l) => a + l.stats.views, 0);
  const popular = [...listings].sort((a, b) => b.stats.views - a.stats.views).slice(0, 5);

  const realToday = weekAppointments.filter((a) => a.date === today);
  const sampleToday = panel.appointments.filter((a) => a.dayOffset === 0);
  const todayCount = realToday.length + sampleToday.length;

  const realFeed: FeedItem[] = [
    ...recentLeads.map((l) => ({
      id: l.id,
      at: l.createdAt.toISOString(),
      text: `${l.name}: ${leadKindLabels[l.kind as keyof typeof leadKindLabels] ?? l.kind}${l.listingNo ? ` (${l.listingNo})` : ""}`,
      icon: "lead" as const,
    })),
    ...weekAppointments.slice(0, 5).map((a) => ({
      id: a.id,
      at: a.createdAt.toISOString(),
      text: `${a.name} randevu aldı · ${agentName(a.agentSlug)} (${a.date} ${a.time})`,
      icon: "randevu" as const,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5)
    .map((i) => ({ id: i.id, text: i.text, time: relativeTime(i.at, now.getTime()), badge: "gercek" as const, icon: i.icon }));

  const sampleFeed: FeedItem[] = panel.activities.map((a) => ({
    id: a.id,
    text: a.text,
    time: minutesLabel(a.minutesAgo),
    icon: a.kind === "whatsapp" ? "whatsapp" : a.kind === "randevu" ? "randevu" : "lead",
  }));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatTile icon={<Inbox size={18} />} label="Yeni talep (30 gün)" value={formatNumber(leadCount30)} note="Gerçek kayıt" href="/panel/talepler" live />
        <StatTile icon={<CalendarDays size={18} />} label="Bugünkü randevular" value={String(todayCount)} note={`${realToday.length} gerçek · ${sampleToday.length} örnek`} href="/panel/randevular" live={realToday.length > 0} />
        <StatTile icon={<Home size={18} />} label="Aktif ilan" value={String(listings.length)} note="Örnek veri" href="/panel/ilanlar" />
        <StatTile icon={<Eye size={18} />} label="İlan görüntülenme" value={formatNumber(totalViews)} note="Örnek veri" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <SourceChart data={panel.leadsBySource} title="Kaynağa göre talepler · örnek dağılım" />
        </Card>
        <Card className="xl:col-span-2" title="Bugünkü randevular" action={<Link href="/panel/randevular" className="text-sm font-semibold text-accent">Takvim</Link>}>
          {todayCount === 0 ? (
            <p className="py-6 text-center text-sm text-fg-muted">Bugün için randevu yok.</p>
          ) : (
            <ul className="divide-y divide-line">
              {realToday.map((a) => {
                const l = listingTitle(a.listingSlug);
                return (
                  <li key={a.id} className="flex gap-4 py-3">
                    <span className="tabular w-12 shrink-0 font-semibold">{a.time}</span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 truncate text-sm font-semibold">
                        {a.name}
                        <span className="rounded-full bg-success/15 px-2 py-0.5 text-[0.625rem] font-bold text-success uppercase">
                          Gerçek
                        </span>
                      </p>
                      <p className="truncate text-xs text-fg-muted">
                        {kindLabels[a.kind as keyof typeof kindLabels]} · {agentName(a.agentSlug)}
                        {l ? ` · ${l.no}` : ""}
                      </p>
                    </div>
                  </li>
                );
              })}
              {sampleToday.map((a) => {
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
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3" title="En çok görüntülenen ilanlar">
          <div className="-mx-5 overflow-x-auto sm:-mx-6">
            <table className="w-full text-left text-sm sm:min-w-[560px]">
              <thead className="text-xs text-fg-muted">
                <tr>
                  <th scope="col" className="px-5 py-2 font-medium">İlan</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    <span className="sm:hidden">Görüntü</span>
                    <span className="hidden sm:inline">Görüntülenme</span>
                  </th>
                  <th scope="col" className="hidden px-3 py-2 text-right font-medium sm:table-cell">Favori</th>
                  <th scope="col" className="hidden px-3 py-2 text-right font-medium sm:table-cell">WhatsApp</th>
                  <th scope="col" className="px-5 py-2 text-right font-medium">Randevu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {popular.map((l) => (
                  <tr key={l.id}>
                    <td className="px-5 py-3">
                      <Link href={listingUrl(l)} className="flex max-w-[8.5rem] items-center gap-3 hover:text-accent sm:max-w-[17rem]">
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
                    <td className="tabular hidden px-3 py-3 text-right sm:table-cell">{formatNumber(l.stats.favorites)}</td>
                    <td className="tabular hidden px-3 py-3 text-right sm:table-cell">{formatNumber(l.stats.whatsapp)}</td>
                    <td className="tabular px-5 py-3 text-right">{l.stats.appointments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="xl:col-span-2" title="Son hareketler">
          <ActivityFeed mock={[...realFeed, ...sampleFeed]} />
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Danışman performansı · bu ay (örnek)">
          <div className="-mx-5 overflow-x-auto sm:-mx-6">
            <table className="w-full text-left text-sm sm:min-w-[520px]">
              <thead className="text-xs text-fg-muted">
                <tr>
                  <th scope="col" className="px-5 py-2 font-medium">Danışman</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Talep</th>
                  <th scope="col" className="hidden px-3 py-2 text-right font-medium sm:table-cell">Gösterim</th>
                  <th scope="col" className="hidden px-3 py-2 text-right font-medium sm:table-cell">Dönüşüm</th>
                  <th scope="col" className="px-5 py-2 text-right font-medium">Kapanan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {panel.agentMonth.map((row) => (
                  <tr key={row.agentSlug}>
                    <td className="px-5 py-3 font-semibold">{agentName(row.agentSlug)}</td>
                    <td className="tabular px-3 py-3 text-right">{row.leads}</td>
                    <td className="tabular hidden px-3 py-3 text-right sm:table-cell">{row.showings}</td>
                    <td className="tabular hidden px-3 py-3 text-right sm:table-cell">%{Math.round((row.showings / row.leads) * 100)}</td>
                    <td className="tabular px-5 py-3 text-right">{row.closed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-hidden className="animate-pulse space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-28 rounded-[20px] bg-sand/60 sm:h-32" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-5">
        <div className="h-64 rounded-[20px] bg-sand/60 xl:col-span-3" />
        <div className="h-64 rounded-[20px] bg-sand/60 xl:col-span-2" />
      </div>
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
    <section className={`rounded-[20px] border border-line bg-raised p-5 sm:p-6 ${className ?? ""}`}>
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

function StatTile({
  icon,
  label,
  value,
  note,
  href,
  live,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
  href?: string;
  live?: boolean;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between text-fg-muted">
        <span className="text-xs leading-snug sm:text-sm">{label}</span>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent/12 text-accent sm:size-9">{icon}</span>
      </div>
      <p className="tabular mt-3 font-serif text-3xl sm:mt-4 sm:text-4xl">{value}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-fg-muted">
        {live ? <span className="size-1.5 shrink-0 rounded-full bg-success" aria-hidden /> : null}
        {note}
        {href ? <ArrowUpRight size={12} /> : null}
      </p>
    </>
  );
  return href ? (
    <Link href={href} className="block rounded-[20px] border border-line bg-raised p-4 transition-colors hover:border-accent sm:p-6">
      {body}
    </Link>
  ) : (
    <div className="rounded-[20px] border border-line bg-raised p-4 sm:p-6">{body}</div>
  );
}
