import type { Metadata } from "next";
import { ListingsPage } from "@/components/listings/listings-page";

export const metadata: Metadata = {
  title: "Satılık konutlar",
  description: "İstanbul Boğaz hattı, Anadolu yakası ve Bodrum'da satılık daire, villa ve yazlıklar.",
  alternates: { canonical: "/ilanlar/satilik" },
};

export default function SaleListingsPage(props: PageProps<"/ilanlar/satilik">) {
  return <ListingsPage transaction="satilik" searchParams={props.searchParams} />;
}
