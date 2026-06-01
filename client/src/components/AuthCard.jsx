import { Link } from 'react-router-dom';

function AuthCard({ children, description, footerLink, footerText, title }) {
  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#111922] p-7 shadow-xl shadow-black/30 sm:p-9">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
        Yassin&apos;s GYM
      </p>
      <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
      <div className="mt-8">{children}</div>
      <p className="mt-7 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
        {footerText}{' '}
        <Link className="font-bold text-amber-400 hover:text-amber-300" to={footerLink.to}>
          {footerLink.label}
        </Link>
      </p>
    </section>
  );
}

export default AuthCard;
