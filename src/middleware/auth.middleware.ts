import { type NextFunction, type Request, type Response } from 'express';
import logger from '../utils/logger.js';
import AuthService from '../services/auth.service.js';

// Valid user roles for RBAC
type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      userRole?: UserRole;
      organizationId?: string;
      token?: string;
    }
  }
}

/**
 * Middleware to verify JWT token from Authorization header
 * Now async to support Redis-based token blacklist
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
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

    // Verify token (async for Redis blacklist support)
    const decoded = await AuthService.verifyAccessToken(token);

    if (!decoded) {
      logger.warn('Invalid or expired token');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    // Attach user info to request
    // SECURITY FIX #6: Extract role from JWT for RBAC
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role as UserRole; // Extract role for requireRole middleware
    req.organizationId =
      typeof decoded.organizationId === 'string'
        ? decoded.organizationId
        : typeof decoded.orgId === 'string'
          ? decoded.orgId
          : undefined;
    req.token = token;

    logger.debug('Token verified successfully', { userId: decoded.userId, role: decoded.role });

    return next();
  } catch (error) {
    logger.error('Token verification failed', { error });
    return res.status(500).json({
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
export const authenticateTokenFromCookie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    const decoded = await AuthService.verifyAccessToken(token);

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

    return next();
  } catch (error) {
    logger.error('Cookie token verification failed', { error });
    return res.status(500).json({
      error: 'Server error',
      message: 'Failed to verify token',
    });
  }
};

/**
 * Middleware for optional authentication
 * Doesn't fail if no token, but attaches user info if token is valid
 */
export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Try to get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = await AuthService.verifyAccessToken(token);

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

    return next();
  } catch (error) {
    logger.error('Auth check failed', { error });
    return res.status(500).json({
      error: 'Server error',
      message: 'Failed to check authentication',
    });
  }
};

/**
 * Middleware factory to require specific role(s)
 * Must be used after authenticateToken middleware
 *
 * @param allowedRoles - Array of roles that are allowed to access the route
 * @returns Express middleware function
 *
 * @example
 * // Allow only admins and owners
 * router.get('/admin/users', authenticateToken, requireRole(['admin', 'owner']), handler);
 *
 * @example
 * // Allow any authenticated member
 * router.get('/projects', authenticateToken, requireRole(['owner', 'admin', 'member']), handler);
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        logger.warn('Role check failed: User not authenticated');
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      // Get user role from request (should be set by prior middleware or token)
      // In production, this would query the database or be included in the JWT
      const userRole = req.userRole;

      if (!userRole) {
        // If role isn't set, try to get it from the user's metadata
        // This is a fallback - ideally role should be in the token or set by middleware
        logger.warn('User role not found in request', { userId: req.userId });
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Unable to determine user role',
        });
      }

      if (!allowedRoles.includes(userRole)) {
        logger.warn('Access denied: Insufficient role', {
          userId: req.userId,
          userRole,
          requiredRoles: allowedRoles,
        });
        return res.status(403).json({
          error: 'Forbidden',
          message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`,
        });
      }

      logger.debug('Role check passed', {
        userId: req.userId,
        userRole,
        requiredRoles: allowedRoles,
      });

      return next();
    } catch (error) {
      logger.error('Role check failed', { error });
      return res.status(500).json({
        error: 'Server error',
        message: 'Failed to verify user role',
      });
    }
  };
};

/**
 * Middleware to require organization ownership or admin role
 * Checks if user has admin/owner role in the specified organization
 *
 * @example
 * router.put('/organizations/:orgId', authenticateToken, requireOrgAdmin, handler);
 */
export const requireOrgAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const orgId = req.params.orgId || req.body.organizationId || req.organizationId;

    if (!orgId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Organization ID is required',
      });
    }

    // In production, this would query the organization_members table
    // to check if the user has admin or owner role in the organization
    // For now, we'll use the role from the request
    const userRole = req.userRole;

    if (!userRole || !['owner', 'admin'].includes(userRole)) {
      logger.warn('Organization admin access denied', {
        userId: req.userId,
        organizationId: orgId,
        userRole,
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin or owner role required for this action',
      });
    }

    req.organizationId = orgId;
    return next();
  } catch (error) {
    logger.error('Org admin check failed', { error });
    return res.status(500).json({
      error: 'Server error',
      message: 'Failed to verify organization access',
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
      logger.debug('Rate limiter cleanup', {
        entriesRemoved: cleaned,
        remainingEntries: attempts.size,
      });
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

  res.send = function (data: unknown) {
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
  requireRole,
  requireOrgAdmin,
  loginRateLimit,
  authLogger,
};
