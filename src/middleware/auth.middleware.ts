import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';
import AuthService from '../services/auth.service.js';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      token?: string;
    }
  }
}

/**
 * Middleware to verify JWT token from Authorization header
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header (Bearer token)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer token"

    if (!token) {
      logger.warn('Missing authorization token');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided',
      });
    }

    // Verify token
    const decoded = AuthService.verifyAccessToken(token);

    if (!decoded) {
      logger.warn('Invalid or expired token');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    // Attach user info to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.token = token;

    logger.debug('Token verified successfully', { userId: decoded.userId });

    next();
  } catch (error) {
    logger.error('Token verification failed', { error });
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to verify token',
    });
  }
};

/**
 * Middleware to verify token from cookies (for traditional sessions)
 * NOTE: Currently not functional - requires cookie-parser middleware
 * @deprecated Use authenticateToken (Authorization header) instead
 */
export const authenticateTokenFromCookie = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Note: req.cookies not available without cookie-parser middleware
    // This middleware is currently non-functional
    const token = req.cookies?.accessToken;

    if (!token) {
      logger.warn('Missing authentication cookie or cookie-parser not configured');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Cookie-based authentication not available. Use Authorization header.',
      });
    }

    // Verify token
    const decoded = AuthService.verifyAccessToken(token);

    if (!decoded) {
      logger.warn('Invalid or expired cookie token');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    // Attach user info to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.token = token;

    logger.debug('Cookie token verified successfully', { userId: decoded.userId });

    next();
  } catch (error) {
    logger.error('Cookie token verification failed', { error });
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to verify token',
    });
  }
};

/**
 * Middleware for optional authentication
 * Doesn't fail if no token, but attaches user info if token is valid
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Try to get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = AuthService.verifyAccessToken(token);

      if (decoded) {
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        req.token = token;
        logger.debug('Optional auth: User authenticated', { userId: decoded.userId });
      }
    }

    next();
  } catch (error) {
    logger.warn('Optional auth verification failed', { error });
    // Continue without auth info
    next();
  }
};

/**
 * Middleware to check if user is authenticated, otherwise redirect to login
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      logger.warn('Access denied: User not authenticated');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    next();
  } catch (error) {
    logger.error('Auth check failed', { error });
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to check authentication',
    });
  }
};

/**
 * Middleware to rate limit login attempts
 */
export const loginRateLimit = () => {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // Clean up every hour

  // Periodic cleanup to prevent memory leak
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    let cleaned = 0;

    for (const [email, data] of attempts.entries()) {
      if (now > data.resetTime) {
        attempts.delete(email);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug('Rate limiter cleanup', { entriesRemoved: cleaned, remainingEntries: attempts.size });
    }
  }, CLEANUP_INTERVAL_MS);

  // Ensure cleanup doesn't prevent process exit
  cleanupInterval.unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const emailRaw = req.body?.email;
    const email = typeof emailRaw === 'string' ? emailRaw.toLowerCase() : undefined;

    if (!email) {
      return next();
    }

    const now = Date.now();
    const userAttempts = attempts.get(email);

    if (!userAttempts || now > userAttempts.resetTime) {
      // Reset if first attempt or window expired
      // Clean up the old entry if it exists
      if (userAttempts) {
        attempts.delete(email);
      }
      attempts.set(email, { count: 1, resetTime: now + WINDOW_MS });
      return next();
    }

    // Increment attempt count
    userAttempts.count++;

    if (userAttempts.count > MAX_ATTEMPTS) {
      const remainingTime = Math.ceil((userAttempts.resetTime - now) / 1000 / 60);
      logger.warn('Too many login attempts', { email, attempts: userAttempts.count });
      return res.status(429).json({
        error: 'Too many login attempts',
        message: `Please try again in ${remainingTime} minutes`,
        retryAfter: remainingTime * 60,
      });
    }

    next();
  };
};

/**
 * Middleware to log authentication events
 */
export const authLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function (data: any) {
    if (req.path.includes('/auth/')) {
      logger.info('Auth route accessed', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        email: req.body.email || req.userId || 'unknown',
      });
    }

    return originalSend.call(this, data);
  };

  next();
};

export default {
  authenticateToken,
  authenticateTokenFromCookie,
  optionalAuth,
  requireAuth,
  loginRateLimit,
  authLogger,
};

