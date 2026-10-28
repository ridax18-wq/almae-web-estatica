# Sincronización con GitHub — ALMAE Web

Mecanismo local para enviar los cambios del proyecto al repositorio **privado**
`ridax18-wq/almae-web-estatica` sin escribir los comandos de Git a mano.

- Rama: `main`.
- Visibilidad: **privada**. Esta automatización **no** cambia la visibilidad,
  **no** activa GitHub Pages y **no** crea workflows de despliegue.
- No usa `git push --force` ni `git add -f` ni comandos destructivos.

---

## 1. Cómo utilizarlo

Desde cualquier ventana de PowerShell:

```powershell
D:\ALMAE\scripts\sincronizar-github.ps1 -Mensaje "feat: descripcion del cambio"
```

Parámetros:

| Parámetro | Por defecto | Uso |
|---|---|---|
| `-Mensaje` | `chore: sincronizar cambios locales (fecha)` | Mensaje del commit. Usa el estilo convencional: `feat:`, `fix:`, `docs:`, `chore:`. |
| `-Puerto` | `8765` | Puerto del servidor local de pruebas. Cambia si está ocupado. |

El script realiza, en orden:

1. Valida que estás en `D:\ALMAE`.
2. Valida que `origin` apunta a `ridax18-wq/almae-web-estatica`.
3. Valida que la rama activa es `main`.
4. Detecta los archivos modificados y los muestra.
5. Rechaza cualquier ruta protegida (`Imagenes/`, `ALMAEWEB/`, `ALMAE_WEB/`,
   `node_modules/`, capturas, backups, `.env`, llaves, fotos de equipo…).
6. Arranca un servidor local temporal y ejecuta las **141 pruebas**.
7. Si una prueba falla: **cancela** sin crear commit ni push.
8. Prepara solo los archivos autorizados (`git add -A`, respetando `.gitignore`).
9. Escanea el contenido staged en busca de credenciales o archivos privados;
   si encuentra alguna, revierte el staging y cancela.
10. Crea el commit con el mensaje indicado.
11. Ejecuta `git push origin main`.
12. Comprueba que el hash de `origin/main` coincide con el local.
13. Muestra el resumen (archivos, hash y resultado).

El servidor local se detiene automáticamente al terminar (también si falla).

### Requisitos

- Python 3 en el PATH (`python --version`).
- Node.js 18+ con `tests/node_modules` ya instalado (`npm install` en `tests/`).
- Git con `origin` configurado.

## 2. Integración con Cursor/OpenCode

Las instrucciones de proyecto viven en `AGENTS.md` (raíz). Después de una
tarea de desarrollo autorizada, el flujo es:

1. Ejecutar las pruebas.
2. Invocar `scripts\sincronizar-github.ps1`.
3. Informar hash y resultado.

No se sincroniza en consultas, auditorías de solo lectura ni tareas sin
cambios. No hay proceso residente que vigile el disco.

## 3. Cómo desactivarla

- **Ocasional (una vez):** no ejecutar el script; usar Git a mano.
- **Definitiva:** eliminar o renombrar `scripts/sincronizar-github.ps1`
  y quitar la sección de flujo de `AGENTS.md`. No afecta al repositorio.

## 4. Cómo identificar errores

| Mensaje | Causa | Solución |
|---|---|---|
| `SINCRONIZACION CANCELADA: Las pruebas han fallado` | Al menos una de las 141 pruebas falló | Revisar el detalle de la suite; corregir y volver a ejecutar. No publicar con fallos. |
| `... no es D:\ALMAE` | Ejecutado desde otro repositorio | Ejecutar con la ruta completa `D:\ALMAE\scripts\sincronizar-github.ps1`. |
| `origin apunta a ...` | Remoto incorrecto o ausente | `git remote set-url origin https://github.com/ridax18-wq/almae-web-estatica.git` |
| `La rama activa es ...` | Estás en otra rama | `git switch main` |
| `Ruta protegida detectada/staged` | Un archivo excluido quiere entrar al commit | Retirarlo; revisar `.gitignore`. El script hace `git reset` automático. |
| `posible secreto ... staged` | El escaneo detectó un patrón de credencial | Revisar el archivo; nunca enviar claves. El staging se revierte. |
| `El servidor local no arranco` | Puerto ocupado o Python ausente | Cambiar de puerto con `-Puerto 8766` o instalar Python. |
| `git push ha fallado` | Sin conexión, token caducado o repo eliminado | Comprobar red y `git remote -v`. El commit local queda intacto: repetir solo el push. |
| `hash remoto no coincide` | Alguien más hizo push entre tanto | `git pull --rebase origin main` (con autorización) y repetir. |

Si el script termina con **código 0** y `Sin cambios pendientes`, no hay nada
que sincronizar.

## 5. Cómo revisar el estado de sincronización

```powershell
cd D:\ALMAE
git status -sb              # main...origin/main, sin ahead/behind = sincronizado
git log --oneline -5        # últimos commits
git rev-parse HEAD          # hash local
git rev-parse origin/main   # hash remoto (debe coincidir)
```

En GitHub (solo lectura):

```powershell
gh repo view ridax18-wq/almae-web-estatica --json visibility,url,defaultBranchRef
```

- `visibility` debe ser `PRIVATE`.
- Pages sigue desactivado: `gh api repos/ridax18-wq/almae-web-estatica/pages`
  debe responder `404 Not Found`.

## 6. Resultado de la prueba controlada (verificación)

Verificado en la configuración inicial:

1. **Sin cambios:** el script termina con «Sin cambios pendientes» y no crea
   commit.
2. **Pruebas fallidas:** con un servidor local sin contenido de ALMAE las
   pruebas fallan y el script cancela: no hay commit ni push.
3. **Archivo excluido:** archivos en `tests/.capturas/` y `.env` de prueba no
   aparecen en `git status` ni se incorporan a ningún commit.
4. **Cambios válidos:** crea el commit y sincroniza; `origin/main` coincide
   con el hash local.
