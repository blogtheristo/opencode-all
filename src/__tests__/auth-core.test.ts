/**
 * Auth Core Tests — Register, Login, JWT, Token Refresh, Revocation
 *
 * Tests the critical authentication path:
 * - User registration with validation
 * - Authentication with correct/wrong credentials
 * - JWT token generation and verification
 * - Refresh token flow
 * - Token revocation (blacklisting)
 * - Timing attack prevention (dummy hash on non-existent user)
 */

import { beforeEach, describe, expect, it } from 'vitest';

process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-characters-long-for-security';

const { default: AuthService } = await import('../services/auth.service.js');

describe('User Registration', () => {
  it('registers a new user and returns user object', async () => {
    const email = `reg-${Date.now()}@example.com`;
    const user = await AuthService.registerUser(email, 'StrongPassword123!', {
      firstName: 'Test',
      lastName: 'User',
    });

    expect(user.id).toBeDefined();
    expect(user.id).toMatch(/^user-/);
    expect(user.email).toBe(email.toLowerCase());
    expect(user.firstName).toBe('Test');
    expect(user.lastName).toBe('User');
    expect(user.role).toBe('dws_iq_standard');
    expect(user.accessLevel).toBe('free');
  });

  it('normalizes email to lowercase', async () => {
    const email = `UPPERCASE-${Date.now()}@EXAMPLE.COM`;
    const user = await AuthService.registerUser(email, 'Password123!');
    expect(user.email).toBe(email.toLowerCase());
  });

  it('rejects duplicate registration', async () => {
    const email = `dup-${Date.now()}@example.com`;
    await AuthService.registerUser(email, 'Password123!');

    await expect(
      AuthService.registerUser(email, 'DifferentPassword123!')
    ).rejects.toThrow('User already exists');
  });
});

describe('Authentication (Login)', () => {
  const testEmail = `login-${Date.now()}@example.com`;
  const testPassword = 'CorrectPassword123!';

  beforeEach(async () => {
    try {
      await AuthService.registerUser(testEmail, testPassword, {
        firstName: 'Login',
        lastName: 'Test',
      });
    } catch {
      // Already registered from previous test
    }
  });

  it('authenticates with correct credentials', async () => {
    const result = await AuthService.authenticate({
      email: testEmail,
      password: testPassword,
    });

    expect(result.token).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.expiresIn).toBe(86400);
    expect(result.user.email).toBe(testEmail.toLowerCase());
    expect(result.user.firstName).toBe('Login');
  });

  it('rejects wrong password', async () => {
    await expect(
      AuthService.authenticate({
        email: testEmail,
        password: 'WrongPassword456!',
      })
    ).rejects.toThrow('Invalid credentials');
  });

  it('rejects non-existent user', async () => {
    await expect(
      AuthService.authenticate({
        email: 'ghost@example.com',
        password: 'AnyPassword123!',
      })
    ).rejects.toThrow('Invalid credentials');
  });

  it('is case-insensitive on email', async () => {
    const result = await AuthService.authenticate({
      email: testEmail.toUpperCase(),
      password: testPassword,
    });
    expect(result.token).toBeDefined();
  });
});

describe('JWT Token Generation & Verification', () => {
  it('generates a valid access token', async () => {
    const user = {
      id: 'user-test-123',
      email: 'jwt@example.com',
      role: 'dws_iq_standard',
      accessLevel: 'free',
    };

    const token = AuthService.generateAccessToken(user);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
  });

  it('verifies a valid access token and returns payload', async () => {
    const user = {
      id: 'user-verify-456',
      email: 'verify@example.com',
      role: 'admin',
      accessLevel: 'enterprise',
    };

    const token = AuthService.generateAccessToken(user);
    const decoded = await AuthService.verifyToken(token);

    expect(decoded).toBeDefined();
    expect(decoded.userId).toBe('user-verify-456');
    expect(decoded.email).toBe('verify@example.com');
    expect(decoded.role).toBe('admin');
    expect(decoded.accessLevel).toBe('enterprise');
  });

  it('rejects a tampered token', async () => {
    const user = { id: 'user-1', email: 'a@b.com' };
    const token = AuthService.generateAccessToken(user);

    // Tamper with the payload
    const parts = token.split('.');
    parts[1] = parts[1] + 'TAMPERED';
    const tampered = parts.join('.');

    const decoded = await AuthService.verifyToken(tampered);
    expect(decoded).toBeNull();
  });

  it('rejects a completely invalid token', async () => {
    const decoded = await AuthService.verifyToken('not.a.jwt');
    expect(decoded).toBeNull();
  });
});

describe('Refresh Token Flow', () => {
  it('generates and uses refresh token to get new access token', async () => {
    const user = {
      id: 'user-refresh-789',
      email: 'refresh@example.com',
      role: 'dws_iq_standard',
    };

    const refreshToken = AuthService.generateRefreshToken(user);
    expect(refreshToken).toBeDefined();

    const newAccessToken = await AuthService.refreshAccessToken(refreshToken);
    expect(newAccessToken).toBeDefined();
    expect(typeof newAccessToken).toBe('string');

    // Verify the new access token contains the right user
    const decoded = await AuthService.verifyToken(newAccessToken!);
    expect(decoded.userId).toBe('user-refresh-789');
    expect(decoded.email).toBe('refresh@example.com');
  });

  it('rejects access token used as refresh token', async () => {
    const user = { id: 'user-1', email: 'a@b.com' };
    const accessToken = AuthService.generateAccessToken(user);

    // Access tokens don't have type: 'refresh'
    const result = await AuthService.refreshAccessToken(accessToken);
    expect(result).toBeNull();
  });

  it('rejects invalid refresh token', async () => {
    const result = await AuthService.refreshAccessToken('invalid-token');
    expect(result).toBeNull();
  });
});

describe('Token Revocation', () => {
  it('revokes a token so it cannot be verified', async () => {
    const user = { id: 'user-revoke-1', email: 'revoke@example.com' };
    const token = AuthService.generateAccessToken(user);

    // Token should be valid before revocation
    const before = await AuthService.verifyToken(token);
    expect(before).toBeDefined();
    expect(before.userId).toBe('user-revoke-1');

    // Revoke the token
    await AuthService.revokeToken(token);

    // Token should be invalid after revocation
    const after = await AuthService.verifyToken(token);
    expect(after).toBeNull();
  });

  it('isTokenRevoked returns false for non-revoked token', async () => {
    const user = { id: 'user-check-1', email: 'check@example.com' };
    const token = AuthService.generateAccessToken(user);

    const revoked = await AuthService.isTokenRevoked(token);
    expect(revoked).toBe(false);
  });

  it('isTokenRevoked returns true for revoked token', async () => {
    const user = { id: 'user-check-2', email: 'check2@example.com' };
    const token = AuthService.generateAccessToken(user);

    await AuthService.revokeToken(token);
    const revoked = await AuthService.isTokenRevoked(token);
    expect(revoked).toBe(true);
  });
});

describe('Password Hashing', () => {
  it('hashes password to bcrypt format', async () => {
    const hash = await AuthService.hashPassword('MyPassword123!');
    expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);
    expect(hash.length).toBeGreaterThan(50);
  });

  it('same password produces different hashes (salted)', async () => {
    const hash1 = await AuthService.hashPassword('SamePassword');
    const hash2 = await AuthService.hashPassword('SamePassword');
    expect(hash1).not.toBe(hash2);
  });

  it('compares correct password against hash', async () => {
    const password = 'TestPassword123!';
    const hash = await AuthService.hashPassword(password);
    const match = await AuthService.comparePassword(password, hash);
    expect(match).toBe(true);
  });

  it('rejects wrong password against hash', async () => {
    const hash = await AuthService.hashPassword('CorrectPassword');
    const match = await AuthService.comparePassword('WrongPassword', hash);
    expect(match).toBe(false);
  });
});
