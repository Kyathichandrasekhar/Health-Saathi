/**
 * WebSocket — Real-time queue updates
 */
const { Server } = require('socket.io');

let io = null;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000', '*'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join a doctor's queue room
    socket.on('join-queue', (doctorId) => {
      socket.join(`queue-${doctorId}`);
      console.log(`👤 ${socket.id} joined queue-${doctorId}`);
    });

    // Leave a doctor's queue room
    socket.on('leave-queue', (doctorId) => {
      socket.leave(`queue-${doctorId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  return io;
}

// Emit queue update to all clients watching a doctor's queue
function emitQueueUpdate(doctorId, queueData) {
  if (io) {
    io.to(`queue-${doctorId}`).emit('queue-update', queueData);
  }
}

module.exports = { initSocket, getIO, emitQueueUpdate };
