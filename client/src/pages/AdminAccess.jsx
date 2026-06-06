import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient.js';
import AuthCard from '../components/AuthCard.jsx';
import apiErrorMessage from '../utils/apiError.js';
import { clearAuthSession, getAuthToken, saveAuthSession } from '../utils/authSession.js';

function AdminAccess() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingSession, setLoadingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function validateSession() {
      const token = getAuthToken();
      if (!token) {
        if (mounted) {
          setLoadingSession(false);
        }
        return;
      }

      try {
        const { data } = await axiosClient.get('/auth/me');
        if (!mounted) {
          return;
        }

        if (data?.user?.role === 'ADMIN') {
          navigate('/admin', { replace: true });
          return;
        }

        setError('No tienes permisos de administrador');
      } catch {
        clearAuthSession();
      } finally {
        if (mounted) {
          setLoadingSession(false);
        }
      }
    }

    validateSession();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data } = await axiosClient.post('/auth/login', { email, password });

      if (data?.user?.role !== 'ADMIN') {
        clearAuthSession();
        setError('No tienes permisos de administrador');
        return;
      }

      saveAuthSession({ token: data.token, user: data.user });
      navigate('/admin', { replace: true });
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        setError('Credenciales incorrectas');
      } else {
        setError(apiErrorMessage(requestError, 'No se pudo iniciar sesion de administrador'));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-4.6rem)] max-w-7xl content-center gap-8 px-5 py-12 sm:py-16 lg:px-8">
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-amber-300">Acceso privado</p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
          Administracion de Yassin&apos;s GYM
        </h1>
      </section>

      <AuthCard
        description="Introduce tus credenciales para acceder al panel de administracion."
        footerLink={{ label: 'Iniciar sesion de miembro', to: '/login' }}
        footerText="Eres miembro?"
        title="Acceso admin"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
              Correo electronico
            </span>
            <input
              className="w-full rounded-lg border border-white/10 bg-[#0b1016] px-4 py-3.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
              disabled={loadingSession}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@yassinsgym.com"
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
              disabled={loadingSession}
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
            disabled={loadingSession || submitting}
            type="submit"
          >
            {loadingSession ? 'Verificando...' : submitting ? 'Entrando...' : 'Iniciar sesion'}
          </button>
        </form>
      </AuthCard>
    </main>
  );
}

export default AdminAccess;
