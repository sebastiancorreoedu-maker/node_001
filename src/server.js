'use strict';
const { crearServidor } = require('./app');
const puerto = Number(process.env.PORT || 3000);
const servidor = crearServidor();
servidor.listen(puerto, () => {
  console.log(`Servidor disponible en http://localhost:${puerto}`);
});
