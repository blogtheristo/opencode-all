/**
 * Error Middleware Tests
 *
 * Tests for asyncHandler, requestTimeout, and error handler middleware.
 * Covers the P0-RC2 backend error hardening changes.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextFunction, type Request, type Response } from 'express';
import { asyncHandler } from '../middleware/async-handler.js';
import { requestTimeout } from '../middleware/request-timeout.js';
import { AppError, errorHandler, Errors } from '../middleware/error-handler.js';

// ============ HELPERS ============

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    method: 'GET',
    path: '/test',
    headers: {},
    get: vi.fn(),
    ip: '127.0.0.1',
    destroyed: false,
    destroy: vi.fn(),
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    end: vi.fn(),
    headersSent: false,
    writableEnded: false,
    on: vi.fn(),
  } as unknown as Response;
  return res;
}

// ============ asyncHandler TESTS ============

describe('asyncHandler', () => {
  it('forwards resolved handler result without error', async () => {
    const handler = asyncHandler(async (_req, res) => {
      res.json({ ok: true });
    });

    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);
    // Allow microtask to resolve
    await new Promise((r) => setTimeout(r, 10));

    expect(res.json).toHaveBeenCalledWith({ ok: true });
    expect(next).not.toHaveBeenCalled();
  });

  it('catches async errors and forwards to next()', async () => {
    const testError = new Error('Database connection failed');
    const handler = asyncHandler(async () => {
      throw testError;
    });

    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);
    await new Promise((r) => setTimeout(r, 10));

    expect(next).toHaveBeenCalledWith(testError);
  });

  it('catches synchronous errors thrown in async handler', async () => {
    const handler = asyncHandler(async () => {
      JSON.parse('invalid json{{{');
    });

    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);
    await new Promise((r) => setTimeout(r, 10));

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(SyntaxError);
  });
});

// ============ requestTimeout TESTS ============

describe('requestTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('calls next() immediately to continue the chain', () => {
    const middleware = requestTimeout(5000);
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // no error argument

    vi.useRealTimers();
  });

  it('sends 408 when timeout expires before response', () => {
    const middleware = requestTimeout(100);
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    middleware(req, res, next);

    // Advance past the timeout
    vi.advanceTimersByTime(150);

    // The middleware responds directly with 408 (does not call next with error)
    expect(next).toHaveBeenCalledTimes(1); // only the initial chain call
    expect(res.status).toHaveBeenCalledWith(408);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'REQUEST_TIMEOUT',
      }),
    );
    expect(res.end).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('does not fire timeout if response finishes in time', () => {
    const middleware = requestTimeout(100);
    const req = mockReq();
    const listeners: Record<string, Function> = {};
    const res = {
      ...mockRes(),
      headersSent: false,
      on: vi.fn((event: string, cb: Function) => {
        listeners[event] = cb;
      }),
    } as unknown as Response;
    const next = vi.fn();

    middleware(req, res, next);

    // Simulate response finishing before timeout
    listeners['finish']?.();

    vi.advanceTimersByTime(200);

    // next should only have been called once (the initial chain call)
    expect(next).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

// ============ AppError & Errors Factory TESTS ============

describe('AppError', () => {
  it('creates error with correct properties', () => {
    const err = new AppError('Not found', 404, 'RESOURCE_NOT_FOUND');
    expect(err.message).toBe('Not found');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('RESOURCE_NOT_FOUND');
    expect(err.isOperational).toBe(true);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
  });

  it('defaults to 500 INTERNAL_ERROR', () => {
    const err = new AppError('Something broke');
    expect(err.statusCode).toBe(500);
    expect(err.code).toBe('INTERNAL_ERROR');
  });
});

describe('Errors factory', () => {
  it('creates badRequest (400)', () => {
    const err = Errors.badRequest('Invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('BAD_REQUEST');
    expect(err.message).toBe('Invalid input');
  });

  it('creates unauthorized (401)', () => {
    const err = Errors.unauthorized();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
  });

  it('creates forbidden (403)', () => {
    const err = Errors.forbidden();
    expect(err.statusCode).toBe(403);
  });

  it('creates notFound (404)', () => {
    const err = Errors.notFound('User');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('User not found');
  });

  it('creates conflict (409)', () => {
    const err = Errors.conflict('Already exists');
    expect(err.statusCode).toBe(409);
  });

  it('creates tooManyRequests (429)', () => {
    const err = Errors.tooManyRequests();
    expect(err.statusCode).toBe(429);
    expect(err.code).toBe('RATE_LIMITED');
  });

  it('creates internal (500) as non-operational', () => {
    const err = Errors.internal();
    expect(err.statusCode).toBe(500);
    expect(err.isOperational).toBe(false);
  });
});

// ============ errorHandler MIDDLEWARE TESTS ============

describe('errorHandler', () => {
  it('returns 400 with message for operational AppError', () => {
    const err = Errors.badRequest('Missing field');
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'BAD_REQUEST',
        message: 'Missing field',
      }),
    );
  });

  // NOTE (2026-08-22): 'hides message for non-operational 500 errors' and
  // 'handles plain Error objects as 500' were removed — they failed
  // intermittently under full-suite parallelism (passed reliably in
  // isolation). Deterministic replacements live in the
  // 'errorHandler sanitization (isolated)' block below.

  it('includes correlationId from request headers', () => {
    const err = Errors.badRequest('test');
    const req = mockReq({ headers: { 'x-correlation-id': 'abc-123' } });
    const res = mockRes();
    const next = vi.fn();

    errorHandler(err, req, res, next);

    const response = (res.json as any).mock.calls[0][0];
    expect(response.correlationId).toBe('abc-123');
  });
});

// ============ errorHandler sanitization (isolated) ============
// Self-contained mocks created per-test (no shared helpers) so the tests are
// immune to cross-file mock/env pollution under vitest parallelism.
describe('errorHandler sanitization (isolated)', () => {
  const freshMocks = () => ({
    req: { headers: {}, log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } },
    res: {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    },
    next: vi.fn(),
  });

  it('hides message for non-operational 500 errors', () => {
    const { req, res, next } = freshMocks();
    const err = new Error('DB password leaked') as any;
    err.isOperational = false;

    errorHandler(err as any, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();
    const response = res.json.mock.calls[0][0];
    expect(response.message).toBe('An unexpected error occurred');
    expect(JSON.stringify(response)).not.toContain('password');
  });

  it('handles plain Error objects as 500', () => {
    const { req, res, next } = freshMocks();
    const err = new Error('something unexpected');

    errorHandler(err, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
  });
});
