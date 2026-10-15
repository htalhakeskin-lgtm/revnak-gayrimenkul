"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { CrmContact, PipelineStage } from "@/data/panel";
import { cn } from "@/lib/utils";

const typeClass: Record<CrmContact["type"], string> = {
  Alıcı: "bg-accent/12 text-accent",
  Kiracı: "bg-ink/8 text-ink",
  "Mülk sahibi": "bg-success/12 text-success",
  Yatırımcı: "bg-gold/25 text-gold-ink",
};

/**
 * Satış hunisi (M10 Kanban). Demo: kartlar oklarla aşamalar arasında taşınır (yalnızca bu sayfada).
 * Gerçek sürümde sürükle-bırak + aktivite kaydı + görev hatırlatmaları.
 */
export function PipelineBoard({
  contacts,
  stages,
  agentNames,
}: {
  contacts: CrmContact[];
  stages: readonly PipelineStage[];
  agentNames: Record<string, string>;
}) {
  const [items, setItems] = useState(contacts);

  function move(id: string, dir: 1 | -1) {
    setItems((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const i = stages.indexOf(c.stage);
        const next = stages[Math.min(stages.length - 1, Math.max(0, i + dir))];
        return { ...c, stage: next, lastActivity: `Aşama değişti: ${next}`, daysAgo: 0 };
      }),
    );
  }

  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-4 lg:-mx-10 lg:px-10" data-lenis-prevent-horizontal>
      <div className="grid min-w-[1200px] grid-cols-6 gap-4">
        {stages.map((stage, si) => {
          const column = items.filter((c) => c.stage === stage);
          return (
            <section key={stage} aria-labelledby={`stage-${si}`} className="rounded-[20px] bg-sand/60 p-3">
              <h2 id={`stage-${si}`} className="flex items-center justify-between px-2 py-2 text-sm font-semibold">
                {stage}
                <span className="tabular rounded-full bg-raised px-2 text-xs text-fg-muted">{column.length}</span>
              </h2>
              <ul className="mt-2 space-y-3">
                {column.map((c) => (
                  <li key={c.id} className="rounded-[14px] border border-line bg-raised p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold">{c.name}</p>
                      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold", typeClass[c.type])}>{c.type}</span>
                    </div>
                    <p className="mt-1 text-sm text-fg-muted">{c.interest}</p>
                    <p className="mt-1 text-xs text-fg-muted">Bütçe: {c.budget}</p>
                    <p className="mt-3 border-t border-line pt-3 text-xs">{c.lastActivity}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-fg-muted">
                      <span>
                        {agentNames[c.agentSlug]?.split(" ")[0]} · {c.source} · {c.daysAgo === 0 ? "bugün" : `${c.daysAgo} gün önce`}
                      </span>
                      <span className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => move(c.id, -1)}
                          disabled={si === 0}
                          className="grid size-7 place-items-center rounded-full border border-line hover:border-accent disabled:opacity-30"
                          aria-label={`${c.name}: önceki aşamaya taşı`}
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(c.id, 1)}
                          disabled={si === stages.length - 1}
                          className="grid size-7 place-items-center rounded-full border border-line hover:border-accent disabled:opacity-30"
                          aria-label={`${c.name}: sonraki aşamaya taşı`}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
