import { Award, Languages, MapPin, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ContactButton } from "@/components/contact/contact-actions";
import { ListingCard } from "@/components/listings/listing-card";
import { SoldCard } from "@/components/listings/sold-card";
import { TestimonialCard } from "@/components/sections/home/testimonials";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { ButtonLink, buttonClasses } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/page-hero";
import { Photo } from "@/components/ui/photo";
import { testimonials } from "@/data/content";
import { getAgent, getAgentListings, getAgents, getRegions } from "@/lib/data";

export async function generateStaticParams() {
  return (await getAgents()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/danisman/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const agent = await getAgent(slug);
  if (!agent) return { title: "Danışman bulunamadı" };
  return {
    title: `${agent.name} · ${agent.title}`,
    description: agent.bio,
    alternates: { canonical: `/danisman/${agent.slug}` },
  };
}

export default function AgentPage(props: PageProps<"/danisman/[slug]">) {
  return (
    <Suspense fallback={<div className="tone-dark min-h-[80vh]" />}>
      <AgentDetail params={props.params} />
    </Suspense>
  );
}

async function AgentDetail({ params }: { params: PageProps<"/danisman/[slug]">["params"] }) {
  const { slug } = await params;
  const agent = await getAgent(slug);
  if (!agent) notFound();
  const [{ active, closed }, regions] = await Promise.all([getAgentListings(slug), getRegions()]);
  const regionNames = agent.regions.map((r) => regions.find((x) => x.slug === r)?.name ?? r);
  const reviews = testimonials.filter((t) => t.agentSlug === slug);

  return (
    <>
      <section className="tone-dark grain pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="container-site">
          <Breadcrumbs
            items={[
              { name: "Ekibimiz", path: "/ekibimiz" },
              { name: agent.name, path: `/danisman/${agent.slug}` },
            ]}
            className="mb-10"
          />
          <div className="grid gap-12 md:grid-cols-12 md:items-end">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-image)] bg-night-raised md:col-span-5 lg:col-span-4">
              <Photo src={agent.photo} alt={agent.name} fill preload fade={false} sizes="(min-width: 768px) 35vw, 92vw" className="object-cover" />
            </div>
            <div className="md:col-span-7 lg:col-span-8">
              <p className="eyebrow">{agent.title}</p>
              <h1 className="mt-4 text-display">{agent.name}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/80">{agent.bio}</p>
              <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-6 border-y border-night-line py-6">
                <div>
                  <dt className="text-xs text-muted">Deneyim</dt>
                  <dd className="font-serif text-3xl">{agent.yearsExperience} yıl</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Sonuçlanan işlem</dt>
                  <dd className="font-serif text-3xl">{agent.soldCount}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Puan</dt>
                  <dd className="flex items-center gap-2 font-serif text-3xl">
                    {agent.rating.toFixed(1).replace(".", ",")} <Star size={20} className="fill-gold text-gold" />
                  </dd>
                </div>
              </dl>
              <ul className="mt-6 space-y-2 text-sm text-ivory/80">
                <li className="flex items-center gap-2">
                  <MapPin size={16} className="text-gold" /> {regionNames.join(", ")}
                </li>
                <li className="flex items-center gap-2">
                  <Languages size={16} className="text-gold" /> {agent.languages.join(", ")}
                </li>
                <li className="flex items-center gap-2">
                  <Award size={16} className="text-gold" /> Taşınmaz ticareti mesleki yeterlilik belgeli (örnek)
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <ContactButton
                  action={{
                    channel: "whatsapp",
                    target: agent.whatsappE164,
                    display: agent.phoneDisplay,
                    name: agent.name,
                    agentSlug: agent.slug,
                    message: `Merhaba, web sitenizden ulaşıyorum. ${agent.name} ile görüşmek istiyorum.`,
                  }}
                  className={buttonClasses({ size: "lg", className: "bg-[#25d366] text-white hover:bg-[#1fb658]" })}
                >
                  <WhatsAppIcon size={20} /> WhatsApp
                </ContactButton>
                <ButtonLink href={`/randevu?danisman=${agent.slug}`} size="lg" variant="ivory">
                  Randevu al
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tone-light py-20" aria-labelledby="agent-listings">
        <div className="container-site">
          <h2 id="agent-listings" className="text-h2">
            Aktif ilanları <span className="text-fg-muted">({active.length})</span>
          </h2>
          {active.length ? (
            <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {active.map((l) => (
                <li key={l.id}>
                  <ListingCard listing={l} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-fg-muted">
              Şu an aktif ilanı yok. <Link href="/ilanlar" className="text-accent underline">Tüm ilanlar</Link>
            </p>
          )}
        </div>
      </section>

      {closed.length ? (
        <section className="tone-dark py-20" aria-labelledby="agent-closed">
          <div className="container-site">
            <h2 id="agent-closed" className="text-h2">
              Sonuçlandırdığı işlemler
            </h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {closed.map((l, i) => (
                <SoldCard key={l.id} listing={l} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {reviews.length ? (
        <section className="tone-light py-20" aria-labelledby="agent-reviews">
          <div className="container-site">
            <h2 id="agent-reviews" className="text-h2">
              Müşteri yorumları
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((t) => (
                <TestimonialCard key={t.name} t={t} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
