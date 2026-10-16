"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { consentStore } from "@/lib/demo-store";
import { useHydrated } from "@/lib/hooks";

/**
 * Çerez izni (Bölüm 13.2): zorunlu olmayan çerezler onaysız çalışmaz.
 * Demoda hiçbir analitik betik yüklenmez; seçim yalnızca kaydedilir.
 */
export function CookieConsent() {
  const hydrated = useHydrated();
  const consent = consentStore.use();
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (!hydrated || consent.decided) return null;

  const save = (a: boolean, m: boolean) =>
    consentStore.set({ decided: true, analytics: a, marketing: m, date: new Date().toISOString() });

  return (
    <div
      role="region"
      aria-label="Çerez tercihleri"
      className="animate-page-in fixed inset-x-3 bottom-[84px] z-40 mx-auto max-w-xl rounded-[20px] border border-night-line bg-night-raised/95 p-4 text-[0.8125rem] text-ivory shadow-[0_24px_80px_rgb(0_0_0/0.5)] backdrop-blur-xl md:right-24 md:bottom-6 md:left-auto md:mx-0 md:w-[20rem] md:p-5 md:text-sm"
    >
      <p className="hidden font-semibold md:block">Çerez tercihleriniz</p>
      <p className="leading-relaxed text-muted md:mt-2">
        <strong className="font-semibold text-ivory md:hidden">Çerezler: </strong>
        Analitik ve pazarlama çerezleri yalnızca onayınızla çalışır.{" "}
        <Link href="/cerez-politikasi" className="text-gold underline underline-offset-4">
          Çerez politikası
        </Link>
      </p>

      {details ? (
        <fieldset className="mt-4 space-y-3 border-t border-night-line pt-4">
          <legend className="sr-only">Çerez kategorileri</legend>
          <label className="flex items-center justify-between gap-4">
            <span>Zorunlu çerezler</span>
            <span className="text-xs text-muted">Her zaman açık</span>
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>Analitik (GA4, Clarity)</span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="size-4 accent-[var(--color-gold)]"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>Pazarlama (Meta Pixel)</span>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="size-4 accent-[var(--color-gold)]"
            />
          </label>
        </fieldset>
      ) : null}

      <div className="mt-3 grid grid-cols-3 gap-2 md:mt-4 md:flex md:flex-wrap">
        {details ? (
          <Button size="sm" className="col-span-3" onClick={() => save(analytics, marketing)}>
            Seçimi kaydet
          </Button>
        ) : (
          <>
            <Button size="sm" className="px-2 md:px-4" onClick={() => save(true, true)}>
              <span className="md:hidden">Kabul et</span>
              <span className="hidden md:inline">Tümünü kabul et</span>
            </Button>
            <Button size="sm" variant="outline" className="px-2 md:px-4" onClick={() => save(false, false)}>
              Reddet
            </Button>
            <Button size="sm" variant="ghost" className="px-2 md:px-4" onClick={() => setDetails(true)}>
              Tercihler
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
