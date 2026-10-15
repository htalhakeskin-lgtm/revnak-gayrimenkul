import type { ReactNode } from "react";

/** Sayfalar arası yumuşak geçiş (Bölüm 4.5 · PageTransition). Sadece opacity: sabit konumlu öğeleri bozmaz. */
export default function SiteTemplate({ children }: { children: ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
