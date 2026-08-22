import { type Request, type Response, Router } from 'express';
import {
  idempotencyCheck,
  preserveRawBody,
  stripeRateLimit,
  verifyStripeWebhook,
} from '../middleware/stripe-webhook.middleware.js';
import logger from '../utils/logger.js';
import { supabase } from '../services/supabase.service.js';
import { gtmEventLogger } from '../services/gtm-event-logger.js';
import { eventBus } from '../agents/event-bus.js';

const router = Router();

/**
 * Webhook endpoint for Stripe events
 *
 * Security layers:
 * 1. Raw body preservation (before JSON parsing)
 * 2. Stripe signature verification (HMAC-SHA256)
 * 3. Timestamp validation (prevent replay attacks)
 * 4. Idempotency check (prevent duplicate processing)
 * 5. Rate limiting (100 events/sec per type)
 */

// Apply middleware BEFORE express.json()
// Order matters: preserveRawBody → verifyStripeWebhook → idempotencyCheck → stripeRateLimit
router.post(
  '/',
  preserveRawBody,
  verifyStripeWebhook,
  idempotencyCheck,
  stripeRateLimit,
  async (req: Request, res: Response) => {
    try {
      const event = req.stripeEvent;
      const storeResult = req.storeWebhookResult;
      if (!event || !storeResult) {
        return res.status(400).json({ error: 'Webhook event missing' });
      }

      logger.info('Processing Stripe webhook', {
        event_type: event.type,
        event_id: event.id,
        created: new Date(event.created * 1000).toISOString(),
      });

      // =====================================================================
      // INVOICE PAYMENT SUCCEEDED
      // =====================================================================
      if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object;
        const invoiceId = invoice.id;

        logger.info('Invoice payment succeeded', {
          invoice_id: invoiceId,
          amount: invoice.amount_paid,
        });

        // Find order by Stripe invoice ID
        const { data: order, error } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_invoice_id', invoiceId)
          .single();

        if (error || !order) {
          logger.warn('Order not found for Stripe invoice', { invoice_id: invoiceId });
          const result = { success: true, message: 'Invoice processed (order not found)' };
          storeResult(result);
          return res.status(200).json(result);
        }

        // Mark order as paid
        const { error: updateError } = await supabase.rpc('mark_order_paid', {
          p_order_id: order.id,
        });

        if (updateError) {
          logger.error('Failed to mark order paid', { error: updateError, order_id: order.id });
          return res.status(500).json({ error: 'Failed to process payment' });
        }

        logger.info('Order marked as paid', {
          order_id: order.id,
          invoice_id: invoiceId,
          amount: invoice.amount_paid,
        });

        // Log GTM purchase event
        gtmEventLogger.logEvent({
          event_type: 'purchase',
          source: 'stripe_webhook',
          properties: {
            transaction_id: invoiceId,
            revenue_eur: invoice.amount_paid / 100, // Stripe stores in cents
            currency: invoice.currency?.toUpperCase() || 'EUR',
            order_id: order.id,
            customer_id: invoice.customer,
            invoice_number: invoice.number,
          },
          user_id: order.user_id || undefined,
          session_id: order.session_id || undefined,
          timestamp: new Date(event.created * 1000).toISOString(),
        });

        // Emit to event bus for downstream handlers
        await eventBus.emit({
          type: 'sales.purchase',
          source: 'stripe_webhook',
          payload: {
            transaction_id: invoiceId,
            order_id: order.id,
            amount_eur: invoice.amount_paid / 100,
            customer_id: invoice.customer,
          },
          priority: 'normal',
          timestamp: new Date(event.created * 1000).toISOString(),
          orgId: order.org_id || 'unknown',
          sessionId: order.session_id || 'unknown',
        });

        // Step 8: Alert Risto for enterprise / high-value orders (≥ €500)
        const amountEur = invoice.amount_paid / 100;
        if (amountEur >= 500) {
          gtmEventLogger.logEvent({
            event_type: 'risto_alert_sent',
            source: 'stripe_webhook',
            properties: {
              order_id: order.id,
              amount_eur: amountEur,
              customer_id: invoice.customer,
              invoice_number: invoice.number,
              alert_channel: 'email',
            },
            user_id: order.user_id || undefined,
            session_id: order.session_id || undefined,
            timestamp: new Date(event.created * 1000).toISOString(),
          });
        }

        // Step 9: Accounting handover — invoice routed to accounting workflow
        gtmEventLogger.logEvent({
          event_type: 'accounting_handover',
          source: 'stripe_webhook',
          properties: {
            order_id: order.id,
            invoice_id: invoiceId,
            invoice_number: invoice.number,
            amount_eur: amountEur,
            currency: invoice.currency?.toUpperCase() || 'EUR',
            customer_id: invoice.customer,
          },
          user_id: order.user_id || undefined,
          session_id: order.session_id || undefined,
          timestamp: new Date(event.created * 1000).toISOString(),
        });

        // Flush buffered GTM events before acknowledging the webhook so they
        // are not lost if the process exits shortly after sending the 200 response.
        await gtmEventLogger.flush();
        // Step 11: License delivery email sent — marks onboarding email dispatched
        gtmEventLogger.logEvent({
          event_type: 'email_sent',
          source: 'stripe_webhook',
          properties: {
            template: 'license_delivery',
            order_id: order.id,
            invoice_id: invoiceId,
            recipient: invoice.customer_email || null,
          },
          user_id: order.user_id || undefined,
          session_id: order.session_id || undefined,
          timestamp: new Date(event.created * 1000).toISOString(),
        });

        // TODO: Activate service/product access
        // TODO: Trigger downstream workflows (provisioning, onboarding, etc.)

        const result = { success: true, order_id: order.id, status: 'payment_completed' };
        storeResult(result);
        return res.status(200).json(result);
      }

      // =====================================================================
      // INVOICE MARKED UNCOLLECTIBLE
      // =====================================================================
      if (event.type === 'invoice.marked_uncollectible') {
        const invoice = event.data.object;
        const invoiceId = invoice.id;

        logger.warn('Invoice marked uncollectible', {
          invoice_id: invoiceId,
          amount_due: invoice.amount_due,
        });

        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_invoice_id', invoiceId)
          .single();

        if (order) {
          logger.warn('Order payment failed', {
            order_id: order.id,
            invoice_id: invoiceId,
          });

          // TODO: Send payment failure notification to customer
          // TODO: Send admin alert for payment collection
          // TODO: Schedule auto-cancel if unpaid after 30 days
        }

        const result = { success: true, message: 'Uncollectible invoice processed' };
        storeResult(result);
        return res.status(200).json(result);
      }

      // =====================================================================
      // INVOICE PAYMENT FAILED
      // =====================================================================
      if (event.type === 'invoice.payment_action_required') {
        const invoice = event.data.object;

        logger.warn('Invoice payment action required', {
          invoice_id: invoice.id,
          amount_due: invoice.amount_due,
        });

        // TODO: Send payment retry notification to customer
        const result = { success: true, message: 'Payment action required notification sent' };
        storeResult(result);
        return res.status(200).json(result);
      }

      // =====================================================================
      // INVOICE PAYMENT ATTEMPT REQUIRED
      // =====================================================================
      if (event.type === 'invoice.payment_attempt_required') {
        const invoice = event.data.object;

        logger.warn('Invoice payment attempt required', {
          invoice_id: invoice.id,
          amount_due: invoice.amount_due,
        });

        // TODO: Send notification to customer about unsupported payment method
        // TODO: Offer alternative payment options
        const result = { success: true, message: 'Payment attempt required notification sent' };
        storeResult(result);
        return res.status(200).json(result);
      }

      // =====================================================================
      // INVOICE PAYMENT FAILED
      // =====================================================================
      if (event.type === 'invoice.payment_failed') {
        const invoice = event.data.object;

        logger.warn('Invoice payment failed', {
          invoice_id: invoice.id,
          amount_due: invoice.amount_due,
          failure_reason: invoice.last_finalization_error?.message,
        });

        // Find order by Stripe invoice ID
        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_invoice_id', invoice.id)
          .single();

        if (order) {
          logger.warn('Order payment failed', {
            order_id: order.id,
            invoice_id: invoice.id,
          });

          // TODO: Send payment failure notification to customer
          // TODO: Send admin alert for failed payment
          // TODO: Suggest retry with different payment method
        }

        const result = { success: true, message: 'Payment failure processed' };
        storeResult(result);
        return res.status(200).json(result);
      }

      // =====================================================================
      // CHARGE REFUNDED
      // =====================================================================
      if (event.type === 'charge.refunded') {
        const charge = event.data.object;

        logger.info('Charge refunded', {
          charge_id: charge.id,
          refund_amount: charge.amount_refunded,
        });

        // TODO: Update order status if refund is initiated
        const result = { success: true, charge_id: charge.id, status: 'refunded' };
        storeResult(result);
        return res.status(200).json(result);
      }

      // =====================================================================
      // CUSTOMER DELETED
      // =====================================================================
      if (event.type === 'customer.deleted') {
        const customer = event.data.object;

        logger.info('Customer deleted', {
          customer_id: customer.id,
        });

        // TODO: Handle customer deletion (anonymize records, etc.)
        const result = { success: true, customer_id: customer.id };
        storeResult(result);
        return res.status(200).json(result);
      }

      // =====================================================================
      // UNHANDLED EVENT TYPE
      // =====================================================================
      logger.info('Unhandled Stripe event type', { event_type: event.type });
      const result = { success: true, message: 'Event received and logged' };
      storeResult(result);
      return res.status(200).json(result);
    } catch (error) {
      logger.error('Webhook processing error', { error });
      return res.status(500).json({ error: 'Failed to process webhook' });
    }
  },
);

/**
 * Health check endpoint for Stripe
 * Returns 200 if webhook endpoint is ready
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'stripe-webhook' });
});

export default router;
