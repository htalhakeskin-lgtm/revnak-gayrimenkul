"use client";

import { CalendarDays, Inbox, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { appointmentsStore, clicksStore, leadsStore } from "@/lib/demo-store";
import { useNow } from "@/lib/hooks";
import { relativeTime, type FeedItem } from "@/lib/time";

const leadKindLabels = {
  iletisim: "İletişim formu",
  "ilan-bilgi": "İlan bilgi talebi",
  portfoy: "Portföy başvurusu",
  degerleme: "Değerleme talebi",
} as const;

const shortDateFmt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", weekday: "short", timeZone: "UTC" });

function shortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return shortDateFmt.format(new Date(Date.UTC(y, m - 1, d)));
}

/** Bu tarayıcıda yapılan demo işlemleri (form, randevu, iletişim tıklaması) akışa eklenir. */
export function useLocalFeed(): FeedItem[] {
  const now = useNow();
  const leads = leadsStore.use();
  const clicks = clicksStore.use();
  const appointments = appointmentsStore.use();
  if (now === 0) return [];
  const items = [
    ...leads.map((l) => ({
      id: l.id,
      at: l.createdAt,
      text: `${l.name}: ${leadKindLabels[l.kind]}${l.listingNo ? ` (${l.listingNo})` : ""}`,
      icon: "lead" as const,
    })),
    ...clicks.map((c) => ({
      id: c.id,
      at: c.createdAt,
      text: `${c.channel === "whatsapp" ? "WhatsApp" : c.channel === "telefon" ? "Telefon" : "E-posta"} ilgisi${c.listingNo ? ` · ${c.listingNo}` : ""}`,
      icon: c.channel === "telefon" ? ("telefon" as const) : ("whatsapp" as const),
    })),
    ...appointments.map((a) => ({
      id: a.id,
      at: a.createdAt,
      text: `${a.name} online randevu aldı (${shortDate(a.date)} ${a.time})`,
      icon: "randevu" as const,
    })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  return items.map((i) => ({ id: i.id, text: i.text, time: relativeTime(i.at, now), local: true, icon: i.icon }));
}

export function FeedIcon({ icon }: { icon: FeedItem["icon"] }) {
  const cls = "grid size-9 shrink-0 place-items-center rounded-full";
  if (icon === "whatsapp") return <span className={`${cls} bg-[#25d366]/15 text-[#1a8a4a]`}><WhatsAppIcon size={16} /></span>;
  if (icon === "telefon") return <span className={`${cls} bg-accent/12 text-accent`}><Phone size={16} /></span>;
  if (icon === "randevu") return <span className={`${cls} bg-accent/12 text-accent`}><CalendarDays size={16} /></span>;
  return <span className={`${cls} bg-accent/12 text-accent`}><Inbox size={16} /></span>;
}

/** Pano: son hareketler (yerel + örnek) */
export function ActivityFeed({ mock }: { mock: FeedItem[] }) {
  const local = useLocalFeed();
  const items = [...local, ...mock].slice(0, 8);
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-3 py-3">
          <FeedIcon icon={item.icon} />
          <div className="min-w-0 flex-1">
            <p className="text-sm">
              {item.text}
              {item.local ? (
                <span className="ml-2 rounded-full bg-gold/25 px-2 py-0.5 text-[0.625rem] font-bold tracking-wide text-gold-ink uppercase">Sizin</span>
              ) : null}
            </p>
            <p className="text-xs text-fg-muted">{item.time}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
