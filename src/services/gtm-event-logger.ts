/**
 * GTM Event Logger — DWS IQ 6/7
 *
 * Logs GTM and sales funnel events to Supabase gtm_event_log table.
 * Buffers events in memory and flushes periodically or on threshold.
 *
 * Events come from:
 * - Frontend GTM (via /api/gtm/events webhook)
 * - Stripe webhooks (converted to sales.purchase events)
 * - Backend event bus (sales.* events)
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (GTM Machine Phase 1)
 * Branch: claude/implement-gtm-machine-Avz67
 * Date: 2026-04-28
 * Owner: Lifetime Oy
 */

import logger from '../utils/logger.js';

export interface GTMEventRecord {
  event_type: string;
  source: 'gtm' | 'stripe_webhook' | 'backend';
  properties: Record<string, unknown>;
  user_id?: string;
  session_id?: string;
  timestamp: string;
}

const FLUSH_THRESHOLD = 50;
const FLUSH_INTERVAL_MS = 30_000;

class GTMEventLogger {
  private buffer: GTMEventRecord[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.flushTimer = setInterval(() => {
      if (this.buffer.length > 0) {
        this.flush().catch((err) => {
          logger.warn('GTM event logger auto-flush failed', { error: String(err) });
        });
      }
    }, FLUSH_INTERVAL_MS);
  }

  /**
   * Log a GTM event. Non-blocking — buffers in memory.
   */
  logEvent(event: GTMEventRecord): void {
    this.buffer.push(event);
    if (this.buffer.length >= FLUSH_THRESHOLD) {
      this.flush().catch((err) => {
        logger.warn('GTM event logger threshold-flush failed', { error: String(err) });
      });
    }
  }

  /**
   * Flush buffered events to Supabase.
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const batch = this.buffer.splice(0);

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_KEY;
      if (!url || !key) {
        logger.debug('GTM event logger flush skipped — Supabase not configured');
        return;
      }

      const client = createClient(url, key);
      const rows = batch.map((e) => ({
        event_type: e.event_type,
        source: e.source,
        properties: e.properties,
        user_id: e.user_id || null,
        session_id: e.session_id || null,
        timestamp: e.timestamp,
      }));

      const { error } = await client.from('gtm_event_log').insert(rows);
      if (error) {
        logger.warn('GTM event logger flush insert failed', {
          error: error.message,
          batchSize: batch.length,
        });
      } else {
        logger.debug('GTM events flushed', { count: batch.length });
      }
    } catch (err) {
      logger.warn('GTM event logger flush exception', {
        error: String(err),
        batchSize: batch.length,
      });
    }
  }

  /**
   * Shutdown: flush remaining events and clear timer
   */
  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    await this.flush();
  }
}

export const gtmEventLogger = new GTMEventLogger();
