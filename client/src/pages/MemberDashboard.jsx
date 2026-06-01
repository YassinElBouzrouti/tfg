import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import axiosClient from '../api/axiosClient.js';
import DashboardShell from '../components/DashboardShell.jsx';
import AttendanceCard from '../components/member/AttendanceCard.jsx';
import BookingsCard from '../components/member/BookingsCard.jsx';
import ClassesCard from '../components/member/ClassesCard.jsx';
import MembershipCard from '../components/member/MembershipCard.jsx';
import PaymentsCard from '../components/member/PaymentsCard.jsx';
import UserProfileCard from '../components/member/UserProfileCard.jsx';
import apiErrorMessage from '../utils/apiError.js';

const dayLabels = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miercoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sabado',
  SUNDAY: 'Domingo',
};

function formatDate(value) {
  return new Date(value).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(value) {
  return new Date(value).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalizePaymentStatus(status) {
  if (status === 'PAID') {
    return 'PAGADO';
  }
  if (status === 'PENDING') {
    return 'PENDIENTE';
  }
  return status;
}

function normalizeBookingStatus(status) {
  if (status === 'CONFIRMED') {
    return 'CONFIRMADA';
  }
  if (status === 'PENDING') {
    return 'PENDIENTE';
  }
  return status;
}

function currentMembership(user) {
  if (!user?.memberships?.length) {
    return null;
  }

  return (
    user.memberships.find((membership) => membership.status === 'ACTIVE') ||
    user.memberships.find((membership) => membership.status === 'PENDING') ||
    user.memberships[0]
  );
}

function mapUserProfile(user) {
  const fullName = `${user.name} ${user.lastName}`.trim();
  const initials = `${user.name?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  return {
    initials: initials || 'MM',
    fullName,
    memberNumber: user.id.slice(-6).toUpperCase(),
    email: user.email,
    phone: user.phone || 'Sin telefono',
    memberSince: formatDate(user.createdAt),
  };
}

function mapMembershipCard(membership) {
  if (!membership) {
    return {
      description: 'No tienes membresia activa en este momento.',
      plan: 'Sin membresia',
      price: '0,00 EUR',
      renewal: '-',
      status: 'PENDING',
    };
  }

  return {
    description: membership.plan?.description || 'Tarifa del gimnasio',
    plan: membership.plan?.name || 'Plan',
    price: `${membership.plan?.price || 0} EUR`,
    renewal: formatDate(membership.endDate),
    status: membership.status,
  };
}

function mapPayments(payments) {
  return payments.map((payment) => ({
    id: payment.id,
    concept: payment.membership?.plan?.name
      ? `Cuota ${payment.membership.plan.name}`
      : 'Pago de membresia',
    date: formatDate(payment.dueDate),
    method: payment.method || 'Manual',
    amount: `${payment.amount} ${payment.currency}`,
    status: normalizePaymentStatus(payment.status),
  }));
}

function mapBookings(bookings) {
  return bookings.map((booking) => ({
    id: booking.id,
    classId: booking.martialClassId,
    className: booking.martialClass.name,
    date: formatDate(booking.scheduledFor),
    time: `${booking.martialClass.startTime} - ${booking.martialClass.endTime}`,
    status: normalizeBookingStatus(booking.status),
    attendance: booking.attendance,
    coach: booking.martialClass.instructorName,
  }));
}

function mapAttendanceHistory(bookings) {
  return bookings
    .filter((booking) => booking.attendance?.attended)
    .map((booking) => ({
      id: booking.id,
      className: booking.martialClass.name,
      date: formatDateTime(booking.scheduledFor),
      coach: booking.martialClass.instructorName,
    }));
}

function mapAvailableClasses(classes) {
  return classes.map((martialClass) => ({
    id: martialClass.id,
    discipline: martialClass.discipline,
    name: martialClass.name,
    day: dayLabels[martialClass.dayOfWeek] || martialClass.dayOfWeek,
    time: `${martialClass.startTime} - ${martialClass.endTime}`,
    coach: martialClass.instructorName,
    spots: `${martialClass.availableSpots}/${martialClass.capacity}`,
    nextSessionAt: martialClass.nextSessionAt,
    nextSessionLabel: formatDateTime(martialClass.nextSessionAt),
    alreadyBooked: martialClass.alreadyBooked,
  }));
}

function MemberDashboard() {
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [simulatingPayment, setSimulatingPayment] = useState(false);
  const [reservingClassId, setReservingClassId] = useState('');

  const reservedClassIds = useMemo(() => bookings.map((booking) => booking.classId), [bookings]);
  const profile = user ? mapUserProfile(user) : null;
  const membership = mapMembershipCard(currentMembership(user));

  async function loadMemberPanel() {
    setLoading(true);
    setError('');

    try {
      const [userResponse, paymentsResponse, bookingsResponse, classesResponse] = await Promise.all([
        axiosClient.get('/auth/me'),
        axiosClient.get('/payments/me'),
        axiosClient.get('/bookings/me'),
        axiosClient.get('/bookings/classes'),
      ]);

      setUser(userResponse.data.user);
      setPayments(mapPayments(paymentsResponse.data.payments || []));
      setBookings(mapBookings(bookingsResponse.data.bookings || []));
      setAttendanceHistory(mapAttendanceHistory(bookingsResponse.data.bookings || []));
      setAvailableClasses(mapAvailableClasses(classesResponse.data.classes || []));
    } catch (requestError) {
      setError(apiErrorMessage(requestError, 'No se pudo cargar el panel de miembro.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMemberPanel();
  }, []);

  async function handleSimulatePayment() {
    setSimulatingPayment(true);
    setError('');

    try {
      await axiosClient.post('/payments/simulate');
      setFeedback('Pago simulado registrado con estado PAID.');
      await loadMemberPanel();
    } catch (requestError) {
      setError(apiErrorMessage(requestError, 'No se pudo simular el pago.'));
    } finally {
      setSimulatingPayment(false);
    }
  }

  async function handleBookClass(martialClass) {
    setReservingClassId(martialClass.id);
    setError('');

    try {
      await axiosClient.post('/bookings', {
        martialClassId: martialClass.id,
        scheduledFor: martialClass.nextSessionAt,
      });
      setFeedback(`Reserva confirmada para ${martialClass.name}.`);
      await loadMemberPanel();
    } catch (requestError) {
      setError(apiErrorMessage(requestError, 'No se pudo registrar la reserva.'));
    } finally {
      setReservingClassId('');
    }
  }

  if (loading) {
    return (
      <DashboardShell label="Area miembro" title="Tu entrenamiento">
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#10141a] p-6 text-slate-300">
          Cargando panel de miembro...
        </div>
      </DashboardShell>
    );
  }

  if (!user) {
    return (
      <DashboardShell label="Area miembro" title="Tu entrenamiento">
        <div className="mt-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-300">
          {error || 'No se pudo identificar al usuario.'}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell label="Area miembro" title={`Hola, ${user.name}`}>
      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-400">
          Controla tu membresia, pagos y entrenamientos desde un solo lugar.
        </p>
        {feedback && (
          <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400">
            {feedback}
          </p>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      )}

      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <UserProfileCard user={profile} />
        <MembershipCard membership={membership} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <PaymentsCard
          className="xl:col-span-3"
          onSimulatePayment={handleSimulatePayment}
          payments={payments}
          simulating={simulatingPayment}
        />
        <ClassesCard
          className="xl:col-span-2"
          classes={availableClasses}
          onBookClass={handleBookClass}
          reservingClassId={reservingClassId}
          reservedClassIds={reservedClassIds}
        />
        <BookingsCard bookings={bookings} />
        <div className="xl:col-span-3">
          <AttendanceCard attendances={attendanceHistory} />
        </div>
      </div>
    </DashboardShell>
  );
}

export default MemberDashboard;
