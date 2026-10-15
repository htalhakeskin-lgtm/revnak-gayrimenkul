"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appointmentsStore, clicksStore, leadsStore } from "@/lib/demo-store";
import { useHydrated } from "@/lib/hooks";
import { FeedIcon, useLocalFeed } from "./local-feed";

type MockLead = { id: string; name: string; source: string; interest: string; agent: string; when: string; stage: string };

/** Gelen talepler (M09 → M10): bu tarayıcıdaki gönderimler + örnek kayıtlar */
export function Inbox({ mock }: { mock: MockLead[] }) {
  const hydrated = useHydrated();
  const local = useLocalFeed();

  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <section className="rounded-[20px] border border-line bg-raised p-6 xl:col-span-2" aria-labelledby="local-title">
        <div className="flex items-center justify-between gap-4">
          <h2 id="local-title" className="font-semibold">
            Sizin demo işlemleriniz
          </h2>
          {local.length ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                leadsStore.set([]);
                clicksStore.set([]);
                appointmentsStore.set([]);
              }}
            >
              Temizle
            </Button>
          ) : null}
        </div>
        {!hydrated ? (
          <div className="mt-4 h-40 animate-pulse rounded-[14px] bg-sand/60" aria-hidden />
        ) : local.length ? (
          <ul className="mt-2 divide-y divide-line">
            {local.map((item) => (
              <li key={item.id} className="flex items-start gap-3 py-3">
                <FeedIcon icon={item.icon} />
                <div>
                  <p className="text-sm">{item.text}</p>
                  <p className="text-xs text-fg-muted">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-[14px] bg-sand/60 p-5 text-sm leading-relaxed text-fg-muted">
            Henüz bir işlem yok. Sitede bir{" "}
            <Link href="/iletisim" className="text-accent underline">
              form gönderin
            </Link>
            ,{" "}
            <Link href="/randevu" className="text-accent underline">
              randevu alın
            </Link>{" "}
            ya da bir ilanda WhatsApp butonuna dokunun; burada anında görünür.
          </div>
        )}
        <p className="mt-4 text-xs text-fg-muted">Bu kayıtlar yalnızca sizin tarayıcınızda saklanır.</p>
      </section>

      <section className="rounded-[20px] border border-line bg-raised xl:col-span-3" aria-labelledby="mock-title">
        <h2 id="mock-title" className="p-6 pb-2 font-semibold">
          Son talepler (örnek)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="text-xs text-fg-muted">
              <tr className="border-b border-line">
                <th scope="col" className="px-6 py-3 font-medium">Kişi</th>
                <th scope="col" className="px-3 py-3 font-medium">İlgi</th>
                <th scope="col" className="px-3 py-3 font-medium">Kaynak</th>
                <th scope="col" className="px-3 py-3 font-medium">Danışman</th>
                <th scope="col" className="px-6 py-3 font-medium">Aşama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {mock.map((m) => (
                <tr key={m.id}>
                  <td className="px-6 py-3">
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-xs text-fg-muted">{m.when}</p>
                  </td>
                  <td className="px-3 py-3">{m.interest}</td>
                  <td className="px-3 py-3">{m.source}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{m.agent}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-semibold whitespace-nowrap">{m.stage}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
