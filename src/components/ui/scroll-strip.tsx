"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Sürüklenebilir/kaydırılabilir yatay şerit (Bölüm 6, sahne 2).
 * Dokunmatikte yerel kaydırma; masaüstünde ok butonları.
 */
export function ScrollStrip({
  children,
  label,
  className,
  itemClassName = "w-[82vw] sm:w-[46vw] lg:w-[30rem]",
}: {
  children: ReactNode[];
  label: string;
  className?: string;
  itemClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    const item = el.firstElementChild as HTMLElement | null;
    const step = item ? item.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className={className}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        data-lenis-prevent-horizontal
        className="snap-strip gap-6 scroll-px-4 px-4 sm:scroll-px-6 sm:px-6 lg:scroll-px-10 lg:px-10 xl:px-[max(2.5rem,calc((100vw_-_82.5rem)/2_+_2.5rem))] xl:scroll-px-[max(2.5rem,calc((100vw_-_82.5rem)/2_+_2.5rem))]"
      >
        {children.map((child, i) => (
          <div key={i} className={cn("shrink-0", itemClassName)}>
            {child}
          </div>
        ))}
      </div>
      <div className="container-site mt-8 hidden justify-end gap-3 md:flex">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="grid size-12 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent"
          aria-label="Önceki"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="grid size-12 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent"
          aria-label="Sonraki"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
