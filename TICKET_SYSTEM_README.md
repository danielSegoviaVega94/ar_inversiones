# 🎫 Sistema de Tickets Numerados y Envío de Correos

## 📋 Nuevas Funcionalidades Implementadas

### 1. ✅ Sistema de Tickets Autoincrementables (1-10000)

- **Números únicos**: Cada compra recibe un número de ticket único del 1 al 10000
- **Persistencia**: Los tickets se guardan en `tickets.json` en la raíz del proyecto
- **Límite automático**: El sistema bloquea ventas al alcanzar los 10000 tickets
- **Estados**: Cada ticket tiene estado (pending, confirmed, cancelled)

### 2. ✉️ Envío de Correos Automático

- **Email de confirmación**: Se envía automáticamente al confirmar el pago
- **Plantilla HTML profesional**: Email con diseño responsive y atractivo
- **Información del ticket**: Incluye el número de ticket destacado
- **Detalles de compra**: Nombre, RUT, teléfono, fecha, orden

### 3. 🎟️ Ticket Único por $10,000 CLP

- **Un solo producto**: Eliminados los múltiples tickets (económico y pack4)
- **Precio fijo**: $10,000 CLP por ticket
- **Diseño centrado**: El ticket se muestra centrado en la página
- **Icono actualizado**: Nuevo diseño con emoji de ticket 🎫

---

## 🚀 Configuración Inicial

### 1. Instalar Dependencias

Si aún no lo has hecho, instala las nuevas dependencias:

```bash
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` (si no existe):

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura las variables de email:

```env
# Email Configuration (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicación
EMAIL_FROM="Osvaldo Inversiones <noreply@osvaldoinversiones.cl>"
```

### 3. Configurar Gmail para Envío de Correos

Si usas Gmail, necesitas crear una "Contraseña de Aplicación":

#### Pasos para obtener contraseña de aplicación en Gmail:

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Selecciona **Seguridad** en el menú lateral
3. Activa la **Verificación en 2 pasos** (si no está activada)
4. Busca **Contraseñas de aplicaciones**
5. Selecciona **Correo** y **Otro (nombre personalizado)**
6. Escribe "Osvaldo Inversiones" como nombre
7. Haz clic en **Generar**
8. Copia la contraseña de 16 caracteres generada
9. Pégala en `EMAIL_PASS` en tu archivo `.env`

#### Ejemplo de configuración con Gmail:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # La contraseña de aplicación generada
EMAIL_FROM="Osvaldo Inversiones <noreply@osvaldoinversiones.cl>"
```

### 4. Otros Proveedores de Email (Alternativas)

#### **SendGrid** (Recomendado para producción)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=TU_API_KEY_DE_SENDGRID
EMAIL_FROM="Osvaldo Inversiones <noreply@osvaldoinversiones.cl>"
```

#### **Mailgun**
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=postmaster@tu-dominio.mailgun.org
EMAIL_PASS=tu_contraseña_mailgun
EMAIL_FROM="Osvaldo Inversiones <noreply@osvaldoinversiones.cl>"
```

#### **Outlook/Hotmail**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@outlook.com
EMAIL_PASS=tu_contraseña
EMAIL_FROM="Osvaldo Inversiones <tu_email@outlook.com>"
```

---

## 📂 Estructura de Archivos

```
ar_inversiones/
├── server/
│   ├── services/
│   │   ├── flowService.ts          # Servicio de Flow (existente)
│   │   ├── ticketService.ts        # 🆕 Servicio de tickets numerados
│   │   └── emailService.ts         # 🆕 Servicio de envío de emails
│   ├── utils/
│   │   └── flowSignature.ts        # Utilidades de firma (existente)
│   └── index.ts                    # Servidor principal (modificado)
├── tickets.json                    # 🆕 Base de datos de tickets (generado automáticamente)
├── .env                            # Variables de entorno (configurar)
├── .env.example                    # Ejemplo de variables (actualizado)
└── TICKET_SYSTEM_README.md         # 🆕 Esta documentación
```

---

## 🎯 Flujo de Compra Actualizado

```
1. Usuario selecciona ticket ($10,000)
   ↓
2. Completa formulario (nombre, email, RUT, teléfono)
   ↓
3. Backend reserva un número de ticket (ej: #00042)
   ↓
4. Se crea el pago en Flow
   ↓
5. Usuario es redirigido a Flow para pagar
   ↓
6. Flow procesa el pago
   ↓
7. Webhook recibe confirmación de Flow
   ↓
8. Si pago aprobado:
   - Se confirma el ticket
   - Se envía email con número de ticket
   ↓
9. Usuario recibe email de confirmación con su número
```

---

## 🛠️ Nuevos Endpoints API

### **GET** `/api/tickets/stats`

Obtiene estadísticas de tickets vendidos:

```json
{
  "totalTickets": 42,
  "confirmed": 38,
  "pending": 3,
  "cancelled": 1,
  "available": 9958,
  "maxTickets": 10000,
  "nextTicketNumber": 43
}
```

### **GET** `/api/tickets/order/:commerceOrder`

Obtiene información del ticket por orden de comercio:

```json
{
  "ticketNumber": 42,
  "commerceOrder": "ORD-1234567890-abc123",
  "email": "usuario@ejemplo.com",
  "payerName": "Juan Pérez",
  "rut": "12.345.678-9",
  "phone": "+56912345678",
  "purchaseDate": "2025-01-15T10:30:00.000Z",
  "status": "confirmed",
  "flowOrder": 123456
}
```

---

## 🧪 Cómo Probar el Sistema

### 1. Iniciar el servidor

```bash
npm run dev:all
```

### 2. Verificar logs en consola

Al iniciar, verás:

```
✅ Tickets data loaded: { nextTicketNumber: 1, totalSold: 0, maxTickets: 10000 }
✅ Email service initialized
🚀 Server running on port 3001
🎫 Tickets: 0 vendidos | 10000 disponibles de 10000
```

### 3. Realizar una compra de prueba

1. Abre http://localhost:5173
2. Haz clic en "LO QUIERO"
3. Completa el formulario
4. Usa las tarjetas de prueba de Flow (ver FLOW_INTEGRATION.md)
5. Completa el pago

### 4. Verificar el resultado

- Revisa la consola del servidor para ver logs de:
  - Reserva de ticket: `🎫 Ticket #1 reserved for email@example.com`
  - Confirmación: `✅ Ticket #1 confirmed for order ORD-...`
  - Email enviado: `📧 Confirmation email sent to email@example.com`

- Revisa el archivo `tickets.json` generado en la raíz:
  ```json
  {
    "nextTicketNumber": 2,
    "maxTickets": 10000,
    "tickets": [
      {
        "ticketNumber": 1,
        "commerceOrder": "ORD-1234567890-abc123",
        "email": "usuario@ejemplo.com",
        "payerName": "Juan Pérez",
        "status": "confirmed",
        ...
      }
    ]
  }
  ```

- Revisa tu bandeja de entrada del email configurado

---

## 📧 Plantilla de Email

El email de confirmación incluye:

- **Header**: Título "¡Compra Exitosa!" con gradiente azul
- **Número de ticket**: Destacado en grande con fondo gradiente naranja/rojo
- **Detalles de compra**: Tabla con toda la información
- **Mensaje de suerte**: Con emoji de trébol 🍀
- **Footer**: Información de contacto

### Vista previa del email:

```
┌─────────────────────────────────┐
│   🎉 ¡Compra Exitosa!           │ (Header azul)
├─────────────────────────────────┤
│ Hola Juan Pérez,                │
│                                 │
│ ┌──────────────────────────┐   │
│ │  Tu Número de Ticket     │   │ (Box destacado)
│ │       #00042             │   │
│ │ ¡Guarda este número!     │   │
│ └──────────────────────────┘   │
│                                 │
│ 📋 Detalles de tu Compra       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│ Nombre: Juan Pérez              │
│ Email: juan@ejemplo.com         │
│ RUT: 12.345.678-9              │
│ ...                            │
│                                 │
│ 🍀 ¡Mucha suerte!              │
├─────────────────────────────────┤
│ Osvaldo Inversiones             │ (Footer gris)
│ contacto@osvaldoinversiones.cl │
└─────────────────────────────────┘
```

---

## 🔧 Solución de Problemas

### ❌ Error: "Email service connection failed"

**Causa**: Credenciales de email incorrectas o configuración incorrecta

**Solución**:
1. Verifica que las credenciales en `.env` sean correctas
2. Si usas Gmail, asegúrate de usar una contraseña de aplicación
3. Verifica que el puerto y host sean correctos
4. Intenta con `EMAIL_SECURE=true` si usas puerto 465

### ❌ Error: "No hay más tickets disponibles"

**Causa**: Se han vendido los 10,000 tickets

**Solución**:
1. Para resetear en desarrollo, elimina el archivo `tickets.json`
2. Reinicia el servidor
3. El contador volverá a 1

### ❌ Los tickets no se guardan entre reinicios

**Causa**: El archivo `tickets.json` no tiene permisos de escritura

**Solución**:
```bash
chmod 644 tickets.json
```

O verifica que la aplicación tenga permisos para escribir en el directorio

---

## 📊 Monitoreo y Logs

### Ver estadísticas de tickets:

```bash
curl http://localhost:3001/api/tickets/stats
```

### Ver un ticket específico:

```bash
curl http://localhost:3001/api/tickets/order/ORD-1234567890-abc123
```

### Logs importantes a monitorear:

- `🎫 Ticket #X reserved` - Ticket reservado
- `✅ Ticket #X confirmed` - Ticket confirmado tras pago
- `📧 Email sent to X` - Email enviado exitosamente
- `❌ Ticket cancelled` - Ticket cancelado por pago rechazado

---

## 🚀 Despliegue a Producción

### 1. Variables de entorno

Asegúrate de configurar todas las variables en tu servidor de producción:

```env
# Flow (producción)
FLOW_API_URL=https://www.flow.cl/api
FLOW_API_KEY=tu_api_key_produccion
FLOW_SECRET_KEY=tu_secret_key_produccion

# URLs
BASE_URL=https://api.tudominio.cl
FRONTEND_URL=https://tudominio.cl

# Email (usa un servicio profesional como SendGrid)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=tu_sendgrid_api_key
EMAIL_FROM="Osvaldo Inversiones <noreply@tudominio.cl>"
```

### 2. Base de datos

Para producción, considera migrar de `tickets.json` a una base de datos real:
- PostgreSQL
- MySQL
- MongoDB

El archivo `ticketService.ts` está diseñado para ser fácilmente adaptable.

### 3. Backups

Configura backups automáticos del archivo `tickets.json` o de tu base de datos.

---

## 📞 Soporte

Para problemas o preguntas:
- Revisa los logs del servidor
- Verifica la configuración en `.env`
- Consulta la documentación de Flow: https://www.flow.cl/docs/api.html

---

## ✅ Checklist de Configuración

- [ ] Copiar `.env.example` a `.env`
- [ ] Configurar credenciales de Flow
- [ ] Configurar credenciales de email (Gmail/SendGrid/etc.)
- [ ] Instalar dependencias (`npm install`)
- [ ] Probar servidor (`npm run dev:all`)
- [ ] Realizar compra de prueba
- [ ] Verificar email recibido
- [ ] Revisar `tickets.json` creado
- [ ] Verificar estadísticas con `/api/tickets/stats`

---

¡Listo! El sistema de tickets numerados y envío de correos está completamente funcional. 🎉
