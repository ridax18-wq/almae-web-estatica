# Inventario de fotografÃ­as y activos visuales

Fecha de revisiÃ³n: Hito 7 (preparaciÃ³n). RevisiÃ³n visual de cada archivo; no hay metadatos EXIF ni marcas de procedencia en ninguna imagen de `Imagenes\`, por lo que el origen se valora por apariencia.

Estados:

- **CONFIRMADA**: uso permitido segÃºn la documentaciÃ³n disponible.
- **PENDIENTE**: puede usarse cuando se complete la verificaciÃ³n indicada.
- **EXCLUIDA**: no se publica en su estado actual.

---

## 1. Activos ya incorporados en el repositorio (`assets\`)

| Archivo | Contenido | RevisiÃ³n | Estado |
|---|---|---|---|
| `assets/images/hero/consultorio-hero.jpg` | Vista del consultorio, sin personas | Sin marcas de terceros visibles | PENDIENTE: confirmar titularidad o licencia de la foto |
| `assets/images/consultorio/consultorio-luminoso.jpg` | Vista del consultorio con cartel Â«SE VENDEÂ» y telÃ©fono de un tercero al fondo | Sin personas | PENDIENTE: decidir entre recorte (copia preparada, ver secciÃ³n 3) o retirada |
| `assets/images/galeria/consultorio-vista-amplia.jpg` | Recorte de la foto ALMAE 10 | Sin personas (recorte verificado) | PENDIENTE: titularidad de la foto de origen |
| `assets/images/galeria/ventana-camilla.jpg` | Recorte de la foto ALMAE 10 | Sin personas | PENDIENTE: titularidad de la foto de origen |
| `assets/images/galeria/estanteria-equipo.jpg` | Recorte de la foto ALMAE 10 | Sin personas | PENDIENTE: titularidad de la foto de origen |
| `assets/images/galeria/letrero-almae.jpg` | Recorte del letrero luminoso | Sin personas | PENDIENTE: titularidad de la foto de origen |
| `assets/images/logo/*.png`, `assets/apple-touch-icon.png`, `favicon.ico` | Logotipo institucional e iconos | Sin personas | CONFIRMADA (identidad de marca) |
| `assets/images/servicios/*.svg` (5) | Ilustraciones vectoriales propias del proyecto | Sin personas ni texto de precios | CONFIRMADA |
| `assets/images/placeholder.svg` | Marcador para imÃ¡genes ausentes | Propio del proyecto | CONFIRMADA |

**Nota sobre la galerÃ­a:** los cuatro recortes proceden de la fotografÃ­a `ALMAE 10`, que sÃ­ contiene una persona. Los recortes no la incluyen, pero la titularidad de la foto de origen debe confirmarse igualmente.

---

## 2. FotografÃ­as indicadas para integraciÃ³n (`Imagenes\`) â€” revisiÃ³n solicitada

### 2.1 Carpeta `Imagenes\CONSULTORIO\`

| Archivo | RevisiÃ³n visual | Estado |
|---|---|---|
| `Consultorio ALMAE limpio y luminoso.png` | Render de consultorio con logotipo sobre la pared, iluminaciÃ³n uniforme y mobiliario idealizado. Mismo archivo que la copia de la raÃ­z (hash idÃ©ntico). | **EXCLUIDA** para presentarla como fotografÃ­a del consultorio |
| `Imagen de ChatGPT 28 oct 2026, 09_12_18.png` | Mismo espacio, distinto encuadre, mismo estilo | **EXCLUIDA** |
| `Imagen de ChatGPT 28 oct 2026, 09_12_28.png` | Vista de camilla y estanterÃ­a | **EXCLUIDA** |
| `Imagen de ChatGPT 28 oct 2026, 09_12_35.png` | Vista de camilla desde otro Ã¡ngulo | **EXCLUIDA** |

**Motivo:** el nombre de archivo indica generaciÃ³n con ChatGPT y las cuatro imÃ¡genes presentan rasgos de render (texturas uniformes, luz sin fuente visible, mobiliario sin uso real, logotipo integrado en la pared). La especificaciÃ³n del proyecto prohÃ­be Â«presentar imÃ¡genes generadas por IA como fotografÃ­as del consultorioÂ». Ver secciÃ³n 4.

### 2.2 Carpeta `Imagenes\Servicios\`

| Archivo | Servicio asociado | Problemas detectados | Estado |
|---|---|---|---|
| `ALMAE_ terapia y bienestar profesional.png` | General | Personas generadas; texto publicitario | **EXCLUIDA** |
| `Fisioterapia a domicilio personalizada.png` | Fisioterapia y rehabilitaciÃ³n (domicilio) | Personas generadas; sin precio | **EXCLUIDA** |
| `Masaje antiestrÃ©s a domicilio.png` | Masaje antiestrÃ©s 60/90 min (domicilio) | Personas generadas; **precios impresos** (S/ 120 y S/ 150) | **EXCLUIDA** |
| `Masaje antiestrÃ©s en consultorio.png` | Masaje antiestrÃ©s 60/90 min (consultorio) | Personas generadas; **precios impresos** (S/ 70 y S/ 90) | **EXCLUIDA** |
| `Masaje estÃ©tico reductor a domicilio.png` | Masaje reductor 90 min (domicilio) | Personas generadas; **precio impreso** (S/ 200) | **EXCLUIDA** |
| `Masaje estÃ©tico reductor en consultorio.png` | Masaje reductor 90 min (consultorio) | Personas generadas; **precio impreso** (S/ 150) | **EXCLUIDA** |
| `ReflexologÃ­a podal y facial a domicilio.png` | ReflexologÃ­a (sin tarifa en `config.js`) | Personas generadas; **precio impreso no confirmado** (S/ 70) | **EXCLUIDA** |
| `ReflexologÃ­a podal y facial en consultorio.png` | ReflexologÃ­a (sin tarifa en `config.js`) | Personas generadas; **precio impreso no confirmado** (S/ 60) | **EXCLUIDA** |
| `Terapia fÃ­sica y rehabilitaciÃ³n en ALMAE.png` | Terapia fÃ­sica (consultorio) | Personas generadas; **precio impreso** (S/ 50) | **EXCLUIDA** |

**Coincidencia de precios con `config.js`:** los precios de masaje antiestrÃ©s, masaje reductor y terapia fÃ­sica coinciden con las tarifas confirmadas. **Los precios de reflexologÃ­a no existen en `config.js`** y no pueden publicarse hasta que estÃ©n confirmados.

**Regla aplicada:** los precios de las imÃ¡genes no se usan. Las tarifas solo se muestran desde `config.js`, para no duplicarlas.

### 2.3 PresentaciÃ³n de la profesional â€” `Imagenes\Retrato ejecutivo de la directora de Almae.png`

| Aspecto | Hallazgo | Estado |
|---|---|---|
| Persona identificable | SÃ­, primer plano | Requiere autorizaciÃ³n escrita |
| Origen | IluminaciÃ³n, muro de madera y rÃ³tulo idÃ©nticos a los renders de `CONSULTORIO\`. Posible imagen generada | Requiere confirmar que es una fotografÃ­a real |
| Identidad profesional | Cargo Â«directoraÂ» indicado por el nombre de archivo | No validado; el nombre y las credenciales no estÃ¡n confirmados |
| Otros archivos de la misma profesional | `FISIOTERAPEUTA IMAGEN.jpeg` y `ChatGPT Image 12 ago 2026` (carpeta raÃ­z) muestran a una persona similar | No revisados en detalle; sin estado |

**Estado global: EXCLUIDA** hasta cumplir los tres requisitos: origen real confirmado, autorizaciÃ³n escrita de la persona retratada, y datos profesionales validados.

---

## 3. Copia preparada: consultorio-luminoso.jpg recortado

- UbicaciÃ³n: `%TEMP%\opencode\revision-foto\consultorio-luminoso-recortada.jpg`
- Dimensiones: 1200 Ã— 1270 (original 1200 Ã— 1600)
- MÃ©todo: recorte de los primeros 330 px. Elimina el cartel Â«SE VENDEÂ» y el telÃ©fono de un tercero.
- VerificaciÃ³n visual: cartel ausente en la copia; ningÃºn fragmento visible.
- **No estÃ¡ integrada.** El original permanece sin cambios.
- Para integrarla, habrÃ­a que actualizar `width`/`height` de la imagen (`data/config.js`, `imagenes.nosotros`) y revisar la maquetaciÃ³n de la secciÃ³n Â«NosotrosÂ».

---

## 4. Carpeta raÃ­z de `Imagenes\` â€” no designada

31 archivos. Ninguno estÃ¡ en el alcance de publicaciÃ³n. Algunos aparecen tambiÃ©n en la secciÃ³n 2 (el duplicado del consultorio y el retrato); se cuentan una sola vez en el resumen.

| Grupo | Archivos | Motivo |
|---|---|---|
| Anuncios con descuentos | `19.06.2024 POST PROMOCION`, `8 BIT Y SIN INCRUSTAR`, `POST DIA DE LA MADRE 2`, `PORTADA 2â€“5`, `IG - PAQ TERAPIA FISICA 1â€“2`, `WhatsApp 2026-08-17`, `WhatsApp 2026-08-18 (Ã—2)` | Descuentos vencidos (junio, mayo, agosto) o no autorizados; telÃ©fonos y nombre de profesional impresos |
| Fotos con personas en el consultorio | `ALMAE 10`, `WhatsApp 2026-08-10 (Ã—3)`, `WhatsApp 2026-08-12 (Ã—2)` | Personas identificables sin autorizaciÃ³n documentada |
| ImÃ¡genes generadas | `ChatGPT Image 12 ago 2026`, `ChatGPT Image 17 ago 2026`, `Consultorio ALMAE limpio y luminoso.png`, `Retrato ejecutivoâ€¦`, `FISIOTERAPEUTA IMAGEN` | Ver secciÃ³n 2 |
| Frases y motivacionales | `IG - FRASE 1`, `IG - FRASE 2` | Sin uso definido |
| Logotipos | `Almae (Blanco) (Ã—2)`, `Almae (Negro)`, `LOGO`, `LOGO-removebg-preview`, `WhatsApp 2026-05-31` | Fuente de los logotipos ya incorporados; no se publican directamente |

---

## 5. Resumen

| Estado | Cantidad |
|---|---|
| CONFIRMADA | 17 (9 PNG de logotipo/favicon, `apple-touch-icon`, `favicon.ico`, 5 SVG de servicios, `placeholder.svg`) |
| PENDIENTE | 6 ya publicadas (hero, consultorio-luminoso, 4 de galerÃ­a) + 1 copia recortada pendiente de decisiÃ³n |
| EXCLUIDA | 4 renders del consultorio + 9 grÃ¡ficas de servicios + 1 retrato de la profesional + `ambiente-almae.jpg` + `atencion-profesional.jpg` (repositorio) + 31 de la raÃ­z no designadas (que incluyen 5 ya citadas: el duplicado del consultorio y el retrato) |

**AcciÃ³n inmediata pendiente:** no sustituir las fotografÃ­as del consultorio, de servicios ni de la profesional sin las decisiones indicadas en `docs/CHECKLIST_PUBLICACION.md`.

---

## 6. Decisiones del responsable (aplicadas)

| Foto | Decisión | Dónde está ahora |
|---|---|---|
| `Imagenes\Consultorio ALMAE limpio y luminoso.png` | Reemplaza la foto anterior de «Nosotros» (con el cartel de un tercero) | `assets/images/consultorio/consultorio-limpio-luminoso.jpg` (copia optimizada, 1086×1448) |
| `Imagenes\CONSULTORIO\` (4 archivos) | Galería «Conoce nuestro consultorio» | `assets/images/consultorio/consultorio-limpio-luminoso.jpg` y `assets/images/galeria/consultorio-galeria-1..3.jpg` |
| `Imagenes\Servicios\` (9 archivos) | Imágenes de las tarjetas de servicios | `assets/images/servicios-fotos/*.jpg` (ver mapa abajo) |
| Precios de reflexología (S/ 60 consultorio, S/ 70 domicilio) | Confirmados | `data/config.js` ? `ALMAE_TARIFAS.reflexologia` |
| `Imagenes\Retrato ejecutivo de la directora…` | Presentación de la profesional; la profesional autoriza su uso | `assets/images/profesional/directora-almae.jpg`, sección «Nosotros» |

Las copias son derivadas de los originales, que no se han modificado.

**Mapa de servicios ? imágenes:** rehabilitación (7 servicios) ? terapia física en consultorio, excepto terapia física (fisioterapia a domicilio); masoterapia y masaje descontracturante ? masaje antiestrés consultorio; antiestrés 60 min ? consultorio; antiestrés 90 min ? domicilio; reductor ? reductor consultorio; reflexología ? reflexología consultorio; acupuntura, punción seca y tendinitis ? gráfica general; magnetoterapia, ultrasonido, electroterapia y láser ? terapia física consultorio.

**Riesgo abierto:** varias gráficas muestran precios de otro servicio (p. ej. «Terapia física S/ 50» en magnetoterapia o láser). Pendiente de decisión.

**Riesgo abierto:** el texto de la galería dice «Ambiente real». Las cuatro imágenes de la galería son renders generados por IA. Pendiente de decisión sobre el texto.

**Fotos sin uso tras el cambio** (copias en `assets/`, pendientes de eliminar si confirmas): `consultorio/consultorio-luminoso.jpg`, `galeria/consultorio-vista-amplia.jpg`, `galeria/ventana-camilla.jpg`, `galeria/estanteria-equipo.jpg`, `galeria/letrero-almae.jpg`, `servicios/*.svg` (5).

---

## 7. Inventario de publicación (Hito 7)

Estado a la fecha de `3c1764a`. Hay 21 archivos de imagen versionados: 9 fotografías o gráficas y 12 archivos de marca, iconos y placeholder.

### 7.1 Fotografías y gráficas

| Archivo | Contenido | Origen | Estado de autorización | Presentación |
|---|---|---|---|---|
| `assets/images/hero/consultorio-hero.jpg` | Consultorio | Material propio o autorizado (confirmado por el responsable) | **Confirmada** | Portada |
| `assets/images/consultorio/consultorio-limpio-luminoso.jpg` | Consultorio | Render generado con IA | **Confirmada como referencial** | «Nosotros» y galería; alt indica «imagen referencial» |
| `assets/images/galeria/consultorio-galeria-1.jpg` | Consultorio | Render generado con IA | **Confirmada como referencial** | Galería; sección con aclaración visible |
| `assets/images/galeria/consultorio-galeria-2.jpg` | Consultorio | Render generado con IA | **Confirmada como referencial** | Galería |
| `assets/images/galeria/consultorio-galeria-3.jpg` | Consultorio | Render generado con IA | **Confirmada como referencial** | Galería |
| `assets/images/profesional/directora-almae.jpg` | Leonor Morán René | Fotografía de la profesional | **Confirmada**: autorización de la profesional registrada | Presentación en «Nosotros» |
| `assets/images/servicios-fotos/fisioterapia-domicilio.jpg` | Terapia física y rehabilitación | Gráfica generada con IA | **Pendiente de confirmación escrita** de uso | Tarjeta de terapia física |
| `assets/images/servicios-fotos/reductor-consultorio.jpg` | Masaje estético reductor | Gráfica generada con IA | **Pendiente de confirmación escrita** de uso | Tarjeta de masaje reductor |
| `assets/images/servicios-fotos/reflexologia-consultorio.jpg` | Reflexología | Gráfica generada con IA | **Pendiente de confirmación escrita** de uso | Tarjeta de reflexología |

**Observación:** las tres gráficas de servicios muestran personas generadas y precios impresos. Los precios coinciden con `config.js`. Su uso fue aprobado por el responsable en la fase anterior, pero no está restablecido por escrito en esta fase. Se recomienda confirmarlo por escrito y añadir la aclaración «imagen referencial» en las tarjetas.

### 7.2 Marca, iconos y placeholder

| Archivo | Estado |
|---|---|
| `assets/images/logo/almae-logo-dark.png`, `almae-logo-light.png`, `almae-mark-light.png` | **Confirmada** (identidad de marca) |
| `assets/images/logo/favicon-16`, `-32`, `-48`, `-64`, `-180`, `-512` (`.png`) | **Confirmada** (derivados del logotipo) |
| `assets/apple-touch-icon.png`, `favicon.ico` | **Confirmada** |
| `assets/images/placeholder.svg` | **Confirmada** (propio del proyecto) |

### 7.3 Excluidas de la publicación

- Fotografías del local con cartel de terceros, retiradas (en `%TEMP%\opencode\assets-retirados-hito7`).
- Fotografías de galería derivadas de la fotografía con persona identificable, retiradas.
- Pictogramas SVG de servicios, retirados.
- Toda la carpeta `Imagenes\` (originales, sin modificar).
