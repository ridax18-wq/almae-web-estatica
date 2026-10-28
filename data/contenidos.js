/**
 * ALMAE – Contenidos comerciales editables.
 * Los textos de esta página se editan AQUÍ y no en index.html.
 *
 * Cómo usarlo: cada nodo del HTML que dice data-contenido="clave" toma su
 * texto de este archivo. Si la clave no existe, se conserva el texto actual
 * del HTML (la web nunca se queda en blanco).
 *
 * Reglas:
 * - No pegues código HTML ni etiquetas (< >) en estos textos: se muestran como texto.
 * - La portada (hero) y los datos de contacto se editan en data/config.js.
 * - Las preguntas frecuentes se editan en data/preguntas.js.
 */
window.ALMAE_CONTENIDOS = {
  /* Banda de confianza bajo la portada (4 tarjetas, en orden). */
  trust: [
    {
      titulo: "Evaluación individual",
      texto: "Cada proceso comienza conociendo tu caso."
    },
    {
      titulo: "Trato cercano",
      texto: "Acompañamiento durante todo el proceso."
    },
    {
      titulo: "Consultorio y domicilio",
      texto: "Flexibilidad según tu necesidad."
    },
    {
      titulo: "Cita por WhatsApp",
      texto: "Solicitud simple y confirmación directa."
    }
  ],

  /* Sección Nosotros. */
  nosotros: {
    eyebrow: "Nosotros",
    titulo: "Un espacio pensado para tu recuperación",
    parrafos: [
      "ALMAE – Terapia y Spa es un centro de atención orientado a fisioterapia, recuperación funcional y bienestar. Trabajamos con una evaluación inicial, un plan adaptado a ti y un seguimiento cercano en cada sesión.",
      "Nuestro objetivo es que te sientas acompañado, informado y con un entorno agradable para avanzar en tu proceso terapéutico."
    ],
    floatTexto: "Terapia, movimiento y bienestar en un solo espacio.",
    // Presentación de la profesional. El nombre y las credenciales no están
    // validados: completarlos solo con datos confirmados por la profesional.
    profesional: {
      cargo: "Directora de ALMAE – Terapia y Spa",
      texto: "Conoce a la profesional a cargo de ALMAE y el espacio donde recibirás tu atención."
    },
    items: [
      {
        titulo: "Evaluación individual",
        texto: "Analizamos tu caso para orientar el tratamiento más adecuado."
      },
      {
        titulo: "Atención personalizada",
        texto: "Sesiones adaptadas a tus objetivos y a tu ritmo de recuperación."
      },
      {
        titulo: "Acompañamiento continuo",
        texto: "Te guiamos durante el proceso terapéutico con claridad y calidez."
      }
    ]
  },

  /* Encabezados de secciones. */
  secciones: {
    servicios: {
      eyebrow: "Servicios",
      titulo: "Terapias pensadas para ti",
      lead:
        "Fisioterapia, masajes y técnicas especializadas para el dolor, la movilidad y el bienestar integral."
    },
    promociones: {
      eyebrow: "Promociones",
      titulo: "Aprovecha nuestras beneficios",
      lead:
        "Consulta campañas vigentes por WhatsApp. No publicamos descuentos sin confirmación oficial."
    },
    galeria: {
      eyebrow: "Galería",
      titulo: "Conoce nuestro consultorio",
      lead:
        "Ambiente real, limpio y luminoso, preparado para tu sesión de terapia."
    },
    reserva: {
      eyebrow: "Reserva tu cita",
      titulo: "Solicita tu cita en ALMAE",
      lead:
        "Cuéntanos qué tratamiento te interesa y tu preferencia de fecha y hora. Enviaremos tu solicitud por WhatsApp y nuestro equipo verificará la disponibilidad para confirmarte la cita."
    },
    ubicacion: {
      eyebrow: "Ubicación",
      titulo: "Encuéntranos",
      lead:
        "Te esperamos en ALMAE – Terapia y Spa. Si lo prefieres, también ofrecemos atención a domicilio coordinada por WhatsApp."
    },
    contacto: {
      eyebrow: "Contacto",
      titulo: "Hablemos",
      lead:
        "Escríbenos para consultas sobre tratamientos, modalidades o para solicitar tu cita."
    }
  },

  /* Franja de llamada a la acción antes del formulario. */
  ctaBand: {
    titulo: "¿Listo para dar el siguiente paso?",
    texto:
      "Completa el formulario de solicitud y te ayudamos a coordinar tu atención por WhatsApp. El horario se confirma con nuestro equipo.",
    botonPrincipal: "Comenzar mi solicitud",
    botonSecundario: "Ver servicios"
  },

  /* Sección Ubicación. */
  ubicacion: {
    // La dirección se toma de config.direccion.texto (no repetir aquí).
    cardDireccion: {
      titulo: "Dirección del consultorio",
      link: "Pedir indicaciones por WhatsApp"
    },
    cardDomicilio: {
      titulo: "Atención a domicilio",
      texto:
        "Para algunos servicios ofrecemos atención a domicilio. La disponibilidad y los valores se confirman por WhatsApp según tu zona.",
      link: "Consultar disponibilidad"
    },
    mapaNota:
      "El mapa interactivo se incorporará próximamente con coordenadas verificadas. Hasta entonces, confirma tu visita por WhatsApp."
  },

  /* Sección Contacto. */
  contacto: {
    whatsapp: {
      titulo: "WhatsApp",
      texto: "Solicita tu cita o resuelve tus dudas."
    },
    consultorio: {
      titulo: "Consultorio",
      texto: "La atención es con cita previa."
    },
    privacidadCajaTitulo: "Privacidad y publicidad responsable:",
    privacidadCaja:
      "esta web es un canal informativo. No publicamos nombres de pacientes, testimonios sin autorización, imágenes de personas identificables ni datos sensibles de salud. La solicitud de cita se gestiona por WhatsApp y no equivale a una reserva confirmada; también puedes consultar la información en el consultorio."
  },

  /* Formulario de reserva (textos legales y avisos). */
  reserva: {
    consentimiento: {
      antes: "Acepto que ",
      marca: "ALMAE – Terapia y Spa",
      despues:
        " trate mis datos de contacto (nombre, celular y los datos de esta solicitud) con la única finalidad de atender y coordinar mi solicitud de cita. He leído el ",
      enlace: "aviso de privacidad"
    },
    // Segundo consentimiento: OPCIONAL y nunca obligatorio.
    // No marca, no condiciona y no es requisito para enviar la solicitud.
    consentimientoPromo: {
      texto:
        "Deseo recibir información promocional de ALMAE por WhatsApp. (Opcional: no es necesario aceptarlo para solicitar tu cita.)"
    },
    avisoResumen: "Aviso de privacidad",
    aviso: {
      // IMPORTANTE: los datos marcados como [PENDIENTE] deben validarse
      // jurídicamente y comercialmente ANTES de publicar la web.
      parrafos: [
        {
          titulo: "Responsable del tratamiento",
          cuerpo:
            "ALMAE – Terapia y Spa, con domicilio en Altos del Rímac 250, Torre 2, Dpto. 104, y contacto por el WhatsApp indicado en esta página. [PENDIENTE: consignar razón social, RUC y datos de contacto del responsable, una vez validados.]"
        },
        {
          titulo: "Datos que recopilamos",
          cuerpo:
            "Nombre, número de celular, servicio de interés, modalidad, fecha y hora preferidas y comentarios opcionales. No solicitamos datos de salud, documentos de identidad ni información clínica."
        },
        {
          titulo: "Finalidad",
          cuerpo:
            "Usar tus datos únicamente para atender y coordinar tu solicitud de cita. No los usamos para otras finalidades sin tu autorización."
        },
        {
          titulo: "Canal de comunicación",
          cuerpo:
            "Tu solicitud se envía por WhatsApp hacia el número de WhatsApp de ALMAE indicado en esta página. Este sitio web no almacena tus datos: no usa bases de datos, cookies de seguimiento, LocalStorage ni archivos locales. [PENDIENTE: verificar las condiciones de tratamiento de datos del proveedor de mensajería, conforme al Decreto Supremo N.° 016-2024-JUS.]"
        },
        {
          titulo: "Consentimiento",
          cuerpo:
            "Al marcar la casilla correspondiente aceptas el tratamiento de tus datos para gestionar tu solicitud, conforme a la Ley N.° 29733 – Ley de Protección de Datos Personales y su Reglamento (Decreto Supremo N.° 016-2024-JUS). Puedes revocar tu consentimiento en cualquier momento escribiéndonos al WhatsApp indicado. El consentimiento para recibir promociones es aparte, voluntario y nunca es requisito para solicitar una cita."
        },
        {
          titulo: "Derechos del titular",
          cuerpo:
            "Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición (ARCO), así como revocar tu consentimiento, escribiéndonos al WhatsApp indicado. [PENDIENTE: definir y declarar el canal formal de atención de reclamos y los plazos de respuesta, conforme al reglamento.]"
        },
        {
          titulo: "Información complementaria",
          cuerpo:
            "Este aviso es informativo y estará sujeto a revisión legal antes de la publicación pública. [PENDIENTE: validación jurídica completa del aviso y del responsable del tratamiento.]"
        }
      ]
    }
  },

  /* Pie de página. */
  footer: {
    texto:
      "Fisioterapia, rehabilitación y terapias de bienestar con atención personalizada en consultorio y a domicilio.",
    derechos: "Todos los derechos reservados.",
    aviso: "Web informativa. Las citas se confirman por WhatsApp."
  }
};
