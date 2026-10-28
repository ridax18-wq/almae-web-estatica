/**
 * ALMAE – Catálogo de servicios
 *
 * Los precios NO se escriben aquí: se referencian con tarifaId hacia
 * ALMAE_TARIFAS en data/config.js. Nunca dupliques precios.
 *
 * Campos de cada servicio:
 * - id:         identificador único y estable (no cambiarlo si ya se usa).
 * - nombre:     nombre comercial del servicio.
 * - categoria:  id de una categoría de ALMAE_CATEGORIAS.
 * - imagen:     ruta relativa dentro de assets/images/ (si no existe, se
 *               muestra un placeholder automático).
 * - descripcion / beneficios: textos comerciales.
 * - tarifaId:   clave en ALMAE_TARIFAS de data/config.js, o null para
 *               mostrar "Consultar tarifa".
 * - modalidades: "consultorio" y/o "domicilio".
 * - estado:     "activo" (visible) | "inactivo" (desaparece de la web y del
 *               formulario de reserva, sin borrar el bloque de datos).
 * - reservable: true = muestra el botón "Solicitar cita" y entra al
 *               formulario. false = solo se muestra la ficha informativa.
 * - orden:      número de orden en pantalla (menor = primero).
 *
 * Para DESACTIVAR un servicio: cambia estado a "inactivo".
 * Para AGREGAR uno nuevo: copia un bloque completo, pega al final y cambia
 * su id (debe ser único) y sus textos.
 */
window.ALMAE_CATEGORIAS = [
  {
    id: "rehabilitacion",
    nombre: "Rehabilitación y terapia física",
    descripcion: "Evaluación y tratamiento personalizado para recuperar movilidad, fuerza y función."
  },
  {
    id: "masajes",
    nombre: "Masajes y bienestar",
    descripcion: "Terapias manuales para relajación, alivio de tensión y cuidado corporal."
  },
  {
    id: "especializadas",
    nombre: "Técnicas especializadas",
    descripcion: "Abordajes específicos indicados según la valoración de cada paciente."
  },
  {
    id: "tecnologia",
    nombre: "Tecnología terapéutica",
    descripcion: "Equipos de agente físico que pueden formar parte del plan de tratamiento."
  }
];

window.ALMAE_SERVICIOS = [
  {
    id: "fisioterapia-rehabilitacion",
    nombre: "Fisioterapia y rehabilitación",
    categoria: "rehabilitacion",
    imagen: "",
    alt: "Sesión de fisioterapia y rehabilitación en ALMAE",
    descripcion: "Proceso terapéutico orientado a recuperar la función tras una lesión, dolor o limitación del movimiento.",
    beneficios: "Puede ayudar a mejorar la movilidad, la fuerza y la autonomía en las actividades diarias.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 1,
    visible: true
  },
  {
    id: "terapia-fisica",
    nombre: "Terapia física",
    categoria: "rehabilitacion",
    imagen: "assets/images/servicios-fotos/fisioterapia-domicilio.jpg",
    alt: "Atención de terapia física en consultorio ALMAE",
    descripcion: "Sesiones de terapia física con abordaje personalizado según tu evaluación inicial.",
    beneficios: "Orientada a acompañar la recuperación funcional y el manejo del dolor.",
    tarifaId: "terapia-fisica",
    modalidades: ["consultorio", "domicilio"],
    estado: "activo",
    reservable: true,
    orden: 2,
    visible: true
  },
  {
    id: "rehabilitacion-lumbar-cervical",
    nombre: "Rehabilitación lumbar y cervical",
    categoria: "rehabilitacion",
    imagen: "",
    alt: "Rehabilitación de zona lumbar y cervical",
    descripcion: "Atención para molestias de espalda baja y cuello, con ejercicios y técnicas indicadas para tu caso.",
    beneficios: "Busca reducir la molestia y recuperar la movilidad de forma progresiva y controlada.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 3,
    visible: true
  },
  {
    id: "rehabilitacion-articulaciones",
    nombre: "Rehabilitación de rodilla, hombro y cadera",
    categoria: "rehabilitacion",
    imagen: "",
    alt: "Rehabilitación de rodilla, hombro y cadera",
    descripcion: "Programa para recuperar rango de movimiento y estabilidad en articulaciones afectadas.",
    beneficios: "Apoya la vuelta a actividades diarias y deportivas según la indicación profesional.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 4,
    visible: true
  },
  {
    id: "rehabilitacion-postoperatoria",
    nombre: "Rehabilitación postoperatoria",
    categoria: "rehabilitacion",
    imagen: "",
    alt: "Rehabilitación postoperatoria personalizada",
    descripcion: "Acompañamiento terapéutico después de una cirugía, adaptado a la evolución de cada paciente.",
    beneficios: "Puede favorecer la recuperación de movilidad y fortalecimiento de forma gradual.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 5,
    visible: true
  },
  {
    id: "rehabilitacion-deportiva",
    nombre: "Rehabilitación deportiva",
    categoria: "rehabilitacion",
    imagen: "",
    alt: "Rehabilitación deportiva en ALMAE",
    descripcion: "Terapia orientada a lesiones por actividad física y a la vuelta segura al entrenamiento.",
    beneficios: "Ayuda a recuperar fuerza, control y confianza en el movimiento.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 6,
    visible: true
  },
  {
    id: "ejercicios-terapeuticos",
    nombre: "Ejercicios terapéuticos",
    categoria: "rehabilitacion",
    imagen: "",
    alt: "Ejercicios terapéuticos guiados",
    descripcion: "Guía de ejercicios individualizados para fortalecer, estabilizar y mejorar el movimiento.",
    beneficios: "Complementa el tratamiento y favorece la autonomía del paciente.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 7,
    visible: true
  },
  {
    id: "masoterapia",
    nombre: "Masoterapia",
    categoria: "masajes",
    imagen: "",
    alt: "Sesión de masoterapia en ALMAE",
    descripcion: "Técnicas manuales aplicadas con fines terapéuticos según la valoración del caso.",
    beneficios: "Puede contribuir a relajar la musculatura y aliviar la tensión local.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 8,
    visible: true
  },
  {
    id: "masajes-descontracturantes",
    nombre: "Masajes descontracturantes",
    categoria: "masajes",
    imagen: "",
    alt: "Masaje descontracturante en ALMAE",
    descripcion: "Masaje orientado a trabajar zonas de tensión muscular y rigidez.",
    beneficios: "Ayuda a disminuir la sensación de carga muscular y mejorar la relajación.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 9,
    visible: true
  },
  {
    id: "masaje-antiestres-60",
    nombre: "Masaje antiestrés — 60 minutos",
    categoria: "masajes",
    imagen: "",
    alt: "Masaje antiestrés de 60 minutos en ALMAE",
    descripcion: "Sesión relajante de 60 minutos para desconectar y recuperar bienestar.",
    beneficios: "Fomenta la relajación general y el descanso.",
    tarifaId: "masaje-antiestres-60",
    modalidades: ["consultorio", "domicilio"],
    estado: "activo",
    reservable: true,
    orden: 10,
    visible: true
  },
  {
    id: "masaje-antiestres-90",
    nombre: "Masaje antiestrés — 90 minutos",
    categoria: "masajes",
    imagen: "",
    alt: "Masaje antiestrés de 90 minutos en ALMAE",
    descripcion: "Sesión relajante de 90 minutos para una desconexión más profunda.",
    beneficios: "Brinda más tiempo de trabajo manual para soltar tensión.",
    tarifaId: "masaje-antiestres-90",
    modalidades: ["consultorio", "domicilio"],
    estado: "activo",
    reservable: true,
    orden: 11,
    visible: true
  },
  {
    id: "masaje-estetico-reductor",
    nombre: "Masaje estético reductor",
    categoria: "masajes",
    imagen: "assets/images/servicios-fotos/reductor-consultorio.jpg",
    alt: "Masaje estético reductor de 90 minutos",
    descripcion: "Tratamiento corporal estético de 90 minutos con técnicas de masaje.",
    beneficios: "Puede ayudar a mejorar la sensación de bienestar corporal.",
    tarifaId: "masaje-reductor-90",
    modalidades: ["consultorio", "domicilio"],
    estado: "activo",
    reservable: true,
    orden: 12,
    visible: true
  },
  {
    id: "reflexologia",
    nombre: "Reflexología facial y podal",
    categoria: "masajes",
    imagen: "assets/images/servicios-fotos/reflexologia-consultorio.jpg",
    alt: "Reflexología facial y podal",
    descripcion: "Técnica de estimulación en puntos del rostro y los pies con fines de relajación.",
    beneficios: "Contribuye a una experiencia de calma y desconexión.",
    tarifaId: "reflexologia",
    modalidades: ["consultorio", "domicilio"],
    estado: "activo",
    reservable: true,
    orden: 13,
    visible: true
  },
  {
    id: "acupuntura",
    nombre: "Acupuntura",
    categoria: "especializadas",
    imagen: "",
    alt: "Sesión de acupuntura en ALMAE",
    descripcion: "Técnica de inserción de agujas finas en puntos específicos, según indicación profesional.",
    beneficios: "Se utiliza dentro de un plan terapéutico personalizado.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 14,
    visible: true
  },
  {
    id: "puncion-seca",
    nombre: "Punción seca",
    categoria: "especializadas",
    imagen: "",
    alt: "Técnica de punción seca",
    descripcion: "Procedimiento para abordar puntos de tensión muscular guiado por profesional.",
    beneficios: "Puede complementar el tratamiento de dolor y restrictores miofasciales.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 15,
    visible: true
  },
  {
    id: "tendinitis",
    nombre: "Atención de tendinitis",
    categoria: "especializadas",
    imagen: "",
    alt: "Atención fisioterapéutica de tendinitis",
    descripcion: "Valoración y tratamiento para molestias tendinosas en distintas zonas del cuerpo.",
    beneficios: "Busca aliviar la molestia y recuperar la función de forma progresiva.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 16,
    visible: true
  },
  {
    id: "magnetoterapia",
    nombre: "Magnetoterapia",
    categoria: "tecnologia",
    imagen: "",
    alt: "Equipo de magnetoterapia en ALMAE",
    descripcion: "Uso de equipos de agente físico como parte del tratamiento indicado.",
    beneficios: "Se integra al plan terapéutico cuando el profesional lo considera adecuado.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 17,
    visible: true
  },
  {
    id: "ultrasonido",
    nombre: "Ultrasonido terapéutico",
    categoria: "tecnologia",
    imagen: "",
    alt: "Ultrasonido terapéutico en sesión de fisioterapia",
    descripcion: "Aplicación de ultrasonido terapéutico en zonas a tratar.",
    beneficios: "Forma parte del abordaje fisioterapéutico según evaluación.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 18,
    visible: true
  },
  {
    id: "electroterapia",
    nombre: "Electroterapia",
    categoria: "tecnologia",
    imagen: "",
    alt: "Electroterapia en sesión de fisioterapia",
    descripcion: "Técnicas con equipos de corriente terapéutica según indicación profesional.",
    beneficios: "Puede acompañar el manejo del dolor y la recuperación funcional.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 19,
    visible: true
  },
  {
    id: "laser",
    nombre: "Láser terapéutico",
    categoria: "tecnologia",
    imagen: "",
    alt: "Láser terapéutico en sesión de fisioterapia",
    descripcion: "Aplicación de láser terapéutico en el contexto del tratamiento.",
    beneficios: "Se utiliza como agente físico complementario en el plan de atención.",
    tarifaId: null,
    modalidades: ["consultorio"],
    estado: "activo",
    reservable: true,
    orden: 20,
    visible: true
  }
];
