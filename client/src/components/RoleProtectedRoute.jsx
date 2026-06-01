import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient.js';
import { clearAuthSession, getAuthToken } from '../utils/authSession.js';
import apiErrorMessage from '../utils/apiError.js';

function RoleProtectedRoute({ allowedRoles, children, redirectTo = '/login' }) {
  const [state, setState] = useState({
    loading: true,
    allowed: false,
    error: '',
  });

  useEffect(() => {
    let mounted = true;

    async function validateRole() {
      const token = getAuthToken();
      if (!token) {
        if (mounted) {
          setState({ loading: false, allowed: false, error: '' });
        }
        return;
      }

      try {
        const { data } = await axiosClient.get('/auth/me');
        const role = data?.user?.role;
        const allowed = allowedRoles.includes(role);

        if (mounted) {
          setState({ loading: false, allowed, error: allowed ? '' : 'No autorizado' });
        }
      } catch (error) {
        clearAuthSession();
        if (mounted) {
          setState({
            loading: false,
            allowed: false,
            error: apiErrorMessage(error, 'Tu sesion no es valida.'),
          });
        }
      }
    }

    validateRole();

    return () => {
      mounted = false;
    };
  }, [allowedRoles]);

  if (state.loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 text-center">
        <div className="rounded-2xl border border-white/10 bg-[#10141a] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Verificando acceso</p>
          <p className="mt-3 text-slate-300">Comprobando permisos del panel...</p>
        </div>
      </main>
    );
  }

  if (!state.allowed) {
    return <Navigate replace state={{ reason: state.error }} to={redirectTo} />;
  }

  return children;
}

export default RoleProtectedRoute;
