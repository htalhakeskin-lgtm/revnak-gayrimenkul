"use client";

import { ReactLenis } from "lenis/react";
import { useMediaQuery } from "@/lib/hooks";

/**
 * Yumuşak kaydırma (Lenis). "Hareketi azalt" açıksa ve dokunmatik cihazlarda
 * yerel kaydırma korunur.
 */
export function SmoothScroll() {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(pointer: fine)");
  if (reduce || !finePointer) return null;
  return <ReactLenis root options={{ lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95 }} />;
}
