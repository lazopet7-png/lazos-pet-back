# Lazos de Vida Pets — Backend

API REST del sistema de memoriales digitales para mascotas. Administra usuarios administrativos, clientes, memoriales, códigos QR, comentarios, configuración visual y contenido multimedia.

## Producción

- API: `https://api.pets.lazosdevida.com`
- Health check: `https://api.pets.lazosdevida.com/health`
- Hosting: Render
- Base de datos: MongoDB Atlas, base `lazos-pet`
- Archivos: Cloudflare R2, bucket `lazos-pet-media`

El endpoint `/health` devuelve HTTP 200 cuando MongoDB está conectado y HTTP 503 cuando la base de datos no está disponible.

## Tecnologías

- Node.js y Express 4
- MongoDB y Mongoose 8
- JWT y bcrypt
- Multer, Sharp y FFmpeg para multimedia
- AWS SDK S3 para Cloudflare R2
- Joi para validación
- QRCode para generación de códigos

## Requisitos

- Node.js 18 o superior
- npm
- Proyecto de MongoDB Atlas
- Bucket de Cloudflare R2 con credenciales de acceso

## Desarrollo local

```bash
npm install
npm run dev
```

El servidor usa el puerto indicado por `PORT` y, si no existe, el puerto 3000.

## Variables de entorno

`.env.example` contiene únicamente los nombres y valores no sensibles necesarios como referencia. El archivo `.env` real no debe guardarse en Git ni copiarse en reportes.

### Aplicación y base de datos

| Variable | Propósito |
| --- | --- |
| `NODE_ENV` | Entorno de ejecución |
| `PORT` | Puerto HTTP |
| `MONGODB_URI` | Cadena privada de conexión a Atlas |
| `MONGODB_DB_NAME` | Base usada por Mongoose; producción debe usar `lazos-pet` |
| `JWT_SECRET` | Firma privada de tokens |
| `JWT_EXPIRES_IN` | Vigencia del token |
| `FRONTEND_URL` | Origen permitido por CORS |
| `QR_BASE_URL` | Base pública para las URLs codificadas en los QR |

### Cloudflare R2

| Variable | Propósito |
| --- | --- |
| `R2_ACCOUNT_ID` | Cuenta de Cloudflare |
| `R2_ACCESS_KEY_ID` | Identificador de acceso S3 |
| `R2_SECRET_ACCESS_KEY` | Secreto de acceso S3 |
| `R2_BUCKET_NAME` | Bucket de archivos |
| `R2_PUBLIC_URL` | URL pública usada para servir media |

### Creación inicial del administrador

| Variable | Propósito |
| --- | --- |
| `ADMIN_BOOTSTRAP_ENABLED` | Habilita temporalmente el alta inicial |
| `ADMIN_NAME` | Nombre del primer administrador |
| `ADMIN_EMAIL` | Correo del primer administrador |
| `ADMIN_PASSWORD` | Contraseña inicial |
| `ADMIN_PLAN` | Plan asignado |

El bootstrap es de un solo uso. Se habilita únicamente para crear el primer administrador y luego deben eliminarse las variables `ADMIN_*` sensibles o deshabilitarse inmediatamente. Nunca deben incluirse sus valores en commits, logs o URLs.

## Base de datos

La conexión define explícitamente `MONGODB_DB_NAME`; por eso producción escribe en `lazos-pet` aunque la URI de Atlas no incluya una base.

Atlas también puede mostrar una base llamada `test`. Esa base fue creada durante la configuración inicial, antes de fijar el nombre explícito. Actualmente conserva las colecciones `clients`, `comentarios`, `dashboards`, `media`, `profiles`, `qrs` y `users`, todas vacías. No forma parte del flujo de producción. Su eliminación debe hacerse solo con respaldo, verificación previa y autorización explícita.

## Arquitectura

```text
server.js                    # Express, CORS, health y arranque
src/
├── config/
│   ├── database.js          # MongoDB y nombre de base
│   └── bootstrapAdmin.js    # Alta inicial controlada por entorno
├── middleware/              # Autenticación JWT
├── models/                  # Esquemas Mongoose
├── modules/
│   ├── admin/               # Métricas y operaciones globales
│   ├── auth/                # Login y perfil administrativo
│   ├── clients/             # Clientes contratantes
│   ├── comentarios/         # Comentarios públicos y moderación
│   ├── dashboard/           # Apariencia del memorial
│   ├── media/               # Fotos, videos, música y fondos
│   ├── profiles/            # Memoriales de mascotas
│   └── qr/                  # Generación y acceso por QR
├── routes/index.js          # Montaje de rutas `/api`
├── services/storage/        # Integración con R2
└── utils/                   # Validación, QR y respuestas
```

Cada módulo sigue el flujo `routes → controllers → services → repositories → models` cuando aplica.

## Endpoints principales

### Públicos

| Método y ruta | Uso |
| --- | --- |
| `GET /health` | Estado del backend y MongoDB |
| `GET /api/memorial/:qrCode` | Memorial abierto desde el QR |
| `GET /api/profiles/:profileId/public` | Perfil público |
| `GET /api/media/public/:profileId` | Media pública |
| `GET /api/dashboard/public/:profileId` | Configuración pública |
| `GET /api/memorial/:qrCode/comentarios` | Comentarios públicos |
| `POST /api/memorial/:qrCode/validar-codigo` | Validación para comentar |

### Autenticación

| Método y ruta | Uso |
| --- | --- |
| `POST /api/auth/login` | Inicio de sesión |
| `GET /api/auth/profile` | Perfil autenticado |
| `GET /api/auth/validate-token` | Validación del JWT |
| `POST /api/auth/logout` | Cierre de sesión |
| `POST /api/auth/change-password` | Cambio de contraseña |

### Administración

- `/api/admin`: dashboard, métricas, búsqueda y operaciones globales.
- `/api/clients`: CRUD, búsqueda, estadísticas y paginación de clientes.
- `/api/profiles`: CRUD de memoriales y consulta por cliente.
- `/api/qr`: generación, listado y estadísticas de QR.
- `/api/media`: carga, edición, reordenamiento y eliminación de archivos.
- `/api/dashboard`: temas, secciones, privacidad y configuración visual.
- `/api/admin/profiles/:profileId/comentarios`: moderación de comentarios.

Las rutas administrativas requieren `Authorization: Bearer <token>`.

## Flujo del sistema

1. El administrador inicia sesión y obtiene un JWT.
2. Registra al cliente que contrata el servicio.
3. Crea el memorial de la mascota asociado al cliente.
4. Carga media en R2 y configura el memorial.
5. Se genera un código QR con la URL pública.
6. La familia escanea el QR y consulta el memorial sin autenticación.

## Verificación

```bash
node --check server.js
find src -name '*.js' -exec node --check {} \;
npm audit --omit=dev
```

Este backend no necesita un paso de build: se ejecuta directamente con Node. Actualmente no existe una configuración flat de ESLint 9, por lo que antes de exigir lint en CI debe añadirse `eslint.config.js` y un script `lint`.

## Seguridad operativa

- No mostrar ni versionar `.env`.
- No incluir tokens o credenciales en URLs.
- Mantener `MONGODB_DB_NAME=lazos-pet` en producción.
- Restringir CORS al frontend esperado.
- Rotar credenciales si aparecen en capturas o mensajes.
- Probar escritura, lectura y borrado de un objeto de prueba después de cambiar R2.
- Revisar el audit de dependencias sin aplicar actualizaciones forzadas o incompatibles sin pruebas.
