// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/services/product-catalog.service.ts
import { readFile, stat } from 'node:fs/promises';
import logger from '../utils/logger.js';

export interface CatalogueProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  archived?: boolean;
  productType?: string;
  deploymentColor?: string;
  revolutLink?: string;
  paypalPlanId?: string | null;
  checkoutMode?: string;
}

interface CatalogueDocument {
  products: Record<string, unknown>;
}

const CATALOGUE_URL = new URL('../../dws10.com/config/products.json', import.meta.url);
let cachedCatalogue: { mtimeMs: number; products: Record<string, CatalogueProduct> } | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseCatalogueProducts(raw: unknown): Record<string, CatalogueProduct> {
  if (!isRecord(raw) || !isRecord(raw.products)) {
    throw new Error('Canonical product catalogue must contain a products object');
  }

  const catalogue: Record<string, CatalogueProduct> = {};
  for (const [sku, value] of Object.entries(raw.products)) {
    if (!isRecord(value)) {
      logger.warn('Skipping malformed catalogue product', {
        productId: sku,
        reason: 'not an object',
      });
      continue;
    }

    const id = typeof value.id === 'string' ? value.id : sku;
    const name = typeof value.name === 'string' ? value.name.trim() : '';
    const price = value.price;
    const currency = typeof value.currency === 'string' ? value.currency.toUpperCase() : '';

    if (
      !id ||
      id !== sku ||
      !name ||
      typeof price !== 'number' ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isSafeInteger(Math.round(price * 100)) ||
      !/^[A-Z]{3}$/.test(currency)
    ) {
      logger.warn('Skipping malformed catalogue product', { productId: sku });
      continue;
    }

    catalogue[sku] = Object.freeze({
      id,
      name,
      price,
      currency,
      archived: value.archived === true,
      productType: typeof value.productType === 'string' ? value.productType : undefined,
      deploymentColor:
        typeof value.deploymentColor === 'string' ? value.deploymentColor : undefined,
      revolutLink: typeof value.revolutLink === 'string' ? value.revolutLink : undefined,
      paypalPlanId:
        typeof value.paypalPlanId === 'string' || value.paypalPlanId === null
          ? value.paypalPlanId
          : undefined,
      checkoutMode: typeof value.checkoutMode === 'string' ? value.checkoutMode : undefined,
    });
  }

  return Object.freeze(catalogue);
}

export async function loadCanonicalCatalogue(): Promise<Record<string, CatalogueProduct>> {
  const fileStat = await stat(CATALOGUE_URL);
  if (cachedCatalogue?.mtimeMs === fileStat.mtimeMs) return cachedCatalogue.products;

  const content = await readFile(CATALOGUE_URL, 'utf8');
  const products = parseCatalogueProducts(JSON.parse(content) as CatalogueDocument);
  cachedCatalogue = { mtimeMs: fileStat.mtimeMs, products };
  return products;
}

export async function getPayableCatalogueProduct(productId: string): Promise<CatalogueProduct> {
  const catalogue = await loadCanonicalCatalogue();
  const product = catalogue[productId];

  if (!product) {
    throw new CatalogueProductError('UNKNOWN_SKU', `Unknown product SKU: ${productId}`);
  }
  if (product.archived || product.productType === 'archived') {
    throw new CatalogueProductError('ARCHIVED_SKU', `Product SKU is archived: ${productId}`);
  }
  if (product.price === 0) {
    throw new CatalogueProductError(
      'NO_PAYMENT_REQUIRED',
      `Product SKU does not require payment; follow its ${product.checkoutMode || 'onboarding'} flow: ${productId}`,
    );
  }

  return product;
}

export class CatalogueProductError extends Error {
  constructor(
    public readonly code: 'UNKNOWN_SKU' | 'ARCHIVED_SKU' | 'NO_PAYMENT_REQUIRED',
    message: string,
  ) {
    super(message);
    this.name = 'CatalogueProductError';
  }
}
