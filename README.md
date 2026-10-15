# Revnak Gayrimenkul — demo site

Lüks ve koyu tasarımlı, animasyonlu bir gayrimenkul web sitesi ve ofis paneli vitrini.
**Gösterim amaçlıdır:** firma, ilanlar, kişiler, yorumlar ve fiyatlar kurgusaldır.

Proje planı ve tüm kararlar: [`proje_plani.md`](./proje_plani.md) (demo kapsamı Bölüm 20). İlerleme: [`docs/ilerleme.md`](./docs/ilerleme.md).

## Neler var?

- **Ana sayfa:** 12 sahne. Sinematik hero, akıllı arama, öne çıkan ilanlar, sayaçlar, bölge mozaiği, sabitlenen "nasıl çalışıyoruz" anlatımı, SATILDI damgası, değerleme bandı, Instagram, yorumlar, ekip ve blog.
- **İlanlar:** URL'de saklanan filtreler, sıralama, ızgara/liste görünümü, sayfalama.
- **İlan detayı:** tam ekran galeri, özellik tablosu, bina ve deprem güven kartı, harita (yaklaşık konum), mini kredi hesaplayıcı, benzer ilanlar, WhatsApp hazır mesajı, randevu ve bilgi formu.
- **Harita ile ara:** kümeleme, fiyat etiketli pinler, harita sınırına göre güncellenen liste.
- **Diğer sayfalar:** satılanlar, bölge rehberleri, blog, ekip ve danışman profilleri, hizmetler, SSS, iletişim, randevu, portföy ver, değerleme sihirbazı, hesaplayıcılar, favoriler, karşılaştırma, yasal metinler.
- **Ofis paneli** (`/panel`): pano, ilan tablosu, CRM hunisi, haftalık takvim, gelen talepler. Sitede gönderdiğiniz formlar ve aldığınız randevular panelde görünür (tarayıcınızda saklanır).

## Kurulum

Gereksinim: Node.js 20.9+ (önerilen 24).

```bash
npm install
npm run dev          # http://localhost:3000
```

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` / `npm start` | Production derlemesi ve sunucusu |
| `npm run check` | Lint + tip kontrolü + birim testleri |
| `npm run test` | Vitest birim testleri |
| `npm run format` | Prettier ile biçimlendirme |

Ortam değişkeni **gerekmez**. İsteğe bağlı: `NEXT_PUBLIC_SITE_URL` (paylaşım bağlantıları ve site haritası için kök adres; Vercel'de otomatik algılanır).

## Vercel'e yayın

1. GitHub'da özel bir depo açın ve kodu gönderin.
2. [vercel.com](https://vercel.com) → **Add New → Project** → depoyu seçin (framework otomatik: Next.js).
3. **Deploy**. Fonksiyon bölgesi `vercel.json` ile Frankfurt (`fra1`).

Görseller Unsplash'in kendi CDN'inde boyutlandırılır; Vercel'in ücretsiz plan görsel kotası harcanmaz.

## Docker (opsiyonel)

```bash
docker compose up -d --build   # http://localhost:3050 — Docker Desktop'ta "gayrimenkul-site"
docker compose down            # durdur ve kaldır
```

## Firma bilgilerini değiştirmek

Ad, iletişim, adres, mesai saatleri, yetki belgesi no: `src/lib/site-config.ts`.
Telefon ve WhatsApp butonları gerçek ofis hattını açar (`liveChannels`); e-posta örnek adres olduğu için demo penceresi gösterir.
`demo: false` yapıldığında arama motoru engeli kalkar ve demo şeridi kaybolur.

## Klasör yapısı

```
src/
  app/(site)/        herkese açık sayfalar
  app/panel/         ofis paneli vitrini
  app/actions.ts     sunucu eylemleri (form, randevu)
  components/        ui, motion (animasyon), listings, forms, map, panel…
  data/              kurgusal veri (ilanlar, bölgeler, danışmanlar, blog, CRM)
  lib/data.ts        veri erişim katmanı (üretimde Payload'a bağlanacak tek yer)
tests/               birim testleri
```

## Lisanslar ve kaynaklar

Fotoğraflar [Unsplash](https://unsplash.com) lisansıyla kullanılmıştır. Harita: [OpenFreeMap](https://openfreemap.org) / © OpenStreetMap katkıda bulunanlar. Yazı tipleri: Fraunces ve Manrope (SIL Open Font License).
