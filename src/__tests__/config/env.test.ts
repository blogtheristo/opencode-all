import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { refreshEnv } from '../../config/env';

describe('env configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('accepts development environment', () => {
    process.env.NODE_ENV = 'development';
    const env = refreshEnv();
    expect(env.NODE_ENV).toBe('development');
  });

  it('accepts production environment', () => {
    process.env.NODE_ENV = 'production';
    const env = refreshEnv();
    expect(env.NODE_ENV).toBe('production');
  });

  it('accepts test environment', () => {
    process.env.NODE_ENV = 'test';
    const env = refreshEnv();
    expect(env.NODE_ENV).toBe('test');
  });

  it('accepts staging environment', () => {
    process.env.NODE_ENV = 'staging';
    const env = refreshEnv();
    expect(env.NODE_ENV).toBe('staging');
  });

  it('defaults to development when NODE_ENV is not set', () => {
    delete process.env.NODE_ENV;
    const env = refreshEnv();
    expect(env.NODE_ENV).toBe('development');
  });

  it('rejects invalid environment values', () => {
    process.env.NODE_ENV = 'invalid-env';
    expect(() => refreshEnv()).toThrow('Invalid environment configuration');
  });

  it('parses optional LOG_LEVEL', () => {
    process.env.NODE_ENV = 'test';
    process.env.LOG_LEVEL = 'debug';
    const env = refreshEnv();
    expect(env.LOG_LEVEL).toBe('debug');
  });
});
