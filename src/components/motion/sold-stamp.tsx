"use client";

import { m } from "motion/react";
import { cn } from "@/lib/utils";

/** "SATILDI" damgasının kartın üstüne vurulması (Bölüm 4.5 · SoldStamp) */
export function SoldStamp({
  label,
  sub,
  className,
  delay = 0.2,
}: {
  label: string;
  sub?: string;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2",
        className,
      )}
      initial={{ opacity: 0, scale: 2.4, rotate: -24 }}
      whileInView={{ opacity: 1, scale: 1, rotate: -12 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: "spring", stiffness: 380, damping: 20, mass: 0.9, delay }}
    >
      <div className="rounded-md border-[3px] border-gold px-5 py-2 text-center text-gold shadow-[0_0_0_4px_rgb(14_17_20/0.35)] backdrop-blur-[2px]">
        <div className="font-serif text-3xl leading-none tracking-[0.18em] uppercase md:text-4xl">
          {label}
        </div>
        {sub ? (
          <div className="mt-1 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase">{sub}</div>
        ) : null}
      </div>
    </m.div>
  );
}
