import { ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PostCard } from "@/components/blog/post-card";
import { ListingCard } from "@/components/listings/listing-card";
import { ImageReveal } from "@/components/motion/image-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/page-hero";
import { Photo } from "@/components/ui/photo";
import type { PostBlock } from "@/data/types";
import { getAgent, getListing, getPost, getPosts, getRelatedPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { articleSchema } from "@/lib/seo";
import { slugify, unsplash } from "@/lib/utils";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return { title: "Yazı bulunamadı" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      images: [{ url: `${unsplash(post.cover)}?w=1200&h=630&fit=crop&q=75&auto=format`, width: 1200, height: 630 }],
    },
  };
}

export default function PostPage(props: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="tone-dark min-h-[80vh]" />}>
      <PostDetail params={props.params} />
    </Suspense>
  );
}

async function PostDetail({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const author = await getAgent(post.authorSlug);
  if (!author) notFound();
  const related = await getRelatedPosts(post, 3);
  const toc = post.blocks.filter((b): b is Extract<PostBlock, { type: "h2" }> => b.type === "h2");

  return (
    <article>
      <JsonLd data={articleSchema(post, author)} />
      <header className="tone-dark pt-36 pb-12 md:pt-44">
        <div className="container-site max-w-5xl">
          <Breadcrumbs
            items={[
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]}
            className="mb-8"
          />
          <p className="eyebrow">{post.category}</p>
          <h1 className="mt-4 text-h1">{post.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ivory/75">{post.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
            <Link href={`/danisman/${author.slug}`} className="flex items-center gap-3 text-ivory hover:text-gold">
              <span className="relative size-10 overflow-hidden rounded-full bg-night-raised">
                <Photo src={author.photo} alt="" fill sizes="40px" className="object-cover" />
              </span>
              {author.name}
            </Link>
            <span>{formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {post.readingMinutes} dk okuma
            </span>
          </div>
        </div>
        <div className="container-site mt-12 max-w-6xl">
          <ImageReveal className="aspect-[16/8] rounded-[var(--radius-image)]">
            <Photo src={post.cover} alt={post.coverAlt} fill preload fade={false} sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
          </ImageReveal>
        </div>
      </header>

      <div className="tone-light py-16 md:py-24">
        <div className="container-site grid max-w-6xl gap-14 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <details className="rounded-[14px] border border-line bg-raised px-5 py-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold">İçindekiler</summary>
              <ol className="mt-3 space-y-2 text-sm">
                {toc.map((h) => (
                  <li key={h.text}>
                    <a href={`#${slugify(h.text)}`} className="text-fg-muted hover:text-accent">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
            <nav aria-label="İçindekiler" className="hidden lg:sticky lg:top-28 lg:block">
              <p className="text-xs font-semibold tracking-[0.16em] text-fg-muted uppercase">İçindekiler</p>
              <ol className="mt-4 space-y-2 border-l border-line text-sm">
                {toc.map((h) => (
                  <li key={h.text}>
                    <a href={`#${slugify(h.text)}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-fg-muted hover:border-accent hover:text-fg">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <div className="prose-site min-w-0 lg:col-span-8">
            {post.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </div>
      </div>

      <section className="tone-light border-t border-line py-16 md:py-24">
        <div className="container-site">
          <div className="flex flex-col gap-6 rounded-[20px] border border-line bg-raised p-8 md:flex-row md:items-center">
            <span className="relative size-20 shrink-0 overflow-hidden rounded-full bg-night-raised">
              <Photo src={author.photo} alt={author.name} fill sizes="80px" className="object-cover" />
            </span>
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-[0.16em] text-fg-muted uppercase">Yazar</p>
              <p className="mt-1 font-serif text-2xl">{author.name}</p>
              <p className="mt-2 text-fg-muted">{author.bio}</p>
            </div>
            <ButtonLink href={`/danisman/${author.slug}`} variant="outline">
              Profili gör <ArrowRight size={16} />
            </ButtonLink>
          </div>

          {related.length ? (
            <>
              <h2 className="mt-20 text-h2">İlgili yazılar</h2>
              <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-3">
                {related.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </article>
  );
}

async function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "h2":
      return <h2 id={slugify(block.text)}>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "quote":
      return <blockquote>{block.text}</blockquote>;
    case "listing": {
      const listing = await getListing(block.slug);
      if (!listing) return null;
      return (
        <div className="not-prose my-10 rounded-[20px] border border-line bg-raised p-5">
          <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-fg-muted uppercase">Yazıyla ilgili ilan</p>
          <ListingCard listing={listing} />
        </div>
      );
    }
    case "callout":
      return (
        <aside className="not-prose my-10 rounded-[20px] bg-ink p-7 text-ivory">
          <p className="font-serif text-2xl">{block.title}</p>
          <p className="mt-2 text-ivory/75">{block.text}</p>
          <Link
            href={block.href}
            className="mt-5 inline-flex items-center gap-2 font-semibold text-gold no-underline hover:underline"
          >
            {block.cta} <ArrowRight size={16} />
          </Link>
        </aside>
      );
  }
}
