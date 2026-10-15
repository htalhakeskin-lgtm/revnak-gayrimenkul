"use client";

import { CalendarDays, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useContactAction } from "@/components/contact/contact-actions";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { siteConfig } from "@/lib/site-config";

function isBusinessHours(now: Date) {
  // Türkiye saati (UTC+3, yaz saati uygulaması yok)
  const tr = new Date(now.getTime() + (now.getTimezoneOffset() + 180) * 60_000);
  const day = tr.getDay();
  const hour = tr.getHours() + tr.getMinutes() / 60;
  const { weekdays, saturday } = siteConfig.businessHours;
  if (day >= 1 && day <= 5) return hour >= weekdays[0] && hour < weekdays[1];
  if (day === 6) return hour >= saturday[0] && hour < saturday[1];
  return false;
}

const officeWhatsApp = {
  channel: "whatsapp" as const,
  target: siteConfig.contact.whatsappE164,
  display: "Ofis WhatsApp hattı",
  message: "Merhaba, web sitenizden ulaşıyorum. Bilgi almak istiyorum.",
};

/** Masaüstü: yüzen WhatsApp butonu (M06). Mesai dışında not gösterir. */
export function WhatsAppFab() {
  const open = useContactAction();
  const [afterHours, setAfterHours] = useState(false);

  useEffect(() => {
    const check = () => setAfterHours(!isBusinessHours(new Date()));
    check();
    const id = window.setInterval(check, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="group fixed right-6 bottom-6 z-40 hidden md:block">
      <div className="pointer-events-none absolute right-0 bottom-full mb-3 w-64 translate-y-2 rounded-[14px] border border-night-line bg-night-raised p-4 text-sm text-ivory opacity-0 shadow-2xl transition-[opacity,transform] duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="font-semibold">WhatsApp ile yazın</p>
        <p className="mt-1 text-muted">
          {afterHours
            ? "Şu an mesai dışındayız; mesajınıza en kısa sürede dönüş yapacağız."
            : "Danışmanlarımız genellikle birkaç dakika içinde yanıt verir."}
        </p>
      </div>
      <button
        type="button"
        onClick={() => open(officeWhatsApp)}
        className="relative grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_32px_rgb(37_211_102/0.35)] transition-transform duration-300 hover:scale-105"
        aria-label="WhatsApp ile yazın"
      >
        <span aria-hidden className="animate-pulse-ring absolute inset-0 rounded-full bg-[#25d366]" />
        <WhatsAppIcon size={26} className="relative" />
      </button>
    </div>
  );
}

/** Mobil alt aksiyon çubuğu: Ara · WhatsApp · Randevu (Bölüm 5) */
export function MobileActionBar() {
  const open = useContactAction();
  return (
    <nav
      aria-label="Hızlı iletişim"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-3 text-[0.6875rem] font-semibold tracking-wide text-ivory">
        <button
          type="button"
          onClick={() =>
            open({
              channel: "telefon",
              target: siteConfig.contact.phoneE164,
              display: siteConfig.contact.phoneDisplay,
            })
          }
          className="flex flex-col items-center gap-1 py-3"
        >
          <Phone size={20} className="text-gold" />
          Ara
        </button>
        <button
          type="button"
          onClick={() => open(officeWhatsApp)}
          className="flex flex-col items-center gap-1 border-x border-white/10 py-3"
        >
          <WhatsAppIcon size={20} className="text-[#25d366]" />
          WhatsApp
        </button>
        <Link href="/randevu" className="flex flex-col items-center gap-1 py-3">
          <CalendarDays size={20} className="text-gold" />
          Randevu
        </Link>
      </div>
    </nav>
  );
}
