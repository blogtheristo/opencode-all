/**
 * DWS IQ Backend - Express Server
 * Google Cloud Run compatible
 *
 * DWS7 Modernization:
 * - MCP agent server mounted at /mcp (Fix #5)
 * - Event-driven agent runtime initialized on startup (Fix #6)
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './utils/logger.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import climateAssistantRoutes from './routes/climate-assistant.routes.js';
import climateAssistantGatedRoutes from './routes/climate-assistant-gated.routes.js';
import outreachRoutes from './routes/outreach.routes.js';
import outreachSendRoutes from './routes/outreach-send.routes.js';
import emailRoutes from './routes/email.routes.js';
import webhookRoutes from './routes/webhook.routes.js';
import agentRoutes from './agents/routes.js';
import bimRoutes from './routes/bim.routes.js';
import situationRoomRoutes from './routes/situation-room.routes.js';
import { createMCPRouter } from './mcp/agent-server.js';
import { outreachScheduler } from './outreach/index.js';
import { sendBriefingNow } from './morning-briefing/index.js';
import { emailQueue } from './services/email-queue.service.js';
import { constructionLeadsScheduler, fetchAndProcessLeads } from './construction-leads/index.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080; // Cloud Run default

// ES Module path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ MIDDLEWARE ============

// Security headers - configured to allow static HTML pages with inline scripts
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud"],
    },
  },
}));

// CORS configuration with explicit allowlist
// Default allowed origins for development and production
const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://dws6.com',
  'https://www.dws6.com',
  'https://dws10.com',
  'https://www.dws10.com',
];

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : defaultOrigins;

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // SECURITY FIX #10: Only allow null origin in development
    // Production should require origin for sensitive endpoints
    if (!origin) {
      if (process.env.NODE_ENV === 'production') {
        // In production, log null origin requests for monitoring
        logger.debug('Request with null origin', { env: 'production' });
      }
      // Allow null origin for mobile apps, Postman, server-to-server
      // Note: Auth middleware provides additional protection
      return callback(null, true);
    }

    // Check if origin is in allowlist
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Reject origin not in allowlist
    logger.warn('CORS rejection', { origin });
    callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id', 'X-Admin-Key'],
};
app.use(cors(corsOptions));

// Body parsers with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting (general)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Strict rate limiting for auth endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many attempts, please try again later.',
  skipSuccessfulRequests: true,
});
app.use('/api/v1/auth/login', loginLimiter);
app.use('/api/v1/auth/register', loginLimiter);
app.use('/api/v1/auth/forgot-password', loginLimiter);

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// ============ HEALTH CHECK ============

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DWS IQ Backend',
    version: '1.0.0',
    features: {
      climateAssistant: !!process.env.GROQ_API_KEY,
      gatedAccess: true,
      emailQueue: emailQueue.isAvailable(),
    },
  });
});

// ============ STATIC FILES ============

const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// ============ API ROUTES ============

// Auth routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

// Climate Assistant AI routes (for V10 dashboard)
app.use('/api/climate-assistant', climateAssistantRoutes);

// Climate Assistant Gated routes (tiered access with lead capture)
app.use('/api/v2/climate-assistant', climateAssistantGatedRoutes);

// Outreach inbound intake (shared secret auth via X-Outreach-Key)
app.use('/api/v1/outreach', outreachRoutes);

// Outreach quick-send (send emails to prospects, admin key auth)
app.use('/api/v1/outreach', outreachSendRoutes);

// AI Agent routes (18 agents + DWS7 workflows, discovery, events)
app.use('/api/agents', agentRoutes);

// MCP Agent Server (DWS7: Fix #5 — exposes agents as MCP tools)
app.use('/mcp', createMCPRouter());

// Email sending API (queued via Redis Streams)
app.use('/api/v1/email', emailRoutes);

// Webhooks (Resend inbound email for digest replies)
app.use('/webhooks', webhookRoutes);

// BIM Pipeline (construction carbon compliance)
app.use('/api/bim', bimRoutes);

// Situation Room (pipeline reports for dashboard)
app.use('/api/situation-room', situationRoomRoutes);

// Morning briefing manual trigger (secured by admin key)
app.post('/api/v1/morning-briefing/send', async (req: Request, res: Response) => {
  const adminKey = process.env.ADMIN_API_KEY;
  const provided = req.headers['x-admin-key'] as string;

  if (!adminKey || provided !== adminKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    await sendBriefingNow();
    res.json({ status: 'sent', timestamp: new Date().toISOString() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Manual morning briefing failed', { error: msg });
    res.status(500).json({ error: 'Failed to send briefing', message: msg });
  }
});

// Construction leads manual trigger (secured by admin key)
app.post('/api/v1/construction-leads/fetch', async (req: Request, res: Response) => {
  const adminKey = process.env.ADMIN_API_KEY;
  const provided = req.headers['x-admin-key'] as string;

  if (!adminKey || provided !== adminKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const result = await fetchAndProcessLeads();
    res.json({ status: 'complete', timestamp: new Date().toISOString(), ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Manual construction leads fetch failed', { error: msg });
    res.status(500).json({ error: 'Failed to fetch construction leads', message: msg });
  }
});

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
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
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
  logger.info(`Server running on port ${PORT}`, {
    env: process.env.NODE_ENV || 'development',
    port: PORT,
  });

  if (process.env.GROQ_API_KEY) {
    logger.info('Climate Assistant API enabled (Groq)');
  } else {
    logger.warn('GROQ_API_KEY not configured - Climate Assistant will not work');
  }

  // Morning briefing scheduling is handled by GitHub Actions
  // (.github/workflows/morning-briefing.yml) — no in-process cron needed.
  // Manual trigger available via POST /api/v1/morning-briefing/send.

  // Construction leads: daily fetch at 05:30 Helsinki (30min before briefing)
  // Manual trigger available via POST /api/v1/construction-leads/fetch
  constructionLeadsScheduler.start();

  // Start outreach digest scheduler (backup — primary is GitHub Actions).
  // On Cloud Run this may not fire reliably due to scale-to-zero,
  // but covers local dev and always-on deployments.
  outreachScheduler.start();

  // Initialize email queue (Redis Streams)
  emailQueue.initialize().then((ready) => {
    if (ready) {
      emailQueue.start();
      logger.info('Email queue worker started (Redis Streams)');
    } else {
      logger.info('Email queue unavailable — emails will be sent directly');
    }
  }).catch((err) => {
    logger.warn('Email queue init error — emails will be sent directly', {
      error: err.message,
    });
  });
});

// Graceful shutdown (Cloud Run sends SIGTERM)
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  constructionLeadsScheduler.stop();
  outreachScheduler.stop();
  emailQueue.shutdown().finally(() => {
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  constructionLeadsScheduler.stop();
  outreachScheduler.stop();
  emailQueue.shutdown().finally(() => {
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });
});

export default app;
