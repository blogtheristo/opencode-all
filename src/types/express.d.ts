import type Stripe from 'stripe';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        [key: string]: unknown;
      };
      rawBody?: Buffer;
      stripeEvent?: Stripe.Event;
      storeWebhookResult?: (result: unknown) => void;
      correlationId?: string;
      timedout?: boolean;
      webhookEvent?: unknown;
    }
  }
}

export {};
