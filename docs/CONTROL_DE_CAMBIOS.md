# Control de cambios

Historial de cambios del proyecto web de ALMAE – Terapia y Spa.

---

## Hito 5 — Gestión de contenidos y consolidación

**Estado:** implementado y verificado localmente. Sin publicar. Sin commit.

### Configuración centralizada
- `data/config.js` consolidado: marca, slogan, contacto, WhatsApp, mensajes comerciales, portada, manifiesto de imágenes, parámetros de reservas, colores (referencia) y SEO.
- Tarifas (`ALMAE_TARIFAS`) sin cambios de valores.
- Dirección tomada de `direccion.texto`; eliminada la repetición en `contenidos.js`.

### Textos
- Nuevo `data/contenidos.js`: banda de confianza, nosotros, encabezados de secciones, banda de llamada a la acción, ubicación, contacto, formulario (consentimientos, aviso de privacidad) y pie de página.
- Nuevo `assets/js/content.js`: aplica textos, imágenes, galería, enlaces de WhatsApp y SEO. Textos insertados como texto plano.
- `index.html`: textos sustituidos por atributos `data-contenido`, `data-img`, `data-wa` y `data-nosotros-*`.

### Servicios
- `data/servicios.js`: nuevos campos `estado`, `reservable` y `orden`. Se conserva `visible` por compatibilidad.
- Catálogo, selector del formulario y tabla de tarifas solo muestran servicios activos. La tabla lista tarifas referenciadas por servicios activos.
- Servicios con `reservable: false` no muestran botón de solicitud ni aparecen en el selector.

### Imágenes
- Manifiesto en `config.js` → `imagenes` (portada, nosotros, galería).
- Galería generada desde el manifiesto antes de cargar el visor.
- Placeholder automático `assets/images/placeholder.svg` cuando una imagen falla (también para servicios y promociones). Clase `img-fallback` para estilos.

### Promociones
- `data/promociones.js`: campos `fechaInicio`, `fechaFin`, `activa`, `orden`, `servicioId`, `precioPromocional`, `precioRegular`, `cta`.
- Vigencia con fecha de Lima (`America/Lima`). Fechas inválidas, vencidas o inactivas no se muestran.
- Precio promocional solo si se configura. Compatibilidad con el campo antiguo `vigenciaHasta`.
- Bloque de consulta por WhatsApp cuando no hay promociones vigentes.

### WhatsApp
- `assets/js/whatsapp.js` es el único generador de enlaces `wa.me`: `enlace`, `enlaceIntencion` (cita, promociones, consulta), `construirMensaje`, `construirEnlace`.
- Número único en `config.js`. Eliminados los números escritos a mano en `index.html`, `content.js` y `booking.js`.
- Mensaje estructurado del formulario conservado. Nueva línea opcional si se acepta información promocional.

### Reservas
- Fallback de `window.open`: se muestra un enlace visible y se enfoca. Ya no se cambia de página, para no perder el contexto.
- Consentimiento de publicidad separado, opcional y sin premarcar.
- Enlace alternativo rellenado con el mensaje actual al mostrar el resumen.

### Privacidad
- Aviso de privacidad reescrito con secciones: responsable, datos, finalidad, canal, consentimiento, derechos y complementos.
- Referencias a la Ley N.° 29733 y al Decreto Supremo N.° 016-2024-JUS.
- **Cuatro marcadores `[PENDIENTE]`** que requieren validación antes de publicar.
- No se inventan razón social, RUC ni correos.

### SEO y GitHub Pages
- Eliminados los `PLACEHOLDER_URL` de `og:image` y `twitter:image`. Se añadirán cuando exista la URL definitiva.
- Título, descripción y etiquetas Open Graph desde `config.js`.
- `.gitignore`: excluye `Imagenes/`, `ALMAEWEB/`, `ALMAE_WEB/`, `assets/images/equipo/`, registros, cachés, credenciales y archivos temporales.
- `.nojekyll` creado (archivo vacío).
- Sin rutas absolutas en el proyecto.

### Documentación
- `README.md`, `docs/GUIA_EDICION.md`, `docs/PUBLICACION_GITHUB.md`, `docs/CONTROL_DE_CAMBIOS.md`.

### Pruebas
- Regresión Hito 4 (`booking-test`): 24/24 PASS, antes y después de los cambios de WhatsApp.
- Suite Hito 5 (`hito5-test`): 20/20 PASS en raíz y en subdirectorio `/almae-web-estatica/`.
- Responsive 390, 820, 1024 y 1440 px: sin desbordamiento horizontal.
- Sin errores de JavaScript. Sin peticiones a Supabase. Sin almacenamiento persistente de datos personales.

---

## Hito 4 — Solicitud de citas por WhatsApp

- Formulario con validaciones, modalidades por servicio, tarifa informativa, fecha mínima en hora de Lima.
- Resumen editable y envío por enlace `wa.me` con mensaje estructurado.
- Consentimiento obligatorio para la solicitud y aviso de privacidad.
- Sin almacenamiento de datos personales.
- Pruebas: 24/24 PASS.

---

## Hito 3 — Contenido comercial

- 20 servicios en 4 categorías con filtros.
- Tarifas confirmadas en tabla y tarjetas.
- Galería con visor accesible (teclado, foco, cierre con Escape).
- Preguntas frecuentes desplegables.
- Ubicación y contacto.
- Recortes de fotografías sin personas identificables en la galería.

---

## Hito 2 — Diseño visual

- Encabezado fijo con menú móvil accesible.
- Portada, banda de confianza, nosotros, pie de página, botón flotante de WhatsApp.
- Animaciones de aparición con soporte para movimiento reducido.
- Diseño adaptable a escritorio, tableta y móvil.

---

## Hito 1 — Inventario e identidad

- Inventario de imágenes originales (`Imagenes/`, sin modificar).
- Identidad visual y paleta de marca.
- Arquitectura estática.

---

## Pendientes conocidos

- Revisión jurídica del aviso de privacidad (4 marcadores `[PENDIENTE]`).
- Autorización de la fotografía de equipo.
- Mapa con coordenadas verificadas.
- Horarios confirmados.
- URL definitiva para SEO, `sitemap.xml` y `robots.txt` con sitemap.
- Repositorio remoto y publicación en GitHub Pages (requieren autorización).
