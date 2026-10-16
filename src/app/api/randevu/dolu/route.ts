import type { NextRequest } from "next/server";
import { todayInIstanbul } from "@/lib/availability";
import { getBookedSlotsForAgent } from "@/lib/data";

/** Danışmanın bugünden itibaren dolu (onaylı) randevu saatleri. Kişisel veri dönmez, yalnızca tarih ve saat. */
export async function GET(request: NextRequest) {
  const agent = request.nextUrl.searchParams.get("danisman") ?? "";
  if (!/^[a-z0-9-]{1,60}$/.test(agent)) {
    return Response.json({ slots: [] }, { status: 400 });
  }
  const slots = await getBookedSlotsForAgent(agent, todayInIstanbul(new Date()));
  return Response.json({ slots }, { headers: { "Cache-Control": "no-store" } });
}
