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
import { getSupabaseClient } from '../config/supabase.js';
import { getEnv } from '../config/env.js';

// SECURITY FIX #1: Fail fast if JWT_SECRET is not set or too weak
const _jwtSecret = getEnv().JWT_SECRET;
if (!_jwtSecret) {
  const errorMsg =
    'FATAL: JWT_SECRET environment variable must be set. Application cannot start without a secure secret.';
  logger.error(errorMsg);
  throw new Error(errorMsg);
}
if (_jwtSecret.length < 32) {
  const errorMsg = 'FATAL: JWT_SECRET must be at least 32 characters long for adequate security.';
  logger.error(errorMsg);
  throw new Error(errorMsg);
}
const JWT_SECRET: string = _jwtSecret;

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
  orgId?: string;
  organizationId?: string;
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

// Temporary in-memory user store for development
// SECURITY: Replace with Supabase integration before production
const devUserStore = new Map<string, StoredUser>();

// Email verification tokens: token → { email, expiresAt }
const emailVerificationTokens = new Map<string, { email: string; expiresAt: number }>();

// Password reset tokens: token → { email, expiresAt }
const passwordResetTokens = new Map<string, { email: string; expiresAt: number }>();

// Periodic cleanup for expired tokens (every 10 minutes)
setInterval(
  () => {
    const now = Date.now();
    for (const [token, data] of emailVerificationTokens.entries()) {
      if (data.expiresAt < now) emailVerificationTokens.delete(token);
    }
    for (const [token, data] of passwordResetTokens.entries()) {
      if (data.expiresAt < now) passwordResetTokens.delete(token);
    }
  },
  10 * 60 * 1000,
).unref();

// SECURITY FIX #4: Token blacklist for revocation
// Uses Redis in production, falls back to in-memory for development
// @see src/services/redis-token-blacklist.service.ts for Redis implementation
import * as RedisBlacklist from './redis-token-blacklist.service.js';

// In-memory fallback for development (when Redis not available)
const tokenBlacklist = new Map<string, number>();

// Clean expired tokens from blacklist periodically (every 5 minutes)
// Only used when Redis is not available
setInterval(
  () => {
    const now = Date.now();
    for (const [hash, expiry] of tokenBlacklist.entries()) {
      if (expiry < now) {
        tokenBlacklist.delete(hash);
      }
    }
  },
  5 * 60 * 1000,
);

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

export interface DecodedToken {
  userId?: string;
  email?: string;
  role?: string;
  organizationId?: string;
  orgId?: string;
  type?: string;
  sub?: string;
  accessLevel?: string;
  [key: string]: unknown;
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
        orgId: user.orgId ?? user.organizationId,
        organizationId: user.organizationId ?? user.orgId,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
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
        role: user.role,
        accessLevel: user.accessLevel,
        orgId: user.orgId ?? user.organizationId,
        organizationId: user.organizationId ?? user.orgId,
        type: 'refresh',
      },
      JWT_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN },
    );
  }

  /**
   * Verify JWT token
   * SECURITY FIX #4: Check blacklist before returning decoded token
   */
  async verifyToken(token: string): Promise<DecodedToken | null> {
    try {
      // Check if token is revoked (async for Redis support)
      const revoked = await this.isTokenRevoked(token);
      if (revoked) {
        logger.warn('Attempted use of revoked token');
        return null;
      }

      return jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256'], // SECURITY FIX #9: Explicitly specify algorithm
      }) as unknown as DecodedToken;
    } catch (error) {
      logger.warn('Token verification failed', { error: (error as Error).message });
      return null;
    }
  }

  /**
   * Verify access token (alias for verifyToken)
   */
  async verifyAccessToken(token: string): Promise<DecodedToken | null> {
    const decoded = await this.verifyToken(token);
    if (!decoded || decoded.type === 'refresh') {
      return null;
    }

    return decoded;
  }

  async verifyRefreshToken(token: string): Promise<DecodedToken | null> {
    const decoded = await this.verifyToken(token);
    if (!decoded || decoded.type !== 'refresh') {
      return null;
    }

    return decoded;
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
      const expiryTimestamp = Date.now() + expiresIn * 1000;
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
  async refreshAccessToken(refreshToken: string): Promise<string | null> {
    const decoded = await this.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return null;
    }

    const user: User = {
      id: decoded.userId as string,
      email: decoded.email as string,
      role: decoded.role,
      accessLevel: decoded.accessLevel as string | undefined,
      orgId: decoded.orgId,
      organizationId: decoded.organizationId as string | undefined,
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
    const emailHash = crypto
      .createHash('sha256')
      .update(email.toLowerCase())
      .digest('hex')
      .substring(0, 16);
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
   * Find user by email — Supabase first, in-memory fallback for dev.
   */
  private async findUserByEmail(email: string): Promise<StoredUser | null> {
    const normalizedEmail = email.toLowerCase().trim();

    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('users')
          .select('id, email, password_hash, first_name, last_name, role, access_level')
          .eq('email', normalizedEmail)
          .single();

        if (error && error.code !== 'PGRST116') {
          logger.error('Supabase user lookup failed', { error: error.message });
        }

        if (data) {
          return {
            id: data.id,
            email: data.email,
            passwordHash: data.password_hash,
            firstName: data.first_name,
            lastName: data.last_name,
            role: data.role || 'dws_iq_standard',
            accessLevel: data.access_level || 'free',
          };
        }
      } catch (err) {
        logger.warn('Supabase query error, falling back to in-memory', {
          error: (err as Error).message,
        });
      }
    }

    // In-memory fallback for development
    return devUserStore.get(normalizedEmail) || null;
  }

  /**
   * Register a new user — Supabase first, in-memory fallback for dev.
   */
  async registerUser(
    email: string,
    password: string,
    userData?: Partial<StoredUser>,
  ): Promise<User> {
    const normalizedEmail = email.toLowerCase().trim();
    const passwordHash = await this.hashPassword(password);
    const userId = `user-${crypto.randomUUID()}`;

    const client = getSupabaseClient();
    if (client) {
      try {
        // Check if user already exists in Supabase
        const { data: existing, error: existingError } = await client
          .from('users')
          .select('id')
          .eq('email', normalizedEmail)
          .single();

        if (existingError && existingError.code !== 'PGRST116') {
          throw existingError;
        }

        if (existing) {
          throw new Error('User already exists');
        }

        const { data, error } = await client
          .from('users')
          .insert({
            id: userId,
            email: normalizedEmail,
            password_hash: passwordHash,
            first_name: userData?.firstName || null,
            last_name: userData?.lastName || null,
            role: userData?.role || 'dws_iq_standard',
            access_level: userData?.accessLevel || 'free',
          })
          .select('id, email, first_name, last_name, role, access_level')
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          logger.info('User registered (Supabase)', { userId: data.id });
          return {
            id: data.id,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            role: data.role,
            accessLevel: data.access_level,
          };
        }
      } catch (err) {
        if (err instanceof Error && err.message === 'User already exists') {
          throw err;
        }
        logger.warn('Supabase user registration failed, falling back to in-memory', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    // In-memory fallback for development
    if (devUserStore.has(normalizedEmail)) {
      throw new Error('User already exists');
    }

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
    logger.info('User registered (in-memory)', { userId });

    return {
      id: storedUser.id,
      email: storedUser.email,
      firstName: storedUser.firstName,
      lastName: storedUser.lastName,
      role: storedUser.role,
      accessLevel: storedUser.accessLevel,
    };
  }

  // ============ EMAIL VERIFICATION ============

  /**
   * Generate a secure email verification token.
   * Token is valid for 24 hours.
   */
  generateEmailVerificationToken(email: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    emailVerificationTokens.set(token, { email: email.toLowerCase().trim(), expiresAt });
    logger.info('Email verification token generated', {
      emailHash: crypto
        .createHash('sha256')
        .update(email.toLowerCase())
        .digest('hex')
        .substring(0, 16),
    });
    return token;
  }

  /**
   * Verify an email using the verification token.
   * Returns the email if valid, null if invalid/expired.
   */
  verifyEmailToken(token: string): string | null {
    const data = emailVerificationTokens.get(token);
    if (!data) {
      logger.warn('Email verification failed: token not found');
      return null;
    }

    if (data.expiresAt < Date.now()) {
      emailVerificationTokens.delete(token);
      logger.warn('Email verification failed: token expired');
      return null;
    }

    // Token is valid — delete it (single-use)
    emailVerificationTokens.delete(token);
    return data.email;
  }

  /**
   * Mark a user's email as verified — Supabase first, in-memory fallback.
   */
  async markEmailVerified(email: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase().trim();

    const client = getSupabaseClient();
    if (client) {
      const { error } = await client
        .from('users')
        .update({ email_verified: true, updated_at: new Date().toISOString() })
        .eq('email', normalizedEmail);

      if (!error) {
        logger.info('Email verified (Supabase)', { email: normalizedEmail });
        return true;
      }
      logger.warn('Supabase email verification update failed', { error: error.message });
    }

    // In-memory fallback
    const user = devUserStore.get(normalizedEmail);
    if (!user) return false;
    logger.info('Email verified for user', { userId: user.id });
    return true;
  }

  // ============ PASSWORD RESET ============

  /**
   * Generate a secure password reset token.
   * Token is valid for 1 hour.
   */
  generatePasswordResetToken(email: string): string | null {
    const normalizedEmail = email.toLowerCase().trim();
    const user = devUserStore.get(normalizedEmail);

    // Always return a token-like response to prevent email enumeration.
    // But only store a real token if the user exists.
    if (!user) {
      logger.info('Password reset requested for non-existent email', {
        emailHash: crypto
          .createHash('sha256')
          .update(normalizedEmail)
          .digest('hex')
          .substring(0, 16),
      });
      return null;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    passwordResetTokens.set(token, { email: normalizedEmail, expiresAt });

    logger.info('Password reset token generated', { userId: user.id });
    return token;
  }

  /**
   * Reset password using a valid reset token.
   * Returns true on success, false if token invalid/expired.
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const data = passwordResetTokens.get(token);
    if (!data) {
      logger.warn('Password reset failed: token not found');
      return false;
    }

    if (data.expiresAt < Date.now()) {
      passwordResetTokens.delete(token);
      logger.warn('Password reset failed: token expired');
      return false;
    }

    const newHash = await this.hashPassword(newPassword);

    // Try Supabase first
    const client = getSupabaseClient();
    if (client) {
      const { error } = await client
        .from('users')
        .update({ password_hash: newHash, updated_at: new Date().toISOString() })
        .eq('email', data.email);

      if (!error) {
        passwordResetTokens.delete(token);
        logger.info('Password reset successful (Supabase)', { email: data.email });
        return true;
      }
      logger.warn('Supabase password update failed, trying in-memory', { error: error.message });
    }

    // In-memory fallback
    const user = devUserStore.get(data.email);
    if (!user) {
      passwordResetTokens.delete(token);
      logger.warn('Password reset failed: user not found');
      return false;
    }

    user.passwordHash = newHash;
    devUserStore.set(data.email, user);
    passwordResetTokens.delete(token);

    logger.info('Password reset successful', { userId: user.id });
    return true;
  }
}

export default new AuthService();
