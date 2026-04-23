/**
 * Event Bus — DWS IQ 6/7
 *
 * In-process event bus with optional Redis Streams backing for durability.
 * Enables event-driven agent orchestration without requiring a full
 * workflow engine for simple pub/sub patterns.
 *
 * For complex multi-step workflows, use the Temporal workflow definitions
 * in workflows.ts. The event bus handles fire-and-forget events and
 * lightweight reactions.
 *
 * Fix #6 (event-driven architecture) from DWS7 modernization.
 */

import logger from '../utils/logger.js';

// ============ TYPES ============

export interface DWSEvent {
  type: string;
  source: string;
  payload: Record<string, unknown>;
  priority: 'low' | 'normal' | 'high' | 'critical';
  timestamp: string;
  orgId: string;
  sessionId: string;
}

export type EventHandler = (event: DWSEvent) => Promise<void>;

interface Subscription {
  pattern: string;
  handler: EventHandler;
  id: string;
}

// ============ EVENT BUS IMPLEMENTATION ============

class EventBus {
  private subscriptions: Subscription[] = [];
  private eventLog: DWSEvent[] = [];
  private maxLogSize = 1000;
  private subscriptionCounter = 0;

  /**
   * Subscribe to events matching a pattern.
   * Pattern supports wildcards: "compliance.*", "agent.task_complete", "*"
   * Returns an unsubscribe function.
   */
  subscribe(pattern: string, handler: EventHandler): () => void {
    const id = `sub_${++this.subscriptionCounter}`;
    const subscription: Subscription = { pattern, handler, id };
    this.subscriptions.push(subscription);

    logger.debug('Event subscription added', { pattern, id });

    return () => {
      this.subscriptions = this.subscriptions.filter((s) => s.id !== id);
      logger.debug('Event subscription removed', { pattern, id });
    };
  }

  /**
   * Emit an event. Dispatches to all matching subscribers.
   * Non-blocking: subscriber errors are logged but don't propagate.
   */
  async emit(event: DWSEvent): Promise<void> {
    // Log the event
    this.eventLog.push(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog = this.eventLog.slice(-this.maxLogSize);
    }

    logger.debug('Event emitted', {
      type: event.type,
      source: event.source,
      priority: event.priority,
    });

    // Find matching subscribers
    const matching = this.subscriptions.filter((s) =>
      this.matchPattern(s.pattern, event.type),
    );

    // Dispatch to all matching handlers (non-blocking)
    const dispatches = matching.map(async (sub) => {
      try {
        await sub.handler(event);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        logger.error('Event handler failed', {
          pattern: sub.pattern,
          eventType: event.type,
          error: msg,
        });
      }
    });

    // Wait for all dispatches but don't fail if any do
    await Promise.allSettled(dispatches);

    // Persist to Redis Streams if available
    await this.persistToRedis(event);
  }

  /** Get recent events, optionally filtered by type pattern */
  getRecentEvents(pattern?: string, limit = 50): DWSEvent[] {
    let events = this.eventLog;
    if (pattern) {
      events = events.filter((e) => this.matchPattern(pattern, e.type));
    }
    return events.slice(-limit);
  }

  /** Get subscription count (for health checks) */
  getSubscriptionCount(): number {
    return this.subscriptions.length;
  }

  // ============ PRIVATE HELPERS ============

  /** Match event type against a subscription pattern (supports * wildcards) */
  private matchPattern(pattern: string, eventType: string): boolean {
    if (pattern === '*') return true;

    // Convert glob pattern to regex: "compliance.*" → "^compliance\..*$"
    const regexStr = '^' + pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*') + '$';

    return new RegExp(regexStr).test(eventType);
  }

  /** Persist event to Redis Streams for durability (best-effort) */
  private async persistToRedis(event: DWSEvent): Promise<void> {
    try {
      const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
      const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
      if (!redisUrl || !redisToken) return;

      // Fire-and-forget Redis XADD
      const streamKey = `dws:events:${event.orgId}`;
      await fetch(`${redisUrl}/xadd/${streamKey}/*/${encodeURIComponent('type')}/${encodeURIComponent(event.type)}/${encodeURIComponent('payload')}/${encodeURIComponent(JSON.stringify(event.payload))}/${encodeURIComponent('source')}/${encodeURIComponent(event.source)}/${encodeURIComponent('priority')}/${encodeURIComponent(event.priority)}`, {
        headers: { Authorization: `Bearer ${redisToken}` },
      }).catch(() => { /* best-effort */ });
    } catch {
      // Redis is optional — don't fail event dispatch
    }
  }
}

/** Singleton event bus */
export const eventBus = new EventBus();

// ============ BUILT-IN EVENT HANDLERS ============

/** Register default event handlers for the DWS IQ platform */
export function registerDefaultEventHandlers(): void {
  // Log critical events
  eventBus.subscribe('*.critical', async (event) => {
    logger.warn('CRITICAL EVENT', {
      type: event.type,
      source: event.source,
      payload: event.payload,
    });
  });

  // Compliance threshold alerts
  eventBus.subscribe('compliance.*', async (event) => {
    logger.info('Compliance event', {
      type: event.type,
      orgId: event.orgId,
      payload: event.payload,
    });
  });

  // Agent lifecycle events
  eventBus.subscribe('agent.*', async (event) => {
    logger.debug('Agent event', {
      type: event.type,
      source: event.source,
    });
  });

  logger.info('Default event handlers registered');
}
