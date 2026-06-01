import SectionHeading from './SectionHeading.jsx';
import ScheduleTable from './ScheduleTable.jsx';

function ScheduleSection({ sessions }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20" id="horarios">
      <SectionHeading
        badge="Horario semanal"
        description="Horario semanal de Yassin&apos;s GYM. Domingo cerrado."
        title="Horarios"
      />
      <ScheduleTable sessions={sessions} />
    </section>
  );
}

export default ScheduleSection;
