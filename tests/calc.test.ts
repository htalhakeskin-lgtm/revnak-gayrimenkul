import { describe, expect, it } from "vitest";
import { deedCosts, loanSummary, monthlyPayment, rentalYield } from "@/lib/calc";

describe("monthlyPayment", () => {
  it("annüite formülüyle taksit hesaplar", () => {
    // 1.000.000 ₺, aylık %2, 12 ay → yaklaşık 94.560 ₺
    expect(monthlyPayment(1_000_000, 2, 12)).toBeCloseTo(94_559.6, 0);
  });

  it("faiz sıfırsa anaparayı eşit böler", () => {
    expect(monthlyPayment(1_200_000, 0, 12)).toBe(100_000);
  });

  it("geçersiz girdide sıfır döner", () => {
    expect(monthlyPayment(0, 2, 12)).toBe(0);
    expect(monthlyPayment(1_000_000, 2, 0)).toBe(0);
  });
});

describe("loanSummary", () => {
  it("peşinatı fiyattan düşer ve toplamları tutarlı verir", () => {
    const r = loanSummary({ price: 20_000_000, downPayment: 10_000_000, monthlyRatePct: 2.49, months: 120 });
    expect(r.principal).toBe(10_000_000);
    expect(r.totalPayment).toBeCloseTo(r.monthly * 120, 4);
    expect(r.totalInterest).toBeCloseTo(r.totalPayment - r.principal, 4);
  });

  it("peşinat fiyattan büyükse kredi sıfırdır", () => {
    const r = loanSummary({ price: 5_000_000, downPayment: 9_000_000, monthlyRatePct: 2, months: 60 });
    expect(r.principal).toBe(0);
    expect(r.monthly).toBe(0);
  });
});

describe("deedCosts", () => {
  it("alıcı ve satıcı tapu harcını ayrı ayrı %2 hesaplar", () => {
    const r = deedCosts({
      price: 10_000_000,
      buyerPct: 2,
      sellerPct: 2,
      revolvingFundFee: 4_500,
      serviceFeePct: 2,
      vatPct: 20,
      includeServiceFee: false,
    });
    expect(r.buyerTax).toBe(200_000);
    expect(r.sellerTax).toBe(200_000);
    expect(r.buyerTotal).toBe(204_500);
  });

  it("hizmet bedeli ve KDV'yi alıcı toplamına ekler", () => {
    const r = deedCosts({
      price: 10_000_000,
      buyerPct: 2,
      sellerPct: 2,
      revolvingFundFee: 0,
      serviceFeePct: 2,
      vatPct: 20,
      includeServiceFee: true,
    });
    expect(r.serviceFee).toBe(200_000);
    expect(r.serviceVat).toBe(40_000);
    expect(r.buyerTotal).toBe(440_000);
  });
});

describe("rentalYield", () => {
  it("brüt getiri ve amortismanı hesaplar", () => {
    const r = rentalYield({ price: 12_000_000, monthlyRent: 50_000, annualExpenses: 0, vacancyMonths: 0 });
    expect(r.grossYieldPct).toBeCloseTo(5, 6);
    expect(r.paybackYears).toBeCloseTo(20, 6);
  });

  it("boş ayları ve giderleri net getiriden düşer", () => {
    const r = rentalYield({ price: 12_000_000, monthlyRent: 50_000, annualExpenses: 50_000, vacancyMonths: 1 });
    expect(r.netAnnual).toBe(500_000);
    expect(r.netYieldPct).toBeCloseTo(4.1667, 3);
  });

  it("kira yoksa amortisman sonsuzdur", () => {
    expect(rentalYield({ price: 1, monthlyRent: 0, annualExpenses: 0, vacancyMonths: 0 }).paybackYears).toBe(Infinity);
  });
});
