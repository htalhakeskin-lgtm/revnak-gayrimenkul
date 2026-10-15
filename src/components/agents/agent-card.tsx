import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { ContactButton } from "@/components/contact/contact-actions";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { Photo } from "@/components/ui/photo";
import type { Agent } from "@/data/types";

/** Danışman kartı (M11). Hover'da iletişim butonları açılır (Bölüm 6, sahne 10). */
export function AgentCard({ agent }: { agent: Agent }) {
  const actions = [
    {
      label: "WhatsApp",
      Icon: WhatsAppIcon,
      action: {
        channel: "whatsapp" as const,
        target: agent.whatsappE164,
        display: agent.phoneDisplay,
        name: agent.name,
        agentSlug: agent.slug,
        message: `Merhaba, web sitenizden ulaşıyorum. ${agent.name} ile görüşmek istiyorum.`,
      },
    },
    {
      label: "Ara",
      Icon: Phone,
      action: {
        channel: "telefon" as const,
        target: agent.whatsappE164,
        display: agent.phoneDisplay,
        name: agent.name,
        agentSlug: agent.slug,
      },
    },
    {
      label: "E-posta",
      Icon: Mail,
      action: {
        channel: "eposta" as const,
        target: agent.email,
        display: agent.email,
        name: agent.name,
        agentSlug: agent.slug,
      },
    },
  ];

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-image)] bg-night-raised">
        <Link href={`/danisman/${agent.slug}`} aria-label={`${agent.name} profilini aç`}>
          <Photo
            src={agent.photo}
            alt={agent.name}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-transparent" />
        </Link>
        <div className="absolute inset-x-4 bottom-4 flex justify-center gap-2 md:translate-y-3 md:opacity-0 md:transition-[opacity,transform] md:duration-500 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          {actions.map(({ label, Icon, action }) => (
            <ContactButton
              key={label}
              action={action}
              className="grid size-11 place-items-center rounded-full bg-ivory text-ink transition-transform hover:scale-110"
              aria-label={`${agent.name} · ${label}`}
            >
              <Icon size={18} />
            </ContactButton>
          ))}
        </div>
      </div>
      <Link href={`/danisman/${agent.slug}`} className="mt-5 block">
        <h3 className="font-serif text-2xl text-fg group-hover:text-accent">{agent.name}</h3>
        <p className="mt-1 text-sm text-fg-muted">{agent.title}</p>
      </Link>
    </article>
  );
}
