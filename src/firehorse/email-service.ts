/**
 * Firehorse Omnichannel - Email Service
 *
 * Sends Firehorse campaign emails through the platform email queue
 * (Redis Streams) with fallback to the production EmailService.
 *
 * Replaces the earlier console-only stub with real delivery.
 */

import logger from '../utils/logger.js';
import { emailQueue } from '../services/email-queue.service.js';
import emailServiceDirect from '../services/email.service.js';

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  lead_id: string;
}

class FirehorseEmailService {
  /**
   * Send a Firehorse campaign email.
   * Routes through the Redis Streams queue for reliable async delivery.
   * Falls back to direct send if the queue is unavailable.
   */
  async send(payload: EmailPayload): Promise<void> {
    const { to, subject, body, lead_id } = payload;

    logger.info('Firehorse email send', { to, subject, lead_id });

    try {
      await emailQueue.enqueue({
        to,
        subject,
        html: body.replace(/\n/g, '<br>'),
        templateType: 'notification',
        metadata: { lead_id, rawBody: body },
        source: 'firehorse',
      });
    } catch (err) {
      // Queue failed — send directly via production EmailService
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.warn('Firehorse email queue failed, sending direct', { error: errorMsg, to });

      await emailServiceDirect.sendNotificationEmail(to, subject, body);
    }
  }
}

export const emailService = new FirehorseEmailService();
