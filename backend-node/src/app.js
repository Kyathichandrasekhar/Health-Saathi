/**
 * Express app configuration
 */
const express = require('express');
const cors = require('cors');
const os = require('os');
const { errorHandler } = require('./middlewares/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const hospitalRoutes = require('./routes/hospital.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const queueRoutes = require('./routes/queue.routes');
const qrRoutes = require('./routes/qr.routes');
const assistantRoutes = require('./routes/assistant.routes');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', '*'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/assistant', assistantRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'Health Saathi API (Node)' });
});

app.get('/api/public-base-url', (req, res) => {
  const configured = process.env.PUBLIC_APP_URL;
  if (configured) {
    return res.json({ url: configured });
  }

  const interfaces = os.networkInterfaces();
  const candidates = Object.values(interfaces)
    .flat()
    .filter((address) => address && address.family === 'IPv4' && !address.internal)
    .map((address) => address.address);

  const lanIp = candidates[0];
  if (!lanIp) {
    return res.json({ url: null });
  }

  const frontendPort = process.env.FRONTEND_PORT || '5173';
  return res.json({ url: `http://${lanIp}:${frontendPort}` });
});

// Error handler
app.use(errorHandler);

module.exports = app;
