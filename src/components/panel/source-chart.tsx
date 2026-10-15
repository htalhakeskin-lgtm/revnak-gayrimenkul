/**
 * Kaynağa göre talepler — tek seri yatay çubuk grafik (M17 kanal analizi).
 * dataviz kuralları: tek renk (gösterge gerekmez, başlık seriyi adlandırır), ince çubuk,
 * yalnızca veri ucunda 4px yuvarlatma, değerler metin renginde, hover ipucu, ekran okuyucu için tablo.
 */
export function SourceChart({ data, title }: { data: { source: string; count: number }[]; title: string }) {
  const max = Math.max(...data.map((d) => d.count));
  const total = data.reduce((a, d) => a + d.count, 0);

  return (
    <figure>
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="font-semibold">{title}</span>
        <span className="tabular text-sm text-fg-muted">Toplam {total}</span>
      </figcaption>
      <div className="mt-6 space-y-4" aria-hidden>
        {data.map((d) => (
          <div key={d.source} className="group relative grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 text-sm">
            <span className="text-fg-muted">{d.source}</span>
            <span className="relative h-5">
              <span
                className="absolute inset-y-0 left-0 rounded-r-[4px] bg-accent transition-opacity group-hover:opacity-80"
                style={{ width: `${(d.count / max) * 100}%` }}
              />
              <span className="pointer-events-none absolute -top-9 left-0 z-10 rounded-lg bg-ink px-2.5 py-1 text-xs whitespace-nowrap text-ivory opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {d.source}: {d.count} talep · %{Math.round((d.count / total) * 100)}
              </span>
            </span>
            <span className="tabular text-right font-semibold">{d.count}</span>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Kaynak</th>
            <th scope="col">Talep sayısı</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.source}>
              <th scope="row">{d.source}</th>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
