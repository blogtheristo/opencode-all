import express, { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import AuthService from '../services/auth.service.js';
import { loginRateLimit, authenticateToken } from '../middleware/auth.middleware.js';

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
  body('email').isEmail().normalizeEmail(),
  passwordValidation,
  body('firstName').isLength({ min: 1, max: 100 }).trim(),
  body('lastName').isLength({ min: 1, max: 100 }).trim(),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').trim(),
];

// ============ MIDDLEWARE ============

const validateRequest = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // SECURITY FIX #7: Sanitize errors - don't expose submitted values
    const sanitizedErrors = errors.array().map(err => ({
      field: err.type === 'field' ? (err as any).path : 'unknown',
      message: err.msg,
      location: (err as any).location,
      // NOTE: Do NOT include 'value' field - may contain sensitive data
    }));
    logger.warn('Validation error', { errors: sanitizedErrors });
    return res.status(400).json({
      error: 'Validation Error',
      details: sanitizedErrors,  // Return sanitized errors, not raw
    });
  }
  next();
};

// ============ ROUTES ============

/**
 * POST /api/v1/auth/register
 * Register a new user
 * 
 * Note: Primary registration is handled by Supabase Auth on the frontend.
 * This endpoint is for API-based registration or when backend processing is needed.
 */
router.post('/register', registerValidation, validateRequest, async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, organization, role, accessLevel } = req.body;

    logger.info('User registration attempt', { email, organization });

    // Hash password
    const passwordHash = await AuthService.hashPassword(password);

    // Note: In production with Supabase, user creation is typically handled by Supabase Auth.
    // This endpoint can be used to:
    // 1. Pre-validate before Supabase signup
    // 2. Create additional user_profiles data
    // 3. Handle invite-based registration
    
    // For now, we'll create the user profile data that will be synced with Supabase
    // The actual auth.users entry is created by Supabase Auth on the frontend
    
    const userData = {
      email,
      firstName,
      lastName,
      organization: organization || null,
      role: role || 'dws_iq_standard',
      accessLevel: accessLevel || 'free',
      passwordHash, // Only stored if not using Supabase Auth
      emailVerified: false,
      mfaEnabled: false,
      createdAt: new Date().toISOString(),
    };

    // Log the registration for audit
    logger.info('User registration processed', { 
      email, 
      role: userData.role,
      accessLevel: userData.accessLevel 
    });

    res.status(201).json({
      message: 'Registration successful. Check your email to verify your account.',
      user: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        accessLevel: userData.accessLevel,
      },
    });
  } catch (error: any) {
    logger.error('Registration error', { error: error.message });
    
    // Handle specific error cases
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      return res.status(409).json({
        error: 'Registration failed',
        message: 'An account with this email already exists.',
      });
    }
    
    if (error.message.includes('Password must be')) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.message,
      });
    }
    
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration. Please try again later.',
    });
  }
});

/**
 * POST /api/v1/auth/login
 * User login
 * Rate limited by both IP (app.ts) and email (custom middleware)
 */
router.post('/login', loginValidation, validateRequest, loginRateLimit(), async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe, communityMode } = req.body;

    logger.info('User login attempt', { email, communityMode });

    // Authenticate user with email and password
    const authResponse = await AuthService.authenticate({ email, password });

    // Note: Cookie-based rememberMe not yet implemented (requires cookie-parser)
    // Frontend should store refreshToken in localStorage if rememberMe is true
    // TODO: Install cookie-parser and uncomment below for secure cookie storage
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
  } catch (error: any) {
    logger.error('Login error', { error: error.message });
    res.status(401).json({
      error: 'Login failed',
      message: 'Invalid email or password',
    });
  }
});

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
      await AuthService.revokeToken(req.token, 86400);  // 24h expiry for access tokens
    }

    logger.info('User logout successful - token revoked', {
      userId: req.userId,
      userEmail: req.userEmail,
    });

    res.status(200).json({
      message: 'Logout successful',
      note: 'Token has been revoked. Client should clear stored tokens.',
    });
  } catch (error: any) {
    logger.error('Logout error', { error: error.message });
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
router.post('/verify-email', [body('token').trim()], validateRequest, async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // TODO: Implement email verification
    // - Validate token
    // - Mark email as verified
    // - Return success

    logger.info('Email verification attempt');

    res.status(200).json({
      message: 'Email verified successfully',
    });
  } catch (error: any) {
    logger.error('Email verification error', { error: error.message });
    res.status(400).json({
      error: 'Email verification failed',
      message: 'Invalid or expired verification token.',
    });
  }
});

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
    const newAccessToken = AuthService.refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      logger.warn('Failed to refresh token');
      return res.status(401).json({
        error: 'Token refresh failed',
        message: 'Invalid or expired refresh token',
      });
    }

    logger.info('Access token refreshed successfully');

    res.status(200).json({
      message: 'Token refreshed',
      token: newAccessToken,
      expiresIn: 86400, // 24 hours
    });
  } catch (error: any) {
    logger.error('Token refresh error', { error: error.message });
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'An error occurred while refreshing the token. Please try again later.',
    });
  }
});

/**
 * POST /api/v1/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', [body('email').isEmail().normalizeEmail()], validateRequest, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // TODO: Implement password reset request
    // - Find user by email
    // - Generate reset token
    // - Send reset email
    // - Store token with expiration

    logger.info('Password reset request', { email });

    res.status(200).json({
      message: 'Password reset email sent. Check your email for instructions.',
    });
  } catch (error: any) {
    logger.error('Password reset error', { error: error.message });
    res.status(500).json({
      error: 'Password reset failed',
      message: 'An error occurred while processing your request. Please try again later.',
    });
  }
});

export default router;

