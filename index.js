const express = require("express");
const socket = require("socket.io");
const cors = require('cors'); // Importar cors
const bodyParser = require('body-parser');
const ioc = require('socket.io-client');

// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
// Habilitar CORS
app.use(cors());

// Static files
app.use(express.static("public"));
app.use(bodyParser.json());

// Socket setup
const io = socket(server,{
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials:true
    }
  });
  io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
  
    // Manejar mensajes del cliente
    socket.on('message', (message) => {
      console.log('Mensaje recibido:', message);
  
      // Emitir el mensaje a todos los clientes conectados
      io.emit('message', message);
    });
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
      });
});

// Conectar al servidor de Socket.io
const socketc = ioc('http://localhost:5000');
// Configurar rutas RESTful (ejemplo)
app.post('/api/messages', (req, res) => {
    const newMessage = req.body;
    console.log(req.body.message);
    //res.json(newMessage);
    socketc.emit('message', req.body.message.value);

    res.json(req.body);
    
});



