import type { Faq, InstagramPost, Testimonial } from "./types";

/** "Rakamlarla biz" (Bölüm 6, sahne 3) — kurgusal */
export const companyStats = [
  { value: 1240, suffix: "+", label: "Satılan ve kiralanan konut" },
  { value: 17, suffix: "", label: "Yıllık deneyim" },
  { value: 96, suffix: "%", label: "Tavsiye eden müşteri" },
  { value: 38, suffix: " gün", label: "Ortalama satış süresi" },
] as const;

/** Müşteri yorumları (M20). Kişiler kurgusaldır. */
export const testimonials: Testimonial[] = [
  {
    name: "Aylin K.",
    role: "Bebek'te daire aldı",
    text: "Gösterimden önce tapu, iskân ve güçlendirme raporu elimizdeydi. İlk kez bir emlak ofisinde soru sormadan önce cevabı aldık.",
    rating: 5,
    source: "Google",
    agentSlug: "kerem-aksoy",
  },
  {
    name: "Murat ve Selin D.",
    role: "Yeniköy'de villa sattı",
    text: "Fotoğraf çekiminden toplu gösterim gününe kadar her şey planlıydı. Evimiz beklediğimizden kısa sürede ve istediğimiz fiyata satıldı.",
    rating: 5,
    source: "Video referans",
    agentSlug: "defne-yalcin",
  },
  {
    name: "Thomas R.",
    role: "Nişantaşı'nda daire kiraladı",
    text: "Yurt dışından görüntülü gösterimle evimizi seçtik; sözleşme ve abonelik işlemlerinde de yanımızdaydılar.",
    rating: 5,
    source: "Google",
    agentSlug: "mert-karaca",
  },
  {
    name: "Esra T.",
    role: "Moda'da daire sattı",
    text: "Kentsel dönüşüm sonrası teslim aldığımız daireyi satarken süreci çok iyi yönettiler. Her hafta ilanın kaç kişi tarafından görüldüğünü raporladılar.",
    rating: 5,
    source: "Google",
    agentSlug: "elif-tuncer",
  },
  {
    name: "Kaan B.",
    role: "Ataşehir'de yatırımlık daire aldı",
    text: "Kira getirisi ve amortisman hesabını üç farklı daire için karşılaştırmalı sundular. Kararımı rakamlarla verdim.",
    rating: 5,
    source: "Müşteri formu",
    agentSlug: "mert-karaca",
  },
  {
    name: "Irina S.",
    role: "Yalıkavak'ta villa aldı",
    text: "Bodrum'a her gelişimizde villamızın bakımı ve sezon kiralaması düzenli. Satış sonrası ilgileri gerçekten fark yaratıyor.",
    rating: 5,
    source: "Video referans",
    agentSlug: "nazli-ergin",
  },
  {
    name: "Hakan ve Deniz Y.",
    role: "Zekeriyaköy'de villa aldı",
    text: "Defne Hanım'ın mimari bakışı sayesinde baktığımız villaların projelerini ve imar durumlarını gerçekten anladık.",
    rating: 5,
    source: "Google",
    agentSlug: "defne-yalcin",
  },
  {
    name: "Ozan A.",
    role: "Cihangir'de daire kiraya verdi",
    text: "Dairem bir hafta içinde, tam istediğim profilde bir kiracıya kiralandı. Kira sözleşmesi ve teslim tutanağı eksiksizdi.",
    rating: 4,
    source: "Google",
    agentSlug: "mert-karaca",
  },
];

/** SSS (M04) */
export const faqs: Faq[] = [
  {
    group: "Alıcılar",
    q: "Gösterim için nasıl randevu alabilirim?",
    a: "İlan sayfasındaki 'Randevu al' butonundan yerinde gösterim, ofiste görüşme veya görüntülü görüşme seçebilirsiniz. Danışmanımızın uygun saatleri anlık olarak listelenir.",
  },
  {
    group: "Alıcılar",
    q: "Alıcı olarak hizmet bedeli ödüyor muyum?",
    a: "Hizmet bedeli, yönetmelikteki üst sınırlar içinde kalmak üzere işlem öncesinde yazılı olarak kararlaştırılır. Sürpriz bir masrafla karşılaşmazsınız.",
  },
  {
    group: "Alıcılar",
    q: "İlanlardaki deprem bilgileri nereden geliyor?",
    a: "Yapı ruhsat tarihi, yönetmelik, zemin sınıfı ve güçlendirme bilgileri mülk sahibinden alınan belgelere dayanır. Rapor varsa gösterimde sizinle paylaşılır.",
  },
  {
    group: "Alıcılar",
    q: "Konut kredisi sürecine yardımcı oluyor musunuz?",
    a: "Anlaşmalı bankalarla ön onay ve ekspertiz sürecini koordine ediyoruz. Kredi hesaplayıcımızla aylık taksitleri önceden görebilirsiniz.",
  },
  {
    group: "Satıcılar",
    q: "Evimin değerini nasıl öğrenebilirim?",
    a: "Değerleme formunu doldurduğunuzda bölgedeki benzer satışlara dayanan bir ön değerlendirme hazırlanır, ardından uzman danışmanımız yerinde inceleme yapar.",
  },
  {
    group: "Satıcılar",
    q: "Yetkilendirme sözleşmesi neden gerekli?",
    a: "Mevzuat gereği ilan yayına alınmadan önce mülk sahibiyle yazılı yetkilendirme sözleşmesi yapılır. Sözleşme; süreyi, hizmet bedelini ve pazarlama planını netleştirir.",
  },
  {
    group: "Satıcılar",
    q: "İlanımın performansını görebilir miyim?",
    a: "Her ay ilanınızın görüntülenme, favori, mesaj ve gösterim sayılarını içeren bir rapor gönderiyoruz.",
  },
  {
    group: "Satıcılar",
    q: "Satış fiyatı sitede yayımlanıyor mu?",
    a: "Hayır. Satılan ilanlar referans olarak kalır ancak satış fiyatı yalnızca sizin onayınızla gösterilir.",
  },
  {
    group: "Kiracılar",
    q: "Kiralamada hangi belgeler isteniyor?",
    a: "Kimlik, gelir belgesi ve gerekirse kefil bilgileri istenir. Kurumsal kiralamalarda şirket evrakları yeterlidir.",
  },
  {
    group: "Kiracılar",
    q: "Depozito ne kadar?",
    a: "Depozito ilan detayında belirtilir; genellikle bir ila üç aylık kira bedeli arasındadır.",
  },
  {
    group: "Genel",
    q: "Hangi bölgelerde hizmet veriyorsunuz?",
    a: "İstanbul'da Boğaz hattı (Bebek, Yeniköy, Kandilli), Şişli-Beyoğlu, Kadıköy ve Ataşehir ile Bodrum yarımadasında hizmet veriyoruz.",
  },
  {
    group: "Genel",
    q: "Kişisel verilerim nasıl korunuyor?",
    a: "Form ve randevu bilgileriniz yalnızca talebinizi yanıtlamak için kullanılır. Ayrıntılar KVKK aydınlatma metnimizde yer alır.",
  },
];

/** Instagram şeridi (M07) — demo içerik */
export const instagramPosts: InstagramPost[] = [
  {
    id: "ig-1",
    image: "1599809275671-b5942cabc7a2",
    caption: "Yalıkavak'ta gün batımı saati. Sonsuzluk havuzlu villamız yayında.",
    kind: "reels",
    likes: 1840,
    listingSlug: "yalikavak-marina-manzarali-sonsuzluk-havuzlu-villa",
  },
  {
    id: "ig-2",
    image: "1600573472550-8090b5e0745e",
    caption: "Bebek'te Boğaz'ı salonun ortasına taşıyan bir yenileme hikâyesi.",
    kind: "post",
    likes: 1210,
    listingSlug: "bebek-bogaz-manzarali-yenilenmis-3-1-daire",
  },
  {
    id: "ig-3",
    image: "1613553507747-5f8d62ad5904",
    caption: "Avlu havuzu, akşam ışığı ve sessizlik.",
    kind: "reels",
    likes: 2390,
    listingSlug: "bebek-sirtlarinda-site-icinde-4-1-dubleks",
  },
  {
    id: "ig-4",
    image: "1622587853578-dd1bf9608d26",
    caption: "Bölge rehberi: Moda'da bir gün. Sahilden tramvaya, kitapçılardan kafelere.",
    kind: "reels",
    likes: 980,
  },
  {
    id: "ig-5",
    image: "1600607688969-a5bfcd646154",
    caption: "Zekeriyaköy'de ormana açılan bir mimari villa.",
    kind: "post",
    likes: 1530,
    listingSlug: "zekeriyakoy-orman-icinde-modern-mimari-villa",
  },
  {
    id: "ig-6",
    image: "1505691938895-1758d7feb511",
    caption: "Nişantaşı'nda 3,6 metre tavanlar ve özgün parkeler.",
    kind: "post",
    likes: 870,
    listingSlug: "nisantasi-tarihi-apartmanda-yuksek-tavanli-4-1",
  },
  {
    id: "ig-7",
    image: "1524231757912-21f4fe3a7200",
    caption: "Cihangir'den Galata'ya bakan sabahlar.",
    kind: "post",
    likes: 1120,
  },
  {
    id: "ig-8",
    image: "1613977257363-707ba9348227",
    caption: "Yeniköy'de bahçe, havuz ve Boğaz esintisi.",
    kind: "reels",
    likes: 2010,
    listingSlug: "yenikoy-bahceli-havuzlu-mustakil-villa",
  },
];

/** Hizmetler (/hizmetler) */
export const services = [
  {
    slug: "satis",
    title: "Satış danışmanlığı",
    text: "Değerlemeden tapu gününe kadar: profesyonel fotoğraf, hedefli pazarlama, toplu gösterimler ve şeffaf raporlama.",
    points: ["Bölge verisine dayalı değerleme", "Profesyonel fotoğraf ve video", "Aylık performans raporu"],
  },
  {
    slug: "alim",
    title: "Alım danışmanlığı",
    text: "Kriterlerinize uyan portföyü önceden eleriz; tapu, iskân ve deprem dosyası hazır gösterimler yaparız.",
    points: ["Kişisel arama listesi", "Belge ve risk kontrolü", "Pazarlık ve kredi koordinasyonu"],
  },
  {
    slug: "kiralama",
    title: "Kiralama ve kiracı yönetimi",
    text: "Doğru kiracı profili, sözleşme, teslim tutanağı ve kira takibi. Kurumsal ve yabancı kiracılar için uçtan uca destek.",
    points: ["Kiracı ön değerlendirmesi", "Sözleşme ve teslim tutanağı", "Uzun dönem takip"],
  },
  {
    slug: "degerleme",
    title: "Değerleme",
    text: "Benzer satışlar, bölge trendleri ve yapının teknik durumuna dayanan, gerekçeli değerleme raporu.",
    points: ["Benzer satış analizi", "Yerinde inceleme", "Fiyatlama stratejisi"],
  },
  {
    slug: "yatirim",
    title: "Yatırım danışmanlığı",
    text: "Kira getirisi, amortisman ve çıkış senaryolarıyla rakamlara dayalı yatırım kararları.",
    points: ["Getiri karşılaştırması", "Portföy çeşitlendirme", "Yabancı yatırımcı desteği"],
  },
] as const;
