/**
 * Email Tracking Service — DWS IQ 6/7 (GTM Machine Phase 2a)
 *
 * Tracks email lifecycle events: sent, opened, clicked, bounced, complained.
 * Integrates with Firehorse state machine and GTM event logger.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (GTM Machine Phase 2a)
 * Branch: claude/implement-gtm-machine-Avz67
 * Date: 2026-04-28
 * Owner: Lifetime Oy
 */

import logger from '../utils/logger.js';
import { gtmEventLogger } from './gtm-event-logger.js';
import { eventBus } from '../agents/event-bus.js';

export interface EmailTrackingEvent {
  email_id: string; // X-SES-MESSAGE-ID
  recipient: string;
  template?: string;
  step?: number; // Funnel step (3, 4, 6, 8, 11, 12, etc.)
  event_type: 'sent' | 'opened' | 'clicked' | 'bounced' | 'complained';
  bounce_type?: 'hard' | 'soft'; // For bounced events
  link_url?: string; // For clicked events
  session_id?: string;
  user_id?: string;
}

class EmailTrackingService {
  /**
   * Log an email sent event
   */
  async logEmailSent(
    email_id: string,
    recipient: string,
    template: string,
    step?: number,
    session_id?: string,
    user_id?: string,
  ): Promise<void> {
    try {
      const event: EmailTrackingEvent = {
        email_id,
        recipient,
        template,
        step,
        event_type: 'sent',
        session_id,
        user_id,
      };

      await this.logEmailEvent(event);
    } catch (err) {
      logger.warn('Failed to log email sent event', {
        email_id,
        recipient,
        error: String(err),
      });
    }
  }

  /**
   * Log an email opened event (via webhook from SES or pixel tracker)
   */
  async logEmailOpened(
    email_id: string,
    recipient: string,
    session_id?: string,
    template?: string,
  ): Promise<void> {
    try {
      const event: EmailTrackingEvent = {
        email_id,
        recipient,
        event_type: 'opened',
        session_id,
        template,
      };

      await this.logEmailEvent(event);
    } catch (err) {
      logger.warn('Failed to log email opened event', {
        email_id,
        error: String(err),
      });
    }
  }

  /**
   * Log an email clicked event (link clicked via tracking link)
   */
  async logEmailClicked(
    email_id: string,
    recipient: string,
    link_url: string,
    session_id?: string,
  ): Promise<void> {
    try {
      const event: EmailTrackingEvent = {
        email_id,
        recipient,
        event_type: 'clicked',
        link_url,
        session_id,
      };

      await this.logEmailEvent(event);
    } catch (err) {
      logger.warn('Failed to log email clicked event', {
        email_id,
        link_url,
        error: String(err),
      });
    }
  }

  /**
   * Log an email bounce event (hard or soft bounce from SES)
   */
  async logEmailBounced(
    email_id: string,
    recipient: string,
    bounce_type: 'hard' | 'soft',
    session_id?: string,
  ): Promise<void> {
    try {
      const event: EmailTrackingEvent = {
        email_id,
        recipient,
        event_type: 'bounced',
        bounce_type,
        session_id,
      };

      await this.logEmailEvent(event);
    } catch (err) {
      logger.warn('Failed to log email bounce event', {
        email_id,
        bounce_type,
        error: String(err),
      });
    }
  }

  /**
   * Log an email complaint event (spam report from recipient)
   */
  async logEmailComplained(
    email_id: string,
    recipient: string,
    session_id?: string,
  ): Promise<void> {
    try {
      const event: EmailTrackingEvent = {
        email_id,
        recipient,
        event_type: 'complained',
        session_id,
      };

      await this.logEmailEvent(event);
    } catch (err) {
      logger.warn('Failed to log email complaint event', {
        email_id,
        error: String(err),
      });
    }
  }

  /**
   * Internal: Log email event to GTM logger + event bus
   */
  private async logEmailEvent(event: EmailTrackingEvent): Promise<void> {
    // Log to GTM event logger (buffers for Supabase flush)
    gtmEventLogger.logEvent({
      event_type: `email_${event.event_type}`,
      source: 'backend',
      properties: {
        email_id: event.email_id,
        recipient: event.recipient,
        template: event.template,
        step: event.step,
        bounce_type: event.bounce_type,
        link_url: event.link_url,
      },
      user_id: event.user_id,
      session_id: event.session_id,
      timestamp: new Date().toISOString(),
    });

    // Emit to event bus for Firehorse state machine updates
    await eventBus.emit({
      type: `sales.email_${event.event_type}`,
      source: 'email_tracking',
      payload: {
        email_id: event.email_id,
        recipient: event.recipient,
        template: event.template,
        step: event.step,
        bounce_type: event.bounce_type,
        link_url: event.link_url,
      },
      priority:
        event.event_type === 'bounced' || event.event_type === 'complained' ? 'high' : 'normal',
      timestamp: new Date().toISOString(),
      orgId: 'unknown',
      sessionId: event.session_id || 'unknown',
    });

    logger.debug('Email event logged', {
      event_type: `email_${event.event_type}`,
      email_id: event.email_id,
      recipient: event.recipient,
    });
  }
}

export const emailTrackingService = new EmailTrackingService();
