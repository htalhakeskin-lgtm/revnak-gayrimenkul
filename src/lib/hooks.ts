"use client";

import { useSyncExternalStore } from "react";

/** Medya sorgusu; sunucuda ve hidrasyon sırasında `false` döner. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

// Paylaşılan saat: render sırasında Date.now() çağırmadan "şimdi"yi okumak için
let clockNow = 0;
let clockTimer: number | undefined;
const clockListeners = new Set<() => void>();

function subscribeClock(listener: () => void) {
  clockListeners.add(listener);
  if (clockTimer === undefined) {
    clockTimer = window.setInterval(() => {
      clockNow = Date.now();
      clockListeners.forEach((l) => l());
    }, 30_000);
  }
  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size === 0 && clockTimer !== undefined) {
      window.clearInterval(clockTimer);
      clockTimer = undefined;
    }
  };
}

function readClock() {
  if (clockNow === 0) clockNow = Date.now();
  return clockNow;
}

/** Şu anki zaman (ms). Sunucuda ve hidrasyonda 0 döner; tarayıcıda 30 sn'de bir güncellenir. */
export function useNow() {
  return useSyncExternalStore(subscribeClock, readClock, () => 0);
}

/** Bileşen tarayıcıda mı (hidrasyon tamamlandı mı)? */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
