import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { initFirehorsePilot, shutdownFirehorsePilot, firehorseRoutes } from './firehorse/index.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// ============ MIDDLEWARE ============

// Security headers
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Body parsers with size limits to prevent DoS via large payloads
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Note: Cookie parser not needed yet - using localStorage/Authorization header for tokens
// If cookie-based auth is needed, install and use 'cookie-parser' package

// Rate limiting (general)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Strict rate limiting for sensitive auth endpoints (login, register, forgot-password)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
});
app.use('/api/v1/auth/login', loginLimiter);
app.use('/api/v1/auth/register', loginLimiter);
app.use('/api/v1/auth/forgot-password', loginLimiter);

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// ============ HEALTH CHECK ============

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DWS IQ Auth Backend',
    version: '1.0.0',
  });
});

// ============ API ROUTES ============

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

// Firehorse Pilot routes
app.use('/api/v1/firehorse', firehorseRoutes);

// ============ ERROR HANDLING ============

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    path: req.path,
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============ SERVER START ============

const server = app.listen(PORT, () => {
  logger.info(`✓ Server running on http://localhost:${PORT}`, {
    env: process.env.NODE_ENV || 'development',
    port: PORT,
  });

  // Log database connection status
  if (process.env.DATABASE_URL) {
    logger.info('✓ Database URL configured');
  }

  if (process.env.REDIS_URL) {
    logger.info('✓ Redis URL configured');
  }

  // Initialize Firehorse Pilot
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    logger.info('🔥 Initializing Firehorse Pilot...');
    initFirehorsePilot();
  } else {
    logger.warn('⚠️  Firehorse Pilot not initialized: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  shutdownFirehorsePilot();
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  shutdownFirehorsePilot();
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;

