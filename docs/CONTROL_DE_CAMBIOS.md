# Control de cambios

Historial de cambios del proyecto web de ALMAE – Terapia y Spa.

---

## Hito 7 — Saneamiento del historial y preparación de respaldo GitHub

**Estado:** pruebas 141/141 PASS, documentación corregida, historial saneado localmente. Sin repositorio remoto, sin push, sin GitHub Pages.

### Validación funcional
- Batería completa contra servidor local: **141/141 PASS** (`booking-test` 24, `hito5-test` 20, `reservas-popup` 12, `responsive-audit` 38, `seo-privacidad-audit` 23, `catalogo-test` 24). `Suites con fallos: 0`.
- Repetida tras el saneamiento del historial: mismo resultado, 141/141.

### Fotografía de equipo retirada
- `ambiente-almae.jpg` (persona identificable, crédito de fotógrafo) **ya no está en el árbol ni en el historial**: se excluyó del índice en el Hito 6 y se retiró del historial con el reescribir del baseline (commit actual `b3c082e` y posteriores). El blob original no existe en el repositorio. La fotografía original se conserva intacta en `D:\ALMAE\Imagenes`, fuera de Git. **No requiere autorización de uso porque no se publica.**

### Saneamiento del historial (autorizado)
- Retirada del historial únicamente `assets/images/consultorio/consultorio-luminoso.jpg`: cartel «SE VENDE» con número de teléfono de un tercero visible. No autorizada para publicación.
- Verificada su ruta exacta y su presencia únicamente en los commits intermedios del Hito 6 (`8b5fca6` y descendientes hasta su sustitución). No existía en el baseline ni en el árbol actual.
- Resto del historial intacto: fotos de galería y pictogramas retirados por obsolescencia (titularidad confirmada) no se tocaron.
- Copia de seguridad verificable antes de reescribir (bundle Git + directorio completo) fuera de `D:\ALMAE`.

### Corrección documental
- `docs/PRUEBAS.md`: añadida la suite `catalogo-test.js` (24) y el total de 141 verificaciones (antes solo listaba 5 suites y 117 pruebas).

---

## Hito 6 — Auditoría integral y preparación para publicación

**Estado:** auditado y corregido en local. Sin push ni repositorio remoto. Cambios del Hito 6 pendientes de confirmar en Git.

### Control de versiones
- Commit local `b9cfa49` «chore: baseline ALMAE static web through milestone 5» (48 archivos).
- Excluida del índice `assets/images/consultorio/ambiente-almae.jpg` (persona identificable, crédito de fotógrafo, sin uso). Excluida también en `.gitignore`. En su momento se señaló que seguía en el historial del baseline; con el reescribir posterior del baseline (ver Hito 7) **ya no existe en el historial**.
- `.gitignore`: añadidos `tests/node_modules/` y `tests/.capturas/`.

### Pruebas
- Suites trasladadas a `tests/` sin rutas absolutas. Configurables con `ALMAE_BASE`, `CHROME_PATH` y `ALMAE_SHOTS`.
- Nuevas: `run-all.js`, `reservas-popup.js` (12), `responsive-audit.js` (38), `seo-privacidad-audit.js` (23).
- Resultado: **117/117 en raíz y en subdirectorio** `/almae-web-estatica/`.
- Documentadas en `docs/PRUEBAS.md`.

### Correcciones (defectos reales)
- **Contraste del texto legal del pie**: 2,04:1 → ≥ 4,5:1 (opacidad del texto 0,45 → 0,72; el `<p>` heredaba un color propio).
- **Flechas del visor de galería**: fondo translúcido de 12 % → fondo oscuro sólido con borde, visibles sobre fotos claras.
- **Filtros de servicios**: altura mínima 44 px (área táctil).
- **Botones primarios**: fondo `#b56a75` → `#a85f6c` (contraste 3,97 → 4,65 con texto blanco). Mismo tono, más oscuro.
- **Texto secundario** (`--color-ink-mute`): `#8a7f83` → `#7a6f73` (3,86 → 4,83).
- **Texto verde salvia** en categoría de servicio, etiquetas de modalidad y vigencia de promociones: `#8c9a7e` → `#5f6e49` (2,98 → 5,51).
- Resultado Lighthouse de accesibilidad: 97 → 100 (móvil y escritorio).

### SEO
- Datos estructurados `LocalBusiness` (schema.org) generados por `content.js` desde `config.js`: nombre, teléfono visible, dirección y descripción.
- Sin cambios en título, descripción, encabezados ni textos alternativos (todos verificados).

### Documentación
- Nuevos: `docs/PRUEBAS.md`, `docs/CHECKLIST_PUBLICACION.md` (requisitos, pendientes comerciales y legales, configuración SEO, pruebas posteriores).
- Actualizados: `README.md` (carpeta `tests/`, datos estructurados, pruebas), este registro.

### Hallazgos sin modificar (requieren decisión)
- `consultorio-luminoso.jpg`: cartel «SE VENDE» con número de teléfono de un tercero visible al fondo.
- Historial de `b9cfa49` con `ambiente-almae.jpg`.
- LCP móvil de 3,4 s, asociado a la fotografía de portada. Mejora posible con versión reducida y `srcset`.

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
- ~~Autorización de la fotografía de equipo.~~ Resuelto: la fotografía se retiró del árbol y del historial; no se publica (ver Hito 7).
- Mapa con coordenadas verificadas.
- Horarios confirmados.
- URL definitiva para SEO, `sitemap.xml` y `robots.txt` con sitemap.
- Repositorio remoto y publicación en GitHub Pages (requieren autorización).
