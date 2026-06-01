import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient.js';
import AuthCard from '../components/AuthCard.jsx';
import apiErrorMessage from '../utils/apiError.js';
import { clearAuthSession, saveAuthSession } from '../utils/authSession.js';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data } = await axiosClient.post('/auth/login', { email, password });
      if (data.user.role === 'ADMIN') {
        clearAuthSession();
        setError('El acceso de administrador se realiza desde la ruta privada correspondiente');
        return;
      }

      saveAuthSession({ token: data.token, user: data.user });
      navigate('/member');
    } catch (requestError) {
      setError(apiErrorMessage(requestError, 'No se pudo iniciar sesion.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-4.6rem)] max-w-7xl content-center gap-8 px-5 py-12 sm:py-16 lg:px-8">
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-amber-300">Acceso de miembros</p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
          Inicia sesión en Yassin&apos;s GYM
        </h1>
      </section>

      <AuthCard
        description="Accede a tu zona privada para gestionar clases, reservas y pagos."
        footerLink={{ label: 'APÚNTATE!', to: '/register' }}
        footerText="Todavia no eres miembro?"
        title="Iniciar sesión"
      >
        {location.state?.reason && (
          <p className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {location.state.reason}
          </p>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
              Correo electronico
            </span>
            <input
              className="w-full rounded-lg border border-white/10 bg-[#0b1016] px-4 py-3.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@email.com"
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
              Contrasena
            </span>
            <input
              className="w-full rounded-lg border border-white/10 bg-[#0b1016] px-4 py-3.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
              required
              type="password"
              value={password}
            />
          </label>

          {error && (
            <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            className="mt-3 w-full rounded-lg bg-amber-500 px-5 py-4 text-sm font-black uppercase tracking-widest text-black transition enabled:hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-200"
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>
      </AuthCard>
    </main>
  );
}

export default Login;
