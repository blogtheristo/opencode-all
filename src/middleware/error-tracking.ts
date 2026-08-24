/**
 * DWS IQ 6 - Error Tracking Service
 *
 * Provides Sentry integration for production error tracking.
 * Gracefully degrades to console logging when Sentry is not configured.
 *
 * Setup:
 *   1. npm install @sentry/node
 *   2. Set SENTRY_DSN in .env
 *   3. Import and call initErrorTracking() before app.listen()
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD (final MVP items)
 * Date: 2026-03-22
 */


import { type Express, type NextFunction, type Request, type Response } from 'express';
import logger from '../utils/logger.js';

// ============ TYPES ============

interface ErrorTrackingConfig {
  dsn: string;
  environment: string;
  release?: string;
  tracesSampleRate?: number;
  profilesSampleRate?: number;
}

interface SentryEventLike {
  request?: { url?: string };
  [key: string]: unknown;
}

interface SentryLike {
  init: (config: Record<string, unknown>) => void;
  captureException: (error: Error, context?: Record<string, unknown>) => string;
  captureMessage: (message: string, level?: string) => string;
  setUser: (user: { id: string; email?: string } | null) => void;
  setupExpressErrorHandler: (app: Express) => void;
  startSpan: (options: Record<string, unknown>, callback: () => unknown) => unknown;
  isInitialized: () => boolean;
}

// ============ STATE ============

let sentry: SentryLike | null = null;
let initialized = false;

// ============ PUBLIC API ============

/**
 * Initialize error tracking. Call once before app.listen().
 * Safely skips if SENTRY_DSN is not set or @sentry/node is not installed.
 */
export async function initErrorTracking(app?: Express): Promise<boolean> {
  if (initialized) return sentry !== null;

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    logger.info('Error tracking: SENTRY_DSN not set — using console fallback');
    initialized = true;
    return false;
  }

  try {
    // Dynamic import — allows the app to start without @sentry/node installed
    const Sentry = await import('@sentry/node');
    sentry = Sentry as unknown as SentryLike;

    const config: ErrorTrackingConfig = {
      dsn,
      environment: process.env.NODE_ENV || 'development',
      release: process.env.APP_VERSION || `dws-iq-6@${process.env.npm_package_version || '0.0.0'}`,
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
      profilesSampleRate: parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE || '0.1'),
    };

    sentry.init({
      ...config,
      // Filter out health check noise
      beforeSend(event: SentryEventLike | null) {
        const url = event?.request?.url;
        if (typeof url === 'string' && (url.includes('/health') || url.includes('/livez'))) {
          return null;
        }
        return event;
      },
      // Ignore common non-actionable errors
      ignoreErrors: [
        'ECONNRESET',
        'EPIPE',
        'ECONNREFUSED',
        'AbortError',
        'socket hang up',
      ],
    });

    // Attach Express error handler if app provided
    if (app && typeof sentry.setupExpressErrorHandler === 'function') {
      sentry.setupExpressErrorHandler(app);
    }

    initialized = true;
    logger.info('Error tracking: Sentry initialized', {
      environment: config.environment,
      release: config.release,
      tracesSampleRate: config.tracesSampleRate,
    });
    return true;
  } catch (err) {
    logger.warn('Error tracking: @sentry/node not available — using console fallback', {
      error: err instanceof Error ? err.message : String(err),
    });
    initialized = true;
    return false;
  }
}

/**
 * Capture an exception. Works with or without Sentry.
 */
export function captureException(error: Error, context?: Record<string, unknown>): string {
  const eventId = `local-${Date.now().toString(36)}`;

  if (sentry) {
    try {
      return sentry.captureException(error, { extra: context });
    } catch {
      // Sentry itself failed — fall through to console
    }
  }

  // Console fallback
  logger.error('Captured exception', {
    eventId,
    name: error.name,
    message: error.message,
    stack: error.stack?.split('\n').slice(0, 5).join('\n'),
    ...context,
  });

  return eventId;
}

/**
 * Capture a message (non-exception event).
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): string {
  if (sentry) {
    try {
      return sentry.captureMessage(message, level);
    } catch {
      // Fall through
    }
  }

  const eventId = `local-${Date.now().toString(36)}`;
  logger[level === 'warning' ? 'warn' : level](message, { eventId });
  return eventId;
}

/**
 * Set user context for error tracking.
 */
export function setUser(user: { id: string; email?: string } | null): void {
  if (sentry) {
    try {
      sentry.setUser(user);
    } catch {
      // Silently ignore
    }
  }
}

/**
 * Express middleware that captures unhandled errors and forwards them.
 *
 * Register this BEFORE the main errorHandler so it can observe and track
 * all errors, including those that errorHandler will terminate.
 */
export function errorTrackingMiddleware() {
  return (err: Error, req: Request, _res: Response, next: NextFunction) => {
    captureException(err, {
      method: req.method,
      url: req.originalUrl,
      correlationId: req.correlationId,
      userId: req.user?.id,
    });
    next(err);
  };
}

/**
 * Check if Sentry is active.
 */
export function isErrorTrackingActive(): boolean {
  return sentry !== null && initialized;
}
