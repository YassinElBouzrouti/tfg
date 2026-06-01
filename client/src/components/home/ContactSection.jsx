import SectionHeading from './SectionHeading.jsx';

function ContactSection() {
  return (
    <section className="border-t border-white/10 bg-[#0b1016] py-16 lg:py-20" id="contacto">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          badge="Contacto"
          description="Puedes visitarnos, llamarnos o escribirnos para resolver cualquier duda."
          title="Contacto"
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-white/10 bg-[#111922] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-300">Direccion</p>
            <p className="mt-3 text-sm leading-6 text-slate-200">Calle Central 24, Madrid</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-[#111922] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-300">Telefono</p>
            <p className="mt-3 text-sm leading-6 text-slate-200">+34 600 123 456</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-[#111922] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-300">Correo</p>
            <p className="mt-3 text-sm leading-6 text-slate-200">contacto@yassinsgym.com</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-[#111922] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-300">Horario de atencion</p>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Lunes a viernes: 09:30 - 13:00 y 17:00 - 22:30
              <br />
              Sabado: 09:30 - 13:00
              <br />
              Domingo: Cerrado
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
