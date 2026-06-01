import SectionHeading from './SectionHeading.jsx';

function TeachersSection({ teachers }) {
  return (
    <section className="border-y border-white/10 bg-[#0b1016] py-16 lg:py-20" id="maestros">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          badge="Maestros"
          description="Equipo técnico con experiencia real en competición y enseñanza."
          title="Maestros del club"
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {teachers.map((teacher) => (
            <article
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#111922]"
              key={teacher.name}
            >
              <img
                alt={`Maestro ${teacher.name}`}
                className="h-48 w-full object-cover object-top"
                src={teacher.image}
              />
              <div className="p-5">
                <h3 className="font-display text-2xl font-black text-white">{teacher.name}</h3>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-300">
                  {teacher.specialty}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{teacher.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeachersSection;
