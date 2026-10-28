// Auditoría de SEO, seguridad y privacidad.
// Parte A: revisión estática de los archivos publicables.
// Parte B: comprobaciones en el navegador (metadatos, encabezados, imágenes,
//          datos estructurados y tratamiento seguro de textos).
// Las PENDIENTES no cuentan como fallo: son decisiones o datos que faltan.
// Uso: node seo-privacidad-audit.js [baseUrl]
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const puppeteer = require("puppeteer-core");

const ROOT = path.resolve(__dirname, "..");
const BASE = (process.argv[2] || process.env.ALMAE_BASE || "http://127.0.0.1:8765").replace(/\/$/, "") + "/";
const EDGE = process.env.CHROME_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let total = 0;
let fallos = 0;
const pendientes = [];

function check(id, name, ok, detail) {
  total++;
  if (!ok) fallos++;
  console.log((ok ? "PASS" : "FAIL") + " | " + id + " | " + name + " | " + (detail || ""));
}
function pendiente(id, name, detail) {
  pendientes.push(id + " " + name + (detail ? " — " + detail : ""));
}

// ---------- Parte A: estática ----------
function leer(rel) { return fs.readFileSync(path.join(ROOT, rel), "utf8"); }
function listar(dir, ext) {
  const out = [];
  (function walk(d) {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (ext.test(f.name)) out.push(p);
    }
  })(path.join(ROOT, dir));
  return out;
}
const publicables = [
  ...["index.html", "robots.txt"].map((f) => path.join(ROOT, f)),
  ...listar("assets", /\.(js|css|html|svg)$/),
  ...listar("data", /\.js$/)
];
const textoPublicable = publicables.map((f) => fs.readFileSync(f, "utf8")).join("\n");

check("A1", "Sin Supabase en archivos publicables", !/supabase/i.test(textoPublicable));
check("A2", "Sin patrones de credenciales en archivos publicables",
  !/(service_role|BEGIN (RSA |EC )?PRIVATE KEY|AKIA[0-9A-Z]{16}|sk_live_|eyJhbGciOi)/.test(textoPublicable));
check("A3", "Sin marcadores PLACEHOLDER en archivos publicables", !/PLACEHOLDER_URL/.test(textoPublicable));
const persistencia = listar("assets/js", /\.js$/).filter((f) => /localStorage|sessionStorage|document\.cookie|indexedDB/.test(fs.readFileSync(f, "utf8")));
check("A4", "Ningún módulo escribe en LocalStorage, SessionStorage, cookies o IndexedDB", persistencia.length === 0, persistencia.map((f) => path.basename(f)).join(",") || "ok");
const logs = listar("assets/js", /\.js$/).filter((f) => /console\.(log|info|debug)\(/.test(fs.readFileSync(f, "utf8")));
check("A5", "Sin console.log en el código de producción (no hay datos en logs)", logs.length === 0, logs.map((f) => path.basename(f)).join(",") || "ok");
const innerHTML = listar("assets/js", /\.js$/).reduce((n, f) => n + (fs.readFileSync(f, "utf8").match(/innerHTML\s*=/g) || []).length, 0);
pendiente("INFO", "usos de innerHTML en assets/js: " + innerHTML + " (revisados: los datos pasan por esc() o son plantillas fijas)", "");
check("A6", "Robots.txt permite el rastreo y declara reglas", /User-agent:\s*\*/.test(leer("robots.txt")) && /Allow:\s*\//.test(leer("robots.txt")));
check("A7", ".nojekyll presente", fs.existsSync(path.join(ROOT, ".nojekyll")));
if (!fs.existsSync(path.join(ROOT, "sitemap.xml"))) pendiente("S1", "sitemap.xml no existe", "requiere la URL definitiva de GitHub Pages");

let gitFiles = null;
try {
  gitFiles = execSync("git ls-files", { cwd: ROOT, encoding: "utf8" }).split(/\r?\n/).filter(Boolean);
} catch (e) { gitFiles = null; }
if (gitFiles) {
  const prohibidos = gitFiles.filter((f) => /^(Imagenes|ALMAEWEB|ALMAE_WEB)\//.test(f) || /assets\/images\/equipo\//.test(f) || /ambiente-almae\.jpg$/.test(f) || /(^|\/)\.env/.test(f) || /\.(pem|key)$/.test(f) || /\.capturas\//.test(f) || /node_modules\//.test(f));
  check("A8", "El índice de Git no contiene directorios excluidos, fotos no autorizadas, credenciales ni dependencias", prohibidos.length === 0, prohibidos.join(",") || "ok");
} else {
  pendiente("A8", "no se pudo leer el índice de Git", "");
}

// ---------- Parte B: navegador ----------
(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
  const pg = await browser.newPage();
  await pg.setViewport({ width: 1440, height: 900 });
  const errores = [];
  pg.on("pageerror", (e) => errores.push(e.message));
  pg.on("console", (m) => { if (m.type() === "error") errores.push(m.text()); });
  await pg.goto(BASE, { waitUntil: "networkidle0", timeout: 60000 });
  await wait(500);

  const s = await pg.evaluate(() => {
    const meta = (sel) => { const m = document.querySelector(sel); return m ? m.getAttribute("content") : null; };
    const hs = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"));
    let saltos = 0;
    for (let i = 1; i < hs.length; i++) {
      const a = +hs[i - 1].tagName[1], b = +hs[i].tagName[1];
      if (b > a + 1) saltos++;
    }
    const imgs = Array.from(document.images);
    const ld = document.querySelector('script[type="application/ld+json"]');
    let ldObj = null;
    try { ldObj = ld ? JSON.parse(ld.textContent) : null; } catch (e) { ldObj = "invalido"; }
    const hero = document.querySelector("[data-img='hero']");
    // El visor de galería (oculto) se rellena al abrirse; sus proporciones varían, así que se excluye.
    const sinDimensiones = imgs.filter((i) => !i.closest(".lightbox") && (!i.hasAttribute("width") || !i.hasAttribute("height"))).length;
    const lazy = imgs.filter((i) => i !== hero && i.loading !== "lazy" && !i.closest(".lightbox") && !i.closest(".site-header") && !i.closest(".hero")).length;
    return {
      lang: document.documentElement.lang,
      title: document.title,
      desc: meta('meta[name="description"]') || "",
      h1: document.querySelectorAll("h1").length,
      saltos,
      imgSinAlt: imgs.filter((i) => !i.hasAttribute("alt")).length,
      ogTitle: !!meta('meta[property="og:title"]'),
      ogDesc: !!meta('meta[property="og:description"]'),
      ogSite: !!meta('meta[property="og:site_name"]'),
      ogImage: !!meta('meta[property="og:image"]'),
      canonical: !!document.querySelector('link[rel="canonical"]'),
      ldTipo: ldObj && ldObj["@type"],
      ldTel: ldObj && ldObj.telephone,
      ldDir: ldObj && ldObj.address && ldObj.address.streetAddress,
      sinDimensiones,
      lazy,
      heroPrioridad: hero ? hero.getAttribute("fetchpriority") : null,
      consentimiento: document.getElementById("campo-consentimiento").checked,
      promo: document.getElementById("campo-promociones").checked,
      avisoPendientes: (document.querySelector(".privacy-details__body") ? document.querySelector(".privacy-details__body").textContent : "").match(/\[PENDIENTE[^\]]*\]/g) || []
    };
  });

  check("B1", "Idioma del documento es español (lang=es)", s.lang === "es", s.lang);
  check("B2", "Título entre 30 y 70 caracteres", s.title.length >= 30 && s.title.length <= 70, s.title.length + " car.");
  check("B3", "Metadescripción entre 120 y 160 caracteres", s.desc.length >= 120 && s.desc.length <= 160, s.desc.length + " car.");
  check("B4", "Exactamente un H1", s.h1 === 1, "h1=" + s.h1);
  check("B5", "Jerarquía de encabezados sin saltos de nivel", s.saltos === 0, "saltos=" + s.saltos);
  check("B6", "Todas las imágenes tienen alt", s.imgSinAlt === 0, "sinAlt=" + s.imgSinAlt);
  check("B7", "Open Graph básico presente (título, descripción, sitio)", s.ogTitle && s.ogDesc && s.ogSite, "");
  check("B8", "No se publica og:image sin URL definitiva", !s.ogImage, "");
  check("B9", "Datos estructurados LocalBusiness válidos y con datos confirmados", s.ldTipo === "LocalBusiness" && s.ldTel === "+51 919 608 174" && /Altos del Rímac 250/.test(s.ldDir || ""), s.ldTipo);
  check("B10", "Imágenes con dimensiones declaradas (evita saltos de maquetación)", s.sinDimensiones === 0, "sinDim=" + s.sinDimensiones);
  check("B11", "Imágenes bajo el pliegue con carga diferida; portada con prioridad", s.lazy === 0 && s.heroPrioridad === "high", "lazy-pendientes=" + s.lazy + " hero=" + s.heroPrioridad);
  check("B12", "Consentimiento de datos sin premarcar y promociones sin premarcar", s.consentimiento === false && s.promo === false, "");
  if (!s.canonical) pendiente("S2", "canonical no definido", "se añade al definir seo.urlPublica");
  if (!s.ogImage) pendiente("S3", "og:image no definido", "requiere URL absoluta de la imagen");
  pendiente("P1", "marcadores [PENDIENTE] en el aviso de privacidad: " + s.avisoPendientes.length, "");
  s.avisoPendientes.forEach((m, i) => pendiente("P1." + (i + 1), m.slice(0, 110), ""));

  // B13: tratamiento seguro de textos. Se inyecta HTML en los datos (simulado en memoria).
  const pg2 = await browser.newPage();
  const payload = '<img src="x" onerror="window.__xss=1"><b class="inyectado">negrita</b>';
  await pg2.setViewport({ width: 1440, height: 900 });
  const errores2 = [];
  pg2.on("pageerror", (e) => errores2.push(e.message));
  await pg2.setRequestInterception(true);
  pg2.on("request", (req) => {
    const u = req.url();
    if (!u.startsWith(BASE)) return /fonts\.(googleapis|gstatic)/.test(u) ? req.continue() : req.abort();
    const rel = u.slice(BASE.length).split("?")[0];
    const extra = {
      "data/contenidos.js": 'window.ALMAE_CONTENIDOS.ctaBand.titulo = ' + JSON.stringify(payload) + ';' +
        'window.ALMAE_CONTENIDOS.secciones.servicios.lead = ' + JSON.stringify(payload) + ';',
      "data/config.js": 'window.ALMAE_CONFIG.portada.titulo = [' + JSON.stringify(payload) + ', "b"];',
      "data/promociones.js": 'window.ALMAE_PROMOCIONES = [{id:"x", titulo: ' + JSON.stringify(payload) + ', descripcion: ' + JSON.stringify(payload) + ', activa:true, fechaInicio:"2000-01-01", fechaFin:"2099-12-31"}];'
    };
    if (extra[rel]) {
      const body = fs.readFileSync(path.join(ROOT, rel), "utf8") + "\n;" + extra[rel];
      return req.respond({ status: 200, contentType: "application/javascript; charset=utf-8", body });
    }
    req.continue();
  });
  await pg2.goto(BASE, { waitUntil: "networkidle0", timeout: 60000 });
  await wait(600);
  const x = await pg2.evaluate(() => ({
    xss: window.__xss === 1,
    imgInyectada: document.querySelectorAll('img[src="x"]').length,
    bInyectado: document.querySelectorAll(".inyectado").length,
    textoLiteral: document.querySelector(".cta-band__title").textContent.indexOf('<img src="x"') !== -1,
    heroLiteral: document.getElementById("hero-title").textContent.indexOf("<img") !== -1
  }));
  check("B13", "Textos con HTML en los datos se muestran como texto, sin ejecutarse", !x.xss && x.imgInyectada === 0 && x.bInyectado === 0 && x.textoLiteral, JSON.stringify(x));
  check("B14", "Sin errores de JavaScript con datos hostiles", errores2.length === 0, errores2.join(" | ").slice(0, 120));
  check("B15", "Sin errores de JavaScript en la página real", errores.length === 0, errores.join(" | ").slice(0, 120));
  await pg2.close();
  await pg.close();
  await browser.close();

  console.log("\nPENDIENTES (no cuentan como fallo):");
  pendientes.forEach((p) => console.log("  - " + p));
  console.log("TOTAL: " + total + " | FAIL: " + fallos);
  process.exit(fallos ? 1 : 0);
})().catch((e) => { console.error("ERROR SUITE:", e); process.exit(2); });
