import type { Metadata } from "next";
import { AgentCard } from "@/components/agents/agent-card";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { getAgents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Ekibimiz",
  description: "Boğaz hattı, Anadolu yakası ve Bodrum'da uzmanlaşmış gayrimenkul danışmanlarımız.",
  alternates: { canonical: "/ekibimiz" },
};

export default async function TeamPage() {
  const agents = await getAgents();
  return (
    <>
      <PageHero
        eyebrow="Ekibimiz"
        title="Her bölgenin kendi uzmanı"
        description="Danışmanlarımız çalıştıkları semtleri, binaları ve piyasayı yakından tanıyor. Size en uygun danışmanla eşleşin."
        crumbs={[{ name: "Ekibimiz", path: "/ekibimiz" }]}
      />
      <section className="tone-light py-20 md:py-28">
        <div className="container-site">
          <RevealGroup className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <RevealItem key={agent.slug}>
                <AgentCard agent={agent} />
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="mt-24 rounded-[20px] bg-ink p-10 text-ivory md:p-14">
            <p className="eyebrow">Kariyer</p>
            <h2 className="mt-3 max-w-xl text-h2">Ekibimize katılmak ister misiniz?</h2>
            <p className="mt-4 max-w-xl text-ivory/75">
              Bölgesini tanıyan, şeffaflığı ilke edinen danışman adaylarıyla tanışmak isteriz.
            </p>
            <ButtonLink href="/iletisim?konu=kariyer" className="mt-8">
              Bize yazın
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
