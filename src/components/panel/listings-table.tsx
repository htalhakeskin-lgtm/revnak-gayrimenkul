"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface PanelListingRow {
  id: string;
  no: string;
  slug: string;
  title: string;
  status: "yayinda" | "opsiyonlu" | "satildi" | "kiralandi";
  statusLabel: string;
  transaction: string;
  agent: string;
  price: string;
  views: number;
  favorites: number;
  whatsapp: number;
  appointments: number;
  publishedAt: string;
  hasDocs: boolean;
}

const filters = [
  { key: "hepsi", label: "Tümü" },
  { key: "yayinda", label: "Yayında" },
  { key: "opsiyonlu", label: "Opsiyonlu" },
  { key: "kapanan", label: "Satıldı / Kiralandı" },
] as const;

const statusClass: Record<PanelListingRow["status"], string> = {
  yayinda: "bg-success/12 text-success",
  opsiyonlu: "bg-gold/25 text-gold-ink",
  satildi: "bg-ink/10 text-ink",
  kiralandi: "bg-ink/10 text-ink",
};

const fmt = new Intl.NumberFormat("tr-TR");

/** İlan yönetimi tablosu (M01). Gerçek sürümde Payload koleksiyon görünümü + toplu işlemler. */
export function ListingsTable({ rows }: { rows: PanelListingRow[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("hepsi");
  const shown = rows.filter((r) =>
    filter === "hepsi" ? true : filter === "kapanan" ? r.status === "satildi" || r.status === "kiralandi" : r.status === filter,
  );

  return (
    <div className="rounded-[20px] border border-line bg-raised">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-3 sm:p-4">
        <div className="flex flex-wrap gap-1" role="group" aria-label="Durum filtresi">
          {filters.map((f) => {
            const count = rows.filter((r) =>
              f.key === "hepsi" ? true : f.key === "kapanan" ? r.status === "satildi" || r.status === "kiralandi" : r.status === f.key,
            ).length;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors sm:px-4",
                  filter === f.key ? "bg-ink text-ivory" : "text-fg-muted hover:bg-sand hover:text-fg",
                )}
              >
                {f.label} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          disabled
          title="Demo: yeni ilan girişi Payload admin panelinde yapılır"
          className="h-10 rounded-full bg-ink px-5 text-sm font-semibold text-ivory opacity-60"
        >
          + Yeni ilan
        </button>
      </div>
      {/* Mobil: kart listesi */}
      <ul className="divide-y divide-line md:hidden">
        {shown.map((r) => (
          <li key={r.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/ilan/${r.slug}`} className="min-w-0 font-semibold leading-snug hover:text-accent">
                {r.title}
              </Link>
              <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", statusClass[r.status])}>
                {r.statusLabel}
              </span>
            </div>
            <p className="mt-1 text-xs text-fg-muted">
              {r.no} · {r.transaction} · {r.agent}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="tabular font-semibold">{r.price}</span>
              <span className="tabular text-xs text-fg-muted">
                {fmt.format(r.views)} görüntülenme · {fmt.format(r.whatsapp)} WhatsApp · {r.appointments} randevu
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Masaüstü: tablo */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-xs text-fg-muted">
            <tr className="border-b border-line">
              <th scope="col" className="px-4 py-3 font-medium">İlan</th>
              <th scope="col" className="px-3 py-3 font-medium">Durum</th>
              <th scope="col" className="px-3 py-3 font-medium">Danışman</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Fiyat</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Görüntülenme</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Favori</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">WhatsApp</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Randevu</th>
              <th scope="col" className="px-4 py-3 font-medium">Belge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {shown.map((r) => (
              <tr key={r.id} className="hover:bg-ivory/60">
                <td className="max-w-80 px-4 py-3">
                  <Link href={`/ilan/${r.slug}`} className="group flex items-center gap-2 font-semibold hover:text-accent">
                    <span className="truncate">{r.title}</span>
                    <ExternalLink size={12} className="shrink-0 opacity-0 group-hover:opacity-100" />
                  </Link>
                  <span className="text-xs text-fg-muted">
                    {r.no} · {r.transaction} · {r.publishedAt}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusClass[r.status])}>{r.statusLabel}</span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">{r.agent}</td>
                <td className="tabular px-3 py-3 text-right whitespace-nowrap">{r.price}</td>
                <td className="tabular px-3 py-3 text-right">{fmt.format(r.views)}</td>
                <td className="tabular px-3 py-3 text-right">{fmt.format(r.favorites)}</td>
                <td className="tabular px-3 py-3 text-right">{fmt.format(r.whatsapp)}</td>
                <td className="tabular px-3 py-3 text-right">{r.appointments}</td>
                <td className="px-4 py-3 text-xs">
                  {r.hasDocs ? <span className="font-semibold text-success">Tamam</span> : <span className="text-fg-muted">Eksik rapor</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
