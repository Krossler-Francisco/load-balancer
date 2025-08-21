const express = require('express');
const app = express();

// The port is passed as a command-line argument
const PORT = process.argv[2];

if (!PORT) {
  console.error("Please specify a port. Example: node service.js 3001");
  process.exit(1);
}

// Main endpoint that returns which server responded
app.get('/api/data', (req, res) => {
  console.log(`[Service ${PORT}] Request received at /api/data`);
  res.status(200).json({
    message: `This is a response from the server on port ${PORT}.`,
    timestamp: new Date().toISOString()
  });
});

// "Health Check" endpoint used by the load balancer to check if the service is active
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', port: PORT });
});

app.listen(PORT, () => {
  console.log(`Replica service listening on port ${PORT}`);
});