const puppeteer = require("puppeteer-core");

const EDGE = process.env.CHROME_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const URL = (process.argv[2] || process.env.ALMAE_BASE || "http://127.0.0.1:8765").replace(/\/$/, "") + "/";
const OUT = process.env.ALMAE_SHOTS || require("path").join(__dirname, ".capturas");
require("fs").mkdirSync(OUT, { recursive: true });

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass: !!pass, detail: detail || "" });
  console.log((pass ? "PASS" : "FAIL") + " | " + name + (detail ? " | " + detail : ""));
}

function hoyLima() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const FUTURO_ISO = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Lima",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date(Date.now() + 7 * 86400000));

function futuroISO(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

const err = (page, campo) =>
  page.$eval("#error-" + campo, (el) => (el.hidden ? null : el.textContent.trim()));

async function enviar(page) {
  await page.click("#btn-revisar");
  await new Promise((r) => setTimeout(r, 250));
}

async function llenarValido(page, extras) {
  extras = extras || {};
  await page.$eval("#campo-nombre", (el) => (el.value = "Jos\u00e9"));
  await page.$eval("#campo-apellido", (el) => (el.value = "Mu\u00f1oz"));
  await page.$eval("#campo-celular", (el) => (el.value = "+51 919 608 174"));
  await page.select("#campo-servicio", extras.servicio || "masaje-antiestres-60");
  await page.$eval("#campo-fecha", (el) => (el.value = window.__futuro));
  await page.$eval("#campo-hora", (el) => (el.value = "15:30"));
  if (extras.comentarios) {
    await page.$eval("#campo-comentarios", (el) => (el.value = window.__coment));
  }
  await page.$eval(
    "#campo-consentimiento",
    (el) => (el.checked = true)
  );
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  const erroresPagina = [];
  const peticiones = [];
  page.on("pageerror", (e) => erroresPagina.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") erroresPagina.push("console: " + m.text());
  });
  page.on("request", (r) => peticiones.push(r.url()));

  await page.evaluateOnNewDocument(() => {
    window.__opened = [];
    window.open = function (url) {
      window.__opened.push(url);
      return { closed: false };
    };
    window.__futuro = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(Date.now() + 7 * 86400000));
    window.__coment = "Prefiero atenci\u00f3n por la tarde. \u00bfQu\u00e9 zona cubren?";
    window.__hoy = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  });

  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });

  /* 1. Selección de servicio desde catálogo */
  await page.evaluate(() => {
    document
      .querySelector('[data-id="masaje-antiestres-60"] [data-servicio-cta]')
      .click();
  });
  await new Promise((r) => setTimeout(r, 900));
  const t1 = await page.evaluate(() => ({
    valor: document.getElementById("campo-servicio").value,
    visible: !document.getElementById("booking-form").hidden,
    precio: document.getElementById("resumen-precio").textContent.trim(),
  }));
  check(
    "1. Selección desde catálogo",
    t1.valor === "masaje-antiestres-60" && t1.visible && /S\/ 70/.test(t1.precio),
    JSON.stringify(t1)
  );

  /* 2. Selección directa en formulario */
  await page.select("#campo-servicio", "terapia-fisica");
  await new Promise((r) => setTimeout(r, 200));
  const t2 = await page.evaluate(() => ({
    valor: document.getElementById("campo-servicio").value,
    modalidades: Array.from(
      document.querySelectorAll('#modalidad-opciones input[type="radio"]')
    ).map((r) => r.value),
    precio: document.getElementById("resumen-precio").textContent.trim(),
  }));
  check(
    "2. Selección directa en formulario",
    t2.valor === "terapia-fisica" &&
      t2.modalidades.length === 2 &&
      /S\/ 50/.test(t2.precio),
    JSON.stringify(t2)
  );

  /* 3-5 y 12: validaciones vacías */
  await page.evaluate(() => {
    document.getElementById("campo-nombre").value = "";
    document.getElementById("campo-apellido").value = "";
    document.getElementById("campo-celular").value = "12345";
    document.getElementById("campo-consentimiento").checked = false;
    document.getElementById("campo-fecha").value = "";
    document.getElementById("campo-hora").value = "";
    document.getElementById("resumen-solicitud").hidden = true;
    document.getElementById("booking-form").hidden = false;
  });
  await enviar(page);
  check(
    "3. Nombre vacío",
    (await err(page, "nombre")) === "Ingresa tu nombre.",
    await err(page, "nombre")
  );
  check(
    "4. Apellido vacío",
    (await err(page, "apellido")) === "Ingresa tu apellido.",
    await err(page, "apellido")
  );
  const e5 = await err(page, "celular");
  check("5. Teléfono inválido", /celular válido/.test(e5 || ""), e5);
  check(
    "12. Consentimiento no marcado",
    (await err(page, "consentimiento")).includes("aceptar"),
    await err(page, "consentimiento")
  );

  /* 6. Fecha pasada */
  await page.evaluate(() => {
    document.getElementById("campo-nombre").value = "Ana";
    document.getElementById("campo-apellido").value = "Prueba";
    document.getElementById("campo-celular").value = "919608174";
    const pasada = new Date();
    pasada.setDate(pasada.getDate() - 3);
    const iso = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(pasada);
    document.getElementById("campo-fecha").value = iso;
    document.getElementById("campo-hora").value = "";
    document.getElementById("campo-consentimiento").checked = true;
  });
  await enviar(page);
  const e6 = await err(page, "fecha");
  check("6. Fecha pasada", /anterior a hoy/.test(e6 || ""), e6);

  /* 7. Fecha futura válida + 8. hora vacía */
  await page.evaluate(() => {
    document.getElementById("campo-fecha").value = window.__futuro;
    document.getElementById("campo-hora").value = "";
  });
  await enviar(page);
  const e7 = await err(page, "fecha");
  const e8 = await err(page, "hora");
  check("7. Fecha futura válida", e7 === null, "error-fecha=" + e7);
  check(
    "8. Hora no seleccionada",
    (e8 || "").includes("hora preferida"),
    e8 || ""
  );

  /* 9. Modalidad: no domicilio en servicio solo consultorio */
  await page.select("#campo-servicio", "acupuntura");
  await new Promise((r) => setTimeout(r, 150));
  const t9a = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('#modalidad-opciones input[type="radio"]')
    ).map((r) => r.value)
  );
  await page.select("#campo-servicio", "terapia-fisica");
  await new Promise((r) => setTimeout(r, 150));
  await page.evaluate(() => {
    const dom = document.querySelector('#modalidad-opciones input[value="domicilio"]');
    dom.checked = true;
    dom.dispatchEvent(new Event("input", { bubbles: true }));
  });
  const t9b = await page.evaluate(() => ({
    checked: document.querySelector('#modalidad-opciones input[value="domicilio"]').checked,
    precio: document.getElementById("resumen-precio").textContent.trim(),
  }));
  check(
    "9. Modalidad válida (sin domicilio indebido)",
    t9a.length === 1 && t9a[0] === "consultorio" && t9b.checked && /Tarifa informativa \(Domicilio\): S\/ 80/.test(t9b.precio),
    JSON.stringify(t9a) + " " + JSON.stringify(t9b)
  );

  /* 10 y 11: tarifa correcta / sin tarifa */
  const t10 = await page.evaluate(() => {
    const s = document.getElementById("campo-servicio");
    s.value = "masaje-antiestres-60";
    s.dispatchEvent(new Event("input", { bubbles: true }));
    return document.getElementById("resumen-precio").textContent.trim();
  });
  check("10. Tarifa correcta", /S\/ 70/.test(t10) && !/S\/ 120 \(/.test(t10), t10);
  const t11 = await page.evaluate(() => {
    const s = document.getElementById("campo-servicio");
    s.value = "acupuntura";
    s.dispatchEvent(new Event("input", { bubbles: true }));
    return document.getElementById("resumen-precio").textContent.trim();
  });
  check("11. Servicio sin tarifa", t11 === "Tarifa por consultar", t11);

  /* 13-16-17: mensaje, tildes, enlace, resumen editable, conservación */
  await llenarValido(page, { servicio: "masaje-antiestres-60", comentarios: true });
  await enviar(page);
  const resumenVisible = await page.evaluate(
    () => !document.getElementById("resumen-solicitud").hidden
  );
  const filas = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#resumen-lista > *")).map((n) =>
      n.textContent.trim()
    )
  );
  check(
    "13. Resumen completo",
    resumenVisible &&
      filas.join(" | ").includes("Jos\u00e9 Mu\u00f1oz") &&
      filas.join(" | ").includes("Masaje antiestr\u00e9s \u2014 60 minutos") &&
      filas.join(" | ").includes("Consultorio S/ 70"),
    filas.join(" | ")
  );

  if (resumenVisible) {
    await page.click("#btn-whatsapp");
    await new Promise((r) => setTimeout(r, 300));
  }
  const opened = await page.evaluate(() => window.__opened.slice());
  const enlace = opened[0] || "";
  const decodificado = enlace ? decodeURIComponent(enlace.split("text=")[1] || "") : "";
  check(
    "15. Enlace wa.me",
    /^https:\/\/wa\.me\/51919608174\?text=/.test(enlace),
    enlace.slice(0, 80)
  );
  check(
    "14. Caracteres especiales y tildes",
    decodificado.includes("Jos\u00e9 Mu\u00f1oz") &&
      decodificado.includes("\u00bfQu\u00e9 zona cubren?") &&
      decodificado.includes("Masaje antiestr\u00e9s \u2014 60 minutos") &&
      decodificado.includes("%C3%A9") === false,
    decodificado.split("\n").slice(0, 8).join(" / ")
  );
  check(
    "13b. Estructura del mensaje",
    decodificado.includes("Hola, ALMAE. \u{1F33F}") &&
      decodificado.includes("DATOS DE MI SOLICITUD") &&
      decodificado.includes("Fecha preferida: " + ddmm(FUTURO_ISO)) &&
      decodificado.includes("Hora preferida: 15:30") &&
      decodificado.includes("Tarifa informativa: Consultorio S/ 70") &&
      decodificado.includes("Comentarios: Prefiero atenci\u00f3n por la tarde") &&
      decodificado.includes("sujeto a disponibilidad") &&
      decodificado.includes("Muchas gracias."),
    decodificado
  );

  /* 17. Conservación de datos tras abrir WhatsApp */
  const t17 = await page.evaluate(() => ({
    nombre: document.getElementById("campo-nombre").value,
    formularioOculto: document.getElementById("booking-form").hidden,
    storage: {
      ls: localStorage.length,
      ss: sessionStorage.length,
      cookie: document.cookie,
    },
  }));
  check(
    "17. Regreso desde WhatsApp (datos conservados)",
    t17.nombre === "Jos\u00e9" && t17.formularioOculto === true,
    JSON.stringify(t17)
  );
  check(
    "Sin almacenamiento persistente",
    t17.storage.ls === 0 && t17.storage.ss === 0 && t17.storage.cookie === "",
    JSON.stringify(t17.storage)
  );

  /* 16. Modificación del resumen */
  await page.click("#btn-editar");
  await new Promise((r) => setTimeout(r, 200));
  const t16 = await page.evaluate(() => ({
    formVisible: !document.getElementById("booking-form").hidden,
    nombre: document.getElementById("campo-nombre").value,
    celular: document.getElementById("campo-celular").value,
    servicio: document.getElementById("campo-servicio").value,
    fecha: document.getElementById("campo-fecha").value,
    consent: document.getElementById("campo-consentimiento").checked,
    foco: document.activeElement.id,
  }));
  check(
    "16. Volver a editar conserva datos",
    t16.formVisible &&
      t16.nombre === "Jos\u00e9" &&
      t16.servicio === "masaje-antiestres-60" &&
      t16.consent === true,
    JSON.stringify(t16)
  );
  console.log("MENSAJE_EJEMPLO_INICIO");
  console.log(decodificado);
  console.log("MENSAJE_EJEMPLO_FIN");

  /* Capturas escritorio */
  await page.screenshot({ path: `${OUT}\\hito4-desktop-form.png` });
  await enviar(page);
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: `${OUT}\\hito4-desktop-resumen.png` });

  /* 19. Tablet 820 */
  await page.setViewport({ width: 820, height: 1100 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(() => {
    document.getElementById("reserva").scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 800));
  const t19 = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    campos: document.querySelectorAll(".field__input").length,
  }));
  check("19. Tablet 820 px sin desborde", t19.overflow === 0 && t19.campos >= 7, JSON.stringify(t19));
  await page.screenshot({ path: `${OUT}\\hito4-tablet-form.png` });

  /* 20. Escritorio 1440 (overflow) */
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  const t20 = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("20. Escritorio 1440 sin desborde", t20 === 0, "overflow=" + t20);

  /* 18. Móvil 390 */
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(() => {
    document.getElementById("reserva").scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 800));
  const t18 = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(".field__input"));
    const sizes = inputs.map((i) => parseFloat(getComputedStyle(i).fontSize));
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      minFontSize: Math.min.apply(null, sizes),
      ctaAncho: Math.round(
        document.getElementById("btn-revisar").getBoundingClientRect().width
      ),
      vw: window.innerWidth,
      telInputmode: document.getElementById("campo-celular").getAttribute("inputmode"),
      fechaType: document.getElementById("campo-fecha").type,
    };
  });
  check(
    "18. Móvil 390 px",
    t18.overflow === 0 &&
      t18.minFontSize >= 16 &&
      t18.ctaAncho > 300 &&
      t18.telInputmode === "tel" &&
      t18.fechaType === "date",
    JSON.stringify(t18)
  );
  await page.screenshot({ path: `${OUT}\\hito4-mobile-form.png`, fullPage: true });

  /* Sin Supabase ni analítica */
  const malas = peticiones.filter((u) => /supabase|analytics|gtag|facebook|api\./i.test(u));
  check("Sin peticiones a Supabase/analítica", malas.length === 0, malas.join(", "));

  check("Sin errores de consola/página", erroresPagina.length === 0, erroresPagina.join(" | "));

  const fallidos = results.filter((r) => !r.pass);
  console.log(
    "\nTOTAL: " + results.length + " | PASS: " + (results.length - fallidos.length) + " | FAIL: " + fallidos.length
  );

  await browser.close();
  process.exit(fallidos.length ? 1 : 0);

  function ddmm(iso) {
    const p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }
})().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
