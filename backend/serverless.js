const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
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

// Database connection (non-blocking for serverless)
let dbConnected = false;
const connectToDatabase = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Middleware to ensure database connection
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// Logging middleware (simplified for serverless)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - IP: ${req.ip} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Military Asset Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Root route for testing
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Military Asset Management API - Backend is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      assets: '/api/assets'
    }
  });
});

// API routes
app.use('/api/auth', auth);
app.use('/api/assets', assets);

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);

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
