/**
 * Authentication Service
 * JWT-based authentication for DWS IQ Backend
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';
const JWT_EXPIRES_IN = '24h';
const JWT_REFRESH_EXPIRES_IN = '7d';

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
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.warn('Token verification failed', { error: (error as Error).message });
      return null;
    }
  }

  /**
   * Verify access token (alias for verifyToken)
   */
  verifyAccessToken(token: string): any {
    return this.verifyToken(token);
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
   * Note: In production, this should query a real database
   */
  async authenticate(params: AuthenticateParams): Promise<AuthResponse> {
    const { email, password } = params;

    // TODO: Replace with actual database lookup
    // For now, this is a placeholder that should integrate with Supabase
    logger.info('Authentication attempt', { email });

    // Placeholder user - in production, fetch from database
    const user: User = {
      id: 'user-' + Date.now(),
      email: email,
      firstName: 'Demo',
      lastName: 'User',
      role: 'dws_iq_standard',
      accessLevel: 'free',
    };

    const token = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      token,
      refreshToken,
      expiresIn: 86400, // 24 hours in seconds
      user,
    };
  }
}

export default new AuthService();
