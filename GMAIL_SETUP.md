# 📧 Configuración de Gmail para Envío de Correos

## 🎯 Objetivo

Configurar tu cuenta personal de Gmail para que el sistema pueda enviar correos automáticos con los números de ticket a los compradores.

---

## ⚠️ IMPORTANTE: Contraseña de Aplicación

**NO uses tu contraseña normal de Gmail**. Debes crear una "Contraseña de Aplicación" específica. Esto es:

✅ **Más seguro**: Si alguien obtiene esta contraseña, solo puede enviar emails, no acceder a tu cuenta
✅ **Requerido**: Gmail no permite usar la contraseña normal para aplicaciones
✅ **Fácil de revocar**: Puedes eliminarla en cualquier momento sin cambiar tu contraseña principal

---

## 📋 Pasos para Configurar Gmail

### **Paso 1: Activar la Verificación en 2 Pasos**

La verificación en 2 pasos es **obligatoria** para crear contraseñas de aplicación.

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. En el menú lateral, haz clic en **"Seguridad"**
3. Busca la sección **"Verificación en 2 pasos"**
4. Si dice **"Desactivada"**, haz clic y actívala:
   - Ingresa tu número de teléfono
   - Recibirás un código por SMS
   - Ingresa el código para confirmar
   - Haz clic en **"Activar"**

✅ Una vez activada, deberías ver: **"Verificación en 2 pasos: Activada"**

---

### **Paso 2: Crear una Contraseña de Aplicación**

Ahora que la verificación en 2 pasos está activada:

1. Vuelve a la página de seguridad: https://myaccount.google.com/security
2. Busca la sección **"Verificación en 2 pasos"**
3. Haz clic en **"Verificación en 2 pasos"** para entrar
4. Desplázate hacia abajo hasta encontrar **"Contraseñas de aplicaciones"**
5. Haz clic en **"Contraseñas de aplicaciones"**
6. Es posible que te pida tu contraseña de nuevo (ingrésala)
7. Verás una página para crear contraseñas de aplicación:

   **Seleccionar aplicación:**
   - Selecciona: **"Correo"**

   **Seleccionar dispositivo:**
   - Selecciona: **"Otro (nombre personalizado)"**
   - Escribe: **"Osvaldo Inversiones"**

8. Haz clic en **"Generar"**

9. Gmail generará una contraseña de 16 caracteres, se verá así:

   ```
   abcd efgh ijkl mnop
   ```

   **🔴 IMPORTANTE**: Copia esta contraseña **AHORA**. No podrás verla de nuevo.

---

### **Paso 3: Configurar el Archivo .env**

Abre el archivo `.env` en la raíz del proyecto y edítalo:

#### **Antes:**
```env
EMAIL_USER=TU_EMAIL@gmail.com
EMAIL_PASS=TU_CONTRASEÑA_DE_APLICACION
EMAIL_FROM="Osvaldo Inversiones <TU_EMAIL@gmail.com>"
```

#### **Después (con tus datos reales):**
```env
EMAIL_USER=tu_email_real@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM="Osvaldo Inversiones <tu_email_real@gmail.com>"
```

#### **Ejemplo completo:**

Si tu email es `osvaldo.inv@gmail.com` y tu contraseña de aplicación es `xkcd yhmg trzp qwas`:

```env
# Email Configuration (SMTP) - Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=osvaldo.inv@gmail.com
EMAIL_PASS=xkcd yhmg trzp qwas
EMAIL_FROM="Osvaldo Inversiones <osvaldo.inv@gmail.com>"
```

**✅ Guarda el archivo .env**

---

### **Paso 4: Probar la Configuración**

Ejecuta el script de prueba para verificar que todo funciona:

```bash
npm run server:build
node dist/server/test-email.js
```

O si prefieres usar tsx directamente:

```bash
npx tsx server/test-email.ts
```

#### **Resultado esperado:**

```
🧪 Prueba de Configuración de Email

================================

📧 Configuración:
   Host: smtp.gmail.com
   Port: 587
   User: osvaldo.inv@gmail.com
   Pass: ***qwas
   From: Osvaldo Inversiones <osvaldo.inv@gmail.com>

🔧 Inicializando servicio de email...

✅ Email service initialized
🔍 Verificando conexión con Gmail...

✅ Email service connection verified
✅ ¡Conexión exitosa con Gmail!

📤 Enviando email de prueba...

✅ Email sent to osvaldo.inv@gmail.com for ticket #1
✅ ¡Email de prueba enviado exitosamente!

📬 Revisa tu bandeja de entrada en: osvaldo.inv@gmail.com

🎉 La configuración está correcta y funcionando.
```

#### **Revisa tu email:**

1. Abre tu Gmail
2. Busca un email con asunto: **"🎫 Tu Ticket #00001 - Osvaldo Inversiones"**
3. Debería verse hermoso con tu número de ticket destacado

**✅ Si lo recibiste, ¡todo está configurado correctamente!**

---

## 🐛 Solución de Problemas

### ❌ Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Causa**: Contraseña incorrecta o no es una contraseña de aplicación

**Solución**:
1. Verifica que copiaste correctamente la contraseña de aplicación (con espacios está bien)
2. Asegúrate de NO estar usando tu contraseña normal de Gmail
3. Genera una nueva contraseña de aplicación si es necesario

---

### ❌ Error: "Please log in via your web browser"

**Causa**: Gmail detectó un inicio de sesión sospechoso

**Solución**:
1. Ve a: https://accounts.google.com/DisplayUnlockCaptcha
2. Inicia sesión con tu cuenta
3. Haz clic en "Continuar"
4. Intenta ejecutar el script de prueba nuevamente

---

### ❌ Error: "Contraseñas de aplicaciones no disponible"

**Causa**: La verificación en 2 pasos no está activada

**Solución**:
1. Ve a: https://myaccount.google.com/security
2. Activa la "Verificación en 2 pasos"
3. Espera unos minutos
4. Vuelve a intentar crear la contraseña de aplicación

---

### ❌ Los emails llegan a SPAM

**Solución**:
1. Marca el email como "No es spam"
2. Considera agregar un registro SPF a tu dominio (para producción)
3. En producción, usa un servicio profesional como SendGrid

---

## 🔒 Seguridad

### ✅ Buenas Prácticas:

1. **NO compartas** tu contraseña de aplicación con nadie
2. **NO subas** el archivo `.env` a GitHub (ya está en `.gitignore`)
3. **Revoca** contraseñas de aplicación que no uses:
   - Ve a: https://myaccount.google.com/apppasswords
   - Elimina las que no necesites

### ⚠️ Si Comprometen tu Contraseña de Aplicación:

1. Ve a: https://myaccount.google.com/apppasswords
2. Encuentra "Osvaldo Inversiones"
3. Haz clic en **"Revocar"**
4. Genera una nueva
5. Actualiza el `.env` con la nueva contraseña

---

## 🚀 Usar en Producción

Para producción, te recomiendo usar un servicio profesional en lugar de Gmail:

### **SendGrid** (Recomendado)

**Ventajas:**
- ✅ 100 emails gratis por día
- ✅ Mejor entregabilidad (menos emails en spam)
- ✅ Estadísticas y métricas
- ✅ Fácil de configurar

**Configuración:**

1. Crea una cuenta en: https://sendgrid.com/
2. Obtén tu API Key
3. Actualiza `.env`:

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=TU_API_KEY_DE_SENDGRID
EMAIL_FROM="Osvaldo Inversiones <noreply@tudominio.cl>"
```

---

## 📊 Límites de Gmail

Gmail tiene límites para envío de correos:

- **Cuenta personal**: 500 emails por día
- **Google Workspace**: 2000 emails por día

Para este proyecto (10,000 tickets máximo), si vendes todos en un día, necesitarás:
- Cuenta personal: 20 días para enviar todos los emails
- Mejor opción: Usar SendGrid o Mailgun

---

## ✅ Checklist de Configuración

- [ ] Activar verificación en 2 pasos en Gmail
- [ ] Crear contraseña de aplicación
- [ ] Copiar contraseña de aplicación
- [ ] Editar archivo `.env` con tu email
- [ ] Editar archivo `.env` con la contraseña de aplicación
- [ ] Actualizar `EMAIL_FROM` con tu email
- [ ] Ejecutar script de prueba: `npx tsx server/test-email.ts`
- [ ] Verificar que llegó el email de prueba
- [ ] Marcar email como "No es spam" si está en spam
- [ ] Iniciar servidor: `npm run dev:all`
- [ ] Hacer una compra de prueba completa

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:

1. Revisa los logs del script de prueba
2. Verifica que todos los pasos estén completos
3. Asegúrate de que el `.env` esté bien configurado
4. Intenta generar una nueva contraseña de aplicación

---

¡Listo! Una vez que completes estos pasos, tu sistema estará enviando emails automáticamente. 🎉
