/**
 * Tests for src/firehorse/linkedin-pending.ts (V2 — async fs/promises).
 *
 * Covers:
 *  - enqueue / listAll / listPending / getEntry / markSent / dismiss / stats
 *    happy path (real filesystem, isolated per-test queue file).
 *  - listAll returns [] when the queue file does not exist (ENOENT).
 *  - LinkedInPendingIOError thrown for non-ENOENT read failures.
 *  - Each export is async (returns a Promise), preventing accidental sync regression.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { promises as fs } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let tmp: string;
let queuePath: string;

// Each test gets its own QUEUE_PATH + a fresh module instance so module-load-time
// env capture inside linkedin-pending.ts picks up the correct path.
async function importModule() {
  vi.resetModules();
  return import('../firehorse/linkedin-pending.js');
}

const DRAFT_INPUT = {
  lead_id: 'lead-1',
  linkedin_url: 'https://linkedin.com/in/test',
  template_id: 'tpl-cold-1',
  message: 'Hello, this is a test draft.',
};

beforeEach(async () => {
  tmp = await mkdtemp(join(tmpdir(), 'lpq-'));
  queuePath = join(tmp, 'linkedin-pending.jsonl');
  process.env.LINKEDIN_PENDING_QUEUE_PATH = queuePath;
});

afterEach(async () => {
  delete process.env.LINKEDIN_PENDING_QUEUE_PATH;
  await rm(tmp, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe('linkedin-pending — happy path', () => {
  it('enqueue → listAll → listPending → getEntry → markSent → dismiss', async () => {
    const lp = await importModule();

    const entryA = await lp.enqueue(DRAFT_INPUT);
    expect(entryA.status).toBe('pending');
    expect(entryA.id).toMatch(/^lpq-\d+-/);

    const entryB = await lp.enqueue({ ...DRAFT_INPUT, lead_id: 'lead-2' });
    expect(entryB.id).not.toBe(entryA.id);

    const all = await lp.listAll();
    expect(all).toHaveLength(2);
    expect(all.map((e) => e.lead_id).sort()).toEqual(['lead-1', 'lead-2']);

    const pending = await lp.listPending();
    expect(pending).toHaveLength(2);

    const fetched = await lp.getEntry(entryA.id);
    expect(fetched?.id).toBe(entryA.id);

    const sent = await lp.markSent(entryA.id, 'risto');
    expect(sent?.status).toBe('sent');
    expect(sent?.acked_by).toBe('risto');

    const dismissed = await lp.dismiss(entryB.id, 'lead replied via email', 'risto');
    expect(dismissed?.status).toBe('dismissed');
    expect(dismissed?.ack_reason).toBe('lead replied via email');

    const pendingAfter = await lp.listPending();
    expect(pendingAfter).toHaveLength(0);

    const allAfter = await lp.listAll();
    expect(allAfter).toHaveLength(2);

    const finalStats = await lp.stats();
    expect(finalStats).toEqual({ pending: 0, sent: 1, dismissed: 1, total: 2 });
  });

  it('markSent on a non-pending entry returns the existing entry unchanged', async () => {
    const lp = await importModule();
    const entry = await lp.enqueue(DRAFT_INPUT);
    await lp.markSent(entry.id, 'risto');
    const second = await lp.markSent(entry.id, 'someone-else');
    // Returns the (now-sent) current state without re-writing or escalating
    expect(second?.status).toBe('sent');
    expect(second?.acked_by).toBe('risto');
  });

  it('dismiss on a non-pending entry returns the existing entry unchanged', async () => {
    const lp = await importModule();
    const entry = await lp.enqueue(DRAFT_INPUT);
    await lp.dismiss(entry.id, 'reason A', 'risto');
    const second = await lp.dismiss(entry.id, 'reason B', 'someone-else');
    expect(second?.status).toBe('dismissed');
    expect(second?.ack_reason).toBe('reason A');
  });
});

describe('linkedin-pending — async API', () => {
  it('every exported function returns a Promise', async () => {
    const lp = await importModule();
    expect(lp.enqueue(DRAFT_INPUT)).toBeInstanceOf(Promise);
    // Drain the first enqueue so subsequent reads have content
    await lp.enqueue(DRAFT_INPUT);
    expect(lp.listAll()).toBeInstanceOf(Promise);
    expect(lp.listPending()).toBeInstanceOf(Promise);
    expect(lp.getEntry('any')).toBeInstanceOf(Promise);
    expect(lp.markSent('any')).toBeInstanceOf(Promise);
    expect(lp.dismiss('any', 'r')).toBeInstanceOf(Promise);
    expect(lp.stats()).toBeInstanceOf(Promise);
  });
});

describe('linkedin-pending — error handling', () => {
  it('listAll returns [] when the queue file does not exist (ENOENT)', async () => {
    const lp = await importModule();
    expect(await lp.listAll()).toEqual([]);
    expect(await lp.listPending()).toEqual([]);
    expect(await lp.stats()).toEqual({ pending: 0, sent: 0, dismissed: 0, total: 0 });
  });

  it('throws LinkedInPendingIOError on non-ENOENT read failure', async () => {
    const lp = await importModule();
    // First enqueue so file exists, then make readFile fail
    await lp.enqueue(DRAFT_INPUT);
    const eperm = Object.assign(new Error('mocked EACCES'), { code: 'EACCES' });
    const spy = vi.spyOn(fs, 'readFile').mockRejectedValueOnce(eperm);
    await expect(lp.listAll()).rejects.toBeInstanceOf(lp.LinkedInPendingIOError);
    spy.mockRestore();
  });

  it('throws LinkedInPendingIOError on appendFile failure during enqueue', async () => {
    const lp = await importModule();
    const efull = Object.assign(new Error('mocked ENOSPC'), { code: 'ENOSPC' });
    const spy = vi.spyOn(fs, 'appendFile').mockRejectedValueOnce(efull);
    await expect(lp.enqueue(DRAFT_INPUT)).rejects.toBeInstanceOf(lp.LinkedInPendingIOError);
    spy.mockRestore();
  });

  it('skips malformed JSONL lines without throwing', async () => {
    const lp = await importModule();
    await fs.mkdir(tmp, { recursive: true });
    // Mix one valid + one corrupt line
    const valid = await lp.enqueue(DRAFT_INPUT);
    await fs.appendFile(queuePath, 'this is not json\n', 'utf-8');
    const all = await lp.listAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(valid.id);
  });
});
