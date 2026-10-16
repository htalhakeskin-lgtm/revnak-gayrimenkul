"use client";

import { ArrowUpRight, CalendarDays, Home, Inbox, Kanban, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { Logo } from "@/components/layout/logo";
import { panelLogout } from "@/app/panel/giris/actions";
import { cn } from "@/lib/utils";

const items = [
  { href: "/panel", label: "Pano", short: "Pano", Icon: LayoutDashboard },
  { href: "/panel/ilanlar", label: "İlanlar", short: "İlanlar", Icon: Home },
  { href: "/panel/crm", label: "CRM hunisi", short: "CRM", Icon: Kanban },
  { href: "/panel/randevular", label: "Randevular", short: "Takvim", Icon: CalendarDays },
  { href: "/panel/talepler", label: "Gelen talepler", short: "Talepler", Icon: Inbox },
];

const isActive = (pathname: string, href: string) => (href === "/panel" ? pathname === href : pathname.startsWith(href));

/** Masaüstü: kenar menü. Mobilde gizlidir; yerine alt sekme çubuğu (PanelTabBar) kullanılır. */
export function PanelNav({ leadBadge }: { leadBadge?: ReactNode }) {
  return (
    <Suspense fallback={<SideNav pathname="" leadBadge={leadBadge} />}>
      <SideNavWithPath leadBadge={leadBadge} />
    </Suspense>
  );
}

/** Mobil: uygulama benzeri alt sekme çubuğu */
export function PanelTabBar({ leadBadge }: { leadBadge?: ReactNode }) {
  return (
    <Suspense fallback={<TabBar pathname="" leadBadge={leadBadge} />}>
      <TabBarWithPath leadBadge={leadBadge} />
    </Suspense>
  );
}

function SideNavWithPath({ leadBadge }: { leadBadge?: ReactNode }) {
  return <SideNav pathname={usePathname()} leadBadge={leadBadge} />;
}

function TabBarWithPath({ leadBadge }: { leadBadge?: ReactNode }) {
  return <TabBar pathname={usePathname()} leadBadge={leadBadge} />;
}

function SideNav({ pathname, leadBadge }: { pathname: string; leadBadge?: ReactNode }) {
  return (
    <div className="tone-dark flex h-full min-h-dvh flex-col bg-night">
      <div className="px-6 py-7">
        <Link href="/panel" aria-label="Panel ana sayfa">
          <Logo />
        </Link>
      </div>
      <nav aria-label="Panel menüsü" className="flex-1 px-3">
        <ul className="flex flex-col gap-1">
          {items.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-white/10 text-ivory" : "text-muted hover:bg-white/5 hover:text-ivory",
                  )}
                >
                  <Icon size={18} className={active ? "text-gold" : undefined} />
                  {label}
                  {href === "/panel/talepler" ? leadBadge : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="space-y-4 border-t border-night-line p-6">
        <div className="rounded-xl bg-white/5 p-4 text-xs leading-relaxed text-muted">
          <strong className="text-gold">Gelen talepler ve randevular gerçektir</strong> (veritabanında saklanır).
          İlan ve CRM verisi hâlâ örnektir.
        </div>
        <Link href="/" className="flex items-center gap-2 text-sm text-muted hover:text-gold">
          Siteye dön <ArrowUpRight size={14} />
        </Link>
        <form action={panelLogout}>
          <button type="submit" className="flex items-center gap-2 text-sm text-muted hover:text-gold">
            <LogOut size={14} /> Çıkış yap
          </button>
        </form>
      </div>
    </div>
  );
}

function TabBar({ pathname, leadBadge }: { pathname: string; leadBadge?: ReactNode }) {
  return (
    <nav
      aria-label="Panel menüsü"
      className="tone-dark fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, short, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-1 py-2.5 text-[0.6875rem] font-semibold",
                  active ? "text-ivory" : "text-muted",
                )}
              >
                <Icon size={20} className={active ? "text-gold" : undefined} />
                {short}
                {href === "/panel/talepler" ? leadBadge : null}
                {active ? <span aria-hidden className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-gold" /> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
