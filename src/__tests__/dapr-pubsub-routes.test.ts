// Evidence: Tool=Claude Code Model=claude-sonnet-5 Date=2026-09-22
// Audit trail: git log -- src/__tests__/dapr-pubsub-routes.test.ts
import { describe, expect, it, vi } from 'vitest';
import express from 'express';
import supertest from 'supertest';

vi.mock('../agents/event-bus.js', () => ({
  eventBus: { dispatchFromDapr: vi.fn(async () => {}) },
}));

const { default: daprRouter } = await import('../routes/dapr-pubsub.routes.js');
const { eventBus } = await import('../agents/event-bus.js');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/dapr', daprRouter);
  return app;
}

const validEvent = {
  type: 'agent.task_complete',
  source: 'test',
  payload: { ok: true },
  priority: 'normal',
  timestamp: new Date().toISOString(),
  orgId: 'org_1',
  sessionId: 'sess_1',
};

describe('GET /dapr/subscribe', () => {
  it('declares the single pilot topic', async () => {
    const res = await supertest(buildApp()).get('/dapr/subscribe');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        pubsubname: 'dws-pubsub',
        topic: 'agent.task_complete',
        route: '/dapr/events/agent-task-complete',
      },
    ]);
  });
});

describe('POST /dapr/events/agent-task-complete', () => {
  it('unwraps a CloudEvent envelope and dispatches locally', async () => {
    const res = await supertest(buildApp())
      .post('/dapr/events/agent-task-complete')
      .send({ specversion: '1.0', type: 'com.dapr.event.sent', data: validEvent });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'SUCCESS' });
    expect(eventBus.dispatchFromDapr).toHaveBeenCalledWith(validEvent);
  });

  it('accepts a bare DWSEvent for local dapr-publish testing', async () => {
    const res = await supertest(buildApp())
      .post('/dapr/events/agent-task-complete')
      .send(validEvent);

    expect(res.status).toBe(200);
    expect(eventBus.dispatchFromDapr).toHaveBeenCalledWith(validEvent);
  });

  it('drops (200, not retried) a malformed payload instead of dispatching', async () => {
    const res = await supertest(buildApp())
      .post('/dapr/events/agent-task-complete')
      .send({ nonsense: true });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'DROP' });
  });
});
