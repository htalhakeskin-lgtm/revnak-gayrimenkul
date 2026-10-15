/**
 * Hesaplayıcı oranları (M18). Üretimde admin panelindeki ayarlardan gelir.
 * Demo değerleridir; gerçek kararlar için güncel oranlar teyit edilmelidir.
 */
export const rates = {
  /** Aylık konut kredisi faizi (%) — örnek */
  mortgageMonthlyRate: 2.49,
  mortgageTerms: [12, 24, 36, 60, 84, 120],
  defaultTermMonths: 120,
  defaultDownPaymentPct: 50,
  /** Tapu harcı oranı (%) — alıcı ve satıcı için ayrı ayrı, genel uygulama */
  deedTaxBuyerPct: 2,
  deedTaxSellerPct: 2,
  /** Tapu döner sermaye ücreti (₺) — yaklaşık, yıllık güncellenir */
  revolvingFundFee: 4_500,
  /** Hizmet bedeli üst sınırı (%) — satış bedeli üzerinden, KDV hariç */
  serviceFeePct: 2,
  vatPct: 20,
  /** Zorunlu deprem sigortası (DASK) — örnek yıllık prim (₺) */
  daskEstimate: 3_200,
  updatedAt: "2026-10-01",
} as const;
