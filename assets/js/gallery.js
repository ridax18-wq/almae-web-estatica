(function () {
  "use strict";

  var grid = document.getElementById("galeria-grid");
  var lightbox = document.getElementById("lightbox");
  if (!grid || !lightbox) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll(".gallery-item"));
  var current = 0;
  var lastFocus = null;
  var imgEl = lightbox.querySelector(".lightbox__img");
  var captionEl = lightbox.querySelector(".lightbox__caption");
  var counterEl = lightbox.querySelector(".lightbox__counter");
  var btnClose = lightbox.querySelector(".lightbox__close");
  var btnPrev = lightbox.querySelector(".lightbox__prev");
  var btnNext = lightbox.querySelector(".lightbox__next");

  function open(i, trigger) {
    current = i;
    lastFocus = trigger || document.activeElement;
    update();
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    btnClose.focus();
    document.addEventListener("keydown", onKey);
  }

  function close() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    document.removeEventListener("keydown", onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function update() {
    var item = items[current];
    if (!item) return;
    var src = item.getAttribute("data-full") || item.querySelector("img").getAttribute("src");
    var alt = item.querySelector("img").getAttribute("alt") || "";
    imgEl.src = src;
    imgEl.alt = alt;
    if (captionEl) captionEl.textContent = alt;
    if (counterEl) counterEl.textContent = (current + 1) + " / " + items.length;
  }

  function step(delta) {
    current = (current + delta + items.length) % items.length;
    update();
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
    if (e.key === "Tab") {
      var focusables = lightbox.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])");
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  items.forEach(function (item, i) {
    item.addEventListener("click", function () {
      open(i, item);
    });
  });

  if (btnClose) btnClose.addEventListener("click", close);
  if (btnPrev) btnPrev.addEventListener("click", function () { step(-1); });
  if (btnNext) btnNext.addEventListener("click", function () { step(1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });
})();
