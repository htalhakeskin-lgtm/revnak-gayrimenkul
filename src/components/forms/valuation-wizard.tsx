"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LeadForm } from "./lead-form";

type RegionOption = { slug: string; name: string; district: string; avgPricePerM2: number };

const types = [
  { value: "daire", label: "Daire", factor: 1 },
  { value: "rezidans", label: "Rezidans", factor: 1 },
  { value: "villa", label: "Villa", factor: 1.15 },
  { value: "mustakil", label: "Müstakil ev", factor: 1.05 },
  { value: "yazlik", label: "Yazlık", factor: 1 },
];
const roomOptions = ["1+1", "2+1", "3+1", "4+1", "5+1 ve üzeri"];
const ages = [
  { value: "0-5", label: "0–5 yıl", factor: 1.08 },
  { value: "5-10", label: "5–10 yıl", factor: 1 },
  { value: "10-20", label: "10–20 yıl", factor: 0.93 },
  { value: "20-30", label: "20–30 yıl", factor: 0.86 },
  { value: "30+", label: "30 yıldan fazla", factor: 0.8 },
];
const conditions = [
  { value: "yeni", label: "Yeni / lüks yenilenmiş", factor: 1.05 },
  { value: "bakimli", label: "Bakımlı", factor: 1 },
  { value: "tadilat", label: "Tadilat gerekli", factor: 0.88 },
];

const STEPS = ["Konum", "Mülk tipi", "Büyüklük", "Durum", "İletişim"];

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}

/**
 * "Evimin değeri ne kadar?" sihirbazı (M09, üretimde F2).
 * Kaba ön tahmin bölge ortalamasından hesaplanır; nihai değerleme her zaman uzman tarafından yapılır (Bölüm 10, Faz 3 notu).
 */
export function ValuationWizard({ regions }: { regions: RegionOption[] }) {
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [region, setRegion] = useState(() => {
    const r = params.get("bolge");
    return regions.some((x) => x.slug === r) ? (r as string) : "";
  });
  const [type, setType] = useState("daire");
  const [m2, setM2] = useState(() => params.get("m2") ?? "");
  const [rooms, setRooms] = useState(() => {
    const o = params.get("oda");
    return o && roomOptions.includes(o) ? o : "3+1";
  });
  const [age, setAge] = useState("5-10");
  const [condition, setCondition] = useState("bakimli");

  const regionInfo = regions.find((r) => r.slug === region);
  const m2Number = Number(m2);

  const estimate = useMemo(() => {
    if (!regionInfo || !(m2Number >= 20)) return null;
    const base =
      regionInfo.avgPricePerM2 *
      m2Number *
      (types.find((t) => t.value === type)?.factor ?? 1) *
      (ages.find((a) => a.value === age)?.factor ?? 1) *
      (conditions.find((c) => c.value === condition)?.factor ?? 1);
    return { low: roundTo(base * 0.92, 100_000), high: roundTo(base * 1.08, 100_000) };
  }, [regionInfo, m2Number, type, age, condition]);

  const canNext = [Boolean(region), Boolean(type), m2Number >= 20 && m2Number <= 20_000, Boolean(age && condition), true][step];

  return (
    <div>
      {/* İlerleme */}
      <div className="mb-10">
        <ol className="flex justify-between text-xs font-semibold tracking-[0.1em] text-fg-muted uppercase">
          {STEPS.map((label, i) => (
            <li key={label} className={cn(i <= step && "text-accent", "hidden sm:block")} aria-current={i === step ? "step" : undefined}>
              {i + 1}. {label}
            </li>
          ))}
          <li className="sm:hidden">
            Adım {step + 1} / {STEPS.length}: {STEPS[step]}
          </li>
        </ol>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-fg/10">
          <div
            className="h-full origin-left rounded-full bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)]"
            style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }}
          />
        </div>
      </div>

      <div key={step} className="animate-page-in min-h-64">
        {step === 0 ? (
          <Question title="Mülkünüz hangi bölgede?">
            <div className="grid gap-2 sm:grid-cols-2">
              {regions.map((r) => (
                <Choice key={r.slug} active={region === r.slug} onClick={() => setRegion(r.slug)}>
                  <span className="font-semibold">{r.name}</span>
                  <span className="text-sm text-fg-muted"> · {r.district}</span>
                </Choice>
              ))}
            </div>
          </Question>
        ) : null}

        {step === 1 ? (
          <Question title="Mülk tipi nedir?">
            <div className="grid gap-2 sm:grid-cols-3">
              {types.map((t) => (
                <Choice key={t.value} active={type === t.value} onClick={() => setType(t.value)}>
                  {t.label}
                </Choice>
              ))}
            </div>
          </Question>
        ) : null}

        {step === 2 ? (
          <Question title="Büyüklüğü nedir?">
            <label className="block max-w-xs">
              <span className="text-sm text-fg-muted">Brüt metrekare</span>
              <input
                type="number"
                inputMode="numeric"
                min={20}
                value={m2}
                onChange={(e) => setM2(e.target.value)}
                placeholder="ör. 140"
                className="mt-2 h-14 w-full rounded-xl border border-line bg-raised px-4 text-2xl text-fg focus:border-accent focus:outline-none"
                autoFocus
              />
            </label>
            <p className="mt-8 mb-3 text-sm text-fg-muted">Oda sayısı</p>
            <div className="flex flex-wrap gap-2">
              {roomOptions.map((o) => (
                <Choice key={o} active={rooms === o} onClick={() => setRooms(o)} compact>
                  {o}
                </Choice>
              ))}
            </div>
          </Question>
        ) : null}

        {step === 3 ? (
          <Question title="Bina yaşı ve mülkün durumu">
            <div className="flex flex-wrap gap-2">
              {ages.map((a) => (
                <Choice key={a.value} active={age === a.value} onClick={() => setAge(a.value)} compact>
                  {a.label}
                </Choice>
              ))}
            </div>
            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {conditions.map((c) => (
                <Choice key={c.value} active={condition === c.value} onClick={() => setCondition(c.value)}>
                  {c.label}
                </Choice>
              ))}
            </div>
          </Question>
        ) : null}

        {step === 4 ? (
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="rounded-[20px] bg-ink p-6 text-ivory">
                <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">Kaba ön tahmin</p>
                {estimate ? (
                  <p className="tabular mt-3 font-serif text-3xl leading-tight">
                    {formatPrice(estimate.low)}
                    <br />– {formatPrice(estimate.high)}
                  </p>
                ) : (
                  <p className="mt-3 text-ivory/75">Tahmin için bölge ve metrekare gerekli.</p>
                )}
                <p className="mt-4 text-xs leading-relaxed text-ivory/65">
                  {regionInfo?.name} bölge ortalamasına ({regionInfo ? formatPrice(regionInfo.avgPricePerM2) : "–"} / m²) dayalı
                  kurgusal bir aralıktır. Nihai değerleme, uzmanımızın yerinde incelemesi ve benzer satışlarla yapılır.
                </p>
              </div>
            </div>
            <div className="lg:col-span-3">
              <LeadForm
                kind="degerleme"
                idPrefix="degerleme"
                submitLabel="Uzman değerlemesi iste"
                defaultMessage={`${regionInfo?.name ?? ""} · ${types.find((t) => t.value === type)?.label} · ${m2} m² · ${rooms}`}
                extraFields={
                  <>
                    <input type="hidden" name="region" value={region} />
                    <input type="hidden" name="propertyType" value={type} />
                    <input type="hidden" name="m2" value={m2} />
                    <input type="hidden" name="rooms" value={rooms} />
                    <input type="hidden" name="buildingAge" value={age} />
                    <input type="hidden" name="condition" value={condition} />
                  </>
                }
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft size={16} /> Geri
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            Devam <ArrowRight size={16} />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function Question({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-6 font-serif text-3xl">{title}</legend>
      {children}
    </fieldset>
  );
}

function Choice({
  active,
  onClick,
  children,
  compact = false,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-[14px] border text-left transition-colors",
        compact ? "px-5 py-3 font-semibold" : "p-4",
        active ? "border-accent bg-accent/10" : "border-line bg-raised hover:border-accent",
      )}
    >
      {children}
    </button>
  );
}
