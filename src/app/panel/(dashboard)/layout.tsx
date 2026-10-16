import { ArrowUpRight, Bell, LogOut, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/layout/logo";
import { LeadBadge } from "@/components/panel/lead-badge";
import { PanelNav, PanelTabBar } from "@/components/panel/panel-nav";
import { Photo } from "@/components/ui/photo";
import { panelLogout } from "../giris/actions";

export const metadata: Metadata = {
  title: { default: "Ofis paneli", template: "%s · Ofis paneli" },
  robots: { index: false, follow: false },
};

/**
 * Ofis paneli (D-14, Bölüm 20.2). Parola korumalı (K20); talepler ve randevular veritabanından gelir.
 * Masaüstü: kenar menü. Mobil: koyu üst çubuk + alt sekme çubuğu.
 * LeadBadge sunucu bileşenidir; istemci menüsüne prop olarak verilir (import edilemez).
 */
export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="tone-light min-h-dvh lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-dvh">
        <PanelNav leadBadge={<LeadBadge className="ml-auto" />} />
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-raised/95 px-4 py-3 backdrop-blur-xl lg:static lg:px-10 lg:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/panel" className="flex items-center gap-2 lg:hidden" aria-label="Panel ana sayfa">
              <LogoMark className="size-8 text-ink" />
              <span className="font-serif text-lg tracking-[0.24em] uppercase">Revnak</span>
            </Link>
            <span className="rounded-full bg-gold px-2.5 py-0.5 text-[0.625rem] font-bold tracking-wider text-night uppercase lg:px-3 lg:py-1 lg:text-[0.6875rem]">
              Demo
            </span>
            <label className="relative hidden md:block">
              <span className="sr-only">Panelde ara</span>
              <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted" />
              <input
                type="search"
                placeholder="İlan no, kişi, telefon…"
                className="h-10 w-72 rounded-full border border-line bg-ivory pr-4 pl-9 text-sm placeholder:text-fg-muted focus:border-accent focus:outline-none"
              />
            </label>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <Link
              href="/"
              className="hidden items-center gap-1 text-sm text-fg-muted hover:text-accent sm:flex lg:hidden"
            >
              Siteye dön <ArrowUpRight size={14} />
            </Link>
            <button type="button" className="relative grid size-10 place-items-center rounded-full hover:bg-sand" aria-label="Bildirimler (3 yeni)">
              <Bell size={18} />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-danger" aria-hidden />
            </button>
            <div className="flex items-center gap-3">
              <span className="relative size-9 overflow-hidden rounded-full bg-sand">
                <Photo src="1472099645785-5658abf4ff4e" alt="" fill sizes="36px" className="object-cover" />
              </span>
              <span className="hidden text-sm leading-tight sm:block">
                <span className="block font-semibold">Selim Arıkan</span>
                <span className="block text-xs text-fg-muted">Süper Admin</span>
              </span>
            </div>
            <form action={panelLogout}>
              <button
                type="submit"
                className="grid size-10 place-items-center rounded-full text-fg-muted hover:bg-sand hover:text-fg"
                aria-label="Çıkış yap"
                title="Çıkış yap"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </header>
        <main id="icerik" className="px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
      <PanelTabBar leadBadge={<LeadBadge className="absolute top-1.5 left-1/2 ml-2" />} />
    </div>
  );
}
