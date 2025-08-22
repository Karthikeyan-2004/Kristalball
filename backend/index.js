const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to database
const { connectDB, logger } = require('./src/config/database');

// Route files
const auth = require('./src/routes/auth');
const assets = require('./src/routes/assets');

// Initialize express app
const app = express();

// Database connection (async for serverless)
let dbConnected = false;
const ensureDBConnection = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log('Database connected for serverless function');
    } catch (error) {
      console.error('Database connection failed:', error.message);
    }
  }
};

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['*'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection middleware
app.use(async (req, res, next) => {
  await ensureDBConnection();
  next();
});

// Test routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Military Asset Management API - Backend is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      assets: '/api/assets'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Military Asset Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// API routes
app.use('/api/auth', auth);
app.use('/api/assets', assets);

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message} - ${req.method} ${req.originalUrl}`);

  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
});

module.exports = app;
