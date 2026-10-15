import { Fragment, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Başlığın kelime kelime açılması (Bölüm 4.5 · SplitText).
 * Saf CSS: JavaScript yüklenmeden çalışır, LCP'yi bekletmez.
 * "Hareketi azalt" açıkken sadece solma uygulanır (globals.css).
 * Satır kırmak için metinde "\n" kullanılır.
 */
export function SplitText({
  text,
  as: Tag = "h1",
  className,
  delay = 0,
  stagger = 0.06,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  let index = 0;
  return (
    <Tag className={className} aria-label={text.replace(/\n/g, " ")}>
      {text.split("\n").map((line, li) => {
        const words = line.split(" ");
        return (
          <span key={li} aria-hidden className="block">
            {words.map((word, wi) => {
              const i = index++;
              return (
                <Fragment key={wi}>
                  <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                    <span
                      className="split-word inline-block"
                      style={{ "--d": `${delay + i * stagger}s` } as CSSProperties}
                    >
                      {word}
                    </span>
                  </span>
                  {wi < words.length - 1 ? " " : null}
                </Fragment>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}

/** Basit sahne girişi (CSS): hero alt başlıkları, butonlar */
export function FadeUp({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={cn("animate-page-in", className)} style={{ animationDelay: `${delay}s` }}>
      {children}
    </Tag>
  );
}
