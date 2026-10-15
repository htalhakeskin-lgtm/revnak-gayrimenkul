"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { propertyTypeLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

const priceSteps = {
  satilik: [
    { value: "20000000", label: "20 milyon ₺'ye kadar" },
    { value: "40000000", label: "40 milyon ₺'ye kadar" },
    { value: "75000000", label: "75 milyon ₺'ye kadar" },
    { value: "150000000", label: "150 milyon ₺'ye kadar" },
  ],
  kiralik: [
    { value: "50000", label: "50.000 ₺'ye kadar" },
    { value: "100000", label: "100.000 ₺'ye kadar" },
    { value: "200000", label: "200.000 ₺'ye kadar" },
    { value: "500000", label: "500.000 ₺'ye kadar" },
  ],
} as const;

type RegionOption = { slug: string; name: string; district: string };

/** Akıllı arama kutusu (Bölüm 6, sahne 1): Satılık/Kiralık sekmesi, konum, tip, fiyat */
export function HeroSearch({ regions }: { regions: RegionOption[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"satilik" | "kiralik">("satilik");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const key of ["bolge", "tip", "max"] as const) {
      const value = data.get(key);
      if (typeof value === "string" && value) params.set(key, value);
    }
    const qs = params.toString();
    router.push(`/ilanlar/${mode}${qs ? `?${qs}` : ""}`);
  }

  const selectClass =
    "h-12 w-full appearance-none rounded-xl bg-transparent pr-8 pl-0 text-[0.9375rem] text-ivory focus:outline-none [&>option]:bg-night-raised";

  return (
    <div className="max-w-4xl">
      <div role="tablist" aria-label="İşlem tipi" className="mb-3 inline-flex rounded-full bg-night/50 p-1 backdrop-blur-md">
        {(["satilik", "kiralik"] as const).map((key) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={mode === key}
            onClick={() => setMode(key)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
              mode === key ? "bg-ivory text-ink" : "text-ivory/75 hover:text-ivory",
            )}
          >
            {key === "satilik" ? "Satılık" : "Kiralık"}
          </button>
        ))}
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-px overflow-hidden rounded-[20px] border border-white/12 bg-white/10 backdrop-blur-xl md:grid-cols-[1.2fr_1fr_1fr_auto]"
      >
        <label className="flex flex-col bg-night/55 px-5 pt-3">
          <span className="text-[0.6875rem] font-semibold tracking-[0.16em] text-gold uppercase">Konum</span>
          <select name="bolge" className={selectClass} defaultValue="">
            <option value="">Tüm bölgeler</option>
            {regions.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}, {r.district}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col bg-night/55 px-5 pt-3">
          <span className="text-[0.6875rem] font-semibold tracking-[0.16em] text-gold uppercase">Mülk tipi</span>
          <select name="tip" className={selectClass} defaultValue="">
            <option value="">Tümü</option>
            {Object.entries(propertyTypeLabels)
              .filter(([key]) => key !== "yali" && key !== "arsa")
              .map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
          </select>
        </label>
        <label className="flex flex-col bg-night/55 px-5 pt-3">
          <span className="text-[0.6875rem] font-semibold tracking-[0.16em] text-gold uppercase">Bütçe</span>
          <select name="max" className={selectClass} defaultValue="" key={mode}>
            <option value="">Fark etmez</option>
            {priceSteps[mode].map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <div className="bg-night/55 p-2">
          <button
            type="submit"
            className="flex h-full min-h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-gold px-8 font-semibold text-night transition-colors hover:bg-[#d3b47f]"
          >
            <Search size={18} />
            İlanları gör
          </button>
        </div>
      </form>
    </div>
  );
}
