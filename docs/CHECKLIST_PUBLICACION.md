# Checklist de publicación — ALMAE Web

Estado a la fecha del Hito 6. **La web no está publicada.** Este documento separa lo que ya está verificado de lo que falta antes de publicar al público.

---

## 1. Requisitos técnicos

| Requisito | Estado | Evidencia |
|---|---|---|
| Sitio estático sin compilación ni backend | Cumplido | Estructura de `index.html`, `assets\`, `data\` |
| Sin Supabase ni credenciales | Cumplido | `seo-privacidad-audit.js` A1 y A2 |
| Sin almacenamiento de datos personales | Cumplido | A4 (ningún módulo usa LocalStorage, SessionStorage ni cookies); B12 y pruebas del formulario |
| Consentimiento sin premarcar | Cumplido | B12 y `hito5-test.js` (11) |
| Textos sin ejecución de HTML en datos | Cumplido | B13 y B14: inyección de HTML en los datos se muestra como texto |
| Rutas relativas (GitHub Pages en subdirectorio) | Cumplido | `run-all.js` contra `/almae-web-estatica/`: 117/117 |
| `index.html` en la raíz | Cumplido | |
| `.nojekyll` presente | Cumplido | A7 |
| `.gitignore` excluye originales, directorios antiguos y fotos no autorizadas | Cumplido | A8 y `git check-ignore` |
| Fotos sin persona identificable ni crédito de autor | Cumplido en código | Ver sección 3, punto 1 |
| Sin marcadores PLACEHOLDER | Cumplido | A3 |
| Pruebas de regresión (Hitos 4 y 5) | Cumplido | 117/117 |
| Responsive 390, 820, 1024, 1440 px | Cumplido | 38/38 y revisión visual |
| Lighthouse ≥ 90 en las cuatro categorías | Cumplido | Ver sección 4 |

---

## 2. Pendientes comerciales (no bloquean el código; sí la publicación)

- [ ] Confirmar los **horarios de atención**. Hoy no se muestran (`horarios: null` en `config.js`).
- [ ] Confirmar la **atención a domicilio**: servicios, zonas y valores.
- [ ] Confirmar **todas las tarifas** por escrito (las actuales son las autorizadas en el Hito 3).
- [ ] Decidir si se publican **promociones**. Hoy no hay ninguna activa; la web muestra el bloque de consulta por WhatsApp.
- [ ] Verificar **coordenadas del mapa**. Hoy solo hay una nota de espera.
- [ ] Confirmar **nombre y cargo de la profesional** y sus credenciales. No se publican hasta validarlos (no se han inventado).
- [ ] Decidir si se publican **testimonios**. Hoy no hay ninguno.
- [ ] Confirmar el **mensaje oficial de WhatsApp** de cada plantilla (`config.js` → `mensajes`).

---

## 3. Pendientes legales y de derechos (bloqueantes para el público)

### 3.1. Derechos sobre las fotografías

- [ ] **Fotografía `assets\images\consultorio\ambiente-almae.jpg`**: muestra a una persona identificable y lleva el crédito de un fotógrafo. **No se utiliza y no debe publicarse.** Está excluida de Git (`.gitignore`), pero **sigue en el historial local del commit baseline** (ver sección 6).
- [ ] **Fotografía `assets\images\equipo\atencion-profesional.jpg`**: excluida. No se publica hasta contar con autorización escrita de la persona retratada.
- [ ] Confirmar la **licencia o autorización de las fotos del consultorio** que sí se publican (`consultorio-luminoso.jpg`, `consultorio-hero.jpg` y las cuatro de la galería). Si proceden del mismo fotógrafo, conviene documentar la cesión de uso.
- [ ] Revisión visual de las fotos publicadas: **no aparecen personas** ni pacientes.
- [ ] **Hallazgo:** en `consultorio-luminoso.jpg` (y posiblemente en otras fotos tomadas desde la misma ventana) se ve, al fondo, un **cartel «SE VENDE» con un número de teléfono de un tercero** (un edificio vecino). No es dato de pacientes, pero es información ajena publicada sin relación con ALMAE. **Decisión pendiente del responsable:** recortar o difuminar esa zona (esto modifica la foto y debe aprobarse visualmente) o retirar esa foto de la web. No se ha alterado en esta fase.

### 3.2. Aviso de privacidad (Ley N.° 29733 y DS N.° 016-2024-JUS)

El aviso está en `data\contenidos.js` (`reserva.aviso`). **No está validado jurídicamente.** Datos que debe proporcionar el responsable del tratamiento antes de publicar:

1. **Razón social** completa del responsable.
2. **RUC** del responsable.
3. **Domicilio fiscal** (hoy solo figura la dirección del consultorio).
4. **Correo electrónico** de contacto para ejercer derechos (hoy solo figura WhatsApp).
5. **Canal formal** para ejercer derechos ARCO y **plazos de respuesta**.
6. **Condiciones del proveedor de mensajería** (WhatsApp) como tercero que recibe los datos al enviar la solicitud, y su base contractual o de tratamiento.
7. Confirmar si existe **encargado del tratamiento** o terceros adicionales (por ejemplo, la plataforma de agenda externa que usa recepción).
8. **Plazo de conservación** de los datos en el canal de WhatsApp y en la agenda.
9. Confirmar que se **inscribe el banco de datos** cuando corresponda, o que la obligación no aplica.
10. **Medidas de seguridad** que adopta el responsable para los datos recibidos por WhatsApp.
11. Revisión por profesional en protección de datos personales de la redacción completa, incluido el texto del **consentimiento para información promocional** (opcional, separado).

Marcadores `[PENDIENTE]` actuales en el aviso: **4** (razón social y RUC; condiciones del proveedor; canal de reclamos y plazos; validación jurídica completa).

**Importante:** la web no declara conformidad legal definitiva. Esta lista no sustituye el asesoramiento jurídico.

---

## 4. Rendimiento y SEO

### 4.1. Resultados Lighthouse (Edge, medición del Hito 6)

| Perfil | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Móvil | 91 | 100 | 100 | 100 | 3,4 s | 0,034 |
| Escritorio | 99 | 100 | 100 | 100 | 0,7 s | 0,005 |

Reproducir (con el servidor local activo):

```powershell
cd D:\ALMAE\tests
$env:CHROME_PATH = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
npx lighthouse http://127.0.0.1:8765/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new --no-sandbox"
```

Mejora pendiente: el LCP móvil (3,4 s) corresponde a la fotografía de la portada. Se puede reducir generando una versión de 800 px de ancho en formato WebP con `srcset`. No se ha hecho para no alterar la imagen sin revisión visual.

### 4.2. Configuraciones pendientes de la URL definitiva

Completar **cuando exista la URL de GitHub Pages o el dominio propio**:

- [ ] `data\config.js` → `seo.urlPublica`: por ejemplo `"https://USUARIO.github.io/almae-web-estatica/"`. Con este valor, `content.js` añade automáticamente `<link rel="canonical">`, `og:url`, `og:image` y `twitter:image`.
- [ ] Crear `sitemap.xml` en la raíz con esa URL (no se crea hoy para no publicar URLs ficticias).
- [ ] Añadir en `robots.txt` la línea `Sitemap: https://…/sitemap.xml`.
- [ ] Verificar la imagen `og:image` (1200 × 630 recomendado; hoy la portada tiene 1200 × 800).
- [ ] Registrar el sitio en Google Search Console tras la publicación.

---

## 5. Pruebas después de publicar

Ejecutar contra la **URL real** (no contra el servidor local):

```powershell
cd D:\ALMAE\tests
node run-all.js https://USUARIO.github.io/almae-web-estatica
```

Además, comprobar a mano:

- [ ] La página carga en menos de 5 segundos en red móvil.
- [ ] Las fotos se ven y ninguna aparece como marcador.
- [ ] Botón flotante, enlaces de ubicación y de promociones abren WhatsApp con el número correcto.
- [ ] El formulario genera el resumen y el enlace; si el navegador bloquea la ventana, aparece el enlace alternativo.
- [ ] No aparece `Supabase` ni ninguna URL de otro proyecto en las herramientas del desarrollador (F12, pestaña Red).
- [ ] La consola no muestra errores (F12).
- [ ] Revisar la URL en el móvil real.

---

## 6. Control de versiones antes de publicar

Estado del repositorio local en este momento:

- Commit baseline `b9cfa49` (local, **sin remoto, sin push**).
- Trabajo del Hito 6 **pendiente de confirmar** (sin commit).
- `ambiente-almae.jpg` **figura en el commit baseline**. Quitarlo del índice no lo borra del historial.

**Antes del primer `git push` es obligatorio resolver esto.** Opciones, a decidir por la persona responsable:

1. **Rehacer el commit baseline** sin esa foto, mientras el repositorio siga sin remoto (es la opción más limpia).
2. Reiniciar el historial (`git` nuevo repositorio) y volver a commitear.

No publicar el historial actual.

---

## 7. Decisión de publicación

Ver el **reporte del Hito 6**. Resumen: la web es técnicamente sólida y pasa todas las comprobaciones. **No debe publicarse al público** mientras queden pendientes los puntos 2 y 3 (en especial el aviso de privacidad, los derechos de las fotos y la historia del commit).
