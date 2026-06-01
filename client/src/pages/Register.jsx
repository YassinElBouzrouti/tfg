import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient.js';
import AuthCard from '../components/AuthCard.jsx';
import FormField from '../components/FormField.jsx';
import apiErrorMessage from '../utils/apiError.js';
import { saveAuthSession } from '../utils/authSession.js';

const OFFICIAL_PLAN_NAMES = ['B\u00e1sica', 'Completa', 'Premium'];
const PLAN_NAME_BY_ALIAS = {
  basica: 'B\u00e1sica',
  baasica: 'B\u00e1sica',
  completa: 'Completa',
  premium: 'Premium',
};

function buildPlanKey(name) {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
}

function normalizePlanName(name) {
  if (typeof name !== 'string') {
    return null;
  }

  return PLAN_NAME_BY_ALIAS[buildPlanKey(name)] || null;
}

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlanId = searchParams.get('planId')?.trim() || '';
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    planId: '',
  });
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plansError, setPlansError] = useState('');
  const [plansReloadKey, setPlansReloadKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const redirectTimerRef = useRef(null);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  useEffect(() => {
    let mounted = true;

    async function loadPlans() {
      setLoadingPlans(true);
      setPlansError('');
      try {
        const { data } = await axiosClient.get('/plans');
        if (!mounted) {
          return;
        }

        const uniquePlans = new Map();
        for (const plan of data?.plans || []) {
          const normalizedPlanName = normalizePlanName(plan.name);
          if (!normalizedPlanName || uniquePlans.has(normalizedPlanName)) {
            continue;
          }

          uniquePlans.set(normalizedPlanName, {
            ...plan,
            name: normalizedPlanName,
          });
        }

        const loadedPlans = OFFICIAL_PLAN_NAMES.map((planName) => uniquePlans.get(planName)).filter(
          Boolean,
        );

        setPlans(loadedPlans);
        const selectedPlanExists = loadedPlans.some((plan) => plan.id === selectedPlanId);
        if (selectedPlanExists) {
          setForm((current) => ({ ...current, planId: selectedPlanId }));
        }
        if (loadedPlans.length === 0) {
          setPlansError('No hay tarifas disponibles');
        }
      } catch (requestError) {
        if (mounted) {
          setPlansError(apiErrorMessage(requestError, 'No se pudieron cargar las tarifas'));
          setPlans([]);
        }
      } finally {
        if (mounted) {
          setLoadingPlans(false);
        }
      }
    }

    loadPlans();

    return () => {
      mounted = false;
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [plansReloadKey, selectedPlanId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    if (!form.planId) {
      setError('Debes seleccionar una tarifa');
      setSubmitting(false);
      return;
    }

    try {
      const { data } = await axiosClient.post('/auth/register', {
        name: form.name,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        planId: form.planId,
      });

      if (data?.token && data?.user) {
        saveAuthSession({ token: data.token, user: data.user });
      }

      setSuccessMessage('Te has apuntado con exito');
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
      redirectTimerRef.current = setTimeout(() => {
        navigate('/member', { replace: true });
      }, 4000);
    } catch (requestError) {
      const code = requestError?.response?.data?.error?.code;
      if (code === 'EMAIL_ALREADY_EXISTS') {
        setError('El correo ya esta registrado');
      } else if (code === 'VALIDATION_ERROR') {
        setError('Faltan campos obligatorios');
      } else if (code === 'PLAN_REQUIRED') {
        setError('Debes seleccionar una tarifa');
      } else if (code === 'PLAN_NOT_FOUND') {
        setError('La tarifa seleccionada no existe');
      } else if (code === 'PLAN_NOT_AVAILABLE') {
        setError('La tarifa seleccionada no esta disponible');
      } else {
        setError(apiErrorMessage(requestError, 'No se pudo completar el registro'));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-4.6rem)] max-w-7xl content-center gap-8 px-5 py-12 sm:py-16 lg:px-8">
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-amber-300">Alta de miembros</p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
          Apuntate a Yassin&apos;s GYM
        </h1>
      </section>

      <AuthCard
        description="Completa tus datos y empieza a reservar tus clases."
        footerLink={{ label: 'Iniciar sesion', to: '/login' }}
        footerText="Ya tienes una cuenta?"
        title="Registro"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <FormField
            label="Nombre"
            name="name"
            onChange={handleInputChange}
            placeholder="Tu nombre"
            required
            value={form.name}
          />
          <FormField
            label="Apellidos"
            name="lastName"
            onChange={handleInputChange}
            placeholder="Tus apellidos"
            required
            value={form.lastName}
          />
          <FormField
            label="Correo electronico"
            name="email"
            onChange={handleInputChange}
            placeholder="tu@email.com"
            required
            type="email"
            value={form.email}
          />
          <FormField
            label="Telefono"
            name="phone"
            onChange={handleInputChange}
            placeholder="+34 600 000 000"
            required
            value={form.phone}
          />
          <FormField
            label="Contrasena"
            name="password"
            onChange={handleInputChange}
            placeholder="Minimo 8 caracteres"
            required
            type="password"
            value={form.password}
          />
          <FormField
            label="Tarifa"
            name="planId"
            onChange={handleInputChange}
            required
            value={form.planId}
          >
            <option value="">
              {loadingPlans ? 'Cargando tarifas...' : 'Selecciona una tarifa'}
            </option>
            {!loadingPlans && plans.length === 0 && <option value="">No hay tarifas disponibles</option>}
            {!loadingPlans &&
              plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - {plan.price} EUR
                </option>
              ))}
          </FormField>

          {plansError && (
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              <p>{plansError}</p>
              <button
                className="mt-3 rounded-md border border-amber-400/30 px-3 py-2 text-xs font-bold uppercase tracking-wider text-amber-200 transition hover:bg-amber-500/10"
                onClick={() => setPlansReloadKey((current) => current + 1)}
                type="button"
              >
                Reintentar
              </button>
            </div>
          )}

          {successMessage && (
            <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
              {successMessage}
            </p>
          )}

          {error && (
            <p className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300">
              {error}
            </p>
          )}

          <button
            className="mt-3 w-full rounded-lg bg-amber-500 px-5 py-4 text-sm font-black tracking-wide text-black transition hover:bg-amber-400"
            disabled={loadingPlans || submitting || !form.planId}
            type="submit"
          >
            {submitting ? 'Enviando...' : 'Apuntate!'}
          </button>
        </form>
      </AuthCard>
    </main>
  );
}

export default Register;
