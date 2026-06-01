import PanelCard from './PanelCard.jsx';
import StatusBadge from './StatusBadge.jsx';

function AttendanceCard({ attendances }) {
  return (
    <PanelCard
      description="Clases completadas recientemente"
      title="Historial de asistencia"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {attendances.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-[#0b0e12] p-4 text-sm text-slate-400 md:col-span-3">
            Aun no hay clases asistidas registradas.
          </p>
        )}
        {attendances.map((attendance) => (
          <article className="rounded-xl border border-white/10 bg-[#0b0e12] p-5" key={attendance.id}>
            <StatusBadge status="ASISTIDA" />
            <p className="mt-4 font-display text-xl font-black uppercase text-white">
              {attendance.className}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {attendance.date} - {attendance.coach}
            </p>
          </article>
        ))}
      </div>
    </PanelCard>
  );
}

export default AttendanceCard;
