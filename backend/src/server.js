require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { apiConfig } = require('../helpers/config');
const { initMonitoring } = require('../helpers/monitoring');
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const trackingRoutes = require('./routes/tracking');
const healthRoutes = require('./routes/health');

const app = express();

// Core middleware
app.use(cors({ origin: apiConfig.corsOrigins, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Initialize monitoring/analytics (Amplitude, Sentry)
initMonitoring();

// API routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/tracking', trackingRoutes);
app.use('/api/v1/health', healthRoutes);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[error]', err);
  const status = err.status || 500;
  res.status(status).json({
    error: true,
    message: err.message || 'Internal server error',
  });
});

// Mongo connection + server start
async function start() {
  try {
    await mongoose.connect(apiConfig.mongoUri, {
      maxPoolSize: 10,
    });
    console.log('[mongo] connected');

    const port = apiConfig.port;
    app.listen(port, () => {
      console.log(`[server] listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('[startup] failed to start server', error);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = { app, start };

