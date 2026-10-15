/** Hesaplayıcılar (M18). Saf fonksiyonlar; birim testleri tests/calc.test.ts */

export interface LoanInput {
  price: number;
  downPayment: number;
  /** Aylık faiz oranı, yüzde (ör. 2.49) */
  monthlyRatePct: number;
  months: number;
}

export interface LoanResult {
  principal: number;
  monthly: number;
  totalPayment: number;
  totalInterest: number;
}

/** Eşit taksitli (annüite) kredi ödemesi */
export function monthlyPayment(principal: number, monthlyRatePct: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;
  const r = monthlyRatePct / 100;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export function loanSummary({ price, downPayment, monthlyRatePct, months }: LoanInput): LoanResult {
  const principal = Math.max(0, price - Math.min(downPayment, price));
  const monthly = monthlyPayment(principal, monthlyRatePct, months);
  const totalPayment = monthly * months;
  return {
    principal,
    monthly,
    totalPayment,
    totalInterest: Math.max(0, totalPayment - principal),
  };
}

export interface DeedCostInput {
  price: number;
  buyerPct: number;
  sellerPct: number;
  revolvingFundFee: number;
  serviceFeePct: number;
  vatPct: number;
  includeServiceFee: boolean;
}

export function deedCosts({
  price,
  buyerPct,
  sellerPct,
  revolvingFundFee,
  serviceFeePct,
  vatPct,
  includeServiceFee,
}: DeedCostInput) {
  const buyerTax = (price * buyerPct) / 100;
  const sellerTax = (price * sellerPct) / 100;
  const serviceFee = includeServiceFee ? (price * serviceFeePct) / 100 : 0;
  const serviceVat = (serviceFee * vatPct) / 100;
  const buyerTotal = buyerTax + revolvingFundFee + serviceFee + serviceVat;
  return { buyerTax, sellerTax, serviceFee, serviceVat, revolvingFundFee, buyerTotal };
}

export interface RentalYieldInput {
  price: number;
  monthlyRent: number;
  /** Mülk sahibine düşen yıllık giderler (bakım, sigorta, vergi) */
  annualExpenses: number;
  /** Yılda boş kalınan ay sayısı */
  vacancyMonths: number;
}

export function rentalYield({ price, monthlyRent, annualExpenses, vacancyMonths }: RentalYieldInput) {
  if (price <= 0 || monthlyRent <= 0) {
    return { grossAnnual: 0, netAnnual: 0, grossYieldPct: 0, netYieldPct: 0, paybackYears: Infinity };
  }
  const grossAnnual = monthlyRent * 12;
  const netAnnual = monthlyRent * (12 - Math.min(Math.max(vacancyMonths, 0), 12)) - annualExpenses;
  return {
    grossAnnual,
    netAnnual,
    grossYieldPct: (grossAnnual / price) * 100,
    netYieldPct: (netAnnual / price) * 100,
    paybackYears: netAnnual > 0 ? price / netAnnual : Infinity,
  };
}
