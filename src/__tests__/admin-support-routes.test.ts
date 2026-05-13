import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';

let injectedRole = 'admin';
const { processMessageMock } = vi.hoisted(() => ({
  processMessageMock: vi.fn(),
}));

vi.mock('../middleware/auth.middleware.js', () => ({
  authenticateToken: (req: Request, _res: Response, next: NextFunction) => {
    (req as Request & { userId: string }).userId = '11111111-2222-3333-4444-555555555555';
    (req as Request & { userRole: string }).userRole = injectedRole;
    next();
  },
  requireRole: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const role = (req as Request & { userRole?: string }).userRole;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  },
}));

vi.mock('../services/climate-assistant.service.js', () => ({
  default: {
    processMessage: processMessageMock,
  },
}));

vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import adminSupportRouter from '../routes/admin-support.routes.js';

function buildApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/admin/support', adminSupportRouter);
  return app;
}

describe('Admin support routes', () => {
  beforeEach(() => {
    injectedRole = 'admin';
    processMessageMock.mockReset();
  });

  it('returns assistant response for admin users', async () => {
    processMessageMock.mockResolvedValueOnce({
      content: 'Try checking /health and API key wiring first.',
      model: 'llama-3.3-70b-versatile',
      usage: undefined,
    });

    const app = buildApp();
    const response = await request(app).post('/api/v1/admin/support/chat').send({
      message: 'Support request: dashboard API returns 403 in staging.',
      conversationHistory: [{ role: 'user', content: 'Earlier context' }],
    });

    expect(response.status).toBe(200);
    expect(response.body.content).toContain('Try checking');
    expect(processMessageMock).toHaveBeenCalledTimes(1);
  });

  it('rejects non-admin users', async () => {
    injectedRole = 'viewer';
    const app = buildApp();

    const response = await request(app).post('/api/v1/admin/support/chat').send({
      message: 'Need help',
    });

    expect(response.status).toBe(403);
  });

  it('validates request payload', async () => {
    const app = buildApp();
    const response = await request(app).post('/api/v1/admin/support/chat').send({
      message: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation Error');
  });
});
