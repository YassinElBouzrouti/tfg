const weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
const timeSlots = [
  '09:30 - 11:00',
  '11:15 - 12:45',
  '17:00 - 18:30',
  '18:45 - 20:15',
  '20:30 - 22:00',
];

function buildScheduleMap(sessions) {
  const scheduleMap = {};

  for (const slot of timeSlots) {
    scheduleMap[slot] = {};
    for (const day of weekDays) {
      scheduleMap[slot][day] = '\u2014';
    }
  }

  for (const session of sessions) {
    if (!scheduleMap[session.time] || !weekDays.includes(session.day)) {
      continue;
    }
    scheduleMap[session.time][session.day] = session.discipline;
  }

  return scheduleMap;
}

function cellStyle(value) {
  if (value === 'Boxeo') {
    return 'text-amber-300 font-semibold';
  }
  if (value === 'Jiujitsu') {
    return 'text-sky-300 font-semibold';
  }
  if (value === 'Grappling') {
    return 'text-emerald-300 font-semibold';
  }
  if (value === 'Muay Thai') {
    return 'text-rose-300 font-semibold';
  }
  if (value === 'MMA') {
    return 'text-violet-300 font-semibold';
  }
  if (value === 'Sparring Libre') {
    return 'text-orange-300 font-semibold';
  }
  return 'text-slate-500';
}

function ScheduleTable({ sessions }) {
  const scheduleMap = buildScheduleMap(sessions);

  return (
    <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-[#101722]">
      <table className="w-full min-w-[840px] border-collapse text-left">
        <thead className="bg-[#131d2a]">
          <tr>
            <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-300">
              Hora
            </th>
            {weekDays.map((day) => (
              <th
                className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-300"
                key={day}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => (
            <tr className="border-t border-white/10" key={slot}>
              <td className="whitespace-nowrap bg-[#0f1621] px-5 py-4 text-sm font-semibold text-amber-300">{slot}</td>
              {weekDays.map((day) => {
                const discipline = scheduleMap[slot][day];
                return (
                  <td className={`px-5 py-4 text-sm ${cellStyle(discipline)}`} key={`${slot}-${day}`}>
                    {discipline}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleTable;
