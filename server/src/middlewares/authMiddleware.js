import AppError from '../utils/AppError.js';
import { verifyToken } from '../utils/jwt.js';

export default function authMiddleware(request, _response, next) {
  const authorization = request.headers.authorization;
  const [scheme, token] = authorization?.split(' ') || [];

  if (scheme !== 'Bearer' || !token) {
    next(
      new AppError(
        401,
        'Debes enviar un token Bearer para acceder a esta ruta.',
        'AUTH_TOKEN_REQUIRED',
      ),
    );
    return;
  }

  try {
    const payload = verifyToken(token);

    request.auth = {
      userId: payload.sub,
      role: payload.role,
    };

    next();
  } catch (_error) {
    next(new AppError(401, 'El token es invalido o ha expirado.', 'AUTH_TOKEN_INVALID'));
  }
}

