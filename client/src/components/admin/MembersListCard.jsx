import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminCard from './AdminCard.jsx';
import AdminStatusBadge from './AdminStatusBadge.jsx';

function MembersListCard({ members, onRegisterCashPayment, onUpdatePaymentStatus }) {
  const [cashAmounts, setCashAmounts] = useState({});

  function updateCashAmount(memberId, amount) {
    setCashAmounts((current) => ({ ...current, [memberId]: amount }));
  }

  return (
    <AdminCard description="Estado actual de miembros y cuotas" title="Miembros">
      <div className="space-y-4">
        {members.map((member) => (
          <article className="rounded-xl border border-white/10 bg-[#0b0f13] p-4" key={member.id}>
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="font-bold text-white">
                  {member.name} {member.lastName}
                </p>
                <p className="mt-1 text-sm text-slate-400">{member.email}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                  Plan: {member.membership?.plan?.name || 'Sin plan'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <AdminStatusBadge value={member.latestPayment?.status || 'PENDING'} />
                <button
                  className="rounded-md border border-emerald-500/35 px-3 py-2 text-xs font-bold uppercase tracking-wider text-emerald-300 transition enabled:hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
                  disabled={!member.latestPayment?.id}
                  onClick={() =>
                    onUpdatePaymentStatus(
                      member.latestPayment.id,
                      member.latestPayment.status === 'PAID' ? 'PENDING' : 'PAID',
                    )
                  }
                  type="button"
                >
                  {member.latestPayment?.status === 'PAID'
                    ? 'Marcar PENDING'
                    : 'Marcar PAID'}
                </button>
                <Link
                  className="rounded-md border border-white/20 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 transition hover:border-white/40"
                  to={`/admin/members/${member.id}`}
                >
                  Ver perfil
                </Link>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                className="w-36 rounded-md border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-slate-200 outline-none transition focus:border-amber-400"
                onChange={(event) => updateCashAmount(member.id, event.target.value)}
                placeholder="Importe opcional"
                type="number"
                value={cashAmounts[member.id] || ''}
              />
              <button
                className="rounded-md border border-amber-400/35 px-3 py-2 text-xs font-bold uppercase tracking-wider text-amber-300 transition enabled:hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
                disabled={!member.membership?.id}
                onClick={() => onRegisterCashPayment(member.id, cashAmounts[member.id])}
                type="button"
              >
                Registrar efectivo
              </button>
            </div>
          </article>
        ))}
      </div>
    </AdminCard>
  );
}

export default MembersListCard;
