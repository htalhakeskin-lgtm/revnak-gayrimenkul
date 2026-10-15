import { describe, expect, it } from "vitest";
import { listings } from "@/data/listings";
import {
  filtersToSearchParams,
  matchesFilters,
  normalizeTr,
  parseListingFilters,
  sortListings,
} from "@/lib/listing-filters";

describe("parseListingFilters", () => {
  it("geçerli parametreleri ayrıştırır", () => {
    const f = parseListingFilters({ bolge: "bebek", min: "10000000", oda: "3+1", ozellik: "havuz,bogaz", siralama: "fiyat-artan", sayfa: "2" });
    expect(f).toMatchObject({ bolge: "bebek", min: 10_000_000, oda: "3+1", ozellik: ["havuz", "bogaz"], siralama: "fiyat-artan", sayfa: 2 });
  });

  it("hatalı ve kötü niyetli değerleri yok sayar", () => {
    const f = parseListingFilters({ bolge: "<script>", min: "-5", oda: "9+9", ozellik: "hack", siralama: "x", sayfa: "abc", tip: "saray" });
    expect(f.bolge).toBeUndefined();
    expect(f.min).toBeUndefined();
    expect(f.oda).toBeUndefined();
    expect(f.ozellik).toEqual([]);
    expect(f.siralama).toBe("yeni");
    expect(f.sayfa).toBe(1);
    expect(f.tip).toBeUndefined();
  });

  it("sabit işlem tipini URL'den önce uygular", () => {
    expect(parseListingFilters({ islem: "kiralik" }, "satilik").islem).toBe("satilik");
  });
});

describe("filtersToSearchParams", () => {
  it("varsayılanları yazmaz ve geri ayrıştırılabilir", () => {
    const original = parseListingFilters({ bolge: "moda", max: "20000000", ozellik: "deniz", sayfa: "1" });
    const qs = filtersToSearchParams(original).toString();
    expect(qs).toBe("bolge=moda&max=20000000&ozellik=deniz");
    const roundTrip = parseListingFilters(Object.fromEntries(new URLSearchParams(qs)));
    expect(roundTrip).toEqual(original);
  });
});

describe("matchesFilters", () => {
  const base = parseListingFilters({});

  it("oda filtresi 4+ için 4 ve üzerini kabul eder", () => {
    const villa = listings.find((l) => l.rooms === "6+2");
    expect(villa && matchesFilters(villa, { ...base, oda: "4+" })).toBe(true);
  });

  it("metin aramasında Türkçe karakterleri normalize eder", () => {
    const yenikoy = listings.find((l) => l.regionSlug === "yenikoy");
    expect(yenikoy && matchesFilters(yenikoy, { ...base, q: "YENIKOY" }, () => "Yeniköy")).toBe(true);
    expect(normalizeTr("İSTANBUL Şişli")).toBe("istanbul sisli");
  });

  it("fiyat aralığının dışındaki ilanları eler", () => {
    const pricey = listings.filter((l) => matchesFilters(l, { ...base, islem: "satilik", max: 20_000_000 }));
    expect(pricey.every((l) => l.price <= 20_000_000 && l.transaction === "satilik")).toBe(true);
  });
});

describe("sortListings", () => {
  it("fiyata göre artan sıralar", () => {
    const sorted = sortListings(listings, "fiyat-artan");
    for (let i = 1; i < sorted.length; i++) expect(sorted[i].price).toBeGreaterThanOrEqual(sorted[i - 1].price);
  });
});
