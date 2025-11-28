# 📋 Checklist de Personalización para AR Inversiones

Este documento lista todos los cambios pendientes para personalizar completamente el sitio de **AR Inversiones** y eliminar las referencias al sitio de prueba (Osvaldo Inversiones).

## ✅ Cambios Completados

- [x] Nombre del proyecto actualizado a `ar-inversiones` en `package.json`
- [x] Variables de entorno actualizadas con dominio `arinversiones.cl`
- [x] Templates de email actualizados con branding AR Inversiones
- [x] Configuración de Render actualizada
- [x] Título del sitio actualizado a "AR Inversiones"
- [x] Copyright actualizado en Footer

## 🔴 TAREAS PENDIENTES - ALTA PRIORIDAD

### 1. Reemplazar Imágenes y Assets

#### 📍 Archivo: `constants.ts`

**IMPORTANTE**: Todas estas URLs apuntan al sitio de Osvaldo Inversiones (sitio de prueba). Debes reemplazarlas con tus propias imágenes.

```typescript
export const IMAGES = {
  logo: 'https://osvaldoinversiones.cl/...',        // ❌ Reemplazar con logo de AR Inversiones
  heroMan: 'https://osvaldoinversiones.cl/...',     // ❌ Reemplazar con imagen hero
  heroBg: 'https://images.unsplash.com/...',        // ✅ Esta es genérica (puede quedarse)
  helpMoto: 'https://osvaldoinversiones.cl/...',    // ❌ Reemplazar con imagen de ayuda
  aboutOsvaldo: 'https://osvaldoinversiones.cl/...' // ❌ Reemplazar con imagen about/equipo
};
```

**Opciones para hospedar imágenes:**
1. **Render Static Files**: Sube imágenes a una carpeta `public/` en tu proyecto
2. **Cloudinary** (gratuito): https://cloudinary.com - Recomendado
3. **AWS S3**: Si ya tienes cuenta AWS
4. **Imgur**: Opción simple para pocas imágenes
5. **Tu propio dominio**: Si tienes hosting web

**Pasos recomendados:**
1. Crea una cuenta en Cloudinary (plan free)
2. Sube tus imágenes (logo, fotos del equipo, etc.)
3. Copia las URLs generadas
4. Actualiza el objeto `IMAGES` en `constants.ts`

### 2. Actualizar Redes Sociales

#### 📍 Archivos: `components/Header.tsx` y `components/Footer.tsx`

Actualmente apuntan a las redes sociales del sitio de prueba:

```typescript
// ❌ CAMBIAR ESTAS URLs
Facebook:  https://www.facebook.com/osvaldo.fuentesfuentes
Instagram: https://www.instagram.com/elbandidoosvaldo69
TikTok:    https://www.tiktok.com/@bandidoosvaldo.fuentes69
```

**Buscar y reemplazar en ambos archivos:**
1. Abre `components/Header.tsx`
2. Abre `components/Footer.tsx`
3. Reemplaza las URLs con las redes sociales de AR Inversiones

Si no tienes alguna red social, puedes:
- Remover ese link específico
- O comentar esa sección del código

### 3. Agregar Favicon Personalizado

#### 📍 Archivo: `index.html`

Actualmente el favicon apunta a `/favicon.svg` que no existe.

**Pasos:**
1. Diseña o consigue tu favicon (logo de AR Inversiones)
2. Convierte a formato `.svg`, `.png`, o `.ico`
3. Herramientas recomendadas:
   - https://realfavicongenerator.net/ (genera todos los tamaños)
   - https://favicon.io/ (convierte imágenes a favicon)
4. Sube el archivo a la carpeta `public/` de tu proyecto
5. Actualiza la línea en `index.html`:
   ```html
   <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
   ```

## 🟡 TAREAS PENDIENTES - MEDIA PRIORIDAD

### 4. Personalizar Contenido del Sitio

Revisa y actualiza el contenido en estos componentes:

#### 📍 `components/AboutSection.tsx`
- Descripción de la empresa
- Historia de AR Inversiones
- Valores y misión

#### 📍 `components/Hero.tsx`
- Texto principal (hero title)
- Subtítulo
- Call to action

#### 📍 `components/ProjectsSection.tsx`
- Proyectos actuales de AR Inversiones
- Descripción de servicios

### 5. Actualizar Productos/Tickets

#### 📍 Archivo: `constants.ts`

```typescript
export const PRODUCTS: TicketProduct[] = [
  {
    id: 'ticket-unico',
    title: 'TICKET OFICIAL',
    subtitle: '1 TICKET X $10.000',
    price: 10000,
    description: 'Compra tu ticket y participa por increíbles premios...',
    // ...
  }
];
```

**Revisa:**
- ¿El precio es correcto?
- ¿La descripción refleja tu oferta?
- ¿Necesitas más productos/opciones?

### 6. Configurar Dominio Personalizado

Ya tienes el dominio **arinversiones.cl**. Para usarlo:

#### Backend en Render:
1. Ve a tu servicio en Render Dashboard
2. Settings → Custom Domain
3. Agrega `api.arinversiones.cl` (o el subdominio que prefieras)
4. Render te dará instrucciones DNS
5. Configura los registros en tu proveedor de dominios

#### Frontend:
Dependiendo dónde lo despliegues (Vercel, Netlify, etc.):
1. Agrega el dominio principal: `arinversiones.cl`
2. Y opcionalmente: `www.arinversiones.cl`

**Importante:** Después de configurar el dominio:
- Actualiza `BASE_URL` en variables de entorno de Render
- Actualiza `FRONTEND_URL` en variables de entorno de Render
- Actualiza webhooks en Flow con el nuevo dominio

## 🟢 TAREAS OPCIONALES - MEJORAS

### 7. Mejorar SEO

Agrega meta tags en `index.html`:

```html
<meta name="description" content="AR Inversiones - Descripción de tu negocio" />
<meta name="keywords" content="inversiones, chile, [tus keywords]" />
<meta property="og:title" content="AR Inversiones" />
<meta property="og:description" content="Descripción para redes sociales" />
<meta property="og:image" content="URL_de_imagen_para_compartir" />
<meta property="og:url" content="https://arinversiones.cl" />
```

### 8. Google Analytics / Tracking

Si quieres analíticas:

1. Crea una cuenta en Google Analytics
2. Obtén tu Tracking ID
3. Agrega el script en `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TU-ID');
</script>
```

### 9. Política de Privacidad y Términos

Crea páginas para:
- Política de privacidad
- Términos y condiciones
- Política de cookies (si usas cookies)

Agrega links en el Footer.

### 10. Email de Contacto Real

Actualiza el email de contacto en:
- Templates de email (ya actualizado a `contacto@arinversiones.cl`)
- ¿Tienes este email configurado?
- Si no, créalo en tu proveedor de email

## 📝 Documentos a Revisar/Actualizar

Algunos documentos de ayuda tienen referencias al sitio de prueba. Revísalos si es necesario:

- `ARQUITECTURA_SISTEMA.md` - Puede tener ejemplos con "Osvaldo"
- `TICKET_SYSTEM_README.md` - Ejemplos de uso
- `GMAIL_SETUP.md` - Ejemplos de configuración
- `DEPLOYMENT_SUPABASE.md` - Ejemplos de deployment

**Estos son opcionales** - la funcionalidad no depende de ellos, pero sería bueno actualizarlos si los vas a compartir con tu equipo.

## 🚀 Orden Recomendado de Ejecución

Para maximizar eficiencia, sigue este orden:

### Fase 1 - Pre-deployment (ANTES de desplegar):
1. ✅ Reemplazar imágenes en `constants.ts`
2. ✅ Actualizar redes sociales en Header y Footer
3. ✅ Agregar favicon
4. ✅ Revisar y personalizar contenido de componentes
5. ✅ Revisar productos/precios

### Fase 2 - Durante deployment:
1. ✅ Configurar variables de entorno en Render (según guía)
2. ✅ Hacer primer deployment
3. ✅ Probar que todo funciona

### Fase 3 - Post-deployment:
1. ✅ Configurar dominio personalizado
2. ✅ Actualizar URLs en Flow (webhooks)
3. ✅ Agregar Google Analytics
4. ✅ Crear páginas de privacidad/términos

## 🔍 Cómo Buscar Referencias Pendientes

Si quieres buscar referencias que aún apuntan al sitio de prueba:

```bash
# En la terminal, desde la raíz del proyecto:
grep -r "osvaldo" --include="*.ts" --include="*.tsx" --include="*.html"
```

Esto te mostrará todos los archivos que aún tienen "osvaldo" en el código.

## ✅ Checklist Visual

Copia y pega esto para hacer seguimiento:

```
☐ Imágenes reemplazadas en constants.ts
☐ Redes sociales actualizadas (Header + Footer)
☐ Favicon agregado
☐ Contenido de AboutSection personalizado
☐ Contenido de Hero personalizado
☐ Productos/precios revisados
☐ Dominio configurado en backend
☐ Dominio configurado en frontend
☐ Webhooks de Flow actualizados
☐ Google Analytics agregado (opcional)
☐ Políticas de privacidad creadas (opcional)
```

## 🆘 ¿Necesitas Ayuda?

Si tienes dudas sobre alguno de estos pasos:

1. Revisa la guía de deployment: `RENDER_DEPLOYMENT_GUIDE.md`
2. Revisa las otras guías en el proyecto
3. Busca en la documentación oficial de cada servicio
4. Abre un issue en GitHub

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0
**Para:** AR Inversiones (arinversiones.cl)
