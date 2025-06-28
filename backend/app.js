const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { PORT } = require('./config/environment');
const asteroidRoutes = require('./routes/asteroidRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api', asteroidRoutes);

// Error handling middleware
app.use(errorHandler);

/**
 * Graceful shutdown handling
 */
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  pool.end(() => {
    console.log('PostgreSQL connection pool closed');
    process.exit();
  });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;