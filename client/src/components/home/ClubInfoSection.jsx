import SectionHeading from './SectionHeading.jsx';

const values = [
  {
    title: 'Disciplina',
    text: 'Compromiso diario para mejorar tecnica, condicion fisica y mentalidad.',
  },
  {
    title: 'Respeto',
    text: 'Cultura de companerismo, cuidado mutuo y comportamiento profesional.',
  },
  {
    title: 'Tecnica',
    text: 'Fundamentos solidos y correccion constante para entrenar con calidad.',
  },
  {
    title: 'Comunidad',
    text: 'Un club donde principiantes y avanzados progresan como equipo.',
  },
];

function ClubInfoSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <SectionHeading
        badge="Nuestro club"
        description="Entrenamos con método, respeto y constancia. Clases técnicas, sesiones exigentes y una comunidad comprometida."
        title="Un club serio para entrenar de verdad"
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((item) => (
          <article
            className="rounded-xl border border-white/10 bg-[#111922] p-5"
            key={item.title}
          >
            <p className="text-sm font-black uppercase tracking-[0.12em] text-amber-300">{item.title}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ClubInfoSection;
