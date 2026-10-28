#Requires -Version 5.1
<#
  ALMAE - Sincronizacion con GitHub (repositorio privado).

  Uso:
    .\scripts\sincronizar-github.ps1
    .\scripts\sincronizar-github.ps1 -Mensaje "feat: descripcion del cambio"
    .\scripts\sincronizar-github.ps1 -Puerto 8766

  Flujo:
    1. Valida que esta en D:\ALMAE, en la rama main y con origin correcto.
    2. Detecta cambios pendientes (si no hay, termina sin commit).
    3. Rechaza rutas protegidas.
    4. Ejecuta las 141 pruebas contra un servidor local temporal.
    5. Si algo falla, cancela sin tocar el repositorio.
    6. Si todo pasa, crea el commit y hace push a origin/main.
    7. Verifica que GitHub reciba el mismo hash.

  Nunca usa push --force, git add -f ni comandos destructivos.
  No cambia la visibilidad del repositorio ni activa GitHub Pages.
#>
param(
  [string]$Mensaje = "",
  [int]$Puerto = 8765
)

$ErrorActionPreference = "Stop"
$RAIZ = "D:\ALMAE"
$ORIGEN_ESPERADO = "ridax18-wq/almae-web-estatica"
$RUTAS_PROHIBIDAS = @(
  '^Imagenes/',
  '^ALMAEWEB/',
  '^ALMAE_WEB/',
  'node_modules',
  '\.capturas',
  '(^|/)\.env($|\.)',
  '\.pem$',
  '\.key$',
  '^assets/images/equipo/',
  'backup',
  '\.bundle$'
)
$PATRON_CREDENCIALES = 'BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{22,}|service_role\s*[:=]|xox[baprs]-[A-Za-z0-9-]{10,}|sk_live_[0-9a-zA-Z]{10,}'

function Salir([string]$Motivo, [int]$Codigo) {
  Write-Host ""
  Write-Host ("SINCRONIZACION CANCELADA: " + $Motivo) -ForegroundColor Red
  exit $Codigo
}

# --- 1. Directorio de trabajo ---
$topo = (git -C $RAIZ rev-parse --show-toplevel 2>$null)
if (-not $topo) { Salir "No es un repositorio Git: $RAIZ" 1 }
if ((Resolve-Path $topo).Path -ne (Resolve-Path $RAIZ).Path) {
  Salir "El repositorio actual no es $RAIZ (es $topo)" 1
}
Set-Location $RAIZ
Write-Host "[1/13] Repositorio local: $RAIZ" -ForegroundColor Cyan

# --- 2. Remoto origin ---
$origin = (git remote get-url origin 2>$null)
if (-not $origin) { Salir "No existe el remoto origin." 1 }
if ($origin -notmatch [regex]::Escape($ORIGEN_ESPERADO)) {
  Salir "origin apunta a '$origin' y no a $ORIGEN_ESPERADO" 1
}
Write-Host "[2/13] origin correcto: $origin" -ForegroundColor Cyan

# --- 3. Rama main ---
$rama = (git rev-parse --abbrev-ref HEAD)
if ($rama -ne "main") { Salir "La rama activa es '$rama'; se espera 'main'." 1 }
Write-Host "[3/13] Rama activa: main" -ForegroundColor Cyan

# --- 4. Cambios pendientes ---
$status = (git status --porcelain)
if (-not $status) {
  Write-Host ""
  Write-Host "Sin cambios pendientes. Nada que sincronizar." -ForegroundColor Green
  exit 0
}
$cambios = ($status -split "`r?`n") | Where-Object { $_ }
Write-Host ("[4/13] Cambios detectados: " + $cambios.Count) -ForegroundColor Cyan
foreach ($c in $cambios) { Write-Host ("       " + $c) }

# --- 5. Rutas protegidas en el estado ---
foreach ($linea in $cambios) {
  $ruta = $linea.Substring(3).Trim('"')
  foreach ($patron in $RUTAS_PROHIBIDAS) {
    if ($ruta -match $patron) {
      Salir "Ruta protegida detectada: '$ruta' (patron $patron). No se sincroniza." 1
    }
  }
}
Write-Host "[5/13] Sin rutas protegidas en los cambios" -ForegroundColor Cyan

# --- 6 y 7. Pruebas automatizadas ---
Write-Host "[6/13] Preparando servidor local en el puerto $Puerto..." -ForegroundColor Cyan
$serverYaActivo = $false
try {
  $r = Invoke-WebRequest -Uri ("http://127.0.0.1:" + $Puerto + "/") -UseBasicParsing -TimeoutSec 2
  if ($r.StatusCode -eq 200) { $serverYaActivo = $true }
} catch { }

$serverProc = $null
if (-not $serverYaActivo) {
  $serverProc = Start-Process -FilePath "python" -ArgumentList @("-m", "http.server", "$Puerto") `
    -WorkingDirectory $RAIZ -WindowStyle Hidden -PassThru
  $listo = $false
  for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Milliseconds 500
    try {
      $r = Invoke-WebRequest -Uri ("http://127.0.0.1:" + $Puerto + "/") -UseBasicParsing -TimeoutSec 2
      if ($r.StatusCode -eq 200) { $listo = $true; break }
    } catch { }
  }
  if (-not $listo) {
    if ($serverProc) { Stop-Process -Id $serverProc.Id -Force -ErrorAction SilentlyContinue }
    Salir "El servidor local no arranco en el puerto $Puerto." 1
  }
  Write-Host ("       Servidor iniciado (pid " + $serverProc.Id + ")") -ForegroundColor DarkGray
} else {
  Write-Host "       Puerto $Puerto ya activo; se reutiliza." -ForegroundColor DarkGray
}

Write-Host "[7/13] Ejecutando las pruebas (run-all.js)..." -ForegroundColor Cyan
$base = "http://127.0.0.1:" + $Puerto
Push-Location (Join-Path $RAIZ "tests")
try {
  & node run-all.js $base
  $codigoPruebas = $LASTEXITCODE
} finally {
  Pop-Location
  if ($serverProc) { Stop-Process -Id $serverProc.Id -Force -ErrorAction SilentlyContinue }
}
if ($codigoPruebas -ne 0) {
  Salir "Las pruebas han fallado (codigo $codigoPruebas). No se crea commit ni se hace push." 1
}
Write-Host "[8/13] Pruebas superadas" -ForegroundColor Cyan

# --- 9. Preparar staged y escanear credenciales ---
Write-Host "[9/13] Preparando archivos autorizados y escaneando credenciales..." -ForegroundColor Cyan
git add -A
if (-not (git diff --cached --name-only)) {
  Salir "Tras preparar los archivos autorizados no queda nada staged (todo era ignorado)." 0
}
$staged = (git diff --cached --name-only) -split "`r?`n" | Where-Object { $_ }
# Revisar rutas staged contra los patrones protegidos
foreach ($ruta in $staged) {
  foreach ($patron in $RUTAS_PROHIBIDAS) {
    if ($ruta -match $patron) {
      git reset -q
      Salir "Ruta protegida quedo staged: '$ruta'. Se revirtio el staging." 1
    }
  }
}
# Escanear el contenido staged en busca de secretos
$escaneo = (git diff --cached -U0 2>$null) -join "`n"
if ($escaneo -match $PATRON_CREDENCIALES) {
  git reset -q
  Salir "Se detecto un posible secreto en los cambios staged. Se revirtio el staging; nada se ha enviado." 1
}
foreach ($linea in $cambios) {
  $ruta = $linea.Substring(3).Trim('"')
  if ($ruta -match '(?i)(id_rsa|id_ed25519|\.pfx|\.p12|credentials\.json)') {
    git reset -q
    Salir "Archivo privado detectado: '$ruta'. Se revirtio el staging; nada se ha enviado." 1
  }
}
Write-Host ("       " + $staged.Count + " archivo(s) autorizado(s), sin credenciales") -ForegroundColor Cyan

# --- 10. Commit ---
if (-not $Mensaje) {
  $Mensaje = "chore: sincronizar cambios locales (" + (Get-Date -Format "yyyy-MM-dd HH:mm") + ")"
}
Write-Host "[10/13] Creando commit: $Mensaje" -ForegroundColor Cyan
git commit -q -m "$Mensaje"
if ($LASTEXITCODE -ne 0) { Salir "git commit ha fallado." 1 }
$hashLocal = (git rev-parse HEAD)

# --- 11. Push ---
Write-Host "[11/13] Enviando a origin/main..." -ForegroundColor Cyan
$ErrorActionPreference = "Continue"
git push origin main *> $null
$pushCode = $LASTEXITCODE
$ErrorActionPreference = "Stop"
if ($pushCode -ne 0) { Salir "git push ha fallado (codigo $pushCode). El commit local existe ($hashLocal) pero no se ha enviado." 1 }

# --- 12. Verificacion remota ---
Write-Host "[12/13] Verificando que GitHub recibio el commit..." -ForegroundColor Cyan
$ErrorActionPreference = "Continue"
git fetch origin -q *> $null
$ErrorActionPreference = "Stop"
$hashRemoto = (git rev-parse origin/main)
if ($hashLocal -ne $hashRemoto) {
  Salir "El hash remoto ($hashRemoto) no coincide con el local ($hashLocal)." 1
}

# --- 13. Resumen ---
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host " SINCRONIZACION COMPLETADA" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host (" Archivos sincronizados (" + $staged.Count + "):")
foreach ($f in $staged) { Write-Host ("   - " + $f) }
Write-Host (" Commit: " + $hashLocal.Substring(0, 7) + "  " + $Mensaje)
Write-Host (" Remoto: origin/main = " + $hashRemoto.Substring(0, 7) + " (verificado)")
Write-Host (" Repo:   $ORIGEN_ESPERADO (privado)")
Write-Host ""
exit 0
