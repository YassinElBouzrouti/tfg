import PanelCard from './PanelCard.jsx';

function ClassesCard({ className = '', classes, onBookClass, reservingClassId, reservedClassIds }) {
  return (
    <PanelCard
      className={className}
      description="Selecciona tu proximo entrenamiento"
      title="Clases disponibles"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {classes.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-[#0b0e12] p-4 text-sm text-slate-400 md:col-span-2">
            No hay clases disponibles para reservar por ahora.
          </p>
        )}
        {classes.map((martialClass) => {
          const alreadyBooked = martialClass.alreadyBooked || reservedClassIds.includes(martialClass.id);
          const bookingInProgress = reservingClassId === martialClass.id;

          return (
            <article className="rounded-xl border border-white/10 bg-[#0b0e12] p-5" key={martialClass.id}>
              <div className="flex justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                  {martialClass.discipline}
                </p>
                <p className="text-xs font-bold text-slate-500">{martialClass.spots} plazas</p>
              </div>
              <h3 className="mt-3 font-display text-2xl font-black uppercase text-white">
                {martialClass.discipline}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {martialClass.day} - {martialClass.time}
              </p>
              {martialClass.nextSessionLabel && (
                <p className="mt-2 text-xs uppercase tracking-widest text-slate-500">
                  Proxima: {martialClass.nextSessionLabel}
                </p>
              )}
              <button
                className="mt-5 w-full rounded-lg border border-amber-400/35 px-4 py-3 text-xs font-black uppercase tracking-widest text-amber-300 transition enabled:hover:bg-amber-500 enabled:hover:text-black disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
                disabled={alreadyBooked || bookingInProgress}
                onClick={() => onBookClass(martialClass)}
                type="button"
              >
                {alreadyBooked ? 'Reservada' : bookingInProgress ? 'Reservando...' : 'Reservar clase'}
              </button>
            </article>
          );
        })}
      </div>
    </PanelCard>
  );
}

export default ClassesCard;
