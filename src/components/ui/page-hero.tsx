import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { FadeUp, SplitText } from "@/components/motion/split-text";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Photo } from "./photo";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all = [{ name: "Ana sayfa", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Sayfa konumu" className={className}>
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-fg-muted">
          {all.map((item, i) => (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 ? <ChevronRight size={12} aria-hidden className="opacity-60" /> : null}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-fg/80">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="transition-colors hover:text-accent">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/** Koyu sayfa girişi: her iç sayfa bununla başlar; menü üstünde şeffaf kalır. */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageFocus,
  crumbs,
  children,
  size = "md",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  image?: string;
  imageFocus?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "tone-dark grain relative isolate overflow-hidden",
        size === "sm" && "pt-36 pb-12 md:pt-40 md:pb-14",
        size === "md" && "pt-40 pb-16 md:pt-48 md:pb-20",
        size === "lg" && "flex min-h-[78svh] flex-col justify-end pt-48 pb-16 md:pb-24",
        className,
      )}
    >
      {image ? (
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="animate-ken-burns absolute inset-0">
            <Photo
              src={image}
              alt=""
              fill
              preload
              fade={false}
              sizes="100vw"
              style={{ objectPosition: imageFocus }}
              className="object-cover"
            />
          </div>
          <div className="fade-to-night absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-night/80 via-night/40 to-transparent" />
        </div>
      ) : null}
      <div className="container-site">
        {crumbs ? (
          <FadeUp>
            <Breadcrumbs items={crumbs} className="mb-8" />
          </FadeUp>
        ) : null}
        {eyebrow ? (
          <FadeUp delay={0.05}>
            <p className="eyebrow mb-5">{eyebrow}</p>
          </FadeUp>
        ) : null}
        <SplitText text={title} className={cn("max-w-4xl", size === "lg" ? "text-display" : "text-h1")} delay={0.1} />
        {description ? (
          <FadeUp delay={0.45}>
            <div className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/75 md:text-lg">{description}</div>
          </FadeUp>
        ) : null}
        {children ? <FadeUp delay={0.6}>{children}</FadeUp> : null}
      </div>
    </section>
  );
}
