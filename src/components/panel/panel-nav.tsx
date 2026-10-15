"use client";

import { ArrowUpRight, CalendarDays, Home, Inbox, Kanban, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/layout/logo";
import { leadsStore } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

const items = [
  { href: "/panel", label: "Pano", Icon: LayoutDashboard },
  { href: "/panel/ilanlar", label: "İlanlar", Icon: Home },
  { href: "/panel/crm", label: "CRM hunisi", Icon: Kanban },
  { href: "/panel/randevular", label: "Randevular", Icon: CalendarDays },
  { href: "/panel/talepler", label: "Gelen talepler", Icon: Inbox },
];

export function PanelNav() {
  return (
    <Suspense fallback={<NavList pathname="" />}>
      <NavWithPath />
    </Suspense>
  );
}

function NavWithPath() {
  return <NavList pathname={usePathname()} />;
}

function NavList({ pathname }: { pathname: string }) {
  const localLeads = leadsStore.use();
  return (
    <div className="tone-dark flex h-full flex-col bg-night lg:min-h-dvh">
      <div className="flex items-center justify-between px-5 py-5 lg:px-6 lg:py-7">
        <Link href="/panel" aria-label="Panel ana sayfa">
          <Logo />
        </Link>
        <span className="rounded-full bg-gold px-2.5 py-0.5 text-[0.625rem] font-bold tracking-wider text-night uppercase lg:hidden">
          Demo
        </span>
      </div>
      <nav aria-label="Panel menüsü" className="overflow-x-auto px-3 pb-3 lg:flex-1 lg:overflow-visible lg:pb-0">
        <ul className="flex gap-1 lg:flex-col">
          {items.map(({ href, label, Icon }) => {
            const active = href === "/panel" ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                    active ? "bg-white/10 text-ivory" : "text-muted hover:bg-white/5 hover:text-ivory",
                  )}
                >
                  <Icon size={18} className={active ? "text-gold" : undefined} />
                  {label}
                  {href === "/panel/talepler" && localLeads.length > 0 ? (
                    <span className="ml-auto rounded-full bg-gold px-1.5 text-[0.6875rem] font-bold text-night">{localLeads.length}</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="hidden space-y-4 border-t border-night-line p-6 lg:block">
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
