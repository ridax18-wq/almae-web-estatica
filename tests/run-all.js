// Ejecuta todas las suites de la carpeta tests/ contra una URL.
// Uso:  node run-all.js [baseUrl]
//   Por defecto: http://127.0.0.1:8765  (servidor local iniciado con: python -m http.server 8765 en la raíz del proyecto)
// Variables opcionales:
//   ALMAE_BASE    URL base (equivale al argumento)
//   CHROME_PATH   ruta a msedge.exe / chrome.exe si no está en la ruta por defecto
//   ALMAE_SHOTS   carpeta para capturas (por defecto tests/.capturas, ignorada por Git)
const { spawnSync } = require("child_process");
const path = require("path");

const base = process.argv[2] || process.env.ALMAE_BASE || "http://127.0.0.1:8765";
const suites = ["booking-test.js", "hito5-test.js", "reservas-popup.js", "responsive-audit.js", "seo-privacidad-audit.js", "catalogo-test.js"];
let fallos = 0;

for (const s of suites) {
  const archivo = path.join(__dirname, s);
  const fs = require("fs");
  if (!fs.existsSync(archivo)) {
    console.log("OMITIDA (no existe): " + s);
    continue;
  }
  console.log("\n===== " + s + " =====");
  const r = spawnSync(process.execPath, [archivo, base], { stdio: "inherit", env: process.env });
  if (r.status !== 0) {
    fallos++;
    console.log("-> " + s + " terminó con código " + r.status);
  }
}

console.log("\nSuites con fallos: " + fallos);
process.exit(fallos ? 1 : 0);
