# İlerleme günlüğü

## 16 Ekim 2026 — Gerçek altyapı (K20) ve açık depo (K21)

- **Veritabanı:** Neon Postgres (Vercel Marketplace) + Drizzle ORM. Tablolar `leads` ve `appointments` (`src/db/schema.ts`). Formlar ve randevular kaydediliyor; takip no `T-…` / `R-…`.
- **Panel girişi:** `/panel/giris`, bcrypt + imzalı JWT çerez (14 gün), denetim `src/proxy.ts`. Pano, gelen talepler ve takvim veritabanından okuyor; "Gerçek" / "Örnek" etiketleri ayrı.
- **Randevu:** çakışma sunucuda veritabanına karşı kontrol ediliyor; formdaki dolu saatler `/api/randevu/dolu`'dan geliyor (ziyaretçi dolu saati seçip reddedilmiyor).
- **Bulunup düzeltilen hatalar:**
  - bcrypt hash'indeki `$` işaretleri `.env.local` yüklenirken değişken sanılıp siliniyordu → hash Base64 ile saklanıyor (CLAUDE.md'de kural).
  - Panel her sayfada tarayıcıda çöküyordu: DB okuyan `LeadBadge` sunucu bileşeni istemci menüsüne import edilmişti → prop olarak geçiriliyor.
  - `new Date()` Suspense içinde olsa bile build'i durduruyordu → önce `await connection()`.
  - Giriş sayfasında `searchParams` Suspense dışında okunuyordu.
  - Next 16: `middleware.ts` → `proxy.ts`.
- **Doğrulanan akışlar:** yanlış parola reddediliyor; doğru parolayla `sonra` adresine dönülüyor; iletişim formu → panelde "Gerçek talep"; randevu → takvimde yeşil çerçeve; aynı saate ikinci randevu sunucuda reddediliyor ve formda dolu görünüyor.
- **Açık depo (K21):** README ekran görüntüleri, `.env.example`, `npm run panel:parola`.
- **Sıradaki:** danışmana e-posta/SMS bildirimi (ör. Resend), Turnstile, panelde talep durumunu güncelleme.

## 16 Ekim 2026 — Mobil uyum turu

- **Kök neden:** CSS Grid öğelerinin varsayılan `min-width: auto` değeri; geniş içerik (14 günlük tarih şeridi, panel tabloları) kartı ve tüm sayfayı genişletiyordu (`/randevu` 1290 px, `/panel` 685 px). iOS Safari bu yüzden sayfayı uzaklaştırıyordu.
- **Global düzeltmeler (`globals.css`):** ızgara öğelerine `min-width: 0`, kaydırmalı şeritlere `contain: inline-size`, `body { overflow-x: clip }` güvenlik ağı, bölüm başına `color-scheme` (iOS'ta siyah onay kutuları), dokunmatik cihazlarda form yazısı ≥ 16 px (iOS odak yakınlaştırması).
- **Ofis paneli:** mobilde alt sekme çubuğu + sade üst çubuk; ilan ve talep tabloları kart listesine, CRM hunisi aşama seçicili listeye, takvim gün gün ajandaya dönüştü; pano kutuları 2 sütun.
- **Site:** mobil filtre penceresi taslak + "Sonuçları göster" ile çalışıyor; randevu formu mobilde önce; çerez bandı kompakt; blog içindekiler mobilde katlanır; hesaplayıcılarda biçimli tutarlar; mobil menüde "Ofis paneli" bağlantısı.
- **Doğrulama:** 31 sayfa, 360 ve 390 px genişlikte yatay taşma denetimi temiz; masaüstü düzeni korunuyor.

## 16 Ekim 2026 — Marka, gerçek iletişim ve canlı yayın

- **Marka:** "Revnak Gayrimenkul" (K17). Yeni logo (altın ışıltı işareti), ikonlar ve paylaşım görseli; ilan no öneki `RVK-`.
- **Gerçek bilgiler (K18):** telefon/WhatsApp 0542 311 58 88 (butonlar gerçek `wa.me` / `tel:` açar, ilan no'lu hazır mesajla), Instagram @talla.ks. Danışman iletişimi ofis hattına yönlenir; e-posta, adres ve yetki belgesi no örnek.
- **Canlı (K19):** https://revnak-gayrimenkul.vercel.app — tüm sayfalar 200, olmayan sayfa 404, CDN önbellekli. Yeni sürüm: `npm run deploy`.
- **Docker:** `docker-compose.yml` eklendi; Docker Desktop'ta `gayrimenkul-site` konteyneri, http://localhost:3050 (`restart: unless-stopped`).
- **Not:** Formlar hâlâ kayıt/e-posta göndermez; gerçek bildirim için e-posta servisi (ör. Resend) bağlanmalı.


Plan: `proje_plani.md` Bölüm 20 (demo sürümü). Durum işaretleri: ✅ bitti · 🔄 devam · ⏳ sırada.

## 16 Ekim 2026 — Demo sürümü ilk tur

| Paket | Durum | Not |
|---|---|---|
| D-01 Plan v0.3 + iskelet | ✅ | Next.js 16.4.2, React 19.3, Tailwind 4.3, Cache Components + Partial Prefetching |
| D-02 Tasarım sistemi | ✅ | Ton sistemi (`tone-dark` / `tone-light`), Fraunces + Manrope (Türkçe karakter testi geçti), AA kontrast ölçüldü |
| D-03 Animasyon kütüphanesi | ✅ | Reveal, SplitText, Parallax, Counter, Magnetic, ImageReveal, Marquee, SoldStamp, PinnedStory, Lenis, MapPinDrop |
| D-04 Yerleşim | ✅ | Küçülen menü + demo şeridi, mobil menü, footer, WhatsApp butonu, mobil alt çubuk, çerez bandı |
| D-05 Örnek veri | ✅ | 31 ilan (23 aktif, 8 sonuçlanan), 10 bölge, 6 danışman, 5 blog, 8 yorum, 12 SSS, CRM verisi |
| D-06 Ana sayfa | ✅ | 12 sahne |
| D-07 İlan listesi | ✅ | URL filtreleri, sıralama, ızgara/liste, sayfalama, mobil filtre penceresi |
| D-08 İlan detayı | ✅ | Galeri + ışık kutusu, deprem kartı, mini harita, kredi hesabı, iletişim kartı, JSON-LD |
| D-09 Harita | ✅ | Kümeleme, fiyat etiketleri, sınıra göre liste, liste ↔ harita vurgulama |
| D-10 Satılanlar | ✅ | İstatistik şeridi, SoldStamp, fiyat gizliliği |
| D-11 İçerik sayfaları | ✅ | Bölgeler, blog, ekip, danışman, hakkımızda, hizmetler, SSS, iletişim, yasal (örnek metin) |
| D-12 Formlar | ✅ | İletişim, ilan bilgi, portföy ver, değerleme sihirbazı, randevu (çakışma kontrolü + .ics) |
| D-13 Favori/karşılaştırma/hesaplayıcılar | ✅ | localStorage; kredi, tapu masrafı, kira getirisi |
| D-14 Ofis paneli | ✅ | Pano, ilanlar, CRM hunisi, takvim, gelen talepler |
| D-15 SEO/PWA | ✅ | Metadata, OG görseli, schema.org, sitemap, robots (demo: kapalı), manifest, ikonlar, 404 |
| D-16 Kalite | ✅ | Lint ve tip kontrolü temiz, 30 birim testi, production build, tarayıcı kontrolü |
| D-17 Yayın hazırlığı | ✅ | `vercel.json` (fra1), Dockerfile (standalone), README |

### Testlerde ve tarayıcı kontrolünde bulunup düzeltilen hatalar
- **Form:** isteğe bağlı e-posta boş bırakılınca doğrulama başarısız oluyordu (alan FormData'dan düşüyordu). Birim testi yakaladı; `src/lib/schemas.ts` düzeltildi.
- **Randevu:** bugünün geçmiş saatleri seçilebiliyordu → 60 dk ön süreyle hem tarayıcıda hem sunucuda kapatıldı (test eklendi). İlk müsait gün otomatik seçiliyor.
- **Randevu penceresi:** saat ızgarası pencereden taşıyordu (`fieldset` varsayılan `min-width`).
- **Harita:** MapLibre v6 worker'ı yüklenmiyordu (→ `public/vendor/`), kapsayıcı yüksekliği 0'a düşüyordu (katmansız 3. parti CSS).
- **Mobil ilan çubuğu:** sayfa geçiş animasyonunun kalıcı stacking context'i yüzünden genel çubuğun altında kalıyordu.
- **Panel:** örnek randevular Pazar'a düşüyordu; popüler ilanlar tablosunda sayısal sütunlar görünmüyordu.

### Doğrulanan akışlar (tarayıcıda)
- İlan detayı → randevu: KVKK onaysız gönderim engelleniyor, sunucu doğrulaması, telefon normalizasyonu, takip no, `.ics`.
- Aynı danışman/gün/saate ikinci randevu alınamıyor (İP-23 kabul kriteri).
- Filtreli bağlantı paylaşılınca aynı sonuç açılıyor; bozuk URL parametreleri güvenle yok sayılıyor (İP-16).
- WhatsApp demo penceresi ilan no'lu hazır mesajı gösteriyor ve tıklama panele düşüyor.
- Mobilde (390 px) yatay taşma yok.

### Bilinen sınırlamalar (demo gereği)
- Formlar ve randevular kalıcı kaydedilmez; yalnızca tarayıcıda saklanır ve `/panel/talepler`'de görünür.
- Randevu doluluğu deterministik örnek veridir (aynı danışman/tarih/saat her zaman aynı sonucu verir).
- Video ve 360° tur butonları demo penceresi açar.
- Yasal metinler örnektir; hukukçu onayı gerekir.

### Sıradaki adımlar
1. Kullanıcı: GitHub deposu + Vercel'e bağlama (README → "Vercel'e yayın").
2. Açık sorular S4b–S12 (logo, gerçek firma bilgileri, bölge, portallar) → `site-config.ts` ve veri güncellemesi.
3. Üretim sürümüne geçiş: Bölüm 20.8 → Bölüm 19 İP-01.
