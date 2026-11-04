'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { crearServidor, sumar } = require('../src/app');

test('sumar realiza la operacion correctamente', () => {
  assert.equal(sumar(5, 3), 8);
  assert.equal(sumar(-2, 2), 0);
});

test('sumar rechaza entradas invalidas', () => {
  assert.throws(() => sumar(NaN, 2), TypeError);
});

// Levantamos un servidor temporal para pruebas reales HTTP.
async function probarRuta(ruta, resultadoEsperado, validar) {
  const servidor = crearServidor();
  await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
  try {
    const { port } = servidor.address();
    const respuesta = await fetch(`http://127.0.0.1:${port}${ruta}`);
    assert.equal(respuesta.status, resultadoEsperado);
    validar(await respuesta.json());
  } finally {
    await new Promise((resolve, reject) => servidor.close((error) => error ? reject(error) : resolve()));
  }
}

test('GET /api/saludo devuelve un saludo', async () => {
  await probarRuta('/api/saludo?nombre=Ana', 200, (json) => {
    assert.equal(json.mensaje, 'Hola, Ana');
  });
});

test('GET /api/suma devuelve el resultado', async () => {
  await probarRuta('/api/suma?a=10&b=7', 200, (json) => {
    assert.equal(json.resultado, 17);
  });
});

test('GET /api/suma valida sus parametros', async () => {
  await probarRuta('/api/suma?a=hola&b=7', 400, (json) => {
    assert.match(json.error, /numeros finitos/);
  });
});

test('Una ruta inexistente devuelve HTTP 404', async () => {
  await probarRuta('/api/no-existe', 404, (json) => {
    assert.equal(json.error, 'Ruta no encontrada');
  });
});
