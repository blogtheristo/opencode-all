// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/middleware/product-order-readiness.middleware.ts
import { type NextFunction, type Request, type Response } from 'express';
import { isProductOrderSchemaReady } from '../services/product-order-readiness.service.js';

export async function requireProductOrderSchema(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (await isProductOrderSchemaReady()) {
    next();
    return;
  }

  res.status(503).json({
    error: 'PRODUCT_ORDER_SCHEMA_NOT_READY',
    message: 'Checkout is temporarily unavailable. No payment has been started.',
  });
}
