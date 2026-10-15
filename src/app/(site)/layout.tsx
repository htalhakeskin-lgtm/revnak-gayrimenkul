import type { ReactNode } from "react";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { MobileActionBar, WhatsAppFab } from "@/components/layout/floating-actions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#icerik"
        className="sr-only z-[60] rounded-full bg-gold px-5 py-3 font-semibold text-night focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        İçeriğe geç
      </a>
      <SiteHeader />
      <main id="icerik">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
      <MobileActionBar />
      <CookieConsent />
      <SmoothScroll />
    </>
  );
}
