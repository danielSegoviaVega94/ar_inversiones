# 🚀 Inicio Rápido - Configuración de Gmail

## ✅ Pasos Simples para Configurar tu Gmail

### **Paso 1: Obtener Contraseña de Aplicación de Gmail** ⏱️ 3 minutos

1. **Ir a tu cuenta de Google**: https://myaccount.google.com/security

2. **Activar verificación en 2 pasos** (si no está activada):
   - Busca "Verificación en 2 pasos"
   - Haz clic en "Activar"
   - Ingresa tu número de teléfono
   - Recibirás un código SMS
   - Ingresa el código

3. **Crear contraseña de aplicación**:
   - En la misma página de seguridad
   - Busca "Verificación en 2 pasos" → "Contraseñas de aplicaciones"
   - Selecciona: **Correo** → **Otro** → Escribe "Osvaldo Inversiones"
   - Haz clic en **Generar**
   - **COPIA** la contraseña de 16 caracteres (ej: `abcd efgh ijkl mnop`)

---

### **Paso 2: Editar el Archivo .env** ⏱️ 1 minuto

Abre el archivo `.env` (está en la raíz del proyecto) y reemplaza:

```env
EMAIL_USER=TU_EMAIL@gmail.com
EMAIL_PASS=TU_CONTRASEÑA_DE_APLICACION
EMAIL_FROM="Osvaldo Inversiones <TU_EMAIL@gmail.com>"
```

Con tus datos reales:

```env
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM="Osvaldo Inversiones <tu_email@gmail.com>"
```

**Ejemplo:**
```env
EMAIL_USER=osvaldo.inversiones@gmail.com
EMAIL_PASS=xkcd yhmg trzp qwas
EMAIL_FROM="Osvaldo Inversiones <osvaldo.inversiones@gmail.com>"
```

**💾 Guarda el archivo**

---

### **Paso 3: Probar la Configuración** ⏱️ 1 minuto

Ejecuta el comando de prueba:

```bash
npm run test:email
```

**✅ Si todo está bien, verás:**

```
🧪 Prueba de Configuración de Email

================================

📧 Configuración:
   Host: smtp.gmail.com
   Port: 587
   User: tu_email@gmail.com
   Pass: ***qwas
   From: Osvaldo Inversiones <tu_email@gmail.com>

🔧 Inicializando servicio de email...
✅ Email service initialized
🔍 Verificando conexión con Gmail...
✅ Email service connection verified
✅ ¡Conexión exitosa con Gmail!

📤 Enviando email de prueba...
✅ Email sent to tu_email@gmail.com for ticket #1
✅ ¡Email de prueba enviado exitosamente!

📬 Revisa tu bandeja de entrada en: tu_email@gmail.com
🎉 La configuración está correcta y funcionando.
```

**📬 Revisa tu bandeja de entrada** - Deberías recibir un email con el asunto:
```
🎫 Tu Ticket #00001 - Osvaldo Inversiones
```

---

### **Paso 4: Iniciar el Sistema** ⏱️ 1 minuto

Una vez que la prueba funcione, inicia todo el sistema:

```bash
npm run dev:all
```

Esto iniciará:
- ✅ Frontend en http://localhost:5173
- ✅ Backend en http://localhost:3001
- ✅ Sistema de emails funcionando

---

## 🎉 ¡Listo! Ya está todo configurado

Ahora cuando alguien compre un ticket:
1. Se reservará un número automáticamente (1-10000)
2. Se procesará el pago con Flow
3. Se confirmará el ticket
4. **Se enviará un email automático con el número de ticket**

---

## ❌ Solución de Problemas

### Error: "Invalid login: 535-5.7.8"

**Problema**: Contraseña incorrecta

**Solución**:
1. Verifica que copiaste bien la contraseña de aplicación
2. Asegúrate de usar la contraseña de aplicación, NO tu contraseña normal
3. Genera una nueva contraseña de aplicación si es necesario

---

### Error: "EMAIL_USER en .env"

**Problema**: No editaste el archivo .env

**Solución**:
1. Abre el archivo `.env` en la raíz del proyecto
2. Reemplaza `TU_EMAIL@gmail.com` con tu email real
3. Reemplaza `TU_CONTRASEÑA_DE_APLICACION` con la contraseña que copiaste
4. Guarda el archivo
5. Vuelve a ejecutar `npm run test:email`

---

### El email llegó a SPAM

**Solución**:
1. Revisa tu carpeta de SPAM
2. Marca el email como "No es spam"
3. Los siguientes emails llegarán a la bandeja principal

---

## 📚 Documentación Completa

Para más información detallada, consulta:
- **GMAIL_SETUP.md** - Guía completa con screenshots y detalles
- **TICKET_SYSTEM_README.md** - Documentación del sistema de tickets
- **FLOW_INTEGRATION.md** - Documentación de la integración con Flow

---

## ⏱️ Tiempo Total: ~6 minutos

1. ✅ Obtener contraseña de aplicación: 3 min
2. ✅ Editar .env: 1 min
3. ✅ Probar configuración: 1 min
4. ✅ Iniciar sistema: 1 min

---

## 🔐 Seguridad

- ✅ Tu contraseña de aplicación está protegida en `.env`
- ✅ El archivo `.env` NO se sube a GitHub (está en `.gitignore`)
- ✅ Puedes revocar la contraseña en cualquier momento en: https://myaccount.google.com/apppasswords

---

**¿Todo listo?** ¡Ejecuta `npm run test:email` y comienza! 🚀
