import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "KVKK aydınlatma metni", alternates: { canonical: "/kvkk" } };

export default function KvkkPage() {
  return (
    <LegalPage
      title="KVKK aydınlatma metni"
      path="/kvkk"
      version="v0.1-demo"
      intro={`${siteConfig.legalName} ("Şirket") olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla kişisel verilerinizi aşağıda açıklanan çerçevede işlemekteyiz.`}
      sections={[
        {
          title: "İşlenen kişisel veriler",
          items: [
            "Kimlik ve iletişim bilgileri (ad soyad, telefon, e-posta)",
            "Talep bilgileri (ilgilendiğiniz ilan, randevu tarihi, mesaj içeriği)",
            "Mülk bilgileri (değerleme ve portföy başvurularında)",
            "İşlem güvenliği bilgileri (IP adresi, onay kayıtları)",
          ],
        },
        {
          title: "İşleme amaçları",
          items: [
            "Talep ve randevularınızın yanıtlanması",
            "Gösterim ve yer gösterme süreçlerinin yürütülmesi",
            "Açık rızanız varsa ticari elektronik ileti gönderilmesi",
            "Yasal yükümlülüklerin yerine getirilmesi",
          ],
        },
        {
          title: "Aktarım",
          paragraphs: [
            "Verileriniz, hizmetin sunulması için gerekli olduğu ölçüde barındırma ve iletişim hizmeti sağlayıcılarıyla paylaşılabilir. Sunucuların yurt dışında (AB) bulunması hâlinde Kanun'un yurt dışına aktarım hükümleri uygulanır.",
          ],
        },
        {
          title: "Haklarınız",
          paragraphs: [
            "Kanun'un 11. maddesi kapsamında verilerinize erişme, düzeltilmesini veya silinmesini isteme ve işlemeye itiraz etme haklarına sahipsiniz. Başvurularınızı iletişim sayfamızdaki kanallardan iletebilirsiniz.",
          ],
        },
      ]}
    />
  );
}
