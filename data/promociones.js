/**
 * ALMAE – Promociones
 *
 * REGLAS DE ORO:
 * - No inventes descuentos ni precios: sin autorización, deja precioPromocional vacío ("").
 * - No publiques promociones vencidas: la web las oculta sola usando la
 *   fecha local de Perú (America/Lima).
 * - Fechas en formato AAAA-MM-DD. Si una fecha es inválida, la promoción NO se muestra.
 *
 * Para PUBLICAR una promoción:
 *   1. Copia el ejemplo de abajo dentro del array (entre [ y ]).
 *   2. Completa id, titulo, descripcion, fechaInicio y fechaFin.
 *   3. Pon activa: true.
 * Para RETIRARLA: pon activa: false o borra el bloque.
 * Si no hay promociones activas, la web muestra el bloque de consulta por WhatsApp.
 *
 * Ejemplo (cópialo y edítalo):
 * {
 *   id: "promo-masaje-60",
 *   titulo: "Nombre de la promoción",
 *   descripcion: "Breve descripción del beneficio, sin descuentos inventados.",
 *   imagen: "",   // ruta relativa a assets/images/ (vacía = sin imagen)
 *   alt: "Descripción de la imagen",
 *   servicioId: "masaje-antiestres-60",                   // id de data/servicios.js o ""
 *   precioPromocional: "",                                // ej.: "S/ 60" solo si está autorizado
 *   precioRegular: "",                                    // ej.: "S/ 70" solo si aplica
 *   fechaInicio: "2026-11-01",
 *   fechaFin: "2026-11-30",
 *   activa: true,
 *   orden: 1,
 *   cta: {
 *     texto: "Consultar por WhatsApp",
 *     mensaje: "Hola, ALMAE. Quisiera consultar los detalles de la promoción vigente."
 *   }
 * }
 */
window.ALMAE_PROMOCIONES = [];

window.ALMAE_PROMO_FALLBACK = {
  titulo: "Consulta nuestras promociones vigentes",
  texto:
    "Siempre estamos preparando nuevos beneficios para tu bienestar. Escríbenos y te contamos las promociones disponibles y los servicios que ofrecemos.",
  boton: "Ver promociones por WhatsApp",
  mensajeWhatsApp:
    "Hola, ALMAE. Me gustaría conocer las promociones disponibles y los servicios que ofrecen. Muchas gracias."
};

/**
 * Devuelve solo las promociones que deben mostrarse hoy (fecha de Perú):
 * - activa: true
 * - con fechas válidas o sin fechas
 * - dentro del rango fechaInicio..fechaFin (inclusive), si tiene fechas
 * - ordenadas por el campo "orden"
 */
window.ALMAE_obtenerPromocionesActivas = function () {
  var lista = window.ALMAE_PROMOCIONES || [];
  if (!Array.isArray(lista)) return [];

  function hoyLima() {
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Lima",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(new Date());
    } catch (e) {
      var d = new Date();
      var m = String(d.getMonth() + 1).padStart(2, "0");
      var dia = String(d.getDate()).padStart(2, "0");
      return d.getFullYear() + "-" + m + "-" + dia;
    }
  }

  function fechaValida(valor) {
    if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      return null;
    }
    var partes = valor.split("-");
    var d = new Date(
      Number(partes[0]),
      Number(partes[1]) - 1,
      Number(partes[2])
    );
    if (
      d.getFullYear() !== Number(partes[0]) ||
      d.getMonth() !== Number(partes[1]) - 1 ||
      d.getDate() !== Number(partes[2])
    ) {
      return null; // fecha inexistente (ej.: 2026-02-30)
    }
    return valor;
  }

  var hoy = hoyLima();

  var filtradas = lista.filter(function (promo) {
    if (!promo || typeof promo !== "object") return false;
    if (promo.activa !== true) return false;

    // Compatibilidad con el campo antiguo vigenciaHasta.
    var fin = promo.fechaFin || promo.vigenciaHasta || "";
    var inicio = promo.fechaInicio || "";

    // Si escribe una fecha con formato incorrecto, no se publica (mejor oculto que mal informado).
    if (promo.fechaFin && !fechaValida(promo.fechaFin)) return false;
    if (promo.fechaInicio && !fechaValida(promo.fechaInicio)) return false;
    if (promo.vigenciaHasta && !fechaValida(promo.vigenciaHasta)) return false;

    if (inicio && fechaValida(inicio) && hoy < inicio) return false;
    if (fin && fechaValida(fin) && hoy > fin) return false;
    return true;
  });

  return filtradas.sort(function (a, b) {
    var oa = typeof a.orden === "number" ? a.orden : 999;
    var ob = typeof b.orden === "number" ? b.orden : 999;
    return oa - ob;
  });
};
