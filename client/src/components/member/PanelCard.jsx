function PanelCard({ action, children, className = '', description, title }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-[#111922] p-6 ${className}`}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black tracking-tight text-white">
            {title}
          </h2>
          {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default PanelCard;
