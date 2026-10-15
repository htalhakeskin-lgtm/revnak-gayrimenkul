import type { Post } from "./types";

/** Blog yazıları (M04). Bilgilendirme amaçlıdır; mevzuat değişebilir. */
export const posts: Post[] = [
  {
    slug: "istanbulda-ev-alirken-kontrol-etmeniz-gereken-10-belge",
    title: "İstanbul'da ev alırken kontrol etmeniz gereken 10 belge ve bilgi",
    excerpt:
      "Tapu kaydındaki şerhlerden iskâna, aidat borcundan deprem bilgisine kadar: imzadan önce masada olması gereken her şey.",
    category: "Alıcı rehberi",
    cover: "1600596542815-ffad4c1539a9",
    coverAlt: "Havuzlu, beyaz cepheli modern bir konut",
    authorSlug: "selim-arikan",
    publishedAt: "2026-10-02",
    readingMinutes: 7,
    blocks: [
      {
        type: "p",
        text: "Hayalinizdeki evi bulduğunuzda heyecanla hızlı karar vermek çok doğal. Ancak bir konutun değeri, sadece manzarası ve metrekaresiyle değil, kâğıt üzerindeki durumuyla da belirlenir. Aşağıdaki liste, her alıcıya imzadan önce önerdiğimiz kontrolleri bir araya getiriyor.",
      },
      { type: "h2", text: "1. Tapu kaydı ve takyidatlar" },
      {
        type: "p",
        text: "Tapu kaydında ipotek, haciz, şerh veya intifa hakkı gibi kısıtlamalar olup olmadığını kontrol edin. Bu bilgiler tapu müdürlüğünden ya da mülk sahibinin e-Devlet üzerinden alabileceği belgelerle teyit edilebilir. Bir ipotek varsa, satış günü nasıl kaldırılacağı önceden yazılı olarak netleştirilmelidir.",
      },
      { type: "h2", text: "2. Kat mülkiyeti mi, kat irtifakı mı?" },
      {
        type: "p",
        text: "Kat mülkiyeti, binanın iskânının alındığını ve bağımsız bölümün tamamlandığını gösterir. Kat irtifakı ise yapının henüz iskân almadığı aşamadaki tapu türüdür. Kat irtifaklı bir konut alacaksanız iskânın neden alınmadığını ve kredi kullanılabilirliğini mutlaka sorun.",
      },
      { type: "h2", text: "3. İskân (yapı kullanma izin belgesi)" },
      {
        type: "p",
        text: "İskân, binanın projesine uygun yapıldığının belediyece onaylandığını gösterir. İskânsız konutlarda kredi kullanımı zorlaşabilir, abonelik işlemlerinde sorun yaşanabilir ve ileride kaçak kat ya da projeye aykırılık gibi riskler ortaya çıkabilir.",
      },
      { type: "h2", text: "4. Yapı ruhsat tarihi ve deprem bilgisi" },
      {
        type: "p",
        text: "Binanın yaşından çok, hangi deprem yönetmeliğine göre projelendirildiği önemlidir. Bunun en iyi göstergesi yapı ruhsat tarihidir. 2019 ve sonrasında ruhsat alan binalar Türkiye Bina Deprem Yönetmeliği'ne (TBDY 2018) göre tasarlanır. Daha eski binalarda güçlendirme yapılıp yapılmadığını ve varsa raporunu isteyin.",
      },
      { type: "listing", slug: "bebek-bogaz-manzarali-yenilenmis-3-1-daire" },
      { type: "h2", text: "5. Aidat, borç ve yönetim planı" },
      {
        type: "p",
        text: "Site veya apartman yönetiminden, dairenin aidat ve ortak gider borcu olmadığını gösteren bir yazı isteyin. Yönetim planı; evcil hayvan, kısa dönem kiralama ve tadilat gibi konularda kuralları belirler, okumadan imza atmayın.",
      },
      { type: "h2", text: "6–10. Kısa kontrol listesi" },
      {
        type: "ul",
        items: [
          "Emlak vergisi borcunun olmadığını gösteren belge",
          "Zorunlu deprem sigortası (DASK) poliçesi",
          "Enerji kimlik belgesi",
          "Belediyeden imar durumu ve varsa projeye aykırılık bilgisi",
          "Çalıştığınız emlak ofisinin taşınmaz ticareti yetki belgesi",
        ],
      },
      {
        type: "quote",
        text: "İyi bir danışman, size evi satmadan önce evin dosyasını açar. Belgeler eksikse bunu ilk siz duymalısınız.",
      },
      {
        type: "callout",
        title: "Belgeleri sizin için biz toplayalım",
        text: "Portföyümüzdeki her ilanın tapu, iskân ve deprem bilgilerini gösterimden önce dosyalıyoruz.",
        href: "/randevu",
        cta: "Gösterim randevusu al",
      },
    ],
  },
  {
    slug: "tapu-harci-ve-satis-masraflari-rehberi",
    title: "Tapu harcı ve satış masrafları: alıcıyı ve satıcıyı neler bekliyor?",
    excerpt:
      "Tapu harcı, döner sermaye ücreti, hizmet bedeli ve sigortalar. Bütçenizi doğru planlamak için masrafların tam listesi.",
    category: "Mevzuat",
    cover: "1600566753086-00f18fb6b3ea",
    coverAlt: "Modern ve aydınlık bir salon",
    authorSlug: "selim-arikan",
    publishedAt: "2026-09-18",
    readingMinutes: 6,
    blocks: [
      {
        type: "p",
        text: "Konut alırken bütçenin yalnızca satış bedelinden oluşmadığını bilmek, son dakika sürprizlerini önler. Aşağıda Türkiye'de bir konut satışında genellikle karşılaşılan masrafları özetledik.",
      },
      {
        type: "callout",
        title: "Önemli not",
        text: "Oranlar ve tutarlar mevzuatla değişebilir. İşlem öncesinde güncel değerleri tapu müdürlüğünden veya danışmanınızdan teyit edin.",
        href: "/hesaplayicilar",
        cta: "Masraf hesaplayıcıyı aç",
      },
      { type: "h2", text: "Tapu harcı" },
      {
        type: "p",
        text: "Genel uygulamada tapu harcı, beyan edilen satış bedelinin binde 20'si alıcıdan, binde 20'si satıcıdan olmak üzere toplam yüzde 4'tür. Taraflar kendi aralarında farklı bir paylaşım yapabilir; bu durumun satış sözleşmesinde açıkça yazılması önerilir. Beyan edilen bedel, belediyenin belirlediği emlak vergisi değerinin altında olamaz.",
      },
      { type: "h2", text: "Döner sermaye ücreti" },
      {
        type: "p",
        text: "Tapu müdürlüklerinde işlem başına alınan, her yıl güncellenen sabit bir ücrettir. Tutarı görece küçüktür ama bütçeye eklenmelidir.",
      },
      { type: "h2", text: "Emlak danışmanlığı hizmet bedeli" },
      {
        type: "p",
        text: "Taşınmaz Ticareti Hakkında Yönetmelik, satışlarda hizmet bedeli için alıcı ve satıcı açısından ayrı ayrı üst sınır belirler (satış bedelinin yüzde 2'si ve KDV). Hizmet bedeli, yetkilendirme sözleşmesinde yazılı olarak kararlaştırılmalıdır.",
      },
      { type: "h2", text: "Sigorta ve diğer kalemler" },
      {
        type: "ul",
        items: [
          "Zorunlu deprem sigortası (DASK): tapu devrinde geçerli poliçe aranır.",
          "Kredi kullanılıyorsa ekspertiz ücreti ve konut sigortası.",
          "Yeni konutlarda KDV: konutun niteliğine ve tarihine göre farklı oranlar uygulanabilir.",
          "Taşınma, abonelik devirleri ve küçük onarımlar için ayrılacak pay.",
        ],
      },
      { type: "h2", text: "Satıcı için: değer artış kazancı" },
      {
        type: "p",
        text: "Konutu belirli bir süre dolmadan satan kişiler için değer artış kazancı vergisi doğabilir. Süreler ve istisnalar mevzuatla değiştiği için satıştan önce mali müşavirinize danışmanızı öneririz.",
      },
    ],
  },
  {
    slug: "deprem-yonetmeligi-ve-bina-yasi-alici-kontrol-listesi",
    title: "Bina yaşı mı, yönetmelik mi? Depreme dayanıklılık için alıcı kontrol listesi",
    excerpt:
      "Yapı ruhsat tarihi, zemin sınıfı, güçlendirme raporu. Bir binanın depreme hazırlığını anlamak için doğru sorular.",
    category: "Alıcı rehberi",
    cover: "1600607688969-a5bfcd646154",
    coverAlt: "Bahçe içinde modern mimari bir konut",
    authorSlug: "defne-yalcin",
    publishedAt: "2026-09-04",
    readingMinutes: 8,
    blocks: [
      {
        type: "p",
        text: "Alıcıların en sık sorduğu soru: 'Bina kaç yaşında?' Oysa depreme dayanıklılığı anlamak için daha iyi sorular var. Mimar gözüyle, bir binayı değerlendirirken baktığımız noktaları paylaşıyoruz.",
      },
      { type: "h2", text: "Yaştan çok yönetmelik" },
      {
        type: "p",
        text: "Türkiye'de deprem yönetmelikleri 1998, 2007 ve 2018 yıllarında önemli ölçüde güncellendi. Bir binanın hangi kurallara göre tasarlandığını anlamanın en güvenilir yolu yapı ruhsat tarihidir; inşaatın bittiği yıl değil. Yeni yönetmelik (TBDY 2018) 2019 başından itibaren uygulanmaktadır.",
      },
      { type: "h2", text: "Zemin sınıfı ne anlatır?" },
      {
        type: "p",
        text: "TBDY 2018'de zeminler ZA'dan (sağlam kaya) ZF'ye (özel inceleme gerektiren zemin) kadar sınıflandırılır. Aynı bina, farklı zeminlerde depreme farklı tepki verir. Yeni binalarda zemin etüdü raporu proje dosyasında bulunur; satıcıdan isteyebilirsiniz.",
      },
      { type: "h2", text: "Güçlendirme yapıldıysa" },
      {
        type: "ul",
        items: [
          "Güçlendirme projesinin ve uygulamasının belgelerini isteyin.",
          "Hangi yönetmeliğe göre yapıldığını öğrenin.",
          "Uygulamayı yapan firma ve denetim bilgilerini kontrol edin.",
        ],
      },
      { type: "listing", slug: "nisantasi-tarihi-apartmanda-yuksek-tavanli-4-1" },
      { type: "h2", text: "Gözle görülebilecek işaretler" },
      {
        type: "p",
        text: "Kolon ve kirişlerde belirgin çatlaklar, bodrumda nem ve paslanma izleri, sonradan kaldırılmış duvarlar veya açılmış dükkânlar dikkat edilmesi gereken işaretlerdir. Bunlar tek başına karar vermek için yeterli değildir ama uzman incelemesi istemek için iyi bir sebeptir.",
      },
      { type: "h2", text: "Riskli yapı tespiti" },
      {
        type: "p",
        text: "Şüphe duyulan binalarda, yetkili kuruluşlarca yapılan riskli yapı tespiti en net sonucu verir. Bu süreç kat malikleri tarafından başlatılabilir ve kentsel dönüşüm hakları açısından da önemlidir.",
      },
      {
        type: "callout",
        title: "Her ilanda bina ve deprem kartı",
        text: "Portföyümüzdeki ilanlarda yapı ruhsat yılı, yönetmelik, zemin sınıfı ve güçlendirme bilgisi açıkça yer alır.",
        href: "/ilanlar",
        cta: "İlanları incele",
      },
    ],
  },
  {
    slug: "kira-getirisi-ve-amortisman-nasil-hesaplanir",
    title: "Kira getirisi ve amortisman: yatırımlık daireyi rakamlarla değerlendirmek",
    excerpt: "Brüt ve net kira getirisi, amortisman süresi ve değer artışı. Yatırım kararını duyguyla değil rakamla verin.",
    category: "Yatırım",
    cover: "1486406146926-c627a92ad1ab",
    coverAlt: "Gökdelenlerden oluşan bir iş merkezi silueti",
    authorSlug: "mert-karaca",
    publishedAt: "2026-08-22",
    readingMinutes: 5,
    blocks: [
      {
        type: "p",
        text: "Yatırımlık daire alırken en çok konuşulan iki kavram kira getirisi ve amortisman süresidir. İkisi de basit formüllerle hesaplanır ama doğru yorumlamak deneyim ister.",
      },
      { type: "h2", text: "Brüt kira getirisi" },
      {
        type: "p",
        text: "Yıllık kira gelirinin satın alma fiyatına oranıdır. Örneğin 15.750.000 ₺'ye alınan ve ayda 48.000 ₺'ye kiralanan bir dairenin yıllık kirası 576.000 ₺'dir; brüt getiri yaklaşık yüzde 3,7 olur.",
      },
      { type: "h2", text: "Net getiri" },
      {
        type: "p",
        text: "Gerçek tablo için mülk sahibine düşen giderleri düşmek gerekir: boş kalınan aylar, bakım-onarım, sigorta, emlak vergisi ve kira gelir vergisi. Bu kalemler brüt getiriyi bir ila iki puan aşağı çekebilir.",
      },
      { type: "h2", text: "Amortisman süresi" },
      {
        type: "p",
        text: "Fiyatın yıllık kiraya bölünmesiyle bulunur ve 'yatırımın kendini kaç yılda ödediğini' gösterir. Yukarıdaki örnekte bu süre yaklaşık 27 yıldır. Türkiye'de bu süre bölgeye göre büyük farklılık gösterir; değer artışı beklentisi de hesaba katılmalıdır.",
      },
      {
        type: "ul",
        items: [
          "Kiralık talebi yüksek bölgelerde boş kalma süresi kısadır.",
          "Küçük daireler (1+1, 2+1) genellikle daha likittir.",
          "Ulaşım projeleri ve kentsel dönüşüm değer artışını hızlandırabilir.",
        ],
      },
      { type: "listing", slug: "atasehir-rezidansta-2-1-finans-merkezine-yakin" },
      {
        type: "callout",
        title: "Kendi rakamlarınızı deneyin",
        text: "Kira getirisi hesaplayıcımızla farklı senaryoları karşılaştırın.",
        href: "/hesaplayicilar",
        cta: "Hesaplayıcıya git",
      },
    ],
  },
  {
    slug: "evinizi-daha-hizli-satmak-icin-7-hazirlik-adimi",
    title: "Evinizi daha hızlı satmak için 7 hazırlık adımı",
    excerpt: "Doğru fiyat, iyi fotoğraf ve eksiksiz dosya. İlanınızın ilk iki haftasını en verimli şekilde kullanmanın yolları.",
    category: "Satıcı rehberi",
    cover: "1613545325278-f24b0cae1224",
    coverAlt: "Şömineli, beyaz tonlarda geniş bir salon",
    authorSlug: "elif-tuncer",
    publishedAt: "2026-08-06",
    readingMinutes: 6,
    blocks: [
      {
        type: "p",
        text: "Bir ilanın en çok ilgi gördüğü dönem yayına alındığı ilk iki haftadır. Bu sürede doğru hazırlanmış bir ev, hem daha hızlı hem de daha iyi fiyata satılır. Satıcılarımızla birlikte uyguladığımız adımlar şunlar:",
      },
      {
        type: "ol",
        items: [
          "Gerçekçi bir değerleme ile başlayın: bölgedeki benzer satışlara dayalı fiyat, pazarlık payını da korur.",
          "Küçük onarımları yapın: damlayan musluk, kırık priz ve boya izleri gösterimde büyük görünür.",
          "Eşyaları sadeleştirin: kişisel eşyalar ve kalabalık mobilya alanı küçük gösterir.",
          "Profesyonel fotoğraf çektirin: gün ışığında, ışıklar ve perdeler açık.",
          "Belgeleri hazırlayın: tapu, iskân, aidat yazısı, DASK ve enerji kimlik belgesi.",
          "Yazılı yetkilendirme sözleşmesi yapın: süreç, hizmet bedeli ve pazarlama planı netleşir.",
          "Gösterim düzenini planlayın: toplu gösterim günleri talebi canlı tutar.",
        ],
      },
      {
        type: "quote",
        text: "Fiyatı yüksek başlayıp sonra düşürmek, ilanı 'beklemiş ilan' gibi gösterir. İlk fiyat, en güçlü pazarlama aracınızdır.",
      },
      {
        type: "callout",
        title: "Evinizin değerini öğrenin",
        text: "Birkaç soruyu yanıtlayın, uzman danışmanımız size bölgedeki benzer satışlarla birlikte dönüş yapsın.",
        href: "/evimi-degerle",
        cta: "Ücretsiz değerleme iste",
      },
    ],
  },
];
