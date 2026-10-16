"use client";

import { CalendarDays, Inbox, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { clicksStore } from "@/lib/demo-store";
import { useNow } from "@/lib/hooks";
import { relativeTime, type FeedItem } from "@/lib/time";

/**
 * Bu tarayıcıda yapılan WhatsApp/telefon tıklamaları (K20): henüz veritabanına
 * kaydedilmiyor, bu yüzden yalnızca gönderen kişinin kendi tarayıcısında görünür.
 * Form gönderimleri ve randevular artık gerçek (bkz. `mock` prop'u sunucudan gelir).
 */
export function useLocalFeed(): FeedItem[] {
  const now = useNow();
  const clicks = clicksStore.use();
  if (now === 0) return [];
  return clicks
    .map((c) => ({
      id: c.id,
      at: c.createdAt,
      text: `${c.channel === "whatsapp" ? "WhatsApp" : c.channel === "telefon" ? "Telefon" : "E-posta"} ilgisi${c.listingNo ? ` · ${c.listingNo}` : ""}`,
      icon: c.channel === "telefon" ? ("telefon" as const) : ("whatsapp" as const),
    }))
    .sort((a, b) => b.at.localeCompare(a.at))
    .map((i) => ({ id: i.id, text: i.text, time: relativeTime(i.at, now), badge: "sizin" as const, icon: i.icon }));
}

export function FeedIcon({ icon }: { icon: FeedItem["icon"] }) {
  const cls = "grid size-9 shrink-0 place-items-center rounded-full";
  if (icon === "whatsapp") return <span className={`${cls} bg-[#25d366]/15 text-[#1a8a4a]`}><WhatsAppIcon size={16} /></span>;
  if (icon === "telefon") return <span className={`${cls} bg-accent/12 text-accent`}><Phone size={16} /></span>;
  if (icon === "randevu") return <span className={`${cls} bg-accent/12 text-accent`}><CalendarDays size={16} /></span>;
  return <span className={`${cls} bg-accent/12 text-accent`}><Inbox size={16} /></span>;
}

function Badge({ kind }: { kind: NonNullable<FeedItem["badge"]> }) {
  if (kind === "gercek") {
    return (
      <span className="ml-2 rounded-full bg-success/15 px-2 py-0.5 text-[0.625rem] font-bold tracking-wide text-success uppercase">
        Gerçek
      </span>
    );
  }
  return (
    <span className="ml-2 rounded-full bg-gold/25 px-2 py-0.5 text-[0.625rem] font-bold tracking-wide text-gold-ink uppercase">
      Sizin
    </span>
  );
}

/** Pano: son hareketler. `mock` sunucudan gelir (gerçek veritabanı kayıtları + örnek veri karışık). */
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
              {item.badge ? <Badge kind={item.badge} /> : null}
            </p>
            <p className="text-xs text-fg-muted">{item.time}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
