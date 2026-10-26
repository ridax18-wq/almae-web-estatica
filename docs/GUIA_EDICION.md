# Guía de edición de la web de ALMAE

Esta guía explica cómo actualizar la web sin programar. Solo necesitas un editor de texto sencillo (el Bloc de notas sirve, aunque **recomendamos Visual Studio Code** o Notepad++).

> **Regla de oro:** cambia únicamente los archivos de la carpeta `data\` y las fotos de `assets\images\`. No es necesario editar `index.html` ni los archivos de `assets\js\`.

---

## Antes de empezar

### Cómo editar sin dañar el archivo

- Abre el archivo con un editor de texto. **No uses Word**, porque cambia las comillas y rompe el archivo.
- Guarda siempre con codificación **UTF-8**. En el Bloc de notas: *Archivo → Guardar como → Codificación: UTF-8*.
- Escribe los textos **entre comillas dobles** `"así"`. Si necesitas escribir una comilla dentro de un texto, usa `\"`.
- Después de cada cambio, **comprueba la web en tu navegador** (ver punto 12).

### Estructura de carpetas

| Carpeta / archivo | Qué contiene | ¿Se edita? |
|---|---|---|
| `data\config.js` | Teléfono, dirección, portada, fotos, SEO, **tarifas** | **Sí** |
| `data\contenidos.js` | Textos de secciones, aviso de privacidad | **Sí** |
| `data\servicios.js` | Lista de servicios | **Sí** |
| `data\promociones.js` | Promociones | **Sí** |
| `data\preguntas.js` | Preguntas frecuentes | **Sí** |
| `assets\images\` | Fotografías y logotipos | **Sí** (reemplazar archivos) |
| `assets\js\`, `assets\css\` | Funcionamiento y diseño | No, salvo personal técnico |
| `index.html` | Estructura de la página | No, salvo personal técnico |
| `Imagenes\` | Fotografías originales de trabajo | No tocar; no se publica |
| `ALMAEWEB\`, `ALMAE_WEB\` | Restos de proyectos anteriores | No tocar |

---

## 1. Cambiar el teléfono de WhatsApp

**Archivo:** `data\config.js`

Busca estas dos líneas al inicio del archivo:

```js
whatsapp: "51919608174",
whatsappVisible: "+51 919 608 174",
```

- `whatsapp`: solo números, con el código de país **51** delante, sin espacios. Ejemplo: `"51987654321"`.
- `whatsappVisible`: cómo aparece el número en la página. Ejemplo: `"+51 987 654 321"`.

**Importante:** el número de `whatsapp` es el único que usa la web para todos los enlaces (botón flotante, ubicación, contacto, promociones, formulario). No hace falta cambiarlo en ningún otro sitio.

---

## 2. Cambiar la dirección

**Archivo:** `data\config.js`

```js
direccion: {
  linea1: "Altos del Rímac 250",
  linea2: "Torre 2, Dpto. 104",
  texto: "Altos del Rímac 250, Torre 2, Dpto. 104",
  urlConsulta: "https://www.google.com/maps/search/?api=1&query=..."
},
```

- Cambia `texto`: es la dirección que se muestra en la página (ubicación, contacto y pie de página).
- `urlConsulta`: enlace de mapas. Solo cámbialo si tienes la dirección exacta en Google Maps.

---

## 3. Editar títulos de la portada

**Archivo:** `data\config.js`, sección `portada`.

```js
titulo: ["Muévete con confianza.", "Recupera tu bienestar."],
```

- La primera frase va en una línea y la segunda, en cursiva, en la línea de abajo.

Para el texto de presentación:

```js
texto: {
  antes: "En ",
  marca: "ALMAE – Terapia y Spa",
  despues: " te acompañamos con fisioterapia, ..."
},
```

- `antes`, `marca` y `despues` forman una sola frase. La marca aparece en negrita.
- Puedes usar tildes y signos de puntuación normales. **No escribas etiquetas como `<b>` o `<br>`**: se verían como texto.

Para los textos de las secciones (Servicios, Galería, Reserva, etc.) y la banda de confianza, usa **`data\contenidos.js`**:

```js
secciones: {
  servicios: {
    eyebrow: "Servicios",
    titulo: "Terapias pensadas para ti",
    lead: "Fisioterapia, masajes y técnicas especializadas..."
  },
```

---

## 4. Modificar descripciones de servicios

**Archivo:** `data\servicios.js`

Cada servicio es un bloque entre `{` y `},`. Ejemplo:

```js
{
  id: "masaje-antiestres-60",
  nombre: "Masaje antiestrés — 60 minutos",
  descripcion: "Sesión relajante de 60 minutos para desconectar y recuperar bienestar.",
  beneficios: "Fomenta la relajación general y el descanso.",
  ...
}
```

- Cambia `nombre`, `descripcion` o `beneficios` entre comillas.
- **No cambies el `id`.** Es el identificador interno del servicio; si lo cambias, el servicio deja de estar vinculado a su tarifa.

---

## 5. Modificar tarifas

**Archivo:** `data\config.js`, sección `ALMAE_TARIFAS` (al final del archivo).

```js
"masaje-antiestres-60": {
  consultorio: 70,
  domicilio: 120,
  moneda: "S/",
  modalidadDomicilio: true,
  ...
},
```

- Cambia solo el número. Ejemplo: `consultorio: 75,`.
- Las tarifas están **en un único lugar**. Al guardarlas, se actualizan automáticamente:
  - las tarjetas de servicios,
  - la tabla de tarifas,
  - el formulario de solicitud,
  - el resumen y el mensaje de WhatsApp.
- **No inventes precios.** Si un servicio no tiene tarifa, déjalo sin `tarifaId` (queda "Consultar tarifa").
- Si el servicio **no tiene atención a domicilio**, pon `modalidadDomicilio: false` y no lo incluyas en `modalidades` de `servicios.js`.

---

## 6. Agregar un servicio nuevo

**Archivo:** `data\servicios.js`

1. Copia un bloque completo de servicio (desde `{` hasta `},`).
2. Pégalo **antes** del `]` final del archivo.
3. Cambia estos campos:

```js
{
  id: "drenaje-linfatico",                 // único, sin espacios ni tildes
  nombre: "Drenaje linfático",
  categoria: "masajes",                    // masajes, rehabilitacion, especializadas o tecnologia
  imagen: "assets/images/servicios/masajes.svg",
  alt: "Sesión de drenaje linfático en ALMAE",
  descripcion: "Texto comercial del servicio.",
  beneficios: "Texto de beneficios.",
  tarifaId: null,                          // o la clave de una tarifa existente
  modalidades: ["consultorio"],            // o ["consultorio", "domicilio"]
  estado: "activo",
  reservable: true,
  orden: 21,                               // número: menor = aparece antes
  visible: true
},
```

**Advertencias:**
- No olvides la **coma** después de cada `}` (excepto el último).
- No repitas un `id` que ya exista.
- Si el servicio tiene tarifa, usa un `tarifaId` que exista en `ALMAE_TARIFAS` (sección 5).

---

## 7. Desactivar o retirar un servicio

**Archivo:** `data\servicios.js`

Para **ocultarlo temporalmente** (sin borrar sus datos), cambia:

```js
estado: "inactivo",
```

El servicio desaparece del catálogo y del formulario de solicitud. Para **volver a mostrarlo**, cámbialo a `"activo"`.

Para **mostrarlo solo como información** (sin botón "Solicitar cita"), usa `reservable: false`.

---

## 8. Cambiar fotografías

**Regla:** usa siempre copias **optimizadas** dentro de `assets\images\`. **No uses las fotos originales de `Imagenes\`.** Si una foto muestra personas, debe contar con autorización escrita antes de publicarse.

### Opción A: reemplazar el archivo con el mismo nombre (lo más sencillo)

1. Prepara la nueva foto en formato `.jpg` y tamaño razonable (1200 px de ancho aproximadamente).
2. Renómbrala **exactamente** igual que la foto a reemplazar.
3. Cópiala en la carpeta correspondiente, aceptando la sustitución.

Carpetas y fotos actuales:

| Uso en la web | Archivo |
|---|---|
| Portada (hero) | `assets\images\hero\consultorio-hero.jpg` |
| Nosotros | `assets\images\consultorio\consultorio-luminoso.jpg` |
| Galería | `assets\images\galeria\*.jpg` |
| Logotipo | `assets\images\logo\almae-logo-dark.png` |

### Opción B: cambiar la ruta en la configuración

**Archivo:** `data\config.js`, sección `imagenes`.

```js
hero: {
  ruta: "assets/images/hero/consultorio-hero.jpg",
  alt: "Descripción de la foto para personas con discapacidad visual",
  ancho: 1200,
  alto: 800
},
```

- `ruta` es la ubicación de la imagen dentro del proyecto. **Debe empezar con `assets/`** y usar barras `/`.
- `alt` es la descripción de la foto. Escríbela pensando en quien no puede verla.

### Agregar o quitar fotos de la galería

**Archivo:** `data\config.js`, lista `galeria` dentro de `imagenes`. Copia un bloque completo `{ ... },` para agregar una foto, o bórralo para quitarla. El orden de la lista es el orden en pantalla.

### Si una foto no aparece

La web muestra automáticamente un **recuadro de marcador** con el texto «ALMAE» y la leyenda «Imagen no disponible». Esto significa que la ruta no existe: revisa que el nombre y la carpeta coincidan exactamente (las mayúsculas y las minúsculas cuentan).

---

## 9. Agregar una promoción

**Archivo:** `data\promociones.js`

1. Copia el bloque de ejemplo que aparece comentado al inicio del archivo.
2. Completa los campos:

```js
{
  id: "promo-masaje-60-noviembre",       // único
  titulo: "Masaje antiestrés de 60 minutos",
  descripcion: "Texto breve que explica la promoción, sin descuentos inventados.",
  imagen: "",                            // ruta de imagen, o "" si no hay
  alt: "",
  servicioId: "masaje-antiestres-60",    // id de un servicio existente
  precioPromocional: "",                 // SOLO si está autorizado, ej. "S/ 60"
  precioRegular: "",                     // ej. "S/ 70", solo si aplica
  fechaInicio: "2026-11-01",             // AAAA-MM-DD
  fechaFin: "2026-11-30",                // AAAA-MM-DD
  activa: true,
  orden: 1,
  cta: {
    texto: "Consultar por WhatsApp",
    mensaje: "Hola, ALMAE. Quisiera consultar la promoción vigente."
  }
},
```

**Reglas que aplica la web automáticamente:**
- Solo se muestra si `activa` es `true` **y** la fecha de hoy (hora de Perú) está entre `fechaInicio` y `fechaFin`.
- Una promoción con **fecha inválida** (por ejemplo `2026-02-30`) **no se muestra**.
- Un **precio promocional** solo aparece si lo escribes. Nunca se inventa.
- Si no hay promociones vigentes, la web muestra el bloque "Consulta nuestras promociones vigentes" con enlace a WhatsApp.

**Advertencia:** pon siempre las fechas en el formato `AAAA-MM-DD` (año, mes, día), con guiones.

### Activar, retirar y vencer promociones

- **Activar:** `activa: true` y fechas vigentes.
- **Retirar:** `activa: false`, o borra el bloque completo.
- **Vencimiento:** no requiere cambios. Cuando pasa `fechaFin`, la promoción deja de mostrarse sola. Aun así, conviene borrarla del archivo para mantenerlo ordenado.

---

## 10. Retirar promociones vencidas

1. Abre `data\promociones.js`.
2. Borra los bloques `{ ... },` de las promociones vencidas, o cambia `activa` a `false`.
3. Verifica que no quede una coma sobrante antes del `]`.

---

## 11. Modificar preguntas frecuentes

**Archivo:** `data\preguntas.js`

```js
{
  id: "precios",
  pregunta: "¿Cómo puedo consultar el precio de un tratamiento?",
  respuesta: "En la sección de tarifas encontrarás..."
},
```

- Cambia `pregunta` y `respuesta`.
- Para agregar una pregunta, copia un bloque completo y ajusta el `id` para que sea único.
- El orden de los bloques es el orden en pantalla.

---

## 12. Visualizar los cambios localmente

1. Abre una ventana de **PowerShell** o **Símbolo del sistema**.
2. Ve a la carpeta del proyecto y arranca un servidor local:

```powershell
cd D:\ALMAE
python -m http.server 8765
```

3. Abre el navegador (Edge o Chrome) en: **http://127.0.0.1:8765**
4. Para ver los cambios después de editar un archivo, **recarga la página** con `Ctrl + F5`.
5. Para detener el servidor, pulsa `Ctrl + C` en la ventana de PowerShell.

Si `python` no funciona, prueba `py -m http.server 8765`.

**Consejo:** antes de publicar, revisa la web en **móvil** (puedes usar las herramientas de desarrollo del navegador con `F12` y el icono de móvil).

---

## 13. Comprobar que WhatsApp sigue funcionando

Después de cualquier cambio, revisa estos puntos:

1. **Botón verde flotante** (abajo a la derecha): debe abrir WhatsApp con el número correcto.
2. **Ubicación:** los enlaces "Pedir indicaciones por WhatsApp" y "Consultar disponibilidad".
3. **Formulario de reserva:**
   - completa los datos de prueba,
   - pulsa *Revisar solicitud* y luego *Enviar solicitud por WhatsApp*,
   - verifica que el mensaje incluya el nombre, el servicio, la tarifa y la fecha.
4. **Promociones:** si hay una activa, su botón debe abrir WhatsApp.

Si algo no funciona, lo más probable es que el número en `config.js` tenga espacios, signos o le falte el código `51`.

**No envíes solicitudes de prueba al número real** sin avisar al equipo; si lo haces, bórralas desde el teléfono.

---

## 14. Publicar nuevamente cuando el hosting esté configurado

La web se publica con **GitHub Pages**. El procedimiento completo, paso a paso, está en `docs\PUBLICACION_GITHUB.md`.

Resumen:

1. Verifica los cambios localmente (punto 12).
2. Revisa que no aparezcan marcadores `[PENDIENTE]` en `data\contenidos.js` si la web va a publicarse para el público.
3. Sube los cambios siguiendo `docs\PUBLICACION_GITHUB.md`.
4. Espera unos minutos y comprueba la web publicada.

**Nunca publiques** las carpetas `Imagenes\`, `ALMAEWEB\` ni `ALMAE_WEB\`. Ya están excluidas en `.gitignore`; no las quites de esa lista.

---

## Pendientes antes de publicar al público

- **Aviso de privacidad:** completar razón social, RUC y datos de contacto del responsable (ver `data\contenidos.js`, marcadores `[PENDIENTE]`). Debe ser revisado por un profesional en protección de datos.
- **Fotografía de equipo** (`assets\images\equipo\`): no se publica hasta contar con autorización documentada.
- **Mapa:** se incorporará cuando se verifiquen las coordenadas.
- **Horarios:** se muestran solo cuando estén confirmados (`horarios` en `config.js`).
- **Dominio definitivo:** completar `seo.urlPublica` en `config.js` cuando exista.

---

## Errores frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| La página muestra en blanco un bloque | Falta una coma o una comilla en un archivo `data\` | Revisa la última modificación; restaura la copia anterior |
| Un cambio no aparece | El navegador usa la copia guardada | Recarga con `Ctrl + F5` |
| Un servicio no aparece | `estado` distinto de `"activo"` o `visible: false` | Revisa la sección 7 |
| Una foto no aparece | Ruta mal escrita o nombre con mayúsculas distintas | Revisa la sección 8 |
| El enlace de WhatsApp abre otro número | El número en `config.js` está mal escrito | Revisa la sección 1 |
| Una promoción no aparece | Fecha con formato incorrecto o fuera de vigencia | Revisa la sección 9 |
| Aparecen letras raras (`Ã`, `Â`) | El archivo no se guardó en UTF-8 | Guarda de nuevo en UTF-8 |

---

*Esta guía corresponde a la versión de la web entregada en el Hito 5. Si algún procedimiento no coincide con lo que ves, consulta a la persona técnica responsable antes de modificar archivos de `assets\js\` o `index.html`.*
