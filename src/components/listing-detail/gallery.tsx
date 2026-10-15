"use client";

import { ChevronLeft, ChevronRight, Expand, Images, Play, Rotate3d, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/utils";

/**
 * İlan galerisi (İP-17): masaüstünde mozaik, mobilde parmakla kaydırılan şerit,
 * tam ekran ışık kutusu (klavye okları, kaydırma, sayaç).
 */
export function Gallery({
  images,
  title,
  hasVideo,
  hasTour360,
}: {
  images: string[];
  title: string;
  hasVideo: boolean;
  hasTour360: boolean;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const [media, setMedia] = useState<"video" | "360" | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [stripIndex, setStripIndex] = useState(0);

  const alt = (i: number) => `${title} — fotoğraf ${i + 1}/${images.length}`;

  return (
    <div className="relative">
      {/* Mobil: kaydırılabilir şerit */}
      <div className="relative md:hidden">
        <div
          ref={stripRef}
          className="snap-strip aspect-[4/3]"
          onScroll={(e) => {
            const el = e.currentTarget;
            setStripIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          data-lenis-prevent-horizontal
          aria-label="Fotoğraflar"
          role="region"
        >
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setIndex(i)}
              className="relative aspect-[4/3] w-screen shrink-0"
              aria-label={`Fotoğrafı büyüt: ${i + 1}`}
            >
              <Photo src={img} alt={alt(i)} fill sizes="100vw" preload={i === 0} fade={i !== 0} className="object-cover" />
            </button>
          ))}
        </div>
        <span className="tabular absolute right-4 bottom-4 rounded-full bg-night/70 px-3 py-1 text-xs font-semibold text-ivory backdrop-blur-md">
          {stripIndex + 1} / {images.length}
        </span>
      </div>

      {/* Masaüstü: mozaik */}
      <div className="container-site hidden md:block">
        <div className="grid h-[34rem] grid-cols-4 grid-rows-2 gap-3 overflow-hidden rounded-[var(--radius-image)] lg:h-[38rem]">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "group relative overflow-hidden bg-night-raised",
                i === 0 && "col-span-2 row-span-2",
                images.length < 5 && i === images.length - 1 && i > 0 && "col-span-2",
              )}
              aria-label={`Fotoğrafı büyüt: ${i + 1}`}
            >
              <Photo
                src={img}
                alt={alt(i)}
                fill
                preload={i === 0}
                fade={i !== 0}
                sizes={i === 0 ? "50vw" : "25vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span aria-hidden className="absolute inset-0 bg-night/0 transition-colors duration-300 group-hover:bg-night/20" />
            </button>
          ))}
        </div>
      </div>

      {/* Medya butonları */}
      <div className="container-site pointer-events-none absolute inset-x-0 bottom-4 flex justify-start gap-2 max-md:hidden">
        <div className="pointer-events-auto ml-4 flex gap-2">
          <MediaButton onClick={() => setIndex(0)} icon={<Images size={16} />}>
            {images.length} fotoğraf
          </MediaButton>
          {hasVideo ? (
            <MediaButton onClick={() => setMedia("video")} icon={<Play size={16} className="fill-current" />}>
              Video
            </MediaButton>
          ) : null}
          {hasTour360 ? (
            <MediaButton onClick={() => setMedia("360")} icon={<Rotate3d size={16} />}>
              360° tur
            </MediaButton>
          ) : null}
        </div>
      </div>
      <div className="flex gap-2 px-4 pt-4 md:hidden">
        {hasVideo ? (
          <MediaButton onClick={() => setMedia("video")} icon={<Play size={16} className="fill-current" />}>
            Video
          </MediaButton>
        ) : null}
        {hasTour360 ? (
          <MediaButton onClick={() => setMedia("360")} icon={<Rotate3d size={16} />}>
            360° tur
          </MediaButton>
        ) : null}
      </div>

      {index !== null ? (
        <Lightbox images={images} start={index} alt={alt} onClose={() => setIndex(null)} />
      ) : null}

      <Dialog
        open={media !== null}
        onClose={() => setMedia(null)}
        title={media === "video" ? "İlan videosu" : "360° sanal tur"}
        size="lg"
      >
        <div className="relative aspect-video overflow-hidden rounded-[14px] bg-night">
          <Photo src={images[media === "video" ? 0 : Math.min(1, images.length - 1)]} alt="" fill sizes="860px" className="object-cover opacity-60" />
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold text-night">
                {media === "video" ? <Play size={26} className="fill-current" /> : <Rotate3d size={26} />}
              </span>
              <p className="mt-4 max-w-md text-sm text-ivory/85">
                Demo: Gerçek sitede {media === "video" ? "ilan videosu uyarlanabilir akışla" : "360° tur (Matterport/Kuula veya Pannellum)"} burada oynatılır.
              </p>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function MediaButton({
  children,
  icon,
  onClick,
}: {
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-night/75 px-4 py-2 text-xs font-semibold text-ivory backdrop-blur-md transition-colors hover:bg-night"
    >
      {icon}
      {children}
    </button>
  );
}

function Lightbox({
  images,
  start,
  alt,
  onClose,
}: {
  images: string[];
  start: number;
  alt: (i: number) => string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(start);

  const go = useCallback(
    (i: number) => {
      const el = trackRef.current;
      if (!el) return;
      const next = (i + images.length) % images.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    },
    [images.length],
  );

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const el = trackRef.current;
    if (el) el.scrollLeft = start * el.clientWidth;
    return () => dialog?.close();
  }, [start]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(current + 1);
      if (e.key === "ArrowLeft") go(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, go]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      data-lenis-prevent
      aria-label="Fotoğraf galerisi"
      className="m-0 h-dvh max-h-dvh w-screen max-w-none bg-night p-0 text-ivory backdrop:bg-night"
    >
      <div className="relative h-full">
        <div
          ref={trackRef}
          className="snap-strip h-full"
          onScroll={(e) => {
            const el = e.currentTarget;
            setCurrent(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {images.map((img, i) => (
            <div key={img + i} className="relative h-full w-screen shrink-0">
              <Photo src={img} alt={alt(i)} fill sizes="100vw" quality={75} className="object-contain" />
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-night/80 to-transparent p-4 md:p-6">
          <span className="tabular text-sm font-semibold">
            {current + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Galeriyi kapat"
            autoFocus
          >
            <X size={22} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => go(current - 1)}
          className="absolute top-1/2 left-4 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 md:grid"
          aria-label="Önceki fotoğraf"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          onClick={() => go(current + 1)}
          className="absolute top-1/2 right-4 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 md:grid"
          aria-label="Sonraki fotoğraf"
        >
          <ChevronRight size={24} />
        </button>
        <span className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs text-ivory/60 md:flex">
          <Expand size={14} /> Ok tuşları ile gezinebilirsiniz
        </span>
      </div>
    </dialog>
  );
}
