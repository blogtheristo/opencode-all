// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/routes/order-intake.routes.ts
import { type Request, type Response, Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body, header, param, validationResult } from 'express-validator';
import { requireAdminKey } from '../middleware/admin-auth.middleware.js';
import { requireProductOrderSchema } from '../middleware/product-order-readiness.middleware.js';
import { CatalogueProductError } from '../services/product-catalog.service.js';
import { isProductOrderSchemaReady } from '../services/product-order-readiness.service.js';
import {
  confirmProductOrderPayment,
  createProductOrderIntent,
  type PaymentProvider,
  PaymentVerificationError,
  queuePendingExternalPaymentReview,
} from '../services/product-order.service.js';
import logger from '../utils/logger.js';

const router = Router();
const intakeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many order intake requests. Please try again later.' },
});

const confirmationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many payment confirmation requests. Please try again later.' },
});

const notifyValidators = [
  header('idempotency-key')
    .optional()
    .isLength({ min: 8, max: 128 })
    .matches(/^[A-Za-z0-9._:-]+$/),
  body('orderId')
    .isString()
    .trim()
    .isLength({ min: 8, max: 128 })
    .matches(/^[A-Za-z0-9._:-]+$/),
  body('product.id')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .matches(/^[A-Za-z0-9._-]+$/),
  body('customer.email').isEmail().isLength({ max: 254 }).normalizeEmail(),
  body('customer.firstName').isString().trim().isLength({ min: 1, max: 100 }),
  body('customer.lastName').isString().trim().isLength({ min: 1, max: 100 }),
  body('customer.company').optional({ checkFalsy: true }).isString().trim().isLength({ max: 200 }),
  body('customer.country').isString().trim().isLength({ min: 2, max: 2 }).isAlpha(),
  body('paymentMethod').isIn(['revolut', 'paypal']),
  body('timestamp').optional().isISO8601(),
];

router.get('/readiness', intakeLimiter, async (_req: Request, res: Response) => {
  const ready = await isProductOrderSchemaReady();
  return res.status(ready ? 200 : 503).json({
    status: ready ? 'ready' : 'unavailable',
  });
});

router.post(
  '/notify',
  intakeLimiter,
  requireProductOrderSchema,
  notifyValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation Error', details: errors.array() });
    }

    const orderId = req.body.orderId as string;
    const productId = req.body.product.id as string;
    const paymentProvider = req.body.paymentMethod as PaymentProvider;

    try {
      const { intent: createdIntent } = await createProductOrderIntent({
        idempotencyKey: req.get('idempotency-key') || `notify:${orderId}`,
        productId,
        buyerEmail: req.body.customer.email as string,
        buyerName: `${req.body.customer.firstName as string} ${req.body.customer.lastName as string}`,
        buyerCompany: req.body.customer.company as string | undefined,
        buyerCountry: (req.body.customer.country as string).toUpperCase(),
        paymentProvider,
        metadata: {
          client_order_id: orderId,
          client_timestamp: req.body.timestamp || null,
          source: 'dws10_checkout_notify',
        },
      });

      const intent = await queuePendingExternalPaymentReview(
        createdIntent.id,
        createdIntent.checkout_reference || orderId,
      );

      return res.status(createdIntent.created ? 201 : 200).json({
        order_intent_id: intent.id,
        product_id: intent.product_id,
        product_name: intent.product_name,
        amount_cents: intent.unit_amount_cents,
        currency: intent.currency,
        payment_status: intent.payment_status,
        fulfilment_status: intent.fulfilment_status,
        review_notification_status: intent.payment_review_notification_status,
        idempotent_replay: !createdIntent.created,
      });
    } catch (error) {
      if (error instanceof CatalogueProductError) {
        return res.status(error.code === 'UNKNOWN_SKU' ? 404 : 409).json({
          error: error.code,
          message: error.message,
        });
      }
      logger.error('Public order intake failed', { error, productId, orderId });
      return res.status(503).json({
        error: 'ORDER_INTAKE_UNAVAILABLE',
        message: 'The order could not be recorded. Do not continue payment; please retry.',
      });
    }
  },
);

router.post(
  '/:id/confirm-payment',
  confirmationLimiter,
  requireAdminKey,
  requireProductOrderSchema,
  [
    param('id').isUUID(),
    header('x-operator-id').isString().trim().isLength({ min: 3, max: 200 }),
    body('payment_provider').isIn(['revolut', 'paypal']),
    body('transaction_reference')
      .isString()
      .trim()
      .isLength({ min: 3, max: 200 })
      .matches(/^[A-Za-z0-9._:/-]+$/),
    body('amount_cents').isInt({ min: 1, max: 10_000_000_000 }).toInt(),
    body('currency')
      .isString()
      .trim()
      .matches(/^[A-Za-z]{3}$/)
      .customSanitizer((value: string) => value.toUpperCase()),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation Error', details: errors.array() });
    }

    const orderIntentId = req.params.id;
    const paymentProvider = req.body.payment_provider as PaymentProvider;
    const transactionReference = req.body.transaction_reference as string;
    const operatorId = req.get('x-operator-id') as string;

    try {
      const intent = await confirmProductOrderPayment({
        provider: paymentProvider,
        paymentReference: transactionReference,
        orderIntentId,
        amountCents: req.body.amount_cents as number,
        currency: req.body.currency as string,
        auditActor: operatorId,
        verificationMethod: 'admin_manual',
      });
      return res.json({
        order_intent_id: intent.id,
        product_id: intent.product_id,
        payment_status: intent.payment_status,
        fulfilment_status: intent.fulfilment_status,
      });
    } catch (error) {
      if (error instanceof PaymentVerificationError) {
        logger.warn('Manual payment verification rejected', {
          orderIntentId,
          paymentProvider,
          operatorId,
          error: error.message,
        });
        return res
          .status(409)
          .json({ error: 'PAYMENT_VERIFICATION_FAILED', message: error.message });
      }
      logger.error('Manual payment confirmation failed', {
        orderIntentId,
        paymentProvider,
        operatorId,
        error,
      });
      return res.status(503).json({ error: 'PAYMENT_CONFIRMATION_UNAVAILABLE' });
    }
  },
);

export default router;
