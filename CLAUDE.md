# CLAUDE.md — Revnak Gayrimenkul (demo)

@AGENTS.md

Tek doğru kaynak: `proje_plani.md` (özellikle **Bölüm 20: Demo sürümü**). İlerleme: `docs/ilerleme.md`.
Plana aykırı bir şey yapılacaksa önce plan güncellenir ve karar Bölüm 16'ya işlenir.

## Proje durumu

- **Gösterim amaçlı demo** (K9). Vercel'de canlı (K19), kaynak kod GitHub'da açık (K21) — gizli bilgi asla depoya girmez.
- Vitrin verisi: `src/data/*.ts` (kurgusal, statik). Talepler ve randevular: **Neon Postgres + Drizzle** (`src/db/`, K20).
  Sayfalar ve sunucu eylemleri veriye **yalnızca** `src/lib/data.ts` üzerinden erişir (DB sorguları `src/db/queries.ts`).
- `/panel` parola korumalı: `src/proxy.ts` (Next 16'da `middleware` → `proxy`) + `src/lib/panel-auth.ts` (JWT çerez),
  giriş eylemi `src/app/panel/giris/actions.ts`. Panel sayfaları `src/app/panel/(dashboard)/` altında.
- Firma bilgileri tek yerde: `src/lib/site-config.ts` (`demo: true` → noindex, demo şeridi, iletişim demo penceresi).

## Yığın

Next.js 16.4 (App Router, **Cache Components + Partial Prefetching açık**), React 19, TypeScript strict,
Tailwind CSS 4 (token'lar `src/app/globals.css`), Motion (LazyMotion `m.*`), Lenis, MapLibre GL + OpenFreeMap,
Zod 4, Vitest. Görseller Unsplash + özel `loaderFile` (`src/lib/image-loader.ts`).

## Komutlar

```bash
npm run dev        # geliştirme sunucusu
npm run build      # production derlemesi
npm run check      # lint + typecheck + test
npm run test       # Vitest birim testleri (tests/)
npm run format     # Prettier
npx drizzle-kit push   # şemayı (src/db/schema.ts) veritabanına uygula — DATABASE_URL gerekir
```

Ortam değişkenleri (`.env.local`, Vercel'de üç ortamda): `DATABASE_URL`, `SESSION_SECRET`, `PANEL_PASSWORD_HASH_B64`.

## Next 16 / Cache Components kuralları (bu projede öğrenildi)

- `params` / `searchParams` okuyan bileşenler `<Suspense>` içinde olmalı. Dinamik sayfalarda sayfa bileşeni
  `params`'ı beklemez; okuma Suspense içindeki alt bileşende yapılır (bkz. `src/app/(site)/ilan/[slug]/page.tsx`).
- `dynamicParams` kullanılamaz. `usePathname` / `useSearchParams` kullanan istemci bileşenleri Suspense ile sarılır.
- Render sırasında `Date.now()`, `new Date()`, `Math.random()` **yok**. "Bugün"e bağlı hesaplar tarayıcıda
  (`useHydrated`, `useNow`) veya sunucu eyleminde yapılır. İstisna: `<Suspense>` içindeki async sunucu bileşeninde
  **önce `await connection()`**, sonra `new Date()` (panel sayfaları böyle). Suspense tek başına yetmez; build hata verir.
- DB okuyan (async) sunucu bileşeni `"use client"` dosyasına **import edilemez** — sunucuda render olur ama tarayıcıda
  çöker ("This page couldn't load"). Sunucu düzeninden prop/children olarak geçir (bkz. `LeadBadge` → `PanelNav`).
- `"use client"` dosyasından dışa aktarılan düz fonksiyonlar sunucuda çağrılamaz; paylaşılan yardımcılar `src/lib/` altında.
- Activity: gizlenen sayfalar DOM'da kalır; açılır menü/pencereler `useLayoutEffect` temizliğiyle kapatılır.
- `next/image`: `priority` yerine `preload`; kaliteler `next.config.ts` → `images.qualities`.

## Diğer tuzaklar (bu projede yaşandı)

- **Katmansız 3. parti CSS, Tailwind 4 yardımcı sınıflarını ezer** (`@layer` önceliği). Ör. MapLibre kapsayıcıya
  `position: relative` verir → `absolute inset-0` iptal olur. Konumlandırmayı dış sarmalayıcıya ver.
- **MapLibre v6 worker'ı** ayrı dosyadır: `scripts/copy-maplibre-worker.mjs` (predev/prebuild) → `public/vendor/`,
  yükleme her zaman `src/components/map/load-maplibre.ts` üzerinden.
- `animation-fill-mode: both/forwards` ile opacity/transform animasyonu kalıcı stacking context (transform'da ayrıca
  `fixed` için kapsayıcı blok) oluşturur. Sabit öğe içeren sarmalayıcılarda dolgu modu kullanma (`.page-fade`).
- `<fieldset>` varsayılanı `min-width: min-content`; yatay kaydırmalı içerik taşar (globals.css'te sıfırlandı).
- Izgara öğelerinin `min-width: auto` değeri geniş içerikle tüm sayfayı genişletir (iOS uzaklaştırır). globals.css'te
  `:where(.grid) > * { min-width: 0 }` var; yeni yerleşimleri 360 px genişlikte taşma için tarayıcıda kontrol et.
- Mobil: panelde tablolar kart listesine döner (`md:hidden` / `hidden md:block`); form yazısı dokunmatikte ≥ 16px.
- `"use client"` modülündeki düz fonksiyonu sunucu bileşeninde çağırma (`src/lib/time.ts` gibi ortak modüle taşı).

## Ortam değişkenlerinde `$` işareti (K20'de yaşandı — ÖNEMLİ)

Next.js'in env yükleyicisi (`@next/env`), **yerelde** (`.env.local` dosyası varsa) `$AD` veya `${AD}` görünen
her şeyi değişken referansı sanıp genişletir — bcrypt hash'i gibi `$2b$10$...` değerler sessizce bozulur (`$2b`,
`$10` gibi parçalar tanımsız değişken sayılıp silinir). **Vercel'de** ise (prod/preview, hiç `.env` dosyası
yoksa) bu genişletme hiç çalışmaz, ham değer aynen kullanılır. Yani "yerelde çalışan kaçış" (`\$`) Vercel'de
BOZULUR, "Vercel'de çalışan ham değer" yerelde BOZULUR — iki ortam farklı davranır.

**Kural:** `$` içerebilecek bir değeri (bcrypt/argon2 hash'i, bazı API anahtarları) asla doğrudan ortam
değişkenine yazma. Base64 ile sarıp kodda çöz: `Buffer.from(encoded, "base64").toString("utf8")`. Bu hem
yerelde hem Vercel'de simetrik çalışır, tekrar kırılmaz (bkz. `PANEL_PASSWORD_HASH_B64`, `src/app/panel/giris/actions.ts`).

## Tasarım kuralları (Bölüm 4)

- Ton sistemi: bölüme `tone-dark` veya `tone-light` verilir; bileşenler `text-fg`, `text-fg-muted`, `bg-raised`,
  `border-line`, `text-accent`, `text-danger` ile otomatik uyum sağlar. Açık zeminde altın metin `gold-ink`.
- Animasyonlar (giriş, kaydırma, sahne) **yalnızca transform/opacity**. Hover'daki kısa renk geçişleri serbest.
- "Hareketi azalt" açıkken büyük efektler kapanır (MotionConfig `reducedMotion="user"` + CSS medya sorgusu).
- Metin hiçbir zaman animasyonu beklemez; hero başlığı saf CSS (`SplitText`).
- Kullanıcıya görünen metin Türkçe, kod İngilizce. Fiyat `4.250.000 ₺`, alan `120 m²`, tarih `15 Ekim 2026` (`src/lib/format.ts`).

## Asla yapma

- `.env` veya gerçek anahtarları depoya ekleme.
- Planda olmayan bir kütüphaneyi sormadan ekleme.
- Sayfalardan `src/data/*`'yı doğrudan import etme (veri katmanını kullan).
- Demo modunda gerçek telefon/WhatsApp numarasına yönlendirme (K15).
- Animasyonda `transform`/`opacity` dışı özellik kullanma.
