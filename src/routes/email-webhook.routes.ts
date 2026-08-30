// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- src/routes/email-webhook.routes.ts
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

import { type Request, type Response, Router } from 'express';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';
import { confirmSubscribeUrl, verifySnsEnvelope } from '../utils/sns-verify.js';
import { emailTrackingService } from '../services/email-tracking.service.js';
import { getSupabaseClient } from '../config/supabase.js';

const router = Router();

// Unauthenticated-by-default endpoint: rate limit + strict SNS signature gate.
const sesLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

interface SesRecipient {
  emailAddress?: string;
  status?: string;
}

interface SesEventBody {
  eventType: string;
  messageId: string;
  bounce?: { bounceType?: string; bouncedRecipients?: SesRecipient[] };
  delivery?: { recipients?: string[] };
  open?: { recipient?: string; timestamp?: string };
  click?: { recipient?: string; link?: string; timestamp?: string };
  complaint?: { complainedRecipients?: SesRecipient[] };
  // Flattened accessors: legacy code reads branch fields directly off `ses`.
  bounceType?: string;
  bouncedRecipients?: SesRecipient[];
  recipients?: string[];
  recipient?: string;
  link?: string;
  complainedRecipients?: SesRecipient[];
  timestamp?: string;
}

/**
 * POST /webhooks/email/ses
 * SNS subscription confirmation + event notifications from Amazon SES.
 *
 * Fail-closed: every request must carry a cryptographically verified SNS
 * envelope (SignatureVersion 1, cert pinned to *.sns.<region>.amazonaws.com).
 * Subscription confirmations additionally GET the constrained SubscribeURL
 * before being acknowledged. Anything else is rejected without touching
 * tracking state.
 */
router.post('/ses', sesLimiter, async (req: RawBodyRequest, res: Response) => {
  try {
    const raw = req.rawBody;
    if (!raw) {
      logger.error('SES webhook: raw body unavailable for signature verification');
      return res.status(500).json({ error: 'Raw body not captured' });
    }

    const v = await verifySnsEnvelope(raw);
    if (!v.ok) {
      logger.warn('SES webhook: rejected', { reason: v.error });
      return res.status(v.status).json({ error: v.error });
    }
    const snsMsg = v.message;

    if (snsMsg.Type === 'SubscriptionConfirmation') {
      const confirmed = await confirmSubscribeUrl(snsMsg.SubscribeURL);
      logger.info('SNS subscription confirmation', {
        messageId: snsMsg.MessageId,
        subscribeUrlConfirmed: confirmed,
      });
      // Only claim success when the constrained SubscribeURL was actually hit.
      return res.status(confirmed ? 200 : 400).json({ success: confirmed });
    }

    if (snsMsg.Type === 'UnsubscribeConfirmation') {
      logger.warn('SNS unsubscribe confirmation received — re-subscribe required', {
        messageId: snsMsg.MessageId,
      });
      return res.status(200).json({ received: true });
    }

    // Notification: the SES event lives inside Message as nested JSON.
    let message: Record<string, unknown>;
    try {
      message = JSON.parse(snsMsg.Message ?? '');
    } catch {
      return res.status(400).json({ error: 'SNS Message is not valid JSON' });
    }
    const messageType = (message.Type as string) ?? (message.messageType as string);

    logger.debug('Email webhook received', {
      messageType,
      messageId: snsMsg.MessageId,
    });

    // The SNS envelope is verified above; `message` (parsed from the signed
    // Message field) IS the SES event.
    const sesMessage = message as unknown as SesEventBody;

    const eventType = sesMessage.eventType;
    const ses = (sesMessage.bounce ||
      sesMessage.delivery ||
      sesMessage.open ||
      sesMessage.click ||
      sesMessage.complaint) as SesEventBody;

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

        const hardOrSoft = bounceTypeMap[bounceType ?? 'Undetermined'] || 'soft';

        logger.warn('Email bounce', {
          email,
          bounceType,
          status,
          messageId: ses.messageId,
        });

        // Get email_id from SES message headers (X-SES-MESSAGE-ID)
        const emailId = ses.messageId || 'unknown';

        await emailTrackingService.logEmailBounced(emailId, email ?? 'unknown', hardOrSoft);

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

      await emailTrackingService.logEmailOpened(emailId, email ?? 'unknown', undefined, template);

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
      await emailTrackingService.logEmailClicked(emailId, email ?? 'unknown', link ?? '');

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
        await emailTrackingService.logEmailComplained(emailId, email ?? 'unknown');

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
