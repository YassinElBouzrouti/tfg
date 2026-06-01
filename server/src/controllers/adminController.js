import prismaPkg from '@prisma/client';
import bcrypt from 'bcrypt';
import { isOfficialPlanName, selectPublicPlans } from '../constants/plans.js';
import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

const { BookingStatus, MembershipStatus, PaymentStatus, Role } = prismaPkg;
const { hash } = bcrypt;
const dayNameToIndex = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

function requiredText(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(400, `${label} es obligatorio.`, 'VALIDATION_ERROR');
  }

  return value.trim();
}

function normalizeEmail(value) {
  const email = requiredText(value, 'El email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError(400, 'El email no tiene un formato valido.', 'INVALID_EMAIL');
  }
  return email;
}

function getMembershipEndDate(startDate, durationMonths) {
  const endDate = new Date(startDate);
  endDate.setUTCMonth(endDate.getUTCMonth() + durationMonths);
  return endDate;
}

function parsePositiveAmount(rawAmount) {
  if (rawAmount === undefined || rawAmount === null || rawAmount === '') {
    return null;
  }

  const amount = Number(rawAmount);
  if (Number.isNaN(amount) || amount <= 0) {
    throw new AppError(400, 'El importe debe ser un numero mayor que cero.', 'INVALID_AMOUNT');
  }

  return amount;
}

function buildPaymentReference(prefix = 'MANUAL') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function mapMemberSummary(member) {
  const latestPayment = member.memberships
    .flatMap((membership) => membership.payments)
    .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime())[0];

  const activeMembership =
    member.memberships.find((membership) => membership.status === MembershipStatus.ACTIVE) ||
    member.memberships.find((membership) => membership.status === MembershipStatus.PENDING) ||
    member.memberships[0] ||
    null;

  return {
    id: member.id,
    name: member.name,
    lastName: member.lastName,
    email: member.email,
    phone: member.phone,
    role: member.role,
    membership: activeMembership
      ? {
          id: activeMembership.id,
          status: activeMembership.status,
          startDate: activeMembership.startDate,
          endDate: activeMembership.endDate,
          plan: activeMembership.plan,
        }
      : null,
    latestPayment: latestPayment
      ? {
          id: latestPayment.id,
          amount: latestPayment.amount,
          currency: latestPayment.currency,
          status: latestPayment.status,
          dueDate: latestPayment.dueDate,
          paidAt: latestPayment.paidAt,
        }
      : null,
  };
}

export async function listMembers(_request, response) {
  const members = await prisma.user.findMany({
    where: { role: Role.MEMBER },
    orderBy: [{ createdAt: 'desc' }],
    include: {
      memberships: {
        include: {
          plan: true,
          payments: {
            orderBy: { dueDate: 'desc' },
            take: 4,
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  response.json({ members: members.map(mapMemberSummary) });
}

export async function getMemberById(request, response) {
  const memberId = requiredText(request.params.memberId, 'El identificador del miembro');

  const member = await prisma.user.findFirst({
    where: {
      id: memberId,
      role: Role.MEMBER,
    },
    include: {
      memberships: {
        include: {
          plan: true,
          payments: {
            orderBy: { dueDate: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      bookings: {
        include: {
          martialClass: true,
          attendance: true,
        },
        orderBy: { scheduledFor: 'desc' },
      },
    },
  });

  if (!member) {
    throw new AppError(404, 'No se encontro el miembro solicitado.', 'MEMBER_NOT_FOUND');
  }

  response.json({
    member: {
      id: member.id,
      name: member.name,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      createdAt: member.createdAt,
      memberships: member.memberships,
      bookings: member.bookings,
    },
  });
}

export async function listPlans(_request, response) {
  const plans = await prisma.plan.findMany({
    where: {
      isActive: true,
    },
    orderBy: { price: 'asc' },
  });

  response.json({ plans: selectPublicPlans(plans) });
}

export async function createMember(request, response) {
  const name = requiredText(request.body.name, 'El nombre');
  const lastName = requiredText(request.body.lastName, 'Los apellidos');
  const email = normalizeEmail(request.body.email);
  const phone = requiredText(request.body.phone, 'El telefono');
  const password = requiredText(request.body.password, 'La contrasena');
  const planId = requiredText(request.body.planId, 'El plan');

  if (password.length < 8) {
    throw new AppError(
      400,
      'La contrasena debe tener al menos 8 caracteres.',
      'PASSWORD_TOO_SHORT',
    );
  }

  const [existingUser, plan] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.plan.findUnique({ where: { id: planId } }),
  ]);

  if (existingUser) {
    throw new AppError(409, 'Ya existe un miembro con ese email.', 'EMAIL_ALREADY_EXISTS');
  }

  if (!plan || !plan.isActive) {
    throw new AppError(400, 'El plan elegido no existe o no esta activo.', 'PLAN_NOT_AVAILABLE');
  }
  if (!isOfficialPlanName(plan.name)) {
    throw new AppError(400, 'El plan elegido no existe o no esta activo.', 'PLAN_NOT_AVAILABLE');
  }

  const passwordHash = await hash(password, 12);
  const startDate = new Date();
  const endDate = getMembershipEndDate(startDate, plan.durationMonths);

  const created = await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.create({
      data: {
        name,
        lastName,
        email,
        phone,
        passwordHash,
        role: Role.MEMBER,
      },
    });

    const membership = await transaction.membership.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: MembershipStatus.PENDING,
        startDate,
        endDate,
      },
    });

    const payment = await transaction.payment.create({
      data: {
        membershipId: membership.id,
        amount: plan.price,
        currency: 'EUR',
        status: PaymentStatus.PENDING,
        method: 'MANUAL',
        transactionReference: buildPaymentReference('MANUAL'),
        dueDate: startDate,
      },
    });

    return { user, membership, payment };
  });

  response.status(201).json({
    message: 'Miembro creado correctamente.',
    member: {
      id: created.user.id,
      name: created.user.name,
      lastName: created.user.lastName,
      email: created.user.email,
      phone: created.user.phone,
      membershipId: created.membership.id,
      paymentId: created.payment.id,
    },
  });
}

export async function updatePaymentStatus(request, response) {
  const paymentId = requiredText(request.params.paymentId, 'El identificador del pago');
  const status = requiredText(request.body.status, 'El estado del pago').toUpperCase();

  if (![PaymentStatus.PAID, PaymentStatus.PENDING].includes(status)) {
    throw new AppError(
      400,
      'El estado debe ser PAID o PENDING.',
      'INVALID_PAYMENT_STATUS',
    );
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      membership: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(404, 'No se encontro el pago solicitado.', 'PAYMENT_NOT_FOUND');
  }

  if (payment.status === status) {
    response.json({
      message: `El pago ya estaba marcado como ${status}.`,
      payment,
    });
    return;
  }

  const updated = await prisma.$transaction(async (transaction) => {
    const updatedPayment = await transaction.payment.update({
      where: { id: payment.id },
      data: {
        status,
        paidAt: status === PaymentStatus.PAID ? new Date() : null,
      },
    });

    await transaction.membership.update({
      where: { id: payment.membershipId },
      data: {
        status: status === PaymentStatus.PAID ? MembershipStatus.ACTIVE : MembershipStatus.PENDING,
      },
    });

    return updatedPayment;
  });

  response.json({
    message: `Pago actualizado a ${status} correctamente.`,
    payment: updated,
  });
}

export async function createCashPayment(request, response) {
  const memberId = requiredText(request.body.memberId, 'El miembro');
  const amountInput = parsePositiveAmount(request.body.amount);

  const member = await prisma.user.findFirst({
    where: {
      id: memberId,
      role: Role.MEMBER,
    },
    include: {
      memberships: {
        include: {
          plan: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!member) {
    throw new AppError(404, 'No se encontro el miembro solicitado.', 'MEMBER_NOT_FOUND');
  }

  const membership =
    member.memberships.find((item) => item.status === MembershipStatus.ACTIVE) ||
    member.memberships.find((item) => item.status === MembershipStatus.PENDING) ||
    member.memberships[0] ||
    null;

  if (!membership) {
    throw new AppError(
      400,
      'El miembro no tiene una membresia para registrar el pago.',
      'MEMBERSHIP_NOT_FOUND',
    );
  }

  const amount = amountInput ?? Number(membership.plan.price);
  const now = new Date();

  const payment = await prisma.$transaction(async (transaction) => {
    const createdPayment = await transaction.payment.create({
      data: {
        membershipId: membership.id,
        amount,
        currency: 'EUR',
        status: PaymentStatus.PAID,
        method: 'CASH',
        transactionReference: buildPaymentReference('CASH'),
        dueDate: now,
        paidAt: now,
      },
    });

    await transaction.membership.update({
      where: { id: membership.id },
      data: { status: MembershipStatus.ACTIVE },
    });

    return createdPayment;
  });

  response.status(201).json({
    message: 'Pago en efectivo registrado correctamente.',
    payment,
  });
}

export async function listClassesWithBookings(_request, response) {
  const classes = await prisma.martialClass.findMany({
    where: { isActive: true },
    include: {
      bookings: {
        where: {
          status: {
            in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
          },
        },
        orderBy: { scheduledFor: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  classes.sort((left, right) => {
    const dayDiff =
      (dayNameToIndex[left.dayOfWeek] ?? 9) - (dayNameToIndex[right.dayOfWeek] ?? 9);
    if (dayDiff !== 0) {
      return dayDiff;
    }
    return left.startTime.localeCompare(right.startTime);
  });

  response.json({ classes });
}
