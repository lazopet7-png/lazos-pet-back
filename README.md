# 🐾 LAZOS DE VIDA PETS - BACKEND

## 📋 RESUMEN EJECUTIVO

**¡Backend 100% funcional y listo para integración frontend!**

- ✅ **Servidor**: Corriendo en puerto 3000
- ✅ **Base de datos**: MongoDB conectada con datos de prueba
- ✅ **Autenticación**: JWT implementada
- ✅ **Modelo B2B**: Admin gestiona clientes y memoriales
- ✅ **QR automático**: Generación y acceso público funcionando
- ✅ **Personalización**: Temas y dashboard configurables

---

## 🔐 Configuración segura

Las credenciales administrativas y los secretos de infraestructura se configuran fuera del repositorio. Consulta `.env.example` para conocer los nombres requeridos.

---

## 📊 DATOS DE PRUEBA COMPLETOS

### 👤 Cliente Registrado:
```json
{
  "id": "6854aacddb7fae19cd4908f4",
  "codigoCliente": "CL-001", 
  "nombre": "María Salud Ramirez Caballero",
  "telefono": "+54 11 1234-5678",
  "email": "familia@email.com"
}
```

### 🌹 Memorial Completo:
```json
{
  "id": "6854ab0adb7fae19cd4908f9",
  "nombre": "María Salud Ramirez Caballero",
  "fechaNacimiento": "1934-05-15",
  "fechaFallecimiento": "2023-12-10", 
  "edadAlFallecer": 89,
  "biografia": "Biografía completa de 500+ palabras...",
  "qr": {
    "code": "86E6AB4C2E47",
    "url": "http://localhost:3000/memorial/86E6AB4C2E47"
  }
}
```

### 🎨 Dashboard Personalizado:
```json
{
  "tema": "elegante",
  "colorPrimario": "#8B4513",
  "colorSecundario": "#F5F5DC", 
  "colorAccento": "#D2691E",
  "secciones": ["biografia", "galeria_fotos", "videos", "condolencias"]
}
```

---

## 🚀 ENDPOINTS PRINCIPALES PROBADOS

### 🔐 AUTENTICACIÓN
```bash
# Login admin
POST /api/auth/login
Body: {"email":"ADMIN_EMAIL","password":"ADMIN_PASSWORD"}
Response: { token, user, planLimits }

# Perfil admin  
GET /api/auth/profile
Headers: Authorization: Bearer TOKEN
```

### 👥 GESTIÓN CLIENTES
```bash
# Listar clientes
GET /api/clients
Headers: Authorization: Bearer TOKEN
Response: { clients[], pagination }

# Crear cliente
POST /api/clients  
Body: {"nombre":"Nombre","apellido":"Apellido","telefono":"123","email":"email@domain.com"}
Response: { cliente con código único CL-XXX }

# Cliente específico
GET /api/clients/:id
GET /api/clients/code/CL-001
```

### 🌹 MEMORIALES  
```bash
# Crear memorial
POST /api/profiles
Body: {"clientId":"...", "nombre":"...", "fechaNacimiento":"...", "fechaFallecimiento":"...", "biografia":"..."}
Response: { memorial completo + QR automático }

# Memoriales por cliente
GET /api/profiles/client/:clientId

# Memorial específico
GET /api/profiles/:id
```

### 🌐 ACCESO PÚBLICO (SIN AUTENTICACIÓN)
```bash
# Memorial público vía QR ⭐ 
GET /api/memorial/86E6AB4C2E47
Response: { memorial completo, tracking de visitas }

# Dashboard público ⭐
GET /api/dashboard/public/6854ab0adb7fae19cd4908f9  
Response: { configuración, CSS generado, secciones }
```

### 🎨 PERSONALIZACIÓN
```bash
# Crear dashboard
POST /api/dashboard/:profileId
Body: {"tema":"elegante","colorPrimario":"#color"}

# Actualizar tema
PUT /api/dashboard/:profileId/theme
Body: {"tema":"elegante","configuracion":{...}}

# Actualizar secciones
PUT /api/dashboard/:profileId/sections
Body: {"secciones":[...]}
```

### 👨‍💼 PANEL ADMIN
```bash
# Dashboard principal
GET /api/admin/dashboard
Response: { estadísticas, clientes recientes, memoriales recientes }

# Búsqueda global
GET /api/admin/search?q=termino
Response: { clientes[], memoriales[] }

# Registro completo (cliente + memorial)
POST /api/admin/register-complete
Body: { cliente: {...}, memorial: {...} }
```

---

## 📱 EJEMPLO INTEGRACIÓN FRONTEND

### 🔗 Memorial Público (lo que ve la gente al escanear QR):
```javascript
// GET /api/memorial/86E6AB4C2E47
const memorial = await fetch('/api/memorial/86E6AB4C2E47');
const data = await memorial.json();

console.log(data.memorial.nombre);     // "María Salud Ramirez Caballero"
console.log(data.memorial.biografia);  // Biografía completa
console.log(data.memorial.edadAlFallecer); // 89
console.log(data.qr.vistas);          // Contador de visitas
```

### 🎨 Dashboard con CSS automático:
```javascript
// GET /api/dashboard/public/6854ab0adb7fae19cd4908f9
const config = await fetch('/api/dashboard/public/6854ab0adb7fae19cd4908f9');
const data = await config.json();

// CSS generado automáticamente
document.head.insertAdjacentHTML('beforeend', `<style>${data.css}</style>`);

// Secciones ordenadas y configuradas
data.secciones.forEach(seccion => {
  console.log(seccion.tipo);           // "biografia", "galeria_fotos", etc.
  console.log(seccion.configuracion); // Grid, list, timeline, etc.
});
```

### 🔐 Admin Dashboard:
```javascript
// Con token de autorización
const headers = {
  'Authorization': 'Bearer ' + token,
  'Content-Type': 'application/json'
};

// Dashboard del admin
const dashboard = await fetch('/api/admin/dashboard', { headers });
const stats = await dashboard.json();

console.log(stats.estadisticas.clientes.total);    // 1
console.log(stats.estadisticas.memoriales.total);  // 1
console.log(stats.actividades.clientesRecientes);  // [María Salud...]
```

---

## 🎯 FLUJO OPERATIVO COMPLETO

### 1️⃣ **Admin se logea**
```bash
POST /api/auth/login → Token
```

### 2️⃣ **Registra nuevo cliente**  
```bash
POST /api/clients → CL-002 generado
```

### 3️⃣ **Crea memorial para cliente**
```bash
POST /api/profiles → Memorial + QR automático
```

### 4️⃣ **Personaliza memorial**
```bash
PUT /api/dashboard/:id/theme → Colores, tema
POST /api/media/upload/:id → Fotos/videos
```

### 5️⃣ **Entrega QR físico**
```
QR contiene: http://localhost:3000/memorial/ABC123XYZ
```

### 6️⃣ **Público accede escaneando**
```bash
GET /api/memorial/ABC123XYZ → Memorial completo
```

---

## 🔧 CONFIGURACIÓN DE DESARROLLO

### 📁 Estructura del Proyecto:
```
src/modules/
├── admin/       # Panel administrativo  
├── auth/        # Solo login admin
├── clients/     # Gestión clientes
├── profiles/    # Memoriales (usa clientId)
├── media/       # Upload fotos/videos
├── qr/          # Generación QR
└── dashboard/   # Personalización
```

### 🌍 Variables de Entorno:
```bash
PORT=3000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
QR_BASE_URL=http://localhost:3000/memorial
```

### 🚀 Comandos Útiles:
```bash
# Iniciar servidor
npm run dev

# Verificar estado base de datos  
npm run check:db

# Crear nuevo admin (si es necesario)
npm run setup:admin

# Limpiar base de datos
npm run clear:db
```

---

## ✅ TESTING COMPLETADO

### 🎯 **Funcionalidades Probadas:**
- ✅ Autenticación JWT completa
- ✅ CRUD clientes con códigos únicos  
- ✅ Creación memoriales con biografía
- ✅ QR automático en creación memorial
- ✅ Acceso público sin autenticación
- ✅ Dashboard personalizable
- ✅ Temas y colores funcionando
- ✅ CSS generado automáticamente
- ✅ Panel admin con estadísticas
- ✅ Búsqueda y filtros
- ✅ Tracking de visitas QR
- ✅ Paginación y ordenamiento

### 📊 **Estadísticas Actuales:**
```
👥 Usuarios admin: 1
🏢 Clientes: 1 (CL-001)  
🌹 Memoriales: 1 (María Salud)
🔗 QRs: 1 (86E6AB4C2E47)
🎨 Dashboards: 1 (tema elegante)
```

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### ✅ **IMPLEMENTADO (Backend + Frontend):**

**🔐 Autenticación & Admin:**
* ✅ Login de administrador
* ✅ Dashboard principal con métricas reales
* ✅ Gestión completa de clientes (CRUD)
* ✅ Gestión completa de memoriales (CRUD)
* ✅ **Gestión de códigos QR** (nueva funcionalidad)

**🎯 Funcionalidades Core:**
* ✅ Generación automática de QR por memorial
* ✅ Páginas públicas de memoriales
* ✅ Sistema de comentarios con códigos de acceso
* ✅ Subida y gestión de media (fotos/videos)
* ✅ Configuración de privacidad de memoriales

**📊 Estadísticas & Reportes:**
* ✅ Métricas del dashboard conectadas
* ✅ Actividad reciente (clientes y memoriales)
* ✅ Estadísticas de QR y memoriales

### 🚧 **PENDIENTE POR IMPLEMENTAR:**

**📱 Frontend:**
* 🔄 **Carga de contenido** - Upload de fotos/videos en la interfaz
* 🔄 **Página de perfil de empresa** - Configuración y branding

**⚙️ Backend (opcional/futuro):**
* 🔄 Notificaciones por email
* 🔄 Exportación de datos
* 🔄 Analytics avanzados
* 🔄 API para integración externa

### 🎯 **PRIORIDADES INMEDIATAS:**
1. **Carga de contenido** → Para que los admins suban fotos/videos
2. **Perfil de empresa** → Personalización y configuración

---

## 🎉 SIGUIENTE PASO: INTEGRACIÓN

**¡El backend está 100% listo!** 

El frontend dev puede:
1. **Conectarse inmediatamente** al API
2. **Usar los datos de María Salud** para desarrollo
3. **Probar todos los flujos** sin crear data adicional
4. **Enfocarse en UI/UX** sin preocuparse por backend

---

## 📞 SOPORTE

Si hay algún endpoint que no funciona o necesitas ajustes:
1. **Revisar logs** del servidor
2. **Verificar headers** de autorización  
3. **Consultar este documento** para ejemplos
4. **Probar con curl** antes de integrar
