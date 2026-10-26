(function () {
  "use strict";

  var cont = document.getElementById("bloque-promociones");
  if (!cont) return;

  var activas =
    typeof window.ALMAE_obtenerPromocionesActivas === "function"
      ? window.ALMAE_obtenerPromocionesActivas()
      : [];
  var fallback = window.ALMAE_PROMO_FALLBACK || {};
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* Enlaces generados por el módulo central de WhatsApp. */
  function urlWa(mensaje) {
    return window.ALMAE_WhatsApp.enlace(mensaje);
  }

  function fechaDDMMYYYY(iso) {
    if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function textoVigencia(promo) {
    if (promo.vigencia) return String(promo.vigencia);
    var fin = promo.fechaFin || promo.vigenciaHasta;
    var ddmm = fechaDDMMYYYY(fin);
    return ddmm ? "Vigente hasta el " + ddmm : "";
  }

  if (!activas.length) {
    var msg = fallback.mensajeWhatsApp || "Hola, ALMAE. Me gustaría conocer las promociones disponibles.";
    cont.innerHTML =
      "<div class=\"promo-fallback\">" +
      "<div class=\"promo-fallback__icon\" aria-hidden=\"true\">" +
      "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\"/><rect x=\"2\" y=\"7\" width=\"20\" height=\"5\" rx=\"1\"/><path d=\"M12 21V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z\"/></svg>" +
      "</div>" +
      "<div class=\"promo-fallback__body\">" +
      "<h3 class=\"promo-fallback__title\">" + esc(fallback.titulo || "Consulta nuestras promociones vigentes") + "</h3>" +
      "<p class=\"promo-fallback__text\">" + esc(fallback.texto || "") + "</p>" +
      "<a class=\"btn btn--primary\" href=\"" + esc(urlWa(msg)) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" +
      esc(fallback.boton || "Ver promociones por WhatsApp") +
      "</a>" +
      "</div>" +
      "</div>";
    return;
  }

  cont.innerHTML = activas
    .map(function (p) {
      var img = p.imagen
        ? "<img src=\"" + esc(p.imagen) + "\" alt=\"" + esc(p.alt || p.titulo) + "\" loading=\"lazy\" width=\"640\" height=\"400\">"
        : "";
      // Los precios promocionales solo se muestran si fueron configurados.
      var precio = p.precioPromocional
        ? "<p class=\"promo-card__price\"><span>" + esc(p.precioPromocional) + "</span>" +
          (p.precioRegular ? " <s>" + esc(p.precioRegular) + "</s>" : "") + "</p>"
        : "";
      var vig = textoVigencia(p);
      var vigHtml = vig ? "<p class=\"promo-card__vig\">" + esc(vig) + "</p>" : "";
      var cta = p.cta || {};
      var ctaHtml = cta.texto
        ? "<a class=\"btn btn--primary promo-card__cta\" href=\"" +
          esc(urlWa(cta.mensaje || "Hola, ALMAE. Quisiera consultar los detalles de esta promoción.")) +
          "\" target=\"_blank\" rel=\"noopener noreferrer\">" +
          esc(cta.texto) +
          "</a>"
        : "";
      return (
        "<article class=\"promo-card\">" +
        (img ? "<div class=\"promo-card__media\">" + img + "</div>" : "") +
        "<div class=\"promo-card__body\">" +
        "<h3 class=\"promo-card__title\">" + esc(p.titulo) + "</h3>" +
        "<p class=\"promo-card__text\">" + esc(p.descripcion || "") + "</p>" +
        precio + vigHtml + ctaHtml +
        "</div></article>"
      );
    })
    .join("");
})();
