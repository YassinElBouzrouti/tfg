import PanelCard from './PanelCard.jsx';
import StatusBadge from './StatusBadge.jsx';

function MembershipCard({ membership }) {
  return (
    <PanelCard
      action={<StatusBadge status={membership.status} />}
      description="Tu tarifa activa"
      title="Membresia"
    >
      <p className="font-display text-3xl font-black uppercase text-white">{membership.plan}</p>
      <p className="mt-2 text-sm text-slate-400">{membership.description}</p>
      <div className="mt-7 grid grid-cols-2 gap-4 rounded-xl bg-white/[0.03] p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Mensualidad</p>
          <p className="mt-2 text-xl font-bold text-white">{membership.price}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Renovacion</p>
          <p className="mt-2 text-xl font-bold text-white">{membership.renewal}</p>
        </div>
      </div>
    </PanelCard>
  );
}

export default MembershipCard;

