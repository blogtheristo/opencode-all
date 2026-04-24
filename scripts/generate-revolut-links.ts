#!/usr/bin/env node
/**
 * Generate Revolut Payment Links for Products
 *
 * Iterates through products.json, finds products without revolutLink,
 * creates payment links via Revolut API, and updates products.json.
 *
 * Usage:
 *   npm run ts-node scripts/generate-revolut-links.ts [--dry-run] [--force]
 *
 * Flags:
 *   --dry-run  Show what would be done, don't save
 *   --force    Regenerate ALL product links (not just missing ones)
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  revolutLink?: string | null;
  [key: string]: unknown;
}

interface ProductsCatalog {
  products: Record<string, Product>;
}

const PRODUCTS_FILE = path.join(
  __dirname,
  '..',
  'landing-pages',
  'dws10-com',
  'config',
  'products.json',
);

const REVOLUT_API_URL = process.env.REVOLUT_API_URL || 'https://api.revolut.com/api/1.0';
const REVOLUT_API_KEY = process.env.REVOLUT_SECRET_KEY || process.env.REVOLUT_API_KEY;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const forceRegen = args.includes('--force');

interface RevolutPaymentResponse {
  id: string;
  payment_link: string;
  state: string;
  expires_at: string;
}

async function createPaymentLink(
  amount: number,
  currency: string,
  description: string,
  productId: string,
): Promise<string | null> {
  if (!REVOLUT_API_KEY) {
    console.error('❌ REVOLUT_API_KEY not set in environment variables');
    process.exit(1);
  }

  // Use generic email for store products (not customer-specific)
  const recipientEmail = 'store@dws10.com';

  try {
    const response = await fetch(`${REVOLUT_API_URL}/payment-requests`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REVOLUT_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toUpperCase(),
        recipient: {
          email: recipientEmail,
        },
        description: description,
        reference: productId,
        // Link expires in 365 days (max)
        expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`  API error (${response.status}): ${error}`);
      return null;
    }

    const data = (await response.json()) as RevolutPaymentResponse;
    return data.payment_link;
  } catch (error) {
    console.error(`  Network error: ${error}`);
    return null;
  }
}

async function main() {
  console.log('🔗 Revolut Payment Link Generator\n');

  // Load products
  let catalog: ProductsCatalog;
  try {
    const content = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    catalog = JSON.parse(content);
  } catch (error) {
    console.error(`❌ Failed to load products.json: ${error}`);
    process.exit(1);
  }

  const products = catalog.products;
  const missing: Array<{
    id: string;
    name: string;
    price: number;
  }> = [];
  const existing: Array<{ id: string; name: string }> = [];

  // Identify missing links
  Object.entries(products).forEach(([, product]) => {
    if (forceRegen || !product.revolutLink) {
      missing.push({
        id: product.id,
        name: product.name,
        price: product.price,
      });
    } else {
      existing.push({
        id: product.id,
        name: product.name,
      });
    }
  });

  console.log(`📊 Status:`);
  console.log(`  ✅ With links: ${existing.length}`);
  console.log(`  ❌ Need links: ${missing.length}`);
  console.log(`  📦 Total: ${Object.keys(products).length}\n`);

  if (missing.length === 0) {
    console.log('✨ All products have Revolut links!\n');
    process.exit(0);
  }

  // Skip €0 products and subscriptions
  const toGenerate = missing.filter((p) => {
    if (p.price === 0) {
      console.log(`⏭️  Skipping €0 product: ${p.name}`);
      return false;
    }
    return true;
  });

  if (toGenerate.length === 0) {
    console.log('⏭️  No products to generate (all are €0)\n');
    process.exit(0);
  }

  console.log(`🚀 Generating ${toGenerate.length} payment links...\n`);

  let generated = 0;
  let failed = 0;

  // Generate links
  for (const product of toGenerate) {
    const prod = products[product.id];
    process.stdout.write(`  ${product.name.padEnd(50)} ... `);

    if (dryRun) {
      console.log('(DRY RUN)');
      generated++;
      continue;
    }

    // Add small delay between API calls (100ms)
    await new Promise((resolve) => setTimeout(resolve, 100));

    const link = await createPaymentLink(
      product.price,
      prod.currency,
      prod.description,
      product.id,
    );

    if (link) {
      prod.revolutLink = link;
      console.log('✅');
      generated++;
    } else {
      console.log('❌');
      failed++;
    }
  }

  console.log(`\n📈 Results:`);
  console.log(`  ✅ Generated: ${generated}`);
  console.log(`  ❌ Failed: ${failed}`);

  if (generated > 0 && !dryRun) {
    // Save updated catalog
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(catalog, null, 2), 'utf8');
    console.log(`\n✨ Updated: ${PRODUCTS_FILE}`);
  }

  if (dryRun) {
    console.log('\n(DRY RUN - no changes saved)');
  }

  console.log();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
