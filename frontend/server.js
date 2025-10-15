const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const http = require('http');

// Try to load backend .env file
const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
let BACKEND_PORT = 3002; // Default port

if (fs.existsSync(backendEnvPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(backendEnvPath));
  BACKEND_PORT = envConfig.PORT || 3002;
  console.log(`Loaded backend config from ${backendEnvPath}`);
  console.log(`Backend port set to ${BACKEND_PORT}`);
} else {
  console.log(`Backend .env file not found at ${backendEnvPath}, using default port ${BACKEND_PORT}`);
}

const app = express();
const PORT = 3000;

// Log all requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Manual proxy for API requests
app.use('/api', (req, res) => {
  console.log(`Manually proxying request: ${req.method} ${req.url} -> http://127.0.0.1:${BACKEND_PORT}/api${req.url}`);
  
  const options = {
    hostname: '127.0.0.1',  // Use IPv4 explicitly
    port: BACKEND_PORT,
    path: '/api' + req.url,  // Add /api prefix
    method: req.method,
    headers: req.headers
  };

  const proxyReq = http.request(options, (proxyRes) => {
    console.log(`Proxy response: ${req.url} -> ${proxyRes.statusCode}`);
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error(`Proxy error for ${req.url}:`, err);
    res.status(500).json({ error: 'Proxy error: ' + err.message });
  });

  // Pipe request body if exists
  req.pipe(proxyReq);
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname)));

// Serve index.html for all other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
  console.log(`Proxying API requests to http://127.0.0.1:${BACKEND_PORT}`);
});