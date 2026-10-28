// Auditoría responsive: métricas automáticas + capturas por sección.
// Resoluciones: 390, 820, 1024 y 1440 px.
// Las capturas se guardan en tests/.capturas (ignorada por Git).
// Uso: node responsive-audit.js [baseUrl]
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const BASE = (process.argv[2] || process.env.ALMAE_BASE || "http://127.0.0.1:8765").replace(/\/$/, "") + "/";
const EDGE = process.env.CHROME_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUT = process.env.ALMAE_SHOTS || path.join(__dirname, ".capturas");
const ANCHOS = [390, 820, 1024, 1440];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let total = 0;
let fallos = 0;

function check(id, name, ok, detail) {
  total++;
  if (!ok) fallos++;
  console.log((ok ? "PASS" : "FAIL") + " | " + id + " | " + name + " | " + (detail || ""));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });

  for (const w of ANCHOS) {
    const movil = w <= 820;
    const pg = await browser.newPage();
    await pg.setViewport({ width: w, height: 900, deviceScaleFactor: 1, isMobile: movil, hasTouch: movil });
    const errores = [];
    pg.on("pageerror", (e) => errores.push(e.message));
    pg.on("console", (m) => { if (m.type() === "error") errores.push(m.text()); });
    await pg.goto(BASE, { waitUntil: "networkidle0", timeout: 60000 });
    await pg.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });
    await wait(600);

    // Desplazamiento completo para cargar imágenes diferidas (loading="lazy").
    await pg.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await wait(1200);

    // Métricas generales
    const m = await pg.evaluate((movil) => {
      const vw = window.innerWidth;
      const over = document.documentElement.scrollWidth - vw;
      const visible = (el) => {
        const st = getComputedStyle(el);
        if (st.display === "none" || st.visibility === "hidden") return false;
        if (el.closest("[hidden]")) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      const textos = Array.from(document.querySelectorAll("body *"))
        .filter((el) => visible(el) && Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 0));
      const tamaños = textos.map((el) => parseFloat(getComputedStyle(el).fontSize));
      const pequeños = textos.filter((el) => parseFloat(getComputedStyle(el).fontSize) < 12 && !el.closest(".site-footer__bottom") && !el.closest(".booking-actions__note"));
      const inputs = Array.from(document.querySelectorAll("input[type=text],input[type=tel],input[type=date],input[type=time],select,textarea")).filter(visible);
      const inputsPequeños = inputs.filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16).length;
      const botones = Array.from(document.querySelectorAll(".btn, .nav-toggle, .filter-btn, .gallery-item, .faq-item__btn, .whatsapp-float")).filter(visible);
      const botonesBajos = botones.filter((el) => el.getBoundingClientRect().height < 40 && !el.classList.contains("gallery-item")).map((el) => (el.textContent.trim() || el.className).slice(0, 30));
      const h1 = document.querySelector("h1");
      const h1Tam = h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0;
      const imgs = Array.from(document.images);
      const imgsFallidas = imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute("src")).map((i) => i.getAttribute("src"));
      const imgsSinAlt = imgs.filter((i) => !i.hasAttribute("alt")).length;
      const fueraDeVista = imgs.filter((i) => visible(i) && i.getBoundingClientRect().right > vw + 1).length;
      const footerLinks = Array.from(document.querySelectorAll(".site-footer a")).filter(visible).length;
      return { vw, over, tamMin: Math.min(...tamaños), tamMax: Math.max(...tamaños), pequeños: pequeños.length, inputsPequeños, inputs: inputs.length, botonesBajos, h1Tam, imgsFallidas, imgsSinAlt, fueraDeVista, footerLinks, botones: botones.length };
    }, movil);

    check("W" + w + "a", "sin desborde horizontal", m.over <= 0, "exceso=" + m.over + "px");
    check("W" + w + "b", "texto legible (mínimo ≥ 12px en contenido, excepto notas)", m.pequeños === 0, "textos<12px=" + m.pequeños + " mín=" + m.tamMin.toFixed(1));
    check("W" + w + "c", "campos del formulario ≥ 16px (evita zoom automático en iOS)", m.inputsPequeños === 0, "campos=" + m.inputs + " <16px=" + m.inputsPequeños);
    check("W" + w + "d", "botones y controles con altura ≥ 40px", m.botonesBajos.length === 0, m.botonesBajos.slice(0, 4).join(" | ") || "ok");
    check("W" + w + "e", "imágenes cargadas sin enlaces rotos", m.imgsFallidas.length === 0, m.imgsFallidas.join(",") || "ok");
    check("W" + w + "f", "todas las imágenes tienen atributo alt", m.imgsSinAlt === 0, "sinAlt=" + m.imgsSinAlt);
    check("W" + w + "g", "H1 presente con tamaño coherente", m.h1Tam >= (movil ? 26 : 40), "h1=" + m.h1Tam.toFixed(0) + "px");
    check("W" + w + "h", "sin errores de JavaScript", errores.length === 0, errores.join(" | ").slice(0, 120));

    // Menú móvil
    if (movil) {
      await pg.click("#nav-toggle");
      await wait(450);
      const menu = await pg.evaluate(() => {
        const nav = document.getElementById("mobile-nav");
        const r = nav.getBoundingClientRect();
        return { abierto: !nav.hidden, dentro: r.right <= window.innerWidth + 1, alturaOk: r.height > 200 };
      });
      check("W" + w + "i", "menú móvil abre dentro de la pantalla", menu.abierto && menu.dentro, "");
      await pg.screenshot({ path: path.join(OUT, "resp-" + w + "-menu.png") });
      await pg.click("#nav-toggle");
      await wait(400);
    }

    // Lightbox de galería
    await pg.evaluate(() => document.getElementById("galeria").scrollIntoView());
    await wait(700);
    await pg.click(".gallery-item");
    await wait(400);
    const lb = await pg.evaluate(() => {
      const img = document.querySelector(".lightbox__img");
      const r = img.getBoundingClientRect();
      const box = document.querySelector(".lightbox__inner").getBoundingClientRect();
      return { abierto: !document.getElementById("lightbox").hidden, dentro: r.right <= window.innerWidth + 1 && r.bottom <= window.innerHeight + 1 && r.left >= -1, cerrarVisible: !!document.querySelector(".lightbox__close").offsetParent, ancho: Math.round(box.width) };
    });
    check("W" + w + "j", "lightbox abre y la imagen cabe en pantalla", lb.abierto && lb.dentro && lb.cerrarVisible, "caja=" + lb.ancho + "px");
    await pg.screenshot({ path: path.join(OUT, "resp-" + w + "-lightbox.png") });
    await pg.keyboard.press("Escape");
    await wait(300);

    // Capturas por sección
    const secciones = [["inicio", "portada"], ["servicios", "servicios"], ["galeria", "galeria"], ["reserva", "reserva"], ["ubicacion", "ubicacion"]];
    for (const [id, nombre] of secciones) {
      await pg.evaluate((id) => { const el = document.getElementById(id); if (el) el.scrollIntoView(); }, id);
      await wait(800);
      const el = await pg.$("#" + id);
      if (el) await el.screenshot({ path: path.join(OUT, "resp-" + w + "-" + nombre + ".png") });
    }
    const footer = await pg.$(".site-footer");
    if (footer) await footer.screenshot({ path: path.join(OUT, "resp-" + w + "-footer.png") });
    console.log("   capturas " + w + " px guardadas en " + OUT);
    await pg.close();
  }

  await browser.close();
  console.log("TOTAL: " + total + " | FAIL: " + fallos);
  process.exit(fallos ? 1 : 0);
})().catch((e) => { console.error("ERROR SUITE:", e); process.exit(2); });
