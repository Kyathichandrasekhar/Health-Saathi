/**
 * Smart Hospital Queue Management - Node.js Backend
 * Entry point
 */
const http = require('http');
const app = require('./app');
const { initSocket } = require('./websocket/socket');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

// Initialize WebSocket
initSocket(server);

server.listen(PORT, () => {
  console.log(`🟢 Node backend running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket ready`);
});
