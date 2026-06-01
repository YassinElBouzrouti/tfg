export default function notFound(request, response) {
  response.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Ruta no encontrada: ${request.method} ${request.originalUrl}`,
    },
  });
}
