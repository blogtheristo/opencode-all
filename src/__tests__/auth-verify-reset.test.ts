/**
 * Tests for email verification and password reset flows.
 *
 * Tests the AuthService methods for:
 * - Email verification token generation and validation
 * - Password reset token generation, validation, and password update
 * - Security behaviors (expired tokens, single-use, enumeration prevention)
 */

import { beforeEach, describe, expect, it } from 'vitest';

// AuthService is a singleton — we need to mock JWT_SECRET before import
process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-characters-long-for-security';

const { default: AuthService } = await import('../services/auth.service.js');

describe('Email Verification', () => {

  beforeEach(async () => {
    // Register a fresh user for each test
    try {
      await AuthService.registerUser(`verify-${Date.now()}@example.com`, 'TestPassword123!', {
        firstName: 'Test',
        lastName: 'User',
      });
    } catch {
      // Ignore if already exists
    }
  });

  it('generates a verification token', () => {
    const token = AuthService.generateEmailVerificationToken('test@example.com');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBe(64); // 32 bytes = 64 hex chars
  });

  it('verifies a valid token and returns email', () => {
    const email = 'valid-token@example.com';
    const token = AuthService.generateEmailVerificationToken(email);
    const result = AuthService.verifyEmailToken(token);
    expect(result).toBe(email.toLowerCase());
  });

  it('returns null for an unknown token', () => {
    const result = AuthService.verifyEmailToken('nonexistent-token-12345');
    expect(result).toBeNull();
  });

  it('token is single-use — second verification fails', () => {
    const email = 'single-use@example.com';
    const token = AuthService.generateEmailVerificationToken(email);

    // First use succeeds
    const first = AuthService.verifyEmailToken(token);
    expect(first).toBe(email.toLowerCase());

    // Second use fails
    const second = AuthService.verifyEmailToken(token);
    expect(second).toBeNull();
  });

  it('markEmailVerified returns false for non-existent user', async () => {
    const result = await AuthService.markEmailVerified('nonexistent@example.com');
    expect(result).toBe(false);
  });

  it('markEmailVerified returns true for registered user', async () => {
    const email = `mark-verified-${Date.now()}@example.com`;
    await AuthService.registerUser(email, 'TestPassword123!');
    const result = await AuthService.markEmailVerified(email);
    expect(result).toBe(true);
  });
});

describe('Password Reset', () => {
  it('returns null for non-existent user (enumeration prevention)', () => {
    const token = AuthService.generatePasswordResetToken('ghost@example.com');
    expect(token).toBeNull();
  });

  it('generates reset token for existing user', async () => {
    const email = `reset-gen-${Date.now()}@example.com`;
    await AuthService.registerUser(email, 'OldPassword123!');

    const token = AuthService.generatePasswordResetToken(email);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token!.length).toBe(64);
  });

  it('resets password with valid token', async () => {
    const email = `reset-valid-${Date.now()}@example.com`;
    const oldPassword = 'OldPassword123!';
    const newPassword = 'NewPassword456!';

    await AuthService.registerUser(email, oldPassword);
    const token = AuthService.generatePasswordResetToken(email)!;

    const success = await AuthService.resetPassword(token, newPassword);
    expect(success).toBe(true);

    // Old password should no longer work
    await expect(AuthService.authenticate({ email, password: oldPassword })).rejects.toThrow(
      'Invalid credentials',
    );

    // New password should work
    const auth = await AuthService.authenticate({ email, password: newPassword });
    expect(auth.token).toBeDefined();
    expect(auth.user.email).toBe(email.toLowerCase());
  });

  it('fails with invalid token', async () => {
    const success = await AuthService.resetPassword('invalid-token-xyz', 'NewPassword123!');
    expect(success).toBe(false);
  });

  it('reset token is single-use', async () => {
    const email = `reset-single-${Date.now()}@example.com`;
    await AuthService.registerUser(email, 'OldPassword123!');
    const token = AuthService.generatePasswordResetToken(email)!;

    // First reset succeeds
    const first = await AuthService.resetPassword(token, 'NewPassword456!');
    expect(first).toBe(true);

    // Second reset with same token fails
    const second = await AuthService.resetPassword(token, 'AnotherPassword789!');
    expect(second).toBe(false);
  });
});
