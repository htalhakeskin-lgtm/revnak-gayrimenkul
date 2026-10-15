"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * LazyMotion: animasyon özellikleri tek seferde ve küçük paketle yüklenir (performans bütçesi).
 * reducedMotion="user": işletim sisteminde "hareketi azalt" açıksa transform animasyonları kapanır,
 * yalnızca solma kalır (Bölüm 4.5, kural 2).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
