import { Link } from 'react-router-dom';
import Brand from './Brand.jsx';
import { clearAuthSession } from '../utils/authSession.js';

function DashboardShell({ children, label, title }) {
  return (
    <div className="min-h-screen bg-[#0b1118] text-white">
      <header className="border-b border-white/10 bg-[#101721]">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Brand size="navbar-xl" />
          <div className="flex items-center gap-5">
            <span className="hidden rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-300 sm:inline-block">
              {label}
            </span>
            <Link
              className="text-sm font-semibold text-slate-400 transition hover:text-white"
              onClick={clearAuthSession}
              to="/"
            >
              Salir
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">{label}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Yassin&apos;s GYM
        </p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-5xl">
          {title}
        </h1>
        {children}
      </main>
    </div>
  );
}

export default DashboardShell;
