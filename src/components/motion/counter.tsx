"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const fmt = new Intl.NumberFormat("tr-TR");

/**
 * Sayaçların 0'dan hedefe akması (Bölüm 4.5 · Counter).
 * Sunucu çıktısı son değeri içerir (JS yoksa ve arama motorları için doğru sayı);
 * animasyon yalnızca görünür alana girince oynar.
 */
export function Counter({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!inView) {
      el.textContent = `0${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = `${fmt.format(Math.round(v))}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, suffix, value]);

  return (
    <span ref={ref} className={className}>
      {fmt.format(value)}
      {suffix}
    </span>
  );
}
