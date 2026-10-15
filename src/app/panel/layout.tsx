import { Bell, Search } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PanelNav } from "@/components/panel/panel-nav";
import { Photo } from "@/components/ui/photo";

export const metadata: Metadata = {
  title: { default: "Ofis paneli", template: "%s · Ofis paneli" },
  robots: { index: false, follow: false },
};

/**
 * Ofis paneli vitrini (D-14, Bölüm 20.2). Örnek veriyle çalışır; giriş yoktur.
 * Üretimde Payload admin + özel ekranlar (M10, M17) bunun yerini alır.
 */
export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="tone-light min-h-dvh lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-0 lg:h-dvh">
        <PanelNav />
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between gap-4 border-b border-line bg-raised px-5 py-4 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden rounded-full bg-gold px-3 py-1 text-[0.6875rem] font-bold tracking-wider text-night uppercase lg:inline">
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
          <div className="flex items-center gap-4">
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
          </div>
        </header>
        <main id="icerik" className="px-5 py-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
