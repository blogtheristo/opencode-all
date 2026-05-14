/**
 * DWS IQ 6 - Trade & Import Integration
 *
 * Module for managing international trade products, EU compliance,
 * carbon tracking, and import shipments.
 */

export * from './types';
export {
  PHILIPPINE_PRODUCTS,
  getProductsByCategory,
  getCarbonNegativeProducts,
  calculateGSPSavings,
  getCatalogSummary,
} from './philippine-products';
