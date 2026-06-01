import bcrypt from 'bcrypt';
import prismaPkg from '@prisma/client';
import { isOfficialPlanName, selectPublicPlans } from '../constants/plans.js';
import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';
import { createToken } from '../utils/jwt.js';

const { MembershipStatus, Role } = prismaPkg;
const { compare, hash } = bcrypt;
const publicUserSelect = {
  id: true,
  name: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
};

function requiredText(value, fieldLabel) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(400, `${fieldLabel} es obligatorio.`, 'VALIDATION_ERROR');
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

export async function register(request, response) {
  const name = requiredText(request.body.name, 'El nombre');
  const lastName = requiredText(request.body.lastName, 'Los apellidos');
  const email = normalizeEmail(request.body.email);
  const phone = requiredText(request.body.phone, 'El telefono');
  const password = requiredText(request.body.password, 'La contrasena');
  const rawPlanId = request.body.planId;
  if (typeof rawPlanId !== 'string' || !rawPlanId.trim()) {
    throw new AppError(400, 'Debes seleccionar una tarifa.', 'PLAN_REQUIRED');
  }
  const planId = rawPlanId.trim();

  if (password.length < 8) {
    throw new AppError(
      400,
      'La contrasena debe tener al menos 8 caracteres.',
      'PASSWORD_TOO_SHORT',
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError(409, 'El correo ya esta registrado.', 'EMAIL_ALREADY_EXISTS');
  }

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) {
    throw new AppError(404, 'La tarifa seleccionada no existe.', 'PLAN_NOT_FOUND');
  }

  if (!plan.isActive) {
    throw new AppError(400, 'La tarifa seleccionada no esta disponible.', 'PLAN_NOT_AVAILABLE');
  }
  if (!isOfficialPlanName(plan.name)) {
    throw new AppError(400, 'La tarifa seleccionada no esta disponible.', 'PLAN_NOT_AVAILABLE');
  }

  const passwordHash = await hash(password, 12);
  const startDate = new Date();
  const endDate = getMembershipEndDate(startDate, plan.durationMonths);

  const { membership, user } = await prisma.$transaction(async (transaction) => {
    const createdUser = await transaction.user.create({
      data: {
        name,
        lastName,
        email,
        phone,
        passwordHash,
        role: Role.MEMBER,
      },
      select: publicUserSelect,
    });

    const createdMembership = await transaction.membership.create({
      data: {
        userId: createdUser.id,
        planId: plan.id,
        status: MembershipStatus.PENDING,
        startDate,
        endDate,
      },
      include: {
        plan: true,
      },
    });

    return {
      user: createdUser,
      membership: createdMembership,
    };
  });

  response.status(201).json({
    message: 'Usuario registrado correctamente',
    token: createToken(user),
    user,
    membership,
  });
}

export async function listPublicPlans(_request, response) {
  const plans = await prisma.plan.findMany({
    where: {
      isActive: true,
    },
    orderBy: { price: 'asc' },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      durationMonths: true,
    },
  });

  response.json({ plans: selectPublicPlans(plans) });
}

export async function login(request, response) {
  const email = normalizeEmail(request.body.email);
  const password = requiredText(request.body.password, 'La contrasena');

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await compare(password, user.passwordHash))) {
    throw new AppError(401, 'Email o contrasena incorrectos.', 'INVALID_CREDENTIALS');
  }

  const { passwordHash: _passwordHash, ...publicUser } = user;

  response.json({
    message: 'Inicio de sesion correcto.',
    token: createToken(user),
    user: publicUser,
  });
}

export async function getCurrentUser(request, response) {
  const user = await prisma.user.findUnique({
    where: { id: request.auth.userId },
    select: {
      ...publicUserSelect,
      memberships: {
        include: {
          plan: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!user) {
    throw new AppError(401, 'El usuario del token ya no existe.', 'AUTH_USER_NOT_FOUND');
  }

  response.json({ user });
}

export function confirmAdminAccess(_request, response) {
  response.json({ message: 'Acceso de administrador autorizado.' });
}

export function confirmMemberAccess(_request, response) {
  response.json({ message: 'Acceso de miembro autorizado.' });
}
