// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=OpenAI/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/__tests__/product-order-migration.test.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const migration = readFileSync(
  new URL('../../supabase/migrations/099_270926_product_order_fulfilment.sql', import.meta.url),
  'utf8',
);

describe('product order fulfilment migration', () => {
  it('creates durable exact-SKU jobs and a deduplicated event outbox', () => {
    expect(migration).toContain('CREATE TABLE public.product_order_intents');
    expect(migration).toContain('CREATE TABLE public.product_fulfilment_jobs');
    expect(migration).toContain('CREATE TABLE public.product_order_events');
    expect(migration).toContain('CREATE TABLE public.product_payment_verifications');
    expect(migration).toContain('expected_payment_amount_cents bigint NOT NULL');
    expect(migration).toMatch(/UNIQUE \(order_intent_id, event_type\)/);
    expect(migration).toContain("'sales.payment_review_requested'");
    expect(migration).toContain("'sales.purchase'");
    expect(migration).toContain("'sales.fulfilment_requested'");
    expect(migration).toContain(
      "fulfilment_status = CASE WHEN fulfilment_status = 'pending' THEN 'queued'",
    );
  });

  it('keeps writes service-only while granting authenticated users own-row reads', () => {
    expect(migration).toContain('TO authenticated, service_role');
    expect(migration).toContain('ENABLE ROW LEVEL SECURITY');
    expect(migration).toContain('REVOKE INSERT, UPDATE, DELETE, TRUNCATE');
    expect(migration).toContain('REVIEWED, NOT APPLIED');
    expect(migration).toContain('product_payment_verifications_service_role_all');
    expect(migration).toContain('REVOKE ALL ON FUNCTION public.confirm_product_order_payment');
    expect(migration).toContain('p_verified_by text');
    expect(migration).toContain('p_verification_method text');
    expect(migration).toContain(
      'CREATE OR REPLACE FUNCTION public.product_order_schema_preflight()',
    );
    expect(migration).toContain(
      'REVOKE ALL ON FUNCTION public.product_order_schema_preflight() FROM PUBLIC, anon, authenticated',
    );
    expect(migration).toContain(
      'GRANT EXECUTE ON FUNCTION public.product_order_schema_preflight() TO service_role',
    );
  });
});
