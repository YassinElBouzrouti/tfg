import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading.jsx';

function PricingSection({ plans, loading = false, error = '' }) {
  return (
    <section className="border-y border-white/10 bg-[#0b1016] py-16 lg:py-20" id="tarifas">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          badge="Tarifas"
          description="Planes claros y sin permanencia obligatoria para que entrenes a tu ritmo."
          title="Elige tu plan"
        />

        {loading && (
          <p className="mt-8 rounded-xl border border-white/10 bg-[#111922] px-5 py-4 text-sm text-slate-300">
            Cargando tarifas...
          </p>
        )}

        {!loading && error && (
          <p className="mt-8 rounded-xl border border-rose-500/25 bg-rose-500/10 px-5 py-4 text-sm text-rose-300">
            {error}
          </p>
        )}

        {!loading && !error && plans.length === 0 && (
          <p className="mt-8 rounded-xl border border-white/10 bg-[#111922] px-5 py-4 text-sm text-slate-300">
            No hay tarifas disponibles en este momento.
          </p>
        )}

        {!loading && !error && plans.length > 0 && (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                className={`rounded-2xl border p-6 ${
                  plan.highlight
                    ? 'border-amber-400/80 bg-[#17130d] shadow-[0_10px_30px_rgba(0,0,0,0.25)]'
                    : 'border-white/10 bg-[#111922]'
                }`}
                key={plan.id || plan.name}
              >
                {plan.highlight && (
                  <p className="mb-4 inline-flex rounded-full bg-amber-400 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-black">
                    Recomendado
                  </p>
                )}
                <h3 className="font-display text-3xl font-black uppercase text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{plan.description}</p>
                <p className="mt-6 font-display text-5xl font-black text-amber-300">{plan.price}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">/ mes</p>
                <ul className="mt-6 space-y-2 text-sm text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link
                  className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-amber-500 px-5 py-3 text-sm font-black uppercase tracking-[0.13em] text-black transition hover:bg-amber-400"
                  to={`/register?planId=${encodeURIComponent(plan.id)}`}
                >
                  APUNTATE!
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PricingSection;
