# 🏗️ Arquitectura del Sistema - Osvaldo Inversiones

## 📊 Resumen Ejecutivo

Este documento explica cómo funciona todo el sistema de venta de tickets con integración de Flow y envío de correos.

---

## 🎯 Stack Tecnológico

### **Frontend**
- **React 19** + **TypeScript** - Interfaz de usuario
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Estilos
- **React Router DOM** - Navegación
- **Lucide React** - Iconos

### **Backend**
- **Node.js** + **Express** - Servidor API REST
- **TypeScript** - Tipado estático
- **Axios** - Cliente HTTP para Flow API
- **Nodemailer** - Envío de correos
- **CORS** - Manejo de peticiones cross-origin

### **Base de Datos**
- **tickets.json** - Archivo JSON plano (desarrollo)
- **Supabase PostgreSQL** - Base de datos (producción)

### **Servicios Externos**
- **Flow Sandbox/Producción** - Pasarela de pago
- **Gmail SMTP** - Envío de correos

---

## 📁 Estructura de Archivos

```
ar_inversiones/
│
├── 📂 Frontend (React + Vite)
│   ├── components/
│   │   ├── HomePage.tsx          # Página principal
│   │   ├── Header.tsx             # Cabecera
│   │   ├── Hero.tsx               # Banner principal
│   │   ├── ProjectsSection.tsx    # Sección de tickets
│   │   ├── FlowModal.tsx          # Modal de pago
│   │   ├── PaymentResult.tsx      # Resultado del pago
│   │   └── ...otros
│   ├── App.tsx                    # Componente raíz
│   ├── index.tsx                  # Entry point
│   ├── types.ts                   # Tipos TypeScript
│   ├── constants.ts               # Constantes (productos)
│   └── vite.config.ts             # Config de Vite
│
├── 📂 Backend (Express + TypeScript)
│   ├── server/
│   │   ├── index.ts               # Servidor principal
│   │   ├── services/
│   │   │   ├── flowService.ts     # Integración con Flow
│   │   │   ├── ticketService.ts   # Gestión de tickets
│   │   │   └── emailService.ts    # Envío de correos
│   │   └── utils/
│   │       └── flowSignature.ts   # Firma HMAC-SHA256
│   └── test-email.ts              # Script de prueba
│
├── 📂 Base de Datos
│   └── tickets.json               # BD en desarrollo (JSON)
│
├── 📂 Configuración
│   ├── .env                       # Variables de entorno (NO subir)
│   ├── .env.example               # Ejemplo de .env
│   ├── package.json               # Dependencias
│   ├── tsconfig.json              # Config TypeScript (frontend)
│   └── tsconfig.server.json       # Config TypeScript (backend)
│
└── 📂 Documentación
    ├── FLOW_INTEGRATION.md
    ├── TICKET_SYSTEM_README.md
    ├── GMAIL_SETUP.md
    ├── DIAGNOSTICO_FLOW.md
    └── ARQUITECTURA_SISTEMA.md    # Este archivo
```

---

## 🔄 Flujo de Datos Completo

### **1️⃣ Usuario Accede a la Página**

```
Usuario → Browser → http://localhost:3000
                    ↓
                Frontend (React)
                    ↓
            Muestra página principal
            con botón "LO QUIERO"
```

---

### **2️⃣ Usuario Inicia Compra**

```
Usuario hace clic en "LO QUIERO"
            ↓
    Se abre FlowModal
            ↓
    Usuario llena formulario:
    - Nombre
    - Email
    - RUT
    - Teléfono
            ↓
    Hace clic en "Pagar con Flow"
```

---

### **3️⃣ Frontend Crea el Pago**

```javascript
// FlowModal.tsx
const response = await fetch('http://localhost:3001/api/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 10000,
    subject: 'TICKET OFICIAL',
    email: 'usuario@ejemplo.com',
    payerName: 'Juan Pérez',
    rut: '12.345.678-9',
    phone: '+56912345678',
    productId: 'ticket-unico'
  })
});
```

**Frontend envía:**
- Datos del usuario
- Monto a pagar
- Información del producto

**↓ FETCH a Backend**

---

### **4️⃣ Backend Procesa la Petición**

```typescript
// server/index.ts - Endpoint POST /api/payment/create

1. ✅ Validar campos requeridos
2. ✅ Verificar tickets disponibles (TicketService)
3. ✅ Reservar número de ticket (1-10000)
4. ✅ Crear pago en Flow (FlowService)
5. ✅ Guardar información en BD
6. ✅ Responder al frontend
```

**Código simplificado:**

```typescript
app.post('/api/payment/create', async (req, res) => {
  // 1. Validar
  if (!amount || !email || !payerName) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // 2. Verificar disponibilidad
  const available = await ticketService.areTicketsAvailable();
  if (!available) {
    return res.status(400).json({ error: 'No tickets available' });
  }

  // 3. Reservar ticket
  const ticket = await ticketService.reserveTicket({
    commerceOrder: 'ORD-...',
    email,
    payerName,
    rut,
    phone
  });
  // ticket.ticketNumber = 1, 2, 3, etc.

  // 4. Crear pago en Flow
  const paymentResponse = await flowService.createPayment({
    commerceOrder: ticket.commerceOrder,
    subject: 'TICKET OFICIAL',
    amount: 10000,
    email,
    payerName,
    urlConfirmation: 'http://localhost:3001/api/payment/confirm',
    urlReturn: 'http://localhost:3001/api/payment/result'
  });
  // Flow responde: { url, token, flowOrder }

  // 5. Guardar en BD (tickets.json)
  await saveToDatabase({
    ...ticket,
    flowOrder: paymentResponse.flowOrder,
    token: paymentResponse.token
  });

  // 6. Responder al frontend
  res.json({
    success: true,
    paymentUrl: paymentResponse.url,  // URL de Flow
    token: paymentResponse.token,
    ticketNumber: ticket.ticketNumber
  });
});
```

**Backend responde con:**
```json
{
  "success": true,
  "paymentUrl": "https://sandbox.flow.cl/app/web/pay.php",
  "token": "ABC123...",
  "flowOrder": 4687188,
  "commerceOrder": "ORD-1234567890-abc",
  "ticketNumber": 42
}
```

**↓ Respuesta a Frontend**

---

### **5️⃣ Frontend Redirige a Flow**

```javascript
// FlowModal.tsx
const data = await response.json();

if (data.success && data.paymentUrl && data.token) {
  // Redirigir al usuario a Flow
  window.location.href = `${data.paymentUrl}?token=${data.token}`;
}
```

**Usuario es redirigido a:**
```
https://sandbox.flow.cl/app/web/pay.php?token=ABC123...
```

**↓ Usuario completa el pago en Flow**

---

### **6️⃣ Flow Procesa el Pago**

```
Usuario en página de Flow
        ↓
    Elige método de pago
    (WebPay, tarjeta, etc.)
        ↓
    Ingresa datos de pago
        ↓
    Flow procesa el pago
        ↓
    ✅ Pago aprobado
    ❌ Pago rechazado
```

---

### **7️⃣ Flow Notifica al Backend (Webhook)**

Flow envía notificación POST al webhook:

```
POST http://localhost:3001/api/payment/confirm
Body: token=ABC123&s=firma_hmac
```

**Backend procesa el webhook:**

```typescript
// server/index.ts - Endpoint POST /api/payment/confirm

app.post('/api/payment/confirm', async (req, res) => {
  const params = req.body; // { token, s }

  // 1. Verificar firma HMAC (seguridad)
  const isValid = verifyFlowSignature(params, SECRET_KEY);
  if (!isValid) {
    return res.status(400).send('INVALID SIGNATURE');
  }

  // 2. Obtener estado del pago de Flow
  const paymentStatus = await flowService.getPaymentStatus(params.token);
  // paymentStatus.status: 1=pendiente, 2=aprobado, 3=rechazado

  // 3. Flow espera respuesta "CONFIRMADO"
  res.send('CONFIRMADO');

  // 4. Procesar asíncronamente
  if (paymentStatus.status === 2) {
    // ✅ PAGO APROBADO

    // a) Confirmar ticket
    const ticket = await ticketService.confirmTicket(
      paymentStatus.commerceOrder,
      paymentStatus.flowOrder
    );

    // b) Enviar email con número de ticket
    await emailService.sendTicketEmail(ticket);

    console.log(`✅ Ticket #${ticket.ticketNumber} confirmado`);
    console.log(`📧 Email enviado a ${ticket.email}`);
  } else {
    // ❌ PAGO RECHAZADO
    await ticketService.cancelTicket(paymentStatus.commerceOrder);
  }
});
```

---

### **8️⃣ Flow Redirige al Usuario de Vuelta**

Flow redirige al usuario a:

```
POST http://localhost:3001/api/payment/result?token=ABC123
```

**Backend maneja el retorno:**

```typescript
// server/index.ts - Endpoint ALL /api/payment/result

app.all('/api/payment/result', (req, res) => {
  const token = req.body.token || req.query.token;

  // Redirigir al frontend
  res.redirect(`http://localhost:3000/payment/result?token=${token}`);
});
```

**Usuario es redirigido a:**
```
http://localhost:3000/payment/result?token=ABC123
```

---

### **9️⃣ Frontend Muestra el Resultado**

```typescript
// PaymentResult.tsx

const token = searchParams.get('token');

// Verificar estado del pago
const response = await fetch(`http://localhost:3001/api/payment/verify/${token}`);
const data = await response.json();

if (data.status === 'approved') {
  // ✅ Mostrar mensaje de éxito
  // "¡Pago Exitoso! Recibirás un correo con tu ticket"
} else if (data.status === 'rejected') {
  // ❌ Mostrar mensaje de error
  // "Pago Rechazado. Intenta nuevamente"
} else {
  // ⏳ Pago pendiente
}
```

---

### **🔟 Usuario Recibe el Email**

```
📧 Email enviado por emailService:

De: Osvaldo Inversiones <noreply@osvaldoinversiones.cl>
Para: usuario@ejemplo.com
Asunto: 🎫 Tu Ticket #00042 - Osvaldo Inversiones

┌─────────────────────────────────┐
│   🎉 ¡Compra Exitosa!           │
├─────────────────────────────────┤
│ Hola Juan Pérez,                │
│                                 │
│ ┌─────────────────────────┐    │
│ │  Tu Número de Ticket    │    │
│ │       #00042            │    │
│ └─────────────────────────┘    │
│                                 │
│ 📋 Detalles de tu Compra       │
│ • Nombre: Juan Pérez            │
│ • Email: usuario@ejemplo.com    │
│ • RUT: 12.345.678-9            │
│ • Monto: $10.000 CLP           │
│ • Fecha: 27/11/2025            │
│                                 │
│ 🍀 ¡Mucha suerte!              │
└─────────────────────────────────┘
```

---

## 💾 Base de Datos: tickets.json

### **Estructura Actual (Desarrollo)**

```json
{
  "nextTicketNumber": 43,
  "maxTickets": 10000,
  "tickets": [
    {
      "ticketNumber": 1,
      "commerceOrder": "ORD-1234567890-abc123",
      "email": "usuario1@ejemplo.com",
      "payerName": "Juan Pérez",
      "rut": "12.345.678-9",
      "phone": "+56912345678",
      "purchaseDate": "2025-11-27T10:30:00.000Z",
      "status": "confirmed",
      "flowOrder": 4687188
    },
    {
      "ticketNumber": 2,
      "commerceOrder": "ORD-1234567891-def456",
      "email": "usuario2@ejemplo.com",
      "payerName": "María López",
      "rut": "98.765.432-1",
      "phone": "+56987654321",
      "purchaseDate": "2025-11-27T11:45:00.000Z",
      "status": "confirmed",
      "flowOrder": 4687189
    }
  ]
}
```

### **Cómo Funciona**

1. **Inicialización:**
   - Al iniciar el servidor, se carga `tickets.json`
   - Si no existe, se crea con `nextTicketNumber: 1`

2. **Reserva de Ticket:**
   ```typescript
   const ticket = await ticketService.reserveTicket({
     commerceOrder: 'ORD-...',
     email: 'usuario@ejemplo.com',
     payerName: 'Juan Pérez',
     ...
   });
   // Se asigna ticketNumber = nextTicketNumber
   // Se incrementa nextTicketNumber
   // Se guarda en el array tickets[]
   // Se persiste en disco (tickets.json)
   ```

3. **Confirmación de Ticket:**
   ```typescript
   await ticketService.confirmTicket(commerceOrder, flowOrder);
   // Busca el ticket por commerceOrder
   // Cambia status: 'pending' → 'confirmed'
   // Actualiza flowOrder
   // Persiste cambios en disco
   ```

4. **Cancelación de Ticket:**
   ```typescript
   await ticketService.cancelTicket(commerceOrder);
   // Cambia status: 'pending' → 'cancelled'
   // El número NO se reutiliza
   ```

### **Ventajas:**
- ✅ Simple y fácil de entender
- ✅ Sin dependencias externas
- ✅ Persistencia en disco
- ✅ Perfecto para desarrollo

### **Desventajas:**
- ❌ No escalable (solo 1 servidor)
- ❌ Sin transacciones ACID
- ❌ Sin consultas complejas
- ❌ No apto para producción con tráfico alto

---

## 🔐 Seguridad del Sistema

### **1. Firma HMAC-SHA256 (Flow)**

Todas las peticiones a Flow se firman:

```typescript
// utils/flowSignature.ts

function generateFlowSignature(params, secretKey) {
  // 1. Ordenar parámetros alfabéticamente
  const sortedKeys = Object.keys(params).sort();

  // 2. Concatenar claves y valores
  const concatenated = sortedKeys
    .map(key => `${key}${params[key]}`)
    .join('');
  // Ejemplo: "amount10000apiKeyABC123email..."

  // 3. Generar firma HMAC-SHA256
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(concatenated)
    .digest('hex');

  return signature;
}
```

**Se usa en:**
- Peticiones a Flow API (create payment, get status)
- Verificación de webhooks

---

### **2. Validación de Webhooks**

```typescript
const isValid = verifyFlowSignature(params, SECRET_KEY);
if (!isValid) {
  return res.status(400).send('INVALID SIGNATURE');
}
```

Esto previene que alguien envíe webhooks falsos.

---

### **3. Variables de Entorno (.env)**

```env
FLOW_API_KEY=...         # NO exponer en frontend
FLOW_SECRET_KEY=...      # NO exponer en frontend
EMAIL_USER=...           # NO exponer en frontend
EMAIL_PASS=...           # NO exponer en frontend
```

El archivo `.env` está en `.gitignore` para no subirlo a GitHub.

---

### **4. CORS (Cross-Origin)**

```typescript
app.use(cors()); // Permite peticiones desde localhost:3000
```

En producción, configurar específicamente:

```typescript
app.use(cors({
  origin: 'https://tudominio.com'
}));
```

---

## 🚀 Endpoints de la API

### **Pagos**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/payment/create` | Crear pago en Flow |
| POST | `/api/payment/confirm` | Webhook de Flow |
| ALL | `/api/payment/result` | Retorno de Flow |
| GET | `/api/payment/verify/:token` | Verificar estado por token |
| GET | `/api/payment/status/:commerceOrder` | Estado por orden |

### **Tickets**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tickets/stats` | Estadísticas de ventas |
| GET | `/api/tickets/order/:commerceOrder` | Info de ticket |

### **Health Check**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Estado del servidor |

---

## 📊 Diagramas

### **Diagrama de Componentes**

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                    │
├─────────────────────────────────────────────────────────┤
│  HomePage → FlowModal → PaymentResult                   │
│  (localhost:3000)                                        │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/Fetch
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Express)                       │
├─────────────────────────────────────────────────────────┤
│  • flowService.ts      → Flow API                       │
│  • ticketService.ts    → tickets.json                   │
│  • emailService.ts     → Gmail SMTP                     │
│  (localhost:3001)                                        │
└───────┬─────────────────────┬─────────────────┬─────────┘
        │                     │                 │
        ▼                     ▼                 ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Flow API   │    │ tickets.json │    │  Gmail SMTP  │
│  (Sandbox)   │    │     (BD)     │    │   (Email)    │
└──────────────┘    └──────────────┘    └──────────────┘
```

### **Diagrama de Flujo de Pago**

```
[Usuario] → [Frontend] → [Backend] → [Flow API]
                            ↓
                      [TicketService]
                            ↓
                      [tickets.json]
                            ↓
              Ticket reservado con número único
                            ↓
                    [Flow responde]
                            ↓
              [Frontend redirige a Flow]
                            ↓
              [Usuario paga en Flow]
                            ↓
              [Flow envía webhook]
                            ↓
              [Backend confirma ticket]
                            ↓
              [EmailService envía correo]
                            ↓
              [Usuario recibe ticket]
```

---

## 📈 Escalabilidad y Limitaciones

### **Sistema Actual (JSON)**

**Capacidad:**
- ✅ 10,000 tickets máximo
- ✅ 1 servidor
- ✅ Operaciones síncronas

**Limitaciones:**
- ❌ No soporta múltiples servidores
- ❌ Archivo puede crecer hasta ~2-3 MB
- ❌ Sin backup automático
- ❌ Sin índices ni búsquedas rápidas

---

### **Migración a Supabase (Recomendado)**

**Ventajas:**
- ✅ PostgreSQL escalable
- ✅ Soporte para múltiples servidores
- ✅ Transacciones ACID
- ✅ Índices y búsquedas rápidas
- ✅ Backups automáticos
- ✅ API REST integrada
- ✅ **Capa gratuita generosa**

**Capacidad en capa gratuita:**
- ✅ 500 MB de base de datos
- ✅ 2 GB de almacenamiento
- ✅ 50,000 usuarios activos mensuales
- ✅ Backups automáticos (7 días)

---

## 🎯 Resumen

Este sistema es:

1. **Funcional** ✅ - Todo el flujo de pago funciona
2. **Seguro** ✅ - Firmas HMAC, validaciones
3. **Escalable** ⚠️ - Limitado a 1 servidor con JSON
4. **Mantenible** ✅ - Código limpio y documentado
5. **Listo para producción** ⚠️ - Requiere migración a BD real

**Próximo paso recomendado:** Migrar `tickets.json` → Supabase PostgreSQL

---

## 📚 Documentación Relacionada

- `DEPLOYMENT_SUPABASE.md` - Guía de deployment con Supabase
- `FLOW_INTEGRATION.md` - Integración con Flow
- `TICKET_SYSTEM_README.md` - Sistema de tickets
- `GMAIL_SETUP.md` - Configuración de Gmail

---

¿Preguntas? Consulta la documentación o revisa los comentarios en el código. 🚀
