import { AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

/** Yasal sayfa şablonu. Metinler örnektir; hukukçu onayı olmadan yayına alınmaz (Bölüm 13.2). */
export function LegalPage({
  title,
  path,
  intro,
  version,
  sections,
}: {
  title: string;
  path: string;
  intro: string;
  version: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow="Yasal" title={title} crumbs={[{ name: title, path }]} size="sm" />
      <section className="tone-light py-16 md:py-24">
        <div className="container-site max-w-3xl">
          <div className="mb-10 flex gap-3 rounded-[14px] border border-accent/40 bg-accent/10 p-5 text-sm leading-relaxed">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
            <p>
              <strong>Örnek metindir.</strong> Bu demo sitede yer alan yasal metinler yapı göstermek içindir; hukuki geçerliliği
              yoktur. Gerçek sürümde metinler avukat tarafından hazırlanıp onaylanır.
            </p>
          </div>
          <div className="prose-site">
            <p className="text-sm text-fg-muted">Metin sürümü: {version}</p>
            <p>{intro}</p>
            {sections.map((s) => (
              <section key={s.title}>
                <h2>{s.title}</h2>
                {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                {s.items ? (
                  <ul>
                    {s.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
