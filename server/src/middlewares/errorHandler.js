import prismaPkg from '@prisma/client';

const { Prisma } = prismaPkg;

export default function errorHandler(error, _request, response, _next) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    response.status(409).json({
      error: {
        code: 'RESOURCE_ALREADY_EXISTS',
        message: 'Ya existe un registro con esos datos.',
      },
    });
    return;
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    response.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'El cuerpo de la peticion no contiene JSON valido.',
      },
    });
    return;
  }

  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_SERVER_ERROR';
  const message =
    statusCode === 500 ? 'Ha ocurrido un error interno del servidor.' : error.message;

  if (statusCode === 500) {
    console.error(error);
  }

  response.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
}
