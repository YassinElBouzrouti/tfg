import prismaPkg from '@prisma/client';
import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

const { MembershipStatus, PaymentStatus } = prismaPkg;

function buildPaymentReference(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
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

async function resolveTargetMembership(userId) {
  const memberships = await prisma.membership.findMany({
    where: {
      userId,
      status: { in: [MembershipStatus.ACTIVE, MembershipStatus.PENDING] },
    },
    include: {
      plan: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const activeMembership =
    memberships.find((membership) => membership.status === MembershipStatus.ACTIVE) ||
    memberships[0] ||
    null;

  if (!activeMembership) {
    throw new AppError(
      400,
      'No tienes una membresia activa o pendiente para registrar pagos.',
      'MEMBERSHIP_NOT_FOUND',
    );
  }

  return activeMembership;
}

export async function listMyPayments(request, response) {
  const payments = await prisma.payment.findMany({
    where: {
      membership: {
        userId: request.auth.userId,
      },
    },
    include: {
      membership: {
        include: {
          plan: true,
        },
      },
    },
    orderBy: [{ dueDate: 'desc' }, { createdAt: 'desc' }],
  });

  response.json({ payments });
}

export async function createSimulatedPayment(request, response) {
  const membership = await resolveTargetMembership(request.auth.userId);
  const amount = parsePositiveAmount(request.body?.amount) ?? Number(membership.plan.price);
  const now = new Date();

  const payment = await prisma.$transaction(async (transaction) => {
    const createdPayment = await transaction.payment.create({
      data: {
        membershipId: membership.id,
        amount,
        currency: 'EUR',
        status: PaymentStatus.PAID,
        method: 'SIMULATION',
        transactionReference: buildPaymentReference('SIM'),
        dueDate: now,
        paidAt: now,
      },
      include: {
        membership: {
          include: {
            plan: true,
          },
        },
      },
    });

    await transaction.membership.update({
      where: { id: membership.id },
      data: { status: MembershipStatus.ACTIVE },
    });

    return createdPayment;
  });

  response.status(201).json({
    message: 'Pago simulado creado correctamente.',
    payment,
  });
}
