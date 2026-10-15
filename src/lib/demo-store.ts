"use client";

import { useSyncExternalStore } from "react";

/**
 * Tarayıcıda saklanan demo verileri (Bölüm 20.2): favoriler, karşılaştırma, gönderilen talepler,
 * randevular ve iletişim tıklamaları. Üretimde bunların yerini veritabanı alır.
 * localStorage her an erişilemez olabilir (gizli pencere vb.): tüm erişimler try/catch içinde.
 */

type Listener = () => void;

function createStore<T>(key: string, fallback: T) {
  const storageKey = `revnak:${key}`;
  const listeners = new Set<Listener>();
  let cache: T | undefined;

  function read(): T {
    if (cache !== undefined) return cache;
    try {
      const raw = window.localStorage.getItem(storageKey);
      cache = raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      cache = fallback;
    }
    return cache;
  }

  function write(next: T) {
    cache = next;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Depolama kapalıysa veri yalnızca bu oturumda kalır.
    }
    listeners.forEach((l) => l());
  }

  function subscribe(listener: Listener) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) {
        cache = undefined;
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  return {
    get: read,
    set: (updater: T | ((prev: T) => T)) =>
      write(typeof updater === "function" ? (updater as (prev: T) => T)(read()) : updater),
    use: () => useSyncExternalStore(subscribe, read, () => fallback),
  };
}

// ---------------------------------------------------------------- Tipler

export interface DemoLead {
  id: string;
  kind: "iletisim" | "ilan-bilgi" | "portfoy" | "degerleme";
  name: string;
  phone: string;
  email?: string;
  message?: string;
  listingNo?: string;
  createdAt: string; // ISO zaman damgası (tarayıcıda üretilir)
  ref: string;
}

export interface DemoAppointment {
  id: string;
  ref: string;
  agentSlug: string;
  listingSlug?: string;
  kind: "yerinde" | "ofis" | "goruntulu";
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  name: string;
  phone: string;
  createdAt: string;
}

export interface DemoClick {
  id: string;
  channel: "whatsapp" | "telefon" | "eposta";
  listingNo?: string;
  agentSlug?: string;
  createdAt: string;
}

export interface CookieConsent {
  decided: boolean;
  analytics: boolean;
  marketing: boolean;
  date?: string;
}

// ---------------------------------------------------------------- Depolar

const emptyStrings: string[] = [];
const emptyLeads: DemoLead[] = [];
const emptyAppointments: DemoAppointment[] = [];
const emptyClicks: DemoClick[] = [];
const defaultConsent: CookieConsent = { decided: false, analytics: false, marketing: false };

export const favoritesStore = createStore<string[]>("favoriler", emptyStrings);
export const compareStore = createStore<string[]>("karsilastir", emptyStrings);
export const leadsStore = createStore<DemoLead[]>("talepler", emptyLeads);
export const appointmentsStore = createStore<DemoAppointment[]>("randevular", emptyAppointments);
export const clicksStore = createStore<DemoClick[]>("tiklamalar", emptyClicks);
export const consentStore = createStore<CookieConsent>("cerez-izni", defaultConsent);

export const COMPARE_LIMIT = 4;

export function toggleFavorite(slug: string) {
  favoritesStore.set((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev]));
}

/** Karşılaştırmaya ekler; sınır doluysa false döner. */
export function toggleCompare(slug: string): boolean {
  const current = compareStore.get();
  if (current.includes(slug)) {
    compareStore.set(current.filter((s) => s !== slug));
    return true;
  }
  if (current.length >= COMPARE_LIMIT) return false;
  compareStore.set([...current, slug]);
  return true;
}

export function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
