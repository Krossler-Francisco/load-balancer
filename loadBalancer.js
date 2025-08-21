const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8080;

// servers
const servers = [
  { url: 'http://localhost:3001', isAlive: true },
  { url: 'http://localhost:3002', isAlive: true },
  { url: 'http://localhost:3003', isAlive: true },
];

let currentIndex = 0;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

const getNextServer = () => {
  const originalIndex = currentIndex;
  for (let i = 0; i < servers.length; i++) {
    currentIndex = (originalIndex + i) % servers.length;
    if (servers[currentIndex].isAlive) {
      const nextIndex = (currentIndex + 1) % servers.length;
      currentIndex = nextIndex;
      return servers[(nextIndex + servers.length - 1) % servers.length];
    }
  }
  return null;
};

// Periodic Health Check
setInterval(() => {
  servers.forEach(async (server) => {
    try {
      await axios.get(`${server.url}/health`);
      if (!server.isAlive) {
        server.isAlive = true;
        console.log(`[Health Check] Server ${server.url} is ACTIVE again.`);
      }
    } catch (error) {
      if (server.isAlive) {
        server.isAlive = false;
        console.log(`[Health Check] Server ${server.url} has GONE DOWN.`);
      }
    }
  });
}, 5000);

app.get('/status', (req, res) => {
  res.json(servers);
});

app.post('/api/fail-server', express.json(), (req, res) => {
  const { port } = req.body;
  const server = servers.find(s => s.url.includes(`:${port}`));

  if (server) {
    server.isAlive = false;
    console.log(`[Simulation] Server ${server.url} manually marked as DOWN.`);
    res.status(200).json({ message: `Server on port ${port} has been marked as down.` });
  } else {
    res.status(404).json({ error: `Server on port ${port} not found.` });
  }
});

// Middleware to redirect all /api/* requests
app.all('/api/*', async (req, res) => {
  const server = getNextServer();
  if (!server) {
    return res.status(502).json({ error: 'No servers available.' });
  }

  console.log(`Redirecting request to ${server.url}${req.originalUrl}`);

  try {
    const response = await axios({
      method: req.method,
      url: `${server.url}${req.originalUrl}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error contacting the replica server.' });
  }
});

app.listen(PORT, () => {
  console.log(`Load Balancer listening on port ${PORT}`);
});