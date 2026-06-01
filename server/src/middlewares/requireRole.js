import AppError from '../utils/AppError.js';

export default function requireRole(...allowedRoles) {
  return function roleMiddleware(request, _response, next) {
    if (!request.auth) {
      next(new AppError(401, 'Debes iniciar sesion para acceder.', 'AUTH_REQUIRED'));
      return;
    }

    if (!allowedRoles.includes(request.auth.role)) {
      next(
        new AppError(
          403,
          'No tienes permisos para acceder a este recurso.',
          'FORBIDDEN_ROLE',
        ),
      );
      return;
    }

    next();
  };
}

