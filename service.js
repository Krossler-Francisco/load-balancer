const express = require('express');
const app = express();

// El puerto se pasa como un argumento de línea de comandos
const PORT = process.argv[2];

if (!PORT) {
  console.error("Por favor, especifica un puerto. Ejemplo: node service.js 3001");
  process.exit(1);
}

// Endpoint principal que devuelve qué servidor respondió
app.get('/api/data', (req, res) => {
  console.log(`[Service ${PORT}] Petición recibida en /api/data`);
  res.json({
    message: `Hola, soy el servidor respondiendo desde el puerto ${PORT}`,
    timestamp: new Date().toISOString()
  });
});

// Endpoint de "Health Check" que el balanceador usará para saber si el servicio está activo
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', port: PORT });
});

app.listen(PORT, () => {
  console.log(`✅ Servicio de réplica escuchando en el puerto ${PORT}`);
});