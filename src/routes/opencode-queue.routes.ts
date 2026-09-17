import { type Request, type Response, Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

const QUEUE_FILE = path.join(__dirname, '../../.workflows/opencode-all/queue.jsonl');

interface QueueEntry {
  id: string;
  title: string;
  centre: string;
  itemId: string;
  source: string;
  context: string;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
  createdAt: string;
  handoffPath: string;
}

/**
 * POST /api/opencode-queue/submit
 * Submit an item to the async processing queue
 * Body: { title, centre, itemId, context }
 */
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { title, centre, itemId, context } = req.body;

    // Validate input
    if (!title || !centre || !itemId || !context) {
      return res
        .status(400)
        .json({ error: 'Missing required fields: title, centre, itemId, context' });
    }

    // Create queue entry
    const queueEntry: QueueEntry = {
      id: `mission-control-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      centre,
      itemId,
      source: 'mission-control',
      context,
      state: 'PENDING',
      createdAt: new Date().toISOString(),
      handoffPath: `.claude/handoffs/opencode-batch/mission-control-${itemId}.md`,
    };

    // Append to queue.jsonl
    try {
      await fs.mkdir(path.dirname(QUEUE_FILE), { recursive: true });
      await fs.appendFile(QUEUE_FILE, JSON.stringify(queueEntry) + '\n');
    } catch (err) {
      console.error('Failed to write queue file:', err);
      return res.status(500).json({ error: 'Failed to queue item', details: String(err) });
    }

    return res.json({
      success: true,
      queueId: queueEntry.id,
      message: `Item queued for async processing. Result will be at: ${queueEntry.handoffPath}`,
    });
  } catch (err) {
    console.error('Queue submission error:', err);
    return res.status(500).json({ error: 'Internal server error', details: String(err) });
  }
});

/**
 * GET /api/opencode-queue/status
 * Check queue status
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    let queueEntries: QueueEntry[] = [];

    try {
      const content = await fs.readFile(QUEUE_FILE, 'utf-8');
      queueEntries = content
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line));
    } catch (_err) {
      // Queue file doesn't exist yet, which is fine
    }

    const statuses = {
      pending: queueEntries.filter((e) => e.state === 'PENDING').length,
      in_progress: queueEntries.filter((e) => e.state === 'IN_PROGRESS').length,
      done: queueEntries.filter((e) => e.state === 'DONE').length,
      failed: queueEntries.filter((e) => e.state === 'FAILED').length,
      total: queueEntries.length,
    };

    res.json(statuses);
  } catch (err) {
    console.error('Queue status error:', err);
    res.status(500).json({ error: 'Failed to read queue', details: String(err) });
  }
});

export default router;
