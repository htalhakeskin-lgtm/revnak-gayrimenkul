import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { faqs } from "@/data/content";
import type { Faq } from "@/data/types";
import { faqSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sıkça sorulan sorular",
  description: "Alıcılar, satıcılar ve kiracılar için randevu, hizmet bedeli, belgeler ve süreçle ilgili sorular.",
  alternates: { canonical: "/sss" },
};

const groups: Faq["group"][] = ["Alıcılar", "Satıcılar", "Kiracılar", "Genel"];

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <PageHero
        eyebrow="SSS"
        title="Sıkça sorulan sorular"
        description="Aradığınız cevabı bulamazsanız danışmanlarımız bir mesaj uzağınızda."
        crumbs={[{ name: "SSS", path: "/sss" }]}
      />
      <section className="tone-light py-20 md:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <nav aria-label="Soru grupları" className="lg:col-span-3">
            <ul className="space-y-2 lg:sticky lg:top-28">
              {groups.map((g) => (
                <li key={g}>
                  <a href={`#${g}`} className="text-lg text-fg-muted hover:text-accent">
                    {g}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-16 lg:col-span-9">
            {groups.map((group) => (
              <section key={group} id={group} aria-labelledby={`${group}-title`}>
                <h2 id={`${group}-title`} className="text-h3">
                  {group}
                </h2>
                <div className="mt-6 divide-y divide-line border-y border-line">
                  {faqs
                    .filter((f) => f.group === group)
                    .map((f) => (
                      <details key={f.q} className="group py-2">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                          {f.q}
                          <Plus size={20} className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45" aria-hidden />
                        </summary>
                        <p className="max-w-3xl pb-5 leading-relaxed text-fg-muted">{f.a}</p>
                      </details>
                    ))}
                </div>
              </section>
            ))}
            <div className="rounded-[20px] bg-ink p-8 text-ivory md:p-10">
              <h2 className="text-h3">Sorunuz burada yok mu?</h2>
              <p className="mt-2 text-ivory/75">Bize yazın, aynı gün içinde dönüş yapalım.</p>
              <ButtonLink href="/iletisim" className="mt-6">
                İletişime geç
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
