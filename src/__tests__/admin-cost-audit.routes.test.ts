// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=lane-c-coverage Date=2026-09-27
// Audit trail: git log -- src/__tests__/admin-cost-audit.routes.test.ts
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'fs';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

const authenticateToken = vi.hoisted(() =>
  vi.fn((req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    req.user = { email: 'admin@dws6.com' } as Request['user'];
    next();
  }),
);

vi.mock('../middleware/auth.middleware.js', () => ({ authenticateToken }));

const { default: adminCostAuditRouter } = await import('../routes/admin-cost-audit.routes.js');

function buildApp() {
  const app = express();
  app.use('/api/admin', adminCostAuditRouter);
  return app;
}

describe('admin cost audit authentication', () => {
  it.each([
    '/api/admin/cost-audit-log',
    '/api/admin/cost-audit-log/raw',
    '/api/admin/cost-audit-summary',
  ])('rejects unauthenticated access to %s before reading audit data', async (path) => {
    const existsSpy = vi.spyOn(fs, 'existsSync');
    const readSpy = vi.spyOn(fs, 'readFileSync');

    const response = await request(buildApp()).get(path);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Authentication required' });
    expect(existsSpy).not.toHaveBeenCalled();
    expect(readSpy).not.toHaveBeenCalled();
    existsSpy.mockRestore();
    readSpy.mockRestore();
  });
});
