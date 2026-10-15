"use client";

import { Heart } from "lucide-react";
import { favoritesStore, toggleFavorite } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

/** Favoriler giriş yapmadan tarayıcıda tutulur (M08). */
export function FavoriteButton({
  slug,
  title,
  className,
  withLabel = false,
}: {
  slug: string;
  title: string;
  className?: string;
  withLabel?: boolean;
}) {
  const favorites = favoritesStore.use();
  const active = favorites.includes(slug);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `${title} favorilerden çıkar` : `${title} favorilere ekle`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(slug);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-[transform,background-color,color] duration-200 active:scale-90",
        withLabel
          ? "h-11 border border-line px-5 text-sm font-semibold hover:border-accent"
          : "size-10 bg-night/55 text-ivory backdrop-blur-md hover:bg-night/80",
        active && !withLabel && "text-gold",
        className,
      )}
    >
      <Heart size={withLabel ? 18 : 18} className={cn(active && "fill-current text-gold")} />
      {withLabel ? (active ? "Favorilerde" : "Favorilere ekle") : null}
    </button>
  );
}
