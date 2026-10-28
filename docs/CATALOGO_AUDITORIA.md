# Auditoría del catálogo de servicios

Generado a partir de `data/servicios.js` y `tests/catalogo-test.js`.

## Resumen

- Servicios únicos: **20** (IDs y nombres únicos; 0 duplicados exactos).
- Imágenes validadas: **3**. Pendientes de fotografía: **17**.
- Servicios reservables: **20** (todos conservan «Solicitar cita»).
- Tarifas: sin cambios respecto a la versión verificada, más la reflexología confirmada (S/ 60 consultorio, S/ 70 domicilio).

## Posibles duplicados (no fusionados; requieren decisión)

1. **fisioterapia-rehabilitacion** y **terapia-fisica**: describen en lo esencial la misma terapia física. Solo `terapia-fisica` tiene tarifa asociada (S/ 50 / S/ 80). Propuesta: fusionar en uno, conservando la tarifa. No se ha hecho hasta que confirmes que es el mismo tratamiento.
2. **masoterapia** y **masajes-descontracturantes**: técnicas manuales con finalidad parecida. Pendiente de decisión.

No se ha eliminado ningún tratamiento clínicamente distinto.

## Auditoría por servicio

| Servicio | Categoría | Imagen actual | Imagen correcta | Estado |
|---|---|---|---|---|
| Fisioterapia y rehabilitación (`fisioterapia-rehabilitacion`) | Rehabilitación y terapia física | — (sin imagen) | No — Imagen actual mostraba «Terapia física S/ 50» (otro servicio) | Pendiente |
| Terapia física (`terapia-fisica`) | Rehabilitación y terapia física | servicios-fotos/fisioterapia-domicilio.jpg | Sí | Validado |
| Rehabilitación lumbar y cervical (`rehabilitacion-lumbar-cervical`) | Rehabilitación y terapia física | — (sin imagen) | No — Imagen actual era de terapia física (otro tratamiento) | Pendiente |
| Rehabilitación de rodilla, hombro y cadera (`rehabilitacion-articulaciones`) | Rehabilitación y terapia física | — (sin imagen) | No — Imagen actual era de terapia física (otro tratamiento) | Pendiente |
| Rehabilitación postoperatoria (`rehabilitacion-postoperatoria`) | Rehabilitación y terapia física | — (sin imagen) | No — Imagen actual era de terapia física (otro tratamiento) | Pendiente |
| Rehabilitación deportiva (`rehabilitacion-deportiva`) | Rehabilitación y terapia física | — (sin imagen) | No — Imagen actual era de terapia física (otro tratamiento) | Pendiente |
| Ejercicios terapéuticos (`ejercicios-terapeuticos`) | Rehabilitación y terapia física | — (sin imagen) | No — Imagen actual era de terapia física (otro tratamiento) | Pendiente |
| Masoterapia (`masoterapia`) | Masajes y bienestar | — (sin imagen) | No — Imagen actual era de masaje antiestrés (otro tratamiento) | Pendiente |
| Masajes descontracturantes (`masajes-descontracturantes`) | Masajes y bienestar | — (sin imagen) | No — Imagen actual era de masaje antiestrés (otro tratamiento) | Pendiente |
| Masaje antiestrés — 60 minutos (`masaje-antiestres-60`) | Masajes y bienestar | — (sin imagen) | No — Imagen contiene también el precio de 90 min (otro servicio) | Pendiente |
| Masaje antiestrés — 90 minutos (`masaje-antiestres-90`) | Masajes y bienestar | — (sin imagen) | No — Imagen contiene precios de 60 min (otro servicio) | Pendiente |
| Masaje estético reductor (`masaje-estetico-reductor`) | Masajes y bienestar | servicios-fotos/reductor-consultorio.jpg | Sí | Validado |
| Reflexología facial y podal (`reflexologia`) | Masajes y bienestar | servicios-fotos/reflexologia-consultorio.jpg | Sí | Validado |
| Acupuntura (`acupuntura`) | Técnicas especializadas | — (sin imagen) | No — Imagen general de la marca, no muestra acupuntura | Pendiente |
| Punción seca (`puncion-seca`) | Técnicas especializadas | — (sin imagen) | No — Imagen general de la marca, no muestra punción seca | Pendiente |
| Atención de tendinitis (`tendinitis`) | Técnicas especializadas | — (sin imagen) | No — Imagen general de la marca, no muestra tratamiento de tendinitis | Pendiente |
| Magnetoterapia (`magnetoterapia`) | Tecnología terapéutica | — (sin imagen) | No — Imagen de terapia física (otro tratamiento) | Pendiente |
| Ultrasonido terapéutico (`ultrasonido`) | Tecnología terapéutica | — (sin imagen) | No — Imagen de terapia física (otro tratamiento) | Pendiente |
| Electroterapia (`electroterapia`) | Tecnología terapéutica | — (sin imagen) | No — Imagen de terapia física (otro tratamiento) | Pendiente |
| Láser terapéutico (`laser`) | Tecnología terapéutica | — (sin imagen) | No — Imagen de terapia física (otro tratamiento) | Pendiente |

## Imágenes pendientes de preparar

- Fisioterapia y rehabilitación (`fisioterapia-rehabilitacion`)
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

- Gráficas de servicios con precios de otros tratamientos (`Imagenes\Servicios\`): masaje antiestrés (60 y 90 min) con precios cruzados; terapia física consultorio (S/ 50) usada para otros tratamientos; gráfica general para acupuntura, punción seca y tendinitis.
- Renders generados por IA: no se usan como sustituto automático.
- Fotografía anterior de consultorio con cartel de terceros: retirada.
