import PanelCard from './PanelCard.jsx';
import StatusBadge from './StatusBadge.jsx';

function BookingsCard({ bookings, className = '' }) {
  return (
    <PanelCard className={className} description="Proximas sesiones confirmadas" title="Mis reservas">
      <div className="space-y-4">
        {bookings.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-[#0b0e12] p-4 text-sm text-slate-400">
            Todavia no tienes reservas activas.
          </p>
        )}
        {bookings.map((booking) => (
          <article className="rounded-xl border border-white/10 bg-[#0b0e12] p-4" key={booking.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-white">{booking.className}</p>
                <p className="mt-2 text-sm text-slate-400">
                  {booking.date} - {booking.time}
                </p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
          </article>
        ))}
      </div>
    </PanelCard>
  );
}

export default BookingsCard;
