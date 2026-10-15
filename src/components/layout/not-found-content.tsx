import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function NotFoundContent() {
  return (
    <section className="tone-dark grain flex min-h-[80svh] items-center pt-32 pb-20">
      <div className="container-site">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 max-w-3xl text-display">Bu kapı bir yere açılmıyor.</h1>
        <p className="mt-6 max-w-xl text-lg text-ivory/75">
          Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir. İlan satıldıysa da merak etmeyin: benzerlerini
          birlikte bulalım.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/ilanlar" size="lg">
            İlanlara göz at <ArrowRight size={18} />
          </ButtonLink>
          <ButtonLink href="/" size="lg" variant="outline">
            Ana sayfa
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
