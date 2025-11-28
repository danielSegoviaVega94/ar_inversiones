# 🚀 Guía de Despliegue del Backend en Render.com

Esta guía te llevará paso a paso por el proceso de desplegar el backend de AR Inversiones en Render.com, desde la creación de tu cuenta hasta tener tu API funcionando en producción.

## 📋 Tabla de Contenidos

1. [¿Qué es Render?](#qué-es-render)
2. [Requisitos Previos](#requisitos-previos)
3. [Análisis del Proyecto](#análisis-del-proyecto)
4. [Configuración Inicial](#configuración-inicial)
5. [Deployment en Render](#deployment-en-render)
6. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
7. [Verificación del Deployment](#verificación-del-deployment)
8. [Consideraciones Importantes](#consideraciones-importantes)
9. [Troubleshooting](#troubleshooting)
10. [Próximos Pasos](#próximos-pasos)

---

## ¿Qué es Render?

**Render** es una plataforma moderna de cloud hosting que permite desplegar aplicaciones web, APIs, bases de datos y más de forma sencilla. Es similar a Heroku pero con mejores características en su plan gratuito.

### Ventajas de Render:
- ✅ **Plan gratuito generoso** con 750 horas/mes
- ✅ **Deploy automático** desde Git
- ✅ **SSL/HTTPS gratuito** automático
- ✅ **Fácil configuración** de variables de entorno
- ✅ **Logs en tiempo real**
- ✅ **Sin necesidad de tarjeta de crédito** para el plan gratuito

### Limitaciones del Plan Gratuito:
- ⚠️ El servicio **se duerme después de 15 minutos** de inactividad
- ⚠️ **No incluye almacenamiento persistente** (discos)
- ⚠️ Primer request después de dormir toma ~30-60 segundos

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener:

### 1. Cuenta de GitHub
- Tu código debe estar en un repositorio de GitHub
- La rama que quieres desplegar debe estar pusheada

### 2. Credenciales de Flow (Pasarela de Pago)
- `FLOW_API_KEY` - Tu API Key de Flow
- `FLOW_SECRET_KEY` - Tu Secret Key de Flow
- Puedes obtenerlas en: [Flow Dashboard](https://www.flow.cl)
- Para desarrollo, usa el ambiente **sandbox**
- Para producción, usa el ambiente **producción**

### 3. Configuración de Email (Gmail)
- Una cuenta de Gmail
- **App Password** de Gmail (no tu contraseña normal)
- Sigue la guía `GMAIL_SETUP.md` de este proyecto para configurar Gmail

### 4. URL del Frontend
- La URL donde estará desplegado tu frontend (ej: `https://mi-app.vercel.app`)
- Esto es necesario para los redirects después del pago

---

## Análisis del Proyecto

### Arquitectura del Backend

Tu backend es una aplicación **Express + TypeScript** que incluye:

```
server/
├── index.ts                    # Servidor principal
├── services/
│   ├── flowService.ts         # Integración con Flow (pagos)
│   ├── emailService.ts        # Envío de emails con Nodemailer
│   └── ticketService.ts       # Gestión de tickets
└── utils/
    └── flowSignature.ts       # Validación de firmas de Flow
```

### Funcionalidades Principales:

1. **API de Pagos con Flow**
   - Crear pagos
   - Webhook de confirmación
   - Verificación de pagos

2. **Sistema de Tickets**
   - Reserva de tickets (máximo 10,000)
   - Confirmación post-pago
   - Almacenamiento en `tickets.json`

3. **Envío de Emails**
   - Email de confirmación con ticket
   - Formato HTML profesional

### Endpoints de la API:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/payment/create` | Crear nuevo pago |
| POST | `/api/payment/confirm` | Webhook de Flow |
| GET | `/api/payment/result` | Redirect después de pago |
| GET | `/api/payment/verify/:token` | Verificar pago por token |
| GET | `/api/payment/status/:commerceOrder` | Estado del pago |
| GET | `/api/tickets/stats` | Estadísticas de tickets |
| GET | `/api/tickets/order/:commerceOrder` | Ticket por orden |

---

## Configuración Inicial

### Paso 1: Crear Cuenta en Render

1. Ve a [render.com](https://render.com)
2. Haz click en **"Get Started"** o **"Sign Up"**
3. Puedes registrarte con:
   - GitHub (recomendado - más fácil para deploy)
   - GitLab
   - Email

4. Si eliges GitHub:
   - Autoriza a Render para acceder a tus repositorios
   - Puedes dar acceso a todos los repos o solo a los que selecciones

### Paso 2: Familiarízate con el Dashboard

Una vez dentro verás:
- **Dashboard**: Vista general de tus servicios
- **New +**: Botón para crear nuevos servicios
- **Services**: Lista de tus servicios desplegados

---

## Deployment en Render

### Paso 1: Crear un Nuevo Web Service

1. En el Dashboard, haz click en **"New +"** (arriba a la derecha)
2. Selecciona **"Web Service"**

### Paso 2: Conectar tu Repositorio

#### Opción A: Si diste acceso completo a GitHub
- Verás una lista de todos tus repositorios
- Busca **"ar_inversiones"** (o el nombre de tu repo)
- Haz click en **"Connect"**

#### Opción B: Si no aparece tu repositorio
1. Haz click en **"Configure account"**
2. Autoriza el acceso al repositorio específico
3. Regresa y conéctalo

### Paso 3: Configurar el Web Service

Render te mostrará un formulario de configuración. Completa los campos:

#### Configuración Básica:

**Name** (Nombre del servicio):
```
ar-inversiones-backend
```
*Nota: Este nombre será parte de tu URL*

**Region** (Región):
```
Oregon (US West) - Recomendado para Latinoamérica
```

**Branch** (Rama):
```
feature/dev-estable-3
```
*O la rama que quieras desplegar*

**Root Directory** (Directorio raíz):
```
(dejar vacío)
```
*El backend está en la raíz del proyecto*

#### Configuración de Build:

**Runtime**:
```
Node
```

**Build Command** (Comando de construcción):
```
npm install && npm run server:build
```

**Start Command** (Comando de inicio):
```
npm run server:start
```

**Plan**:
```
Free
```
*Puedes cambiar a un plan de pago después si lo necesitas*

### Paso 4: Configurar Auto-Deploy

**Auto-Deploy**:
- ✅ **Activado** (recomendado)
- Esto desplegará automáticamente cuando hagas push a la rama

---

## Configuración de Variables de Entorno

Las variables de entorno son **CRÍTICAS** para que tu backend funcione. Render te permite configurarlas de forma segura.

### Paso 1: Acceder a Environment Variables

1. Antes de hacer click en **"Create Web Service"**, baja hasta la sección **"Environment Variables"**
2. O después del deploy, ve a tu servicio → **"Environment"** en el menú lateral

### Paso 2: Agregar Variables de Entorno

Haz click en **"Add Environment Variable"** y agrega las siguientes:

#### Variables de Flow (Pagos):

```bash
FLOW_API_KEY=tu_api_key_aqui
```
- ⚠️ **IMPORTANTE**: Pega tu API Key real de Flow
- Para desarrollo usa las credenciales de **Sandbox**
- Para producción usa las credenciales **reales**

```bash
FLOW_SECRET_KEY=tu_secret_key_aqui
```
- ⚠️ Esta clave es **MUY SENSIBLE** - nunca la compartas

```bash
FLOW_API_URL=https://sandbox.flow.cl/api
```
- Para desarrollo: `https://sandbox.flow.cl/api`
- Para producción: `https://www.flow.cl/api`

#### Variables del Servidor:

```bash
PORT=3001
```
- Render asigna un PORT automáticamente, pero el código ya lo maneja con `process.env.PORT || 3001`

```bash
BASE_URL=https://ar-inversiones-backend.onrender.com
```
- ⚠️ **IMPORTANTE**: Reemplaza con la URL real que Render asignará a tu servicio
- La encontrarás después del primer deploy
- Formato: `https://[nombre-servicio].onrender.com`
- Esta URL se usa para los webhooks de Flow

```bash
FRONTEND_URL=https://tu-frontend.vercel.app
```
- ⚠️ **IMPORTANTE**: URL donde está desplegado tu frontend
- Se usa para redireccionar al usuario después del pago
- Ejemplos:
  - `https://mi-app.vercel.app`
  - `https://www.midominio.com`
  - `http://localhost:3000` (solo para testing local)

#### Variables de Email (Gmail):

```bash
EMAIL_HOST=smtp.gmail.com
```

```bash
EMAIL_PORT=587
```

```bash
EMAIL_SECURE=false
```

```bash
EMAIL_USER=tu-email@gmail.com
```
- Tu cuenta de Gmail que enviará los emails

```bash
EMAIL_PASS=xxxx xxxx xxxx xxxx
```
- ⚠️ **IMPORTANTE**: Usa un **App Password** de Gmail, NO tu contraseña normal
- Sigue la guía `GMAIL_SETUP.md` para generar esto
- Formato: 16 caracteres sin espacios (ejemplo: `abcdabcdabcdabcd`)

```bash
EMAIL_FROM=AR Inversiones <noreply@arinversiones.cl>
```

#### Variable de Entorno (Opcional):

```bash
NODE_ENV=production
```

### Paso 3: Guardar Variables

Una vez agregadas todas las variables:
1. Haz click en **"Save Changes"** si ya creaste el servicio
2. O haz click en **"Create Web Service"** si es la primera vez

---

## Verificación del Deployment

### Paso 1: Monitorear el Build

1. Render comenzará a construir tu aplicación
2. Verás los logs en tiempo real en la pestaña **"Logs"**
3. El proceso tomará varios minutos la primera vez

### Paso 2: Verificar el Estado

Busca estos mensajes en los logs:

```
==> Installing dependencies
npm install
...

==> Building application
npm run server:build
...

==> Starting service
npm run server:start

🚀 Server running on port 3001
📊 Flow API URL: https://sandbox.flow.cl/api
🔑 Flow API Key: xxxxxxxxx...
✅ Email service initialized
🎫 Tickets: 0 vendidos | 10000 disponibles de 10000
```

### Paso 3: Obtener la URL del Servicio

1. Una vez desplegado, verás la URL en la parte superior:
   ```
   https://ar-inversiones-backend.onrender.com
   ```

2. **⚠️ IMPORTANTE**: Ahora debes actualizar la variable `BASE_URL`:
   - Ve a **Environment** en el menú lateral
   - Edita `BASE_URL` con la URL real
   - Guarda los cambios
   - El servicio se redesplegará automáticamente

### Paso 4: Probar el Health Check

Abre tu navegador y visita:
```
https://[tu-servicio].onrender.com/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "service": "Flow Payment Integration"
}
```

### Paso 5: Verificar Estadísticas de Tickets

Visita:
```
https://[tu-servicio].onrender.com/api/tickets/stats
```

Deberías ver:
```json
{
  "totalTickets": 0,
  "confirmed": 0,
  "pending": 0,
  "cancelled": 0,
  "available": 10000,
  "maxTickets": 10000,
  "nextTicketNumber": 1
}
```

---

## Consideraciones Importantes

### ⚠️ CRÍTICO: Almacenamiento Persistente

Tu aplicación usa `tickets.json` para almacenar los tickets. **PROBLEMA**:

- El plan Free de Render **NO tiene almacenamiento persistente**
- Cada vez que el servicio se reinicia o se duerme, **SE PIERDEN LOS DATOS**
- Esto es **INACEPTABLE** para producción con datos reales

#### Soluciones:

**Opción 1: Usar un Plan de Pago con Disco Persistente**
- Render ofrece discos persistentes desde $7/mes
- Configura un disco y monta en el path donde se guarda `tickets.json`

**Opción 2: Migrar a una Base de Datos (RECOMENDADO)**
- Usa PostgreSQL, MongoDB, o Supabase
- Los datos persisten independientemente de reinicios
- Render ofrece PostgreSQL gratuito (límites aplicables)

**Opción 3: Solo para Testing**
- Si solo estás probando, el almacenamiento temporal está bien
- ⚠️ **NUNCA uses esto en producción con clientes reales**

### 🔒 Seguridad

1. **Nunca** compartas tus variables de entorno
2. **Nunca** hagas commit de archivos `.env` al repositorio
3. Usa **HTTPS** siempre (Render lo proporciona gratis)
4. Cambia de Sandbox a Producción en Flow cuando estés listo
5. Monitorea los logs regularmente

### 💰 Costos

**Plan Free:**
- $0/mes
- 750 horas/mes (suficiente para 1 servicio 24/7)
- El servicio se duerme tras 15 minutos de inactividad
- Primer request después de dormir: ~30-60 segundos

**Plan Starter:**
- $7/mes por servicio
- Siempre activo (no se duerme)
- Incluye 100GB de ancho de banda

**Disco Persistente:**
- Desde $7/mes por 10GB
- **Necesario si quieres persistencia con tickets.json**

### 📧 Configuración de Email

- **IMPORTANTE**: Gmail tiene límites de envío diario
- Free Gmail: ~500 emails/día
- Google Workspace: ~2000 emails/día
- Para volumen alto, considera servicios como SendGrid, Mailgun, o AWS SES

### 🌐 Configurar Webhooks de Flow

Flow necesita enviar confirmaciones de pago a tu backend:

1. Inicia sesión en tu cuenta de Flow
2. Ve a **Configuración → Webhooks** (o similar)
3. Agrega la URL de confirmación:
   ```
   https://[tu-servicio].onrender.com/api/payment/confirm
   ```
4. Flow enviará POST requests a este endpoint cuando haya cambios en pagos

---

## Troubleshooting

### Problema: Build Falla

**Error**: `Cannot find module 'typescript'`

**Solución**: Asegúrate de que TypeScript esté en `dependencies` (no `devDependencies`)

```json
"dependencies": {
  "typescript": "~5.8.2",
  "@types/express": "^4.17.21",
  "@types/node": "^22.14.0",
  ...
}
```

---

### Problema: Servicio Inicia pero Crashea

**Síntomas**: Logs muestran error de puerto o variables de entorno

**Solución 1**: Verifica que todas las variables de entorno estén configuradas
```bash
# En Render, ve a Environment y verifica:
FLOW_API_KEY
FLOW_SECRET_KEY
EMAIL_USER
EMAIL_PASS
```

**Solución 2**: Verifica los logs para mensajes de error específicos
```
Environment → Logs → Busca líneas rojas
```

---

### Problema: Email No Se Envía

**Error**: `Invalid login: 535-5.7.8 Username and Password not accepted`

**Causas comunes**:
1. Estás usando tu contraseña de Gmail (incorrecta)
2. No has generado un App Password
3. El App Password tiene espacios (elimínalos)

**Solución**:
1. Ve a [Google Account → Security](https://myaccount.google.com/security)
2. Habilita **2-Step Verification**
3. Ve a **App Passwords**
4. Genera un password para "Mail"
5. Copia el password de 16 caracteres (sin espacios)
6. Actualiza `EMAIL_PASS` en Render

---

### Problema: Webhook de Flow No Funciona

**Síntomas**: Pagos no se confirman automáticamente

**Solución**:
1. Verifica que `BASE_URL` esté configurada correctamente
2. Verifica que Flow tenga configurada la URL del webhook
3. Revisa los logs para ver si llegan requests de Flow
4. Prueba con la URL completa:
   ```
   https://[tu-servicio].onrender.com/api/payment/confirm
   ```

---

### Problema: Servicio se Duerme

**Síntomas**: Primer request tarda 30-60 segundos

**Causa**: Plan Free de Render duerme servicios tras 15 min de inactividad

**Soluciones**:
1. **Upgradar a plan Starter** ($7/mes) - servicio siempre activo
2. **Usar un servicio de ping** como [UptimeRobot](https://uptimerobot.com):
   - Crea una cuenta gratis
   - Agrega tu URL de health check
   - Configura ping cada 5 minutos
   - Esto mantiene tu servicio despierto

---

### Problema: Datos de Tickets se Pierden

**Causa**: Plan Free no tiene almacenamiento persistente

**Soluciones**:
1. **Upgradar a plan con disco persistente** (desde $7/mes)
2. **Migrar a base de datos** (recomendado):
   - PostgreSQL en Render (plan free disponible)
   - MongoDB Atlas (plan free disponible)
   - Supabase (plan free disponible)

---

## Próximos Pasos

### 1. Migrar a Base de Datos (Alta Prioridad)

El almacenamiento en archivo JSON no es viable para producción. Considera:

**PostgreSQL con Prisma**:
- Render ofrece PostgreSQL gratuito
- Prisma es un ORM moderno para TypeScript
- [Guía de Prisma](https://www.prisma.io/docs/getting-started)

**Supabase**:
- Base de datos PostgreSQL + Auth + Storage
- Plan gratuito generoso
- Ya tienes una guía: `DEPLOYMENT_SUPABASE.md`

### 2. Configurar Dominio Personalizado

En lugar de `[servicio].onrender.com`:

1. Compra un dominio (ej: arinversiones.cl - ¡ya lo tienes!)
2. En Render, ve a **Settings → Custom Domain**
3. Agrega tu dominio
4. Configura DNS según las instrucciones de Render
5. SSL automático incluido

### 3. Configurar Monitoring

**Render incluye**:
- Logs en tiempo real
- Métricas de CPU/memoria
- Histórico de deploys

**Servicios adicionales**:
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- [UptimeRobot](https://uptimerobot.com) - Uptime monitoring

### 4. Configurar CI/CD Avanzado

**GitHub Actions**:
```yaml
# .github/workflows/deploy.yml
name: Deploy to Render
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
      # Render auto-deploys after tests pass
```

### 5. Optimizaciones de Producción

**Seguridad**:
```bash
npm install helmet express-rate-limit
```

**Logging**:
```bash
npm install winston morgan
```

**Variables de entorno**:
- Separa configuración de Sandbox y Producción
- Usa diferentes servicios en Render para staging/production

### 6. Desplegar el Frontend

El backend solo es una parte. También necesitas desplegar el frontend:

**Opciones recomendadas**:
- **Vercel** - Ideal para React/Next.js
- **Netlify** - Alternativa popular
- **Render** - Puedes hospedar frontend y backend juntos

Recuerda configurar `FRONTEND_URL` en las variables de entorno del backend.

---

## 📚 Recursos Adicionales

### Documentación Oficial:
- [Render Docs](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [Environment Variables](https://render.com/docs/environment-variables)

### Tutoriales relacionados en este proyecto:
- `GMAIL_SETUP.md` - Configurar Gmail para envío de emails
- `FLOW_INTEGRATION.md` - Integración con Flow (pagos)
- `DEPLOYMENT_SUPABASE.md` - Alternativa con Supabase
- `TICKET_SYSTEM_README.md` - Sistema de tickets

### Comunidad y Soporte:
- [Render Community Forum](https://community.render.com)
- [Render Discord](https://render.com/discord)
- [Stack Overflow - Render Tag](https://stackoverflow.com/questions/tagged/render)

---

## ✅ Checklist Final

Antes de considerar el deployment completo, verifica:

- [ ] ✅ Cuenta de Render creada y verificada
- [ ] ✅ Repositorio conectado a Render
- [ ] ✅ Build command configurado: `npm install && npm run server:build`
- [ ] ✅ Start command configurado: `npm run server:start`
- [ ] ✅ Todas las variables de entorno configuradas
- [ ] ✅ `BASE_URL` actualizada con la URL de Render
- [ ] ✅ `FRONTEND_URL` configurada con la URL del frontend
- [ ] ✅ Gmail App Password generado y configurado
- [ ] ✅ Credenciales de Flow configuradas
- [ ] ✅ Health check funcionando (`/api/health`)
- [ ] ✅ Endpoint de tickets funcionando (`/api/tickets/stats`)
- [ ] ✅ Webhook URL configurada en Flow Dashboard
- [ ] ✅ Email de prueba enviado correctamente
- [ ] ✅ Pago de prueba realizado (modo sandbox)
- [ ] ⚠️ Plan de migración a BD creado (si vas a producción)
- [ ] 📖 Documentación leída y comprendida

---

## 🎉 ¡Felicitaciones!

Si completaste todos los pasos, tu backend está desplegado y funcionando en Render.

**Recuerda**:
- Monitorea los logs regularmente
- Migra a base de datos antes de producción real
- Mantén tus secretos seguros
- Prueba exhaustivamente antes de lanzar

**¿Necesitas ayuda?**
- Revisa la sección de Troubleshooting
- Consulta los documentos relacionados en el proyecto
- Abre un issue en GitHub

---

*Última actualización: Noviembre 2025*
*Versión: 1.0*
*Autor: Claude AI Assistant*
