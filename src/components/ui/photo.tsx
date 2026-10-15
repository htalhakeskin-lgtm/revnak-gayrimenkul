"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";
import { cn, unsplash } from "@/lib/utils";

type PhotoProps = Omit<ImageProps, "src" | "alt"> & {
  /** Unsplash fotoğraf kimliği veya tam URL */
  src: string;
  alt: string;
  /** Yüklenince yumuşak belirme. LCP görsellerinde kapatılır. */
  fade?: boolean;
};

/**
 * Yüklenince yumuşakça beliren görsel. Önbellekten gelen görseller için
 * ref ile `complete` kontrolü yapılır; böylece görsel asla görünmez kalmaz.
 */
export function Photo({ src, alt, className, onLoad, fade = true, ...props }: PhotoProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <Image
      ref={fade ? ref : undefined}
      src={src.startsWith("http") || src.startsWith("/") ? src : unsplash(src)}
      alt={alt}
      data-loaded={fade ? loaded : undefined}
      onLoad={(e) => {
        if (fade) setLoaded(true);
        onLoad?.(e);
      }}
      className={cn(fade && "img-fade", className)}
      {...props}
    />
  );
}
