"use client";

import { ArrowUpRight, Heart, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Marquee } from "@/components/motion/marquee";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { Dialog } from "@/components/ui/dialog";
import { Photo } from "@/components/ui/photo";
import type { InstagramPost } from "@/data/types";
import { formatNumber } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

/**
 * Sahne 8 — Instagram / Reels (M07). Demoda gönderiler statik veridir;
 * üretimde resmî API'den çekilip önbelleklenir, API kapalıyken bölüm gizlenir.
 */
export function InstagramStrip({ posts }: { posts: InstagramPost[] }) {
  const [active, setActive] = useState<InstagramPost | null>(null);

  if (posts.length === 0) return null;

  return (
    <section className="tone-dark py-24 md:py-32" aria-labelledby="instagram-title">
      <div className="container-site flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-4">Instagram</p>
          <h2 id="instagram-title" className="text-h2">
            @{siteConfig.instagramHandle}
          </h2>
          <p className="mt-4 max-w-lg text-muted">
            Yeni ilanlar, bölge videoları ve gösterimlerden kareler.{" "}
            <span className="text-xs">(Örnek gönderiler; gerçek sürümde hesaptan otomatik çekilir.)</span>
          </p>
        </div>
        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline"
        >
          <InstagramIcon size={18} /> Takip et
        </a>
      </div>

      <Marquee className="mt-14" duration={55}>
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => setActive(post)}
            className="group relative mr-4 aspect-[4/5] w-60 shrink-0 overflow-hidden rounded-[var(--radius-card)] bg-night-raised md:w-72"
            aria-label={`Gönderiyi aç: ${post.caption}`}
          >
            <Photo
              src={post.image}
              alt=""
              fill
              sizes="300px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span aria-hidden className="absolute inset-0 bg-night/0 transition-colors duration-300 group-hover:bg-night/40" />
            {post.kind === "reels" ? (
              <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-night/60 text-ivory backdrop-blur-md">
                <Play size={14} className="fill-current" />
              </span>
            ) : null}
            <span className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-semibold text-ivory opacity-0 transition-opacity group-hover:opacity-100">
              <Heart size={14} className="fill-current" /> {formatNumber(post.likes)}
            </span>
          </button>
        ))}
      </Marquee>

      <Dialog open={active !== null} onClose={() => setActive(null)} title="Instagram" size="lg">
        {active ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-night">
              <Photo src={active.image} alt={active.caption} fill sizes="(min-width: 768px) 400px, 90vw" className="object-cover" />
              {active.kind === "reels" ? (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-16 place-items-center rounded-full bg-night/60 text-ivory backdrop-blur-md">
                    <Play size={26} className="fill-current" />
                  </span>
                </span>
              ) : null}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gold">@{siteConfig.instagramHandle}</p>
              <p className="mt-3 leading-relaxed">{active.caption}</p>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <Heart size={16} /> {formatNumber(active.likes)} beğeni
              </p>
              <p className="mt-6 text-xs leading-relaxed text-muted">
                Demo: Gerçek sitede Reels, siteden çıkmadan bu pencerede oynatılır.
              </p>
              {active.listingSlug ? (
                <Link
                  href={`/ilan/${active.listingSlug}`}
                  onClick={() => setActive(null)}
                  className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 font-semibold text-night"
                >
                  İlanı incele <ArrowUpRight size={16} />
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </Dialog>
    </section>
  );
}
