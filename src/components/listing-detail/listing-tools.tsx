"use client";

import { Check, GitCompare, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { compareStore, COMPARE_LIMIT, toggleCompare } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

/** Karşılaştırmaya ekle (en fazla 4 ilan, M08) */
export function CompareButton({ slug }: { slug: string }) {
  const compare = compareStore.use();
  const active = compare.includes(slug);
  const [full, setFull] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-pressed={active}
        onClick={() => setFull(!toggleCompare(slug))}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors",
          active ? "border-accent text-accent" : "border-line text-fg hover:border-accent",
        )}
      >
        {active ? <Check size={18} /> : <GitCompare size={18} />}
        {active ? "Karşılaştırmada" : "Karşılaştır"}
      </button>
      {active && compare.length > 1 ? (
        <Link href="/karsilastir" className="absolute top-full left-0 mt-2 text-xs font-semibold whitespace-nowrap text-accent underline underline-offset-4">
          {compare.length} ilanı karşılaştır →
        </Link>
      ) : null}
      {full ? (
        <p role="alert" className="absolute top-full left-0 mt-2 w-56 text-xs text-danger">
          En fazla {COMPARE_LIMIT} ilan karşılaştırabilirsiniz.{" "}
          <Link href="/karsilastir" className="underline">
            Listeyi düzenle
          </Link>
        </p>
      ) : null}
    </div>
  );
}

export function ShareButton({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const url = `${window.location.origin}${path}`;
        try {
          if (navigator.share) {
            await navigator.share({ title, url });
            return;
          }
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          // Kullanıcı paylaşımı iptal etti
        }
      }}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-fg transition-colors hover:border-accent"
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      {copied ? "Bağlantı kopyalandı" : "Paylaş"}
    </button>
  );
}
