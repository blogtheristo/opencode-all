// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/__tests__/product-order-readiness.service.test.ts
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('../services/supabase.service.js', () => ({ supabase: { rpc: mocks.rpc } }));

const { isProductOrderSchemaReady } =
  await import('../services/product-order-readiness.service.js');

describe('product order schema readiness', () => {
  it('fails closed, retries, then caches a successful preflight', async () => {
    mocks.rpc
      .mockResolvedValueOnce({ data: null, error: { message: 'function does not exist' } })
      .mockResolvedValueOnce({ data: true, error: null });

    await expect(isProductOrderSchemaReady()).resolves.toBe(false);
    await expect(isProductOrderSchemaReady()).resolves.toBe(true);
    await expect(isProductOrderSchemaReady()).resolves.toBe(true);

    expect(mocks.rpc).toHaveBeenCalledTimes(2);
    expect(mocks.rpc).toHaveBeenCalledWith('product_order_schema_preflight');
  });
});
