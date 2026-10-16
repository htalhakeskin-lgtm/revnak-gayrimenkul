import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Inbox, type RealLeadRow, type SampleLeadRow } from "@/components/panel/inbox";
import { formatDate, formatNumber } from "@/lib/format";
import { getAgents, getListingByNo, getPanelData, getRecentLeadsList } from "@/lib/data";

export const metadata: Metadata = { title: "Gelen talepler" };

const kindLabels = {
  iletisim: "İletişim formu",
  "ilan-bilgi": "İlan bilgi talebi",
  portfoy: "Portföy başvurusu",
  degerleme: "Değerleme talebi",
} as const;

const relativeDay = new Intl.RelativeTimeFormat("tr-TR", { numeric: "auto" });

function whenLabel(createdAt: Date) {
  const days = Math.round((Date.now() - createdAt.getTime()) / 86_400_000);
  if (days === 0) {
    const hours = Math.round((Date.now() - createdAt.getTime()) / 3_600_000);
    if (hours < 1) return "Az önce";
    return relativeDay.format(-hours, "hour");
  }
  return `${relativeDay.format(-days, "day")} · ${formatDate(createdAt.toISOString().slice(0, 10))}`;
}

export default function LeadsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">M09 · Talepler</p>
        <h1 className="mt-2 text-h2">Gelen talepler</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          Sitedeki her form gönderimi veritabanına kaydedilir ve burada listelenir; randevular takvimde görünür.
          Danışmana otomatik bildirim (e-posta/SMS) henüz eklenmedi.
        </p>
      </div>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-[20px] bg-sand/60" aria-hidden />}>
        <TalepContent />
      </Suspense>
    </div>
  );
}

async function TalepContent() {
  await connection(); // whenLabel() Date.now() kullanır (Cache Components)
  const [panel, agents, recentLeads] = await Promise.all([getPanelData(), getAgents(), getRecentLeadsList(100)]);
  const agentName = (slug: string) => agents.find((a) => a.slug === slug)?.name ?? slug;

  const real: RealLeadRow[] = await Promise.all(
    recentLeads.map(async (l) => {
      const listing = l.listingNo ? await getListingByNo(l.listingNo) : undefined;
      const detailParts: string[] = [];
      if (listing) detailParts.push(`${listing.no} · ${listing.title}`);
      else if (l.listingNo) detailParts.push(l.listingNo);
      if (l.region) detailParts.push(l.region);
      if (l.propertyType) detailParts.push(l.propertyType);
      if (l.m2) detailParts.push(`${formatNumber(l.m2)} m²`);
      if (l.rooms) detailParts.push(l.rooms);
      return {
        id: l.id,
        ref: l.ref,
        name: l.name,
        phone: l.phone,
        email: l.email,
        kindLabel: kindLabels[l.kind as keyof typeof kindLabels] ?? l.kind,
        detail: detailParts.join(" · "),
        message: l.message,
        when: whenLabel(l.createdAt),
      };
    }),
  );

  const sample: SampleLeadRow[] = [...panel.contacts]
    .sort((a, b) => a.daysAgo - b.daysAgo)
    .map((c) => ({
      id: c.id,
      name: c.name,
      source: c.source,
      interest: c.interest,
      agent: agentName(c.agentSlug),
      when: c.daysAgo === 0 ? "Bugün" : `${c.daysAgo} gün önce`,
      stage: c.stage,
    }));

  return <Inbox real={real} sample={sample} />;
}
