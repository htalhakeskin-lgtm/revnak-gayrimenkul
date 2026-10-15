import type { Metadata } from "next";
import { ListingsPage } from "@/components/listings/listings-page";

export const metadata: Metadata = {
  title: "Tüm ilanlar",
  description: "İstanbul ve Bodrum'da satılık ve kiralık daire, villa ve yazlıklar. Filtreleyin, haritada görün, randevu alın.",
  alternates: { canonical: "/ilanlar" },
};

export default function AllListingsPage(props: PageProps<"/ilanlar">) {
  return <ListingsPage searchParams={props.searchParams} />;
}
