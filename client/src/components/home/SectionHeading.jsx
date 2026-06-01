function SectionHeading({ badge, title, description, align = 'left' }) {
  const containerClass =
    align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left';

  return (
    <div className={containerClass}>
      {badge && (
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.25em] text-amber-300">
          {badge}
        </p>
      )}
      <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>}
    </div>
  );
}

export default SectionHeading;
