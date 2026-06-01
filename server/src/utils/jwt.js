import jwt from 'jsonwebtoken';

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no esta configurado en el servidor.');
  }

  return process.env.JWT_SECRET;
}

export function createToken(user) {
  return jwt.sign(
    {
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      subject: user.id,
    },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

