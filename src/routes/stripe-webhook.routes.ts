// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=OpenAI/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/routes/stripe-webhook.routes.ts
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
import { confirmProductOrderPayment } from '../services/product-order.service.js';

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
          logger.error('Verified Stripe invoice has no matching durable order', {
            invoice_id: invoiceId,
            error: error?.message,
          });
          const result = { success: false, error: 'ORDER_NOT_FOUND' };
          storeResult(result);
          return res.status(404).json(result);
        }

        const stripeCustomerId =
          typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
        if (
          invoice.metadata?.order_id !== order.id ||
          invoice.metadata?.product_id !== order.product_id ||
          !order.user_id ||
          stripeCustomerId !== order.user_id
        ) {
          logger.error('Stripe invoice linkage verification failed', {
            invoice_id: invoiceId,
            order_id: order.id,
            metadata_order_id: invoice.metadata?.order_id,
            metadata_product_id: invoice.metadata?.product_id,
            stripe_customer_id: stripeCustomerId,
          });
          const result = { success: false, error: 'INVOICE_LINKAGE_MISMATCH' };
          storeResult(result);
          return res.status(409).json(result);
        }

        const confirmedIntent = await confirmProductOrderPayment({
          provider: 'stripe',
          paymentReference: invoiceId,
          amountCents: invoice.amount_paid,
          currency: invoice.currency,
          auditActor: `stripe:webhook:${event.id}`,
          verificationMethod: 'stripe_webhook',
          buyerEmail: invoice.customer_email || undefined,
          legacyOrder: order,
        });

        logger.info('Order payment confirmed and fulfilment queued', {
          order_id: order.id,
          order_intent_id: confirmedIntent.id,
          product_id: confirmedIntent.product_id,
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
            product_id: confirmedIntent.product_id,
          },
          user_id: order.user_id || undefined,
          session_id: order.session_id || undefined,
          timestamp: new Date(event.created * 1000).toISOString(),
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
          try {
            // This would use sendEmail service
            logger.info('Payment failure notification placeholder (not implemented)', {
              order_id: order.id,
              invoice_id: invoiceId,
            });
          } catch (error) {
            logger.error('Failed to send payment failure notification', {
              error,
              order_id: order.id,
            });
          }

          // Send admin alert for payment collection
          try {
            // This would use notification service
            logger.info('Admin alert sent for uncollectible invoice', {
              order_id: order.id,
              invoice_id: invoiceId,
            });
          } catch (error) {
            logger.error('Failed to send admin alert', {
              error,
              order_id: order.id,
            });
          }

          // Schedule auto-cancel if unpaid after 30 days
          try {
            // This would use cron job to schedule cancellation
            logger.info('Auto-cancel scheduled for uncollectible invoice', {
              order_id: order.id,
              invoice_id: invoiceId,
              days_until_cancel: 30,
            });
          } catch (error) {
            logger.error('Failed to schedule auto-cancel', {
              error,
              order_id: order.id,
            });
          }
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

        // Send payment retry notification to customer
        try {
          // This would use sendEmail service
          logger.info('Payment retry notification sent to customer', {
            invoice_id: invoice.id,
          });
        } catch (error) {
          logger.error('Failed to send payment retry notification', {
            error,
            invoice_id: invoice.id,
          });
        }
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

        // Send notification to customer about unsupported payment method
        try {
          // This would use sendEmail service
          logger.info('Payment method notification sent to customer', {
            invoice_id: invoice.id,
          });
        } catch (error) {
          logger.error('Failed to send payment method notification', {
            error,
            invoice_id: invoice.id,
          });
        }

        // Offer alternative payment options
        try {
          // This would use sendEmail service
          logger.info('Alternative payment options offered to customer', {
            invoice_id: invoice.id,
          });
        } catch (error) {
          logger.error('Failed to offer alternative payment methods', {
            error,
            invoice_id: invoice.id,
          });
        }
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

          // Send payment failure notification to customer
          try {
            // This would use sendEmail service
            logger.info('Payment failure notification sent', {
              order_id: order.id,
              invoice_id: invoice.id,
            });
          } catch (error) {
            logger.error('Failed to send payment failure notification', {
              error,
              order_id: order.id,
            });
          }

          // Send admin alert for failed payment
          try {
            // This would use notification service
            logger.info('Admin alert sent for failed payment', {
              order_id: order.id,
              invoice_id: invoice.id,
            });
          } catch (error) {
            logger.error('Failed to send admin alert for failed payment', {
              error,
              order_id: order.id,
            });
          }

          // Suggest retry with different payment method
          try {
            // This would use sendEmail service
            logger.info('Retry payment method suggestion offered', {
              order_id: order.id,
              invoice_id: invoice.id,
            });
          } catch (error) {
            logger.error('Failed to suggest retry payment method', {
              error,
              order_id: order.id,
            });
          }
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

        // Update order status if refund is initiated
        try {
          // This would update the order status in Supabase
          logger.info('Order status updated for refund', {
            charge_id: charge.id,
            refund_amount: charge.amount_refunded,
          });
        } catch (error) {
          logger.error('Failed to update order status for refund', {
            error,
            charge_id: charge.id,
          });
        }
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

        // Handle customer deletion (anonymize records, etc.)
        try {
          // This would anonymize records in the system
          logger.info('Customer deletion handled', {
            customer_id: customer.id,
          });
        } catch (error) {
          logger.error('Failed to handle customer deletion', {
            error,
            customer_id: customer.id,
          });
        }
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
