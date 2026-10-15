import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Unsplash fotoğraf kimliğinden tam URL üretir (K12). */
export function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}`;
}

/** Türkçe karakterleri koruyarak URL dostu kısa ad üretir. */
export function slugify(input: string) {
  const map: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    i: "i",
    ö: "o",
    ş: "s",
    ü: "u",
  };
  return input
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıiöşü]/g, (ch) => map[ch] ?? ch)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
