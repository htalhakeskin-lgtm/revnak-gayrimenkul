import { connection } from "next/server";
import { Suspense } from "react";
import { addDays, todayInIstanbul } from "@/lib/availability";
import { getRecentLeadsCount } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Son 7 günde gelen gerçek talep sayısı (K20). DB çağrısı Suspense içinde, menüyü bekletmez. */
export function LeadBadge({ className }: { className?: string }) {
  return (
    <Suspense fallback={null}>
      <Count className={className} />
    </Suspense>
  );
}

async function Count({ className }: { className?: string }) {
  await connection(); // "bugün"ü her istekte yeniden hesapla (Cache Components)
  const today = todayInIstanbul(new Date());
  const since = addDays(today, -7);
  const count = await getRecentLeadsCount(`${since}T00:00:00.000Z`);
  if (count === 0) return null;
  return (
    <span className={cn("rounded-full bg-gold px-1.5 text-[0.6875rem] leading-4 font-bold text-night", className)}>
      {count}
    </span>
  );
}
