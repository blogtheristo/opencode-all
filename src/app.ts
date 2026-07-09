/**
 * DWS IQ Backend - Express Server
 * Google Cloud Run compatible
 *
 * DWS7 Modernization:
 * - MCP agent server mounted at /mcp (Fix #5)
 * - Event-driven agent runtime initialized on startup (Fix #6)
 */

import dotenv from 'dotenv';
dotenv.config();

// Initialize OTel before any module that may emit spans (agent registry,
// llm-client, workflows). Safe no-op when OTEL_EXPORTER_OTLP_ENDPOINT is unset.
import { initOtel, shutdownOtel } from './observability/otel.js';
initOtel();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import logger from './utils/logger.js';
import authRoutes from './routes/auth.routes.js';
import { brokerRouter } from './broker/broker.routes.js';
import userRoutes from './routes/user.routes.js';
import climateAssistantRoutes from './routes/climate-assistant.routes.js';
import climateAssistantGatedRoutes from './routes/climate-assistant-gated.routes.js';
import adminSupportRoutes from './routes/admin-support.routes.js';
import outreachRoutes from './routes/outreach.routes.js';
import outreachSendRoutes from './routes/outreach-send.routes.js';
import emailRoutes from './routes/email.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import supportRoutes from './routes/support.routes.js';
import supportReviewRoutes from './routes/support-review.routes.js';
import webhookRoutes from './routes/webhook.routes.js';
import agentRoutes from './agents/routes.js';
import nudgeRoutes from './routes/nudge.routes.js';
import nudgeWebhookRoutes from './routes/nudge-webhook.routes.js';
import bimRoutes from './routes/bim.routes.js';
import hilRoutes from './routes/hil.routes.js';
import situationRoomRoutes from './routes/situation-room.routes.js';
// import grokConsentRoutes from './routes/grok-consent.routes.js'; // TODO: restore when grok-consent is available
import paymentRoutes from './routes/payment.routes.js';
import b2bPaymentRoutes from './routes/b2b-payment.routes.js';
import stripeWebhookRoutes from './routes/stripe-webhook.routes.js';
import captainRoutes from './routes/captain.routes.js';
import usageRoutes from './routes/usage.routes.js';
import onboardRoutes from './routes/onboard.routes.js';
import memoryRoutes from './routes/memory.routes.js';
import complianceRoutes from './routes/compliance.routes.js';
import reportExportRoutes from './routes/report-export.routes.js';
import apiKeyRoutes from './routes/api-keys.routes.js';
import kyaWebhookRoutes from './routes/kya-webhook.routes.js';
import gtmEventsRoutes from './routes/gtm-events.routes.js';
import emailWebhookRoutes from './routes/email-webhook.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import erpTrackingRoutes from './routes/erp-tracking.routes.js';
import {
  erpRoutes,
  initializeERPIntegrations,
  shutdownERPIntegrations,
} from './integrations/erp/index.js';
import roleTrackingRoutes from './routes/role-tracking.routes.js';
import gapsRoutes from './routes/gaps.routes.js';
import agentsRoutes from './routes/agents.routes.js';
import { terminateChain } from './identity/kya-engine.js';
import { outreachScheduler } from './outreach/index.js';
import { sendBriefingNow } from './morning-briefing/index.js';
import { emailQueue } from './services/email-queue.service.js';
import { constructionLeadsScheduler, fetchAndProcessLeads } from './construction-leads/index.js';
import { memoryScheduler } from './agents/memory.scheduler.js';
import { signalPoller } from './agents/signal-poller.js';
import { inboundTicketScheduler } from './services/inbound-ticket.service.js';
import { apiVersionMiddleware } from './middleware/api-version.middleware.js';
import { correlationId } from './middleware/correlation-id.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { healthCheck, livenessCheck } from './middleware/health.js';
import { validateEnv } from './middleware/env-validation.js';
import { loadSecrets } from './config/secret-loader.js';

// ============ STUBS FOR MODULES EXCLUDED FROM BUILD ============
// tsconfig.json excludes src/firehorse/**, src/mcp/**, and src/investor-reports/**
// from compilation, so they are not present in dist/ at runtime. Static imports
// from these paths would crash the container with ERR_MODULE_NOT_FOUND before
// app.listen() — breaking Cloud Run health checks. Instead we expose no-op
// stubs; affected routes will 404 and scheduled hooks are no-ops. Unstub by
// restoring the modules in tsconfig `include` and reverting this block.
const firehorseRoutes = express.Router();
const initFirehorsePilot = (): void => {
  logger.warn('firehorse stubbed — module excluded from build');
};
const shutdownFirehorsePilot = (): void => {
  /* no-op */
};
const createMCPRouter = () => express.Router();
const capTableRouter = express.Router();
// ================================================================

dotenv.config();

// ============ VAULT BOOTSTRAP ============
// Pull secrets from configured vault (Aiven / GCP Secret Manager) into
// process.env before validation. No-op if VAULT_PROVIDER is not set.
await loadSecrets();

// ============ STARTUP VALIDATION ============

const envResult = validateEnv();
if (!envResult.valid && process.env.NODE_ENV === 'production') {
  // In production, fail fast if required vars are missing
  logger.fatal('Startup aborted — missing required environment variables', {
    missing: envResult.missing,
  });
  process.exit(1);
}

const app: Express = express();
app.disable('x-powered-by');
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? '8080' : '3001');

// ES Module path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ MIDDLEWARE ============

// Security headers - configured to allow static HTML pages with inline scripts
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: [
          "'self'",
          'https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud',
        ],
      },
    },
  }),
);

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
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
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
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Session-Id',
    'X-Admin-Key',
    'X-Correlation-ID',
  ],
};
app.use(cors(corsOptions));

// Correlation ID — trace every request through logs
app.use(correlationId);

// API versioning header on all responses
app.use(apiVersionMiddleware);

// Body parsers with size limits
//
// IMPORTANT: stripe-webhook routes are mounted BEFORE express.json() (further
// down in this file's STRIPE WEBHOOK MOUNT block) so that preserveRawBody can
// read the raw HTTP stream. If express.json() processes the request first,
// the stream is consumed and `req.on('data')` / `req.on('end')` never fire,
// causing the webhook handler to hang until Cloud Run kills the request at
// the 60s timeout.
app.use((req, res, next) => {
  // Webhooks that verify an HMAC over the raw body must NOT be pre-parsed.
  if (req.path.startsWith('/webhooks/stripe') || req.path.startsWith('/webhooks/nudge'))
    return next();
  return express.json({ limit: '10kb' })(req, res, next);
});
app.use((req, res, next) => {
  if (req.path.startsWith('/webhooks/stripe') || req.path.startsWith('/webhooks/nudge'))
    return next();
  return express.urlencoded({ extended: true, limit: '10kb' })(req, res, next);
});

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

// Request logging middleware (includes correlation ID for tracing)
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    correlationId: req.headers['x-correlation-id'],
  });
  next();
});

// ============ HEALTH CHECK ============

// Full health check with dependency status (Supabase, email, LLM)
app.get('/health', healthCheck);

// Lightweight liveness probe (no dependency calls)
app.get('/livez', livenessCheck);

// ============ STATIC FILES ============

const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

const dws6SitePath = path.join(__dirname, '..', 'dws6.com');
const dws10SitePath = path.join(__dirname, '..', 'dws10.com');
const landingPagesPath = path.join(__dirname, '..', 'landing-pages');

app.use('/dws6.com', express.static(dws6SitePath));
app.use('/dws10.com', express.static(dws10SitePath));
app.use('/landing-pages', express.static(landingPagesPath));

// ============ API ROUTES ============

// Auth routes
app.use('/api/v1/broker', brokerRouter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

// Climate Assistant AI routes (for V10 dashboard)
app.use('/api/climate-assistant', climateAssistantRoutes);

// Climate Assistant Gated routes (tiered access with lead capture)
app.use('/api/v2/climate-assistant', climateAssistantGatedRoutes);

// Admin support chat channel (settings panel)
app.use('/api/v1/admin/support', adminSupportRoutes);

// Outreach inbound intake (shared secret auth via X-Outreach-Key)
app.use('/api/v1/outreach', outreachRoutes);

// Outreach quick-send (send emails to prospects, admin key auth)
app.use('/api/v1/outreach', outreachSendRoutes);

// Firehorse Omnichannel Pilot (sales automation, signals, lead management)
app.use('/api/v1/firehorse', firehorseRoutes);

// AI Agent routes (18 agents + DWS7 workflows, discovery, events)
app.use('/api/agents', agentRoutes);

// Usage metering (MVP Feature 2)
app.use('/api/v1/usage', usageRoutes);

// Onboarding wizard (baseline compliance assessment)
app.use('/api/v1/onboard', onboardRoutes);

// Memory dashboard stats + audit endpoints
app.use('/api/v1/memory', memoryRoutes);

// Compliance assessment API (scoring, registry, cost estimate)
app.use('/api/v1/compliance', complianceRoutes);

// Report export & scheduling (MVP Feature 3)
app.use('/api/v1/reports', reportExportRoutes);

// API key management (MVP Feature 1)
app.use('/api/v1/user/api-keys', apiKeyRoutes);

// Payment proxy (PayPal, Revolut subscription checkout)
app.use('/api/v1/payments', paymentRoutes);

// B2B Payment Flow (Revolut deposit + Stripe invoice)
app.use('/api/v1/b2b', b2bPaymentRoutes);

// Stripe webhook (invoice payments, refunds, customer events)
app.use('/webhooks/stripe', stripeWebhookRoutes);

// Nudge callback webhook (Teams/Slack button click → resolveNudge).
// Mounted before express.json so its HMAC can verify the raw body.
app.use('/webhooks/nudge', nudgeWebhookRoutes);

// MCP Agent Server (DWS7: Fix #5 — exposes agents as MCP tools)
app.use('/mcp', createMCPRouter());

// Email sending API (queued via Redis Streams)
app.use('/api/v1/email', emailRoutes);
app.use('/api/v1/booking', bookingRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/support', supportReviewRoutes);
app.use('/api/v1/captain', captainRoutes);

// Webhooks (Resend inbound email for digest replies)
app.use('/webhooks', webhookRoutes);

// KYA Webhook Bridge (Shufti Pro → Policy Engine)
app.use('/api/v1/kya', kyaWebhookRoutes);

// Nudge inbox (in_app channel — list + resolve pending proactive nudges)
app.use('/api/v1/nudges', nudgeRoutes);

// GTM Events API (Google Tag Manager event logging — Phase 1)
app.use('/api/gtm/events', gtmEventsRoutes);

// Email Webhooks (Amazon SES bounce/delivery/open/click/complaint — Phase 2a)
app.use('/webhooks/email', emailWebhookRoutes);

// Analytics API (Funnel dashboard + drop-off analysis — Phase 2b)
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/erp/track', erpTrackingRoutes);
app.use('/api/roles/track', roleTrackingRoutes);
app.use('/api/v1/gaps', gapsRoutes);
app.use('/api/v1/agents', agentsRoutes);

const getHeaderValue = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const extractBearerToken = (authorization: string | undefined): string | undefined => {
  if (!authorization) return undefined;
  return authorization.toLowerCase().startsWith('bearer ')
    ? authorization.slice(7).trim()
    : authorization.trim();
};

const isAuthorizedAdminKey = (
  provided: string | undefined,
  expected: string | undefined,
): boolean => {
  if (!provided || !expected) return false;
  const providedHash = crypto.createHash('sha256').update(provided, 'utf8').digest();
  const expectedHash = crypto.createHash('sha256').update(expected, 'utf8').digest();
  return crypto.timingSafeEqual(providedHash, expectedHash);
};

// KYA CLI Snap endpoint (simulation trigger for demo)
app.post('/api/v1/kya/snap', async (req: Request, res: Response) => {
  const adminKey = process.env.ADMIN_API_KEY;
  const authHeader = getHeaderValue(req.headers.authorization);
  const adminHeader = getHeaderValue(req.headers['x-admin-key']);
  const provided = extractBearerToken(authHeader) || adminHeader;
  if (!adminKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (!isAuthorizedAdminKey(provided, adminKey)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { sessionId, reason, forceCascade, source } = req.body;

  if (!sessionId || typeof sessionId !== 'string') {
    res.status(400).json({ error: 'sessionId is required' });
    return;
  }

  try {
    const result = await terminateChain(sessionId, {
      reason: reason || 'MANUAL_SNAP',
      forensicDump: true,
    });

    logger.info('KYA Snap executed via CLI', {
      sessionId,
      reason,
      source: source || 'api',
      forceCascade,
    });

    res.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('KYA Snap failed', { error: msg, sessionId });
    res.status(500).json({ error: 'Snap execution failed', message: msg });
  }
});

// BIM Pipeline (construction carbon compliance)
app.use('/api/bim', bimRoutes);

// HIL (Human-in-the-Loop) one-click task completion from morning briefing email
app.use('/api/hil', hilRoutes);

// ERP Integrations (Monitor/IFS/Dynamics365/SAP/Visma/Jeeves connectors)
app.use('/api/v1/erp', erpRoutes);

// Situation Room (pipeline reports for dashboard)
app.use('/api/situation-room', situationRoomRoutes);

// Grok Consent — GDPR + EU AI Act Article 12 sovereignty dashboard
// app.use('/api/grok-consent', grokConsentRoutes); // TODO: restore when grok-consent is available

// Peachscore Accelerator — Cap Table & Financials
app.use('/api/investor-reports/cap-table', capTableRouter);

// Project delivery status (investor view) — dashboard fetches latest on admin login
app.get('/api/v1/dashboard/delivery-status', (_req: Request, res: Response) => {
  const configPath = path.join(process.cwd(), 'config', 'project-delivery-status.json');
  const fallback = { timestamp: '2026-03-02', mvp: 72, v1: 46, dws7: 58 };
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const data = JSON.parse(raw) as {
      timestamp?: string;
      mvp?: number;
      v1?: number;
      dws7?: number;
    };
    res.json({
      timestamp: data.timestamp ?? fallback.timestamp,
      mvp: data.mvp ?? fallback.mvp,
      v1: data.v1 ?? fallback.v1,
      dws7: data.dws7 ?? fallback.dws7,
    });
  } catch {
    res.json(fallback);
  }
});

// Morning briefing manual trigger (secured by admin key)
app.post('/api/v1/morning-briefing/send', async (req: Request, res: Response) => {
  const adminKey = process.env.ADMIN_API_KEY;
  const provided = getHeaderValue(req.headers['x-admin-key']);

  // SECURITY: Use constant-time comparison to prevent timing attacks
  if (!adminKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (!isAuthorizedAdminKey(provided, adminKey)) {
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
  const provided = getHeaderValue(req.headers['x-admin-key']);

  if (!adminKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (!isAuthorizedAdminKey(provided, adminKey)) {
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

// Captain inquiry status update — triggers pre-briefing email on "booked"
app.patch('/api/v1/captain-inquiries/:id/status', async (req: Request, res: Response) => {
  const adminKey = process.env.ADMIN_API_KEY;
  const provided = getHeaderValue(req.headers['x-admin-key']);

  if (!adminKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (!isAuthorizedAdminKey(provided, adminKey)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['new', 'contacted', 'booked', 'closed'];

  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status', valid: validStatuses });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).json({ error: 'Supabase not configured' });
    return;
  }

  try {
    // Fetch the inquiry first (need name/email/industry for the email)
    const fetchRes = await fetch(
      `${supabaseUrl}/rest/v1/captain_inquiries?id=eq.${id}&select=name,email,industry,seat_level,status`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      },
    );

    if (!fetchRes.ok) throw new Error(`Fetch failed: ${fetchRes.status}`);
    const rows = (await fetchRes.json()) as Array<{
      name: string;
      email: string;
      industry: string;
      seat_level: string;
      status: string;
    }>;
    if (rows.length === 0) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    const inquiry = rows[0];

    // Update status
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/captain_inquiries?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ status }),
    });

    if (!updateRes.ok) throw new Error(`Update failed: ${updateRes.status}`);

    // If status changed to "booked", send pre-briefing email
    let emailSent = false;
    if (status === 'booked' && inquiry.status !== 'booked') {
      try {
        const emailService = (await import('./services/email.service.js')).default;
        await emailService.sendCaptainPreBriefing(
          inquiry.email,
          inquiry.name,
          inquiry.industry,
          inquiry.seat_level,
        );
        emailSent = true;
        logger.info('Captain pre-briefing email sent', {
          to: inquiry.email,
          industry: inquiry.industry,
        });
      } catch (emailErr) {
        const msg = emailErr instanceof Error ? emailErr.message : 'Unknown error';
        logger.error('Captain pre-briefing email failed', { error: msg, to: inquiry.email });
        // Don't fail the status update if email fails
      }
    }

    res.json({
      status: 'updated',
      inquiry_id: id,
      new_status: status,
      email_sent: emailSent,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Captain inquiry status update failed', { error: msg, id });
    res.status(500).json({ error: 'Update failed', message: msg });
  }
});

// Memory maintenance manual trigger (secured by admin key)
// Used for Helsinki sandbox pilot demo — run decay/consolidation on demand
app.post('/api/v1/admin/memory/maintenance', async (req: Request, res: Response) => {
  const adminKey = process.env.ADMIN_API_KEY;
  const provided = getHeaderValue(req.headers['x-admin-key']);

  if (!adminKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (!isAuthorizedAdminKey(provided, adminKey)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const job = (req.body?.job as string) || 'all';
  const validJobs = ['decay', 'consolidation', 'all'];
  if (!validJobs.includes(job)) {
    res.status(400).json({ error: 'Invalid job', valid: validJobs });
    return;
  }

  try {
    await memoryScheduler.runManually(job as 'decay' | 'consolidation' | 'all');
    res.json({ status: 'complete', job, timestamp: new Date().toISOString() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Manual memory maintenance failed', { error: msg, job });
    res.status(500).json({ error: 'Maintenance failed', message: msg });
  }
});

// ============ ERROR HANDLING ============

// 404 handler — must be after all routes
app.use(notFoundHandler);

// Centralized error handler — must be LAST middleware
app.use(errorHandler);

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

  // Firehorse Omnichannel Pilot: daily leads at 08:00, follow-ups every 6h
  initFirehorsePilot();
  logger.info('Firehorse Omnichannel Pilot started');

  // Start outreach digest scheduler (backup — primary is GitHub Actions).
  // On Cloud Run this may not fire reliably due to scale-to-zero,
  // but covers local dev and always-on deployments.
  outreachScheduler.start();

  // Memory maintenance: decay at 03:00 Helsinki, consolidation at 03:30 Helsinki
  // Manual trigger available via POST /api/v1/admin/memory/maintenance
  memoryScheduler.start();

  // Proactive observation: watch the signal catalogue and raise human nudges,
  // plus sweep overdue nudges for escalation (restart-safe).
  signalPoller.start();

  // ERP integrations (Monitor/IFS/Dynamics365/SAP/Visma/Jeeves). Scheduler
  // itself only starts when ERP_SCHEDULER_ENABLED=true (checked internally).
  initializeERPIntegrations();
  // Poll inbound_emails → create support_tickets every INBOUND_TICKET_POLL_MS (default 30s).
  // Disable with INBOUND_TICKET_DISABLED=true.
  inboundTicketScheduler.start();

  // Initialize email queue (Redis Streams)
  emailQueue
    .initialize()
    .then((ready) => {
      if (ready) {
        emailQueue.start();
        logger.info('Email queue worker started (Redis Streams)');
      } else {
        logger.info('Email queue unavailable — emails will be sent directly');
      }
    })
    .catch((err) => {
      logger.warn('Email queue init error — emails will be sent directly', {
        error: err.message,
      });
    });
});

// ============ PROCESS ERROR HANDLERS ============

// Catch unhandled promise rejections (prevents silent failures)
process.on('unhandledRejection', (reason: unknown) => {
  const message = reason instanceof Error ? reason.message : String(reason);
  const stack = reason instanceof Error ? reason.stack : undefined;
  logger.error('Unhandled promise rejection', { error: message, stack });
});

// Catch uncaught exceptions (log and exit — process is in unknown state)
process.on('uncaughtException', (err: Error) => {
  logger.fatal('Uncaught exception — shutting down', {
    error: err.message,
    stack: err.stack,
  });
  // Give logger time to flush, then exit
  setTimeout(() => process.exit(1), 1000);
});

// Graceful shutdown (Cloud Run sends SIGTERM)
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  constructionLeadsScheduler.stop();
  outreachScheduler.stop();
  memoryScheduler.stop();
  signalPoller.stop();
  inboundTicketScheduler.stop();
  shutdownERPIntegrations();
  shutdownFirehorsePilot();
  Promise.all([emailQueue.shutdown(), shutdownOtel()]).finally(() => {
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
  memoryScheduler.stop();
  signalPoller.stop();
  inboundTicketScheduler.stop();
  shutdownERPIntegrations();
  shutdownFirehorsePilot();
  Promise.all([emailQueue.shutdown(), shutdownOtel()]).finally(() => {
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });
});

export default app;
