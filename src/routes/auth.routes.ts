import express, { type NextFunction, type Request, type Response, type Router } from 'express';
import { body, validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import AuthService from '../services/auth.service.js';
import { authenticateToken, loginRateLimit } from '../middleware/auth.middleware.js';
import EmailService from '../services/email.service.js';
import { isReservedEmailDomain } from '../utils/email-domain-guard.js';

const router: Router = express.Router();

// ============ VALIDATION RULES ============

// SECURITY FIX #5: Enhanced password validation with complexity requirements
// Enterprise requirements for EU regulatory data compliance
const passwordValidation = body('password')
  .isLength({ min: 12, max: 128 })
  .withMessage('Password must be between 12 and 128 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')
  .matches(/[^A-Za-z0-9]/)
  .withMessage('Password must contain at least one special character')
  .not()
  .matches(/(.)\1{2,}/)
  .withMessage('Password cannot contain more than 2 consecutive identical characters')
  .trim();

const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .custom((value: string) => {
      if (isReservedEmailDomain(value)) {
        throw new Error('Email domain is reserved for documentation/testing and cannot register');
      }
      return true;
    }),
  passwordValidation,
  body('firstName').isLength({ min: 1, max: 100 }).trim(),
  body('lastName').isLength({ min: 1, max: 100 }).trim(),
];

const loginValidation = [body('email').isEmail().normalizeEmail(), body('password').trim()];

// ============ MIDDLEWARE ============

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // SECURITY FIX #7: Sanitize errors - don't expose submitted values
    const sanitizedErrors = errors.array().map((err) => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg,
      location: (err as { location?: string }).location,
      // NOTE: Do NOT include 'value' field - may contain sensitive data
    }));
    logger.warn('Validation error', { errors: sanitizedErrors });
    return res.status(400).json({
      error: 'Validation Error',
      details: sanitizedErrors, // Return sanitized errors, not raw
    });
  }
  return next();
};

// ============ ROUTES ============

/**
 * POST /api/v1/auth/register
 * Register a new user
 *
 * Creates user in the dev store, generates email verification token,
 * and sends a verification email via the email service.
 *
 * Note: Primary registration may also be handled by Supabase Auth on the frontend.
 * This endpoint handles API-based registration with full backend flow.
 */
router.post(
  '/register',
  registerValidation,
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, role, accessLevel } = req.body;

      logger.info('User registration attempt', { email });

      // Register user (persists to dev store, will be Supabase in production)
      const user = await AuthService.registerUser(email, password, {
        firstName,
        lastName,
        role,
        accessLevel,
      });

      // Generate email verification token (side-effect: stores token for later verification)
      AuthService.generateEmailVerificationToken(email);

      // Send verification email (non-blocking — registration succeeds even if email fails)
      EmailService.sendWelcomeEmail(email, firstName || email).catch((err) => {
        logger.warn('Failed to send welcome email', { error: err.message, email });
      });

      logger.info('User registered successfully', {
        userId: user.id,
        email: user.email,
      });

      return res.status(201).json({
        message: 'Registration successful. Check your email to verify your account.',
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          accessLevel: user.accessLevel,
        },
      });
    } catch (error) {
      logger.error('Registration error', { error: error instanceof Error ? error.message : String(error) });

      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
        return res.status(409).json({
          error: 'Registration failed',
          message: 'An account with this email already exists.',
        });
      }

      return res.status(500).json({
        error: 'Registration failed',
        message: 'An error occurred during registration. Please try again later.',
      });
    }
  },
);

/**
 * POST /api/v1/auth/login
 * User login
 * Rate limited by both IP (app.ts) and email (custom middleware)
 */
router.post(
  '/login',
  loginValidation,
  validateRequest,
  loginRateLimit(),
  async (req: Request, res: Response) => {
    try {
      const { email, password, communityMode } = req.body;

      logger.info('User login attempt', { email, communityMode });

      // Authenticate user with email and password
      const authResponse = await AuthService.authenticate({ email, password });

      // Cookie-based rememberMe deferred — requires cookie-parser middleware.
      // Frontend stores refreshToken in localStorage when rememberMe is true.
      // if (rememberMe && authResponse.refreshToken) {
      //   res.cookie('refreshToken', authResponse.refreshToken, {
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV === 'production',
      //     sameSite: 'strict',
      //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      //   });
      // }

      logger.info('User logged in successfully', {
        userId: authResponse.user.id,
        email,
        communityMode: communityMode || false,
      });

      res.status(200).json({
        message: 'Login successful',
        token: authResponse.token,
        refreshToken: authResponse.refreshToken,
        expiresIn: authResponse.expiresIn,
        user: authResponse.user,
      });
    } catch (error) {
      logger.error('Login error', { error: error instanceof Error ? error.message : String(error) });
      res.status(401).json({
        error: 'Login failed',
        message: 'Invalid email or password',
      });
    }
  },
);

/**
 * POST /api/v1/auth/logout
 * User logout
 * Requires: Authentication
 *
 * SECURITY FIX #4: Token revocation implemented
 * Tokens are now blacklisted on logout and cannot be reused.
 *
 * Note: For production distributed systems, replace in-memory blacklist with Redis.
 */
router.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    // SECURITY FIX #4: Revoke the access token (async for Redis support)
    if (req.token) {
      await AuthService.revokeToken(req.token, 86400); // 24h expiry for access tokens
    }

    logger.info('User logout successful - token revoked', {
      userId: req.userId,
      userEmail: req.userEmail,
    });

    res.status(200).json({
      message: 'Logout successful',
      note: 'Token has been revoked. Client should clear stored tokens.',
    });
  } catch (error) {
    logger.error('Logout error', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({
      error: 'Logout failed',
      message: 'An error occurred during logout. Please try again later.',
    });
  }
});

/**
 * POST /api/v1/auth/verify-email
 * Verify email address
 */
router.post(
  '/verify-email',
  [body('token').trim()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      logger.info('Email verification attempt');

      // Validate the token and get the associated email
      const email = AuthService.verifyEmailToken(token);

      if (!email) {
        res.status(400).json({
          error: 'Email verification failed',
          message: 'Invalid or expired verification token.',
        });
        return;
      }

      // Mark the user's email as verified
      const marked = AuthService.markEmailVerified(email);

      if (!marked) {
        res.status(404).json({
          error: 'Email verification failed',
          message: 'User account not found.',
        });
        return;
      }

      logger.info('Email verified successfully', { email });

      res.status(200).json({
        message: 'Email verified successfully. You can now log in.',
        email,
      });
    } catch (error) {
      logger.error('Email verification error', { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({
        error: 'Email verification failed',
        message: 'An error occurred during email verification.',
      });
    }
  },
);

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    // Note: req.cookies not available without cookie-parser middleware
    // Currently only supporting refresh token from request body
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      logger.warn('Token refresh attempt without refresh token');
      return res.status(401).json({
        error: 'Token refresh failed',
        message: 'Refresh token is required',
      });
    }

    // Verify and refresh token
    const newAccessToken = await AuthService.refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      logger.warn('Failed to refresh token');
      return res.status(401).json({
        error: 'Token refresh failed',
        message: 'Invalid or expired refresh token',
      });
    }

    logger.info('Access token refreshed successfully');

    return res.status(200).json({
      message: 'Token refreshed',
      token: newAccessToken,
      expiresIn: 86400, // 24 hours
    });
  } catch (error) {
    logger.error('Token refresh error', { error: error instanceof Error ? error.message : String(error) });
    return res.status(500).json({
      error: 'Token refresh failed',
      message: 'An error occurred while refreshing the token. Please try again later.',
    });
  }
});

/**
 * POST /api/v1/auth/forgot-password
 * Request password reset
 *
 * Generates a reset token, sends a reset email, and returns success.
 * SECURITY: Always returns 200 regardless of whether the email exists
 * to prevent email enumeration attacks.
 */
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      logger.info('Password reset request', { email });

      // Generate reset token (returns null if user doesn't exist, but we don't tell the caller)
      const resetToken = AuthService.generatePasswordResetToken(email);

      if (resetToken) {
        // User exists — send the reset email
        const resetLink = `${process.env.APP_URL || 'https://dws6.com'}/reset-password?token=${resetToken}`;
        EmailService.sendPasswordResetEmail(email, resetLink).catch((err) => {
          logger.warn('Failed to send password reset email', { error: err.message });
        });
      }

      // Always return 200 to prevent email enumeration
      res.status(200).json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    } catch (error) {
      logger.error('Password reset error', { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({
        error: 'Password reset failed',
        message: 'An error occurred while processing your request. Please try again later.',
      });
    }
  },
);

/**
 * POST /api/v1/auth/reset-password
 * Reset password using a valid reset token
 */
router.post(
  '/reset-password',
  [body('token').isString().trim().isLength({ min: 1 }), passwordValidation],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;

      logger.info('Password reset attempt');

      const success = await AuthService.resetPassword(token, password);

      if (!success) {
        res.status(400).json({
          error: 'Password reset failed',
          message: 'Invalid or expired reset token.',
        });
        return;
      }

      logger.info('Password reset successful');

      res.status(200).json({
        message: 'Password reset successful. You can now log in with your new password.',
      });
    } catch (error) {
      logger.error('Password reset error', { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({
        error: 'Password reset failed',
        message: 'An error occurred while resetting your password.',
      });
    }
  },
);

export default router;
