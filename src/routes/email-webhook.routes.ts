/**
 * Email Webhook Routes — DWS IQ 6/7 (GTM Machine Phase 2a)
 *
 * Webhooks for email provider notifications (Amazon SES):
 * - Bounce: Hard/soft bounces (invalid address, mailbox full)
 * - Delivery: Successful delivery to recipient
 * - Open: Email opened (requires SES open tracking enabled)
 * - Click: Link clicked (requires SES click tracking enabled)
 * - Complaint: Spam report from recipient
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (GTM Machine Phase 2a)
 * Branch: claude/implement-gtm-machine-Avz67
 * Date: 2026-04-28
 * Owner: Lifetime Oy
 */

import { Router, Request, Response } from 'express';
import logger from '../utils/logger.js';
import { emailTrackingService } from '../services/email-tracking.service.js';
import { getSupabaseClient } from '../config/supabase.js';

const router = Router();

/**
 * POST /webhooks/email/ses
 * SNS subscription confirmation + event notifications from Amazon SES
 */
router.post('/ses', async (req: Request, res: Response) => {
  try {
    const message = req.body;
    const messageType = message.EventSource === 'aws:ses' ? message.messageType : message.Type;

    logger.debug('Email webhook received', {
      messageType,
      messageId: message.messageId,
    });

    // Handle SNS subscription confirmation
    if (messageType === 'SubscriptionConfirmation') {
      logger.info('SNS subscription confirmation', { messageId: message.messageId });
      // In production, verify and call SubscribeUrl
      // For now, we just log it
      return res.status(200).json({ success: true, message: 'Subscription confirmed' });
    }

    // Parse SNS message
    let sesMessage;
    if (message.Message) {
      sesMessage = JSON.parse(message.Message);
    } else {
      sesMessage = message;
    }

    const eventType = sesMessage.eventType;
    const ses =
      sesMessage.bounce ||
      sesMessage.delivery ||
      sesMessage.open ||
      sesMessage.click ||
      sesMessage.complaint;

    if (!eventType || !ses) {
      logger.warn('Invalid email webhook payload', { messageType, eventType });
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // =====================================================================
    // BOUNCE
    // =====================================================================
    if (eventType === 'Bounce') {
      const bounce = ses;
      const bounceType = bounce.bounceType; // Permanent, Transient, Undetermined

      for (const recipient of bounce.bouncedRecipients || []) {
        const email = recipient.emailAddress;
        const status = recipient.status;

        const bounceTypeMap: Record<string, 'hard' | 'soft'> = {
          Permanent: 'hard',
          Transient: 'soft',
          Undetermined: 'soft',
        };

        const hardOrSoft = bounceTypeMap[bounceType] || 'soft';

        logger.warn('Email bounce', {
          email,
          bounceType,
          status,
          messageId: ses.messageId,
        });

        // Get email_id from SES message headers (X-SES-MESSAGE-ID)
        const emailId = ses.messageId || 'unknown';

        await emailTrackingService.logEmailBounced(emailId, email, hardOrSoft);

        // TODO: Mark contact as invalid in Firehorse
        // TODO: Remove from future campaigns if hard bounce
      }

      return res
        .status(200)
        .json({ success: true, processed: bounce.bouncedRecipients?.length || 0 });
    }

    // =====================================================================
    // DELIVERY
    // =====================================================================
    if (eventType === 'Delivery') {
      const delivery = ses;

      for (const recipient of delivery.recipients || []) {
        logger.info('Email delivered', {
          email: recipient,
          messageId: ses.messageId,
        });

        // Delivery is implicit from logEmailSent
        // This webhook is mostly for confirmation logging
      }

      return res.status(200).json({ success: true, processed: delivery.recipients?.length || 0 });
    }

    // =====================================================================
    // OPEN
    // =====================================================================
    if (eventType === 'Open') {
      const open = ses;
      const email = open.recipient;

      logger.info('Email opened', {
        email,
        messageId: ses.messageId,
        timestamp: open.timestamp,
      });

      const emailId = ses.messageId || 'unknown';

      // Look up the template from email_logs so the GTM funnel can match step 12 (welcome%)
      let template: string | undefined;
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data } = await supabase
          .from('email_logs')
          .select('template_type')
          .eq('to_email', email)
          .order('sent_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        template = data?.template_type ?? undefined;
      }

      await emailTrackingService.logEmailOpened(emailId, email, undefined, template);

      return res.status(200).json({ success: true, message: 'Open event logged' });
    }

    // =====================================================================
    // CLICK
    // =====================================================================
    if (eventType === 'Click') {
      const click = ses;
      const email = click.recipient;
      const link = click.link;

      logger.info('Email link clicked', {
        email,
        link,
        messageId: ses.messageId,
        timestamp: click.timestamp,
      });

      const emailId = ses.messageId || 'unknown';
      await emailTrackingService.logEmailClicked(emailId, email, link);

      return res.status(200).json({ success: true, message: 'Click event logged' });
    }

    // =====================================================================
    // COMPLAINT
    // =====================================================================
    if (eventType === 'Complaint') {
      const complaint = ses;

      for (const recipient of complaint.complainedRecipients || []) {
        const email = recipient.emailAddress;

        logger.warn('Email complaint (spam report)', {
          email,
          messageId: ses.messageId,
        });

        const emailId = ses.messageId || 'unknown';
        await emailTrackingService.logEmailComplained(emailId, email);

        // TODO: Suppress email address permanently
        // TODO: Alert Risto for manual review
      }

      return res
        .status(200)
        .json({ success: true, processed: complaint.complainedRecipients?.length || 0 });
    }

    // Unknown event type
    logger.warn('Unknown email webhook event type', { eventType });
    return res.status(400).json({ error: 'Unknown event type' });
  } catch (err) {
    logger.error('Email webhook error', { error: String(err) });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
