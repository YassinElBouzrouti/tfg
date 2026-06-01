gym_artes_marciales

Este proyecto es una app web para gestionar un gym de artes marciales.
Lo monte en formato full stack:

- Frontend con React + Vite + Tailwind
- Backend con Node.js + Express
- Base de datos con PostgreSQL + Prisma

La idea es cubrir el flujo completo: registro, login, pagos, reservas y panel de administracion.

Requisitos

- Node.js 20 o superior
- npm
- PostgreSQL en local (o una URL remota en `DATABASE_URL`)

Como levantar el proyecto

1. Instalar dependencias

```bash
npm install
```

2. Preparar variables de entorno del servidor

```bash
copy server\.env.example server\.env
```

3. Arrancar cliente + servidor en desarrollo

```bash
npm run dev
```

Con eso:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`

Si PowerShell bloquea `npm.ps1`, usar:

```bash
npm.cmd install
npm.cmd run dev
```

Scripts utiles

- `npm run dev`: levanta cliente y servidor a la vez
- `npm run dev:client`: levanta solo el frontend
- `npm run dev:server`: levanta solo el backend con nodemon
- `npm run build`: compila el frontend para produccion
- `npm start`: ejecuta el backend en modo normal

Scripts de Prisma (backend)

- `npm run prisma:validate --workspace server`
- `npm run prisma:generate --workspace server`
- `npm run prisma:seed --workspace server`

Estructura rapida

```text
gym_artes_marciales/
|-- client/
|   `-- src/
|       |-- api/
|       |-- components/
|       |-- layouts/
|       `-- pages/
|-- server/
|   |-- prisma/
|   |   `-- schema.prisma
|   `-- src/
|       |-- controllers/
|       |-- middlewares/
|       |-- routes/
|       |-- app.js
|       `-- server.js
`-- package.json
```

Que incluye ahora mismo

- Sistema de autenticacion con JWT
- Registro y login de miembros
- Panel de miembro (`/member`) con pagos y reservas
- Panel admin privado (`/admin-club-secreto`)
- Gestion de miembros, clases y estado de pagos
- Simulacion de pagos para pruebas academicas

Rutas importantes del frontend

- `/`: home publica
- `/login`: login
- `/register`: registro
- `/member`: panel del miembro autenticado
- `/admin`: panel de administracion
- `/admin/miembros/:memberId`: perfil de un miembro

Rutas principales de la API

Salud de la API:

- `GET /api/health`

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/member-check`
- `GET /api/auth/admin-check`

Admin (requiere rol `ADMIN`):

- `GET /api/admin/members`
- `GET /api/admin/members/:memberId`
- `POST /api/admin/members`
- `PATCH /api/admin/payments/:paymentId/status`
- `POST /api/admin/payments/cash`
- `GET /api/admin/classes`
- `GET /api/admin/plans`

Pagos:

- `POST /api/payments/simulate`
- `GET /api/payments/me`

Reservas:

- `GET /api/bookings/classes`
- `POST /api/bookings`
- `GET /api/bookings/me`

Notas rapidas

- Configurar `JWT_SECRET` en `server/.env`.
- El seed crea usuarios de prueba y guarda passwords hasheadas con `bcrypt`.
- Los errores de la API salen en JSON dentro de `error` (`code` y `message`).
