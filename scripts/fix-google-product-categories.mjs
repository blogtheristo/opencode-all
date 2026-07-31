#!/usr/bin/env node

/**
 * Fix Google Product Categories for DWS Products
 *
 * Maps products to correct Google Shopping categories based on product type
 * Run with: node scripts/fix-google-product-categories.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, '..', 'dws10.com', 'config', 'products.json');

// Category mapping based on product name/type
const CATEGORY_MAP = {
  // Software Platform & AI Products
  DWS: 'Software > Business & Productivity Software',
  Firehorse: 'Software > Business & Productivity Software',
  Climate: 'Software > Business & Productivity Software',
  Aegis: 'Software > Business & Productivity Software',
  Report: 'Software > Business & Productivity Software',
  Automation: 'Software > Business & Productivity Software',
  Omnichannel: 'Software > Business & Productivity Software',
  'Content Management': 'Software > Business & Productivity Software',

  // Consulting/Advisory (NOT software - should use Services category if available)
  Consulting: 'Professional Services',
  Advisory: 'Professional Services',
  Expert: 'Professional Services',
  Coaching: 'Professional Services',
  Training: 'Professional Services',
  Engineering: 'Professional Services',
};

function getCategoryForProduct(product) {
  const name = product.name || '';
  const id = product.id || '';

  // Check product name and ID for keywords
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (name.includes(keyword) || id.includes(keyword)) {
      return category;
    }
  }

  // Default for unknown products
  return 'Software > Business & Productivity Software';
}

function loadConfig() {
  const data = fs.readFileSync(CONFIG_PATH, 'utf8');
  return JSON.parse(data);
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf8');
}

function fixCategories(config) {
  let fixed = 0;
  let errors = 0;

  for (const [id, product] of Object.entries(config.products)) {
    if (!product.google) {
      product.google = {};
    }

    const newCategory = getCategoryForProduct(product);
    const oldCategory = product.google.productCategory;

    // Update category
    product.google.productCategory = newCategory;

    if (oldCategory !== newCategory) {
      console.log(`✓ ${id}`);
      console.log(`  Name: ${product.name}`);
      console.log(`  Old: ${oldCategory || '(none)'}`);
      console.log(`  New: ${newCategory}`);
      console.log();
      fixed++;
    }
  }

  return fixed;
}

try {
  console.log('Loading product configuration...\n');
  const config = loadConfig();

  console.log(`Found ${Object.keys(config.products).length} products\n`);
  console.log('Fixing Google Product Categories...\n');

  const fixed = fixCategories(config);

  console.log(`Saving configuration...`);
  saveConfig(config);

  console.log(`\n✅ Fix complete!`);
  console.log(`   Products updated: ${fixed}`);
  console.log(`   Config saved: ${CONFIG_PATH}`);
  console.log(`\nNext step: Regenerate feed with:`);
  console.log(`   node dws10.com/feeds/generate-feed.cjs`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
