import type { Metadata } from "next";
import { PipelineBoard } from "@/components/panel/pipeline-board";
import { getAgents, getPanelData } from "@/lib/data";

export const metadata: Metadata = { title: "CRM hunisi" };

export default async function CrmPage() {
  const [panel, agents] = await Promise.all([getPanelData(), getAgents()]);
  const agentNames = Object.fromEntries(agents.map((a) => [a.slug, a.name]));
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">M10 · CRM</p>
        <h1 className="mt-2 text-h2">Satış hunisi</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          Formlar, WhatsApp tıklamaları ve randevular kişi kartına otomatik düşer. Kartları oklarla aşamalar arasında taşıyabilirsiniz
          (demo, sayfa yenilenince sıfırlanır).
        </p>
      </div>
      <PipelineBoard contacts={panel.contacts} stages={panel.stages} agentNames={agentNames} />
    </div>
  );
}
