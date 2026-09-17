import { describe, expect, it } from 'vitest';
import { isReservedEmailDomain } from '../utils/email-domain-guard.js';

describe('isReservedEmailDomain', () => {
  it.each([
    'smoke-1779307110462@example.com',
    'user@example.net',
    'user@example.org',
    'user@foo.test',
    'user@bar.invalid',
    'user@host.localhost',
    'user@machine.local',
    'USER@Example.COM',
  ])('rejects %s', (email) => {
    expect(isReservedEmailDomain(email)).toBe(true);
  });

  it.each([
    'user@lifetime.fi',
    'risto@onelifetime.world',
    'foo@dws6.com',
    'a@b.co',
  ])('accepts %s', (email) => {
    expect(isReservedEmailDomain(email)).toBe(false);
  });

  it('returns false for malformed input', () => {
    expect(isReservedEmailDomain('no-at-sign')).toBe(false);
    expect(isReservedEmailDomain('user@')).toBe(false);
  });
});
