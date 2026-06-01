import { Link } from 'react-router-dom';
import AdminCard from './AdminCard.jsx';
import AdminStatusBadge from './AdminStatusBadge.jsx';

const dayLabels = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miercoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sabado',
  SUNDAY: 'Domingo',
};

function ClassesListCard({ classes }) {
  return (
    <AdminCard description="Listado de clases y alumnos apuntados" title="Clases">
      <div className="space-y-4">
        {classes.map((martialClass) => (
          <article className="rounded-xl border border-white/10 bg-[#0b0f13] p-4" key={martialClass.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-2xl font-black uppercase text-white">
                  {martialClass.name}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {dayLabels[martialClass.dayOfWeek] || martialClass.dayOfWeek} - {martialClass.startTime} a {martialClass.endTime} - {martialClass.instructorName}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                  {martialClass.discipline} - {martialClass.level}
                </p>
              </div>
              <p className="rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-300">
                {martialClass.bookings.length} apuntados
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {martialClass.bookings.length === 0 && (
                <p className="text-sm text-slate-500">Sin reservas por el momento.</p>
              )}
              {martialClass.bookings.map((booking) => (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#090c10] px-3 py-2"
                  key={booking.id}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {booking.user.name} {booking.user.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{booking.user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <AdminStatusBadge value={booking.status} />
                    <Link
                      className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white"
                      to={`/admin/members/${booking.user.id}`}
                    >
                      Ver perfil
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </AdminCard>
  );
}

export default ClassesListCard;
