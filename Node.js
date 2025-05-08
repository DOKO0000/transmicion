const express = require('express');
const app = express();
const http = require('http').createServer(app);

// Usuarios autorizados (reemplaza con tus amigos)
const usuariosAutorizados = [
  { usuario: "amigo1", clave: "clave1" },
  { usuario: "amigo2", clave: "clave2" }
];

app.use(express.static('public'));
app.use(express.json());

app.post('/login', (req, res) => {
  const { usuario, clave } = req.body;
  const autorizado = usuariosAutorizados.some(u => u.usuario === usuario && u.clave === clave);
  
  if (autorizado) {
    res.json({ success: true, token: 'token_simulado_' + usuario });
  } else {
    res.status(401).json({ success: false });
  }
});

http.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
