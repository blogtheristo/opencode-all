/**
 * Firehorse — LinkedIn Pending Drafts Queue (V1)
 *
 * Until a real LinkedIn API client is wired (Unipile / PhantomBuster /
 * LinkedIn Marketing Developer Platform), `sendLinkedInDM` prepares the
 * message and enqueues it here instead of sending. A human reviewer can
 * then list the queue, send the messages manually on LinkedIn, and
 * acknowledge each one so it leaves the queue.
 *
 * Storage: append-only JSONL at logs/linkedin-pending.jsonl (gitignored).
 * State: rebuilt from the file on each read — entries with status=sent|dismissed
 * are filtered out of listPending().
 *
 * I/O: async fs/promises. Reads return [] when the file does not exist
 * (a normal first-run condition). All other I/O failures throw a
 * LinkedInPendingIOError that callers should surface as an HTTP 503.
 *
 * Introduced-In: PR-1208
 * Code-Version: 2.0.0
 * Date: 2026-04-27
 * Owner: Lifetime Oy
 */

import { promises as fs } from 'node:fs';
import { dirname } from 'node:path';
import logger from '../utils/logger.js';

const QUEUE_PATH = process.env.LINKEDIN_PENDING_QUEUE_PATH || 'logs/linkedin-pending.jsonl';

export type LinkedInPendingStatus = 'pending' | 'sent' | 'dismissed';

export interface LinkedInPendingEntry {
  id: string;
  lead_id: string;
  linkedin_url: string;
  template_id: string;
  message: string;
  enqueued_at: string;
  status: LinkedInPendingStatus;
  acked_at?: string;
  acked_by?: string;
  ack_reason?: string;
}

export class LinkedInPendingIOError extends Error {
  readonly cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'LinkedInPendingIOError';
    this.cause = cause;
  }
}

function isENOENT(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: string }).code === 'ENOENT';
}

async function ensureQueueDir(): Promise<void> {
  const dir = dirname(QUEUE_PATH);
  if (!dir || dir === '.') return;
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    throw new LinkedInPendingIOError(`Failed to create queue dir ${dir}`, err);
  }
}

async function readAllEntries(): Promise<LinkedInPendingEntry[]> {
  let raw: string;
  try {
    raw = await fs.readFile(QUEUE_PATH, 'utf-8');
  } catch (err) {
    if (isENOENT(err)) return [];
    throw new LinkedInPendingIOError(`Failed to read queue ${QUEUE_PATH}`, err);
  }
  const lines = raw.split('\n').filter((l) => l.trim().length > 0);
  const latestById = new Map<string, LinkedInPendingEntry>();
  for (const line of lines) {
    try {
      const entry = JSON.parse(line) as LinkedInPendingEntry;
      latestById.set(entry.id, entry);
    } catch (parseErr) {
      logger.warn('linkedin-pending: skipping malformed line', {
        error: (parseErr as Error).message,
      });
    }
  }
  return Array.from(latestById.values()).sort((a, b) => a.enqueued_at.localeCompare(b.enqueued_at));
}

async function writeEntry(entry: LinkedInPendingEntry): Promise<void> {
  await ensureQueueDir();
  try {
    await fs.appendFile(QUEUE_PATH, JSON.stringify(entry) + '\n', 'utf-8');
  } catch (err) {
    throw new LinkedInPendingIOError(`Failed to append to queue ${QUEUE_PATH}`, err);
  }
}

export async function enqueue(input: {
  lead_id: string;
  linkedin_url: string;
  template_id: string;
  message: string;
}): Promise<LinkedInPendingEntry> {
  const entry: LinkedInPendingEntry = {
    id: `lpq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    lead_id: input.lead_id,
    linkedin_url: input.linkedin_url,
    template_id: input.template_id,
    message: input.message,
    enqueued_at: new Date().toISOString(),
    status: 'pending',
  };
  await writeEntry(entry);
  logger.info('linkedin-pending: enqueued draft', { id: entry.id, lead_id: entry.lead_id });
  return entry;
}

export async function listPending(): Promise<LinkedInPendingEntry[]> {
  const all = await readAllEntries();
  return all.filter((e) => e.status === 'pending');
}

export async function listAll(): Promise<LinkedInPendingEntry[]> {
  return readAllEntries();
}

export async function getEntry(id: string): Promise<LinkedInPendingEntry | undefined> {
  const all = await readAllEntries();
  return all.find((e) => e.id === id);
}

export async function markSent(
  id: string,
  actedBy?: string,
): Promise<LinkedInPendingEntry | undefined> {
  const current = await getEntry(id);
  if (!current || current.status !== 'pending') return current;
  const updated: LinkedInPendingEntry = {
    ...current,
    status: 'sent',
    acked_at: new Date().toISOString(),
    acked_by: actedBy,
  };
  await writeEntry(updated);
  logger.info('linkedin-pending: marked sent', { id, acted_by: actedBy });
  return updated;
}

export async function dismiss(
  id: string,
  reason: string,
  actedBy?: string,
): Promise<LinkedInPendingEntry | undefined> {
  const current = await getEntry(id);
  if (!current || current.status !== 'pending') return current;
  const updated: LinkedInPendingEntry = {
    ...current,
    status: 'dismissed',
    acked_at: new Date().toISOString(),
    acked_by: actedBy,
    ack_reason: reason,
  };
  await writeEntry(updated);
  logger.info('linkedin-pending: dismissed', { id, acted_by: actedBy, reason });
  return updated;
}

export async function stats(): Promise<{
  pending: number;
  sent: number;
  dismissed: number;
  total: number;
}> {
  const all = await readAllEntries();
  return {
    pending: all.filter((e) => e.status === 'pending').length,
    sent: all.filter((e) => e.status === 'sent').length,
    dismissed: all.filter((e) => e.status === 'dismissed').length,
    total: all.length,
  };
}
