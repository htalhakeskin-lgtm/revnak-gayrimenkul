import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { ContactButton } from "@/components/contact/contact-actions";
import { InstagramIcon, LinkedInIcon, YouTubeIcon } from "@/components/ui/brand-icons";
import { footerNav, legalNav, siteConfig } from "@/lib/site-config";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";

export function SiteFooter() {
  const { contact } = siteConfig;
  return (
    <footer className="tone-dark grain relative border-t border-night-line pb-28 md:pb-0">
      <div className="container-site grid gap-14 py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{siteConfig.description}</p>
          <div className="mt-8 flex gap-2">
            {[
              { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
              { href: siteConfig.social.youtube, label: "YouTube", Icon: YouTubeIcon },
              { href: siteConfig.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
            ]
              .filter((s): s is typeof s & { href: string } => Boolean(s.href))
              .map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full border border-night-line text-muted transition-colors hover:border-gold hover:text-gold"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5">
          {footerNav.map((group) => (
            <div key={group.title}>
              <p className="eyebrow">{group.title}</p>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ivory/80 transition-colors hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3">
          <p className="eyebrow">İletişim</p>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3 text-ivory/80">
              <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
              <span>
                {contact.addressLine}
                <br />
                {contact.district} / {contact.city}
              </span>
            </li>
            <li>
              <ContactButton
                action={{ channel: "telefon", target: contact.phoneE164, display: contact.phoneDisplay }}
                className="flex gap-3 text-ivory/80 transition-colors hover:text-gold"
              >
                <Phone size={18} className="shrink-0 text-gold" />
                {contact.phoneDisplay}
              </ContactButton>
            </li>
            <li>
              <ContactButton
                action={{ channel: "eposta", target: contact.email, display: contact.email }}
                className="flex gap-3 text-ivory/80 transition-colors hover:text-gold"
              >
                <Mail size={18} className="shrink-0 text-gold" />
                {contact.email}
              </ContactButton>
            </li>
          </ul>
          <ul className="mt-6 space-y-1.5 text-xs text-muted">
            {siteConfig.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span className="tabular">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-site">
        <div className="grid gap-8 border-t border-night-line py-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-serif text-2xl">Yeni ilanlar ve piyasa notları, ayda bir.</p>
            <p className="mt-2 text-sm text-muted">Bülten aboneliği açık rızanıza bağlıdır; dilediğiniz an ayrılabilirsiniz.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-night-line">
        <div className="container-site flex flex-col gap-4 py-8 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {siteConfig.founded}–2026 {siteConfig.legalName} · Taşınmaz Ticareti Yetki Belgesi No:{" "}
            <span className="tabular text-ivory/80">{siteConfig.licenseNo}</span>
            {siteConfig.demo ? " (örnek)" : ""}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/panel" className="inline-flex items-center gap-1 hover:text-gold">
                Ofis paneli (demo) <ArrowUpRight size={12} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
