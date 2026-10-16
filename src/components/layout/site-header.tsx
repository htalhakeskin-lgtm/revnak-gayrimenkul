"use client";

import { Heart, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { favoritesStore } from "@/lib/demo-store";
import { mainNav, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const RIBBON_H = 30;

/**
 * Yapışkan üst menü (Bölüm 5): kaydırınca demo şeridi yukarı kayar, zemin belirir.
 * Yalnızca transform ve opacity ile (Bölüm 4.5, kural 1).
 *
 * usePathname, önceden üretilmemiş dinamik adreslerde (App Shell) askıya alınır;
 * bu yüzden aynı menünün yol bilgisi olmayan hâli Suspense yedeği olarak kullanılır.
 */
export function SiteHeader() {
  return (
    <Suspense fallback={<HeaderBar pathname="" />}>
      <HeaderWithPath />
    </Suspense>
  );
}

function HeaderWithPath() {
  return <HeaderBar pathname={usePathname()} />;
}

function HeaderBar({ pathname }: { pathname: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const favorites = favoritesStore.use();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const showRibbon = siteConfig.demo;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-out-expo)]"
        style={{ transform: scrolled && showRibbon ? `translateY(-${RIBBON_H}px)` : undefined }}
      >
        {showRibbon ? (
          <div
            className="flex items-center justify-center bg-gold px-4 text-center text-[0.6875rem] font-semibold tracking-wide text-night"
            style={{ height: RIBBON_H }}
          >
            <span className="hidden sm:inline">Gösterim amaçlı demo site —&nbsp;</span>
            <span>ilanlar, kişiler ve fiyatlar kurgusaldır.</span>
          </div>
        ) : null}

        <div className="relative">
          {/* Kaydırınca beliren zemin */}
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 border-b border-white/8 bg-night/85 backdrop-blur-xl transition-opacity duration-500",
              scrolled || menuOpen ? "opacity-100" : "opacity-0",
            )}
          />
          {/* Üstte, fotoğraf üzerinde okunabilirlik için hafif karartma */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-night/70 to-transparent transition-opacity duration-500",
              scrolled ? "opacity-0" : "opacity-100",
            )}
          />
          <div className="container-site relative flex h-[72px] items-center justify-between gap-6 text-ivory">
            <Link
              href="/"
              className="relative z-10 shrink-0 [--tone-muted:var(--color-muted)]"
              aria-label={`${siteConfig.fullName} ana sayfa`}
            >
              <Logo />
            </Link>

            <nav aria-label="Ana menü" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative px-3 py-2 text-[0.8125rem] font-medium tracking-wide text-ivory/80 transition-colors hover:text-ivory",
                        isActive(item.href) && "text-ivory",
                      )}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100",
                          isActive(item.href) && "scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/favoriler"
                className="relative grid size-11 place-items-center rounded-full text-ivory/85 transition-colors hover:bg-white/8 hover:text-ivory"
                aria-label={`Favorilerim (${favorites.length})`}
              >
                <Heart size={20} />
                {favorites.length > 0 ? (
                  <span className="absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-gold px-1 text-[0.625rem] leading-4 font-bold text-night">
                    {favorites.length}
                  </span>
                ) : null}
              </Link>
              <ButtonLink href="/randevu" size="sm" className="hidden sm:inline-flex">
                Randevu al
              </ButtonLink>
              <button
                type="button"
                className="grid size-11 place-items-center rounded-full text-ivory transition-colors hover:bg-white/8 lg:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Menüyü aç"
                aria-expanded={menuOpen}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}

function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Sayfa değişince menü kapanır; Activity ile gizlenen sayfada açık kalmaz.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  useLayoutEffect(() => {
    const dialog = ref.current;
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  const links = [
    ...mainNav,
    { label: "Evimin değeri", href: "/evimi-degerle" },
    { label: "İletişim", href: "/iletisim" },
  ];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      data-lenis-prevent
      aria-label="Menü"
      className="tone-dark m-0 h-dvh max-h-dvh w-screen max-w-none bg-night p-0 text-ivory backdrop:bg-transparent"
    >
      <div className="grain flex h-full flex-col">
        <div className="container-site flex h-[72px] items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-full hover:bg-white/8"
            aria-label="Menüyü kapat"
          >
            <X size={24} />
          </button>
        </div>
        <nav aria-label="Mobil menü" className="container-site flex-1 overflow-y-auto pt-6 pb-10">
          <ul className="space-y-1">
            {links.map((item, i) => (
              <li
                key={item.href}
                className={open ? "animate-page-in" : undefined}
                style={{ animationDelay: `${0.05 + i * 0.04}s` }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-baseline justify-between border-b border-night-line py-4 font-serif text-3xl"
                >
                  {item.label}
                  <span className="text-xs font-sans tracking-[0.2em] text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href="/randevu" size="lg" className="mt-10 w-full" onClick={onClose}>
            Randevu al
          </ButtonLink>
          <Link
            href="/panel"
            onClick={onClose}
            className="mt-6 block text-center text-sm text-muted underline-offset-4 hover:text-gold hover:underline"
          >
            Ofis paneli (demo)
          </Link>
        </nav>
      </div>
    </dialog>
  );
}
