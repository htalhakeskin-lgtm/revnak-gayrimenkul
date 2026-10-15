"use client";

import { useSearchParams } from "next/navigation";
import { AppointmentForm } from "./appointment-form";

type AgentOption = { slug: string; name: string; title: string };

/** /randevu?danisman=… ile danışman ön seçili gelir */
export function AppointmentPageForm({ agents }: { agents: AgentOption[] }) {
  const requested = useSearchParams().get("danisman") ?? undefined;
  const defaultAgentSlug = agents.some((a) => a.slug === requested) ? requested : undefined;
  return <AppointmentForm key={defaultAgentSlug ?? "all"} agents={agents} defaultAgentSlug={defaultAgentSlug} idPrefix="randevu" />;
}
