/**
 * Google Merchant Center — Local Inventory Feed Generator
 *
 * Generates local-inventory.tsv from config/products.json
 * Run: node feeds/generate-local-inventory.cjs
 *
 * Output hosted at: https://dws10.com/feeds/local-inventory.tsv
 * Google Merchant fetches this URL automatically every 24 h.
 *
 * Store: Lifetime Group | Store code: 8496329
 * All DWS products are digital services → availability: on_display_to_order
 * Preorder products keep their preorder status.
 * Archived products (productType: "archived") are excluded.
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'products.json');
const OUTPUT_PATH = path.join(__dirname, 'local-inventory.tsv');
const STORE_CODE = '8496329';

function loadConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function resolveAvailability(product) {
  if (product.google && product.google.availability === 'preorder') return 'preorder';
  return 'on_display_to_order';
}

function shouldIncludeInLocalInventory(product) {
  if (product.productType === 'archived') return false;
  if (product.type === 'monthly' || product.type === 'subscription') return false;
  return true;
}

function generateFeed(config) {
  const header = ['store_code', 'id', 'availability'].join('\t');

  const rows = Object.values(config.products)
    .filter((p) => shouldIncludeInLocalInventory(p))
    .map((p) => [STORE_CODE, p.id, resolveAvailability(p)].join('\t'));

  return [header, ...rows].join('\n') + '\n';
}

try {
  const config = loadConfig();
  const feed = generateFeed(config);
  const lineCount = feed.trim().split('\n').length - 1; // minus header

  fs.writeFileSync(OUTPUT_PATH, feed, 'utf8');

  console.log('✓ local-inventory.tsv generated');
  console.log(`  Products: ${lineCount}`);
  console.log(`  Store code: ${STORE_CODE}`);
  console.log(`  Output: ${OUTPUT_PATH}`);
  console.log('  Feed URL: https://dws10.com/feeds/local-inventory.tsv');
} catch (err) {
  console.error('Error generating local inventory feed:', err);
  process.exit(1);
}
