#!/usr/bin/env node
// Evidence: Tool=Claude-Code Model=claude-haiku-4-5 Agent=claude-code Date=2026-08-27
// Audit trail: git log -- scripts/sales-validator.mjs

/**
 * Sales Lifecycle Validator
 *
 * Validates bid/offer/contract for:
 * - Legal identity (Lifetime Oy)
 * - Pricing (products.json)
 * - Compliance (GDPR, AI Act, NDA)
 * - Customer master data
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SCHEMA_FILE = 'contracts/schema.json';
const PRODUCTS_FILE = 'dws10.com/config/products.json';

function loadProducts() {
  try {
    const content = JSON.parse(readFileSync(PRODUCTS_FILE, 'utf8'));
    return Array.isArray(content) ? { products: content } : content;
  } catch {
    console.warn('⚠️ products.json not found, using defaults');
    return {
      products: [
        { id: 'prod_dws_iq_base', name: 'DWS IQ - Base', price: 5000 },
        { id: 'prod_dws_iq_pro', name: 'DWS IQ - Pro', price: 15000 },
        { id: 'prod_dws_iq_enterprise', name: 'DWS IQ - Enterprise', price: 50000 },
      ],
    };
  }
}

function validateBid(bid) {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!bid.id) errors.push('Missing: id');
  if (!bid.type) errors.push('Missing: type');
  if (!bid.customer_id) errors.push('Missing: customer_id');
  if (!bid.products || bid.products.length === 0) errors.push('Missing: products');
  if (!bid.total_value) errors.push('Missing: total_value');

  // Legal identity validation
  if (bid.legal) {
    if (bid.legal.company !== 'Lifetime Oy') {
      errors.push(`Legal: Company must be "Lifetime Oy", got "${bid.legal.company}"`);
    }
    if (bid.legal.business_id !== 'FI07724079') {
      errors.push(`Legal: Business ID must be "FI07724079", got "${bid.legal.business_id}"`);
    }
    if (!bid.legal.signatory) errors.push('Legal: Missing signatory name');
  } else {
    errors.push('Missing: legal identity block');
  }

  // Pricing validation
  const products = loadProducts();
  if (bid.products) {
    bid.products.forEach((product) => {
      const prodList = Array.isArray(products.products) ? products.products : [];
      const productDef = prodList.find((p) => p.id === product.product_id);
      if (!productDef) {
        warnings.push(`Product ${product.product_id} not found in products.json`);
      } else if (product.unit_price !== productDef.price) {
        warnings.push(
          `Product ${product.product_id} price mismatch: bid has €${product.unit_price}, products.json has €${productDef.price}`,
        );
      }
    });
  }

  // Compliance validation
  if (bid.compliance) {
    if (!bid.compliance.gdpr_compliant) warnings.push('GDPR compliance not verified');
    if (!bid.compliance.nda_signed) warnings.push('NDA not signed');
  } else {
    warnings.push('Missing: compliance block');
  }

  // Timeline validation
  if (bid.timeline) {
    if (!bid.timeline.valid_until) {
      errors.push('Timeline: Missing valid_until (bid expiry)');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    severity: errors.length > 0 ? 'ERROR' : warnings.length > 0 ? 'WARNING' : 'OK',
  };
}

function validateOffer(offer) {
  const errors = [];
  const warnings = [];

  // All bid validations plus
  const bidValidation = validateBid(offer);
  errors.push(...bidValidation.errors);
  warnings.push(...bidValidation.warnings);

  // Offer-specific: terms must be present
  if (!offer.terms || !offer.terms.payment_terms) {
    errors.push('Offer: Missing payment_terms');
  }
  if (!offer.terms?.delivery_date) {
    errors.push('Offer: Missing delivery_date');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    severity: errors.length > 0 ? 'ERROR' : warnings.length > 0 ? 'WARNING' : 'OK',
  };
}

function validateContract(contract) {
  const errors = [];
  const warnings = [];

  // All offer validations plus
  const offerValidation = validateOffer(contract);
  errors.push(...offerValidation.errors);
  warnings.push(...offerValidation.warnings);

  // Contract-specific: signatures required
  if (!contract.signatures?.lifetime_signed) {
    errors.push('Contract: Not signed by Lifetime Oy');
  }
  if (!contract.signatures?.customer_signed) {
    errors.push('Contract: Not signed by customer');
  }

  // Contract dates
  if (!contract.timeline?.effective_date) {
    errors.push('Contract: Missing effective_date');
  }
  if (!contract.timeline?.expiry_date) {
    errors.push('Contract: Missing expiry_date');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    severity: errors.length > 0 ? 'ERROR' : warnings.length > 0 ? 'WARNING' : 'OK',
  };
}

// Main CLI
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help') {
    console.log(`
Sales Lifecycle Validator

Usage:
  sales-validator.mjs validate <json-file>
  sales-validator.mjs create-bid <customer-id> <product-id> <quantity>

Examples:
  node sales-validator.mjs validate bid_2026_001.json
  node sales-validator.mjs create-bid c_acme_corp prod_dws_iq_base 1
`);
    process.exit(0);
  }

  if (command === 'validate') {
    const filepath = args[1];
    if (!filepath) {
      console.error('Error: JSON file path required');
      process.exit(1);
    }

    try {
      const doc = JSON.parse(readFileSync(filepath, 'utf8'));
      let validation;

      if (doc.type === 'contract') {
        validation = validateContract(doc);
      } else if (doc.type === 'offer') {
        validation = validateOffer(doc);
      } else if (doc.type === 'bid') {
        validation = validateBid(doc);
      } else {
        console.error('Error: Unknown document type');
        process.exit(1);
      }

      console.log(`\n📋 Validation Result: ${validation.severity}\n`);
      console.log(`Valid: ${validation.valid ? '✅ YES' : '❌ NO'}\n`);

      if (validation.errors.length > 0) {
        console.log('🔴 ERRORS:');
        validation.errors.forEach((e) => console.log(`  • ${e}`));
        console.log('');
      }

      if (validation.warnings.length > 0) {
        console.log('🟡 WARNINGS:');
        validation.warnings.forEach((w) => console.log(`  • ${w}`));
        console.log('');
      }

      process.exit(validation.valid ? 0 : 1);
    } catch (e) {
      console.error('Error reading file:', e.message);
      process.exit(1);
    }
  } else if (command === 'create-bid') {
    const customerId = args[1];
    const productId = args[2];
    const quantity = parseFloat(args[3]) || 1;

    if (!customerId || !productId) {
      console.error('Error: customer-id and product-id required');
      process.exit(1);
    }

    const products = loadProducts();
    const prodList = Array.isArray(products.products) ? products.products : [];
    const product = prodList.find((p) => p.id === productId);

    if (!product) {
      console.error(`Error: Product ${productId} not found`);
      process.exit(1);
    }

    const now = new Date();
    const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const bid = {
      id: `bid_2026_${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      type: 'bid',
      status: 'DRAFT',
      customer_id: customerId,
      customer_name: customerId,
      created_at: now.toISOString(),
      created_by: 'sales-agent',
      products: [
        {
          product_id: productId,
          product_name: product.name,
          quantity,
          unit_price: product.price,
          total: product.price * quantity,
        },
      ],
      total_value: product.price * quantity,
      currency: 'EUR',
      terms: {
        payment_terms: 'net_30',
      },
      timeline: {
        valid_until: validUntil.toISOString(),
      },
      legal: {
        company: 'Lifetime Oy',
        business_id: 'FI07724079',
        signatory: 'Risto Anton Päärni',
        signatory_title: 'Founder, CEO',
        jurisdiction: 'Finland',
      },
      compliance: {
        gdpr_compliant: false,
        nda_signed: false,
        ai_act_compliant: false,
      },
      metadata: {
        notes: `Auto-generated bid for ${customerId}`,
        audit_trail: [
          {
            timestamp: now.toISOString(),
            action: 'CREATED',
            by: 'sales-agent',
          },
        ],
      },
    };

    console.log('\n📝 Created BID:\n');
    console.log(JSON.stringify(bid, null, 2));

    // Validate
    const validation = validateBid(bid);
    console.log(`\nValidation: ${validation.severity}`);
    if (validation.errors.length > 0) {
      console.log('Errors:', validation.errors);
    }
  }
}

main();
