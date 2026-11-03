import { cn } from "@/lib/utils";

/** Alt bilgi imzası, demo notunun karşısında; sitenin etiket diliyle (06 AR-08). */
export function SiteCredit({ className }: { className?: string }) {
  return (
    <p className={cn("shrink-0 text-xs tracking-[0.08em] text-muted", className)}>
      <span lang="en">Created by</span> <span className="text-ivory/80">Talha Keskin</span>
    </p>
  );
}
