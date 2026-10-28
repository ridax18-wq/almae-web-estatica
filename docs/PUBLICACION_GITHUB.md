# Publicación en GitHub Pages

Este documento explica cómo publicar la web de ALMAE en GitHub Pages y cómo subir cambios posteriores.

> **Estado actual:** el repositorio Git local puede prepararse en `D:\ALMAE`, pero **todavía no existe un repositorio remoto ni la web está publicada**. Las operaciones remotas (crear el repositorio, `git push`, activar Pages) requieren autorización expresa antes de ejecutarse.

---

## 1. Requisitos

- Cuenta de GitHub con la que se creará el repositorio. **Confirmar la cuenta antes de crear nada.**
- Git instalado en el equipo (`git --version` debe responder).
- GitHub CLI (`gh`) opcional, para autenticarse desde la terminal (`gh auth login`).

---

## 2. Datos del repositorio propuestos

| Dato | Valor |
|---|---|
| Nombre | `almae-web-estatica` |
| Visibilidad | Pública (requerida para Pages en cuentas gratuitas) |
| Rama principal | `main` |
| Publicación | *Deploy from a branch* → `main` → `/ (root)` |
| URL esperada | `https://USUARIO.github.io/almae-web-estatica/` |

El repositorio **debe ser independiente**. No reutilizar el repositorio del proyecto anterior que utiliza Supabase.

---

## 3. Qué se publica y qué no

**Se publica:**
- `index.html`, `robots.txt`, `favicon.ico`, `.nojekyll`
- `assets\` (CSS, JavaScript, imágenes optimizadas y autorizadas)
- `data\` (configuración comercial)
- `docs\` (documentación)
- `README.md`, `.gitignore`

**No se publica** (excluido en `.gitignore`):
- `Imagenes\`: fotografías originales de trabajo.
- `ALMAEWEB\` y `ALMAE_WEB\`: restos de proyectos anteriores.
- `assets\images\equipo\`: fotografía sin autorización de uso verificada.
- Capturas, registros, cachés, archivos de entorno y credenciales.

Antes de cada publicación, revisa la lista de archivos que se subirán (paso 6).

---

## 4. Primera publicación (requiere autorización)

### 4.0. Condiciones previas (todas obligatorias)

- [ ] **Autorización expresa** para crear el repositorio remoto, hacer `push` y activar Pages. Sin esta autorización no ejecutar ningún comando de las secciones siguientes que sea remoto.
- [ ] Cuenta de GitHub confirmada por escrito (usuario exacto).
- [ ] Decisión sobre la fotografía del consultorio (ver `docs/INVENTARIO_FOTOGRAFIAS.md`, sección 3).
- [ ] Decisión sobre las fotografías del consultorio y de la profesional (sección 2 del mismo inventario).
- [ ] Aviso de privacidad revisado por la persona responsable (ver `docs/PRIVACIDAD_PENDIENTES.md`).
- [ ] Commit `ad44df3` (o posterior) verificado: `git status` limpio y `git log --oneline main` correcto.
- [ ] Pruebas en verde en local: `node run-all.js` (117/117).

### 4.0.1. Copia de seguridad

**No eliminar** la copia de seguridad del historial hasta confirmar el cierre del despliegue (la publicación funciona y la prueba posterior está completa). Ubicación actual:

`%TEMP%\opencode\backup-almae-git-20261028-085222\` (bundle `almae-prelimpieza.bundle` y copia de `.git`).

Esta copia contiene la fotografía `ambiente-almae.jpg` retirada del historial. Está fuera del repositorio y no debe subirse a ningún sitio. Cuando se confirme el cierre, la persona responsable decide si se elimina.

### Paso 1. Verificar el estado local

```powershell
cd D:\ALMAE
git status
```

Si Git aún no está inicializado, aparecerá un error. Continúa con el paso 2.

### Paso 2. Inicializar Git (solo local)

```powershell
git init -b main
```

### Paso 3. Comprobar que las exclusiones funcionan

```powershell
git status --ignored
```

Los directorios `Imagenes/`, `ALMAEWEB/` y `ALMAE_WEB/` deben aparecer como ignorados, no como archivos por subir.

### Paso 4. Revisar la lista de archivos del primer commit

```powershell
git add -A
git status
```

Revisa que la lista coincida con la sección 3. **Si aparece algo que no debe publicarse, no continúes**: añade la ruta a `.gitignore` y repite.

### Paso 5. Confirmar el primer commit (con autorización)

```powershell
git commit -m "Versión inicial de la web ALMAE"
```

### Paso 6. Crear el repositorio remoto (con autorización)

Con GitHub CLI:

```powershell
gh repo create almae-web-estatica --public --source . --remote origin
```

O desde la web de GitHub: *New repository* → nombre `almae-web-estatica` → público → **sin** README ni `.gitignore` (ya existen en local).

### Paso 7. Subir los archivos (con autorización)

```powershell
git push -u origin main
```

### Paso 8. Activar GitHub Pages

1. En el repositorio: *Settings → Pages*.
2. *Build and deployment → Source*: **Deploy from a branch**.
3. *Branch*: **main**, carpeta **/ (root)**. Pulsa *Save*.
4. Espera 1 a 3 minutos y abre la URL que muestra GitHub.

### Paso 9. Verificar la web publicada

- La página carga y muestra la portada.
- Las fotografías se ven.
- Los servicios y tarifas son los esperados.
- El formulario genera el resumen y el enlace de WhatsApp.
- No aparecen errores 404 en la consola (`F12`).
- La versión móvil se ve correctamente.

---

## 5. Actualizar la web después de publicar

Cada vez que cambies contenidos:

```powershell
cd D:\ALMAE
git status                       # revisa qué archivos cambiaron
git add -A                       # o añade archivos concretos: git add data/config.js
git status                       # confirma que no entra nada indebido
git commit -m "Descripción breve del cambio"
git push
```

GitHub Pages publica automáticamente el nuevo contenido en uno o dos minutos.

**Ejemplos de mensajes de commit:**
- `Actualiza tarifa de masaje antiestrés 60 min`
- `Agrega promoción de noviembre`
- `Reemplaza foto de la portada`

---

## 6. Antes de cada publicación: lista de comprobación

- [ ] Verificado localmente en el navegador (`http://127.0.0.1:8765`).
- [ ] WhatsApp abre el número correcto.
- [ ] Ninguna promoción vencida aparece.
- [ ] No hay marcadores `[PENDIENTE]` en el aviso de privacidad, o están aprobados por la persona responsable.
- [ ] `git status` no muestra `Imagenes/`, `ALMAEWEB/`, `ALMAE_WEB/` ni `assets/images/equipo/`.
- [ ] No hay contraseñas, claves ni datos de pacientes en los archivos.

---

## 7. Dominio propio (futuro)

Cuando exista un dominio propio:

1. En *Settings → Pages → Custom domain*, escribe el dominio y guarda.
2. Configura los registros DNS del dominio según indique GitHub.
3. Activa *Enforce HTTPS*.
4. Actualiza `seo.urlPublica` en `data\config.js` con la nueva dirección, para que las etiquetas de búsqueda y redes sociales usen la URL correcta.

No se requiere cambiar ningún otro archivo: todas las rutas del proyecto son relativas.

---

## 8. Problemas frecuentes

| Problema | Solución |
|---|---|
| La página muestra 404 | Revisa que Pages esté en `main` y `/ (root)`, y que `index.html` esté en la raíz del repositorio |
| Los estilos no cargan | Verifica que la carpeta `assets/` se haya subido completa |
| Una foto no aparece | Confirma que está en `assets/images/` y que no está excluida en `.gitignore` |
| Los cambios no aparecen | Espera unos minutos y recarga con `Ctrl + F5` |
| `git push` pide usuario y contraseña | Usa `gh auth login` o un token de acceso personal de GitHub |
