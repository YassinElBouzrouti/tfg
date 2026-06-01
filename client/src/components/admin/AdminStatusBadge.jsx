const styles = {
  ACTIVE: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  PAID: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  CONFIRMED: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
  PENDING: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  EXPIRED: 'border-slate-500/30 bg-slate-500/10 text-slate-400',
  CANCELLED: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
};

function AdminStatusBadge({ value }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-widest ${
        styles[value] || 'border-slate-500/30 bg-slate-500/10 text-slate-400'
      }`}
    >
      {value}
    </span>
  );
}

export default AdminStatusBadge;
