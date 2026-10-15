import type { Metadata } from "next";
import { ListingsPage } from "@/components/listings/listings-page";

export const metadata: Metadata = {
  title: "Kiralık konutlar",
  description: "İstanbul'da uzun dönem kiralık daireler ve müstakil evler. Eşyalı ve eşyasız seçenekler.",
  alternates: { canonical: "/ilanlar/kiralik" },
};

export default function RentListingsPage(props: PageProps<"/ilanlar/kiralik">) {
  return <ListingsPage transaction="kiralik" searchParams={props.searchParams} />;
}
