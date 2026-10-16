"use client";

import { Inbox as InboxIcon } from "lucide-react";
import { clicksStore } from "@/lib/demo-store";
import { useHydrated } from "@/lib/hooks";
import { FeedIcon, useLocalFeed } from "./local-feed";

export interface RealLeadRow {
  id: string;
  ref: string;
  name: string;
  phone: string;
  email: string | null;
  kindLabel: string;
  detail: string;
  message: string | null;
  when: string;
}

export interface SampleLeadRow {
  id: string;
  name: string;
  source: string;
  interest: string;
  agent: string;
  when: string;
  stage: string;
}

const kindTone: Record<string, string> = {
  "Değerleme talebi": "bg-gold/25 text-gold-ink",
  "Portföy başvurusu": "bg-success/15 text-success",
  "İlan bilgi talebi": "bg-accent/12 text-accent",
  "İletişim formu": "bg-ink/8 text-ink",
};

/** Gelen talepler (M09 → M10): gerçek veritabanı kayıtları + (ayrı bölümde) örnek veri */
export function Inbox({ real, sample }: { real: RealLeadRow[]; sample: SampleLeadRow[] }) {
  const hydrated = useHydrated();
  const clicks = clicksStore.use();
  const localFeed = useLocalFeed();

  return (
    <div className="space-y-10">
      <section aria-labelledby="real-title">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="real-title" className="flex items-center gap-2 font-semibold">
            Gerçek talepler
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[0.625rem] font-bold text-success uppercase">
              Veritabanı
            </span>
          </h2>
          <span className="text-sm text-fg-muted">{real.length} kayıt</span>
        </div>

        {real.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-line bg-raised p-8 text-center">
            <InboxIcon size={28} className="mx-auto text-fg-muted" aria-hidden />
            <p className="mt-3 font-semibold">Henüz gerçek talep yok</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-fg-muted">
              Sitede iletişim, ilan bilgi, portföy veya değerleme formu gönderildiğinde burada listelenir.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-[20px] border border-line bg-raised">
            {real.map((r) => (
              <li key={r.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-sm text-fg-muted">
                      {r.phone}
                      {r.email ? ` · ${r.email}` : ""}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${kindTone[r.kindLabel] ?? "bg-sand text-ink"}`}>
                    {r.kindLabel}
                  </span>
                </div>
                {r.detail ? <p className="mt-2 text-sm">{r.detail}</p> : null}
                {r.message ? <p className="mt-1 text-sm text-fg-muted italic">“{r.message}”</p> : null}
                <div className="mt-3 flex items-center justify-between text-xs text-fg-muted">
                  <span>{r.when}</span>
                  <span className="tabular">{r.ref}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="clicks-title">
        <h2 id="clicks-title" className="mb-4 font-semibold">
          Bu tarayıcıdaki WhatsApp / telefon ilgisi
        </h2>
        {!hydrated ? (
          <div className="h-24 animate-pulse rounded-[14px] bg-sand/60" aria-hidden />
        ) : clicks.length === 0 ? (
          <p className="rounded-[14px] bg-sand/60 p-4 text-sm text-fg-muted">
            Henüz WhatsApp veya telefon butonuna tıklanmadı. Bu veri şimdilik yalnızca sizin tarayıcınızda tutuluyor,
            veritabanına kaydedilmiyor.
          </p>
        ) : (
          <ul className="divide-y divide-line rounded-[14px] border border-line bg-raised">
            {localFeed.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                <FeedIcon icon={item.icon} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{item.text}</p>
                  <p className="text-xs text-fg-muted">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="mock-title">
        <h2 id="mock-title" className="mb-4 flex items-center gap-2 font-semibold text-fg-muted">
          Örnek talepler
          <span className="rounded-full bg-sand px-2 py-0.5 text-[0.625rem] font-bold uppercase">Örnek veri</span>
        </h2>
        <div className="overflow-x-auto rounded-[20px] border border-line bg-raised">
          <ul className="divide-y divide-line md:hidden">
            {sample.map((m) => (
              <li key={m.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{m.name}</p>
                  <span className="shrink-0 rounded-full bg-sand px-2.5 py-1 text-xs font-semibold">{m.stage}</span>
                </div>
                <p className="mt-1 text-sm">{m.interest}</p>
                <p className="mt-1 text-xs text-fg-muted">
                  {m.source} · {m.agent} · {m.when}
                </p>
              </li>
            ))}
          </ul>
          <table className="hidden w-full min-w-[620px] text-left text-sm md:table">
            <thead className="text-xs text-fg-muted">
              <tr className="border-b border-line">
                <th scope="col" className="px-6 py-3 font-medium">Kişi</th>
                <th scope="col" className="px-3 py-3 font-medium">İlgi</th>
                <th scope="col" className="px-3 py-3 font-medium">Kaynak</th>
                <th scope="col" className="px-3 py-3 font-medium">Danışman</th>
                <th scope="col" className="px-6 py-3 font-medium">Aşama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sample.map((m) => (
                <tr key={m.id}>
                  <td className="px-6 py-3">
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-xs text-fg-muted">{m.when}</p>
                  </td>
                  <td className="px-3 py-3">{m.interest}</td>
                  <td className="px-3 py-3">{m.source}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{m.agent}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-semibold whitespace-nowrap">{m.stage}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
