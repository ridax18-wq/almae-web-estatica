/**
 * ALMAE – Aplicador de contenidos, imágenes y enlaces de WhatsApp.
 *
 * Este módulo toma los datos de data/config.js, data/contenidos.js y el
 * manifiesto de imágenes, y los coloca en la página. Por eso los textos
 * comerciales se editan en los archivos de data/ y NO en index.html.
 *
 * Seguridad: todos los textos se insertan como TEXTO (textContent).
 * Nunca se interpreta HTML proveniente de los archivos de datos.
 */
(function () {
  "use strict";

  var CFG = window.ALMAE_CONFIG || {};
  var CTS = window.ALMAE_CONTENIDOS || {};
  var PLACEHOLDER =
    (CFG.imagenes && CFG.imagenes.placeholder) ||
    "assets/images/placeholder.svg";

  /* ---------- utilidades ---------- */

  function resolver(ruta) {
    if (!ruta) return undefined;
    var partes = String(ruta).split(".");
    var fuentes = [CTS, CFG];
    for (var f = 0; f < fuentes.length; f++) {
      var actual = fuentes[f];
      var encontrada = true;
      for (var i = 0; i < partes.length; i++) {
        if (
          actual == null ||
          typeof actual !== "object" ||
          !(partes[i] in actual)
        ) {
          encontrada = false;
          break;
        }
        actual = actual[partes[i]];
      }
      if (encontrada) return actual;
    }
    return undefined;
  }

  function setText(sel, valor) {
    if (typeof valor !== "string") return;
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (n) {
      n.textContent = valor;
    });
  }

  /* Todos los enlaces de WhatsApp se generan en assets/js/whatsapp.js. */
  function urlWhatsapp(mensaje) {
    return window.ALMAE_WhatsApp.enlace(mensaje);
  }

  /* ---------- 1. Textos genéricos (data-contenido) ---------- */

  document.querySelectorAll("[data-contenido]").forEach(function (nodo) {
    var valor = resolver(nodo.getAttribute("data-contenido"));
    if (typeof valor === "string") nodo.textContent = valor;
  });

  /* ---------- 2. Portada (hero) ---------- */

  var portada = CFG.portada || {};
  setText("[data-hero-badge]", portada.badge);

  var heroTitle = document.getElementById("hero-title");
  if (heroTitle && Array.isArray(portada.titulo)) {
    heroTitle.textContent = "";
    heroTitle.appendChild(document.createTextNode(portada.titulo[0] || ""));
    if (portada.titulo[1]) {
      heroTitle.appendChild(document.createElement("br"));
      var em = document.createElement("em");
      em.textContent = portada.titulo[1];
      heroTitle.appendChild(em);
    }
  }

  var heroText = document.querySelector("[data-hero-texto]");
  if (heroText && portada.texto) {
    heroText.textContent = "";
    heroText.appendChild(document.createTextNode(portada.texto.antes || ""));
    if (portada.texto.marca) {
      var strong = document.createElement("strong");
      strong.textContent = portada.texto.marca;
      heroText.appendChild(strong);
    }
    heroText.appendChild(document.createTextNode(portada.texto.despues || ""));
  }

  var metaItems = document.querySelectorAll(".hero__meta-item");
  if (portada.meta && metaItems.length) {
    // La portada.meta del HTML se actualiza con data-contenido (sección 1);
    // este bloque solo cubre metas agregadas sin atributo en el HTML.
    portada.meta.forEach(function (item, i) {
      var cont = metaItems[i];
      if (!cont || cont.querySelector("[data-contenido]")) return;
      var lab = cont.querySelector(".hero__meta-label");
      var val = cont.querySelector(".hero__meta-value");
      if (lab) lab.textContent = item.etiqueta;
      if (val) val.textContent = item.valor;
    });
  }
  if (portada.card) {
    setText("[data-hero-card-titulo]", portada.card.titulo);
    setText("[data-hero-card-texto]", portada.card.texto);
  }

  /* ---------- 3. Banda de confianza ---------- */

  var trust = CTS.trust || [];
  Array.prototype.forEach.call(
    document.querySelectorAll(".trust-bar__item"),
    function (item, i) {
      if (!trust[i]) return;
      var titulo = item.querySelector(".trust-bar__title");
      var texto = item.querySelector(".trust-bar__text");
      if (titulo) titulo.textContent = trust[i].titulo;
      if (texto) texto.textContent = trust[i].texto;
    }
  );

  /* ---------- 4. Nosotros ---------- */

  var nos = CTS.nosotros || {};
  if (nos.parrafos) {
    setText("[data-nosotros-p1]", nos.parrafos[0]);
    setText("[data-nosotros-p2]", nos.parrafos[1]);
  }
  setText("[data-nosotros-float]", nos.floatTexto);
  (nos.items || []).forEach(function (it, i) {
    setText('[data-nosotros-item="' + i + '"] .about__item-title', it.titulo);
    setText('[data-nosotros-item="' + i + '"] .about__item-text', it.texto);
  });

  /* ---------- 5. Sección Ubicación y Contacto ---------- */

  var ubi = CTS.ubicacion || {};
  if (ubi.cardDireccion) {
    setText("[data-ubi-dir-titulo]", ubi.cardDireccion.titulo);
    setText("[data-ubi-dir-texto]", (CFG.direccion || {}).texto);
    setText("[data-ubi-dir-link]", ubi.cardDireccion.link);
  }
  if (ubi.cardDomicilio) {
    setText("[data-ubi-dom-titulo]", ubi.cardDomicilio.titulo);
    setText("[data-ubi-dom-texto]", ubi.cardDomicilio.texto);
    setText("[data-ubi-dom-link]", ubi.cardDomicilio.link);
  }
  setText("[data-mapa-nota]", ubi.mapaNota);

  var con = CTS.contacto || {};
  if (con.whatsapp) {
    setText("[data-con-wa-titulo]", con.whatsapp.titulo);
    setText("[data-con-wa-texto]", con.whatsapp.texto);
  }
  if (con.consultorio) {
    setText("[data-con-dir-titulo]", con.consultorio.titulo);
    setText("[data-con-dir-texto]", con.consultorio.texto);
  }

  /* ---------- 6. Enlaces de WhatsApp (número centralizado) ---------- */

  document.querySelectorAll("[data-wa]").forEach(function (a) {
    var clave = a.getAttribute("data-wa");
    var mensaje = clave ? resolver(clave) : "";
    a.href = urlWhatsapp(typeof mensaje === "string" ? mensaje : "");
  });

  /* ---------- 7. Imágenes del manifiesto ---------- */

  document.querySelectorAll("[data-img]").forEach(function (img) {
    var slot = (CFG.imagenes || {})[img.getAttribute("data-img")];
    if (!slot || !slot.ruta) return;
    img.setAttribute("src", slot.ruta);
    if (slot.alt) img.setAttribute("alt", slot.alt);
    if (slot.ancho) img.setAttribute("width", String(slot.ancho));
    if (slot.alto) img.setAttribute("height", String(slot.alto));
  });

  /* Placeholder elegante cuando una imagen no existe (también para
     imágenes insertadas por otros módulos: catálogo, promociones, galería). */
  document.addEventListener(
    "error",
    function (e) {
      var img = e.target;
      if (!img || img.tagName !== "IMG") return;
      var actual = img.getAttribute("src") || "";
      if (actual.indexOf("placeholder.svg") !== -1) return;
      img.setAttribute("src", PLACEHOLDER);
      img.classList.add("img-fallback");
    },
    true
  );

  /* ---------- 8. Galería desde el manifiesto ---------- */

  var grid = document.getElementById("galeria-grid");
  if (grid) {
    var fotos = (CFG.imagenes && CFG.imagenes.galeria) || [];
    grid.textContent = "";
    if (!fotos.length) {
      var vacio = document.createElement("p");
      vacio.className = "placeholder-note";
      vacio.textContent =
        "Pronto publicaremos fotografías del consultorio. Mientras tanto, contáctanos por WhatsApp.";
      grid.appendChild(vacio);
    } else {
      fotos.forEach(function (foto) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gallery-item";
        btn.setAttribute("data-full", foto.full || foto.ruta);
        var img = document.createElement("img");
        img.src = foto.ruta;
        img.alt = foto.alt || "Fotografía del consultorio de ALMAE";
        img.loading = "lazy";
        img.decoding = "async";
        if (foto.ancho) img.width = foto.ancho;
        if (foto.alto) img.height = foto.alto;
        btn.appendChild(img);
        grid.appendChild(btn);
      });
    }
  }

  /* ---------- 9. Formulario de reserva: consentimiento y aviso ---------- */

  var res = CTS.reserva || {};

  var consent = document.querySelector("[data-consent-texto]");
  if (consent && res.consentimiento) {
    var c = res.consentimiento;
    consent.textContent = "";
    consent.appendChild(document.createTextNode(c.antes || ""));
    if (c.marca) {
      var m = document.createElement("strong");
      m.textContent = c.marca;
      consent.appendChild(m);
    }
    consent.appendChild(document.createTextNode(c.despues || ""));
    var enlace = document.createElement("a");
    enlace.href = "#aviso-privacidad";
    enlace.textContent = c.enlace || "aviso de privacidad";
    consent.appendChild(enlace);
  }

  setText("[data-consent-promo]", res.consentimientoPromo ? res.consentimientoPromo.texto : "");
  setText("[data-aviso-resumen]", res.avisoResumen);

  var avisoBody = document.querySelector(".privacy-details__body");
  if (avisoBody && res.aviso && res.aviso.parrafos) {
    avisoBody.textContent = "";
    res.aviso.parrafos.forEach(function (p) {
      var nodo = document.createElement("p");
      var fuerte = document.createElement("strong");
      fuerte.textContent = p.titulo + ": ";
      nodo.appendChild(fuerte);
      nodo.appendChild(document.createTextNode(p.cuerpo || ""));
      avisoBody.appendChild(nodo);
    });
  }

  /* ---------- 10. SEO (sin URLs ficticias) ---------- */

  var seo = CFG.seo || {};
  if (seo.titulo) document.title = seo.titulo;

  function meta(sel, valor) {
    if (!valor) return;
    var m = document.querySelector(sel);
    if (m) m.setAttribute("content", valor);
  }
  meta('meta[name="description"]', seo.descripcion);
  meta('meta[property="og:title"]', seo.titulo);
  meta('meta[property="og:description"]', seo.descripcion);
  meta('meta[property="og:site_name"]', CFG.nombre);
  meta('meta[name="twitter:title"]', CFG.nombre);
  meta('meta[name="twitter:description"]', seo.descripcion);

  // Canonical y og:url/og:image SOLO cuando exista la URL pública real.
  if (seo.urlPublica) {
    var base = String(seo.urlPublica).replace(/\/+$/, "") + "/";
    var canon = document.createElement("link");
    canon.rel = "canonical";
    canon.href = base;
    document.head.appendChild(canon);

    var ogUrl = document.createElement("meta");
    ogUrl.setAttribute("property", "og:url");
    ogUrl.setAttribute("content", base);
    document.head.appendChild(ogUrl);

    var heroRuta =
      (CFG.imagenes && CFG.imagenes.hero && CFG.imagenes.hero.ruta) || "";
    if (heroRuta) {
      meta('meta[property="og:image"]', base + heroRuta);
      meta('meta[name="twitter:image"]', base + heroRuta);
    }
  }
})();
