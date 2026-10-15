import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactButton } from "@/components/contact/contact-actions";
import { ContactFormWithTopic } from "@/components/forms/contact-form-with-topic";
import { LeadForm } from "@/components/forms/lead-form";
import { MiniMap } from "@/components/map/mini-map";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { PageHero } from "@/components/ui/page-hero";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Bebek ofisimiz, telefon, WhatsApp ve iletişim formu.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  const { contact } = siteConfig;
  const cardClass =
    "flex w-full items-start gap-4 rounded-[20px] border border-line bg-raised p-6 text-left transition-colors hover:border-accent";

  return (
    <>
      <PageHero
        eyebrow="İletişim"
        title="Konuşalım"
        description="Formu doldurun, WhatsApp'tan yazın ya da ofisimize uğrayın. Mesai saatlerinde aynı gün dönüş yapıyoruz."
        crumbs={[{ name: "İletişim", path: "/iletisim" }]}
      />
      <section className="tone-light py-20 md:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <ContactButton
              action={{ channel: "telefon", target: contact.phoneE164, display: contact.phoneDisplay }}
              className={cardClass}
            >
              <Phone className="mt-1 text-accent" aria-hidden />
              <span>
                <span className="block text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase">Telefon</span>
                <span className="mt-1 block text-lg font-semibold">{contact.phoneDisplay}</span>
              </span>
            </ContactButton>
            <ContactButton
              action={{
                channel: "whatsapp",
                target: contact.whatsappE164,
                display: "Ofis WhatsApp hattı",
                message: "Merhaba, web sitenizden ulaşıyorum.",
              }}
              className={cardClass}
            >
              <WhatsAppIcon className="mt-1 text-accent" />
              <span>
                <span className="block text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase">WhatsApp</span>
                <span className="mt-1 block text-lg font-semibold">Hemen yazın</span>
              </span>
            </ContactButton>
            <ContactButton
              action={{ channel: "eposta", target: contact.email, display: contact.email }}
              className={cardClass}
            >
              <Mail className="mt-1 text-accent" aria-hidden />
              <span>
                <span className="block text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase">E-posta</span>
                <span className="mt-1 block text-lg font-semibold">{contact.email}</span>
              </span>
            </ContactButton>
            <div className={cardClass}>
              <MapPin className="mt-1 text-accent" aria-hidden />
              <span>
                <span className="block text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase">Ofis</span>
                <span className="mt-1 block text-lg font-semibold">
                  {contact.addressLine}, {contact.district} / {contact.city}
                </span>
              </span>
            </div>
            <div className={cardClass}>
              <Clock className="mt-1 text-accent" aria-hidden />
              <ul className="w-full space-y-1">
                <li className="text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase">Çalışma saatleri</li>
                {siteConfig.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4">
                    <span>{h.days}</span>
                    <span className="tabular font-semibold">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-72 overflow-hidden rounded-[20px] border border-line">
              <MiniMap lat={contact.lat} lng={contact.lng} approximate={false} label="Ofisimiz" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-[20px] border border-line bg-raised p-6 md:p-10">
              <h2 className="text-h3">Bize yazın</h2>
              <p className="mt-2 mb-8 text-fg-muted">Talebiniz ilgili bölgenin danışmanına anında iletilir.</p>
              <Suspense fallback={<LeadForm kind="iletisim" idPrefix="contact" />}>
                <ContactFormWithTopic />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
