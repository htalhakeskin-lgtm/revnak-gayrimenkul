import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Çerez politikası", alternates: { canonical: "/cerez-politikasi" } };

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Çerez politikası"
      path="/cerez-politikasi"
      version="v0.1-demo"
      intro="Sitemizde deneyiminizi iyileştirmek için çerezler ve benzeri teknolojiler kullanılır. Zorunlu olmayan çerezler yalnızca onayınızla çalışır."
      sections={[
        {
          title: "Zorunlu çerezler",
          paragraphs: ["Sitenin çalışması, güvenlik ve tercihlerinizin (ör. çerez izni) hatırlanması için gereklidir; kapatılamaz."],
        },
        {
          title: "Analitik çerezler",
          paragraphs: [
            "Hangi sayfaların ziyaret edildiğini ve sitenin nasıl kullanıldığını anonim olarak ölçmemizi sağlar (ör. GA4, Microsoft Clarity). Yalnızca onay verirseniz yüklenir.",
          ],
        },
        {
          title: "Pazarlama çerezleri",
          paragraphs: ["Reklamların ölçülmesi ve ilgi alanınıza uygun gösterilmesi içindir (ör. Meta Pixel). Yalnızca onay verirseniz yüklenir."],
        },
        {
          title: "Tercihlerinizi değiştirme",
          paragraphs: [
            "Tarayıcınızın site verilerini temizleyerek çerez tercihinizi sıfırlayabilirsiniz; bir sonraki ziyaretinizde izin bandı yeniden görünür.",
          ],
        },
      ]}
    />
  );
}
