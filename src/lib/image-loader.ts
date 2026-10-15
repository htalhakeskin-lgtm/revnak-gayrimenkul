"use client";

type LoaderArgs = { src: string; width: number; quality?: number };

/**
 * Unsplash görsellerini imgix parametreleriyle boyutlandırır (K12).
 * Yerel dosyalar olduğu gibi döner.
 */
export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 70));
    return url.toString();
  }
  return `${src}?w=${width}`;
}
