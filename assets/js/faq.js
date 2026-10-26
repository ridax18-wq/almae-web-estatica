(function () {
  "use strict";

  var cont = document.getElementById("faq-lista");
  if (!cont) return;

  var preguntas = window.ALMAE_PREGUNTAS || [];

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  cont.innerHTML = preguntas
    .map(function (p, i) {
      return (
        "<div class=\"faq-item\">" +
        "<h3 class=\"faq-item__q\">" +
        "<button type=\"button\" class=\"faq-item__btn\" aria-expanded=\"false\" aria-controls=\"faq-panel-" + i + "\" id=\"faq-btn-" + i + "\">" +
        "<span>" + esc(p.pregunta) + "</span>" +
        "<span class=\"faq-item__icon\" aria-hidden=\"true\">+</span>" +
        "</button></h3>" +
        "<div class=\"faq-item__a\" id=\"faq-panel-" + i + "\" role=\"region\" aria-labelledby=\"faq-btn-" + i + "\" hidden>" +
        "<p>" + esc(p.respuesta) + "</p>" +
        "</div></div>"
      );
    })
    .join("");

  cont.addEventListener("click", function (e) {
    var btn = e.target.closest(".faq-item__btn");
    if (!btn) return;
    var expanded = btn.getAttribute("aria-expanded") === "true";
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", expanded ? "false" : "true");
    if (panel) panel.hidden = expanded;
  });
})();
