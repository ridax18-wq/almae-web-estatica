# Instrucciones del proyecto — ALMAE Web Independiente

Estático (HTML5/CSS3/JS ES6 puro). Sin backend, sin Supabase, sin base de datos.
Directorio: `D:\ALMAE`. Repositorio privado: `ridax18-wq/almae-web-estatica` (rama `main`).

## Comandos clave

- Pruebas (141): servidor local + `node run-all.js` desde `tests/`
  ```powershell
  python -m http.server 8765   # en D:\ALMAE, ventana aparte
  cd D:\ALMAE\tests; node run-all.js http://127.0.0.1:8765
  ```
  Ver `docs/PRUEBAS.md`.
- Sincronización con GitHub (hace pruebas, commit y push):
  ```powershell
  D:\ALMAE\scripts\sincronizar-github.ps1 -Mensaje "tipo: descripcion del cambio"
  ```

## Flujo obligatorio tras una tarea de desarrollo autorizada

Cuando una tarea haya modificado archivos y esté terminada y aprobada:

1. Ejecutar la batería de pruebas completa (141/141 esperado).
2. Invocar `scripts\sincronizar-github.ps1` con un mensaje descriptivo.
3. Informar el resultado: hash del commit y confirmación de sincronización.

El script cancela por sí solo si fallan las pruebas, si hay rutas protegidas
o si detecta credenciales. No hay que hacer `git add`/`git commit`/`git push`
a mano para los cambios normales.

## Cuándo NO sincronizar

- Consultas informativas y auditorías de solo lectura.
- Tareas sin cambios en el árbol de trabajo.
- Trabajo en curso no aprobado por el usuario.

No crear commits automáticos en esos casos. No dejar procesos residentes
vigilando el disco.

## Reglas permanentes

- Prohibido `git push --force`, `git add -f`, `git reset --hard`, `git clean`.
- Excluir siempre: `Imagenes/`, `ALMAEWEB/`, `ALMAE_WEB/`, `node_modules/`,
  `tests/.capturas/`, backups, `.env`, credenciales, fotografías no autorizadas.
- No modificar el proyecto ALMAE original de Supabase.
- No cambiar la visibilidad del repositorio ni activar GitHub Pages.
- No crear workflows de despliegue público. Solo push al repo privado.
- El aviso de privacidad tiene 4 marcadores `[PENDIENTE]`: no eliminarlos ni
  inventar datos legales.
- La web no confirma citas: el formulario envía una solicitud por WhatsApp.

Más detalle: `docs/SINCRONIZACION_GITHUB.md`, `docs/PRUEBAS.md`,
`docs/CHECKLIST_PUBLICACION.md`.
