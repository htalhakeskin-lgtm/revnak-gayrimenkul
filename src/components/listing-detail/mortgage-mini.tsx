"use client";

import Link from "next/link";
import { useState } from "react";
import { rates } from "@/data/rates";
import { loanSummary } from "@/lib/calc";
import { formatPrice } from "@/lib/format";

/** İlan detayında gömülü mini kredi hesaplayıcı (M18) */
export function MortgageMini({ price }: { price: number }) {
  const [downPct, setDownPct] = useState<number>(rates.defaultDownPaymentPct);
  const [months, setMonths] = useState<number>(rates.defaultTermMonths);
  const [rate, setRate] = useState<number>(rates.mortgageMonthlyRate);

  const result = loanSummary({ price, downPayment: (price * downPct) / 100, monthlyRatePct: rate, months });

  return (
    <div className="rounded-[20px] border border-line bg-raised p-6 md:p-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <label className="block">
            <span className="flex justify-between text-sm text-fg-muted">
              <span>Peşinat</span>
              <span className="tabular font-semibold text-fg">
                %{downPct} · {formatPrice((price * downPct) / 100)}
              </span>
            </span>
            <input
              type="range"
              min={10}
              max={90}
              step={5}
              value={downPct}
              onChange={(e) => setDownPct(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--tone-accent)]"
            />
          </label>
          <label className="block">
            <span className="text-sm text-fg-muted">Vade</span>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="mt-2 h-11 w-full rounded-xl border border-line bg-raised px-4 text-fg"
            >
              {rates.mortgageTerms.map((m) => (
                <option key={m} value={m}>
                  {m} ay ({m / 12} yıl)
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-fg-muted">Aylık faiz (%)</span>
            <input
              type="number"
              step={0.01}
              min={0}
              max={10}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
              className="mt-2 h-11 w-full rounded-xl border border-line bg-raised px-4 text-fg"
            />
          </label>
        </div>
        <div className="flex flex-col justify-between rounded-[14px] bg-fg/5 p-6">
          <div>
            <p className="text-sm text-fg-muted">Tahmini aylık taksit</p>
            <p className="tabular mt-1 font-serif text-4xl text-fg" aria-live="polite">
              {formatPrice(Math.round(result.monthly))}
            </p>
          </div>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-fg-muted">Kredi tutarı</dt>
              <dd className="tabular font-semibold text-fg">{formatPrice(Math.round(result.principal))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fg-muted">Toplam faiz</dt>
              <dd className="tabular font-semibold text-fg">{formatPrice(Math.round(result.totalInterest))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fg-muted">Toplam geri ödeme</dt>
              <dd className="tabular font-semibold text-fg">{formatPrice(Math.round(result.totalPayment))}</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="mt-6 text-xs leading-relaxed text-fg-muted">
        Örnek hesaplamadır; faiz oranı, kullandırım oranı ve masraflar bankaya ve güncel düzenlemelere göre değişir.{" "}
        <Link href="/hesaplayicilar" className="text-accent underline underline-offset-4">
          Tüm hesaplayıcılar
        </Link>
      </p>
    </div>
  );
}
