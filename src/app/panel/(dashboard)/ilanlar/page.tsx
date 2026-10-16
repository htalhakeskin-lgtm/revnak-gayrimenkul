import type { Metadata } from "next";
import { ListingsTable, type PanelListingRow } from "@/components/panel/listings-table";
import { agentOf, getAllListings } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { statusLabels, transactionLabels } from "@/lib/labels";
import { priceLabel } from "@/lib/listing-utils";

export const metadata: Metadata = { title: "İlanlar" };

export default async function PanelListingsPage() {
  const listings = await getAllListings();
  const rows: PanelListingRow[] = [...listings]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((l) => ({
      id: l.id,
      no: l.no,
      slug: l.slug,
      title: l.title,
      status: l.status,
      statusLabel: statusLabels[l.status],
      transaction: transactionLabels[l.transaction],
      agent: agentOf(l).name,
      price: priceLabel(l),
      views: l.stats.views,
      favorites: l.stats.favorites,
      whatsapp: l.stats.whatsapp,
      appointments: l.stats.appointments,
      publishedAt: formatDate(l.publishedAt),
      hasDocs: l.earthquake.reportAvailable,
    }));

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">M01 · İlan yönetimi</p>
        <h1 className="mt-2 text-h2">İlanlar</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          Durum akışı: Taslak → İncelemede → Yayında → Opsiyonlu → Satıldı/Kiralandı. Yayın kontrol listesi eksik ilanın yayına
          alınmasını engeller (gerçek sürüm).
        </p>
      </div>
      <ListingsTable rows={rows} />
    </div>
  );
}
