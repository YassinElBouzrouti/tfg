import prismaPkg from '@prisma/client';
import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

const { BookingStatus, MembershipStatus, Prisma, Role } = prismaPkg;
const dayNameToIndex = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

function sortBySchedule(left, right) {
  const dayDiff = (dayNameToIndex[left.dayOfWeek] ?? 9) - (dayNameToIndex[right.dayOfWeek] ?? 9);
  if (dayDiff !== 0) {
    return dayDiff;
  }

  return left.startTime.localeCompare(right.startTime);
}

function requiredText(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(400, `${label} es obligatorio.`, 'VALIDATION_ERROR');
  }

  return value.trim();
}

function parseSessionDate(value, martialClass) {
  const dayIndex = dayNameToIndex[martialClass.dayOfWeek];
  if (dayIndex === undefined) {
    throw new AppError(
      500,
      `La clase ${martialClass.name} tiene un dia invalido (${martialClass.dayOfWeek}).`,
      'INVALID_CLASS_DAY',
    );
  }

  if (value) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new AppError(400, 'La fecha de reserva no es valida.', 'INVALID_BOOKING_DATE');
    }

    return parsed;
  }

  const [hourText, minuteText] = martialClass.startTime.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const now = new Date();
  const next = new Date(now);

  const diff = (dayIndex - now.getDay() + 7) % 7;
  next.setDate(now.getDate() + diff);
  next.setHours(hour, minute, 0, 0);

  if (next <= now) {
    next.setDate(next.getDate() + 7);
  }

  return next;
}

function isMemberWithAccess(user) {
  return user.role === Role.MEMBER;
}

async function ensureMemberAccess(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberships: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user || !isMemberWithAccess(user)) {
    throw new AppError(403, 'Solo los miembros pueden gestionar reservas.', 'FORBIDDEN_ROLE');
  }

  const activeOrPendingMembership = user.memberships.find((membership) =>
    [MembershipStatus.ACTIVE, MembershipStatus.PENDING].includes(membership.status),
  );

  if (!activeOrPendingMembership) {
    throw new AppError(
      400,
      'No tienes una membresia activa o pendiente para reservar clases.',
      'MEMBERSHIP_NOT_ALLOWED',
    );
  }
}

async function runSerializable(work) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await prisma.$transaction(
        async (transaction) => work(transaction),
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      if (error?.code === 'P2034' && attempt < maxRetries - 1) {
        attempt += 1;
        continue;
      }

      throw error;
    }
  }

  throw new AppError(500, 'No se pudo completar la reserva por concurrencia.', 'BOOKING_RETRY_FAILED');
}

export async function listAvailableClassesForMember(request, response) {
  await ensureMemberAccess(request.auth.userId);

  const classes = await prisma.martialClass.findMany({
    where: { isActive: true },
  });
  classes.sort(sortBySchedule);

  const mapped = await Promise.all(
    classes.map(async (martialClass) => {
      const scheduledFor = parseSessionDate(null, martialClass);

      const [bookedCount, myBooking] = await Promise.all([
        prisma.booking.count({
          where: {
            martialClassId: martialClass.id,
            scheduledFor,
            status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
          },
        }),
        prisma.booking.findFirst({
          where: {
            userId: request.auth.userId,
            martialClassId: martialClass.id,
            scheduledFor,
            status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
          },
        }),
      ]);

      return {
        ...martialClass,
        nextSessionAt: scheduledFor,
        bookedCount,
        availableSpots: Math.max(martialClass.capacity - bookedCount, 0),
        alreadyBooked: Boolean(myBooking),
      };
    }),
  );

  response.json({ classes: mapped });
}

export async function createBooking(request, response) {
  await ensureMemberAccess(request.auth.userId);

  const martialClassId = requiredText(request.body.martialClassId, 'La clase');

  const booking = await runSerializable(async (transaction) => {
    const martialClass = await transaction.martialClass.findFirst({
      where: {
        id: martialClassId,
        isActive: true,
      },
    });

    if (!martialClass) {
      throw new AppError(404, 'La clase no existe o no esta activa.', 'CLASS_NOT_FOUND');
    }

    const scheduledFor = parseSessionDate(request.body.scheduledFor, martialClass);

    const existingBooking = await transaction.booking.findFirst({
      where: {
        userId: request.auth.userId,
        martialClassId,
        scheduledFor,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
    });

    if (existingBooking) {
      throw new AppError(
        409,
        'Ya tienes una reserva para esta clase en la misma fecha.',
        'BOOKING_ALREADY_EXISTS',
      );
    }

    const currentBooked = await transaction.booking.count({
      where: {
        martialClassId,
        scheduledFor,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
    });

    if (currentBooked >= martialClass.capacity) {
      throw new AppError(409, 'No quedan plazas disponibles para esta clase.', 'CLASS_FULL');
    }

    return transaction.booking.create({
      data: {
        userId: request.auth.userId,
        martialClassId,
        scheduledFor,
        status: BookingStatus.CONFIRMED,
      },
      include: {
        martialClass: true,
      },
    });
  });

  response.status(201).json({
    message: 'Reserva creada correctamente.',
    booking,
  });
}

export async function listMyBookings(request, response) {
  await ensureMemberAccess(request.auth.userId);

  const bookings = await prisma.booking.findMany({
    where: {
      userId: request.auth.userId,
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
    },
    include: {
      martialClass: true,
      attendance: true,
    },
    orderBy: { scheduledFor: 'asc' },
  });

  response.json({ bookings });
}
