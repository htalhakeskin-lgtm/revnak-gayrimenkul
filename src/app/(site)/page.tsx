import { ArrowRight } from "lucide-react";
import { AgentCard } from "@/components/agents/agent-card";
import { PostCard } from "@/components/blog/post-card";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CompanyStats } from "@/components/sections/home/stats";
import { FeaturedListings } from "@/components/sections/home/featured";
import { Hero } from "@/components/sections/home/hero";
import { HowWeWork } from "@/components/sections/home/how-we-work";
import { InstagramStrip } from "@/components/sections/home/instagram-strip";
import { RecentlySold } from "@/components/sections/home/recently-sold";
import { RegionsMosaic } from "@/components/sections/home/regions-mosaic";
import { Testimonials } from "@/components/sections/home/testimonials";
import { ValuationCta } from "@/components/sections/home/valuation-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { instagramPosts, testimonials } from "@/data/content";
import { getAgents, getPosts } from "@/lib/data";
import { organizationSchema } from "@/lib/seo";

/** Ana sayfa — 12 sahne (Bölüm 6). Sahne 12 (footer) site yerleşiminden gelir. */
export default async function HomePage() {
  const [agents, posts] = await Promise.all([getAgents(), getPosts()]);

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <Hero />
      <FeaturedListings />
      <CompanyStats />
      <RegionsMosaic />
      <HowWeWork />
      <RecentlySold />
      <ValuationCta />
      <InstagramStrip posts={instagramPosts} />
      <Testimonials items={testimonials} />

      {/* Sahne 10 — Ekibimiz */}
      <section className="tone-light py-24 md:py-32" aria-labelledby="team-title">
        <div className="container-site">
          <SectionHeading
            eyebrow="Ekibimiz"
            title={<span id="team-title">Her bölgenin kendi uzmanı</span>}
            description="Danışmanlarımız çalıştıkları semtlerde yaşıyor; sokakları, binaları ve komşuları tanıyor."
            action={
              <ButtonLink href="/ekibimiz" variant="outline">
                Tüm ekip <ArrowRight size={16} />
              </ButtonLink>
            }
          />
          <RevealGroup className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {agents.slice(0, 4).map((agent) => (
              <RevealItem key={agent.slug}>
                <AgentCard agent={agent} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Sahne 11 — Blog'dan */}
      <section className="tone-light border-t border-line py-24 md:py-32" aria-labelledby="blog-title">
        <div className="container-site">
          <SectionHeading
            eyebrow="Blog"
            title={<span id="blog-title">Rehberler ve piyasa notları</span>}
            action={
              <ButtonLink href="/blog" variant="outline">
                Tüm yazılar <ArrowRight size={16} />
              </ButtonLink>
            }
          />
          <RevealGroup className="mt-14 grid gap-10 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <RevealItem key={post.slug}>
                <PostCard post={post} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
