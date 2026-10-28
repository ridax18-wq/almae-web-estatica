# Auditoría del catálogo de servicios

Generado a partir de `data/servicios.js` (versión del Hito 7, ajustes finales).

## Resumen

- Servicios únicos: **19**. IDs y nombres únicos; sin duplicados.
- Imágenes validadas: **3**. Pendientes de fotografía: **16**.
- Servicios reservables: **19** (todos conservan «Solicitar cita», con o sin imagen).
- Tarifas: confirmadas. Terapia física y rehabilitación (S/ 50 / S/ 80), masajes antiestrés (60 y 90 min), masaje estético reductor (S/ 150 / S/ 200) y reflexología (S/ 60 / S/ 70).

## Cambios de esta revisión

1. **Consolidado:** `fisioterapia-rehabilitacion` y `terapia-fisica` pasan a ser un único servicio, **Terapia física y rehabilitación** (`terapia-fisica`). Conserva la tarifa confirmada S/ 50 consultorio y S/ 80 domicilio. Ya no existe `fisioterapia-rehabilitacion`.
2. **Mantenidos separados:** `masoterapia` y `masajes-descontracturantes`.
   - *Masoterapia*: técnicas manuales con finalidad terapéutica, indicadas tras la valoración del profesional para molestias musculares y articulares.
   - *Masajes descontracturantes*: masaje localizado en zonas puntuales de tensión y contractura; para alivio de molestias de tensión, sin reemplazar un tratamiento indicado.
   Son tratamientos distintos en finalidad y en indicación. Se conservan ambos.

## Auditoría por servicio

| Servicio | Categoría | Imagen actual | Imagen correcta | Estado |
|---|---|---|---|---|
| Terapia física y rehabilitación (`terapia-fisica`) | Rehabilitación y terapia física | servicios-fotos/fisioterapia-domicilio.jpg | Sí | Validado |
| Rehabilitación lumbar y cervical (`rehabilitacion-lumbar-cervical`) | Rehabilitación y terapia física | — (sin imagen) | No — Sin fotografía apropiada; la gráfica disponible muestra terapia física (otro tratamiento) | Pendiente |
| Rehabilitación de rodilla, hombro y cadera (`rehabilitacion-articulaciones`) | Rehabilitación y terapia física | — (sin imagen) | No — Sin fotografía apropiada; la gráfica disponible muestra terapia física (otro tratamiento) | Pendiente |
| Rehabilitación postoperatoria (`rehabilitacion-postoperatoria`) | Rehabilitación y terapia física | — (sin imagen) | No — Sin fotografía apropiada; la gráfica disponible muestra terapia física (otro tratamiento) | Pendiente |
| Rehabilitación deportiva (`rehabilitacion-deportiva`) | Rehabilitación y terapia física | — (sin imagen) | No — Sin fotografía apropiada; la gráfica disponible muestra terapia física (otro tratamiento) | Pendiente |
| Ejercicios terapéuticos (`ejercicios-terapeuticos`) | Rehabilitación y terapia física | — (sin imagen) | No — Sin fotografía apropiada; la gráfica disponible muestra terapia física (otro tratamiento) | Pendiente |
| Masoterapia (`masoterapia`) | Masajes y bienestar | — (sin imagen) | No — Sin fotografía apropiada; la gráfica de masaje antiestrés muestra otro tratamiento y precios ajenos | Pendiente |
| Masajes descontracturantes (`masajes-descontracturantes`) | Masajes y bienestar | — (sin imagen) | No — Sin fotografía apropiada; la gráfica de masaje antiestrés muestra otro tratamiento y precios ajenos | Pendiente |
| Masaje antiestrés — 60 minutos (`masaje-antiestres-60`) | Masajes y bienestar | — (sin imagen) | No — La gráfica disponible incluye también el precio de 90 min (otro servicio) | Pendiente |
| Masaje antiestrés — 90 minutos (`masaje-antiestres-90`) | Masajes y bienestar | — (sin imagen) | No — La gráfica disponible incluye precios de 60 min (otro servicio) | Pendiente |
| Masaje estético reductor (`masaje-estetico-reductor`) | Masajes y bienestar | servicios-fotos/reductor-consultorio.jpg | Sí | Validado |
| Reflexología facial y podal (`reflexologia`) | Masajes y bienestar | servicios-fotos/reflexologia-consultorio.jpg | Sí | Validado |
| Acupuntura (`acupuntura`) | Técnicas especializadas | — (sin imagen) | No — Sin fotografía apropiada; la gráfica general de la marca no muestra acupuntura | Pendiente |
| Punción seca (`puncion-seca`) | Técnicas especializadas | — (sin imagen) | No — Sin fotografía apropiada; la gráfica general de la marca no muestra punción seca | Pendiente |
| Atención de tendinitis (`tendinitis`) | Técnicas especializadas | — (sin imagen) | No — Sin fotografía apropiada; la gráfica general de la marca no muestra este tratamiento | Pendiente |
| Magnetoterapia (`magnetoterapia`) | Tecnología terapéutica | — (sin imagen) | No — Sin fotografía apropiada; la gráfica disponible muestra terapia física (otro tratamiento) | Pendiente |
| Ultrasonido terapéutico (`ultrasonido`) | Tecnología terapéutica | — (sin imagen) | No — Sin fotografía apropiada; la gráfica disponible muestra terapia física (otro tratamiento) | Pendiente |
| Electroterapia (`electroterapia`) | Tecnología terapéutica | — (sin imagen) | No — Sin fotografía apropiada; la gráfica disponible muestra terapia física (otro tratamiento) | Pendiente |
| Láser terapéutico (`laser`) | Tecnología terapéutica | — (sin imagen) | No — Sin fotografía apropiada; la gráfica disponible muestra terapia física (otro tratamiento) | Pendiente |

## Imágenes pendientes de preparar (16)

- Rehabilitación lumbar y cervical (`rehabilitacion-lumbar-cervical`)
- Rehabilitación de rodilla, hombro y cadera (`rehabilitacion-articulaciones`)
- Rehabilitación postoperatoria (`rehabilitacion-postoperatoria`)
- Rehabilitación deportiva (`rehabilitacion-deportiva`)
- Ejercicios terapéuticos (`ejercicios-terapeuticos`)
- Masoterapia (`masoterapia`)
- Masajes descontracturantes (`masajes-descontracturantes`)
- Masaje antiestrés — 60 minutos (`masaje-antiestres-60`)
- Masaje antiestrés — 90 minutos (`masaje-antiestres-90`)
- Acupuntura (`acupuntura`)
- Punción seca (`puncion-seca`)
- Atención de tendinitis (`tendinitis`)
- Magnetoterapia (`magnetoterapia`)
- Ultrasonido terapéutico (`ultrasonido`)
- Electroterapia (`electroterapia`)
- Láser terapéutico (`laser`)

Para cada pendiente: una fotografía o gráfica que muestre ese tratamiento concreto y no incluya precios de otros servicios. Si se acepta una gráfica con precio, debe coincidir con la tarifa de ese servicio en `data/config.js`.

## Imágenes descartadas

- Gráficas de masaje antiestrés (60 y 90 min): precios cruzados entre duraciones.
- Gráficas de terapia física usadas para rehabilitación, magnetoterapia, ultrasonido, electroterapia y láser: son otro tratamiento.
- Gráfica general de la marca para acupuntura, punción seca y tendinitis: no muestra esos tratamientos.
- Renders generados por IA: no se usan como sustituto automático de fotografías de servicios.
- Fotografía anterior de consultorio con cartel de terceros: retirada de la publicación.
