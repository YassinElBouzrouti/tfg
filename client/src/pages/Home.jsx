import { useEffect, useMemo, useState } from 'react';
import axiosClient from '../api/axiosClient.js';
import ClubInfoSection from '../components/home/ClubInfoSection.jsx';
import ContactSection from '../components/home/ContactSection.jsx';
import HeroSection from '../components/home/HeroSection.jsx';
import InstallationsSection from '../components/home/InstallationsSection.jsx';
import PricingSection from '../components/home/PricingSection.jsx';
import ScheduleSection from '../components/home/ScheduleSection.jsx';
import TeachersSection from '../components/home/TeachersSection.jsx';
import apiErrorMessage from '../utils/apiError.js';

const teachers = [
  {
    name: 'Carlos Romero',
    specialty: 'Boxeo',
    bio: 'Trabajo tecnico de golpeo, defensa y ritmo de combate.',
    image: '/images/teachers/carlos-romero.png',
  },
  {
    name: 'Marcos Silva',
    specialty: 'Jiujitsu y Grappling',
    bio: 'Especialista en control, transiciones y lucha de suelo.',
    image: '/images/teachers/marcos-silva.png',
  },
  {
    name: 'Alejandro Torres',
    specialty: 'Muay Thai y MMA',
    bio: 'Clases de striking y trabajo mixto para mejorar tu rendimiento.',
    image: '/images/teachers/alejandro-torres.png',
  },
];

const schedule = [
  { day: 'Lunes', time: '09:30 - 11:00', discipline: 'Boxeo' },
  { day: 'Lunes', time: '11:15 - 12:45', discipline: 'Jiujitsu' },
  { day: 'Lunes', time: '17:00 - 18:30', discipline: 'Muay Thai' },
  { day: 'Lunes', time: '18:45 - 20:15', discipline: 'Boxeo' },
  { day: 'Lunes', time: '20:30 - 22:00', discipline: 'Sparring Libre' },
  { day: 'Martes', time: '09:30 - 11:00', discipline: 'Boxeo' },
  { day: 'Martes', time: '11:15 - 12:45', discipline: 'Grappling' },
  { day: 'Martes', time: '17:00 - 18:30', discipline: 'MMA' },
  { day: 'Martes', time: '18:45 - 20:15', discipline: 'Boxeo' },
  { day: 'Martes', time: '20:30 - 22:00', discipline: 'Sparring Libre' },
  { day: 'Miercoles', time: '09:30 - 11:00', discipline: 'Boxeo' },
  { day: 'Miercoles', time: '11:15 - 12:45', discipline: 'Jiujitsu' },
  { day: 'Miercoles', time: '17:00 - 18:30', discipline: 'Muay Thai' },
  { day: 'Miercoles', time: '18:45 - 20:15', discipline: 'Boxeo' },
  { day: 'Miercoles', time: '20:30 - 22:00', discipline: 'Sparring Libre' },
  { day: 'Jueves', time: '09:30 - 11:00', discipline: 'Boxeo' },
  { day: 'Jueves', time: '11:15 - 12:45', discipline: 'Grappling' },
  { day: 'Jueves', time: '17:00 - 18:30', discipline: 'MMA' },
  { day: 'Jueves', time: '18:45 - 20:15', discipline: 'Boxeo' },
  { day: 'Jueves', time: '20:30 - 22:00', discipline: 'Sparring Libre' },
  { day: 'Viernes', time: '09:30 - 11:00', discipline: 'Boxeo' },
  { day: 'Viernes', time: '11:15 - 12:45', discipline: 'Jiujitsu' },
  { day: 'Viernes', time: '17:00 - 18:30', discipline: 'Muay Thai' },
  { day: 'Viernes', time: '18:45 - 20:15', discipline: 'Boxeo' },
  { day: 'Viernes', time: '20:30 - 22:00', discipline: 'Sparring Libre' },
  { day: 'Sabado', time: '09:30 - 11:00', discipline: 'Boxeo' },
  { day: 'Sabado', time: '11:15 - 12:45', discipline: 'Grappling' },
];

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

const planFeaturesByName = {
  'B\u00e1sica': ['2 clases por semana', 'Acceso a zona tatami', 'Seguimiento inicial'],
  Completa: ['Clases ilimitadas', 'Acceso a zona de fuerza', 'Asesoria mensual'],
  Premium: ['Todo incluido', 'Sesion personal mensual', 'Evaluacion de rendimiento'],
};

const installations = [
  {
    name: 'Fachada exterior',
    description: 'Entrada principal del club con zona exterior de entrenamiento.',
    image: '/images/installations/fachada-exterior.png',
  },
  {
    name: 'Zona de tatami',
    description: 'Superficie amplia para practica tecnica y sparring controlado.',
    image: '/images/installations/tatami.png',
  },
  {
    name: 'Sala de entrenamiento',
    description: 'Espacio principal para clases colectivas y circuitos funcionales.',
    image: '/images/installations/sala-entrenamiento.png',
  },
  {
    name: 'Vestuarios',
    description: 'Taquillas individuales y duchas para una experiencia comoda.',
    image: '/images/installations/vestuarios.png',
  },
  {
    name: 'Recepcion',
    description: 'Punto de atencion para informacion, pagos y membresias.',
    image: '/images/installations/recepcion.png',
  },
];

function Home() {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plansError, setPlansError] = useState('');

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
        setPlans(data?.plans || []);
      } catch (requestError) {
        if (mounted) {
          setPlans([]);
          setPlansError(apiErrorMessage(requestError, 'No se pudieron cargar las tarifas'));
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
    };
  }, []);

  const publicPlans = useMemo(() => {
    const uniquePlans = new Map();

    for (const plan of plans) {
      const normalizedPlanName = normalizePlanName(plan.name);
      if (!normalizedPlanName || uniquePlans.has(normalizedPlanName)) {
        continue;
      }

      uniquePlans.set(normalizedPlanName, {
        ...plan,
        name: normalizedPlanName,
        price: `${plan.price} EUR`,
        features: planFeaturesByName[normalizedPlanName] || ['Acceso al club', 'Tarifa mensual'],
        highlight: normalizedPlanName === 'Completa',
      });
    }

    return OFFICIAL_PLAN_NAMES.map((planName) => uniquePlans.get(planName)).filter(Boolean);
  }, [plans]);

  return (
    <>
      <main>
        <HeroSection />
        <ClubInfoSection />
        <TeachersSection teachers={teachers} />
        <ScheduleSection sessions={schedule} />
        <PricingSection error={plansError} loading={loadingPlans} plans={publicPlans} />
        <InstallationsSection installations={installations} />
        <ContactSection />
      </main>
      <footer className="border-t border-white/10 bg-[#0a0e14] py-7 text-center text-xs font-semibold tracking-[0.08em] text-slate-500">
        Yassin&apos;s GYM - Artes marciales y entrenamiento
      </footer>
    </>
  );
}

export default Home;
