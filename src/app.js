'use strict';

const http = require('node:http');

/** Suma dos numeros; se exporta para probarla directamente. */
function sumar(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new TypeError('Los parametros deben ser numeros finitos');
  }
  return a + b;
}

/** Escribe respuestas JSON con el codigo HTTP indicado. */
function responderJSON(res, estado, datos) {
  res.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(datos));
}

/** Fabrica el servidor sin arrancarlo: facilita probarlo sin ocupar puertos fijos. */
function crearServidor() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');

    if (req.method !== 'GET') {
      return responderJSON(res, 405, { error: 'Metodo no permitido' });
    }

    if (url.pathname === '/') {
      return responderJSON(res, 200, {
        aplicacion: 'Laboratorio Node.js CI',
        rutas: ['/api/saludo?nombre=Ana', '/api/suma?a=5&b=3']
      });
    }

    if (url.pathname === '/api/saludo') {
      const nombre = (url.searchParams.get('nombre') || 'estudiante').trim() || 'estudiante';
      return responderJSON(res, 200, { mensaje: `Hola, ${nombre}` });
    }

    if (url.pathname === '/api/suma') {
      const aTexto = url.searchParams.get('a');
      const bTexto = url.searchParams.get('b');
      if (aTexto === null || bTexto === null || !aTexto.trim() || !bTexto.trim()) {
        return responderJSON(res, 400, { error: 'Debes enviar a y b como numeros' });
      }
      const a = Number(aTexto);
      const b = Number(bTexto);
      try {
        return responderJSON(res, 200, { a, b, resultado: sumar(a, b) });
      } catch (error) {
        return responderJSON(res, 400, { error: error.message });
      }
    }

    return responderJSON(res, 404, { error: 'Ruta no encontrada' });
  });
}

module.exports = { crearServidor, sumar };
