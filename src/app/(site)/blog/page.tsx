import type { Metadata } from "next";
import { PostCard } from "@/components/blog/post-card";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/ui/page-hero";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Alıcı ve satıcı rehberleri, mevzuat notları ve yatırım analizleri.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Rehberler ve piyasa notları"
        description="Ev alırken, satarken ve yatırım yaparken bilmeniz gerekenleri sade bir dille anlatıyoruz."
        crumbs={[{ name: "Blog", path: "/blog" }]}
      >
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Kategoriler">
          {categories.map((c) => (
            <li key={c} className="rounded-full border border-night-line px-4 py-1.5 text-sm text-ivory/80">
              {c}
            </li>
          ))}
        </ul>
      </PageHero>
      <section className="tone-light py-20 md:py-28">
        <div className="container-site">
          {featured ? (
            <div className="grid gap-10 border-b border-line pb-16 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <PostCard post={featured} large />
              </div>
            </div>
          ) : null}
          <RevealGroup className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
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
