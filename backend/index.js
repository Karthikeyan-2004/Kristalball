// Minimal test for Vercel deployment debugging
const express = require('express');

const app = express();

app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Serverless function is working!',
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV || 'not set',
        hasMongoUri: !!process.env.MONGODB_URI,
        hasJwtSecret: !!process.env.JWT_SECRET
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Health check passed',
    timestamp: new Date().toISOString()
  });
});

// Catch all errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Unhandled server error',
    error: err.message
  });
});

module.exports = app;
