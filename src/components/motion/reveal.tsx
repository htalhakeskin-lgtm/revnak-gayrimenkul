"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

/** Görünür alana girince aşağıdan yumuşak belirme (Bölüm 4.5 · Reveal) */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}) {
  return (
    <m.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay }}
    >
      {children}
    </m.div>
  );
}

/** Çocukları sırayla belirten liste (kart ızgaraları için) */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      data-reveal=""
      className={className}
      variants={{
        hidden: { opacity: 0, y: 32 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
      }}
    >
      {children}
    </m.div>
  );
}
