import Link from "next/link";
import { Photo } from "@/components/ui/photo";
import type { Post } from "@/data/types";
import { formatDate } from "@/lib/format";

export function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div
          className={
            large
              ? "relative aspect-[16/10] overflow-hidden rounded-[var(--radius-image)] bg-night-raised"
              : "relative aspect-[16/11] overflow-hidden rounded-[var(--radius-image)] bg-night-raised"
          }
        >
          <Photo
            src={post.cover}
            alt={post.coverAlt}
            fill
            sizes={large ? "(min-width: 1024px) 60vw, 92vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"}
            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-105"
          />
        </div>
        <div className="pt-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            {post.category} · {post.readingMinutes} dk okuma
          </p>
          <h3 className={large ? "mt-3 text-h2 text-fg" : "mt-3 font-serif text-2xl leading-snug text-fg"}>
            <span className="transition-colors group-hover:text-accent">{post.title}</span>
          </h3>
          <p className="mt-3 line-clamp-2 leading-relaxed text-fg-muted">{post.excerpt}</p>
          <p className="mt-4 text-sm text-fg-muted">{formatDate(post.publishedAt)}</p>
        </div>
      </Link>
    </article>
  );
}
