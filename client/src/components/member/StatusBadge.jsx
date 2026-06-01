const styles = {
  ACTIVE: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  ASISTIDA: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  CONFIRMADA: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
  PAID: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  PENDING: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  PAGADO: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  PENDIENTE: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-widest ${
        styles[status] || 'border-slate-500/30 bg-slate-500/10 text-slate-400'
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
