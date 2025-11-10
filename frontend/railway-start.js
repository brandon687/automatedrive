import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4173;

console.log('=== Railway Startup Wrapper ===');
console.log(`PORT: ${PORT}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Working directory: ${__dirname}`);

// Create a simple Express app that starts immediately
const app = express();

// Immediate health check response
app.get('/health', (req, res) => {
  console.log('Health check request received');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server IMMEDIATELY
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=== SERVER STARTED SUCCESSFULLY ===`);
  console.log(`Listening on http://0.0.0.0:${PORT}`);
  console.log(`Ready to accept connections`);
  console.log(`Health check available at /health`);

  // Log every 5 seconds that we're alive
  setInterval(() => {
    console.log(`[${new Date().toISOString()}] Server alive on port ${PORT}`);
  }, 5000);
});

server.on('error', (err) => {
  console.error('=== SERVER ERROR ===', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => process.exit(0));
});
