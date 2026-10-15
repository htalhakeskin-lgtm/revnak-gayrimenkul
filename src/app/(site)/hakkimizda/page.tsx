import { ArrowRight, Eye, FileCheck2, HeartHandshake, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { Counter } from "@/components/motion/counter";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { Photo } from "@/components/ui/photo";
import { companyStats } from "@/data/content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "2009'dan bu yana İstanbul ve Bodrum'da şeffaf, belgeye dayalı gayrimenkul danışmanlığı.",
  alternates: { canonical: "/hakkimizda" },
};

const values = [
  {
    icon: FileCheck2,
    title: "Önce dosya",
    text: "Tapu, iskân, aidat ve deprem bilgisi gösterimden önce hazır. Belgesi eksik ilanı yayına almayız.",
  },
  {
    icon: Eye,
    title: "Şeffaf raporlama",
    text: "Mülk sahiplerine her ay ilanın kaç kez görüntülendiğini, kaç gösterim yapıldığını ve gelen yorumları raporlarız.",
  },
  {
    icon: ShieldCheck,
    title: "Mahremiyet",
    text: "Açık adres yalnızca randevu onayıyla paylaşılır; satış fiyatları sahibinin izni olmadan yayımlanmaz.",
  },
  {
    icon: HeartHandshake,
    title: "Uzun ilişki",
    text: "Müşterilerimizin çoğu bize tavsiyeyle geliyor. Satıştan sonra da kiralama ve yönetimde yanlarındayız.",
  },
];

const milestones = [
  { year: "2009", text: "Bebek'te tek odalı bir ofiste, iki danışmanla kuruluş." },
  { year: "2014", text: "Anadolu yakası ekibi: Kadıköy ve Kandilli portföyü." },
  { year: "2019", text: "Her ilana deprem ve bina bilgi kartı standardı." },
  { year: "2022", text: "Bodrum ofisi ve yazlık kiralama yönetimi." },
  { year: "2026", text: "Yeni dijital platform: online randevu ve şeffaf raporlama." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        size="lg"
        image="1600585154340-be6161a56a0c"
        eyebrow="Hakkımızda"
        title={"Gayrimenkulde\nsessiz güven."}
        description="Az ama doğru ilan, eksiksiz dosya ve ulaşılabilir danışman. 2009'dan beri aynı ilkeyle çalışıyoruz."
        crumbs={[{ name: "Hakkımızda", path: "/hakkimizda" }]}
      />

      <section className="tone-dark py-24 md:py-32">
        <div className="container-site grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow mb-4">Hikâyemiz</p>
            <h2 className="text-h2">Bir evi satmak, bir hayatı taşımaktır.</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted">
              <p>
                Revnak, eski Türkçede “parıltı, ışıltı” demek: her evin en iyi hâlini görünür kılmak. Firma, Boğaz hattında aile evlerini satan iki danışmanın, “müşteriye soru sordurmadan cevabı
                hazırlamak” fikriyle kuruldu. Bugün altı kişilik ekibimizle İstanbul’un seçkin semtlerinde ve Bodrum
                yarımadasında hizmet veriyoruz.
              </p>
              <p>
                Portföyümüzü bilerek sınırlı tutuyoruz: Her ilanı yerinde görüyor, belgelerini topluyor, fotoğraflarını
                profesyonelce çektiriyoruz. Böylece alıcılar zamanlarını doğru evlere, satıcılar ise doğru alıcılara
                ayırıyor.
              </p>
            </div>
          </Reveal>
          <ImageReveal className="aspect-[4/5] rounded-[var(--radius-image)] lg:aspect-[5/6]">
            <Photo src="1613545325278-f24b0cae1224" alt="Aydınlık, şömineli bir salon" fill sizes="(min-width: 1024px) 50vw, 92vw" className="object-cover" />
          </ImageReveal>
        </div>
      </section>

      <section className="tone-dark border-y border-night-line" aria-label="Rakamlarla Revnak">
        <div className="container-site grid grid-cols-2 lg:grid-cols-4">
          {companyStats.map((s) => (
            <div key={s.label} className="border-night-line py-12 text-center odd:border-r lg:border-r lg:last:border-r-0">
              <Counter value={s.value} suffix={s.suffix} className="tabular block font-serif text-5xl" />
              <span className="mt-3 block text-xs font-semibold tracking-[0.16em] text-muted uppercase">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="tone-light py-24 md:py-32" aria-labelledby="values-title">
        <div className="container-site">
          <p className="eyebrow mb-4">İlkelerimiz</p>
          <h2 id="values-title" className="max-w-2xl text-h2">
            Dört ilke, her işlemde aynı
          </h2>
          <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }) => (
              <RevealItem key={title} className="h-full">
                <div className="h-full rounded-[20px] border border-line bg-raised p-7">
                  <Icon className="text-accent" aria-hidden />
                  <h3 className="mt-6 font-serif text-2xl">{title}</h3>
                  <p className="mt-3 leading-relaxed text-fg-muted">{text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="tone-light border-t border-line py-24" aria-labelledby="timeline-title">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-4">Yolculuk</p>
            <h2 id="timeline-title" className="text-h2">
              17 yılın kısa özeti
            </h2>
          </div>
          <ol className="relative border-l border-line lg:col-span-8">
            {milestones.map((m) => (
              <li key={m.year} className="relative pb-10 pl-10 last:pb-0">
                <span aria-hidden className="absolute top-2 -left-[5px] size-[9px] rounded-full bg-accent" />
                <p className="tabular font-serif text-3xl text-accent">{m.year}</p>
                <p className="mt-2 max-w-lg text-lg leading-relaxed">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="tone-dark py-24">
        <div className="container-site flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-h2">Ofisimize bekleriz.</h2>
            <p className="mt-3 text-muted">
              {siteConfig.contact.addressLine}, {siteConfig.contact.district} / {siteConfig.contact.city} · Yetki belgesi no:{" "}
              {siteConfig.licenseNo} (örnek)
            </p>
          </div>
          <ButtonLink href="/iletisim" size="lg">
            İletişim <ArrowRight size={18} />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
