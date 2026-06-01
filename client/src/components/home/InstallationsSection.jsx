import SectionHeading from './SectionHeading.jsx';

function InstallationsSection({ installations }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20" id="instalaciones">
      <SectionHeading
        badge="Instalaciones"
        description="Espacios funcionales y bien mantenidos para entrenar comodo y seguro."
        title="Instalaciones"
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {installations.map((item) => (
          <article
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#111922]"
            key={item.name}
          >
            <div className="flex h-52 items-center justify-center bg-[#0b0f14] p-2">
              <img
                alt={item.name}
                className="h-full w-full object-contain object-center"
                src={item.image}
              />
            </div>
            <div className="p-5">
              <h3 className="font-display text-2xl font-black text-white">{item.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default InstallationsSection;
