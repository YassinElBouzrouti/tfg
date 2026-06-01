function AdminCard({ children, description, title }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#111922] p-6">
      <h2 className="font-display text-2xl font-black tracking-tight text-white">{title}</h2>
      {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default AdminCard;
