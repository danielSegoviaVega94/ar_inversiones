# Integración con Flow Payment Gateway

## 📋 Descripción

Este proyecto integra la pasarela de pago Flow para procesar pagos de manera segura. La integración incluye:

- ✅ Creación de pagos vía API de Flow
- ✅ Firma HMAC-SHA256 para autenticación segura
- ✅ Webhooks para notificaciones de pago
- ✅ Verificación de estado de pagos
- ✅ Interfaz de usuario con React
- ✅ Backend seguro con Express

## 🏗️ Arquitectura

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│  Flow API   │
│   (React)   │◀─────│  (Express)  │◀─────│  (Sandbox)  │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  Webhooks   │
                     │  /confirm   │
                     └─────────────┘
```

## 🔐 Credenciales (Sandbox)

Las credenciales están configuradas en `.env.local`:

```env
FLOW_API_KEY=4A89F266-73DD-46FF-B6C6-609741LDDB9A
FLOW_SECRET_KEY=a4e105f2b416f0b4e5e7220a2e7a8b0cb3d411d4
FLOW_API_URL=https://sandbox.flow.cl/api
```

⚠️ **IMPORTANTE**: Nunca subas el archivo `.env.local` al repositorio. Ya está incluido en `.gitignore`.

## 📦 Estructura del Proyecto

```
ar_inversiones/
├── server/
│   ├── index.ts                 # Servidor Express principal
│   ├── services/
│   │   └── flowService.ts       # Servicio de integración con Flow API
│   └── utils/
│       └── flowSignature.ts     # Utilidades para firma HMAC-SHA256
├── components/
│   ├── FlowModal.tsx            # Modal de checkout
│   └── PaymentResult.tsx        # Página de resultado de pago
├── .env.local                   # Variables de entorno (NO subir a git)
├── .env.example                 # Ejemplo de variables de entorno
└── FLOW_INTEGRATION.md          # Esta documentación
```

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local` y configura tus credenciales:

```bash
cp .env .env.local
```

### 3. Iniciar el proyecto

Para desarrollo, ejecuta ambos servidores simultáneamente:

```bash
npm run dev:all
```

O ejecuta cada uno por separado:

**Frontend (Vite):**
```bash
npm run dev
```

**Backend (Express):**
```bash
npm run server
```

## 🔄 Flujo de Pago

### 1. Usuario inicia el pago
- El usuario selecciona un producto y hace clic en "Comprar"
- Se abre el modal `FlowModal` con el formulario

### 2. Envío de datos
- El usuario completa el formulario (nombre, email, RUT, teléfono)
- Al hacer clic en "Pagar con Flow", se envía una petición POST a:
  ```
  POST http://localhost:3001/api/payment/create
  ```

### 3. Creación de pago en Flow
- El backend recibe los datos y los firma con HMAC-SHA256
- Envía la petición firmada a Flow API: `POST /payment/create`
- Flow responde con:
  - `url`: URL de redirección al formulario de pago
  - `token`: Token único del pago
  - `flowOrder`: ID de orden en Flow

### 4. Redirección a Flow
- El usuario es redirigido a la página de pago de Flow
- Flow muestra los métodos de pago disponibles (WebPay, tarjetas, etc.)

### 5. Procesamiento del pago
- El usuario completa el pago en la plataforma de Flow
- Flow procesa el pago y envía una notificación a nuestro webhook:
  ```
  POST http://localhost:3001/api/payment/confirm
  ```

### 6. Confirmación y retorno
- El webhook verifica la firma y obtiene el estado del pago
- Flow redirige al usuario a nuestra URL de retorno:
  ```
  http://localhost:5173/payment/result?token={token}
  ```
- El componente `PaymentResult` verifica el estado final del pago

## 🔌 Endpoints del Backend

### POST `/api/payment/create`
Crea un nuevo pago en Flow.

**Request Body:**
```json
{
  "amount": 10000,
  "subject": "Producto XYZ",
  "email": "usuario@ejemplo.com",
  "payerName": "Juan Pérez",
  "rut": "12.345.678-9",
  "phone": "+56912345678",
  "productId": "prod-123"
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "https://sandbox.flow.cl/app/web/pay.php",
  "token": "ABC123DEF456",
  "flowOrder": 123456,
  "commerceOrder": "ORD-1234567890-abc123"
}
```

### POST `/api/payment/confirm`
Webhook para recibir notificaciones de Flow sobre cambios en el estado del pago.

**Flow envía:**
```
token={token}&s={signature}
```

**Response esperada por Flow:**
```
CONFIRMADO
```

### GET `/api/payment/verify/:token`
Verifica el estado de un pago usando el token de Flow.

**Response:**
```json
{
  "success": true,
  "status": "approved",
  "paymentStatus": {
    "flowOrder": 123456,
    "commerceOrder": "ORD-1234567890-abc123",
    "status": 2,
    "amount": 10000,
    "payer": "usuario@ejemplo.com"
  }
}
```

### GET `/api/payment/status/:commerceOrder`
Obtiene el estado de un pago usando el ID de orden del comercio.

## 🔒 Seguridad

### Firma HMAC-SHA256

Todas las peticiones a Flow deben estar firmadas. El proceso es:

1. **Ordenar parámetros alfabéticamente**
   ```javascript
   { amount: 10000, subject: "Test", apiKey: "ABC123" }
   // → apiKey, amount, subject
   ```

2. **Concatenar claves y valores**
   ```javascript
   "apiKeyABC123amount10000subjectTest"
   ```

3. **Generar firma HMAC-SHA256**
   ```javascript
   crypto.createHmac('sha256', secretKey)
     .update(concatenated)
     .digest('hex')
   ```

4. **Agregar firma como parámetro 's'**
   ```javascript
   { ...params, s: signature }
   ```

### Verificación de Webhooks

Al recibir notificaciones de Flow:
1. Extraer el parámetro `s` (firma)
2. Calcular la firma esperada con los demás parámetros
3. Comparar ambas firmas
4. Solo procesar si coinciden

## 🧪 Testing

### Datos de prueba en Sandbox

Flow proporciona tarjetas de prueba para el sandbox:

**Tarjeta aprobada:**
- Número: 4051 8842 3993 7763
- CVV: 123
- Fecha: cualquier fecha futura

**Tarjeta rechazada:**
- Número: 5186 0595 3999 0023
- CVV: 123
- Fecha: cualquier fecha futura

### Probar el flujo completo

1. Inicia ambos servidores: `npm run dev:all`
2. Abre http://localhost:5173
3. Selecciona un producto
4. Completa el formulario
5. Serás redirigido al sandbox de Flow
6. Usa una tarjeta de prueba
7. Completa el pago
8. Verifica que regresas con el estado correcto

## 📝 Estados de Pago en Flow

- `1`: Pendiente
- `2`: Aprobado ✅
- `3`: Rechazado ❌
- `4`: Anulado

## 🌐 Producción

Para pasar a producción:

1. Obtén credenciales de producción en https://www.flow.cl
2. Actualiza `.env.local`:
   ```env
   FLOW_API_URL=https://www.flow.cl/api
   FLOW_API_KEY=tu_api_key_produccion
   FLOW_SECRET_KEY=tu_secret_key_produccion
   ```
3. Configura un dominio público para los webhooks
4. Actualiza `BASE_URL` y `FRONTEND_URL` con tus URLs de producción
5. Asegúrate de que el endpoint `/api/payment/confirm` sea accesible públicamente

## 🔗 Recursos

- [Documentación oficial de Flow](https://www.flow.cl/docs/api.html)
- [API Reference](https://developers.sandbox.flow.cl/api)
- [Sandbox de Flow](https://sandbox.flow.cl)

## ⚠️ Notas Importantes

- El servidor backend debe estar ejecutándose para que los pagos funcionen
- Las URLs de webhook deben ser accesibles públicamente (en producción)
- Siempre verifica las firmas de los webhooks
- No expongas el `FLOW_SECRET_KEY` en el frontend
- En producción, usa HTTPS para todas las comunicaciones
- Implementa logs y monitoreo para los pagos

## 🐛 Troubleshooting

### Error: "Failed to create payment"
- Verifica que el servidor backend esté corriendo
- Revisa las credenciales en `.env.local`
- Chequea los logs del servidor para más detalles

### Error: "Invalid signature"
- Verifica que el `FLOW_SECRET_KEY` sea correcto
- Asegúrate de que los parámetros se estén ordenando correctamente
- Revisa que no haya espacios extra en las credenciales

### Webhook no recibe notificaciones
- En desarrollo local, usa herramientas como ngrok para exponer tu servidor
- Verifica que la URL de confirmación sea accesible públicamente
- Revisa los logs de Flow en su panel de control
