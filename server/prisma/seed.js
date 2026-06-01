import 'dotenv/config';
import prismaPkg from '@prisma/client';
import bcrypt from 'bcrypt';

const { BookingStatus, MembershipStatus, PaymentStatus, PrismaClient, Role } = prismaPkg;
const prisma = new PrismaClient();
const { hash } = bcrypt;
const officialPlanNames = ['B\u00e1sica', 'Completa', 'Premium'];

const schedule = [
  { code: 'MON-0930-BOX', dayOfWeek: 'MONDAY', startTime: '09:30', endTime: '11:00', discipline: 'Boxeo', level: 'Todos los niveles' },
  { code: 'MON-1115-JIU', dayOfWeek: 'MONDAY', startTime: '11:15', endTime: '12:45', discipline: 'Jiujitsu', level: 'Todos los niveles' },
  { code: 'MON-1700-MTY', dayOfWeek: 'MONDAY', startTime: '17:00', endTime: '18:30', discipline: 'Muay Thai', level: 'Todos los niveles' },
  { code: 'MON-1845-BOX', dayOfWeek: 'MONDAY', startTime: '18:45', endTime: '20:15', discipline: 'Boxeo', level: 'Todos los niveles' },
  { code: 'MON-2030-SPR', dayOfWeek: 'MONDAY', startTime: '20:30', endTime: '22:00', discipline: 'Sparring Libre', level: 'Todos los niveles' },

  { code: 'TUE-0930-BOX', dayOfWeek: 'TUESDAY', startTime: '09:30', endTime: '11:00', discipline: 'Boxeo', level: 'Todos los niveles' },
  { code: 'TUE-1115-GRP', dayOfWeek: 'TUESDAY', startTime: '11:15', endTime: '12:45', discipline: 'Grappling', level: 'Todos los niveles' },
  { code: 'TUE-1700-MMA', dayOfWeek: 'TUESDAY', startTime: '17:00', endTime: '18:30', discipline: 'MMA', level: 'Todos los niveles' },
  { code: 'TUE-1845-BOX', dayOfWeek: 'TUESDAY', startTime: '18:45', endTime: '20:15', discipline: 'Boxeo', level: 'Todos los niveles' },
  { code: 'TUE-2030-SPR', dayOfWeek: 'TUESDAY', startTime: '20:30', endTime: '22:00', discipline: 'Sparring Libre', level: 'Todos los niveles' },

  { code: 'WED-0930-BOX', dayOfWeek: 'WEDNESDAY', startTime: '09:30', endTime: '11:00', discipline: 'Boxeo', level: 'Todos los niveles' },
  { code: 'WED-1115-JIU', dayOfWeek: 'WEDNESDAY', startTime: '11:15', endTime: '12:45', discipline: 'Jiujitsu', level: 'Todos los niveles' },
  { code: 'WED-1700-MTY', dayOfWeek: 'WEDNESDAY', startTime: '17:00', endTime: '18:30', discipline: 'Muay Thai', level: 'Todos los niveles' },
  { code: 'WED-1845-BOX', dayOfWeek: 'WEDNESDAY', startTime: '18:45', endTime: '20:15', discipline: 'Boxeo', level: 'Todos los niveles' },
  { code: 'WED-2030-SPR', dayOfWeek: 'WEDNESDAY', startTime: '20:30', endTime: '22:00', discipline: 'Sparring Libre', level: 'Todos los niveles' },

  { code: 'THU-0930-BOX', dayOfWeek: 'THURSDAY', startTime: '09:30', endTime: '11:00', discipline: 'Boxeo', level: 'Todos los niveles' },
  { code: 'THU-1115-GRP', dayOfWeek: 'THURSDAY', startTime: '11:15', endTime: '12:45', discipline: 'Grappling', level: 'Todos los niveles' },
  { code: 'THU-1700-MMA', dayOfWeek: 'THURSDAY', startTime: '17:00', endTime: '18:30', discipline: 'MMA', level: 'Todos los niveles' },
  { code: 'THU-1845-BOX', dayOfWeek: 'THURSDAY', startTime: '18:45', endTime: '20:15', discipline: 'Boxeo', level: 'Todos los niveles' },
  { code: 'THU-2030-SPR', dayOfWeek: 'THURSDAY', startTime: '20:30', endTime: '22:00', discipline: 'Sparring Libre', level: 'Todos los niveles' },

  { code: 'FRI-0930-BOX', dayOfWeek: 'FRIDAY', startTime: '09:30', endTime: '11:00', discipline: 'Boxeo', level: 'Todos los niveles' },
  { code: 'FRI-1115-JIU', dayOfWeek: 'FRIDAY', startTime: '11:15', endTime: '12:45', discipline: 'Jiujitsu', level: 'Todos los niveles' },
  { code: 'FRI-1700-MTY', dayOfWeek: 'FRIDAY', startTime: '17:00', endTime: '18:30', discipline: 'Muay Thai', level: 'Todos los niveles' },
  { code: 'FRI-1845-BOX', dayOfWeek: 'FRIDAY', startTime: '18:45', endTime: '20:15', discipline: 'Boxeo', level: 'Todos los niveles' },
  { code: 'FRI-2030-SPR', dayOfWeek: 'FRIDAY', startTime: '20:30', endTime: '22:00', discipline: 'Sparring Libre', level: 'Todos los niveles' },

  { code: 'SAT-0930-BOX', dayOfWeek: 'SATURDAY', startTime: '09:30', endTime: '11:00', discipline: 'Boxeo', level: 'Todos los niveles' },
  { code: 'SAT-1115-GRP', dayOfWeek: 'SATURDAY', startTime: '11:15', endTime: '12:45', discipline: 'Grappling', level: 'Todos los niveles' },
];

const teacherByDiscipline = {
  Boxeo: 'Carlos Romero',
  Jiujitsu: 'Marcos Silva',
  Grappling: 'Marcos Silva',
  'Muay Thai': 'Alejandro Torres',
  MMA: 'Alejandro Torres',
  'Sparring Libre': 'Carlos Romero',
};

async function main() {
  const memberPasswordHash = await hash('DojoDemo2026!', 10);
  const adminPasswordHash = await hash('Admin1234', 10);

  const users = {};
  for (const user of [
    {
      email: 'admin@yassinsgym.com',
      name: 'Administrador',
      lastName: "Yassin's GYM",
      phone: '+34 600 000 001',
      role: Role.ADMIN,
    },
    {
      email: 'carlos.mendez@example.com',
      name: 'Carlos',
      lastName: 'Mendez',
      phone: '+34 600 100 101',
      role: Role.MEMBER,
    },
    {
      email: 'lucia.garcia@example.com',
      name: 'Lucia',
      lastName: 'Garcia',
      phone: '+34 600 100 102',
      role: Role.MEMBER,
    },
    {
      email: 'ahmed.benali@example.com',
      name: 'Ahmed',
      lastName: 'Benali',
      phone: '+34 600 100 103',
      role: Role.MEMBER,
    },
  ]) {
    users[user.email] = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        passwordHash: user.role === Role.ADMIN ? adminPasswordHash : memberPasswordHash,
      },
      create: {
        ...user,
        passwordHash: user.role === Role.ADMIN ? adminPasswordHash : memberPasswordHash,
      },
    });
  }

  const plans = {};
  for (const plan of [
    {
      name: 'B\u00e1sica',
      description: 'Acceso a dos clases semanales.',
      price: 35,
      durationMonths: 1,
      isActive: true,
    },
    {
      name: 'Completa',
      description: 'Clases ilimitadas y sala de entrenamiento.',
      price: 50,
      durationMonths: 1,
      isActive: true,
    },
    {
      name: 'Premium',
      description: 'Programa completo con seguimiento personalizado.',
      price: 65,
      durationMonths: 1,
      isActive: true,
    },
  ]) {
    plans[plan.name] = await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  await prisma.plan.updateMany({
    where: {
      name: {
        notIn: officialPlanNames,
      },
    },
    data: { isActive: false },
  });

  const memberships = {};
  for (const membership of [
    {
      id: 'seed-membership-carlos',
      userEmail: 'carlos.mendez@example.com',
      planName: 'Completa',
      status: MembershipStatus.ACTIVE,
      startDate: new Date('2026-05-01T00:00:00.000Z'),
      endDate: new Date('2026-06-01T00:00:00.000Z'),
    },
    {
      id: 'seed-membership-lucia',
      userEmail: 'lucia.garcia@example.com',
      planName: 'Premium',
      status: MembershipStatus.ACTIVE,
      startDate: new Date('2026-05-01T00:00:00.000Z'),
      endDate: new Date('2026-06-01T00:00:00.000Z'),
    },
    {
      id: 'seed-membership-ahmed',
      userEmail: 'ahmed.benali@example.com',
      planName: 'B\u00e1sica',
      status: MembershipStatus.PENDING,
      startDate: new Date('2026-06-01T00:00:00.000Z'),
      endDate: new Date('2026-07-01T00:00:00.000Z'),
    },
  ]) {
    memberships[membership.id] = await prisma.membership.upsert({
      where: { id: membership.id },
      update: {
        userId: users[membership.userEmail].id,
        planId: plans[membership.planName].id,
        status: membership.status,
        startDate: membership.startDate,
        endDate: membership.endDate,
      },
      create: {
        id: membership.id,
        userId: users[membership.userEmail].id,
        planId: plans[membership.planName].id,
        status: membership.status,
        startDate: membership.startDate,
        endDate: membership.endDate,
      },
    });
  }

  for (const payment of [
    {
      transactionReference: 'SEED-PAY-2026-001',
      membershipId: 'seed-membership-carlos',
      amount: 50,
      status: PaymentStatus.PAID,
      method: 'CARD',
      dueDate: new Date('2026-05-01T00:00:00.000Z'),
      paidAt: new Date('2026-05-01T10:30:00.000Z'),
    },
    {
      transactionReference: 'SEED-PAY-2026-002',
      membershipId: 'seed-membership-lucia',
      amount: 65,
      status: PaymentStatus.PAID,
      method: 'TRANSFER',
      dueDate: new Date('2026-05-01T00:00:00.000Z'),
      paidAt: new Date('2026-05-01T08:15:00.000Z'),
    },
    {
      transactionReference: 'SEED-PAY-2026-003',
      membershipId: 'seed-membership-ahmed',
      amount: 35,
      status: PaymentStatus.PENDING,
      method: 'CARD',
      dueDate: new Date('2026-06-01T00:00:00.000Z'),
      paidAt: null,
    },
  ]) {
    await prisma.payment.upsert({
      where: { transactionReference: payment.transactionReference },
      update: payment,
      create: payment,
    });
  }

  const classes = {};
  for (const item of schedule) {
    const classData = {
      code: item.code,
      name: item.discipline,
      discipline: item.discipline,
      instructorName: teacherByDiscipline[item.discipline],
      level: item.level,
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
      durationMinutes: 90,
      capacity: 20,
      isActive: true,
    };

    classes[item.code] = await prisma.martialClass.upsert({
      where: { code: item.code },
      update: classData,
      create: classData,
    });
  }

  const activeCodes = schedule.map((item) => item.code);
  const legacyClasses = await prisma.martialClass.findMany({
    where: {
      code: {
        notIn: activeCodes,
      },
    },
    select: {
      id: true,
    },
  });
  const legacyClassIds = legacyClasses.map((item) => item.id);

  if (legacyClassIds.length > 0) {
    await prisma.attendance.deleteMany({
      where: {
        booking: {
          martialClassId: {
            in: legacyClassIds,
          },
        },
      },
    });
    await prisma.booking.deleteMany({
      where: {
        martialClassId: {
          in: legacyClassIds,
        },
      },
    });
    await prisma.martialClass.deleteMany({
      where: {
        id: {
          in: legacyClassIds,
        },
      },
    });
  }

  const bookings = {};
  for (const booking of [
    {
      id: 'seed-booking-carlos-box',
      userEmail: 'carlos.mendez@example.com',
      classCode: 'MON-1845-BOX',
      scheduledFor: new Date('2026-06-01T18:45:00.000+02:00'),
      status: BookingStatus.CONFIRMED,
    },
    {
      id: 'seed-booking-lucia-jiu',
      userEmail: 'lucia.garcia@example.com',
      classCode: 'WED-2030-SPR',
      scheduledFor: new Date('2026-06-03T20:30:00.000+02:00'),
      status: BookingStatus.CONFIRMED,
    },
    {
      id: 'seed-booking-carlos-mty',
      userEmail: 'carlos.mendez@example.com',
      classCode: 'TUE-1700-MMA',
      scheduledFor: new Date('2026-06-02T17:00:00.000+02:00'),
      status: BookingStatus.CONFIRMED,
    },
    {
      id: 'seed-booking-ahmed-box',
      userEmail: 'ahmed.benali@example.com',
      classCode: 'SAT-0930-BOX',
      scheduledFor: new Date('2026-06-06T09:30:00.000+02:00'),
      status: BookingStatus.PENDING,
    },
  ]) {
    bookings[booking.id] = await prisma.booking.upsert({
      where: { id: booking.id },
      update: {
        userId: users[booking.userEmail].id,
        martialClassId: classes[booking.classCode].id,
        scheduledFor: booking.scheduledFor,
        status: booking.status,
      },
      create: {
        id: booking.id,
        userId: users[booking.userEmail].id,
        martialClassId: classes[booking.classCode].id,
        scheduledFor: booking.scheduledFor,
        status: booking.status,
      },
    });
  }

  await prisma.attendance.upsert({
    where: { bookingId: bookings['seed-booking-carlos-box'].id },
    update: {
      attended: true,
      checkedInAt: new Date('2026-06-01T18:40:00.000+02:00'),
      notes: 'Sesion completada.',
    },
    create: {
      bookingId: bookings['seed-booking-carlos-box'].id,
      attended: true,
      checkedInAt: new Date('2026-06-01T18:40:00.000+02:00'),
      notes: 'Sesion completada.',
    },
  });

  console.log(
    `Seed completado para Yassin's GYM: ${Object.keys(users).length} usuarios, ${Object.keys(plans).length} planes, ${Object.keys(classes).length} clases.`,
  );
}

main()
  .catch((error) => {
    console.error('No se pudo ejecutar el seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
