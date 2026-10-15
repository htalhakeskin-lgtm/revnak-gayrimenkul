import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Kullanım koşulları", alternates: { canonical: "/kullanim-kosullari" } };

export default function TermsPage() {
  return (
    <LegalPage
      title="Kullanım koşulları"
      path="/kullanim-kosullari"
      version="v0.1-demo"
      intro="Bu siteyi kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız."
      sections={[
        {
          title: "İlan bilgileri",
          paragraphs: [
            "İlan bilgileri mülk sahiplerinden alınan bilgilere dayanır ve bilgilendirme amaçlıdır. Fiyat ve özellikler önceden haber verilmeksizin değişebilir.",
          ],
        },
        {
          title: "Hesaplayıcılar",
          paragraphs: ["Hesaplayıcı sonuçları örnek niteliğindedir ve finansal veya hukuki tavsiye yerine geçmez."],
        },
        {
          title: "Fikri haklar",
          paragraphs: ["Sitedeki metin, fotoğraf ve tasarımların izinsiz kopyalanması ve çoğaltılması yasaktır."],
        },
      ]}
    />
  );
}
