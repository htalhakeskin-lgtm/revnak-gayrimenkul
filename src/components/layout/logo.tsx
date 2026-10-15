import { cn } from "@/lib/utils";

/** Işıltı işareti: dört köşeli yıldız (revnak = parıltı). Logo, ikonlar ve OG görseli aynı yolu kullanır. */
export const SPARKLE_PATH =
  "M20 6.5C21 15 25 19 33.5 20C25 21 21 25 20 33.5C19 25 15 21 6.5 20C15 19 19 15 20 6.5Z";

/** Marka işareti: ince çember içinde altın ışıltı (K17) */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden fill="none">
      <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeOpacity="0.35" />
      <path d={SPARKLE_PATH} fill="var(--color-gold)" />
      <circle cx="30.5" cy="9.5" r="1.4" fill="var(--color-gold)" fillOpacity="0.7" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark />
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-[1.4rem] tracking-[0.32em] uppercase">Revnak</span>
          <span className="mt-1 text-[0.5625rem] font-semibold tracking-[0.42em] text-fg-muted uppercase">
            Gayrimenkul
          </span>
        </span>
      ) : null}
    </span>
  );
}
