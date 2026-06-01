import PanelCard from './PanelCard.jsx';

function UserProfileCard({ user }) {
  return (
    <PanelCard description="Informacion de tu cuenta" title="Mi perfil">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-amber-500 font-display text-xl font-black text-black">
          {user.initials}
        </span>
        <div>
          <p className="font-display text-xl font-black uppercase text-white">{user.fullName}</p>
          <p className="text-sm text-slate-400">Miembro #{user.memberNumber}</p>
        </div>
      </div>
      <dl className="mt-5 space-y-4 text-sm">
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Telefono" value={user.phone} />
        <InfoRow label="Alta" value={user.memberSince} />
      </dl>
    </PanelCard>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-semibold text-slate-200">{value}</dd>
    </div>
  );
}

export default UserProfileCard;
