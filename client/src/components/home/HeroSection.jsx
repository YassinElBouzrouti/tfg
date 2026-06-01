import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#0c131b]" id="inicio">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,11,16,0.88),rgba(8,11,16,0.48)),url('/images/hero/martial-hero.png')] bg-cover bg-center bg-no-repeat opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(180,83,9,0.15),transparent_42%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-16 lg:grid-cols-[1.12fr_0.88fr] lg:px-8 lg:pb-24 lg:pt-24">
        <div className="max-w-2xl">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.26em] text-amber-300">
            Artes marciales en Madrid
          </p>
          <h1 className="mt-4 font-display text-5xl font-black uppercase leading-[0.95] text-white sm:text-6xl lg:text-[4.6rem]">
            Yassin&apos;s GYM
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-200">
            Entrenamiento serio, horarios claros y un equipo técnico enfocado en progresar contigo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-md bg-amber-500 px-7 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-amber-400"
              to="/register"
            >
              APÚNTATE!
            </Link>
            <Link
              className="rounded-md border border-white/25 px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:border-white/45 hover:bg-white/5"
              to="/#horarios"
            >
              Ver horarios
            </Link>
          </div>
        </div>

        <aside className="grid gap-3 self-end rounded-2xl border border-white/10 bg-[#0f1722]/90 p-5 backdrop-blur">
          <div className="rounded-lg border border-white/10 bg-[#121b27] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-amber-300">Horario club</p>
            <p className="mt-2 text-sm text-slate-200">Lun-Vie: 09:30-13:00 / 17:00-22:30</p>
            <p className="text-sm text-slate-300">Sabado: 09:30-13:00</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#121b27] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-amber-300">Disciplinas</p>
            <p className="mt-2 text-sm text-slate-200">Boxeo, Jiujitsu, Grappling, Muay Thai, MMA y Sparring Libre.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default HeroSection;
