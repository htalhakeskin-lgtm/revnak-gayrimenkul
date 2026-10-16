import { Building2, Home, Video } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { AppointmentPageForm } from "@/components/forms/appointment-page-form";
import { PageHero } from "@/components/ui/page-hero";
import { getAgents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Randevu al",
  description: "Yerinde gösterim, ofiste görüşme veya görüntülü görüşme için danışmanlarımızdan online randevu alın.",
  alternates: { canonical: "/randevu" },
};

export default async function AppointmentPage() {
  const agents = (await getAgents()).map((a) => ({ slug: a.slug, name: a.name, title: a.title }));
  return (
    <>
      <PageHero
        eyebrow="Online randevu"
        title="Size uygun saati seçin"
        description="Danışmanlarımızın müsait saatleri anlık listelenir. Onay ve takvim dosyası anında hazır."
        crumbs={[{ name: "Randevu", path: "/randevu" }]}
      />
      <section className="tone-light py-16 md:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <aside className="order-2 space-y-6 lg:order-1 lg:col-span-4">
            {[
              { Icon: Home, title: "Yerinde gösterim", text: "İlan sayfasından alınır; danışmanımız sizi mülkte karşılar." },
              { Icon: Building2, title: "Ofiste görüşme", text: "İhtiyaçlarınızı konuşur, portföyü birlikte inceleriz." },
              { Icon: Video, title: "Görüntülü görüşme", text: "Şehir veya ülke dışındaysanız canlı video ile gösterim." },
            ].map(({ Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-fg-muted">{text}</p>
                </div>
              </div>
            ))}
            <p className="rounded-[14px] bg-fg/5 p-4 text-sm leading-relaxed text-fg-muted">
              Randevunuzu iptal etmek veya ertelemek isterseniz onay mesajındaki bağlantıyı kullanabilirsiniz (gerçek sürümde).
            </p>
          </aside>
          <div className="order-1 rounded-[20px] border border-line bg-raised p-5 sm:p-6 md:p-10 lg:order-2 lg:col-span-8">
            <Suspense fallback={<AppointmentForm agents={agents} idPrefix="randevu" />}>
              <AppointmentPageForm agents={agents} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
