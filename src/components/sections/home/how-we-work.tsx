"use client";

import { m, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/utils";

const journeys = {
  satici: {
    label: "Satıcılar için",
    steps: [
      {
        title: "Gerekçeli değerleme",
        text: "Bölgedeki benzer satışlar, yapının teknik durumu ve piyasa eğilimiyle fiyatınızı birlikte belirliyoruz.",
        image: "1613545325278-f24b0cae1224",
      },
      {
        title: "Hazırlık ve çekim",
        text: "Küçük dokunuşlar, profesyonel fotoğraf, video ve 360° tur. Tapu, iskân ve deprem dosyanız gösterimden önce hazır.",
        image: "1600585154084-4e5fe7c39198",
      },
      {
        title: "Hedefli pazarlama",
        text: "Sitemiz, portallar, Instagram ve bekleyen alıcı listemiz. Her ay görüntülenme ve gösterim raporu alırsınız.",
        image: "1613553507747-5f8d62ad5904",
      },
      {
        title: "Müzakere ve tapu",
        text: "Teklifleri yönetir, kredi ve ekspertiz sürecini koordine eder, tapu gününe kadar yanınızda oluruz.",
        image: "1600573472550-8090b5e0745e",
      },
    ],
  },
  alici: {
    label: "Alıcılar için",
    steps: [
      {
        title: "İhtiyacınızı dinliyoruz",
        text: "Bütçe, bölge, okul, ulaşım ve yaşam tarzınız. Kriterlerinizi kayıtlı aramaya dönüştürüyoruz.",
        image: "1600210492486-724fe5c67fb0",
      },
      {
        title: "Önceden elenmiş portföy",
        text: "Belgeleri eksik veya riskli ilanları size göstermeden eliyoruz; zamanınızı yalnızca doğru evlere ayırıyorsunuz.",
        image: "1600607688969-a5bfcd646154",
      },
      {
        title: "Gösterim ve karşılaştırma",
        text: "Yerinde ya da görüntülü gösterim. Seçtiğiniz evleri metrekare fiyatı ve masraflarıyla yan yana koyuyoruz.",
        image: "1617806118233-18e1de247200",
      },
      {
        title: "Güvenli kapanış",
        text: "Teklif, kredi ön onayı, ekspertiz ve tapu randevusu. Anahtar teslimine kadar süreci biz takip ediyoruz.",
        image: "1599809275671-b5942cabc7a2",
      },
    ],
  },
} as const;

type JourneyKey = keyof typeof journeys;

/**
 * Sahne 5 — Nasıl çalışıyoruz (Bölüm 4.5 · PinnedStory).
 * Masaüstü: kaydırırken sabitlenen sahne (CSS sticky + Motion useScroll, K14).
 * Mobil: sade dikey liste (kural 4).
 */
export function HowWeWork() {
  const [journey, setJourney] = useState<JourneyKey>("satici");
  const steps = journeys[journey].steps;

  const toggle = (
    <div role="tablist" aria-label="Süreç" className="inline-flex rounded-full border border-night-line p-1">
      {(Object.keys(journeys) as JourneyKey[]).map((key) => (
        <button
          key={key}
          role="tab"
          type="button"
          aria-selected={journey === key}
          onClick={() => setJourney(key)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
            journey === key ? "bg-gold text-night" : "text-muted hover:text-ivory",
          )}
        >
          {journeys[key].label}
        </button>
      ))}
    </div>
  );

  return (
    <section className="tone-dark grain" aria-labelledby="how-title">
      <div className="container-site pt-24 md:pt-32">
        <p className="eyebrow mb-4">Nasıl çalışıyoruz</p>
        <h2 id="how-title" className="max-w-2xl text-h2">
          Dört adımda, sürprizsiz bir süreç
        </h2>
        <div className="mt-8">{toggle}</div>
      </div>

      {/* Mobil */}
      <ol className="container-site mt-12 space-y-10 pb-24 md:hidden">
        {steps.map((step, i) => (
          <li key={step.title}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-image)]">
              <Photo src={step.image} alt="" fill sizes="92vw" className="object-cover" />
            </div>
            <p className="mt-5 font-serif text-4xl text-gold">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 text-h3">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
          </li>
        ))}
      </ol>

      {/* Masaüstü */}
      <PinnedSteps key={journey} steps={steps} />
    </section>
  );
}

function PinnedSteps({ steps }: { steps: readonly { title: string; text: string; image: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length))));
  });

  return (
    <div ref={ref} className="relative hidden md:block" style={{ height: `${steps.length * 85}vh` }}>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="container-site grid grid-cols-12 items-center gap-10">
          <ol className="relative col-span-5 space-y-2">
            <div aria-hidden className="absolute top-2 bottom-2 left-0 w-px bg-night-line">
              <m.div className="h-full w-full origin-top bg-gold" style={{ scaleY: scrollYProgress }} />
            </div>
            {steps.map((step, i) => (
              <li
                key={step.title}
                aria-current={active === i ? "step" : undefined}
                className={cn(
                  "pl-8 transition-opacity duration-500",
                  active === i ? "opacity-100" : "opacity-35",
                )}
              >
                <div className="flex items-baseline gap-4 py-4">
                  <span className="tabular font-serif text-xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-h3">{step.title}</h3>
                    <m.p
                      className="mt-2 max-w-md leading-relaxed text-muted"
                      initial={false}
                      animate={{ opacity: active === i ? 1 : 0.6 }}
                    >
                      {step.text}
                    </m.p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="relative col-span-7 aspect-[5/4] overflow-hidden rounded-[var(--radius-image)] bg-night-raised">
            {steps.map((step, i) => (
              <m.div
                key={step.image}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.06 }}
                transition={{ duration: 0.9 }}
              >
                <Photo src={step.image} alt="" fill sizes="58vw" className="object-cover" />
              </m.div>
            ))}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/50 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
