# Inventario de fotografías y activos visuales

Fecha de revisión: Hito 7 (preparación). Revisión visual de cada archivo; no hay metadatos EXIF ni marcas de procedencia en ninguna imagen de `Imagenes\`, por lo que el origen se valora por apariencia.

Estados:

- **CONFIRMADA**: uso permitido según la documentación disponible.
- **PENDIENTE**: puede usarse cuando se complete la verificación indicada.
- **EXCLUIDA**: no se publica en su estado actual.

---

## 1. Activos ya incorporados en el repositorio (`assets\`)

| Archivo | Contenido | Revisión | Estado |
|---|---|---|---|
| `assets/images/hero/consultorio-hero.jpg` | Vista del consultorio, sin personas | Sin marcas de terceros visibles | PENDIENTE: confirmar titularidad o licencia de la foto |
| `assets/images/consultorio/consultorio-luminoso.jpg` | Vista del consultorio con cartel «SE VENDE» y teléfono de un tercero al fondo | Sin personas | PENDIENTE: decidir entre recorte (copia preparada, ver sección 3) o retirada |
| `assets/images/galeria/consultorio-vista-amplia.jpg` | Recorte de la foto ALMAE 10 | Sin personas (recorte verificado) | PENDIENTE: titularidad de la foto de origen |
| `assets/images/galeria/ventana-camilla.jpg` | Recorte de la foto ALMAE 10 | Sin personas | PENDIENTE: titularidad de la foto de origen |
| `assets/images/galeria/estanteria-equipo.jpg` | Recorte de la foto ALMAE 10 | Sin personas | PENDIENTE: titularidad de la foto de origen |
| `assets/images/galeria/letrero-almae.jpg` | Recorte del letrero luminoso | Sin personas | PENDIENTE: titularidad de la foto de origen |
| `assets/images/logo/*.png`, `assets/apple-touch-icon.png`, `favicon.ico` | Logotipo institucional e iconos | Sin personas | CONFIRMADA (identidad de marca) |
| `assets/images/servicios/*.svg` (5) | Ilustraciones vectoriales propias del proyecto | Sin personas ni texto de precios | CONFIRMADA |
| `assets/images/placeholder.svg` | Marcador para imágenes ausentes | Propio del proyecto | CONFIRMADA |

**Nota sobre la galería:** los cuatro recortes proceden de la fotografía `ALMAE 10`, que sí contiene una persona. Los recortes no la incluyen, pero la titularidad de la foto de origen debe confirmarse igualmente.

---

## 2. Fotografías indicadas para integración (`Imagenes\`) — revisión solicitada

### 2.1 Carpeta `Imagenes\CONSULTORIO\`

| Archivo | Revisión visual | Estado |
|---|---|---|
| `Consultorio ALMAE limpio y luminoso.png` | Render de consultorio con logotipo sobre la pared, iluminación uniforme y mobiliario idealizado. Mismo archivo que la copia de la raíz (hash idéntico). | **EXCLUIDA** para presentarla como fotografía del consultorio |
| `Imagen de ChatGPT 28 oct 2026, 09_12_18.png` | Mismo espacio, distinto encuadre, mismo estilo | **EXCLUIDA** |
| `Imagen de ChatGPT 28 oct 2026, 09_12_28.png` | Vista de camilla y estantería | **EXCLUIDA** |
| `Imagen de ChatGPT 28 oct 2026, 09_12_35.png` | Vista de camilla desde otro ángulo | **EXCLUIDA** |

**Motivo:** el nombre de archivo indica generación con ChatGPT y las cuatro imágenes presentan rasgos de render (texturas uniformes, luz sin fuente visible, mobiliario sin uso real, logotipo integrado en la pared). La especificación del proyecto prohíbe «presentar imágenes generadas por IA como fotografías del consultorio». Ver sección 4.

### 2.2 Carpeta `Imagenes\Servicios\`

| Archivo | Servicio asociado | Problemas detectados | Estado |
|---|---|---|---|
| `ALMAE_ terapia y bienestar profesional.png` | General | Personas generadas; texto publicitario | **EXCLUIDA** |
| `Fisioterapia a domicilio personalizada.png` | Fisioterapia y rehabilitación (domicilio) | Personas generadas; sin precio | **EXCLUIDA** |
| `Masaje antiestrés a domicilio.png` | Masaje antiestrés 60/90 min (domicilio) | Personas generadas; **precios impresos** (S/ 120 y S/ 150) | **EXCLUIDA** |
| `Masaje antiestrés en consultorio.png` | Masaje antiestrés 60/90 min (consultorio) | Personas generadas; **precios impresos** (S/ 70 y S/ 90) | **EXCLUIDA** |
| `Masaje estético reductor a domicilio.png` | Masaje reductor 90 min (domicilio) | Personas generadas; **precio impreso** (S/ 200) | **EXCLUIDA** |
| `Masaje estético reductor en consultorio.png` | Masaje reductor 90 min (consultorio) | Personas generadas; **precio impreso** (S/ 150) | **EXCLUIDA** |
| `Reflexología podal y facial a domicilio.png` | Reflexología (sin tarifa en `config.js`) | Personas generadas; **precio impreso no confirmado** (S/ 70) | **EXCLUIDA** |
| `Reflexología podal y facial en consultorio.png` | Reflexología (sin tarifa en `config.js`) | Personas generadas; **precio impreso no confirmado** (S/ 60) | **EXCLUIDA** |
| `Terapia física y rehabilitación en ALMAE.png` | Terapia física (consultorio) | Personas generadas; **precio impreso** (S/ 50) | **EXCLUIDA** |

**Coincidencia de precios con `config.js`:** los precios de masaje antiestrés, masaje reductor y terapia física coinciden con las tarifas confirmadas. **Los precios de reflexología no existen en `config.js`** y no pueden publicarse hasta que estén confirmados.

**Regla aplicada:** los precios de las imágenes no se usan. Las tarifas solo se muestran desde `config.js`, para no duplicarlas.

### 2.3 Presentación de la profesional — `Imagenes\Retrato ejecutivo de la directora de Almae.png`

| Aspecto | Hallazgo | Estado |
|---|---|---|
| Persona identificable | Sí, primer plano | Requiere autorización escrita |
| Origen | Iluminación, muro de madera y rótulo idénticos a los renders de `CONSULTORIO\`. Posible imagen generada | Requiere confirmar que es una fotografía real |
| Identidad profesional | Cargo «directora» indicado por el nombre de archivo | No validado; el nombre y las credenciales no están confirmados |
| Otros archivos de la misma profesional | `FISIOTERAPEUTA IMAGEN.jpeg` y `ChatGPT Image 12 ago 2026` (carpeta raíz) muestran a una persona similar | No revisados en detalle; sin estado |

**Estado global: EXCLUIDA** hasta cumplir los tres requisitos: origen real confirmado, autorización escrita de la persona retratada, y datos profesionales validados.

---

## 3. Copia preparada: consultorio-luminoso.jpg recortado

- Ubicación: `%TEMP%\opencode\revision-foto\consultorio-luminoso-recortada.jpg`
- Dimensiones: 1200 × 1270 (original 1200 × 1600)
- Método: recorte de los primeros 330 px. Elimina el cartel «SE VENDE» y el teléfono de un tercero.
- Verificación visual: cartel ausente en la copia; ningún fragmento visible.
- **No está integrada.** El original permanece sin cambios.
- Para integrarla, habría que actualizar `width`/`height` de la imagen (`data/config.js`, `imagenes.nosotros`) y revisar la maquetación de la sección «Nosotros».

---

## 4. Carpeta raíz de `Imagenes\` — no designada

31 archivos. Ninguno está en el alcance de publicación. Algunos aparecen también en la sección 2 (el duplicado del consultorio y el retrato); se cuentan una sola vez en el resumen.

| Grupo | Archivos | Motivo |
|---|---|---|
| Anuncios con descuentos | `19.06.2024 POST PROMOCION`, `8 BIT Y SIN INCRUSTAR`, `POST DIA DE LA MADRE 2`, `PORTADA 2–5`, `IG - PAQ TERAPIA FISICA 1–2`, `WhatsApp 2026-08-17`, `WhatsApp 2026-08-18 (×2)` | Descuentos vencidos (junio, mayo, agosto) o no autorizados; teléfonos y nombre de profesional impresos |
| Fotos con personas en el consultorio | `ALMAE 10`, `WhatsApp 2026-08-10 (×3)`, `WhatsApp 2026-08-12 (×2)` | Personas identificables sin autorización documentada |
| Imágenes generadas | `ChatGPT Image 12 ago 2026`, `ChatGPT Image 17 ago 2026`, `Consultorio ALMAE limpio y luminoso.png`, `Retrato ejecutivo…`, `FISIOTERAPEUTA IMAGEN` | Ver sección 2 |
| Frases y motivacionales | `IG - FRASE 1`, `IG - FRASE 2` | Sin uso definido |
| Logotipos | `Almae (Blanco) (×2)`, `Almae (Negro)`, `LOGO`, `LOGO-removebg-preview`, `WhatsApp 2026-05-31` | Fuente de los logotipos ya incorporados; no se publican directamente |

---

## 5. Resumen

| Estado | Cantidad |
|---|---|
| CONFIRMADA | 17 (9 PNG de logotipo/favicon, `apple-touch-icon`, `favicon.ico`, 5 SVG de servicios, `placeholder.svg`) |
| PENDIENTE | 6 ya publicadas (hero, consultorio-luminoso, 4 de galería) + 1 copia recortada pendiente de decisión |
| EXCLUIDA | 4 renders del consultorio + 9 gráficas de servicios + 1 retrato de la profesional + `ambiente-almae.jpg` + `atencion-profesional.jpg` (repositorio) + 31 de la raíz no designadas (que incluyen 5 ya citadas: el duplicado del consultorio y el retrato) |

**Acción inmediata pendiente:** no sustituir las fotografías del consultorio, de servicios ni de la profesional sin las decisiones indicadas en `docs/CHECKLIST_PUBLICACION.md`.

---

## 6. Decisiones del responsable (aplicadas)

| Foto | Decisi�n | D�nde est� ahora |
|---|---|---|
| `Imagenes\Consultorio ALMAE limpio y luminoso.png` | Reemplaza la foto anterior de �Nosotros� (con el cartel de un tercero) | `assets/images/consultorio/consultorio-limpio-luminoso.jpg` (copia optimizada, 1086�1448) |
| `Imagenes\CONSULTORIO\` (4 archivos) | Galer�a �Conoce nuestro consultorio� | `assets/images/consultorio/consultorio-limpio-luminoso.jpg` y `assets/images/galeria/consultorio-galeria-1..3.jpg` |
| `Imagenes\Servicios\` (9 archivos) | Im�genes de las tarjetas de servicios | `assets/images/servicios-fotos/*.jpg` (ver mapa abajo) |
| Precios de reflexolog�a (S/ 60 consultorio, S/ 70 domicilio) | Confirmados | `data/config.js` ? `ALMAE_TARIFAS.reflexologia` |
| `Imagenes\Retrato ejecutivo de la directora�` | Presentaci�n de la profesional; la profesional autoriza su uso | `assets/images/profesional/directora-almae.jpg`, secci�n �Nosotros� |

Las copias son derivadas de los originales, que no se han modificado.

**Mapa de servicios ? im�genes:** rehabilitaci�n (7 servicios) ? terapia f�sica en consultorio, excepto terapia f�sica (fisioterapia a domicilio); masoterapia y masaje descontracturante ? masaje antiestr�s consultorio; antiestr�s 60 min ? consultorio; antiestr�s 90 min ? domicilio; reductor ? reductor consultorio; reflexolog�a ? reflexolog�a consultorio; acupuntura, punci�n seca y tendinitis ? gr�fica general; magnetoterapia, ultrasonido, electroterapia y l�ser ? terapia f�sica consultorio.

**Riesgo abierto:** varias gr�ficas muestran precios de otro servicio (p. ej. �Terapia f�sica S/ 50� en magnetoterapia o l�ser). Pendiente de decisi�n.

**Riesgo abierto:** el texto de la galer�a dice �Ambiente real�. Las cuatro im�genes de la galer�a son renders generados por IA. Pendiente de decisi�n sobre el texto.

**Fotos sin uso tras el cambio** (copias en `assets/`, pendientes de eliminar si confirmas): `consultorio/consultorio-luminoso.jpg`, `galeria/consultorio-vista-amplia.jpg`, `galeria/ventana-camilla.jpg`, `galeria/estanteria-equipo.jpg`, `galeria/letrero-almae.jpg`, `servicios/*.svg` (5).
