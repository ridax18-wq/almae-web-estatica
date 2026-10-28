(function () {
  "use strict";

  var cont = document.getElementById("catalogo-servicios");
  var filtros = document.getElementById("filtros-servicios");
  var tarifasCont = document.getElementById("tarifas-lista");
  if (!cont) return;

  var categorias = (window.ALMAE_CATEGORIAS || []).slice();
  var servicios = (window.ALMAE_SERVICIOS || [])
    .filter(function (s) {
      // Solo servicios activos y visibles.
      if (!s || s.visible === false || s.estado === "inactivo") return false;
      return true;
    })
    .sort(function (a, b) {
      var oa = typeof a.orden === "number" ? a.orden : 999;
      var ob = typeof b.orden === "number" ? b.orden : 999;
      return oa - ob;
    });
  var tarifas = window.ALMAE_TARIFAS || {};

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function tarifaTexto(servicio) {
    if (!servicio.tarifaId || !tarifas[servicio.tarifaId]) {
      return { html: "<span class=\"price-pill price-pill--muted\">Consultar tarifa</span>", label: "Consultar tarifa" };
    }
    var t = tarifas[servicio.tarifaId];
    var m = t.moneda || "S/";
    var partes = [];
    if (t.consultorio != null) partes.push("Consultorio " + m + " " + t.consultorio);
    if (t.domicilio != null && t.modalidadDomicilio) partes.push("Domicilio " + m + " " + t.domicilio);
    var html = "<span class=\"price-pill\">" + esc(partes.join(" · ")) + "</span>";
    return { html: html, label: partes.join(" · ") };
  }

  function modalidadesTexto(modalidades) {
    if (!modalidades || !modalidades.length) return "Consultorio";
    return modalidades
      .map(function (m) {
        return m === "domicilio" ? "Domicilio" : "Consultorio";
      })
      .join(" y ");
  }

  function cardHTML(servicio) {
    var tarifa = tarifaTexto(servicio);
    var reservable = servicio.reservable !== false;
    return (
      "<article class=\"service-card\" data-categoria=\"" + esc(servicio.categoria) + "\" data-id=\"" + esc(servicio.id) + "\">" +
      (servicio.imagen
        ? "<div class=\"service-card__media\">" +
          "<img src=\"" + esc(servicio.imagen) + "\" alt=\"" + esc(servicio.alt || servicio.nombre) + "\" loading=\"lazy\" width=\"640\" height=\"480\">" +
          "</div>"
        : // Sin fotografía verificada: espacio neutro reservado, sin icono ni ilustración.
          "<div class=\"service-card__media service-card__media--pendiente\" aria-hidden=\"true\"></div>") +
      "<div class=\"service-card__body\">" +
      "<p class=\"service-card__cat\">" + esc((categorias.find(function (c) { return c.id === servicio.categoria; }) || {}).nombre || "") + "</p>" +
      "<h3 class=\"service-card__title\">" + esc(servicio.nombre) + "</h3>" +
      "<p class=\"service-card__desc\">" + esc(servicio.descripcion) + "</p>" +
      "<p class=\"service-card__benefit\">" + esc(servicio.beneficios || "") + "</p>" +
      "<div class=\"service-card__meta\">" +
      tarifa.html +
      "<span class=\"meta-chip\">" + esc(modalidadesTexto(servicio.modalidades)) + "</span>" +
      "</div>" +
      (reservable
        ? "<a class=\"btn btn--primary service-card__cta\" href=\"#reserva\" data-servicio-cta data-servicio=\"" + esc(servicio.id) + "\">Solicitar cita</a>"
        : "") +
      "</div>" +
      "</article>"
    );
  }

  function render(catId) {
    var lista = servicios.filter(function (s) {
      return catId === "todas" || s.categoria === catId;
    });
    cont.innerHTML = lista.map(cardHTML).join("");
  }

  function renderFiltros() {
    if (!filtros) return;
    var html = categorias.map(function (c, i) {
      var active = i === 0 ? " is-active" : "";
      return (
        "<button type=\"button\" class=\"filter-btn" + active + "\" data-cat=\"" + esc(c.id) + "\" aria-pressed=\"" + (i === 0 ? "true" : "false") + "\">" +
        esc(c.nombre) +
        "</button>"
      );
    }).join("");
    filtros.innerHTML = html;
    filtros.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filtros.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      render(btn.getAttribute("data-cat"));
    });
  }

  function renderTarifas() {
    if (!tarifasCont) return;
    // Solo se listan tarifas referenciadas por servicios activos.
    var claves = Object.keys(tarifas).filter(function (k) {
      return servicios.some(function (s) {
        return s.tarifaId === k;
      });
    });
    if (!claves.length) {
      tarifasCont.innerHTML = "<p class=\"placeholder-note\">Consulta las tarifas actualizadas por WhatsApp.</p>";
      return;
    }
    var rows = claves.map(function (k) {
      var t = tarifas[k];
      var nombre =
        (servicios.find(function (s) { return s.tarifaId === k; }) || {}).nombre || k;
      var dom = t.modalidadDomicilio && t.domicilio != null ? (t.moneda || "S/") + " " + t.domicilio : "—";
      return (
        "<tr>" +
        "<td data-label=\"Servicio\">" + esc(nombre) + "</td>" +
        "<td data-label=\"Consultorio\">" + esc((t.moneda || "S/") + " " + t.consultorio) + "</td>" +
        "<td data-label=\"Domicilio\">" + esc(dom) + "</td>" +
        "</tr>"
      );
    }).join("");
    tarifasCont.innerHTML =
      "<table class=\"tarifas-table\"><thead><tr><th scope=\"col\">Servicio</th><th scope=\"col\">Consultorio</th><th scope=\"col\">Domicilio</th></tr></thead><tbody>" +
      rows +
      "</tbody></table>" +
      "<p class=\"tarifas-note\">La disponibilidad y los valores se confirman por WhatsApp. Servicios sin tarifa publicada muestran «Consultar tarifa».</p>";
  }

  renderFiltros();
  render("todas");
  renderTarifas();
})();
