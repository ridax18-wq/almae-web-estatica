/**
 * ALMAE – Configuración general de la web.
 * Este es el ÚNICO archivo para editar los datos generales:
 * marca, portada, contacto, imágenes y SEO.
 * Los precios viven en ALMAE_TARIFAS (más abajo). No duplicarlos en ningún otro archivo.
 *
 * IMPORTANTE: las rutas de imágenes deben ser RELATIVAS (empezar con "assets/...")
 * para que la web funcione también en GitHub Pages.
 */
window.ALMAE_CONFIG = {
  /* ---------- Marca ---------- */
  nombre: "ALMAE – Terapia y Spa",
  nombreCorto: "ALMAE",
  slogan: "Recuperación, bienestar y cuidado profesional en un solo espacio.",

  /* ---------- Contacto ---------- */
  // whatsapp: solo dígitos con código de país (51 = Perú). Sin espacios ni signos.
  whatsapp: "51919608174",
  // whatsappVisible: como se muestra a las personas en la página.
  whatsappVisible: "+51 919 608 174",
  direccion: {
    linea1: "Altos del Rímac 250",
    linea2: "Torre 2, Dpto. 104",
    texto: "Altos del Rímac 250, Torre 2, Dpto. 104",
    // Consulta de ubicación en mapas (sin coordenadas inventadas).
    urlConsulta:
      "https://www.google.com/maps/search/?api=1&query=Altos+del+Rimac+250+Torre+2+Dpto+104"
  },
  // Los horarios se muestran solo si se confirman oficialmente (null = no mostrar).
  horarios: null,
  redesSociales: [],

  /* ---------- Mensajes comerciales ---------- */
  mensajes: {
    bienvenida:
      "Recuperación, bienestar y cuidado profesional en un solo espacio.",
    disponibilidad:
      "La disponibilidad de atención y los horarios se confirman por WhatsApp.",
    // Mensaje que usa el botón flotante de WhatsApp.
    flotante: "Hola, ALMAE. \n\nQuisiera solicitar una cita.",
    // Mensaje para pedir indicaciones al consultorio.
    indicaciones:
      "Hola, ALMAE. Necesito indicaciones para llegar al consultorio (Altos del Rímac 250, Torre 2, Dpto. 104).",
    // Mensaje para consultar atención a domicilio.
    domicilio:
      "Hola, ALMAE. Quisiera consultar disponibilidad y valores de atención a domicilio. Muchas gracias."
  },

  /* ---------- Portada (hero) ---------- */
  portada: {
    badge: "Terapia y Spa · Perú",
    titulo: ["Muévete con confianza.", "Recupera tu bienestar."],
    // El texto se compone de tres partes: antes de la marca, la marca en
    // negrita y el resto. Así se evita insertar HTML desde este archivo.
    texto: {
      antes: "En ",
      marca: "ALMAE – Terapia y Spa",
      despues:
        " te acompañamos con fisioterapia, rehabilitación y terapias de bienestar, con atención personalizada en consultorio o a domicilio."
    },
    meta: [
      { etiqueta: "Ubicación", valor: "Altos del Rímac 250" },
      { etiqueta: "Modalidad", valor: "Consultorio y domicilio" },
      { etiqueta: "Enfoque", valor: "Atención personalizada" }
    ],
    card: {
      titulo: "Ambiente cuidado",
      texto: "Espacio limpio, luminoso y equipado para tu recuperación."
    }
  },

  /* ---------- Imágenes (manifiesto) ---------- */
  // Para cambiar una fotografía: reemplaza el archivo en assets/images/
  // o escribe otra ruta relativa aquí. NO edites index.html.
  // Si la imagen no existe, la web muestra un placeholder automático.
  imagenes: {
    placeholder: "assets/images/placeholder.svg",
    hero: {
      ruta: "assets/images/hero/consultorio-hero.jpg",
      alt: "Consultorio de ALMAE: camilla de terapia, equipos y ventanales con luz natural",
      ancho: 1200,
      alto: 800
    },
    nosotros: {
      ruta: "assets/images/consultorio/consultorio-limpio-luminoso.jpg",
      alt: "Consultorio de ALMAE con camilla, estantería de equipos y ventanales",
      ancho: 1086,
      alto: 1448
    },
    // Presentación de la profesional (autorizada por la propia profesional).
    profesional: {
      ruta: "assets/images/profesional/directora-almae.jpg",
      alt: "Directora de ALMAE – Terapia y Spa frente al letrero del consultorio",
      ancho: 1200,
      alto: 675
    },
    // Galería: el orden del array es el orden en pantalla.
    galeria: [
      {
        ruta: "assets/images/consultorio/consultorio-limpio-luminoso.jpg",
        full: "assets/images/consultorio/consultorio-limpio-luminoso.jpg",
        alt: "Consultorio de ALMAE: camilla, estantería de equipos y ventana con luz natural",
        ancho: 1086,
        alto: 1448
      },
      {
        ruta: "assets/images/galeria/consultorio-galeria-1.jpg",
        full: "assets/images/galeria/consultorio-galeria-1.jpg",
        alt: "Vista del consultorio de ALMAE con estantería y camilla",
        ancho: 1122,
        alto: 1402
      },
      {
        ruta: "assets/images/galeria/consultorio-galeria-2.jpg",
        full: "assets/images/galeria/consultorio-galeria-2.jpg",
        alt: "Camilla de terapia y estantería del consultorio de ALMAE",
        ancho: 1122,
        alto: 1402
      },
      {
        ruta: "assets/images/galeria/consultorio-galeria-3.jpg",
        full: "assets/images/galeria/consultorio-galeria-3.jpg",
        alt: "Sala de terapia de ALMAE con camilla y ventanal",
        ancho: 1122,
        alto: 1402
      }
    ]
  },

  /* ---------- Parámetros de reservas ---------- */
  reservas: {
    // Aviso que se muestra bajo la fecha y en el resumen.
    notaHorario:
      "El horario seleccionado es referencial y está sujeto a disponibilidad. Nuestro equipo confirmará tu cita por WhatsApp o te ofrecerá otras alternativas.",
    mensajeFlujo:
      "Te mostraremos un resumen antes de abrir WhatsApp. Este sitio web no confirma citas ni guarda tus datos.",
    mensajeResumen:
      "Se abrirá WhatsApp con tu solicitud preparada para que la envíes. Si cierras WhatsApp, podrás volver a esta pestaña: tus datos se conservan y la cita no queda registrada hasta que nuestro equipo la confirme.",
    textoEnlaceAlternativo:
      "¿No se abrió WhatsApp? Abre el enlace en esta misma pestaña."
  },

  /* ---------- Colores de marca (solo referencia, no alteran el CSS) ---------- */
  colores: {
    primario: "#b56a75",
    burdeos: "#8e4a55",
    crema: "#faf6f3",
    salvia: "#8c9a7e"
  },

  /* ---------- SEO ---------- */
  seo: {
    // Dejar urlPublica vacía hasta conocer la URL definitiva.
    // Cuando exista, ej.: "https://usuario.github.io/almae-web-estatica/"
    urlPublica: "",
    titulo: "ALMAE – Terapia y Spa | Fisioterapia, rehabilitación y bienestar",
    descripcion:
      "Fisioterapia, rehabilitación y terapias de bienestar en Altos del Rímac 250. Atención personalizada en consultorio y a domicilio. Solicita tu cita por WhatsApp."
  }
};

/**
 * Tarifas confirmadas. ÚNICA fuente de precios de la web.
 * No inventar precios: si un servicio no tiene tarifaId aquí, se muestra "Consultar tarifa".
 * Al cambiar un valor aquí se actualizan automáticamente: tarjetas del catálogo,
 * tabla de tarifas, formulario de reserva, resumen y mensaje de WhatsApp.
 *
 * modalidadDomicilio: true solo cuando la atención a domicilio esté definida.
 */
window.ALMAE_TARIFAS = {
  "terapia-fisica": {
    consultorio: 50,
    domicilio: 80,
    moneda: "S/",
    modalidadDomicilio: true,
    nota: "Sesión de terapia física en consultorio o a domicilio."
  },
  "masaje-antiestres-60": {
    consultorio: 70,
    domicilio: 120,
    moneda: "S/",
    modalidadDomicilio: true,
    nota: "Masaje antiestrés de 60 minutos."
  },
  "masaje-antiestres-90": {
    consultorio: 90,
    domicilio: 150,
    moneda: "S/",
    modalidadDomicilio: true,
    nota: "Masaje antiestrés de 90 minutos."
  },
  "masaje-reductor-90": {
    consultorio: 150,
    domicilio: 200,
    moneda: "S/",
    modalidadDomicilio: true,
    nota: "Masaje estético reductor de 90 minutos."
  },
  // Confirmada por el responsable de ALMAE.
  "reflexologia": {
    consultorio: 60,
    domicilio: 70,
    moneda: "S/",
    modalidadDomicilio: true,
    nota: "Reflexología podal y facial de 60 minutos."
  }
};
