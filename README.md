# ALMAE – Terapia y Spa · Web estática

Sitio web informativo y comercial de ALMAE – Terapia y Spa (Altos del Rímac 250, Torre 2, Dpto. 104, Lima). Permite a las personas conocer los servicios, consultar tarifas y promociones, y **solicitar una cita por WhatsApp**.

> La web **no confirma citas ni registra reservas**. La solicitud se envía por WhatsApp y el equipo verifica la disponibilidad.

Para la edición de contenidos sin programar, ver [`docs/GUIA_EDICION.md`](docs/GUIA_EDICION.md).
Para la publicación en GitHub Pages, ver [`docs/PUBLICACION_GITHUB.md`](docs/PUBLICACION_GITHUB.md).
Historial de cambios: [`docs/CONTROL_DE_CAMBIOS.md`](docs/CONTROL_DE_CAMBIOS.md).

---

## Arquitectura

Sitio **estático**: HTML, CSS y JavaScript sin compilación, sin frameworks y sin backend.

- No hay base de datos, API propia ni servicios de terceros para datos personales.
- Los contenidos se editan en archivos de configuración (`data/`) que se cargan como scripts.
- La web funciona abriéndose desde cualquier servidor de archivos estáticos (GitHub Pages incluido).

### Dependencias

| Tipo | Detalle |
|---|---|
| Runtime | Ninguno. Navegadores modernos con ES6 |
| Tipografías | Google Fonts (Cormorant Garamond y DM Sans), cargadas desde `fonts.googleapis.com` |
| Build | No requiere |
| Paquetes npm | No requiere (las herramientas de prueba se mantienen fuera del proyecto) |

---

## Estructura de archivos

```
index.html                 Estructura de la página (secciones, formulario, enlaces)
robots.txt                 Permite indexación
favicon.ico                Icono del sitio
.nojekyll                  Desactiva el procesamiento Jekyll en GitHub Pages
.gitignore                 Exclusiones de Git

data/
  config.js                Marca, contacto, WhatsApp, portada, imágenes, reservas, SEO y TARIFAS
  contenidos.js            Textos de secciones, formulario y aviso de privacidad
  servicios.js             Catálogo de servicios y categorías
  promociones.js            Promociones y lógica de vigencia
  preguntas.js             Preguntas frecuentes

assets/
  css/styles.css           Estilos principales
  css/responsive.css       Ajustes por tamaño de pantalla
  js/content.js            Aplica textos, imágenes, galería, enlaces y SEO desde data/
  js/whatsapp.js           Único módulo que genera enlaces de WhatsApp
  js/services.js           Catálogo, filtros y tabla de tarifas
  js/promotions.js         Bloque de promociones vigentes
  js/booking.js            Formulario de solicitud de cita
  js/gallery.js            Galería con visor ampliado accesible
  js/faq.js                Preguntas frecuentes desplegables
  js/navigation.js         Menú móvil y encabezado
  js/main.js               Animaciones de aparición, año y sección activa
  images/                  Fotografías optimizadas, logotipos, iconos y placeholder
  images/equipo/           Fotografía sin autorización verificada (excluida de Git)

docs/
  GUIA_EDICION.md          Guía para la administración
  PUBLICACION_GITHUB.md    Procedimiento de publicación
  CONTROL_DE_CAMBIOS.md    Historial de cambios
```

### Orden de carga de scripts (importante)

Los scripts se cargan en este orden en `index.html`:

1. `data/config.js`, `data/servicios.js`, `data/promociones.js`, `data/preguntas.js`, `data/contenidos.js`
2. `assets/js/whatsapp.js`
3. `assets/js/content.js`
4. `assets/js/navigation.js`, `main.js`, `services.js`, `promotions.js`, `gallery.js`, `faq.js`
5. `assets/js/booking.js`

Los datos deben cargarse antes que los módulos que los usan, y `whatsapp.js` antes que cualquier módulo que genere enlaces. Todos usan `defer`.

---

## Flujo de datos

```
data/*.js  ──►  content.js   ──►  textos, imágenes, galería, enlaces, SEO
                services.js  ──►  tarjetas, filtros, tabla de tarifas
                promotions.js──►  promociones vigentes o bloque de consulta
                faq.js       ──►  preguntas frecuentes
                                   │
                whatsapp.js  ◄─────┘  (único generador de enlaces wa.me)
                      ▲
                booking.js ──► resumen ──► enlace WhatsApp (con datos del formulario)
```

- Los textos se insertan siempre como **texto plano** (`textContent`). No se interpreta HTML proveniente de los archivos de datos.
- Las tarifas viven solo en `ALMAE_TARIFAS` (`data/config.js`) y se referencian por `tarifaId`.
- El número de WhatsApp viene de `ALMAE_CONFIG.whatsapp`.

---

## Funcionamiento de las reservas

1. El usuario elige un servicio desde el catálogo (botón *Solicitar cita*) o desde el formulario.
2. El formulario muestra las modalidades permitidas por el servicio y la tarifa informativa.
3. Validaciones: nombre, apellido, celular peruano de 9 dígitos que empiece con 9, servicio, modalidad, fecha (no anterior a hoy en **hora de Lima**), hora y consentimiento.
4. El botón *Revisar solicitud* muestra un resumen editable.
5. *Enviar solicitud por WhatsApp* abre WhatsApp con el mensaje estructurado. Si el navegador bloquea la ventana, aparece un **enlace visible** para continuar manualmente.
6. Los datos permanecen en el formulario mientras la página está abierta. **No se guardan** en ningún almacenamiento del navegador ni se envían a servidores de la web.

### Consentimientos

- **Obligatorio:** tratamiento de datos para gestionar la solicitud de cita.
- **Opcional (publicidad):** recibir información promocional. No condiciona la solicitud. Si se marca, el mensaje de WhatsApp lo indica.

---

## Enlaces de WhatsApp

Todos se generan con `window.ALMAE_WhatsApp` (`assets/js/whatsapp.js`):

| Función | Uso |
|---|---|
| `enlace(texto)` | Enlace genérico con el número de `config.js` |
| `enlaceIntencion(intencion, datos)` | `"cita"`, `"promociones"` o `"consulta"` |
| `construirMensaje(datos)` | Mensaje estructurado de la solicitud de cita |
| `construirEnlace(datos)` | Enlace de solicitud de cita |

Los textos de consulta general se editan en `config.js` → `mensajes`.

---

## Restricciones técnicas

- **Sin backend:** no hay envío de datos a servidores propios ni a bases de datos.
- **Sin almacenamiento persistente:** no se usan LocalStorage, SessionStorage ni cookies.
- **Sin Supabase** ni servicios de analítica.
- **Sin rutas absolutas:** todas las rutas son relativas para funcionar en subdirectorios (`/almae-web-estatica/`).
- **Dependencia de JavaScript:** los contenidos, la galería y el catálogo se generan con JavaScript. Sin JavaScript, la página muestra la estructura pero no los datos.
- **Fechas en hora de Perú:** la vigencia de promociones y la fecha mínima de reserva usan `America/Lima`.
- **Navegadores:** diseñado para versiones modernas con ES6. Verificado en Microsoft Edge (Chromium). Firefox y Safari no se han probado.

---

## Ejecución local

```powershell
cd D:\ALMAE
python -m http.server 8765
```

Abrir `http://127.0.0.1:8765`. Alternativa: `py -m http.server 8765`.

---

## Compatibilidad con hosting estático

- **GitHub Pages:** publicación desde la raíz de `main` (`/ (root)`). El archivo `.nojekyll` evita el procesamiento Jekyll.
- **Subdirectorio:** verificado con la estructura `/almae-web-estatica/` (CSS, JavaScript, imágenes, formulario y navegación).
- **Dominio propio:** no requiere cambios de código. Solo completar `seo.urlPublica` en `config.js` cuando exista.

### SEO

- Título, descripción y etiquetas Open Graph se generan desde `config.js`.
- `canonical`, `og:url` y `og:image` **se añaden solo cuando se define `seo.urlPublica`**, para no publicar URLs ficticias.
- `sitemap.xml` **no existe todavía**: requiere la URL definitiva. Está pendiente.

---

## Pendientes antes de publicar

Ver la sección *Pendientes antes de publicar al público* de `docs/GUIA_EDICION.md`. Principalmente:

- Revisión jurídica del aviso de privacidad y datos del responsable (4 marcadores `[PENDIENTE]` en `data/contenidos.js`).
- Autorización de la fotografía de equipo (excluida de Git).
- Coordenadas verificadas para el mapa (pendiente; hoy se muestra una nota).
- Horarios confirmados (pendiente; hoy no se muestran).
- URL definitiva para SEO.
