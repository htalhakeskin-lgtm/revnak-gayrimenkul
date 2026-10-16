"use client";

import { Banknote, Calculator, Landmark } from "lucide-react";
import { useState, type ReactNode } from "react";
import { rates } from "@/data/rates";
import { deedCosts, loanSummary, rentalYield } from "@/lib/calc";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type Tab = "kredi" | "tapu" | "kira";

const tabs: { key: Tab; label: string; Icon: typeof Calculator }[] = [
  { key: "kredi", label: "Konut kredisi", Icon: Landmark },
  { key: "tapu", label: "Tapu ve masraflar", Icon: Calculator },
  { key: "kira", label: "Kira getirisi", Icon: Banknote },
];

/** Hesaplayıcılar (M18). Oranlar src/data/rates.ts'den gelir (üretimde admin ayarı). */
export function Calculators() {
  const [tab, setTab] = useState<Tab>("kredi");
  return (
    <div>
      <div role="tablist" aria-label="Hesaplayıcılar" className="flex flex-wrap gap-2">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            role="tab"
            id={`tab-${key}`}
            aria-selected={tab === key}
            aria-controls={`panel-${key}`}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors",
              tab === key ? "border-ink bg-ink text-ivory" : "border-line bg-raised hover:border-accent",
            )}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-8">
        {tab === "kredi" ? <LoanCalc /> : tab === "tapu" ? <DeedCalc /> : <RentCalc />}
      </div>
      <p className="mt-6 text-xs text-fg-muted">
        Örnek oranlar ({formatDate(rates.updatedAt)} itibarıyla, demo). Kesin rakamlar için bankanıza, tapu müdürlüğüne ve
        mali müşavirinize danışın.
      </p>
    </div>
  );
}

function Layout({ inputs, results }: { inputs: ReactNode; results: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-6 rounded-[20px] border border-line bg-raised p-6 md:p-8 lg:col-span-3">{inputs}</div>
      <div className="rounded-[20px] bg-ink p-6 text-ivory md:p-8 lg:col-span-2" aria-live="polite">
        {results}
      </div>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  suffix,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-fg-muted">{label}</span>
      <span className="mt-2 flex h-12 items-center rounded-xl border border-line bg-raised px-4 focus-within:border-accent">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="tabular w-full bg-transparent text-lg text-fg focus:outline-none"
        />
        {suffix ? <span className="text-sm text-fg-muted">{suffix}</span> : null}
      </span>
      {hint || suffix === "₺" ? (
        <span className="tabular mt-1 block text-xs text-fg-muted">
          {suffix === "₺" ? formatPrice(value) : null}
          {suffix === "₺" && hint ? " · " : null}
          {hint}
        </span>
      ) : null}
    </label>
  );
}

function ResultRow({ label, value, big = false }: { label: string; value: string; big?: boolean }) {
  return big ? (
    <div>
      <p className="text-sm text-ivory/70">{label}</p>
      <p className="tabular mt-1 font-serif text-4xl">{value}</p>
    </div>
  ) : (
    <div className="flex justify-between gap-4 border-t border-white/10 py-3 text-sm">
      <span className="text-ivory/70">{label}</span>
      <span className="tabular font-semibold">{value}</span>
    </div>
  );
}

function LoanCalc() {
  const [price, setPrice] = useState(20_000_000);
  const [down, setDown] = useState(10_000_000);
  const [rate, setRate] = useState<number>(rates.mortgageMonthlyRate);
  const [months, setMonths] = useState<number>(rates.defaultTermMonths);
  const r = loanSummary({ price, downPayment: down, monthlyRatePct: rate, months });

  return (
    <Layout
      inputs={
        <>
          <NumberInput label="Konut fiyatı" value={price} onChange={setPrice} suffix="₺" step={100_000} />
          <NumberInput label="Peşinat" value={down} onChange={setDown} suffix="₺" step={100_000} hint={`%${price ? Math.round((down / price) * 100) : 0}`} />
          <div className="grid gap-6 sm:grid-cols-2">
            <NumberInput label="Aylık faiz" value={rate} onChange={setRate} suffix="%" step={0.01} />
            <label className="block">
              <span className="text-sm text-fg-muted">Vade</span>
              <select
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="mt-2 h-12 w-full rounded-xl border border-line bg-raised px-4 text-fg"
              >
                {rates.mortgageTerms.map((m) => (
                  <option key={m} value={m}>
                    {m} ay
                  </option>
                ))}
              </select>
            </label>
          </div>
        </>
      }
      results={
        <>
          <ResultRow big label="Aylık taksit" value={formatPrice(Math.round(r.monthly))} />
          <div className="mt-8">
            <ResultRow label="Kredi tutarı" value={formatPrice(Math.round(r.principal))} />
            <ResultRow label="Toplam faiz" value={formatPrice(Math.round(r.totalInterest))} />
            <ResultRow label="Toplam geri ödeme" value={formatPrice(Math.round(r.totalPayment))} />
          </div>
        </>
      }
    />
  );
}

function DeedCalc() {
  const [price, setPrice] = useState(20_000_000);
  const [withFee, setWithFee] = useState(true);
  const r = deedCosts({
    price,
    buyerPct: rates.deedTaxBuyerPct,
    sellerPct: rates.deedTaxSellerPct,
    revolvingFundFee: rates.revolvingFundFee,
    serviceFeePct: rates.serviceFeePct,
    vatPct: rates.vatPct,
    includeServiceFee: withFee,
  });
  return (
    <Layout
      inputs={
        <>
          <NumberInput
            label="Tapuda beyan edilecek satış bedeli"
            value={price}
            onChange={setPrice}
            suffix="₺"
            step={100_000}
            hint="Beyan edilen bedel, emlak vergisi değerinin altında olamaz."
          />
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={withFee} onChange={(e) => setWithFee(e.target.checked)} className="size-4 accent-[var(--tone-accent)]" />
            Emlak danışmanlığı hizmet bedelini dahil et (üst sınır %{rates.serviceFeePct} + KDV)
          </label>
          <p className="text-sm leading-relaxed text-fg-muted">
            Genel uygulamada tapu harcı alıcı ve satıcı için ayrı ayrı %{rates.deedTaxBuyerPct}’dir. Taraflar farklı bir paylaşım
            kararlaştırabilir.
          </p>
        </>
      }
      results={
        <>
          <ResultRow big label="Alıcının toplam masrafı" value={formatPrice(Math.round(r.buyerTotal))} />
          <div className="mt-8">
            <ResultRow label={`Tapu harcı (alıcı %${rates.deedTaxBuyerPct})`} value={formatPrice(Math.round(r.buyerTax))} />
            <ResultRow label="Döner sermaye (yaklaşık)" value={formatPrice(r.revolvingFundFee)} />
            {withFee ? <ResultRow label="Hizmet bedeli" value={formatPrice(Math.round(r.serviceFee))} /> : null}
            {withFee ? <ResultRow label={`KDV (%${rates.vatPct})`} value={formatPrice(Math.round(r.serviceVat))} /> : null}
            <ResultRow label={`Satıcının tapu harcı (%${rates.deedTaxSellerPct})`} value={formatPrice(Math.round(r.sellerTax))} />
          </div>
        </>
      }
    />
  );
}

function RentCalc() {
  const [price, setPrice] = useState(15_750_000);
  const [rent, setRent] = useState(48_000);
  const [expenses, setExpenses] = useState(60_000);
  const [vacancy, setVacancy] = useState(1);
  const r = rentalYield({ price, monthlyRent: rent, annualExpenses: expenses, vacancyMonths: vacancy });
  const pct = (v: number) => `%${v.toFixed(2).replace(".", ",")}`;
  return (
    <Layout
      inputs={
        <>
          <NumberInput label="Satın alma fiyatı" value={price} onChange={setPrice} suffix="₺" step={100_000} />
          <NumberInput label="Aylık kira" value={rent} onChange={setRent} suffix="₺" step={1_000} />
          <div className="grid gap-6 sm:grid-cols-2">
            <NumberInput label="Yıllık giderler" value={expenses} onChange={setExpenses} suffix="₺" step={1_000} hint="Bakım, sigorta, vergi" />
            <NumberInput label="Boş kalınan ay / yıl" value={vacancy} onChange={(v) => setVacancy(Math.min(12, v))} step={1} />
          </div>
        </>
      }
      results={
        <>
          <ResultRow big label="Net kira getirisi" value={pct(r.netYieldPct)} />
          <div className="mt-8">
            <ResultRow label="Brüt kira getirisi" value={pct(r.grossYieldPct)} />
            <ResultRow label="Yıllık net gelir" value={formatPrice(Math.round(r.netAnnual))} />
            <ResultRow
              label="Amortisman süresi"
              value={Number.isFinite(r.paybackYears) ? `${r.paybackYears.toFixed(1).replace(".", ",")} yıl` : "–"}
            />
          </div>
        </>
      }
    />
  );
}
