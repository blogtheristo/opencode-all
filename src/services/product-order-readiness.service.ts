// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/services/product-order-readiness.service.ts
import logger from '../utils/logger.js';
import { supabase } from './supabase.service.js';

const READY_CACHE_MS = 60_000;
let readyUntil = 0;

export async function isProductOrderSchemaReady(): Promise<boolean> {
  if (Date.now() < readyUntil) return true;

  try {
    const { data, error } = await supabase.rpc('product_order_schema_preflight');
    if (error || data !== true) {
      logger.error('Product order schema preflight failed; checkout remains disabled', {
        migration: '099_270926_product_order_fulfilment.sql',
        error: error?.message || 'required schema objects are missing',
      });
      return false;
    }

    readyUntil = Date.now() + READY_CACHE_MS;
    return true;
  } catch (error) {
    logger.error('Product order schema preflight could not reach the database', {
      migration: '099_270926_product_order_fulfilment.sql',
      error,
    });
    return false;
  }
}
