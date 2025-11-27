# 🚀 Guía Completa de Deployment con Supabase

## 📋 Tabla de Contenidos

1. [¿Qué es Supabase?](#qué-es-supabase)
2. [¿Por qué Supabase?](#por-qué-supabase)
3. [Plan Gratuito de Supabase](#plan-gratuito-de-supabase)
4. [Migración de tickets.json a Supabase](#migración-de-ticketsjson-a-supabase)
5. [Deployment del Backend](#deployment-del-backend)
6. [Deployment del Frontend](#deployment-del-frontend)
7. [Configuración de Flow en Producción](#configuración-de-flow-en-producción)
8. [Configuración de Dominio](#configuración-de-dominio)

---

## 🎯 ¿Qué es Supabase?

**Supabase** es una alternativa open-source a Firebase que ofrece:

- ✅ **Base de datos PostgreSQL** escalable
- ✅ **API REST autogenerada** a partir de tus tablas
- ✅ **Autenticación** integrada
- ✅ **Storage** para archivos
- ✅ **Realtime** (suscripciones a cambios)
- ✅ **Backups automáticos**
- ✅ **Dashboard visual** para gestionar datos

---

## 💰 ¿Por qué Supabase?

### **Comparación: tickets.json vs Supabase**

| Característica | tickets.json | Supabase PostgreSQL |
|----------------|--------------|---------------------|
| **Escalabilidad** | ❌ 1 servidor | ✅ Múltiples servidores |
| **Transacciones** | ❌ No | ✅ ACID compliant |
| **Backups** | ❌ Manual | ✅ Automáticos (7 días) |
| **Búsquedas** | ❌ Lento | ✅ Índices + rápido |
| **Concurrencia** | ❌ Race conditions | ✅ Locks + transacciones |
| **Costo** | ✅ Gratis | ✅ Gratis (500 MB) |
| **API** | ❌ Manual | ✅ Autogenerada |

### **Ventajas para este Proyecto:**

1. ✅ **Gratis hasta 500 MB** - Más que suficiente para 10,000 tickets
2. ✅ **No necesitas servidor de BD** - Supabase lo hospeda
3. ✅ **Backups automáticos** - No pierdes datos
4. ✅ **Dashboard visual** - Ves tus ventas en tiempo real
5. ✅ **Listo para producción** - Sin configuración extra

---

## 🆓 Plan Gratuito de Supabase

### **Límites del Plan Gratuito:**

| Recurso | Límite |
|---------|--------|
| **Base de datos** | 500 MB |
| **Almacenamiento** | 1 GB |
| **Ancho de banda** | 2 GB/mes |
| **Usuarios activos** | Ilimitados |
| **Proyectos** | 2 proyectos |
| **Backups** | 7 días |
| **Pausa automática** | Después de 1 semana de inactividad |

### **¿Es Suficiente para este Proyecto?**

**SÍ**, calculemos:

- 10,000 tickets × ~500 bytes por ticket = **~5 MB**
- Logs y metadata adicional: **~5 MB**
- **Total: 10 MB de 500 MB disponibles** ✅

¡Tienes espacio para 500,000 tickets! 🎉

---

## 📊 Migración de tickets.json a Supabase

### **Paso 1: Crear Cuenta en Supabase**

1. Ve a: https://supabase.com/
2. Haz clic en **"Start your project"**
3. Regístrate con GitHub, Google o email
4. Verifica tu cuenta por email

---

### **Paso 2: Crear Proyecto**

1. En el dashboard, haz clic en **"New project"**
2. Configura:
   - **Name**: `osvaldo-inversiones` o el nombre que quieras
   - **Database Password**: Genera una contraseña segura (guárdala)
   - **Region**: `South America (São Paulo)` (más cercano a Chile)
   - **Pricing Plan**: **Free**

3. Haz clic en **"Create new project"**
4. Espera ~2 minutos mientras se crea

---

### **Paso 3: Crear Tabla de Tickets**

1. En el panel lateral, ve a **"Table Editor"**
2. Haz clic en **"Create a new table"**
3. Configura la tabla:

**Nombre:** `tickets`

**Columnas:**

| Nombre | Tipo | Configuración |
|--------|------|---------------|
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` |
| `ticket_number` | `int4` | NOT NULL, UNIQUE |
| `commerce_order` | `text` | NOT NULL, UNIQUE |
| `email` | `text` | NOT NULL |
| `payer_name` | `text` | NOT NULL |
| `rut` | `text` | NULL |
| `phone` | `text` | NULL |
| `purchase_date` | `timestamptz` | NOT NULL, Default: `now()` |
| `status` | `text` | NOT NULL, Default: `'pending'` |
| `flow_order` | `int8` | NULL |
| `created_at` | `timestamptz` | Default: `now()` |
| `updated_at` | `timestamptz` | Default: `now()` |

4. Haz clic en **"Save"**

---

### **Paso 4: Crear Tabla de Configuración**

Esta tabla guardará el contador de tickets:

**Nombre:** `ticket_config`

**Columnas:**

| Nombre | Tipo | Configuración |
|--------|------|---------------|
| `id` | `int4` | Primary Key, Default: `1` |
| `next_ticket_number` | `int4` | NOT NULL, Default: `1` |
| `max_tickets` | `int4` | NOT NULL, Default: `10000` |

**Insertar dato inicial:**

Ve a **"SQL Editor"** y ejecuta:

```sql
INSERT INTO ticket_config (id, next_ticket_number, max_tickets)
VALUES (1, 1, 10000);
```

---

### **Paso 5: Obtener Credenciales de Supabase**

1. Ve a **"Settings"** → **"API"**
2. Copia:
   - **Project URL**: `https://abc123.supabase.co`
   - **anon public key**: `eyJhbGc...` (clave larga)

3. Ve a **"Settings"** → **"Database"**
4. Copia:
   - **Host**: `db.abc123.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: La que creaste en el paso 2

---

### **Paso 6: Instalar Cliente de Supabase**

```bash
npm install @supabase/supabase-js
```

---

### **Paso 7: Crear Servicio de Supabase**

Crea el archivo `server/services/supabaseTicketService.ts`:

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface Ticket {
  id?: string;
  ticket_number: number;
  commerce_order: string;
  email: string;
  payer_name: string;
  rut?: string;
  phone?: string;
  purchase_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  flow_order?: number;
}

export class SupabaseTicketService {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Check if tickets are available
   */
  async areTicketsAvailable(): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('ticket_config')
      .select('next_ticket_number, max_tickets')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return data.next_ticket_number <= data.max_tickets;
  }

  /**
   * Reserve a ticket number
   */
  async reserveTicket(params: {
    commerceOrder: string;
    email: string;
    payerName: string;
    rut?: string;
    phone?: string;
    flowOrder?: number;
  }): Promise<Ticket> {
    // Start transaction
    const { data: config, error: configError } = await this.supabase
      .from('ticket_config')
      .select('*')
      .eq('id', 1)
      .single();

    if (configError) throw configError;

    if (config.next_ticket_number > config.max_tickets) {
      throw new Error('No hay más tickets disponibles. Máximo 10,000 tickets alcanzado.');
    }

    const ticketNumber = config.next_ticket_number;

    // Create ticket
    const { data: ticket, error: ticketError } = await this.supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        commerce_order: params.commerceOrder,
        email: params.email,
        payer_name: params.payerName,
        rut: params.rut,
        phone: params.phone,
        flow_order: params.flowOrder,
        status: 'pending'
      })
      .select()
      .single();

    if (ticketError) throw ticketError;

    // Increment counter
    const { error: updateError } = await this.supabase
      .from('ticket_config')
      .update({ next_ticket_number: ticketNumber + 1 })
      .eq('id', 1);

    if (updateError) throw updateError;

    console.log(`🎫 Ticket ${ticketNumber} reserved for ${params.email}`);

    return {
      ticket_number: ticket.ticket_number,
      commerce_order: ticket.commerce_order,
      email: ticket.email,
      payer_name: ticket.payer_name,
      rut: ticket.rut || undefined,
      phone: ticket.phone || undefined,
      purchase_date: ticket.purchase_date,
      status: ticket.status,
      flow_order: ticket.flow_order || undefined
    };
  }

  /**
   * Confirm a ticket after successful payment
   */
  async confirmTicket(commerceOrder: string, flowOrder?: number): Promise<Ticket | null> {
    const { data, error } = await this.supabase
      .from('tickets')
      .update({
        status: 'confirmed',
        flow_order: flowOrder,
        updated_at: new Date().toISOString()
      })
      .eq('commerce_order', commerceOrder)
      .select()
      .single();

    if (error) {
      console.error(`❌ Ticket not found for order: ${commerceOrder}`);
      return null;
    }

    console.log(`✅ Ticket ${data.ticket_number} confirmed for order ${commerceOrder}`);

    return {
      ticket_number: data.ticket_number,
      commerce_order: data.commerce_order,
      email: data.email,
      payer_name: data.payer_name,
      rut: data.rut || undefined,
      phone: data.phone || undefined,
      purchase_date: data.purchase_date,
      status: data.status,
      flow_order: data.flow_order || undefined
    };
  }

  /**
   * Cancel a ticket
   */
  async cancelTicket(commerceOrder: string): Promise<void> {
    const { error } = await this.supabase
      .from('tickets')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('commerce_order', commerceOrder);

    if (error) {
      console.error(`❌ Ticket not found for order: ${commerceOrder}`);
      return;
    }

    console.log(`❌ Ticket cancelled for order ${commerceOrder}`);
  }

  /**
   * Get ticket by commerce order
   */
  async getTicketByOrder(commerceOrder: string): Promise<Ticket | null> {
    const { data, error } = await this.supabase
      .from('tickets')
      .select('*')
      .eq('commerce_order', commerceOrder)
      .single();

    if (error) return null;

    return {
      ticket_number: data.ticket_number,
      commerce_order: data.commerce_order,
      email: data.email,
      payer_name: data.payer_name,
      rut: data.rut || undefined,
      phone: data.phone || undefined,
      purchase_date: data.purchase_date,
      status: data.status,
      flow_order: data.flow_order || undefined
    };
  }

  /**
   * Get statistics
   */
  async getStats() {
    const { data: config } = await this.supabase
      .from('ticket_config')
      .select('*')
      .eq('id', 1)
      .single();

    const { count: totalTickets } = await this.supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true });

    const { count: confirmed } = await this.supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed');

    const { count: pending } = await this.supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: cancelled } = await this.supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'cancelled');

    return {
      totalTickets: totalTickets || 0,
      confirmed: confirmed || 0,
      pending: pending || 0,
      cancelled: cancelled || 0,
      available: (config?.max_tickets || 10000) - (config?.next_ticket_number || 1) + 1,
      maxTickets: config?.max_tickets || 10000,
      nextTicketNumber: config?.next_ticket_number || 1
    };
  }
}
```

---

### **Paso 8: Actualizar .env**

Agrega las credenciales de Supabase:

```env
# Supabase
SUPABASE_URL=https://abc123.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
```

---

### **Paso 9: Usar Supabase en server/index.ts**

Reemplaza la importación del servicio:

```typescript
// Antes:
// import { TicketService } from './services/ticketService';

// Después:
import { SupabaseTicketService } from './services/supabaseTicketService';

// Inicializar servicio
const ticketService = new SupabaseTicketService(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);
```

---

### **Paso 10: Migrar Datos Existentes (Opcional)**

Si ya tienes tickets en `tickets.json`:

```typescript
// migrate-to-supabase.ts
import fs from 'fs';
import { SupabaseTicketService } from './server/services/supabaseTicketService';

const data = JSON.parse(fs.readFileSync('tickets.json', 'utf-8'));
const service = new SupabaseTicketService(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Migrar cada ticket
for (const ticket of data.tickets) {
  // Insertar manualmente en Supabase
  console.log(`Migrando ticket #${ticket.ticketNumber}...`);
}
```

---

## 🌐 Deployment del Backend

### **Opción 1: Render.com (Recomendado - Gratis)**

#### **Ventajas:**
- ✅ Gratis para proyectos pequeños
- ✅ Deploy desde GitHub automático
- ✅ SSL gratis
- ✅ Fácil configuración

#### **Pasos:**

1. **Preparar el código:**

Crear `package.json` con script de start:

```json
{
  "scripts": {
    "start": "node dist/server/index.js",
    "build": "tsc -p tsconfig.server.json"
  }
}
```

2. **Ir a Render:**
   - https://render.com/
   - Regístrate con GitHub

3. **Crear Web Service:**
   - Click en **"New"** → **"Web Service"**
   - Conecta tu repositorio de GitHub
   - Configura:
     - **Name**: `osvaldo-inversiones-api`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Plan**: **Free**

4. **Configurar Variables de Entorno:**
   - En la sección "Environment"
   - Agrega todas las variables de `.env`:
     ```
     FLOW_API_KEY=...
     FLOW_SECRET_KEY=...
     FLOW_API_URL=https://www.flow.cl/api
     SUPABASE_URL=...
     SUPABASE_ANON_KEY=...
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=...
     EMAIL_PASS=...
     BASE_URL=https://osvaldo-inversiones-api.onrender.com
     FRONTEND_URL=https://tu-dominio.com
     ```

5. **Deploy:**
   - Click en **"Create Web Service"**
   - Render hará el deploy automáticamente
   - Obtendrás una URL: `https://osvaldo-inversiones-api.onrender.com`

---

### **Opción 2: Railway.app (Alternativa - Gratis)**

Similar a Render, con $5 de crédito gratis mensual.

---

## 🎨 Deployment del Frontend

### **Opción 1: Vercel (Recomendado - Gratis)**

#### **Ventajas:**
- ✅ Optimizado para React/Vite
- ✅ Deploy automático desde GitHub
- ✅ SSL gratis
- ✅ CDN global
- ✅ Dominio personalizado gratis

#### **Pasos:**

1. **Ir a Vercel:**
   - https://vercel.com/
   - Regístrate con GitHub

2. **Importar Proyecto:**
   - Click en **"Add New"** → **"Project"**
   - Selecciona tu repositorio

3. **Configurar:**
   - **Framework Preset**: Vite
   - **Root Directory**: `.`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Variables de Entorno:**
   - Agrega:
     ```
     VITE_API_URL=https://osvaldo-inversiones-api.onrender.com
     ```

5. **Deploy:**
   - Click en **"Deploy"**
   - Obtendrás una URL: `https://tu-proyecto.vercel.app`

6. **Actualizar URLs en Backend:**
   - En Render, actualiza `FRONTEND_URL` con la URL de Vercel

---

### **Opción 2: Netlify (Alternativa - Gratis)**

Similar a Vercel.

---

## 💳 Configuración de Flow en Producción

1. **Obtener Credenciales de Producción:**
   - Inicia sesión en https://www.flow.cl/
   - Ve a **"Mi Cuenta"** → **"API"**
   - Copia tus credenciales de **Producción**

2. **Actualizar Variables de Entorno:**

En Render (backend):
```env
FLOW_API_KEY=tu_api_key_produccion
FLOW_SECRET_KEY=tu_secret_key_produccion
FLOW_API_URL=https://www.flow.cl/api
```

3. **Configurar URLs de Retorno:**

En Flow, configura:
- **URL de Confirmación**: `https://osvaldo-inversiones-api.onrender.com/api/payment/confirm`
- **URL de Retorno**: `https://osvaldo-inversiones-api.onrender.com/api/payment/result`

---

## 🌍 Configuración de Dominio (Opcional)

### **Comprar Dominio:**

1. Compra un dominio (ej: `osvaldoinversiones.cl`) en:
   - NIC Chile: https://www.nic.cl/
   - GoDaddy, Namecheap, etc.

### **Configurar DNS:**

**Para Frontend (Vercel):**
1. En Vercel, ve a tu proyecto → **"Settings"** → **"Domains"**
2. Agrega tu dominio: `osvaldoinversiones.cl`
3. Vercel te dará registros DNS:
   ```
   A    @    76.76.21.21
   CNAME www  cname.vercel-dns.com
   ```
4. Agrégalos en tu proveedor de dominio

**Para Backend (Render):**
1. En Render, ve a tu servicio → **"Settings"** → **"Custom Domain"**
2. Agrega: `api.osvaldoinversiones.cl`
3. Render te dará un CNAME:
   ```
   CNAME api  osvaldo-inversiones-api.onrender.com
   ```

---

## ✅ Checklist de Deployment

### **Preparación:**
- [ ] Crear cuenta en Supabase
- [ ] Crear tabla de tickets
- [ ] Migrar de tickets.json a Supabase
- [ ] Obtener credenciales de Flow producción
- [ ] Configurar Gmail para producción

### **Backend:**
- [ ] Subir código a GitHub
- [ ] Crear cuenta en Render
- [ ] Configurar variables de entorno
- [ ] Hacer deploy del backend
- [ ] Verificar que funcione: `/api/health`

### **Frontend:**
- [ ] Actualizar `VITE_API_URL` en código
- [ ] Crear cuenta en Vercel
- [ ] Conectar repositorio
- [ ] Hacer deploy del frontend
- [ ] Probar flujo de pago completo

### **Flow:**
- [ ] Actualizar URLs en configuración de Flow
- [ ] Probar pago de prueba
- [ ] Verificar webhook funcione

### **Dominio (Opcional):**
- [ ] Comprar dominio
- [ ] Configurar DNS
- [ ] Actualizar URLs en Flow y variables de entorno

---

## 💰 Costos Estimados

| Servicio | Plan | Costo/Mes |
|----------|------|-----------|
| **Supabase** | Free | $0 |
| **Render (Backend)** | Free | $0 |
| **Vercel (Frontend)** | Free | $0 |
| **Gmail** | Personal | $0 |
| **Dominio** | Anual | ~$10/año |
| **Flow** | Por transacción | ~2.9% + $100 |
| **TOTAL** | | **~$0.85/mes** |

**¡Casi gratis!** 🎉

---

## 🚀 Resultado Final

Después de seguir esta guía tendrás:

- ✅ Frontend en `https://osvaldoinversiones.cl`
- ✅ Backend en `https://api.osvaldoinversiones.cl`
- ✅ Base de datos PostgreSQL escalable
- ✅ Pagos con Flow en producción
- ✅ Emails automáticos
- ✅ SSL/HTTPS en todo
- ✅ Backups automáticos
- ✅ Listo para recibir pagos reales

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en Render/Vercel
2. Verifica variables de entorno
3. Consulta la documentación de cada servicio
4. Revisa la consola del navegador (F12)

---

**¿Listo para hacer el deploy?** ¡Sigue esta guía paso a paso! 🚀
