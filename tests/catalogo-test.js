// Validación del catálogo de servicios (IDs, duplicados, imágenes, filtros, precios, móvil).
// Uso: node catalogo-test.js [baseUrl]
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const puppeteer = require("puppeteer-core");

const ROOT = path.resolve(__dirname, "..");
const BASE = (process.argv[2] || process.env.ALMAE_BASE || "http://127.0.0.1:8765").replace(/\/$/, "") + "/";
const EDGE = process.env.CHROME_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let total = 0, fallos = 0;
const pendientes = [];

function check(id, name, ok, detail) {
  total++;
  if (!ok) fallos++;
  console.log((ok ? "PASS" : "FAIL") + " | " + id + " | " + name + " | " + (detail || ""));
}

// Imágenes validadas: tratamiento correspondiente y sin precios de otro servicio.
const APROBADAS = {
  "assets/images/servicios-fotos/fisioterapia-domicilio.jpg": ["terapia-fisica"],
  "assets/images/servicios-fotos/reductor-consultorio.jpg": ["masaje-estetico-reductor"],
  "assets/images/servicios-fotos/reflexologia-consultorio.jpg": ["reflexologia"]
};

(async () => {
  // Carga de datos en Node (mismos archivos que usa la web)
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "data/config.js"), "utf8"), ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "data/servicios.js"), "utf8"), ctx);
  const S = ctx.window.ALMAE_SERVICIOS, C = ctx.window.ALMAE_CATEGORIAS, T = ctx.window.ALMAE_TARIFAS;
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

  // 1. IDs únicos
  check(1, "IDs de servicio únicos", new Set(S.map((s) => s.id)).size === S.length, S.length + " servicios");

  // 2. Duplicados: nombres idénticos o equivalentes (normalizados)
  const nombres = {};
  S.forEach((s) => { (nombres[norm(s.nombre)] = nombres[norm(s.nombre)] || []).push(s.id); });
  const identicos = Object.values(nombres).filter((g) => g.length > 1);
  check(2, "sin nombres idénticos entre servicios", identicos.length === 0, identicos.map((g) => g.join("/")).join(" ") || "ok");

  // 2b. Posibles duplicados conocidos (informativo; decisión pendiente del responsable)
  pendientes.push("DUPLICADO POSIBLE (decidir): fisioterapia-rehabilitacion ≈ terapia-fisica (mismo tratamiento; solo terapia-fisica tiene tarifa)");
  pendientes.push("DUPLICADO POSIBLE (decidir): masoterapia ≈ masajes-descontracturantes (técnicas manuales similares)");

  // 3. Categoría coherente y sin servicios repetidos entre categorías
  const catIds = new Set(C.map((c) => c.id));
  check(3, "cada servicio pertenece a una categoría existente", S.every((s) => catIds.has(s.categoria)), "");

  // 4. Tarifas referenciadas existen y no se duplican precios en el catálogo
  const tarifasOk = S.every((s) => !s.tarifaId || T[s.tarifaId]);
  check(4, "tarifas referenciadas existen en config.js", tarifasOk, "");

  // 5. Imágenes: solo rutas aprobadas o vacías (pendiente)
  const rutas = S.map((s) => s.imagen).filter(Boolean);
  const noAprobadas = rutas.filter((r) => !APROBADAS[r]);
  check(5, "solo imágenes validadas (o vacías = pendientes)", noAprobadas.length === 0, noAprobadas.join(",") || "ok");
  const existen = rutas.every((r) => fs.existsSync(path.join(ROOT, r)));
  check("5b", "las imágenes asignadas existen en el proyecto", existen, "");
  const asignadoMal = S.filter((s) => s.imagen && (APROBADAS[s.imagen] || []).indexOf(s.id) === -1);
  check("5c", "cada imagen asignada corresponde al servicio indicado", asignadoMal.length === 0, asignadoMal.map((s) => s.id).join(",") || "ok");

  const pendientesImg = S.filter((s) => !s.imagen);
  pendientes.push("IMÁGENES PENDIENTES (" + pendientesImg.length + "): " + pendientesImg.map((s) => s.id).join(", "));

  // Navegador: catálogo renderizado
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
  const pg = await browser.newPage();
  await pg.setViewport({ width: 1440, height: 900 });
  const errores = [];
  pg.on("pageerror", (e) => errores.push(e.message));
  pg.on("console", (m) => { if (m.type() === "error" && !/404/.test(m.text())) errores.push(m.text()); });
  await pg.goto(BASE, { waitUntil: "networkidle0", timeout: 60000 });
  await wait(600);

  const dom = await pg.evaluate(() => Array.from(document.querySelectorAll(".service-card")).map((c) => ({
    id: c.getAttribute("data-id"),
    cat: c.getAttribute("data-categoria"),
    img: (c.querySelector("img") || {}).getAttribute ? c.querySelector("img").getAttribute("src") : null,
    pendiente: !!c.querySelector(".service-card__media--pendiente"),
    cta: !!c.querySelector("[data-servicio-cta]"),
    precio: c.querySelector(".service-card__meta") ? c.querySelector(".service-card__meta").textContent.trim() : ""
  })));

  // 6. Catálogo DOM = servicios visibles de data/servicios.js; sin duplicados
  const visibles = S.map((s) => s.id);
  const domIds = dom.map((d) => d.id);
  check(6, "el catálogo renderiza exactamente los servicios de data/servicios.js sin duplicados",
    JSON.stringify(domIds.slice().sort()) === JSON.stringify(visibles.slice().sort()), "tarjetas=" + dom.length);

  // 7. Imágenes: sin rotas; pendientes sin <img>
  const rotas = await pg.evaluate(() => Array.from(document.images).filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute("src")).map((i) => i.getAttribute("src")));
  check(7, "ninguna imagen del catálogo está rota", rotas.length === 0, rotas.join(",") || "ok");
  const pendDom = dom.filter((d) => d.pendiente);
  check("7b", "servicios sin fotografía muestran espacio neutro (sin imagen ni icono)", pendDom.length === pendientesImg.length && pendDom.every((d) => !d.img), pendDom.length + " pendientes");

  // 8. Servicios sin imagen siguen reservables; el CTA funciona
  const sinCta = dom.filter((d) => !d.cta && S.find((s) => s.id === d.id).reservable !== false);
  check(8, "servicios reservables conservan el botón «Solicitar cita», incluso sin imagen", sinCta.length === 0, "sinCTA=" + sinCta.length);

  // 9. Precios: coherentes con config.js (sin cifras ajenas)
  const erroresPrecio = [];
  for (const d of dom) {
    const s = S.find((x) => x.id === d.id);
    if (!s.tarifaId) { if (!/Consultar tarifa/.test(d.precio)) erroresPrecio.push(d.id); continue; }
    const t = T[s.tarifaId];
    if (d.precio.indexOf("Consultorio S/ " + t.consultorio) === -1) erroresPrecio.push(d.id);
    if (t.modalidadDomicilio && d.precio.indexOf("Domicilio S/ " + t.domicilio) === -1) erroresPrecio.push(d.id);
  }
  check(9, "precios de tarjetas coinciden con config.js", erroresPrecio.length === 0, erroresPrecio.join(",") || "ok");
  const tablaTexto = await pg.evaluate(() => (document.querySelector(".tarifas-table") || { textContent: "" }).textContent);
  const tablaOk = Object.keys(T).every((k) => tablaTexto.indexOf(String(T[k].consultorio)) !== -1);
  check("9b", "tabla de tarifas coincide con config.js", tablaOk, "");

  // 10. Filtros: cada categoría muestra sus servicios; la unión es el catálogo completo; sin duplicados
  const filtros = await pg.$$(".filter-btn");
  const unionIds = [];
  let filtrosOk = true;
  for (let i = 0; i < filtros.length; i++) {
    await filtros[i].click();
    await wait(200);
    const ids = await pg.evaluate(() => Array.from(document.querySelectorAll(".service-card")).map((c) => c.getAttribute("data-id")));
    const cat = await pg.evaluate((b) => b.getAttribute("data-cat"), filtros[i]);
    const esperados = S.filter((s) => s.categoria === cat).map((s) => s.id);
    if (JSON.stringify(ids.slice().sort()) !== JSON.stringify(esperados.slice().sort())) filtrosOk = false;
    unionIds.push(...ids);
  }
  check(10, "filtros: cada categoría muestra exactamente sus servicios, sin duplicados", filtrosOk && new Set(unionIds).size === unionIds.length && new Set(unionIds).size === S.length, filtros.length + " filtros");

  // Móvil 390 px
  const movil = await browser.newPage();
  await movil.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await movil.goto(BASE, { waitUntil: "networkidle0", timeout: 60000 });
  await movil.evaluate(() => document.getElementById("servicios").scrollIntoView());
  await wait(500);
  const mov = await movil.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    tarjetaAncho: Math.round(document.querySelector(".service-card").getBoundingClientRect().width),
    pendMedia: (document.querySelector(".service-card__media--pendiente") || { getBoundingClientRect: () => ({ height: 0 }) }).getBoundingClientRect().height
  }));
  check("M1", "móvil 390 px: sin desbordes y tarjetas dentro de la pantalla", mov.overflow <= 0 && mov.tarjetaAncho <= 390, "ancho=" + mov.tarjetaAncho);
  check("M2", "móvil 390 px: el espacio pendiente conserva la altura de la tarjeta", mov.pendMedia > 100, "h=" + Math.round(mov.pendMedia));
  check("E1", "sin errores de JavaScript en el catálogo", errores.length === 0, errores.join(" | ").slice(0, 120));

  await browser.close();
  console.log("\nIMÁGENES Y ACLARACIONES (no son fallos):");
  pendientes.forEach((p) => console.log("  - " + p));
  console.log("TOTAL: " + total + " | FAIL: " + fallos);
  process.exit(fallos ? 1 : 0);
})().catch((e) => { console.error("ERROR SUITE:", e); process.exit(2); });
