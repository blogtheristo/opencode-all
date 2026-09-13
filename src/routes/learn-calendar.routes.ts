import { type Request, type Response, Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

const QUEUE_FILE = path.join(__dirname, '../../.workflows/opencode-all/queue.jsonl');

interface CalendarDay {
  date: string;
  events: Array<{
    title: string;
    time?: string;
    deadline?: boolean;
    priority: number;
    meetingUrl?: string;
  }>;
  priority1Count: number;
}

interface QueueStats {
  pending: number;
  in_progress: number;
  done: number;
  total: number;
}

/**
 * GET /api/v1/learn/calendar-today
 * Fetch today's calendar events + async queue status
 * Returns: { date, events[], priority1Count, queueStats }
 * Note: This endpoint bridges to Google Calendar MCP via agent context
 */
router.get('/calendar-today', async (_req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Read queue status
    const queueStats: QueueStats = {
      pending: 0,
      in_progress: 0,
      done: 0,
      total: 0,
    };

    try {
      const content = await fs.readFile(QUEUE_FILE, 'utf-8');
      const entries = content
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line));

      queueStats.pending = entries.filter((e) => e.state === 'PENDING').length;
      queueStats.in_progress = entries.filter((e) => e.state === 'IN_PROGRESS').length;
      queueStats.done = entries.filter((e) => e.state === 'DONE').length;
      queueStats.total = entries.length;
    } catch (_err) {
      // Queue file doesn't exist yet
    }

    // Build response structure
    // Note: Calendar events come from Google Calendar MCP tool via agent context
    // This endpoint provides the structure; the HTML dashboard populates via agent fetch
    const calendarDay: CalendarDay = {
      date: today,
      events: [],
      priority1Count: 0,
    };

    res.json({
      calendar: calendarDay,
      queue: queueStats,
      timestamp: new Date().toISOString(),
      note: 'Calendar events populated by agent via Google_Calendar.list_events MCP tool',
    });
  } catch (err) {
    console.error('Learn calendar error:', err);
    res.status(500).json({ error: 'Failed to load calendar', details: String(err) });
  }
});

/**
 * GET /api/v1/learn/queue-status
 * Just the async queue stats (for refreshing)
 */
router.get('/queue-status', async (_req: Request, res: Response) => {
  try {
    const queueStats: QueueStats = {
      pending: 0,
      in_progress: 0,
      done: 0,
      total: 0,
    };

    try {
      const content = await fs.readFile(QUEUE_FILE, 'utf-8');
      const entries = content
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line));

      queueStats.pending = entries.filter((e) => e.state === 'PENDING').length;
      queueStats.in_progress = entries.filter((e) => e.state === 'IN_PROGRESS').length;
      queueStats.done = entries.filter((e) => e.state === 'DONE').length;
      queueStats.total = entries.length;
    } catch (_err) {
      // Queue file doesn't exist yet
    }

    res.json(queueStats);
  } catch (err) {
    console.error('Queue status error:', err);
    res.status(500).json({ error: 'Failed to read queue', details: String(err) });
  }
});

export default router;
