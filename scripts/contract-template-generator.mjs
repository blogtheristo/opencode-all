#!/usr/bin/env node
// Evidence: Tool=Claude-Code Model=claude-sonnet-4-6 Agent=claude-code Date=2026-08-29
// Audit trail: git log -- scripts/contract-template-generator.mjs

/**
 * Contract Template Generator
 *
 * Promotes an ACCEPTED offer to a signed contract document.
 * Input:  path to an offer JSON file in contracts/offers/
 * Output: contract JSON written to contracts/contracts/contract_YYYY_NNN.json
 *
 * Usage:
 *   node scripts/contract-template-generator.mjs contracts/offers/offer_2026_ork_001.json
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const CONTRACTS_DIR = 'contracts/contracts';
const OFFERS_DIR = 'contracts/offers';

function nextContractId() {
  const year = new Date().getFullYear();
  let max = 0;
  try {
    readdirSync(CONTRACTS_DIR).forEach((f) => {
      const m = f.match(/contract_\d{4}_(\d{3})\.json$/);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
  } catch {
    // directory may not exist yet
  }
  return `contract_${year}_${String(max + 1).padStart(3, '0')}`;
}

function promoteOffer(offerPath) {
  const offer = JSON.parse(readFileSync(offerPath, 'utf8'));

  if (offer.type !== 'offer') {
    console.error(`ERROR: File is type "${offer.type}", expected "offer".`);
    process.exit(1);
  }
  if (offer.status !== 'ACCEPTED') {
    console.warn(
      `WARNING: Offer status is "${offer.status}" (expected ACCEPTED). Proceeding anyway.`,
    );
  }

  const contractId = nextContractId();
  const now = new Date().toISOString();

  // Effective date = today; expiry defaults to 12 months out
  const effective = now;
  const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const renewalReminder = new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString();

  const contract = {
    ...offer,
    id: contractId,
    type: 'contract',
    status: 'ACTIVE',
    source_offer_id: offer.id,
    created_at: now,
    created_by: 'contract-template-generator',
    timeline: {
      ...offer.timeline,
      valid_until: null, // contracts don't expire like offers
      effective_date: effective,
      expiry_date: expiry,
      renewal_reminder_date: renewalReminder,
    },
    signatures: {
      customer_signed: false,
      customer_signed_at: null,
      customer_signatory: null,
      lifetime_signed: false,
      lifetime_signed_at: null,
    },
    metadata: {
      ...(offer.metadata ?? {}),
      promoted_from: offer.id,
      promoted_at: now,
      audit_trail: [
        ...(offer.metadata?.audit_trail ?? []),
        {
          timestamp: now,
          action: 'CONTRACT_CREATED',
          by: 'contract-template-generator',
          source: offer.id,
        },
      ],
    },
  };

  mkdirSync(CONTRACTS_DIR, { recursive: true });
  const outPath = join(CONTRACTS_DIR, `${contractId}.json`);
  writeFileSync(outPath, JSON.stringify(contract, null, 2), 'utf8');

  console.log(`Contract created: ${outPath}`);
  console.log(`  ID:             ${contractId}`);
  console.log(`  Effective:      ${effective.slice(0, 10)}`);
  console.log(`  Expires:        ${expiry.slice(0, 10)}`);
  console.log(`  Renewal alert:  ${renewalReminder.slice(0, 10)}`);
  return outPath;
}

// CLI entry
const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node scripts/contract-template-generator.mjs <path-to-offer.json>');
  process.exit(1);
}
promoteOffer(arg);
