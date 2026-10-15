"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Görselin perde açılır gibi ortaya çıkması (Bölüm 4.5 · ImageReveal).
 * Perde bir örtü katmanının scaleX ile kapanmasıdır: yalnızca transform.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
  direction = "left",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "left" | "right";
}) {
  return (
    <m.div
      className={cn("relative overflow-hidden", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <m.div
        className="absolute inset-0"
        variants={{ hidden: { scale: 1.18 }, show: { scale: 1 } }}
        transition={{ duration: 1.6, delay }}
      >
        {children}
      </m.div>
      <m.div
        aria-hidden
        className="absolute inset-0 z-10 bg-night"
        style={{ originX: direction === "left" ? 1 : 0 }}
        variants={{ hidden: { scaleX: 1 }, show: { scaleX: 0 } }}
        transition={{ duration: 1.1, delay, ease: [0.65, 0, 0.35, 1] }}
      />
    </m.div>
  );
}
