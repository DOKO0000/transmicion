// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const usuariosConectados = new Set();

wss.on('connection', (ws) => {
  let usuario = 'Anónimo';
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    if (data.tipo === "conexion") {
      usuario = data.usuario;
      usuariosConectados.add(usuario);
      broadcastUsuarios();
    } 
    else if (data.tipo === "audio") {
      // Reenviar el audio a todos los demás usuarios
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            tipo: "audio",
            usuario: usuario,
            audio: data.audio,
            formato: data.formato
          }));
        }
      });
    }
  });
  
  ws.on('close', () => {
    usuariosConectados.delete(usuario);
    broadcastUsuarios();
  });
  
  function broadcastUsuarios() {
    const listaUsuarios = Array.from(usuariosConectados);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          tipo: "usuarios",
          usuarios: listaUsuarios
        }));
      }
    });
  }
});

console.log('Servidor WebSocket corriendo en ws://localhost:8080');
