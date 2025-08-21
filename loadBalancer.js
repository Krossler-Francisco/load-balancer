const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8080;

// Lista de servidores de réplica
const servers = [
  { url: 'http://localhost:3001', isAlive: true },
  { url: 'http://localhost:3002', isAlive: true },
  { url: 'http://localhost:3003', isAlive: true },
];

let currentIndex = 0;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

// Función para obtener el próximo servidor disponible (Round Robin)
const getNextServer = () => {
  const originalIndex = currentIndex;
  for (let i = 0; i < servers.length; i++) {
    currentIndex = (originalIndex + i) % servers.length;
    if (servers[currentIndex].isAlive) {
      // Devolvemos el servidor y actualizamos el índice para la próxima petición
      const nextIndex = (currentIndex + 1) % servers.length;
      currentIndex = nextIndex;
      return servers[(nextIndex + servers.length - 1) % servers.length];
    }
  }
  return null; // No hay servidores disponibles
};

// Health Check periódico
setInterval(() => {
  servers.forEach(async (server) => {
    try {
      await axios.get(`${server.url}/health`);
      if (!server.isAlive) {
        server.isAlive = true;
        console.log(`[Health Check] Servidor ${server.url} está nuevamente ACTIVO.`);
      }
    } catch (error) {
      if (server.isAlive) {
        server.isAlive = false;
        console.log(`[Health Check] Servidor ${server.url} ha CAÍDO.`);
      }
    }
  });
}, 5000); // Comprobar cada 5 segundos

// Endpoint para obtener el estado de los servidores (para la UI)
app.get('/status', (req, res) => {
  res.json(servers);
});

// Middleware para redirigir todas las peticiones a /api/*
app.all('/api/*', async (req, res) => {
  const server = getNextServer();
  if (!server) {
    return res.status(502).json({ error: 'No hay servidores disponibles.' });
  }

  console.log(`Redirigiendo petición a ${server.url}${req.originalUrl}`);

  try {
    const response = await axios({
      method: req.method,
      url: `${server.url}${req.originalUrl}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error al contactar el servidor de réplica.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Balanceador de Carga escuchando en el puerto ${PORT}`);
});