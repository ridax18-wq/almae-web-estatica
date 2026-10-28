# Pruebas automatizadas de la web ALMAE

Las pruebas viven en la carpeta `tests\`. No forman parte de la web publicada.

Comprueban el funcionamiento real en el navegador (Microsoft Edge), incluidos el formulario de reservas, la configuración, las promociones, las tarifas, el diseño adaptable, la privacidad y el SEO.

---

## 1. Requisitos (una sola vez)

- **Node.js** 18 o superior (`node --version`).
- **Microsoft Edge** instalado (o Google Chrome).
- Dependencias de las pruebas, dentro de `tests\`:

```powershell
cd D:\ALMAE\tests
npm install
```

Esto instala `puppeteer-core` (automatización del navegador) y `lighthouse` (auditoría de rendimiento). No instala nada en la web publicada.

Si Edge no está en la ruta habitual, indícala con la variable `CHROME_PATH`:

```powershell
$env:CHROME_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

---

## 2. Arrancar el servidor local

En **otra ventana** de PowerShell, desde la raíz del proyecto:

```powershell
cd D:\ALMAE
python -m http.server 8765
```

Deja esa ventana abierta mientras pruebas. Para detenerlo: `Ctrl + C`.

---

## 3. Ejecutar todas las pruebas

En la carpeta `tests\`:

```powershell
node run-all.js
```

Por defecto usa `http://127.0.0.1:8765`. Para otra dirección (por ejemplo, la versión publicada o un subdirectorio):

```powershell
node run-all.js https://USUARIO.github.io/almae-web-estatica
```

El resultado final muestra `Suites con fallos: 0` cuando todo está correcto.

---

## 4. Suites individuales

| Archivo | Qué comprueba | Pruebas |
|---|---|---|
| `booking-test.js` | Formulario de reservas: validaciones, modalidades, tarifas, resumen, enlace WhatsApp, datos conservados, almacenamiento, diseño básico | 24 |
| `hito5-test.js` | Configuración centralizada, servicios activos/inactivos, tarifas, promociones y vigencias, imágenes y placeholder, WhatsApp único, consentimiento, persistencia, Supabase, exclusiones de Git, diseño | 20 |
| `reservas-popup.js` | Ventana de WhatsApp **bloqueada** (alternativa visible y accesible) y **permitida** | 12 |
| `responsive-audit.js` | Resoluciones 390, 820, 1024 y 1440 px: desbordes, tamaños de texto, áreas táctiles, imágenes, menú, lightbox. Genera capturas | 38 |
| `seo-privacidad-audit.js` | Metadatos, encabezados, imágenes, datos estructurados, textos seguros frente a inyección de HTML, archivos publicables, credenciales, almacenamiento | 23 |
| `catalogo-test.js` | Catálogo de 19 servicios: identificadores únicos, categorías, tarifas enlazadas, imágenes referenciales, servicios sin foto con espacio neutro | 24 |

Total: **141 pruebas** (24 + 20 + 12 + 38 + 23 + 24). `node run-all.js` ejecuta las seis en ese orden.

Ejecutar una sola:

```powershell
node booking-test.js
```

---

## 5. Pruebas de datos sin modificar la web

Las pruebas que simulan cambios (tarifa distinta, servicio oculto, promoción vencida, WhatsApp de otro número, imagen inexistente) **no modifican los archivos reales**. Interceptan la carga de `data\*.js` en el navegador y añaden la modificación solo en memoria. Así se verifica que un cambio en esos archivos se refleja en la web, sin tocar los datos reales.

---

## 6. Capturas

Las pruebas guardan capturas en `tests\.capturas\`. Esa carpeta está **excluida de Git** porque las capturas pueden contener datos de prueba. Para cambiar la carpeta de destino:

```powershell
$env:ALMAE_SHOTS = "C:\Ruta\Capturas"
```

No incorpores capturas con datos de personas reales en el repositorio.

---

## 7. Interpretar resultados

- `PASS`: la comprobación se cumple.
- `FAIL`: revisar el detalle que aparece a la derecha. No publicar hasta corregirlo.
- `PENDIENTE` (solo en la auditoría SEO/privacidad): no es un fallo. Indica datos o decisiones que faltan, por ejemplo la URL definitiva o los marcadores legales del aviso de privacidad.

---

## 8. Cuándo ejecutar las pruebas

- Antes de cada publicación (obligatorio).
- Después de cambiar la configuración o el formulario.
- Después de publicar, contra la URL real (ver `docs/CHECKLIST_PUBLICACION.md`, sección 5).

---

## 9. Límites conocidos

- Las pruebas usan **Microsoft Edge** (Chromium). Firefox y Safari no están cubiertos.
- La vigencia de promociones se prueba con fechas fijas (2000 y 2099). La zona horaria de Lima se verifica en el código, no con un reloj simulado.
- La prueba de ventana bloqueada **simula** el bloqueo del navegador; no reproduce la configuración de cada usuario.
- La auditoría de rendimiento (Lighthouse) depende de la máquina en que se ejecuta. Compara tendencias, no cifras absolutas.
