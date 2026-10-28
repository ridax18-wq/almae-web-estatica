// Suite de validación del Hito 5 (no modifica archivos del proyecto).
// Las ediciones de datos se simulan interceptando las peticiones de los
// archivos data/*.js y añadiendo al final una sobreescritura en memoria.
// Uso: node hito5-test.js [baseUrl]   (por defecto http://127.0.0.1:8765)
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const BASE = (process.argv[2] || process.env.ALMAE_BASE || "http://127.0.0.1:8765").replace(/\/$/, "");
const ROOT = require("path").resolve(__dirname, "..");
const EDGE = process.env.CHROME_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const results = [];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function check(n, name, ok, detail) {
  results.push({ n, name, ok: !!ok });
  console.log((ok ? "PASS" : "FAIL") + " | " + n + ". " + name + " | " + (detail || ""));
}

async function open(browser, appends, viewport) {
  const pg = await browser.newPage();
  await pg.setViewport(viewport || { width: 1440, height: 900 });
  const errors = [];
  const external = [];
  pg.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  pg.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
  await pg.setRequestInterception(true);
  pg.on("request", (req) => {
    const u = req.url();
    if (u.startsWith("data:") || u.startsWith("blob:")) return req.continue();
    if (!u.startsWith(BASE)) {
      if (/fonts\.(googleapis|gstatic)\.com/.test(u)) return req.continue();
      external.push(u);
      return req.abort();
    }
    const rel = u.slice(BASE.length).replace(/^\//, "").split("?")[0];
    if (appends && appends[rel]) {
      const body = fs.readFileSync(path.join(ROOT, rel), "utf8") + "\n;" + appends[rel];
      return req.respond({ status: 200, contentType: "application/javascript; charset=utf-8", body });
    }
    req.continue();
  });
  await pg.goto(BASE + "/", { waitUntil: "networkidle0", timeout: 60000 });
  await wait(700);
  return { pg, errors, external };
}

async function llenar(pg, o) {
  await pg.evaluate((o) => {
    const set = (sel, v) => {
      const el = document.querySelector(sel);
      el.value = v;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };
    set("#campo-nombre", "José");
    set("#campo-apellido", "Muñoz");
    set("#campo-celular", "919608174");
    set("#campo-servicio", o.servicio);
    set("#campo-fecha", "2099-01-15");
    set("#campo-hora", "10:00");
    if (o.consent) document.getElementById("campo-consentimiento").checked = true;
    if (o.promo) document.getElementById("campo-promociones").checked = true;
  }, o);
}

async function enviar(pg) {
  await pg.click("#btn-revisar");
  await wait(400);
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
  const todosErrores = [];
  const todosExternos = [];

  // 1. Configuración centralizada
  {
    const { pg, errors, external } = await open(browser, {
      "data/config.js": 'window.ALMAE_CONFIG.portada.titulo=["Titulo prueba A","Titulo prueba B"];'
    });
    const t = await pg.evaluate(() => document.getElementById("hero-title").textContent);
    const dir = await pg.evaluate(() => document.querySelector("[data-contenido='direccion.texto']").textContent);
    check(1, "Configuración centralizada: config.js actualiza la portada", t.includes("Titulo prueba A") && dir.includes("Altos del Rímac 250"), "titulo=" + t.slice(0, 40));
    todosErrores.push(...errors); todosExternos.push(...external);
    await pg.close();
  }

  // 2. Servicio inactivo oculto del catálogo y del formulario
  {
    const { pg, errors, external } = await open(browser, {
      "data/servicios.js": 'window.ALMAE_SERVICIOS.forEach(function(s){ if(s.id==="masaje-antiestres-60") s.estado="inactivo"; });'
    });
    const enCatalogo = await pg.evaluate(() => !!document.querySelector('[data-id="masaje-antiestres-60"]'));
    const enSelect = await pg.evaluate(() => !!document.querySelector('#campo-servicio option[value="masaje-antiestres-60"]'));
    const enTarifas = await pg.evaluate(() => document.getElementById("tarifas-lista").textContent.includes("Masaje antiestrés"));
    check(2, "Servicio inactivo: no aparece en catálogo ni en formulario", !enCatalogo && !enSelect, "catalogo=" + enCatalogo + " select=" + enSelect + " tarifas=" + enTarifas);
    todosErrores.push(...errors); todosExternos.push(...external);
    await pg.close();
  }

  // 3. Servicio nuevo válido se puede solicitar; reservable:false no muestra botón
  {
    const { pg, errors, external } = await open(browser, {
      "data/servicios.js": 'window.ALMAE_SERVICIOS.push({id:"prueba-nuevo",nombre:"Servicio Prueba Nuevo",categoria:"masajes",imagen:"assets/images/servicios/masajes.svg",alt:"x",descripcion:"d",beneficios:"b",tarifaId:null,modalidades:["consultorio"],estado:"activo",reservable:true,orden:0,visible:true});' +
        'window.ALMAE_SERVICIOS.push({id:"prueba-info",nombre:"Servicio Solo Info",categoria:"masajes",imagen:"assets/images/servicios/masajes.svg",alt:"x",descripcion:"d",beneficios:"b",tarifaId:null,modalidades:["consultorio"],estado:"activo",reservable:false,orden:0,visible:true});'
    });
    await llenar(pg, { servicio: "prueba-nuevo", consent: true });
    await enviar(pg);
    const resumen = await pg.evaluate(() => document.getElementById("resumen-lista").textContent);
    const sinBoton = await pg.evaluate(() => !document.querySelector('[data-id="prueba-info"] [data-servicio-cta]'));
    const enSelectInfo = await pg.evaluate(() => !!document.querySelector('#campo-servicio option[value="prueba-info"]'));
    check(3, "Servicio nuevo válido solicitable; reservable:false sin botón ni opción de reserva", resumen.includes("Servicio Prueba Nuevo") && sinBoton && !enSelectInfo, "resumen=" + resumen.includes("Servicio Prueba Nuevo") + " sinBoton=" + sinBoton);
    todosErrores.push(...errors); todosExternos.push(...external);
    await pg.close();
  }

  // 4. Tarifas: un cambio en config se propaga a tarjetas, tabla, formulario y mensaje
  {
    const { pg, errors, external } = await open(browser, {
      "data/config.js": 'window.ALMAE_TARIFAS["terapia-fisica"].consultorio = 55;'
    });
    const tarjeta = await pg.evaluate(() => document.querySelector('[data-id="terapia-fisica"] .price-pill').textContent);
    const tabla = await pg.evaluate(() => document.querySelector(".tarifas-table").textContent.includes("S/ 55"));
    await llenar(pg, { servicio: "terapia-fisica", consent: true });
    await enviar(pg);
    const enlace = await pg.evaluate(() => decodeURIComponent(document.getElementById("enlace-whatsapp-alt").href));
    const precioForm = await pg.evaluate(() => document.getElementById("resumen-lista").textContent);
    check(4, "Tarifa actualizada en tarjetas, tabla, resumen y mensaje WhatsApp", tarjeta.includes("S/ 55") && tabla && enlace.includes("S/ 55") && precioForm.includes("S/ 55"), "tarjeta=" + tarjeta);
    todosErrores.push(...errors); todosExternos.push(...external);
    await pg.close();
  }

  // 5. Promoción vigente visible con CTA; sin precio si no está configurado
  {
    const { pg, errors, external } = await open(browser, {
      "data/promociones.js": 'window.ALMAE_PROMOCIONES=[{id:"p1",titulo:"Promo Vigente",descripcion:"Descripcion",imagen:"",servicioId:"masajes",precioPromocional:"",precioRegular:"",fechaInicio:"2000-01-01",fechaFin:"2099-12-31",activa:true,orden:1,cta:{texto:"Consultar promo",mensaje:"Hola promo"}}];'
    });
    const titulo = await pg.evaluate(() => document.querySelector("#bloque-promociones").textContent.includes("Promo Vigente"));
    const cta = await pg.evaluate(() => { const a = document.querySelector(".promo-card__cta"); return a ? a.href : ""; });
    const precio = await pg.evaluate(() => !!document.querySelector(".promo-card__price"));
    check(5, "Promoción vigente visible con CTA; sin precio promocional no configurado", titulo && cta.includes("text=Hola%20promo") && !precio, "cta=" + cta);
    check(7, "Precio promocional no se muestra si no fue configurado", !precio, "precio=" + precio);
    todosErrores.push(...errors); todosExternos.push(...external);
    await pg.close();
  }

  // 6. Promociones vencidas, inválidas o inactivas ocultas (muestra fallback)
  {
    const { pg, errors, external } = await open(browser, {
      "data/promociones.js": 'window.ALMAE_PROMOCIONES=[' +
        '{id:"a",titulo:"PromoVencida",activa:true,fechaInicio:"2000-01-01",fechaFin:"2001-01-01"},' +
        '{id:"b",titulo:"PromoFechaInvalida",activa:true,fechaInicio:"2000-01-01",fechaFin:"2026-02-30"},' +
        '{id:"c",titulo:"PromoInactiva",activa:false,fechaInicio:"2000-01-01",fechaFin:"2099-12-31"}];'
    });
    const txt = await pg.evaluate(() => document.querySelector("#bloque-promociones").textContent);
    const fallback = await pg.evaluate(() => !!document.querySelector(".promo-fallback"));
    const ninguna = !/PromoVencida|PromoFechaInvalida|PromoInactiva/.test(txt);
    check(6, "Promociones vencidas, con fecha inválida o inactivas quedan ocultas", fallback && ninguna, "fallback=" + fallback);
    todosErrores.push(...errors); todosExternos.push(...external);
    await pg.close();
  }

  // 8. Imagen reemplazada se aplica; 9. imagen faltante => placeholder sin romper layout
  {
    const ok = await open(browser, { "data/config.js": 'window.ALMAE_CONFIG.imagenes.hero.ruta="assets/images/consultorio/consultorio-luminoso.jpg";' });
    const src = await ok.pg.evaluate(() => document.querySelector("[data-img='hero']").getAttribute("src"));
    const cargada = await ok.pg.evaluate(() => { const i = document.querySelector("[data-img='hero']"); return i.complete && i.naturalWidth > 0; });
    check(8, "Cambiar la ruta de una imagen en config actualiza la presentación", src.endsWith("consultorio-luminoso.jpg") && cargada, "src=" + src);
    todosErrores.push(...ok.errors); todosExternos.push(...ok.external);
    await ok.pg.close();

    const miss = await open(browser, { "data/config.js": 'window.ALMAE_CONFIG.imagenes.hero.ruta="assets/images/hero/NO-EXISTE.jpg";' });
    await wait(600);
    const info = await miss.pg.evaluate(() => {
      const i = document.querySelector("[data-img='hero']");
      const r = i.getBoundingClientRect();
      return { src: i.getAttribute("src"), cls: i.classList.contains("img-fallback"), w: r.width, h: r.height, overflow: document.documentElement.scrollWidth > window.innerWidth };
    });
    check(9, "Imagen faltante: placeholder elegante y maquetación intacta", info.src.indexOf("placeholder.svg") !== -1 && info.cls && info.w > 0 && !info.overflow, "h=" + Math.round(info.h));
    const esperados = miss.errors.filter((e) => /404/.test(e)); check("9b", "Única alerta en consola de la prueba de imagen faltante es el 404 esperado", miss.errors.length === esperados.length, "404s=" + esperados.length); todosExternos.push(...miss.external);
    await miss.pg.close();
  }

  // 10. WhatsApp: un solo número en config.js; todos los enlaces lo usan
  {
    const { pg, errors, external } = await open(browser, {
      "data/config.js": 'window.ALMAE_CONFIG.whatsapp="51900000000";',
      "data/promociones.js": 'window.ALMAE_PROMOCIONES=[{id:"p1",titulo:"Promo",descripcion:"d",activa:true,fechaInicio:"2000-01-01",fechaFin:"2099-12-31",cta:{texto:"Consultar",mensaje:"Hola"}}];'
    });
    const enlaces = await pg.evaluate(() => Array.from(document.querySelectorAll('a[href*="wa.me"]')).map((a) => a.href));
    const malos = enlaces.filter((h) => h.indexOf("wa.me/51900000000") === -1);
    check(10, "WhatsApp: todos los enlaces usan el número de config.js (" + enlaces.length + " enlaces)", enlaces.length > 0 && malos.length === 0, "malos=" + malos.length);
    todosErrores.push(...errors); todosExternos.push(...external);
    await pg.close();
  }

  // 11. Consentimiento: sin premarcar, promoción opcional, no bloquea
  {
    const { pg, errors, external } = await open(browser, {});
    const premarcados = await pg.evaluate(() => [document.getElementById("campo-consentimiento").checked, document.getElementById("campo-promociones").checked]);
    await llenar(pg, { servicio: "masaje-antiestres-60", consent: false });
    await enviar(pg);
    const bloqueado = await pg.evaluate(() => !document.getElementById("resumen-solicitud").hidden === false);
    const errConsent = await pg.evaluate(() => !document.getElementById("error-consentimiento").hidden);
    await pg.evaluate(() => { document.getElementById("campo-consentimiento").checked = true; });
    await enviar(pg);
    const resumenOk = await pg.evaluate(() => !document.getElementById("resumen-solicitud").hidden);
    const msgSinPromo = await pg.evaluate(() => decodeURIComponent(document.getElementById("enlace-whatsapp-alt").href).includes("información promocional"));
    check(11, "Consentimiento sin premarcar, obligatorio solo para la solicitud y promociones opcionales", premarcados[0] === false && premarcados[1] === false && errConsent && resumenOk && !msgSinPromo, "premarcados=" + premarcados.join("/") + " bloqueado=" + bloqueado);
    todosErrores.push(...errors); todosExternos.push(...external);
    await pg.close();
  }

  // 12. Sin persistencia de datos personales; sin peticiones externas no autorizadas
  {
    const { pg, errors, external } = await open(browser, {});
    await llenar(pg, { servicio: "masaje-antiestres-60", consent: true, promo: true });
    await enviar(pg);
    const storage = await pg.evaluate(() => [localStorage.length, sessionStorage.length, document.cookie.length]);
    const enlace = await pg.evaluate(() => decodeURIComponent(document.getElementById("enlace-whatsapp-alt").href));
    check(12, "Sin LocalStorage, SessionStorage ni cookies con datos personales", storage.every((n) => n === 0) && enlace.includes("información promocional") && external.length === 0, "storage=" + storage.join("/") + " externas=" + external.length);
    todosErrores.push(...errors); todosExternos.push(...external);
    await pg.close();
  }

  // 13. Sin errores JavaScript ni llamadas a Supabase
  {
    const { pg, errors, external } = await open(browser, {});
    await wait(400);
    const sup = external.filter((u) => /supabase/i.test(u)).length;
    check(13, "Sin errores de consola/JavaScript y sin peticiones a Supabase", errors.length === 0 && sup === 0, "errores=" + errors.length + " supabase=" + sup);
    await pg.close();
  }

  // 14. Exclusiones: atencion-profesional no referenciada y protegida en .gitignore
  {
    const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    const jsFiles = ["assets/js", "data"].flatMap((d) => fs.readdirSync(path.join(ROOT, d)).filter((f) => /\.js$/.test(f)).map((f) => path.join(ROOT, d, f)));
    const css = ["assets/css/styles.css", "assets/css/responsive.css"].map((f) => fs.readFileSync(path.join(ROOT, f), "utf8"));
    const todo = [indexHtml, ...jsFiles.map((f) => fs.readFileSync(f, "utf8")), ...css, fs.readFileSync(path.join(ROOT, "robots.txt"), "utf8")].join("\n");
    const refs = todo.indexOf("atencion-profesional") !== -1 || todo.indexOf("assets/images/equipo") !== -1;
    const gi = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf8");
    const protegidos = ["/Imagenes/", "/ALMAEWEB/", "/ALMAE_WEB/", "/assets/images/equipo/"].every((x) => gi.indexOf(x) !== -1);
    check(14, "Fotografía de equipo sin referencias y excluida de Git; directorios antiguos excluidos", !refs && protegidos, "refs=" + refs + " gitignore=" + protegidos);
  }

  // Extra: zona horaria America/Lima en código de vigencia y reservas
  {
    const p = fs.readFileSync(path.join(ROOT, "data/promociones.js"), "utf8");
    const b = fs.readFileSync(path.join(ROOT, "assets/js/booking.js"), "utf8");
    check("X", "Vigencia y fecha mínima usan America/Lima", p.indexOf("America/Lima") !== -1 && b.indexOf("America/Lima") !== -1, "");
  }

  // Extra: responsive 390 / 820 / 1024 / 1440 sin desbordes
  for (const w of [390, 820, 1024, 1440]) {
    const { pg, errors, external } = await open(browser, {}, { width: w, height: 844 });
    const over = await pg.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check("R" + w, "Responsive " + w + " px sin desborde horizontal", over <= 0, "exceso=" + over + "px");
    todosErrores.push(...errors); todosExternos.push(...external);
    await pg.close();
  }

  await browser.close();
  const fallos = results.filter((r) => !r.ok).length;
  console.log("TOTAL: " + results.length + " | PASS: " + (results.length - fallos) + " | FAIL: " + fallos);
  if (todosErrores.length) console.log("ERRORES JS:", JSON.stringify(todosErrores));
  if (todosExternos.length) console.log("PETICIONES EXTERNAS BLOQUEADAS:", JSON.stringify(todosExternos));
  process.exit(fallos ? 1 : 0);
})().catch((e) => { console.error("ERROR SUITE:", e); process.exit(2); });
