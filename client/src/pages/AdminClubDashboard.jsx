import { useEffect, useState } from 'react';
import DashboardShell from '../components/DashboardShell.jsx';
import ClassesListCard from '../components/admin/ClassesListCard.jsx';
import CreateMemberForm from '../components/admin/CreateMemberForm.jsx';
import MembersListCard from '../components/admin/MembersListCard.jsx';
import axiosClient from '../api/axiosClient.js';
import apiErrorMessage from '../utils/apiError.js';

function AdminClubDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [classes, setClasses] = useState([]);

  async function loadDashboardData() {
    setLoading(true);
    setError('');

    try {
      const [membersResponse, plansResponse, classesResponse] = await Promise.all([
        axiosClient.get('/admin/members'),
        axiosClient.get('/admin/plans'),
        axiosClient.get('/admin/classes'),
      ]);

      setMembers(membersResponse.data.members || []);
      setPlans(plansResponse.data.plans || []);
      setClasses(classesResponse.data.classes || []);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, 'No se pudieron cargar los datos de administracion.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function handleUpdatePaymentStatus(paymentId, status) {
    if (!paymentId) {
      return;
    }

    try {
      await axiosClient.patch(`/admin/payments/${paymentId}/status`, { status });
      setFeedback(`Pago actualizado a ${status}.`);
      await loadDashboardData();
    } catch (requestError) {
      setError(apiErrorMessage(requestError, 'No se pudo actualizar el pago.'));
    }
  }

  async function handleRegisterCashPayment(memberId, amount) {
    try {
      await axiosClient.post('/admin/payments/cash', {
        memberId,
        amount: amount === '' ? undefined : amount,
      });
      setFeedback('Pago en efectivo registrado correctamente.');
      await loadDashboardData();
    } catch (requestError) {
      setError(apiErrorMessage(requestError, 'No se pudo registrar el pago en efectivo.'));
    }
  }

  async function handleCreateMember(payload) {
    await axiosClient.post('/admin/members', payload);
    setFeedback('Miembro creado correctamente.');
    await loadDashboardData();
  }

  if (loading) {
    return (
      <DashboardShell label="Administracion privada" title="Panel del club">
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#10141a] p-6 text-slate-300">
          Cargando informacion del club...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell label="Administracion privada" title="Panel del club">
      <div className="mt-4 flex flex-col gap-4">
        {feedback && (
          <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
            {feedback}
          </p>
        )}
        {error && (
          <p className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300">
            {error}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MembersListCard
            members={members}
            onRegisterCashPayment={handleRegisterCashPayment}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
          />
        </div>
        <CreateMemberForm onCreateMember={handleCreateMember} plans={plans} />
        <div className="xl:col-span-3">
          <ClassesListCard classes={classes} />
        </div>
      </div>
    </DashboardShell>
  );
}

export default AdminClubDashboard;
