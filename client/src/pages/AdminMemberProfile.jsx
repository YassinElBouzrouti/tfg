import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell.jsx';
import AdminCard from '../components/admin/AdminCard.jsx';
import AdminStatusBadge from '../components/admin/AdminStatusBadge.jsx';
import axiosClient from '../api/axiosClient.js';
import apiErrorMessage from '../utils/apiError.js';

function AdminMemberProfile() {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadMember() {
      setLoading(true);
      setError('');

      try {
        const { data } = await axiosClient.get(`/admin/members/${memberId}`);
        if (mounted) {
          setMember(data.member);
        }
      } catch (requestError) {
        if (mounted) {
          setError(apiErrorMessage(requestError, 'No se pudo cargar el perfil del miembro.'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMember();

    return () => {
      mounted = false;
    };
  }, [memberId]);

  if (loading) {
    return (
      <DashboardShell label="Administracion privada" title="Perfil de miembro">
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#10141a] p-6 text-slate-300">
          Cargando perfil...
        </div>
      </DashboardShell>
    );
  }

  if (error || !member) {
    return (
      <DashboardShell label="Administracion privada" title="Perfil de miembro">
        <div className="mt-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-300">
          {error || 'No se encontro el miembro.'}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell label="Administracion privada" title="Perfil de miembro">
      <div className="mt-4">
        <Link
          className="text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white"
          to="/admin/dashboard"
        >
          Volver al panel
        </Link>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <AdminCard title={`${member.name} ${member.lastName}`}>
          <p className="text-sm text-slate-300">{member.email}</p>
          <p className="mt-1 text-sm text-slate-400">{member.phone}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
            Alta: {new Date(member.createdAt).toLocaleDateString('es-ES')}
          </p>
        </AdminCard>

        <div className="xl:col-span-2">
          <AdminCard description="Tarifas del miembro y estado" title="Membresias">
            <div className="space-y-3">
              {member.memberships.map((membership) => (
                <article
                  className="rounded-xl border border-white/10 bg-[#0b0f13] p-4"
                  key={membership.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{membership.plan.name}</p>
                    <AdminStatusBadge value={membership.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    {new Date(membership.startDate).toLocaleDateString('es-ES')} -{' '}
                    {new Date(membership.endDate).toLocaleDateString('es-ES')}
                  </p>
                </article>
              ))}
            </div>
          </AdminCard>
        </div>

        <div className="xl:col-span-3">
          <AdminCard description="Historial de pagos del miembro" title="Pagos">
            <div className="space-y-3">
              {member.memberships.flatMap((membership) => membership.payments).map((payment) => (
                <article
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0b0f13] p-4"
                  key={payment.id}
                >
                  <div>
                    <p className="font-semibold text-white">
                      {payment.amount} {payment.currency}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Vence: {new Date(payment.dueDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <AdminStatusBadge value={payment.status} />
                </article>
              ))}
            </div>
          </AdminCard>
        </div>

        <div className="xl:col-span-3">
          <AdminCard description="Clases reservadas y asistencia" title="Reservas y asistencia">
            <div className="space-y-3">
              {member.bookings.map((booking) => (
                <article
                  className="rounded-xl border border-white/10 bg-[#0b0f13] p-4"
                  key={booking.id}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-white">{booking.martialClass.name}</p>
                    <AdminStatusBadge value={booking.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    {new Date(booking.scheduledFor).toLocaleString('es-ES')}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-slate-500">
                    Asistencia: {booking.attendance?.attended ? 'Confirmada' : 'Pendiente'}
                  </p>
                </article>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </DashboardShell>
  );
}

export default AdminMemberProfile;
