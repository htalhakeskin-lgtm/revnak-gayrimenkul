"use client";

import { Check, Copy, Info, Mail, Phone } from "lucide-react";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { Dialog } from "@/components/ui/dialog";
import { clicksStore, newId } from "@/lib/demo-store";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export type ContactChannel = "whatsapp" | "telefon" | "eposta";

export interface ContactAction {
  channel: ContactChannel;
  /** WhatsApp/telefon için E.164 (90 ile başlayan), e-posta için adres */
  target: string;
  display: string;
  name?: string;
  message?: string;
  listingNo?: string;
  agentSlug?: string;
}

export function contactHref(a: ContactAction) {
  switch (a.channel) {
    case "whatsapp":
      return `https://wa.me/${a.target}${a.message ? `?text=${encodeURIComponent(a.message)}` : ""}`;
    case "telefon":
      return `tel:+${a.target.replace(/^\+/, "")}`;
    case "eposta":
      return `mailto:${a.target}${a.message ? `?subject=${encodeURIComponent(a.message)}` : ""}`;
  }
}

const ContactContext = createContext<(action: ContactAction) => void>(() => {});

export function useContactAction() {
  return useContext(ContactContext);
}

const channelMeta = {
  whatsapp: { label: "WhatsApp", verb: "WhatsApp sohbeti açılır", icon: WhatsAppIcon },
  telefon: { label: "Telefon", verb: "telefon araması başlar", icon: Phone },
  eposta: { label: "E-posta", verb: "e-posta uygulaması açılır", icon: Mail },
} as const;

/**
 * İletişim eylemleri (M06). Her tıklama "ilgi" olarak kaydedilir.
 * WhatsApp ve telefon gerçek ofis hattına gider (K18); diğer kanallar demo penceresi açar (K15).
 */
export function ContactActionProvider({ children }: { children: ReactNode }) {
  const [action, setAction] = useState<ContactAction | null>(null);
  const [copied, setCopied] = useState(false);

  const open = useCallback((a: ContactAction) => {
    clicksStore.set((prev) =>
      [
        {
          id: newId(),
          channel: a.channel,
          listingNo: a.listingNo,
          agentSlug: a.agentSlug,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 50),
    );
    if (!siteConfig.demo || siteConfig.liveChannels.includes(a.channel)) {
      const href = contactHref(a);
      if (a.channel === "whatsapp") window.open(href, "_blank", "noopener,noreferrer");
      else window.location.href = href;
      return;
    }
    setCopied(false);
    setAction(a);
  }, []);

  const meta = action ? channelMeta[action.channel] : null;

  return (
    <ContactContext.Provider value={open}>
      {children}
      <Dialog
        open={action !== null}
        onClose={() => setAction(null)}
        title={meta ? `${meta.label} · Demo` : ""}
        description="Bu bir gösterim sitesidir; gerçek bir kişiye bağlanmazsınız."
      >
        {action && meta ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-[14px] border border-night-line bg-night p-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold text-night">
                <meta.icon size={22} />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-muted">Gerçek sitede {meta.verb}:</p>
                <p className="truncate font-semibold">
                  {action.display}
                  {action.name ? <span className="font-normal text-muted"> · {action.name}</span> : null}
                </p>
              </div>
            </div>

            {action.message ? (
              <div>
                <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                  Hazır mesaj
                </p>
                <div className="rounded-[14px] bg-[#1f3b2f] p-4 text-sm leading-relaxed text-ivory">
                  {action.message}
                </div>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center gap-2 text-sm text-gold hover:underline"
                  onClick={() => {
                    navigator.clipboard
                      ?.writeText(action.message ?? "")
                      .then(() => setCopied(true))
                      .catch(() => setCopied(false));
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Kopyalandı" : "Mesajı kopyala"}
                </button>
              </div>
            ) : null}

            <p className="flex gap-3 text-sm leading-relaxed text-muted">
              <Info size={18} className="mt-0.5 shrink-0 text-gold" />
              <span>
                Bu tıklama müşteri ilişkileri sistemine{" "}
                <strong className="text-ivory">
                  “{meta.label} ilgisi{action.listingNo ? ` · ${action.listingNo}` : ""}”
                </strong>{" "}
                olarak kaydedildi.{" "}
                <Link href="/panel/talepler" className="text-gold underline underline-offset-4">
                  Ofis panelinde görün
                </Link>
                .
              </span>
            </p>
          </div>
        ) : null}
      </Dialog>
    </ContactContext.Provider>
  );
}

/** Sunucu bileşenlerinden kullanılabilen iletişim butonu */
export function ContactButton({
  action,
  className,
  children,
  ...props
}: Omit<ComponentProps<"button">, "onClick" | "type"> & { action: ContactAction }) {
  const open = useContactAction();
  return (
    <button type="button" className={cn(className)} onClick={() => open(action)} {...props}>
      {children}
    </button>
  );
}
