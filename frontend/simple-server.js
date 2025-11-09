import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4173;
const app = express();

console.log(`[STARTUP] PORT=${PORT}`);
console.log(`[STARTUP] __dirname=${__dirname}`);

// Serve static files - THIS MUST BE FIRST
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server - bind to 0.0.0.0 which is ALL interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SUCCESS] Server listening on http://0.0.0.0:${PORT}`);
}).on('error', (err) => {
  console.error('[ERROR] Server failed:', err);
  process.exit(1);
});
