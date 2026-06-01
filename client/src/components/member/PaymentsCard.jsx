import PanelCard from './PanelCard.jsx';
import StatusBadge from './StatusBadge.jsx';

function PaymentsCard({ className = '', onSimulatePayment, payments, simulating }) {
  return (
    <PanelCard
      className={className}
      action={
        <button
          className="rounded-lg bg-amber-500 px-4 py-3 text-xs font-black uppercase tracking-widest text-black transition enabled:hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          disabled={simulating}
          onClick={onSimulatePayment}
          type="button"
        >
          {simulating ? 'Procesando...' : 'Simular pago'}
        </button>
      }
      description="Seguimiento de cuotas y cobros"
      title="Pagos"
    >
      <div className="space-y-3">
        {payments.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-[#0b0e12] p-4 text-sm text-slate-400">
            Todavia no hay pagos registrados.
          </p>
        )}
        {payments.map((payment) => (
          <article
            className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-[#0b0e12] p-4 sm:flex-row sm:items-center"
            key={payment.id}
          >
            <div>
              <p className="font-semibold text-white">{payment.concept}</p>
              <p className="mt-1 text-sm text-slate-500">{payment.date} - {payment.method}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-bold text-white">{payment.amount}</p>
              <StatusBadge status={payment.status} />
            </div>
          </article>
        ))}
      </div>
    </PanelCard>
  );
}

export default PaymentsCard;
