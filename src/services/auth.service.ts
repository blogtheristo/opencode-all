import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: Date;
}

interface TokenPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  expiresIn: number;
}

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

// Demo password hash (development only). Provide via environment variable.
// In production, password hashes must be fetched from the database.
const DEMO_PASSWORD_HASH = process.env.DEMO_PASSWORD_HASH;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets are not configured. Set JWT_SECRET_KEY and JWT_REFRESH_SECRET.');
}

export class AuthService {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      // Validate password strength
      if (password.length < 12) {
        throw new Error('Password must be at least 12 characters long');
      }

      const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
      const hash = await bcrypt.hash(password, salt);

      logger.debug('Password hashed successfully');
      return hash;
    } catch (error) {
      logger.error('Password hashing failed', { error });
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Compare plaintext password with hash
   */
  static async comparePassword(plainPassword: string, hash: string): Promise<boolean> {
    try {
      const match = await bcrypt.compare(plainPassword, hash);
      return match;
    } catch (error) {
      logger.error('Password comparison failed', { error });
      return false;
    }
  }

  /**
   * Generate JWT access token
   */
  static generateAccessToken(payload: TokenPayload): string {
    try {
      const token = jwt.sign(
        {
          ...payload,
          type: 'access',
          iat: Math.floor(Date.now() / 1000),
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          expiresIn: ACCESS_TOKEN_EXPIRY,
        }
      );

      logger.debug('Access token generated', { userId: payload.userId });
      return token;
    } catch (error) {
      logger.error('Access token generation failed', { error });
      throw new Error('Failed to generate access token');
    }
  }

  /**
   * Generate JWT refresh token
   */
  static generateRefreshToken(payload: TokenPayload): string {
    try {
      const token = jwt.sign(
        {
          ...payload,
          type: 'refresh',
          iat: Math.floor(Date.now() / 1000),
        },
        JWT_REFRESH_SECRET,
        {
          algorithm: 'HS256',
          expiresIn: REFRESH_TOKEN_EXPIRY,
        }
      );

      logger.debug('Refresh token generated', { userId: payload.userId });
      return token;
    } catch (error) {
      logger.error('Refresh token generation failed', { error });
      throw new Error('Failed to generate refresh token');
    }
  }

  /**
   * Verify and decode JWT token
   */
  static verifyAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256'],
      }) as any;

      if (decoded.type !== 'access') {
        logger.warn('Invalid token type in access token');
        return null;
      }

      return {
        userId: decoded.userId,
        email: decoded.email,
        type: 'access',
      };
    } catch (error) {
      logger.warn('Token verification failed', { error: (error as Error).message });
      return null;
    }
  }

  /**
   * Verify and decode refresh token
   */
  static verifyRefreshToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
        algorithms: ['HS256'],
      }) as any;

      if (decoded.type !== 'refresh') {
        logger.warn('Invalid token type in refresh token');
        return null;
      }

      return {
        userId: decoded.userId,
        email: decoded.email,
        type: 'refresh',
      };
    } catch (error) {
      logger.warn('Refresh token verification failed', { error: (error as Error).message });
      return null;
    }
  }

  /**
   * Authenticate user with email and password
   * This is a stub - would connect to database in production
   */
  static async authenticate(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      // TODO: In production, fetch user from database
      // For now, we'll create a demo user (this is insecure and only for development)
      const user = this.getDemoUser(email);

      if (!DEMO_PASSWORD_HASH) {
        logger.error('Demo password hash not configured (DEMO_PASSWORD_HASH missing)');
        throw new Error('Authentication not configured');
      }

      // Always perform password comparison to prevent timing attacks (email enumeration)
      // Use dummy hash if user doesn't exist to maintain consistent timing
      const hashToCompare = DEMO_PASSWORD_HASH;
      const isPasswordValid = await this.comparePassword(password, hashToCompare);

      if (!user) {
        logger.warn('Login attempt for non-existent user', { email });
        throw new Error('Invalid email or password');
      }

      if (!isPasswordValid) {
        logger.warn('Failed login attempt', { email });
        throw new Error('Invalid email or password');
      }

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        type: 'access',
      };

      const accessToken = this.generateAccessToken(tokenPayload);
      const refreshToken = this.generateRefreshToken(tokenPayload);

      logger.info('User authenticated successfully', { userId: user.id, email });

      return {
        token: accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          mfaEnabled: user.mfaEnabled,
          createdAt: new Date(),
        },
        expiresIn: 86400, // 24 hours in seconds
      };
    } catch (error) {
      logger.error('Authentication failed', { error: (error as Error).message });
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static refreshAccessToken(refreshToken: string): string | null {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);

      if (!decoded) {
        logger.warn('Invalid refresh token');
        return null;
      }

      const newAccessToken = this.generateAccessToken({
        userId: decoded.userId,
        email: decoded.email,
        type: 'access',
      });

      logger.info('Access token refreshed', { userId: decoded.userId });
      return newAccessToken;
    } catch (error) {
      logger.error('Token refresh failed', { error: (error as Error).message });
      return null;
    }
  }

  /**
   * Demo user for development
   * TODO: Replace with actual database query
   */
  private static getDemoUser(email: string): Partial<User> | null {
    // Demo users for testing
    const demoUsers: Record<string, Partial<User>> = {
      'demo@dws-iq.local': {
        id: 'user_001',
        email: 'demo@dws-iq.local',
        firstName: 'Demo',
        lastName: 'User',
        emailVerified: true,
        mfaEnabled: false,
        createdAt: new Date('2025-01-01'),
      },
      'test@onelifetime.world': {
        id: 'user_002',
        email: 'test@onelifetime.world',
        firstName: 'Community',
        lastName: 'User',
        emailVerified: true,
        mfaEnabled: false,
        createdAt: new Date('2025-01-02'),
      },
      'user@example.com': {
        id: 'user_003',
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User',
        emailVerified: true,
        mfaEnabled: false,
        createdAt: new Date('2025-01-03'),
      },
    };

    return demoUsers[email] || null;
  }
}

export default AuthService;

