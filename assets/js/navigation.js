(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var mobileLinks = mobileNav ? mobileNav.querySelectorAll("a") : [];

  function setHeaderState() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  function openMenu() {
    if (!toggle || !mobileNav) return;
    mobileNav.hidden = false;
    requestAnimationFrame(function () {
      mobileNav.classList.add("is-open");
    });
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú de navegación");
    document.body.classList.add("nav-open");
  }

  function closeMenu() {
    if (!toggle || !mobileNav) return;
    mobileNav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú de navegación");
    document.body.classList.remove("nav-open");
    window.setTimeout(function () {
      if (!mobileNav.classList.contains("is-open")) {
        mobileNav.hidden = true;
      }
    }, 350);
  }

  function isMenuOpen() {
    return toggle && toggle.getAttribute("aria-expanded") === "true";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      if (isMenuOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  Array.prototype.forEach.call(mobileLinks, function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isMenuOpen()) {
      closeMenu();
      toggle.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768 && isMenuOpen()) {
      closeMenu();
    }
  });

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();
})();
