import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Sonsuz kayan şerit (Bölüm 4.5 · Marquee). Saf CSS, fare üstündeyken durur.
 * "Hareketi azalt" açıkken durur ve elle kaydırılabilir olur.
 */
export function Marquee({
  children,
  className,
  duration = 40,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <div className={cn("marquee-pause marquee-track overflow-hidden", className)}>
      <div
        className="animate-marquee flex w-max"
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  );
}
