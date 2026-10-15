import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { Photo } from "@/components/ui/photo";
import { services } from "@/data/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hizmetler",
  description: "Satış, alım, kiralama, değerleme ve yatırım danışmanlığı.",
  alternates: { canonical: "/hizmetler" },
};

const images = [
  "1600596542815-ffad4c1539a9",
  "1600210492486-724fe5c67fb0",
  "1618221195710-dd6b41faaea6",
  "1600607688969-a5bfcd646154",
  "1486406146926-c627a92ad1ab",
];

const ctas: Record<string, { href: string; label: string }> = {
  satis: { href: "/portfoy-ver", label: "Portföyümü vermek istiyorum" },
  alim: { href: "/ilanlar", label: "İlanları incele" },
  kiralama: { href: "/ilanlar/kiralik", label: "Kiralık ilanlar" },
  degerleme: { href: "/evimi-degerle", label: "Değerleme iste" },
  yatirim: { href: "/hesaplayicilar", label: "Getiri hesapla" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Hizmetler"
        title="Alırken, satarken, kiralarken"
        description="Her işlemde aynı titizlik: belgeye dayalı süreç, şeffaf raporlama ve tek bir sorumlu danışman."
        crumbs={[{ name: "Hizmetler", path: "/hizmetler" }]}
      />
      <section className="tone-light py-20 md:py-28">
        <div className="container-site space-y-24 md:space-y-32">
          {services.map((service, i) => (
            <article key={service.slug} id={service.slug} className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
              <ImageReveal
                className={cn("aspect-[5/4] rounded-[var(--radius-image)]", i % 2 === 1 && "md:order-2")}
                direction={i % 2 === 1 ? "right" : "left"}
              >
                <Photo src={images[i % images.length]} alt="" fill sizes="(min-width: 768px) 45vw, 92vw" className="object-cover" />
              </ImageReveal>
              <Reveal>
                <p className="tabular font-serif text-2xl text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 text-h2">{service.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-fg-muted">{service.text}</p>
                <ul className="mt-6 space-y-3">
                  {service.points.map((p) => (
                    <li key={p} className="flex items-center gap-3">
                      <span className="grid size-6 place-items-center rounded-full bg-accent/15 text-accent">
                        <Check size={14} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <ButtonLink href={ctas[service.slug].href} variant="dark" className="mt-8">
                  {ctas[service.slug].label} <ArrowRight size={16} />
                </ButtonLink>
              </Reveal>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
