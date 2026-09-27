// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/__tests__/product-catalog-cache.service.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const fsMocks = vi.hoisted(() => ({ readFile: vi.fn(), stat: vi.fn() }));
vi.mock('node:fs/promises', () => fsMocks);

const { loadCanonicalCatalogue } = await import('../services/product-catalog.service.js');

const catalogue = (price: number) =>
  JSON.stringify({
    products: {
      'TEST-SKU': { id: 'TEST-SKU', name: 'Test product', price, currency: 'EUR' },
    },
  });

describe('canonical catalogue cache', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reuses parsed data until the catalogue mtime changes', async () => {
    fsMocks.stat
      .mockResolvedValueOnce({ mtimeMs: 1 })
      .mockResolvedValueOnce({ mtimeMs: 1 })
      .mockResolvedValueOnce({ mtimeMs: 2 });
    fsMocks.readFile.mockResolvedValueOnce(catalogue(10)).mockResolvedValueOnce(catalogue(20));

    const first = await loadCanonicalCatalogue();
    const cached = await loadCanonicalCatalogue();
    const refreshed = await loadCanonicalCatalogue();

    expect(first['TEST-SKU']?.price).toBe(10);
    expect(cached).toBe(first);
    expect(refreshed['TEST-SKU']?.price).toBe(20);
    expect(fsMocks.readFile).toHaveBeenCalledTimes(2);
    expect(Object.isFrozen(refreshed)).toBe(true);
    expect(Object.isFrozen(refreshed['TEST-SKU'])).toBe(true);
  });
});
