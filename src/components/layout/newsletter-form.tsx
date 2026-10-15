"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

/** E-bülten (M25, üretimde F2). Demoda gönderim yapılmaz. */
export function NewsletterForm() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="flex items-center gap-3 text-sm text-ivory md:justify-end" role="status">
        <Check size={18} className="text-gold" /> Teşekkürler! Demo modunda abonelik kaydı tutulmaz.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-3 md:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <div className="flex w-full max-w-md rounded-full border border-night-line bg-night-raised p-1.5 focus-within:border-gold">
        <label htmlFor="newsletter-email" className="sr-only">
          E-posta adresiniz
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder="E-posta adresiniz"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ivory placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-gold text-night transition-transform hover:scale-105"
          aria-label="Bültene abone ol"
        >
          <ArrowRight size={18} />
        </button>
      </div>
      <label className="flex max-w-md items-start gap-2 text-xs text-muted">
        <input type="checkbox" required className="mt-0.5 accent-[var(--color-gold)]" />
        <span>Ticari elektronik ileti almayı kabul ediyorum (İYS).</span>
      </label>
    </form>
  );
}
