import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/not-found-content";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = { title: "Sayfa bulunamadı" };

/** Eşleşmeyen adresler (route grubunun dışında) için site çerçevesiyle 404 */
export default function RootNotFound() {
  return (
    <>
      <SiteHeader />
      <main id="icerik">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </>
  );
}
