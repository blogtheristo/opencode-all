/**
 * Authentication Service
 * JWT-based authentication for DWS IQ Backend
 *
 * SECURITY: This service handles authentication for EU regulatory data.
 * All credentials must be verified against the database before issuing tokens.
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

// SECURITY FIX #1: Fail fast if JWT_SECRET is not set or too weak
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  const errorMsg = 'FATAL: JWT_SECRET environment variable must be set. Application cannot start without a secure secret.';
  logger.error(errorMsg);
  throw new Error(errorMsg);
}
if (JWT_SECRET.length < 32) {
  const errorMsg = 'FATAL: JWT_SECRET must be at least 32 characters long for adequate security.';
  logger.error(errorMsg);
  throw new Error(errorMsg);
}

const JWT_EXPIRES_IN = '24h';
const JWT_REFRESH_EXPIRES_IN = '7d';

// Dummy hash for timing attack prevention (bcrypt hash of random string)
const DUMMY_HASH = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G0000000000000';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  accessLevel?: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

interface AuthenticateParams {
  email: string;
  password: string;
}

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  accessLevel?: string;
}

// User repository interface - implement with Supabase in production
interface UserRepository {
  findByEmail(email: string): Promise<StoredUser | null>;
}

// Temporary in-memory user store for development
// SECURITY: Replace with Supabase integration before production
const devUserStore = new Map<string, StoredUser>();

// SECURITY FIX #4: Token blacklist for revocation
// Uses Redis in production, falls back to in-memory for development
// @see src/services/redis-token-blacklist.service.ts for Redis implementation
import * as RedisBlacklist from './redis-token-blacklist.service.js';

// In-memory fallback for development (when Redis not available)
const tokenBlacklist = new Map<string, number>();

// Clean expired tokens from blacklist periodically (every 5 minutes)
// Only used when Redis is not available
setInterval(() => {
  const now = Date.now();
  for (const [hash, expiry] of tokenBlacklist.entries()) {
    if (expiry < now) {
      tokenBlacklist.delete(hash);
    }
  }
}, 5 * 60 * 1000);

// Flag to track if Redis is available
let useRedis = false;

// Initialize Redis if configured
if (process.env.REDIS_URL || process.env.REDIS_HOST) {
  RedisBlacklist.initializeRedis()
    .then(() => {
      useRedis = true;
      logger.info('Token blacklist using Redis');
    })
    .catch((err) => {
      logger.warn('Redis not available, using in-memory token blacklist', { error: err.message });
    });
}

class AuthService {
  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT access token
   */
  generateAccessToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        accessLevel: user.accessLevel,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  /**
   * Generate JWT refresh token
   */
  generateRefreshToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        type: 'refresh',
      },
      JWT_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
  }

  /**
   * Verify JWT token
   * SECURITY FIX #4: Check blacklist before returning decoded token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      // Check if token is revoked (async for Redis support)
      const revoked = await this.isTokenRevoked(token);
      if (revoked) {
        logger.warn('Attempted use of revoked token');
        return null;
      }

      return jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256'],  // SECURITY FIX #9: Explicitly specify algorithm
      });
    } catch (error) {
      logger.warn('Token verification failed', { error: (error as Error).message });
      return null;
    }
  }

  /**
   * Verify access token (alias for verifyToken)
   */
  async verifyAccessToken(token: string): Promise<any> {
    return this.verifyToken(token);
  }

  /**
   * SECURITY FIX #4: Revoke a token (add to blacklist)
   * Uses Redis if available, falls back to in-memory
   * @param token - The JWT token to revoke
   * @param expiresIn - Token expiry in seconds (default 24h for access tokens)
   */
  async revokeToken(token: string, expiresIn: number = 86400): Promise<void> {
    if (useRedis) {
      await RedisBlacklist.revokeToken(token, expiresIn);
    } else {
      // In-memory fallback
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const expiryTimestamp = Date.now() + (expiresIn * 1000);
      tokenBlacklist.set(tokenHash, expiryTimestamp);
      logger.info('Token revoked (in-memory)', { tokenHash: tokenHash.substring(0, 16) });
    }
  }

  /**
   * SECURITY FIX #4: Check if token is revoked
   * Uses Redis if available, falls back to in-memory
   */
  async isTokenRevoked(token: string): Promise<boolean> {
    if (useRedis) {
      return RedisBlacklist.isTokenRevoked(token);
    }

    // In-memory fallback
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiry = tokenBlacklist.get(tokenHash);

    if (!expiry) {
      return false;
    }

    // If expiry has passed, remove from blacklist and return false
    if (expiry < Date.now()) {
      tokenBlacklist.delete(tokenHash);
      return false;
    }

    return true;
  }

  /**
   * Refresh access token using refresh token
   */
  refreshAccessToken(refreshToken: string): string | null {
    const decoded = this.verifyToken(refreshToken);
    if (!decoded || decoded.type !== 'refresh') {
      return null;
    }

    const user: User = {
      id: decoded.userId,
      email: decoded.email,
    };

    return this.generateAccessToken(user);
  }

  /**
   * Authenticate user with email and password
   * SECURITY FIX #2: Properly verify credentials against stored hash
   */
  async authenticate(params: AuthenticateParams): Promise<AuthResponse> {
    const { email, password } = params;

    // Hash email for logging (GDPR compliance - don't log PII)
    const emailHash = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex').substring(0, 16);
    logger.info('Authentication attempt', { emailHash });

    // Fetch user from database
    const storedUser = await this.findUserByEmail(email);

    if (!storedUser) {
      // SECURITY: Perform dummy comparison to prevent timing attacks
      // This ensures the response time is similar whether user exists or not
      await bcrypt.compare(password, DUMMY_HASH);
      logger.warn('Authentication failed: user not found', { emailHash });
      throw new Error('Invalid credentials');
    }

    // Verify password against stored hash
    const isValidPassword = await this.comparePassword(password, storedUser.passwordHash);

    if (!isValidPassword) {
      logger.warn('Authentication failed: invalid password', { emailHash });
      throw new Error('Invalid credentials');
    }

    // User authenticated successfully
    const user: User = {
      id: storedUser.id,
      email: storedUser.email,
      firstName: storedUser.firstName,
      lastName: storedUser.lastName,
      role: storedUser.role || 'dws_iq_standard',
      accessLevel: storedUser.accessLevel || 'free',
    };

    const token = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    logger.info('Authentication successful', { emailHash, userId: user.id });

    return {
      token,
      refreshToken,
      expiresIn: 86400, // 24 hours in seconds
      user,
    };
  }

  /**
   * Find user by email - integrates with user store
   * TODO: Replace with Supabase query in production
   */
  private async findUserByEmail(email: string): Promise<StoredUser | null> {
    const normalizedEmail = email.toLowerCase().trim();
    return devUserStore.get(normalizedEmail) || null;
  }

  /**
   * Register a new user (for development/testing)
   * TODO: Replace with Supabase integration in production
   */
  async registerUser(email: string, password: string, userData?: Partial<StoredUser>): Promise<User> {
    const normalizedEmail = email.toLowerCase().trim();

    if (devUserStore.has(normalizedEmail)) {
      throw new Error('User already exists');
    }

    const passwordHash = await this.hashPassword(password);
    const userId = `user-${crypto.randomUUID()}`;

    const storedUser: StoredUser = {
      id: userId,
      email: normalizedEmail,
      passwordHash,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      role: userData?.role || 'dws_iq_standard',
      accessLevel: userData?.accessLevel || 'free',
    };

    devUserStore.set(normalizedEmail, storedUser);

    logger.info('User registered', { userId });

    return {
      id: storedUser.id,
      email: storedUser.email,
      firstName: storedUser.firstName,
      lastName: storedUser.lastName,
      role: storedUser.role,
      accessLevel: storedUser.accessLevel,
    };
  }
}

export default new AuthService();
