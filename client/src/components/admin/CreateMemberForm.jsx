import { useState } from 'react';
import AdminCard from './AdminCard.jsx';

const initialForm = {
  name: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  planId: '',
};

function CreateMemberForm({ onCreateMember, plans }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await onCreateMember(form);
      setForm({ ...initialForm, planId: plans[0]?.id || '' });
    } catch (submissionError) {
      setError(submissionError.message || 'No se pudo crear el miembro.');
    } finally {
      setSubmitting(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <AdminCard description="Alta manual para nuevos miembros" title="Crear miembro">
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <Field label="Nombre" value={form.name} onChange={(value) => updateField('name', value)} />
        <Field
          label="Apellidos"
          value={form.lastName}
          onChange={(value) => updateField('lastName', value)}
        />
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) => updateField('email', value)}
        />
        <Field
          label="Telefono"
          value={form.phone}
          onChange={(value) => updateField('phone', value)}
        />
        <Field
          label="Contrasena"
          type="password"
          value={form.password}
          onChange={(value) => updateField('password', value)}
        />
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
            Plan
          </span>
          <select
            className="w-full rounded-lg border border-white/10 bg-[#0b0f13] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-400"
            onChange={(event) => updateField('planId', event.target.value)}
            required
            value={form.planId}
          >
            <option value="">Selecciona un plan</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </label>

        {error && (
          <p className="md:col-span-2 rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}

        <button
          className="md:col-span-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-black uppercase tracking-widest text-black transition enabled:hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
          disabled={submitting}
          type="submit"
        >
          {submitting ? 'Creando...' : 'Crear miembro'}
        </button>
      </form>
    </AdminCard>
  );
}

function Field({ label, onChange, type = 'text', value }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
        {label}
      </span>
      <input
        className="w-full rounded-lg border border-white/10 bg-[#0b0f13] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-400"
        onChange={(event) => onChange(event.target.value)}
        required
        type={type}
        value={value}
      />
    </label>
  );
}

export default CreateMemberForm;
