/**
 * DWS IQ 6 - Email Queue Service (Redis Streams)
 *
 * Reliable async email delivery AND inbound processing using Redis Streams.
 * Provides at-least-once delivery with consumer groups, dead-letter handling,
 * and automatic fallback to direct send when Redis is unavailable.
 *
 * Streams:
 *   email:outbox         — outbound: pending emails to deliver via Amazon SES (SMTP)
 *   email:inbox          — inbound: received emails from webhooks + other sources
 *
 * Groups:
 *   email-workers        — consumer group for outbound delivery
 *   inbox-workers        — consumer group for inbound processing
 *
 * DLQ:
 *   email:dead-letters   — failed outbound emails after max retries
 *   email:inbox-dlq      — failed inbound processing after max retries
 *
 * Architecture:
 *   enqueue() ──► email:outbox ──► Redis Stream ──► Amazon SES (SMTP) delivery
 *   inbound webhook ──► /webhooks/resend/inbound ──► email:inbox ──► processing
 *   MCP agents / Firehorse ──────────────────────► email:inbox ──► processing
 *
 * Environment variables:
 *   REDIS_URL            — Redis connection string (ioredis format)
 *   REDIS_HOST           — Redis host (default: localhost)
 *   REDIS_PORT           — Redis port (default: 6379)
 *   REDIS_PASSWORD       — Redis password
 *   REDIS_TLS            — Enable TLS (default: false)
 *   EMAIL_QUEUE_ENABLED  — Enable queue (default: true when Redis is available)
 *   EMAIL_QUEUE_MAX_RETRIES — Max delivery attempts (default: 3)
 *   EMAIL_QUEUE_BATCH_SIZE — Messages per read (default: 10)
 *   EMAIL_QUEUE_BLOCK_MS   — XREADGROUP block time (default: 5000)
 */

import Redis from 'ioredis';
import logger from '../utils/logger.js';
import emailService from './email.service.js';

// ============================================================
// TYPES
// ============================================================

export interface QueuedEmail {
  /** Recipient address */
  to: string;
  /** Email subject */
  subject: string;
  /** HTML body */
  html: string;
  /** Template type for tracking */
  templateType?: string;
  /** Arbitrary metadata */
  metadata?: Record<string, unknown>;
  /** Source system (platform, firehorse, outreach) */
  source?: string;
}

export interface InboundEmail {
  /** Sender email address */
  from: string;
  /** Recipient address (one of our addresses) */
  to: string;
  /** Email subject */
  subject: string;
  /** Plain text body */
  text: string;
  /** HTML body (optional) */
  html?: string;
  /** Resend message ID or external reference */
  messageId: string;
  /** Source: resend-webhook, mcp-agent, firehorse, manual */
  source: string;
  /** Raw payload for audit */
  rawPayload?: string;
}

/** Handler function for processing inbound emails */
export type InboundEmailHandler = (email: InboundEmail) => Promise<void>;

interface StreamMessage {
  id: string;
  to: string;
  subject: string;
  html: string;
  templateType: string;
  metadata: string; // JSON-serialized
  source: string;
  attempts: string;
  enqueuedAt: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const STREAM_KEY = 'email:outbox';
const INBOX_STREAM_KEY = 'email:inbox';
const DLQ_KEY = 'email:dead-letters';
const INBOX_DLQ_KEY = 'email:inbox-dlq';
const GROUP_NAME = 'email-workers';
const INBOX_GROUP_NAME = 'inbox-workers';
const MAX_RETRIES = parseInt(process.env.EMAIL_QUEUE_MAX_RETRIES || '3', 10);
const BATCH_SIZE = parseInt(process.env.EMAIL_QUEUE_BATCH_SIZE || '10', 10);
const BLOCK_MS = parseInt(process.env.EMAIL_QUEUE_BLOCK_MS || '5000', 10);
// Claim messages pending longer than 60 seconds (stalled worker recovery)
const CLAIM_MIN_IDLE_MS = 60_000;

// ============================================================
// EMAIL QUEUE SERVICE
// ============================================================

class EmailQueueService {
  private redis: Redis | null = null;
  private consumerId: string;
  private running = false;
  private inboxRunning = false;
  private pollTimer: ReturnType<typeof setTimeout> | null = null;
  private inboxPollTimer: ReturnType<typeof setTimeout> | null = null;
  private inboundHandler: InboundEmailHandler | null = null;

  constructor() {
    // Unique consumer ID per process instance (Cloud Run / k8s pod)
    this.consumerId = `worker-${process.pid}-${Date.now()}`;
  }

  /**
   * Register a handler for inbound emails.
   * The handler receives parsed InboundEmail objects from the inbox stream.
   * Typically wired to the same logic as the Resend webhook route.
   */
  onInbound(handler: InboundEmailHandler): void {
    this.inboundHandler = handler;
    logger.info('Inbound email handler registered');
  }

  // ----------------------------------------------------------
  // INITIALIZATION
  // ----------------------------------------------------------

  /**
   * Connect to Redis and ensure the consumer group exists.
   * Call once at application startup.
   */
  async initialize(): Promise<boolean> {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    const redisPassword = process.env.REDIS_PASSWORD;
    const redisTls = process.env.REDIS_TLS === 'true';

    if (process.env.EMAIL_QUEUE_ENABLED === 'false') {
      logger.info('Email queue explicitly disabled via EMAIL_QUEUE_ENABLED=false');
      return false;
    }

    try {
      if (redisUrl) {
        this.redis = new Redis(redisUrl, {
          tls: redisTls ? {} : undefined,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });
      } else {
        this.redis = new Redis({
          host: redisHost,
          port: redisPort,
          password: redisPassword,
          tls: redisTls ? {} : undefined,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });
      }

      this.redis.on('error', (err) => {
        logger.error('Email queue Redis error', { error: err.message });
      });

      await this.redis.connect();
      await this.redis.ping();

      // Create consumer group (MKSTREAM creates the stream if absent)
      try {
        await this.redis.xgroup('CREATE', STREAM_KEY, GROUP_NAME, '0', 'MKSTREAM');
        logger.info('Email outbox consumer group created', { group: GROUP_NAME });
      } catch (err) {
        // BUSYGROUP = group already exists — expected on restart
        if (!(err instanceof Error ? err.message : String(err)).includes('BUSYGROUP')) {
          throw err;
        }
      }

      // Create inbox consumer group
      try {
        await this.redis.xgroup('CREATE', INBOX_STREAM_KEY, INBOX_GROUP_NAME, '0', 'MKSTREAM');
        logger.info('Email inbox consumer group created', { group: INBOX_GROUP_NAME });
      } catch (err) {
        if (!(err instanceof Error ? err.message : String(err)).includes('BUSYGROUP')) {
          throw err;
        }
      }

      logger.info('Email queue initialized (Redis Streams)', {
        consumer: this.consumerId,
        outbox: STREAM_KEY,
        inbox: INBOX_STREAM_KEY,
        outboxGroup: GROUP_NAME,
        inboxGroup: INBOX_GROUP_NAME,
      });

      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.warn('Email queue initialization failed — falling back to direct send', {
        error: msg,
      });
      this.redis = null;
      return false;
    }
  }

  // ----------------------------------------------------------
  // ENQUEUE (PRODUCER)
  // ----------------------------------------------------------

  /**
   * Enqueue an email for async delivery via Redis Streams.
   * Falls back to direct send if Redis is unavailable.
   *
   * @returns The stream message ID, or 'direct' if sent synchronously.
   */
  async enqueue(email: QueuedEmail): Promise<string> {
    if (!this.redis) {
      // Fallback: send directly via EmailService
      logger.debug('Queue unavailable — sending email directly', { to: email.to });
      await this.sendDirect(email);
      return 'direct';
    }

    try {
      const messageId = await this.redis.xadd(
        STREAM_KEY,
        '*',
        'to',
        email.to,
        'subject',
        email.subject,
        'html',
        email.html,
        'templateType',
        email.templateType || 'custom',
        'metadata',
        JSON.stringify(email.metadata || {}),
        'source',
        email.source || 'platform',
        'attempts',
        '0',
        'enqueuedAt',
        new Date().toISOString(),
      );

      logger.info('Email enqueued', {
        messageId,
        to: email.to,
        subject: email.subject,
        source: email.source,
      });

      // Persist to Supabase email_queue for audit
      if (!messageId) {
        throw new Error('Redis XADD returned no message id');
      }
      await this.logToSupabase(messageId, email, 'queued');

      return messageId;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Failed to enqueue email — sending directly', { error: msg, to: email.to });
      await this.sendDirect(email);
      return 'direct';
    }
  }

  // ----------------------------------------------------------
  // CONSUMER (WORKER)
  // ----------------------------------------------------------

  /**
   * Start the consumer loop. Call once at application startup
   * after initialize() returns true.
   */
  start(): void {
    if (this.running || !this.redis) return;

    this.running = true;
    logger.info('Email outbox worker started', { consumer: this.consumerId });
    this.poll();

    // Also start inbox consumer if handler is registered
    if (this.inboundHandler && !this.inboxRunning) {
      this.startInbox();
    }
  }

  /**
   * Stop both outbox and inbox consumer loops gracefully.
   */
  stop(): void {
    this.running = false;
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
    this.stopInbox();
    logger.info('Email queue workers stopped', { consumer: this.consumerId });
  }

  /**
   * Poll loop: read new messages + reclaim stalled messages.
   */
  private async poll(): Promise<void> {
    if (!this.running || !this.redis) return;

    try {
      // 1. Claim stalled messages from other consumers
      await this.reclaimStalled();

      // 2. Read new messages
      const results = await this.redis.xreadgroup(
        'GROUP',
        GROUP_NAME,
        this.consumerId,
        'COUNT',
        BATCH_SIZE,
        'BLOCK',
        BLOCK_MS,
        'STREAMS',
        STREAM_KEY,
        '>',
      );

      if (results) {
        const streams = results as [string, [string, string[]][]][];
        for (const [, messages] of streams) {
          for (const [id, fields] of messages) {
            await this.processMessage(id, this.parseStreamMessage(this.parseFields(fields)));
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Email queue poll error', { error: msg });
    }

    // Schedule next poll
    if (this.running) {
      this.pollTimer = setTimeout(() => this.poll(), 100);
    }
  }

  /**
   * Process a single stream message: attempt delivery, ACK or retry.
   */
  private async processMessage(id: string, msg: StreamMessage): Promise<void> {
    const redis = this.redis;
    if (!redis) return;
    const attempts = parseInt(msg.attempts || '0', 10) + 1;

    try {
      // Deliver via EmailService
      await this.sendDirect({
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        templateType: msg.templateType,
        metadata: (() => {
          try {
            return JSON.parse(msg.metadata || '{}');
          } catch {
            return {};
          }
        })(),
        source: msg.source,
      });

      // ACK: remove from pending
      await redis.xack(STREAM_KEY, GROUP_NAME, id);

      // Update Supabase status
      await this.updateSupabaseStatus(id, 'sent');

      logger.info('Email delivered from queue', {
        messageId: id,
        to: msg.to,
        attempts,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';

      if (attempts >= MAX_RETRIES) {
        // Move to dead-letter queue
        logger.error('Email delivery exhausted retries — moving to DLQ', {
          messageId: id,
          to: msg.to,
          attempts,
          error: errorMsg,
        });

        await this.moveToDlq(id, msg, errorMsg);
        await redis.xack(STREAM_KEY, GROUP_NAME, id);
        await this.updateSupabaseStatus(id, 'failed', errorMsg);
      } else {
        // Increment attempt count for next retry
        // The message stays in PEL (pending entries list) and will be reclaimed
        logger.warn('Email delivery failed — will retry', {
          messageId: id,
          to: msg.to,
          attempts,
          maxRetries: MAX_RETRIES,
          error: errorMsg,
        });

        // Update attempt count on the stream entry
        try {
          await redis.xadd(
            STREAM_KEY,
            '*',
            'to',
            msg.to,
            'subject',
            msg.subject,
            'html',
            msg.html,
            'templateType',
            msg.templateType,
            'metadata',
            msg.metadata,
            'source',
            msg.source,
            'attempts',
            String(attempts),
            'enqueuedAt',
            msg.enqueuedAt,
          );
          // ACK the original (we re-enqueued with updated attempts)
          await redis.xack(STREAM_KEY, GROUP_NAME, id);
        } catch {
          // If re-enqueue fails, PEL will reclaim the original
        }
      }
    }
  }

  /**
   * Reclaim messages that have been pending too long (stalled workers).
   */
  private async reclaimStalled(): Promise<void> {
    if (!this.redis) return;

    try {
      // XAUTOCLAIM: automatically claim idle messages
      const result = await this.redis.xautoclaim(
        STREAM_KEY,
        GROUP_NAME,
        this.consumerId,
        CLAIM_MIN_IDLE_MS,
        '0-0',
        'COUNT',
        BATCH_SIZE,
      );

      if (result && Array.isArray(result) && result.length >= 2) {
        const messages = result[1];
        if (Array.isArray(messages) && messages.length > 0) {
          logger.info('Reclaimed stalled email messages', {
            count: messages.length,
            consumer: this.consumerId,
          });
          for (const [id, fields] of messages) {
            if (fields) {
              await this.processMessage(id, this.parseStreamMessage(this.parseFields(fields)));
            }
          }
        }
      }
    } catch (err) {
      // XAUTOCLAIM may not be supported on older Redis versions
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.debug('XAUTOCLAIM not available or failed', { error: msg });
    }
  }

  /**
   * Move a failed message to the dead-letter stream.
   */
  private async moveToDlq(originalId: string, msg: StreamMessage, error: string): Promise<void> {
    if (!this.redis) return;

    try {
      await this.redis.xadd(
        DLQ_KEY,
        '*',
        'originalId',
        originalId,
        'to',
        msg.to,
        'subject',
        msg.subject,
        'html',
        msg.html,
        'templateType',
        msg.templateType,
        'metadata',
        msg.metadata,
        'source',
        msg.source,
        'attempts',
        msg.attempts,
        'enqueuedAt',
        msg.enqueuedAt,
        'failedAt',
        new Date().toISOString(),
        'error',
        error,
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Failed to write to DLQ', { error: errMsg, originalId });
    }
  }

  // ----------------------------------------------------------
  // INBOUND: ENQUEUE INCOMING EMAIL
  // ----------------------------------------------------------

  /**
   * Push an inbound email to the inbox stream for async processing.
   * Called from Resend webhook route, MCP agents, or Firehorse automation.
   * Falls back to direct handler invocation if Redis is unavailable.
   */
  async enqueueInbound(email: InboundEmail): Promise<string> {
    if (!this.redis) {
      // Fallback: invoke handler directly
      if (this.inboundHandler) {
        logger.debug('Inbox queue unavailable — processing inbound directly', { from: email.from });
        await this.inboundHandler(email);
      } else {
        logger.warn('No inbound handler registered — inbound email dropped', { from: email.from });
      }
      return 'direct';
    }

    try {
      const messageId = await this.redis.xadd(
        INBOX_STREAM_KEY,
        '*',
        'from',
        email.from,
        'to',
        email.to,
        'subject',
        email.subject,
        'text',
        email.text,
        'html',
        email.html || '',
        'messageId',
        email.messageId,
        'source',
        email.source,
        'rawPayload',
        email.rawPayload || '',
        'attempts',
        '0',
        'receivedAt',
        new Date().toISOString(),
      );

      logger.info('Inbound email enqueued', {
        streamMessageId: messageId,
        from: email.from,
        source: email.source,
        subject: email.subject,
      });

      if (!messageId) {
        throw new Error('Redis XADD returned no message id');
      }
      return messageId;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Failed to enqueue inbound email — processing directly', { error: msg });
      if (this.inboundHandler) {
        await this.inboundHandler(email);
      }
      return 'direct';
    }
  }

  // ----------------------------------------------------------
  // INBOUND CONSUMER (INBOX WORKER)
  // ----------------------------------------------------------

  /**
   * Start the inbox consumer loop. Reads from email:inbox stream
   * and passes each message to the registered inbound handler.
   */
  startInbox(): void {
    if (this.inboxRunning || !this.redis || !this.inboundHandler) {
      if (!this.inboundHandler) {
        logger.warn('Cannot start inbox consumer — no inbound handler registered');
      }
      return;
    }

    this.inboxRunning = true;
    logger.info('Email inbox worker started', { consumer: this.consumerId });
    this.pollInbox();
  }

  /**
   * Stop the inbox consumer loop gracefully.
   */
  stopInbox(): void {
    this.inboxRunning = false;
    if (this.inboxPollTimer) {
      clearTimeout(this.inboxPollTimer);
      this.inboxPollTimer = null;
    }
    logger.info('Email inbox worker stopped', { consumer: this.consumerId });
  }

  /**
   * Poll loop for inbox: read new inbound messages.
   */
  private async pollInbox(): Promise<void> {
    if (!this.inboxRunning || !this.redis || !this.inboundHandler) return;

    try {
      const results = await this.redis.xreadgroup(
        'GROUP',
        INBOX_GROUP_NAME,
        this.consumerId,
        'COUNT',
        BATCH_SIZE,
        'BLOCK',
        BLOCK_MS,
        'STREAMS',
        INBOX_STREAM_KEY,
        '>',
      );

      if (results) {
        const streams = results as [string, [string, string[]][]][];
        for (const [, messages] of streams) {
          for (const [id, fields] of messages) {
            await this.processInboundMessage(id, this.parseFields(fields));
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Email inbox poll error', { error: msg });
    }

    // Schedule next poll
    if (this.inboxRunning) {
      this.inboxPollTimer = setTimeout(() => this.pollInbox(), 100);
    }
  }

  /**
   * Process a single inbound stream message: invoke handler, ACK or DLQ.
   */
  private async processInboundMessage(id: string, fields: Record<string, string>): Promise<void> {
    const redis = this.redis;
    if (!redis) return;
    const attempts = parseInt(fields.attempts || '0', 10) + 1;

    const email: InboundEmail = {
      from: fields.from || '',
      to: fields.to || '',
      subject: fields.subject || '',
      text: fields.text || '',
      html: fields.html || undefined,
      messageId: fields.messageId || id,
      source: fields.source || 'redis-stream',
      rawPayload: fields.rawPayload || undefined,
    };

    try {
      if (this.inboundHandler) {
        await this.inboundHandler(email);
      }

      // ACK: remove from pending
      await redis.xack(INBOX_STREAM_KEY, INBOX_GROUP_NAME, id);

      logger.info('Inbound email processed from inbox stream', {
        messageId: id,
        from: email.from,
        source: email.source,
        attempts,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';

      if (attempts >= MAX_RETRIES) {
        logger.error('Inbound email processing exhausted retries — moving to DLQ', {
          messageId: id,
          from: email.from,
          attempts,
          error: errorMsg,
        });

        // Move to inbox DLQ
        try {
          await redis.xadd(
            INBOX_DLQ_KEY,
            '*',
            'originalId',
            id,
            'from',
            email.from,
            'to',
            email.to,
            'subject',
            email.subject,
            'text',
            email.text,
            'source',
            email.source,
            'attempts',
            String(attempts),
            'failedAt',
            new Date().toISOString(),
            'error',
            errorMsg,
          );
        } catch (dlqErr) {
          logger.error('Failed to write inbound to DLQ', { error: (dlqErr as Error).message });
        }

        await redis.xack(INBOX_STREAM_KEY, INBOX_GROUP_NAME, id);
      } else {
        logger.warn('Inbound email processing failed — will retry', {
          messageId: id,
          from: email.from,
          attempts,
          error: errorMsg,
        });

        try {
          await redis.xadd(
            INBOX_STREAM_KEY,
            '*',
            'from',
            email.from,
            'to',
            email.to,
            'subject',
            email.subject,
            'text',
            email.text,
            'html',
            email.html || '',
            'messageId',
            email.messageId,
            'source',
            email.source,
            'rawPayload',
            email.rawPayload || '',
            'attempts',
            String(attempts),
            'receivedAt',
            new Date().toISOString(),
          );
          await redis.xack(INBOX_STREAM_KEY, INBOX_GROUP_NAME, id);
        } catch (requeueErr) {
          const requeueError = requeueErr instanceof Error ? requeueErr.message : 'Unknown error';
          logger.error('Failed to requeue inbound email for retry', {
            messageId: id,
            error: requeueError,
          });
        }
      }
    }
  }

  // ----------------------------------------------------------
  // DIRECT SEND (BYPASS / FALLBACK)
  // ----------------------------------------------------------

  /**
   * Send email directly via EmailService (no queue).
   * Used as fallback when Redis is unavailable, or for urgent sends.
   */
  private async sendDirect(email: QueuedEmail): Promise<void> {
    if (email.templateType === 'welcome' && email.metadata?.name) {
      await emailService.sendWelcomeEmail(email.to, email.metadata.name as string);
    } else if (email.templateType === 'password_reset' && email.metadata?.resetLink) {
      await emailService.sendPasswordResetEmail(email.to, email.metadata.resetLink as string);
    } else if (
      email.templateType === 'report_delivery' &&
      email.metadata?.reportName &&
      email.metadata?.downloadUrl
    ) {
      await emailService.sendReportDeliveryEmail(
        email.to,
        email.metadata.reportName as string,
        email.metadata.downloadUrl as string,
      );
    } else if (email.templateType === 'invoice' && email.metadata?.invoiceId) {
      await emailService.sendInvoiceEmail(
        email.to,
        email.metadata.invoiceId as string,
        email.metadata.amount as number,
        email.metadata.currency as string,
      );
    } else {
      // Generic notification — use the notification template
      await emailService.sendNotificationEmail(email.to, email.subject, email.html);
    }
  }

  // ----------------------------------------------------------
  // SUPABASE LOGGING
  // ----------------------------------------------------------

  private async logToSupabase(
    messageId: string,
    email: QueuedEmail,
    status: string,
  ): Promise<void> {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    try {
      await fetch(`${supabaseUrl}/rest/v1/email_queue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          stream_message_id: messageId,
          to_email: email.to,
          subject: email.subject,
          template_type: email.templateType || 'custom',
          source: email.source || 'platform',
          status,
          metadata: email.metadata || {},
          enqueued_at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.debug('Email queue Supabase log failed', { error: msg });
    }
  }

  private async updateSupabaseStatus(
    messageId: string,
    status: string,
    error?: string,
  ): Promise<void> {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    try {
      const body: Record<string, unknown> = { status };
      if (status === 'sent') {
        body.sent_at = new Date().toISOString();
      }
      if (error) {
        body.error = error;
      }

      await fetch(
        `${supabaseUrl}/rest/v1/email_queue?stream_message_id=eq.${encodeURIComponent(messageId)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify(body),
        },
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.debug('Email queue Supabase status update failed', { error: msg });
    }
  }

  // ----------------------------------------------------------
  // QUEUE INFO / HEALTH
  // ----------------------------------------------------------

  /**
   * Get queue depth and consumer info.
   */
  async getQueueInfo(): Promise<{
    available: boolean;
    outbox: { streamLength: number; pendingCount: number; dlqLength: number };
    inbox: { streamLength: number; pendingCount: number; dlqLength: number };
    consumer: string;
  }> {
    const empty = { streamLength: 0, pendingCount: 0, dlqLength: 0 };

    if (!this.redis) {
      return {
        available: false,
        outbox: { ...empty },
        inbox: { ...empty },
        consumer: this.consumerId,
      };
    }

    try {
      const [outboxLen, outboxDlq, outboxPending, inboxLen, inboxDlq, inboxPending] =
        await Promise.all([
          this.redis.xlen(STREAM_KEY),
          this.redis.xlen(DLQ_KEY).catch(() => 0),
          this.redis.xpending(STREAM_KEY, GROUP_NAME).catch(() => null),
          this.redis.xlen(INBOX_STREAM_KEY),
          this.redis.xlen(INBOX_DLQ_KEY).catch(() => 0),
          this.redis.xpending(INBOX_STREAM_KEY, INBOX_GROUP_NAME).catch(() => null),
        ]);

      const outboxPendingCount = Array.isArray(outboxPending)
        ? (outboxPending[0] as number) || 0
        : 0;
      const inboxPendingCount = Array.isArray(inboxPending) ? (inboxPending[0] as number) || 0 : 0;

      return {
        available: true,
        outbox: { streamLength: outboxLen, pendingCount: outboxPendingCount, dlqLength: outboxDlq },
        inbox: { streamLength: inboxLen, pendingCount: inboxPendingCount, dlqLength: inboxDlq },
        consumer: this.consumerId,
      };
    } catch {
      return {
        available: false,
        outbox: { ...empty },
        inbox: { ...empty },
        consumer: this.consumerId,
      };
    }
  }

  /**
   * Check if the queue is available (Redis connected).
   */
  isAvailable(): boolean {
    return this.redis !== null;
  }

  /**
   * Graceful shutdown: stop consumer, disconnect Redis.
   */
  async shutdown(): Promise<void> {
    this.stop();
    this.stopInbox();
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
      logger.info('Email queue Redis connection closed');
    }
  }

  // ----------------------------------------------------------
  // HELPERS
  // ----------------------------------------------------------

  private parseFields(fields: string[]): Record<string, string> {
    const obj: Record<string, string> = {};
    for (let i = 0; i < fields.length; i += 2) {
      obj[fields[i]] = fields[i + 1];
    }
    return obj;
  }

  private parseStreamMessage(fields: Record<string, string>): StreamMessage {
    return {
      id: fields.id || '',
      to: fields.to || '',
      subject: fields.subject || '',
      html: fields.html || '',
      templateType: fields.templateType || 'custom',
      metadata: fields.metadata || '{}',
      source: fields.source || 'platform',
      attempts: fields.attempts || '0',
      enqueuedAt: fields.enqueuedAt || new Date().toISOString(),
    };
  }
}

// Export singleton
export const emailQueue = new EmailQueueService();
export default emailQueue;
