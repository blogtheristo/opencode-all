/**
 * Smart Factory — product catalog normalization.
 *
 * Accepts a customer catalog of ANY size in three shapes:
 *   1. array of products: [{ id, name, description?, features? }]
 *   2. object with products array: { products: [...] }
 *   3. DWS store map format: { products: { "<SKU>": {...} } } (dws10.com/config/products.json)
 *
 * Normalizes each entry into matchable dimensions (keywords, industries,
 * regulations) used by match.ts to pair products with prospects.
 */

import { readFileSync } from 'node:fs';
import logger from '../utils/logger.js';
import type { CatalogProduct, NormalizedProduct } from './types.js';

const DEFAULT_CATALOG_PATH = 'dws10.com/config/products.json';

/** Domain dictionaries — regulation and industry detection from product text. */
const REGULATION_TERMS = [
  'csrd', 'cbam', 'ets', 'epbd', 'fit for 55', 'eu taxonomy', 'nis2', 'gdpr',
  'eu ai act', 'sbti', 'glec', 'fuelEU', 'deforestation', 'eudr',
];

const INDUSTRY_TERMS: Record<string, string[]> = {
  steel: ['steel', 'metals', 'foundry', 'outokumpu-style', 'ssab'],
  construction: ['construction', 'building', 'bim', 'contractor', 'renovation'],
  cement: ['cement', 'concrete', 'clinker'],
  manufacturing: ['manufacturing', 'factory', 'production line', 'industrial'],
  energy: ['energy', 'power plant', 'renewable', 'bess', 'battery storage', 'grid'],
  logistics: ['logistics', 'fleet', 'freight', 'supply chain', 'transport'],
  forestry: ['forest', 'pulp', 'paper', 'sawn timber', 'wood'],
  datacentres: ['data centre', 'data center', 'datacentre', 'server hall'],
  compliance: ['compliance', 'regulatory', 'reporting', 'audit', 'esg', 'carbon'],
};

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'our', 'into',
  'are', 'you', 'can', 'will', 'all', 'any', 'not', 'but', 'has', 'have',
  'its', 'it’s', 'per', 'via', 'use', 'using', 'used', 'one', 'two', 'new',
  'more', 'than', 'also', 'who', 'what', 'when', 'how', 'why', 'a', 'an', 'in',
  'on', 'of', 'to', 'is', 'be', 'as', 'at', 'by', 'or', 'we', 'no', 'yes',
]);

/** Minimum token length to count as a keyword. */
const MIN_KEYWORD_LEN = 3;

export function tokenize(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9äöüåéèáíóúñ+ ]+/gi, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= MIN_KEYWORD_LEN && !STOPWORDS.has(t));
}

function detectRegulations(text: string): string[] {
  const lower = (text || '').toLowerCase();
  return REGULATION_TERMS.filter((r) => lower.includes(r)).map((r) => r.toUpperCase());
}

function detectIndustries(text: string): string[] {
  const lower = ` ${(text || '').toLowerCase()} `;
  return Object.entries(INDUSTRY_TERMS)
    .filter(([, terms]) => terms.some((t) => lower.includes(t)))
    .map(([industry]) => industry);
}

/**
 * Coerce any supported catalog shape into a flat product array.
 * Throws on an unusable shape (Rule 12 — fail loud).
 */
export function parseCatalog(raw: unknown): CatalogProduct[] {
  if (Array.isArray(raw)) return raw as CatalogProduct[];
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.products)) return obj.products as CatalogProduct[];
    if (obj.products && typeof obj.products === 'object') {
      // DWS store map format: SKU → product
      return Object.entries(obj.products as Record<string, unknown>).map(([sku, p]) => {
        const prod = p as Record<string, unknown>;
        return { id: (prod.id as string) || sku, ...prod } as CatalogProduct;
      });
    }
  }
  throw new Error('Unsupported catalog format — expected array or { products: [...] | { sku: {...} } }');
}

export function normalizeProduct(p: CatalogProduct): NormalizedProduct {
  const searchText = [p.name, p.description, ...(p.features || [])].filter(Boolean).join(' ');
  const keywords = Array.from(new Set(tokenize(searchText)));
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    features: p.features,
    price: p.price,
    currency: p.currency,
    keywords,
    industries: detectIndustries(searchText),
    regulations: detectRegulations(searchText),
  };
}

/** Normalize a full catalog; skips entries without id or name (logged, not fatal). */
export function normalizeCatalog(raw: unknown): NormalizedProduct[] {
  const products = parseCatalog(raw);
  const out: NormalizedProduct[] = [];
  for (const p of products) {
    if (!p || typeof p !== 'object' || !p.id || !p.name) {
      logger.warn('smart-factory catalog: skipping product without id/name');
      continue;
    }
    out.push(normalizeProduct(p));
  }
  return out;
}

/** Load the default DWS catalog from disk (used when no campaign catalog is supplied). */
export function loadDefaultCatalog(path?: string): NormalizedProduct[] {
  const file = path || process.env.SMART_FACTORY_CATALOG_PATH || DEFAULT_CATALOG_PATH;
  try {
    const raw = JSON.parse(readFileSync(file, 'utf-8'));
    const normalized = normalizeCatalog(raw);
    logger.info('smart-factory catalog loaded', { file, count: normalized.length });
    return normalized;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to load catalog at ${file}: ${msg}`, { cause: err });
  }
}
