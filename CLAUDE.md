# CLAUDE.md — Revnak Gayrimenkul (demo)

@AGENTS.md

Tek doğru kaynak: `proje_plani.md` (özellikle **Bölüm 20: Demo sürümü**). İlerleme: `docs/ilerleme.md`.
Plana aykırı bir şey yapılacaksa önce plan güncellenir ve karar Bölüm 16'ya işlenir.

## Proje durumu

- **Gösterim amaçlı demo** (K9). Vercel'de yayınlanır, veritabanı/CMS yok (K10).
- Veri: `src/data/*.ts` (kurgusal). Sayfalar ve sunucu eylemleri veriye **yalnızca** `src/lib/data.ts` üzerinden erişir.
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
```

## Next 16 / Cache Components kuralları (bu projede öğrenildi)

- `params` / `searchParams` okuyan bileşenler `<Suspense>` içinde olmalı. Dinamik sayfalarda sayfa bileşeni
  `params`'ı beklemez; okuma Suspense içindeki alt bileşende yapılır (bkz. `src/app/(site)/ilan/[slug]/page.tsx`).
- `dynamicParams` kullanılamaz. `usePathname` / `useSearchParams` kullanan istemci bileşenleri Suspense ile sarılır.
- Render sırasında `Date.now()`, `new Date()`, `Math.random()` **yok**. "Bugün"e bağlı hesaplar tarayıcıda
  (`useHydrated`, `useNow`) veya sunucu eyleminde yapılır.
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
- `"use client"` modülündeki düz fonksiyonu sunucu bileşeninde çağırma (`src/lib/time.ts` gibi ortak modüle taşı).

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
