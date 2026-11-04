# Laboratorio: Node.js + integracion continua con GitHub Actions

Este proyecto esta disenado para ejecutar **el flujo YAML actualizado para Node.js 24**: checkout, configuracion Node.js 24, `npm ci` y `npm test`. No requiere instalar paquetes externos, porque usa modulos nativos de Node.js (`node:http`, `node:test`).

## 1. Requisitos

- VS Code y terminal PowerShell (Windows)
- Node.js 24 y npm
- Cuenta GitHub y Git instalado

Comprobar instalacion:

```powershell
node -v
npm -v
git --version
```

## 2. Abrir y ejecutar

Abrir la carpeta `nodejs-ci-laboratorio` con VS Code. En su terminal:

```powershell
npm install
npm test
npm start
```

Probar desde el navegador:

- http://localhost:3000/
- http://localhost:3000/api/saludo?nombre=Ana
- http://localhost:3000/api/suma?a=5&b=3

Para detenerlo: `Ctrl+C`.

## 3. Archivos y funciones

```text
nodejs-ci-laboratorio/
|-- .github/
|   `-- workflows/
|       `-- nodejs-ci.yml     # Pipeline CI
|-- src/
|   |-- app.js               # API y funcion sumar
|   `-- server.js            # Arranque HTTP
|-- test/
|   `-- app.test.js          # Pruebas automatizadas
|-- .gitignore
|-- package.json             # Configuracion y scripts
|-- package-lock.json        # Bloqueo de dependencias
`-- README.md
```

**Flujo de la aplicacion:** `server.js` crea y arranca el servidor de `app.js`. `app.js` resuelve las rutas y devuelve JSON. `app.test.js` verifica funciones y respuestas HTTP. `npm test` ejecuta esas pruebas y devuelve error si alguna falla.

## 4. Publicar en GitHub y activar CI

Crear primero un repositorio **vacio** en GitHub, por ejemplo `nodejs-ci-laboratorio` (sin README inicial). Sustituir `TU_USUARIO` por el nombre real de la cuenta:

```powershell
git init
git branch -M main
git add .
git commit -m "Laboratorio inicial Node.js CI"
git remote add origin https://github.com/TU_USUARIO/nodejs-ci-laboratorio.git
git push -u origin main
```

En GitHub: abrir **Actions** -> flujo **Node.js CI** -> ejecucion reciente. El workflow se activa con cada `push` a `main` y cada `pull_request` cuyo destino sea `main`.

> Nota: Es necesario autenticar Git con GitHub para `git push` si no hay una sesion configurada.

## 5. Explicacion YAML

- `name`: nombre del flujo visible en GitHub Actions.
- `on`: eventos `push` y `pull_request` sobre `main`.
- `jobs.build-and-test`: trabajo de integracion continua.
- `runs-on: ubuntu-latest`: maquina virtual Linux proporcionada por GitHub.
- `actions/checkout@v6`: recupera el codigo del repositorio.
- `actions/setup-node@v7`: instala/configura Node.js 24.
- `npm ci`: instala reproduciblemente las dependencias a partir de `package-lock.json`; aqui no hay externas.
- `npm test`: ejecuta `node --test` a partir del script `test` de `package.json`.

## 6. Experimento didactico: fallo de CI

Cambiar temporalmente esta asercion en `test/app.test.js`:

```js
assert.equal(sumar(5, 3), 8);
```

por:

```js
assert.equal(sumar(5, 3), 9);
```

Ejecutar `npm test`: fallara. Guardar y hacer `git add .`, `git commit -m "Provocar fallo"`, `git push`: el trabajo de GitHub Actions fallara en el paso 4. Restaurar `8`, volver a subir y comprobar que el pipeline pasa.

## 7. Ampliacion opcional

El workflow ya utiliza `npm ci` para instalaciones reproducibles a partir de `package-lock.json`.
