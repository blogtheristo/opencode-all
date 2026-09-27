// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/__tests__/product-catalog.service.test.ts
import { describe, expect, it } from 'vitest';
import {
  getPayableCatalogueProduct,
  parseCatalogueProducts,
} from '../services/product-catalog.service.js';

describe('canonical product catalogue parsing', () => {
  it('parses the canonical products object including BLUE products', () => {
    const products = parseCatalogueProducts({
      products: {
        'BLUE-SKU': {
          id: 'BLUE-SKU',
          name: 'Blue pilot',
          price: 99,
          currency: 'EUR',
          deploymentColor: 'blue',
        },
      },
    });

    expect(products['BLUE-SKU']).toMatchObject({
      id: 'BLUE-SKU',
      price: 99,
      deploymentColor: 'blue',
    });
  });

  it('rejects the obsolete data-array shape', () => {
    expect(() => parseCatalogueProducts({ data: [] })).toThrow(/products object/);
  });

  it('allows BLUE products but rejects archived products', async () => {
    await expect(getPayableCatalogueProduct('CMP-T0')).resolves.toMatchObject({
      id: 'CMP-T0',
      deploymentColor: 'blue',
    });
    await expect(getPayableCatalogueProduct('professional-web-pages')).rejects.toMatchObject({
      code: 'ARCHIVED_SKU',
    });
  });

  it('keeps a valid neighbour when another catalogue row is malformed', () => {
    const products = parseCatalogueProducts({
      products: {
        BROKEN: { id: 'BROKEN', name: '', price: 'not-a-number', currency: 'EUR' },
        VALID: {
          id: 'VALID',
          name: 'Valid product',
          price: 25,
          currency: 'EUR',
          checkoutMode: 'self-serve-fallback',
        },
        FREE: {
          id: 'FREE',
          name: 'Free onboarding',
          price: 0,
          currency: 'EUR',
          checkoutMode: 'onboarding',
        },
      },
    });

    expect(products.BROKEN).toBeUndefined();
    expect(products.VALID).toMatchObject({ price: 25, checkoutMode: 'self-serve-fallback' });
    expect(products.FREE).toMatchObject({ price: 0, checkoutMode: 'onboarding' });
  });

  it('preserves the catalogue amount and checkout mode for the free onboarding SKU', async () => {
    await expect(getPayableCatalogueProduct('DWS-IQ-FREE-2026')).resolves.toMatchObject({
      id: 'DWS-IQ-FREE-2026',
      price: 1,
      checkoutMode: 'self-serve-fallback',
    });
  });
});
