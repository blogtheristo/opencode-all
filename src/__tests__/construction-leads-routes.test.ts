import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express, { type Express } from 'express';

const { fetchAndProcessLeadsMock, listTedSalesQueueMock } = vi.hoisted(() => ({
  fetchAndProcessLeadsMock: vi.fn(),
  listTedSalesQueueMock: vi.fn(),
}));

vi.mock('../construction-leads/lead-processor.js', () => ({
  fetchAndProcessLeads: fetchAndProcessLeadsMock,
}));

vi.mock('../construction-leads/sales-queue.js', () => ({
  listTedSalesQueue: listTedSalesQueueMock,
}));

vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import constructionLeadsRouter from '../routes/construction-leads.routes.js';

const ADMIN_KEY = 'test-admin-key-for-construction-leads';

function buildApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/construction-leads', constructionLeadsRouter);
  return app;
}

describe('construction-leads machine API', () => {
  beforeEach(() => {
    process.env.ADMIN_API_KEY = ADMIN_KEY;
    fetchAndProcessLeadsMock.mockReset();
    listTedSalesQueueMock.mockReset();
  });

  it('rejects ted-live without X-Admin-Key (no open MC bypass)', async () => {
    const app = buildApp();
    const response = await request(app).get('/api/v1/construction-leads/ted-live');
    expect(response.status).toBe(401);
    expect(listTedSalesQueueMock).not.toHaveBeenCalled();
  });

  it('returns live TED sales items with admin key and without Google login', async () => {
    listTedSalesQueueMock.mockResolvedValueOnce([
      {
        id: 'ted:2026/S 038-123456',
        centre: 'sales',
        title: 'HUS · Construction',
        status: 'ted_lead',
        nextAction: 'Hospital energy retrofit',
        nouxRoom: 'Trial Centre | Customer Support',
        repoPath: 'sales-rooms/03-trial-centre/',
        noDemoEnv: true,
        priority: 2,
        source: 'ted',
        tedUrl: 'https://ted.europa.eu/en/notice/-/detail/2026%2FS%20038-123456',
        cpv: '45000000',
        country: 'FI',
      },
    ]);

    const app = buildApp();
    const response = await request(app)
      .get('/api/v1/construction-leads/ted-live')
      .set('X-Admin-Key', ADMIN_KEY);

    expect(response.status).toBe(200);
    expect(response.body.googleLogin).toBe(false);
    expect(response.body.grokLogin).toBe(false);
    expect(response.body.source).toBe('ted-live');
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].centre).toBe('sales');
    expect(listTedSalesQueueMock).toHaveBeenCalledWith('live', 25);
  });

  it('reads stored construction_leads when source=stored', async () => {
    listTedSalesQueueMock.mockResolvedValueOnce([]);
    const app = buildApp();
    const response = await request(app)
      .get('/api/v1/construction-leads/sales-queue?source=stored&limit=10')
      .set('Authorization', `Bearer ${ADMIN_KEY}`);

    expect(response.status).toBe(200);
    expect(response.body.source).toBe('construction_leads');
    expect(listTedSalesQueueMock).toHaveBeenCalledWith('stored', 10);
  });

  it('ingests TED via POST /fetch with admin key', async () => {
    fetchAndProcessLeadsMock.mockResolvedValueOnce({
      fetched: 3,
      upsertedRows: 3,
      orgsCreated: 1,
      topCountries: { FI: 3 },
    });
    const app = buildApp();
    const response = await request(app)
      .post('/api/v1/construction-leads/fetch')
      .set('X-Admin-Key', ADMIN_KEY);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('complete');
    expect(response.body.fetched).toBe(3);
    expect(fetchAndProcessLeadsMock).toHaveBeenCalledTimes(1);
  });
});
