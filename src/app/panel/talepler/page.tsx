import type { Metadata } from "next";
import { Inbox } from "@/components/panel/inbox";
import { getAgents, getPanelData } from "@/lib/data";

export const metadata: Metadata = { title: "Gelen talepler" };

export default async function LeadsPage() {
  const [panel, agents] = await Promise.all([getPanelData(), getAgents()]);
  const agentName = (slug: string) => agents.find((a) => a.slug === slug)?.name ?? slug;
  const mock = [...panel.contacts]
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

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">M09 · Talepler</p>
        <h1 className="mt-2 text-h2">Gelen talepler</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          Her form, randevu ve iletişim tıklaması kişi kartına kaydedilir ve ilgili danışmana anında bildirilir (gerçek sürüm).
        </p>
      </div>
      <Inbox mock={mock} />
    </div>
  );
}
