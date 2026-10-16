"use client";

import { ArrowUpRight, CalendarDays, Home, Inbox, Kanban, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/layout/logo";
import { leadsStore } from "@/lib/demo-store";
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
export function PanelNav() {
  return (
    <Suspense fallback={<SideNav pathname="" />}>
      <SideNavWithPath />
    </Suspense>
  );
}

/** Mobil: uygulama benzeri alt sekme çubuğu */
export function PanelTabBar() {
  return (
    <Suspense fallback={<TabBar pathname="" />}>
      <TabBarWithPath />
    </Suspense>
  );
}

function SideNavWithPath() {
  return <SideNav pathname={usePathname()} />;
}

function TabBarWithPath() {
  return <TabBar pathname={usePathname()} />;
}

function LeadCount({ className }: { className?: string }) {
  const localLeads = leadsStore.use();
  if (localLeads.length === 0) return null;
  return (
    <span className={cn("rounded-full bg-gold px-1.5 text-[0.6875rem] leading-4 font-bold text-night", className)}>
      {localLeads.length}
    </span>
  );
}

function SideNav({ pathname }: { pathname: string }) {
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
                  {href === "/panel/talepler" ? <LeadCount className="ml-auto" /> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="space-y-4 border-t border-night-line p-6">
        <div className="rounded-xl bg-white/5 p-4 text-xs leading-relaxed text-muted">
          <strong className="text-gold">Demo panel.</strong> Gerçek sürümde Payload CMS içinde rol bazlı erişimle çalışır.
        </div>
        <Link href="/" className="flex items-center gap-2 text-sm text-muted hover:text-gold">
          Siteye dön <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function TabBar({ pathname }: { pathname: string }) {
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
                {href === "/panel/talepler" ? <LeadCount className="absolute top-1.5 left-1/2 ml-2" /> : null}
                {active ? <span aria-hidden className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-gold" /> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
