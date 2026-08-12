#!/usr/bin/env node

/**
 * Fix Google Product Categories to Use Numeric IDs
 *
 * Google Merchant Center requires numeric category IDs from their official taxonomy.
 * Text paths like "Software > Business & Productivity Software" are invalid.
 *
 * Mapping:
 * - Software/SaaS products → 1505 (Software)
 * - Professional Services → 1426 (Professional Services)
 * - Computer Hardware → 2682 (Computers)
 *
 * Run with: node scripts/fix-google-categories-numeric.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, '..', 'dws10.com', 'config', 'products.json');

// Google Merchant Center numeric category IDs
const GOOGLE_CATEGORIES = {
  // Software/SaaS products
  SOFTWARE: '1505', // Software
  // Professional Services
  PROFESSIONAL_SERVICES: '1426',
  // Hardware
  COMPUTERS: '2682', // Computers
};

// Product-to-category mapping based on type and keywords
const CATEGORY_MAP = {
  // Software/SaaS Platform Products
  'DWS-IQ-006': GOOGLE_CATEGORIES.SOFTWARE,
  'FH-OMNI-001': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES, // Managed service
  'FH-AUTO-001': GOOGLE_CATEGORIES.SOFTWARE,
  'LIFETIME-BUNDLE-2026': GOOGLE_CATEGORIES.SOFTWARE,
  'FH-RPT-001': GOOGLE_CATEGORIES.SOFTWARE,
  'FH-SIGN-001': GOOGLE_CATEGORIES.SOFTWARE,
  'FH-CMS-001': GOOGLE_CATEGORIES.SOFTWARE,
  'expert-services': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'consulting-hourly': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'LIFETIME-EXP-001': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'consulting-fit55': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'aws-consultancy': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'conversational-agent': GOOGLE_CATEGORIES.SOFTWARE,
  'm365-consultancy': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'ai-agent-engineering': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'lean-project': GOOGLE_CATEGORIES.SOFTWARE,
  'ai-consultant-day': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'business-mentor-30': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'firehorse-coach': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'firehorse-flow': GOOGLE_CATEGORIES.SOFTWARE,
  'professional-web-pages': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'secure-email-proton': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'firehorse-data-services': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'devops-lead': GOOGLE_CATEGORIES.SOFTWARE,
  'digital-design-gold': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'cloud-ready-teams': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'ai-koulutus-3d': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'ai-consulting-agentic': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'edge-node-gn100': GOOGLE_CATEGORIES.COMPUTERS,
  'DWS-SOVEREIGN-DB-001': GOOGLE_CATEGORIES.SOFTWARE,
  'sovereignty-cloud-consulting': GOOGLE_CATEGORIES.PROFESSIONAL_SERVICES,
  'DWS-US-STARTER': GOOGLE_CATEGORIES.SOFTWARE,
  'DWS-US-PILOT': GOOGLE_CATEGORIES.SOFTWARE,
  'DWS-EU-STARTER': GOOGLE_CATEGORIES.SOFTWARE,
  'DWS-EU-PILOT': GOOGLE_CATEGORIES.SOFTWARE,
  'DWS-CLIMATE-001': GOOGLE_CATEGORIES.SOFTWARE,
  'DWS-AEGIS-001': GOOGLE_CATEGORIES.SOFTWARE,
  'DWS-THEMIS-001': GOOGLE_CATEGORIES.SOFTWARE,
};

function getCategoryForProduct(productId) {
  return CATEGORY_MAP[productId] || GOOGLE_CATEGORIES.SOFTWARE;
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
  const updates = [];

  for (const [id, product] of Object.entries(config.products)) {
    if (!product.google) {
      product.google = {};
    }

    const newCategory = getCategoryForProduct(id);
    const oldCategory = product.google.productCategory;

    if (oldCategory !== newCategory) {
      product.google.productCategory = newCategory;
      updates.push({
        id,
        name: product.name,
        old: oldCategory,
        new: newCategory,
      });
      fixed++;
    }
  }

  return { fixed, updates };
}

try {
  console.log('Loading product configuration...\n');
  const config = loadConfig();

  console.log(`Found ${Object.keys(config.products).length} products\n`);
  console.log('Mapping product categories to Google numeric IDs...\n');

  const { fixed, updates } = fixCategories(config);

  if (updates.length > 0) {
    console.log('Updated categories:');
    for (const update of updates) {
      console.log(`✓ ${update.id}`);
      console.log(`  ${update.name}`);
      console.log(`  ${update.old} → ${update.new}`);
    }
  } else {
    console.log('✓ All categories already use numeric IDs');
  }

  console.log(`\nSaving configuration...`);
  saveConfig(config);

  console.log(`\n✅ Fix complete!`);
  console.log(`   Categories updated: ${fixed}`);
  console.log(`   Config saved: ${CONFIG_PATH}`);
  console.log(`\nNext step: Regenerate feed with:`);
  console.log(`   node dws10.com/feeds/generate-feed.cjs`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
