import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { companyStats } from "@/data/content";

/** Sahne 3 — Rakamlarla biz */
export function CompanyStats() {
  return (
    <section className="tone-dark grain border-y border-night-line" aria-label="Rakamlarla Revnak">
      <div className="container-site grid grid-cols-2 lg:grid-cols-4">
        {companyStats.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 0.08}
            className="border-night-line py-14 text-center odd:border-r lg:border-r lg:last:border-r-0"
          >
            <Counter
              value={stat.value}
              suffix={stat.suffix}
              className="tabular block font-serif text-5xl text-ivory md:text-6xl"
            />
            <span className="mt-3 block text-xs font-semibold tracking-[0.18em] text-muted uppercase">
              {stat.label}
            </span>
          </Reveal>
        ))}
      </div>
      <p className="container-site pb-6 text-center text-[0.6875rem] text-muted/70">
        Rakamlar kurgusaldır (demo).
      </p>
    </section>
  );
}
