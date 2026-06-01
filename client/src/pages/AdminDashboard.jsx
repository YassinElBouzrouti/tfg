import DashboardShell from '../components/DashboardShell.jsx';

const metrics = [
  { label: 'Miembros activos', value: '450' },
  { label: 'Clases hoy', value: '18' },
  { label: 'Ocupacion media', value: '84%' },
  { label: 'Altas pendientes', value: '07' },
];

function AdminDashboard() {
  return (
    <DashboardShell label="Administracion" title="Panel de control">
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <article className="rounded-xl border border-white/10 bg-[#11151b] p-6" key={metric.label}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
            <p className="mt-4 font-display text-4xl font-black text-white">{metric.value}</p>
          </article>
        ))}
      </div>
      <section className="mt-8 rounded-xl border border-white/10 bg-[#11151b] p-7">
        <h2 className="font-display text-2xl font-black uppercase">Gestion del gimnasio</h2>
        <p className="mt-3 text-sm text-slate-400">
          La administracion de miembros, instructores y clases se incorporara en la siguiente fase.
        </p>
      </section>
    </DashboardShell>
  );
}

export default AdminDashboard;
