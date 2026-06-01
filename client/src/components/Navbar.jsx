import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Brand from './Brand.jsx';

const menuLinks = [
  { label: 'Inicio', to: '/#inicio' },
  { label: 'Maestros', to: '/#maestros' },
  { label: 'Horarios', to: '/#horarios' },
  { label: 'Tarifas', to: '/#tarifas' },
  { label: 'Instalaciones', to: '/#instalaciones' },
  { label: 'Contacto', to: '/#contacto' },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0c1219]/88 backdrop-blur-xl">
      <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Brand size="navbar-xl" />

        <div className="hidden items-center gap-7 lg:flex">
          {menuLinks.map(({ label, to }) => (
            <Link
              className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-300/90 transition hover:text-white"
              key={label}
              to={to}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            aria-expanded={mobileMenuOpen}
            aria-label="Abrir menu"
            className="rounded-md border border-white/15 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-200 transition hover:bg-white/5 lg:hidden"
            onClick={() => setMobileMenuOpen((current) => !current)}
            type="button"
          >
            Menu
          </button>
          <NavLink
            className="rounded-md px-2 py-3 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-slate-200 transition hover:text-white sm:px-4 sm:text-xs"
            to="/login"
            onClick={closeMobileMenu}
          >
            Iniciar sesion
          </NavLink>
          <NavLink
            className="rounded-md bg-amber-500 px-3 py-3 text-[0.7rem] font-black uppercase tracking-[0.12em] text-black transition hover:bg-amber-400 sm:px-6 sm:text-xs"
            to="/register"
            onClick={closeMobileMenu}
          >
            APÚNTATE!
          </NavLink>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#101722] px-5 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {menuLinks.map(({ label, to }) => (
              <Link
                className="rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-[0.13em] text-slate-300 transition hover:bg-white/5 hover:text-white"
                key={label}
                onClick={closeMobileMenu}
                to={to}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
