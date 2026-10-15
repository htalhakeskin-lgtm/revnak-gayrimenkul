"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks";

/**
 * Görselin kaydırmayla farklı hızda hareketi (Bölüm 4.5 · Parallax).
 * Mobilde ve "hareketi azalt" açıkken devre dışı (kural 2 ve 4).
 */
export function Parallax({
  children,
  className,
  amount = 10,
}: {
  children: ReactNode;
  className?: string;
  /** Yüzde cinsinden kayma miktarı */
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 768px)");
  const enabled = desktop && !reduce;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <m.div
        className="absolute inset-0"
        style={enabled ? { y, scale: 1 + (amount * 2.2) / 100 } : undefined}
      >
        {children}
      </m.div>
    </div>
  );
}
