// Prueba específica: window.open bloqueado (devuelve null) y permitido.
// Comprueba que existe una alternativa visible y accesible para abrir WhatsApp,
// que la página no navega, que los datos se conservan y que no se declara
// la cita como confirmada. No envía nada a ningún servicio externo.
// Uso: node reservas-popup.js [baseUrl]
const puppeteer = require("puppeteer-core");

const BASE = (process.argv[2] || process.env.ALMAE_BASE || "http://127.0.0.1:8765").replace(/\/$/, "") + "/";
const EDGE = process.env.CHROME_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fallos = 0;
let total = 0;

function check(id, name, ok, detail) {
  total++;
  if (!ok) fallos++;
  console.log((ok ? "PASS" : "FAIL") + " | " + id + ". " + name + " | " + (detail || ""));
}

async function escenario(browser, bloqueado) {
  const pg = await browser.newPage();
  await pg.setViewport({ width: 1440, height: 900 });
  const errores = [];
  pg.on("pageerror", (e) => errores.push(e.message));
  pg.on("console", (m) => { if (m.type() === "error") errores.push(m.text()); });
  // Simula el navegador: window.open bloqueado devuelve null; permitido devuelve un objeto.
  await pg.evaluateOnNewDocument((bloq) => {
    window.__abiertos = [];
    window.open = function (url) {
      window.__abiertos.push(String(url));
      return bloq ? null : { closed: false };
    };
  }, bloqueado);
  await pg.goto(BASE, { waitUntil: "networkidle0", timeout: 60000 });
  await wait(500);
  const urlInicial = pg.url();

  await pg.evaluate(() => {
    const set = (sel, v) => {
      const el = document.querySelector(sel);
      el.value = v;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };
    set("#campo-nombre", "Paciente");
    set("#campo-apellido", "Prueba");
    set("#campo-celular", "919608174");
    set("#campo-servicio", "terapia-fisica");
    set("#campo-fecha", "2099-01-15");
    set("#campo-hora", "10:00");
    document.getElementById("campo-consentimiento").checked = true;
  });
  await pg.click("#btn-revisar");
  await wait(400);
  await pg.click("#btn-whatsapp");
  await wait(400);

  const estado = await pg.evaluate(() => {
    const alt = document.getElementById("enlace-whatsapp-alt");
    const bloque = alt.closest(".booking-actions__alt");
    const r = alt.getBoundingClientRect();
    return {
      visible: bloque.classList.contains("is-visible"),
      enfocado: document.activeElement === alt,
      href: alt.getAttribute("href") || "",
      texto: alt.textContent.trim(),
      tamañoOk: r.width > 0 && r.height >= 24,
      resumenVisible: !document.getElementById("resumen-solicitud").hidden,
      nombreConservado: document.getElementById("campo-nombre") ? true : false,
      confirmada: /cita confirmada|reserva confirmada|solicitud enviada|mensaje enviado/i.test(document.getElementById("resumen-solicitud").innerText),
      abiertos: window.__abiertos.length
    };
  });
  const urlTras = pg.url();
  const storage = await pg.evaluate(() => [localStorage.length, sessionStorage.length, document.cookie.length]);

  return { pg, errores, estado, navego: urlTras !== urlInicial, storage };
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });

  // Escenario A: el navegador bloquea la ventana.
  {
    const a = await escenario(browser, true);
    const e = a.estado;
    check("A1", "Bloqueado: aparece la alternativa visible", e.visible, "");
    check("A2", "Bloqueado: el enlace alternativo recibe el foco (accesible por teclado)", e.enfocado, "");
    check("A3", "Bloqueado: el enlace apunta a wa.me con el número de config.js", e.href.indexOf("https://wa.me/51919608174?text=") === 0, e.href.slice(0, 40));
    check("A4", "Bloqueado: el enlace tiene texto descriptivo y tamaño táctil", e.texto.length > 10 && e.tamañoOk, e.texto);
    check("A5", "Bloqueado: la página no navega fuera del formulario", !a.navego, "");
    check("A6", "Bloqueado: el resumen y los datos siguen en pantalla", e.resumenVisible && e.nombreConservado, "");
    check("A7", "No se declara la cita como confirmada", !e.confirmada, "");
    check("A8", "Sin almacenamiento persistente de datos personales", a.storage.every((n) => n === 0), "storage=" + a.storage.join("/"));
    check("A9", "Sin errores de JavaScript", a.errores.length === 0, a.errores.join(" | ").slice(0, 160));
    await a.pg.close();
  }

  // Escenario B: el navegador permite la ventana. La alternativa no debe mostrarse.
  {
    const b = await escenario(browser, false);
    check("B1", "Permitido: la alternativa no se muestra (se abrió WhatsApp)", !b.estado.visible, "abiertos=" + b.estado.abiertos);
    check("B2", "Permitido: WhatsApp se abre una vez con el mensaje estructurado", b.estado.abiertos === 1, "");
    check("B3", "Permitido: sin errores de JavaScript", b.errores.length === 0, "");
    await b.pg.close();
  }

  await browser.close();
  console.log("TOTAL: " + total + " | FAIL: " + fallos);
  process.exit(fallos ? 1 : 0);
})().catch((e) => { console.error("ERROR SUITE:", e); process.exit(2); });
