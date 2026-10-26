/**
 * ALMAE – Construcción del enlace de solicitud por WhatsApp.
 * No guarda ni transmite datos por otros medios: solo arma el enlace wa.me.
 */
(function (global) {
  "use strict";

  function formatoTarifa(data) {
    if (!data.tarifaTexto || data.tarifaTexto === "Por consultar") {
      return "Por consultar";
    }
    return data.tarifaTexto;
  }

  function construirMensaje(data) {
    var lineas = [
      "Hola, ALMAE. \u{1F33F}",
      "",
      "Quisiera solicitar una cita para uno de sus tratamientos.",
      "",
      "DATOS DE MI SOLICITUD",
      "",
      "\u{1F464} Paciente: " + data.nombreCompleto,
      "\u{1F4F1} Celular: " + data.celular,
      "\u{1F486} Tratamiento: " + data.servicio,
      "\u{1F3E5} Modalidad: " + data.modalidad,
      "\u{1F4C5} Fecha preferida: " + data.fecha,
      "\u{1F552} Hora preferida: " + data.hora,
      "\u{1F4B0} Tarifa informativa: " + formatoTarifa(data)
    ];
    if (data.comentarios) {
      lineas.push("\u{1F4DD} Comentarios: " + data.comentarios);
    }
    // Consentimiento de publicidad: solo se menciona si fue otorgado
    // (es opcional y nunca es requisito para solicitar la cita).
    if (data.promociones) {
      lineas.push("\u{1F4CC} Deseo recibir información promocional por WhatsApp.");
    }
    lineas.push(
      "",
      "Entiendo que el horario está sujeto a disponibilidad y que mi cita será confirmada por su equipo.",
      "",
      "¿Podrían ayudarme a coordinar mi atención?",
      "",
      "Muchas gracias."
    );
    return lineas.join("\n");
  }

  /* Número único: data/config.js (ALMAE_CONFIG.whatsapp). */
  var NUMERO_RESPALDO = "51919608174";

  function numero() {
    var cfg = global.ALMAE_CONFIG || {};
    var n = String(cfg.whatsapp || NUMERO_RESPALDO).replace(/\D/g, "");
    return n || NUMERO_RESPALDO;
  }

  /* Enlace wa.me genérico. Todos los módulos deben usar esta función. */
  function enlace(texto) {
    var base = "https://wa.me/" + numero();
    return texto ? base + "?text=" + encodeURIComponent(texto) : base;
  }

  /* Enlace de solicitud de cita con el mensaje estructurado del formulario. */
  function construirEnlace(data) {
    return enlace(construirMensaje(data));
  }

  /* Enlace según la intención del usuario:
   * - "cita":        solicitud de cita (requiere datos del formulario).
   * - "promociones": consulta de promociones vigentes.
   * - "consulta":    consulta general; clave = mensajes de config (p. ej. "flotante").
   */
  function enlaceIntencion(intencion, datos) {
    var cfg = global.ALMAE_CONFIG || {};
    var msgs = cfg.mensajes || {};
    var fallback = global.ALMAE_PROMO_FALLBACK || {};
    if (intencion === "cita" && datos) {
      return construirEnlace(datos);
    }
    if (intencion === "promociones") {
      return enlace(fallback.mensajeWhatsApp || "");
    }
    var clave = (datos && datos.clave) || "flotante";
    return enlace(typeof msgs[clave] === "string" ? msgs[clave] : msgs.flotante || "");
  }

  global.ALMAE_WhatsApp = {
    numero: numero,
    enlace: enlace,
    enlaceIntencion: enlaceIntencion,
    construirMensaje: construirMensaje,
    construirEnlace: construirEnlace
  };
})(window);
