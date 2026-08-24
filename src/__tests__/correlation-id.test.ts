// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- src/__tests__/correlation-id.test.ts
/**
 * Correlation-ID Middleware Tests
 *
 * Verifies the fail-safe ID gate: well-formed client-supplied IDs are
 * trusted, anything malformed (control chars, overlong, hostile charset)
 * is replaced with a server-generated UUID so downstream setHeader calls
 * can never throw.
 */

import { describe, expect, it } from 'vitest';
import { type NextFunction, type Request, type Response } from 'express';
import { correlationId } from '../middleware/correlation-id.js';

function makePair(existing?: string): { req: Request; res: Response } {
  const req = {
    headers: existing === undefined ? {} : { 'x-correlation-id': existing },
  } as unknown as Request;
  const headers: Record<string, string> = {};
  const res = {
    setHeader: (name: string, value: string) => {
      headers[name.toLowerCase()] = value;
    },
    getHeader: (name: string) => headers[name.toLowerCase()],
  } as unknown as Response;
  return { req, res };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe('correlationId middleware', () => {
  it('trusts a well-formed client correlation id', () => {
    const { req, res } = makePair('trace-2026-08-24_abc.XYZ');
    correlationId(req, res, (() => {}) as NextFunction);
    expect(req.headers['x-correlation-id']).toBe('trace-2026-08-24_abc.XYZ');
    expect(res.getHeader('x-correlation-id')).toBe('trace-2026-08-24_abc.XYZ');
  });

  it('generates a UUID when no client id is present', () => {
    const { req, res } = makePair();
    correlationId(req, res, (() => {}) as NextFunction);
    expect(UUID_RE.test(req.headers['x-correlation-id'] as string)).toBe(true);
  });

  it.each([
    ['control chars', 'bad\r\nid'],
    ['overlong', 'a'.repeat(65)],
    ['hostile charset', '<script>'],
    ['empty string', ''],
  ])('replaces malformed client id (%s) with a UUID', (_label, bad) => {
    const { req, res } = makePair(bad);
    correlationId(req, res, (() => {}) as NextFunction);
    const id = req.headers['x-correlation-id'] as string;
    expect(id).not.toBe(bad);
    expect(UUID_RE.test(id)).toBe(true);
  });
});
