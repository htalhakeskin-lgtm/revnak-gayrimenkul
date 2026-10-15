import { Quote, Star } from "lucide-react";
import { Marquee } from "@/components/motion/marquee";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Testimonial } from "@/data/types";

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 text-gold" aria-label={`5 üzerinden ${rating} yıldız`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} className={i < rating ? "fill-current" : "opacity-30"} aria-hidden />
      ))}
    </span>
  );
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-raised p-7">
      <div className="flex items-center justify-between">
        <Stars rating={t.rating} />
        <span className="text-[0.6875rem] font-semibold tracking-[0.14em] text-fg-muted uppercase">{t.source}</span>
      </div>
      <Quote size={28} className="mt-6 text-accent" aria-hidden />
      <blockquote className="mt-3 flex-1 leading-relaxed text-fg">{t.text}</blockquote>
      <figcaption className="mt-6 border-t border-line pt-5">
        <p className="font-semibold text-fg">{t.name}</p>
        <p className="text-sm text-fg-muted">{t.role}</p>
      </figcaption>
    </figure>
  );
}

/** Sahne 9 — Müşteri yorumları: yumuşak kayan kartlar */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const half = Math.ceil(items.length / 2);
  return (
    <section className="tone-light py-24 md:py-32" aria-labelledby="reviews-title">
      <div className="container-site">
        <SectionHeading
          eyebrow="Müşteri yorumları"
          title={<span id="reviews-title">Bize güvenenler anlatıyor</span>}
          description="Google yorumları, video referanslar ve müşteri formlarından seçtiklerimiz. (Demo: kişiler kurgusaldır.)"
        />
      </div>
      <div className="mt-14 space-y-6">
        <Marquee duration={70}>
          {items.slice(0, half).map((t) => (
            <div key={t.name} className="mr-6 w-[22rem] shrink-0 md:w-[26rem]">
              <TestimonialCard t={t} />
            </div>
          ))}
        </Marquee>
        <Marquee duration={80} className="[&_.animate-marquee]:[animation-direction:reverse]">
          {items.slice(half).map((t) => (
            <div key={t.name} className="mr-6 w-[22rem] shrink-0 md:w-[26rem]">
              <TestimonialCard t={t} />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
