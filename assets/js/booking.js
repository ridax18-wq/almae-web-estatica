/**
 * ALMAE – Formulario de solicitud de citas (HITO 4)
 * La web NO confirma reservas, NO bloquea horarios y NO almacena datos.
 * Solo construye el resumen y deriva la solicitud a WhatsApp.
 */
(function () {
  "use strict";

  var form = document.getElementById("booking-form");
  if (!form) return;

  var servicios = (window.ALMAE_SERVICIOS || [])
    .filter(function (s) {
      // Solo servicios activos, visibles y reservables entran al formulario.
      if (!s || s.visible === false || s.estado === "inactivo") return false;
      if (s.reservable === false) return false;
      return true;
    })
    .sort(function (a, b) {
      var oa = typeof a.orden === "number" ? a.orden : 999;
      var ob = typeof b.orden === "number" ? b.orden : 999;
      return oa - ob;
    });
  var categorias = window.ALMAE_CATEGORIAS || [];
  var tarifas = window.ALMAE_TARIFAS || {};

  var el = {
    nombre: document.getElementById("campo-nombre"),
    apellido: document.getElementById("campo-apellido"),
    celular: document.getElementById("campo-celular"),
    servicio: document.getElementById("campo-servicio"),
    modalidadWrap: document.getElementById("campo-modalidad"),
    modalidades: document.getElementById("modalidad-opciones"),
    precio: document.getElementById("resumen-precio"),
    fecha: document.getElementById("campo-fecha"),
    hora: document.getElementById("campo-hora"),
    comentarios: document.getElementById("campo-comentarios"),
    consent: document.getElementById("campo-consentimiento"),
    promo: document.getElementById("campo-promociones"),
    summary: document.getElementById("resumen-solicitud"),
    summaryList: document.getElementById("resumen-lista"),
    summaryTitle: document.getElementById("resumen-title"),
    btnWhatsapp: document.getElementById("btn-whatsapp"),
    btnEditar: document.getElementById("btn-editar"),
    altLink: document.getElementById("enlace-whatsapp-alt")
  };

  var resumenData = null;

  /* ---------- utilidades ---------- */

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
      var day = String(d.getDate()).padStart(2, "0");
      return d.getFullYear() + "-" + m + "-" + day;
    }
  }

  function fechaDDMMYYYY(valorISO) {
    if (!valorISO) return "";
    var p = valorISO.split("-");
    if (p.length !== 3) return valorISO;
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function normalizarCelular(valor) {
    var digitos = String(valor || "").replace(/\D/g, "");
    if (digitos.length === 11 && digitos.indexOf("51") === 0) {
      digitos = digitos.slice(2);
    }
    return digitos;
  }

  function servicioActual() {
    var id = el.servicio.value;
    for (var i = 0; i < servicios.length; i++) {
      if (servicios[i].id === id) return servicios[i];
    }
    return null;
  }

  function modalidadSeleccionada() {
    var checked = form.querySelector('input[name="modalidad"]:checked');
    return checked ? checked.value : "";
  }

  function etiquetaModalidad(valor) {
    return valor === "domicilio" ? "Domicilio" : "Consultorio";
  }

  function tarifaServicio(servicio, modalidad) {
    if (!servicio || !servicio.tarifaId || !tarifas[servicio.tarifaId]) {
      return null;
    }
    var t = tarifas[servicio.tarifaId];
    var m = t.moneda || "S/";
    if (modalidad === "domicilio" && t.modalidadDomicilio && t.domicilio != null) {
      return "Domicilio " + m + " " + t.domicilio;
    }
    if (t.consultorio != null) {
      return "Consultorio " + m + " " + t.consultorio;
    }
    return null;
  }

  /* ---------- render de select, modalidad y precio ---------- */

  function poblarSelect() {
    categorias.forEach(function (cat) {
      var enCat = servicios.filter(function (s) {
        return s.categoria === cat.id;
      });
      if (!enCat.length) return;
      var group = document.createElement("optgroup");
      group.label = cat.nombre;
      enCat.forEach(function (s) {
        var opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = s.nombre;
        group.appendChild(opt);
      });
      el.servicio.appendChild(group);
    });
  }

  function renderModalidades() {
    var servicio = servicioActual();
    var opciones = servicio && Array.isArray(servicio.modalidades)
      ? servicio.modalidades
      : [];
    el.modalidades.innerHTML = "";
    if (!servicio) {
      el.modalidadWrap.hidden = true;
      return;
    }
    el.modalidadWrap.hidden = false;
    opciones.forEach(function (valor) {
      var id = "mod-" + valor;
      var label = document.createElement("label");
      label.className = "modality-option";
      label.setAttribute("for", id);
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "modalidad";
      input.id = id;
      input.value = valor;
      if (valor === "consultorio") input.checked = true;
      var span = document.createElement("span");
      span.textContent = etiquetaModalidad(valor);
      label.appendChild(input);
      label.appendChild(span);
      el.modalidades.appendChild(label);
    });
    if (opciones.length === 1 && opciones[0] === "consultorio") {
      var unico = el.modalidades.querySelector("input");
      if (unico) unico.checked = true;
    }
  }

  function renderPrecio() {
    var servicio = servicioActual();
    var modalidad = modalidadSeleccionada() || "consultorio";
    var texto = tarifaServicio(servicio, modalidad);
    if (texto) {
      el.precio.textContent = "Tarifa informativa (" + etiquetaModalidad(modalidad) + "): " + texto.replace(/^[A-Za-záéíóú]+ /, "");
      el.precio.classList.remove("booking-price--empty");
    } else {
      el.precio.textContent = "Tarifa por consultar";
      el.precio.classList.add("booking-price--empty");
    }
  }

  function alCambiarServicio() {
    renderModalidades();
    renderPrecio();
    ocultarError("servicio");
  }

  /* ---------- errores de validación ---------- */

  function mostrarError(campo, mensaje) {
    var input = el[campo] || document.getElementById("campo-" + campo);
    var error = document.getElementById("error-" + campo);
    if (error) {
      error.textContent = mensaje;
      error.hidden = false;
    }
    if (input && input.setAttribute && input.matches && input.matches("input, select, textarea")) {
      input.setAttribute("aria-invalid", "true");
    }
    var grupo = input && input.closest ? input.closest(".field") : null;
    if (grupo) grupo.classList.add("field--error");
  }

  function ocultarError(campo) {
    var input = el[campo] || document.getElementById("campo-" + campo);
    var error = document.getElementById("error-" + campo);
    if (error) {
      error.textContent = "";
      error.hidden = true;
    }
    if (input && input.removeAttribute && input.matches && input.matches("input, select, textarea")) {
      input.removeAttribute("aria-invalid");
    }
    var grupo = input && input.closest ? input.closest(".field") : null;
    if (grupo) grupo.classList.remove("field--error");
  }

  function validar() {
    var errores = [];

    if (!el.nombre.value.trim()) {
      mostrarError("nombre", "Ingresa tu nombre.");
      errores.push(el.nombre);
    } else {
      ocultarError("nombre");
    }

    if (!el.apellido.value.trim()) {
      mostrarError("apellido", "Ingresa tu apellido.");
      errores.push(el.apellido);
    } else {
      ocultarError("apellido");
    }

    var digitos = normalizarCelular(el.celular.value);
    if (!/^\d{9}$/.test(digitos) || digitos.charAt(0) !== "9") {
      mostrarError(
        "celular",
        "Ingresa un celular válido: 9 dígitos que empiecen con 9 (ej. 919 608 174)."
      );
      errores.push(el.celular);
    } else {
      ocultarError("celular");
    }

    if (!servicioActual()) {
      mostrarError("servicio", "Selecciona un servicio de la lista.");
      errores.push(el.servicio);
    } else {
      ocultarError("servicio");
    }

    if (!modalidadSeleccionada()) {
      mostrarError("modalidad", "Selecciona la modalidad de atención.");
      errores.push(el.modalidades.querySelector("input") || el.servicio);
    } else {
      ocultarError("modalidad");
    }

    var hoy = hoyLima();
    if (!el.fecha.value) {
      mostrarError("fecha", "Selecciona una fecha preferida.");
      errores.push(el.fecha);
    } else if (el.fecha.value < hoy) {
      mostrarError("fecha", "La fecha no puede ser anterior a hoy (" + fechaDDMMYYYY(hoy) + ").");
      errores.push(el.fecha);
    } else {
      ocultarError("fecha");
    }

    if (!el.hora.value) {
      mostrarError("hora", "Selecciona una hora preferida.");
      errores.push(el.hora);
    } else {
      ocultarError("hora");
    }

    if (!el.consent.checked) {
      mostrarError(
        "consentimiento",
        "Debes aceptar el tratamiento de datos para continuar."
      );
      errores.push(el.consent);
    } else {
      ocultarError("consentimiento");
    }

    return errores;
  }

  /* ---------- vistas: formulario y resumen ---------- */

  function construirDatos() {
    var servicio = servicioActual();
    var modalidad = modalidadSeleccionada();
    var tarifa = tarifaServicio(servicio, modalidad);
    return {
      nombreCompleto: (el.nombre.value.trim() + " " + el.apellido.value.trim()).trim(),
      celular: normalizarCelular(el.celular.value),
      servicio: servicio ? servicio.nombre : "",
      modalidad: etiquetaModalidad(modalidad),
      fecha: fechaDDMMYYYY(el.fecha.value),
      hora: el.hora.value,
      tarifaTexto: tarifa || "Por consultar",
      comentarios: el.comentarios.value.trim(),
      // Consentimiento de publicidad (opcional, nunca obligatorio).
      promociones: !!(el.promo && el.promo.checked)
    };
  }

  function filaResumen(etiqueta, valor) {
    var dt = document.createElement("dt");
    dt.className = "summary-list__label";
    dt.textContent = etiqueta;
    var dd = document.createElement("dd");
    dd.className = "summary-list__value";
    dd.textContent = valor;
    return [dt, dd];
  }

  function renderResumen(datos) {
    el.summaryList.innerHTML = "";
    var filas = [
      ["Paciente", datos.nombreCompleto],
      ["Teléfono", datos.celular],
      ["Servicio", datos.servicio],
      ["Modalidad", datos.modalidad],
      ["Fecha preferida", datos.fecha],
      ["Hora preferida", datos.hora],
      ["Tarifa informativa", datos.tarifaTexto]
    ];
    if (datos.comentarios) filas.push(["Comentarios", datos.comentarios]);
    filas.forEach(function (par) {
      filaResumen(par[0], par[1]).forEach(function (nodo) {
        el.summaryList.appendChild(nodo);
      });
    });
  }

  function mostrarResumen() {
    resumenData = construirDatos();
    renderResumen(resumenData);
    // Enlace visible como alternativa si el navegador bloquea la ventana.
    if (el.altLink && window.ALMAE_WhatsApp) {
      el.altLink.href = window.ALMAE_WhatsApp.construirEnlace(resumenData);
    }
    form.hidden = true;
    el.summary.hidden = false;
    el.summaryTitle.focus();
  }

  function mostrarFormulario() {
    el.summary.hidden = true;
    form.hidden = false;
    el.nombre.focus();
  }

  /* ---------- envío a WhatsApp ---------- */

  function enviarPorWhatsapp() {
    if (!resumenData) return;
    if (!window.ALMAE_WhatsApp) return;
    var enlace = window.ALMAE_WhatsApp.construirEnlace(resumenData);
    var ventana = null;
    try {
      ventana = window.open(enlace, "_blank");
    } catch (e) {
      ventana = null;
    }
    if (!ventana) {
      // El navegador bloqueó la ventana: se enfatiza el enlace visible
      // para que la persona continúe manualmente sin perder sus datos.
      if (el.altLink) {
        el.altLink.href = enlace;
        var parrafo = el.altLink.closest(".booking-actions__alt");
        if (parrafo) parrafo.classList.add("is-visible");
        el.altLink.focus();
      }
    }
    // Los datos del formulario se conservan a propósito.
  }

  /* ---------- integración con el catálogo ---------- */

  function seleccionarServicioYIr(id) {
    var existe = servicios.some(function (s) {
      return s.id === id;
    });
    if (!existe) return;
    if (!el.summary.hidden) mostrarFormulario();
    el.servicio.value = id;
    alCambiarServicio();
    var reducida = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var seccion = document.getElementById("reserva");
    if (seccion) {
      seccion.scrollIntoView({
        behavior: reducida ? "auto" : "smooth",
        block: "start"
      });
    }
    el.servicio.focus({ preventScroll: true });
  }

  document.addEventListener("click", function (e) {
    var cta = e.target.closest ? e.target.closest("[data-servicio-cta]") : null;
    if (!cta) return;
    e.preventDefault();
    seleccionarServicioYIr(cta.getAttribute("data-servicio"));
  });

  /* ---------- eventos ---------- */

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var errores = validar();
    if (errores.length) {
      errores[0].focus({ preventScroll: false });
      return;
    }
    mostrarResumen();
  });

  el.servicio.addEventListener("change", alCambiarServicio);

  form.addEventListener("input", function (e) {
    var id = e.target.id || "";
    var mapa = {
      "campo-nombre": "nombre",
      "campo-apellido": "apellido",
      "campo-celular": "celular",
      "campo-servicio": "servicio",
      "campo-fecha": "fecha",
      "campo-hora": "hora",
      "campo-consentimiento": "consentimiento"
    };
    if (mapa[id]) ocultarError(mapa[id]);
    if (id === "campo-servicio") alCambiarServicio();
    if (e.target.name === "modalidad") {
      ocultarError("modalidad");
      renderPrecio();
    }
  });

  el.btnWhatsapp.addEventListener("click", enviarPorWhatsapp);
  el.btnEditar.addEventListener("click", mostrarFormulario);

  /* ---------- init ---------- */

  poblarSelect();
  el.fecha.min = hoyLima();
  renderModalidades();
  renderPrecio();
})();
