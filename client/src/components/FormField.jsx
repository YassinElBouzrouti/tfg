function FormField({
  label,
  name,
  placeholder,
  type = 'text',
  value,
  onChange,
  required = false,
  children,
}) {
  const commonClassName =
    'w-full rounded-lg border border-white/10 bg-[#0b1016] px-4 py-3.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20';

  return (
    <label className="block" htmlFor={name}>
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
        {label}
      </span>
      {children ? (
        <select
          className={commonClassName}
          id={name}
          name={name}
          onChange={onChange}
          required={required}
          value={value}
        >
          {children}
        </select>
      ) : (
        <input
          className={commonClassName}
          id={name}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
      )}
    </label>
  );
}

export default FormField;
