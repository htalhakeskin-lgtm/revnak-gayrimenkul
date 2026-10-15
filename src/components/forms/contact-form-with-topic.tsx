"use client";

import { useSearchParams } from "next/navigation";
import { LeadForm } from "./lead-form";

const topics: Record<string, string> = {
  talep: "Aradığım evi bulamadım. Kriterlerim: ",
  kariyer: "Ekibinize katılmak istiyorum. Kısaca kendimden bahsedeyim: ",
};

/** ?konu= parametresine göre mesajı önceden doldurur (ör. "Aradığımı bulamadım"). */
export function ContactFormWithTopic() {
  const topic = useSearchParams().get("konu") ?? "";
  return <LeadForm key={topic} kind="iletisim" idPrefix="contact" defaultMessage={topics[topic]} />;
}
