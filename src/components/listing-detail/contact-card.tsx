"use client";

import { CalendarDays, MessageSquareText, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useContactAction, type ContactAction } from "@/components/contact/contact-actions";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { LeadForm } from "@/components/forms/lead-form";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Photo } from "@/components/ui/photo";

type AgentInfo = { slug: string; name: string; title: string; photo: string; phoneDisplay: string; whatsappE164: string };
type ListingInfo = { slug: string; no: string; title: string; agentSlug: string; locationLabel: string; priceLabel: string };

/**
 * İlan iletişim kartı (M05, M06, M09): danışmanın WhatsApp'ına ilan no'lu hazır mesaj,
 * telefon, randevu ve bilgi talebi. Mobilde alt çubuk olarak da görünür.
 */
export function ListingContact({
  agent,
  listing,
  whatsappMessage,
  closed,
}: {
  agent: AgentInfo;
  listing: ListingInfo;
  whatsappMessage: string;
  closed: boolean;
}) {
  const open = useContactAction();
  const [dialog, setDialog] = useState<"randevu" | "bilgi" | null>(null);

  const whatsapp: ContactAction = {
    channel: "whatsapp",
    target: agent.whatsappE164,
    display: agent.phoneDisplay,
    name: agent.name,
    message: whatsappMessage,
    listingNo: listing.no,
    agentSlug: agent.slug,
  };
  const phone: ContactAction = {
    channel: "telefon",
    target: agent.whatsappE164,
    display: agent.phoneDisplay,
    name: agent.name,
    listingNo: listing.no,
    agentSlug: agent.slug,
  };

  return (
    <>
      <div className="rounded-[20px] border border-line bg-raised p-6">
        <div className="flex items-center gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-night-raised">
            <Photo src={agent.photo} alt={agent.name} fill sizes="64px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase">İlan danışmanı</p>
            <Link href={`/danisman/${agent.slug}`} className="block truncate font-serif text-xl text-fg hover:text-accent">
              {agent.name}
            </Link>
            <p className="truncate text-sm text-fg-muted">{agent.title}</p>
          </div>
        </div>

        {closed ? (
          <p className="mt-6 rounded-[14px] bg-fg/5 p-4 text-sm leading-relaxed text-fg-muted">
            Bu ilan sonuçlandı. Benzer bir ev arıyorsanız danışmanımız size yeni seçenekler sunabilir.
          </p>
        ) : null}

        <div className="mt-6 grid gap-3">
          <Button size="lg" onClick={() => open(whatsapp)} className="bg-[#25d366] text-white hover:bg-[#1fb658]">
            <WhatsAppIcon size={20} /> WhatsApp ile yaz
          </Button>
          {!closed ? (
            <Button size="lg" variant="dark" onClick={() => setDialog("randevu")}>
              <CalendarDays size={18} /> Gösterim randevusu al
            </Button>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => open(phone)}>
              <Phone size={16} /> Ara
            </Button>
            <Button variant="outline" onClick={() => setDialog("bilgi")}>
              <MessageSquareText size={16} /> Bilgi iste
            </Button>
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-fg-muted">İlan no: {listing.no}</p>
      </div>

      {/* Mobil alt çubuk: genel aksiyon çubuğunun üstüne gelir */}
      <div className="fixed inset-x-0 bottom-0 z-[45] border-t border-white/10 bg-night/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-ivory backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="tabular truncate font-semibold">{listing.priceLabel}</p>
            <p className="truncate text-xs text-muted">{listing.no} · {agent.name}</p>
          </div>
          <button
            type="button"
            onClick={() => open(whatsapp)}
            className="grid size-12 place-items-center rounded-full bg-[#25d366] text-white"
            aria-label="WhatsApp ile yaz"
          >
            <WhatsAppIcon size={22} />
          </button>
          {!closed ? (
            <button
              type="button"
              onClick={() => setDialog("randevu")}
              className="h-12 rounded-full bg-gold px-5 text-sm font-semibold text-night"
            >
              Randevu
            </button>
          ) : null}
        </div>
      </div>

      <Dialog
        open={dialog === "randevu"}
        onClose={() => setDialog(null)}
        title="Gösterim randevusu"
        description={`${listing.no} · ${listing.title}`}
        size="lg"
      >
        <AppointmentForm
          agents={[{ slug: agent.slug, name: agent.name, title: agent.title }]}
          listing={listing}
          idPrefix="listing-appt"
        />
      </Dialog>
      <Dialog open={dialog === "bilgi"} onClose={() => setDialog(null)} title="İlan hakkında bilgi" description={`${listing.no} · ${listing.title}`}>
        <LeadForm
          kind="ilan-bilgi"
          listingNo={listing.no}
          idPrefix="listing-lead"
          defaultMessage={`${listing.no} numaralı ilan hakkında bilgi almak istiyorum.`}
          submitLabel="Bilgi iste"
        />
      </Dialog>
    </>
  );
}
