#!/usr/bin/env node
/*
  sovereignty-pillars-assess
  --------------------------
  Deterministic scorer for the three-pillar (Data / Technology / Operational)
  x three-jurisdiction (EU / US / SG) sovereignty model from
  docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md.

  Mirrors the rubric in .claude/commands/sovereignty-pillars-assess.md.

  Usage:
    node scripts/sovereignty-pillars-assess.cjs <input.json>
    node scripts/sovereignty-pillars-assess.cjs --stdin < arch.json

  Output: JSON to stdout matching the output contract in the skill file.
*/

'use strict';

const fs = require('node:fs');

const EU_SOVEREIGN_CLOUDS = new Set(['ovh', 'scaleway', 'hetzner', 'aiven', 'on-prem']);
const US_HOMED_CLOUDS = new Set(['aws', 'azure', 'gcp']);
const SG_FRIENDLY_CLOUDS = new Set(['aws', 'azure', 'gcp', 'on-prem', 'hybrid']);

const EU_DB_VENDORS = new Set(['supabase-eu', 'aiven-eu', 'hetzner-pg', 'ovh-pg', 'scaleway-pg']);
const US_DB_VENDORS = new Set(['aws-rds', 'gcp-cloudsql', 'azure-flex', 'supabase-us']);
const SG_DB_VENDORS = new Set(['aws-rds', 'gcp-cloudsql', 'azure-flex']);

const PQC_ALGORITHMS = new Set(['FIPS-203', 'FIPS-204', 'FIPS-205']);

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreSIB(arch, jurisdiction) {
  const d = arch.data_layer || {};
  let score = 0;

  // Residency match (30)
  if (d.residency === jurisdiction) score += 30;
  else if (d.residency === 'mixed') score += 12;

  // Third-country access path (25)
  if (d.third_country_access_path === 'none') score += 25;
  else if (d.third_country_access_path === 'possible') score += 8;

  // Key custody (20)
  if (d.key_custody === 'customer-hsm') score += 20;
  else if (d.key_custody === 'cloud-kms') score += 8;

  // Encryption posture (15)
  if (d.encryption_at_rest === true) score += 8;
  if (d.encryption_in_transit === true) score += 7;

  // DB vendor jurisdictional anchor (10)
  const vendor = d.db_vendor || '';
  const vendorSet =
    jurisdiction === 'EU' ? EU_DB_VENDORS : jurisdiction === 'US' ? US_DB_VENDORS : SG_DB_VENDORS;
  if (vendorSet.has(vendor)) score += 10;

  return clamp(score);
}

function scoreCSB(arch, jurisdiction) {
  const c = arch.compute_layer || {};
  const p = arch.pqc_posture || {};
  let score = 0;

  // Portability index (35)
  const portability = typeof c.portability_index === 'number' ? c.portability_index : 0;
  score += Math.round((portability / 100) * 35);

  // On-prem fraction (20)
  const onPrem = typeof c.on_prem_fraction === 'number' ? c.on_prem_fraction : 0;
  if (onPrem >= 0.3) score += 20;
  else score += Math.round((onPrem / 0.3) * 20);

  // Sovereign cloud share (25) - per jurisdiction
  const cloud = (c.primary_cloud || '').toLowerCase();
  if (jurisdiction === 'EU' && EU_SOVEREIGN_CLOUDS.has(cloud)) score += 25;
  else if (jurisdiction === 'US' && US_HOMED_CLOUDS.has(cloud)) score += 25;
  else if (jurisdiction === 'SG' && SG_FRIENDLY_CLOUDS.has(cloud)) score += 18;
  else if (cloud === 'hybrid') score += 12;

  // GPU substrate diversity (10)
  const gpu = (c.gpu_substrate || 'none').toLowerCase();
  if (gpu === 'none') score += 5;
  else if (gpu !== 'nvidia-h100') score += 10;

  // PQC algorithm in use (10)
  const algos = Array.isArray(p.algorithms_in_use) ? p.algorithms_in_use : [];
  if (algos.some((a) => PQC_ALGORITHMS.has(a))) score += 10;

  return clamp(score);
}

function scoreEAB(arch, jurisdiction) {
  const id = arch.identity_layer || {};
  const p = arch.pqc_posture || {};
  const d = arch.data_layer || {};
  const c = arch.compute_layer || {};
  let score = 0;

  // Identity spine (25)
  const hasIDV = id.idv_provider && id.idv_provider !== 'none';
  const hasIdP = id.idp && id.idp !== 'none';
  if (hasIDV && hasIdP) score += 25;
  else if (hasIDV || hasIdP) score += 12;

  // MFA strength (15)
  const mfa = (id.mfa || 'none').toLowerCase();
  if (mfa === 'passkeys') score += 15;
  else if (mfa === 'totp') score += 9;
  else if (mfa === 'sms') score += 4;

  // Crypto-agility (25)
  const migration = (p.migration_plan_status || 'not-started').toLowerCase();
  if (migration === 'complete') score += 25;
  else if (migration === 'in-flight') score += 18;
  else if (migration === 'drafted') score += 10;

  // Failover jurisdiction proxy (15) - data residency != compute residency by intent
  if (d.residency && c.residency && d.residency !== c.residency && d.residency !== 'unknown') {
    score += 15;
  } else if (d.residency === 'mixed' || c.residency === 'mixed') {
    score += 8;
  }

  // R-Sac stage progress (20)
  const stage = typeof p.rsac2_stage === 'number' ? p.rsac2_stage : 0;
  if (stage >= 3) score += 20;
  else score += Math.round((stage / 3) * 20);

  // Per-jurisdiction tilt: SG-origin gets +5 for hybrid (neutrality bonus)
  if (jurisdiction === 'SG' && (c.primary_cloud || '').toLowerCase() === 'hybrid') {
    score += 5;
  }

  return clamp(score);
}

function recommendTier(arch, scores) {
  const origin = arch.customer_origin;
  const primary = (arch.markets && arch.markets[0]) || origin;
  const sibEU = scores.EU.SIB;

  if (origin === 'EU' && primary === 'EU' && sibEU >= 80) return 'Aegis';
  if (primary === 'EU') return 'Sovereign Infra';
  return 'Connect';
}

function quantumReadiness(arch) {
  const p = arch.pqc_posture || {};
  const algos = Array.isArray(p.algorithms_in_use) ? p.algorithms_in_use : [];
  const hasPQC = algos.some((a) => PQC_ALGORITHMS.has(a));
  const migration = (p.migration_plan_status || 'not-started').toLowerCase();

  if (hasPQC && migration === 'complete') return 'ready';
  if (migration === 'drafted' || migration === 'in-flight' || (p.rsac2_stage || 0) >= 1) {
    return 'roadmap';
  }
  return 'not-started';
}

function rsac2Referral(arch, readiness) {
  if (readiness === 'ready') return false;
  const primary = (arch.markets && arch.markets[0]) || arch.customer_origin;
  return arch.customer_origin === 'EU' || primary === 'EU';
}

function nextStep(scores, jurisdiction) {
  const j = scores[jurisdiction];
  const min = Math.min(j.SIB, j.CSB, j.EAB);
  if (min === j.SIB) return `SIB(${jurisdiction}): close residency / key-custody gap to lift Data pillar to >= 80`;
  if (min === j.CSB) return `CSB(${jurisdiction}): raise portability index or switch to sovereign cloud to lift Technology pillar`;
  return `EAB(${jurisdiction}): advance R-Sac stage or land passkey MFA to lift Operational pillar`;
}

function rationale(arch, scores, tier, readiness, refer) {
  const origin = arch.customer_origin;
  const primary = (arch.markets && arch.markets[0]) || origin;
  const lines = [];
  lines.push(
    `${origin}-origin customer targeting ${primary} primary. Pillar triple (SIB/CSB/EAB) per jurisdiction: ` +
      `EU(${scores.EU.SIB}/${scores.EU.CSB}/${scores.EU.EAB}), ` +
      `US(${scores.US.SIB}/${scores.US.CSB}/${scores.US.EAB}), ` +
      `SG(${scores.SG.SIB}/${scores.SG.CSB}/${scores.SG.EAB}).`,
  );
  lines.push(`Recommended DWS tier: ${tier}.`);
  lines.push(`Quantum readiness: ${readiness}.`);
  if (refer) {
    lines.push(
      'Rightful Oy R-Sac referral recommended (EU-origin or EU-primary, not yet quantum-ready).',
    );
  }
  return lines.join(' ');
}

function assess(arch) {
  const jurisdictions = ['EU', 'US', 'SG'];
  const scores = {};
  for (const j of jurisdictions) {
    scores[j] = {
      SIB: scoreSIB(arch, j),
      CSB: scoreCSB(arch, j),
      EAB: scoreEAB(arch, j),
    };
  }

  const tier = recommendTier(arch, scores);
  const readiness = quantumReadiness(arch);
  const refer = rsac2Referral(arch, readiness);
  const primary = (arch.markets && arch.markets[0]) || arch.customer_origin;
  const step = nextStep(scores, primary);

  return {
    scores,
    overall_tier_recommendation: tier,
    next_step_attestation: step,
    quantum_readiness: readiness,
    rsac2_referral_recommended: refer,
    rationale: rationale(arch, scores, tier, readiness, refer),
  };
}

function readStdinSync() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function main() {
  const args = process.argv.slice(2);
  let raw = '';

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    process.stderr.write(
      'Usage: node scripts/sovereignty-pillars-assess.cjs <input.json>\n' +
        '       node scripts/sovereignty-pillars-assess.cjs --stdin < arch.json\n',
    );
    process.exit(args.length === 0 ? 1 : 0);
  }

  if (args[0] === '--stdin') {
    raw = readStdinSync();
  } else {
    try {
      raw = fs.readFileSync(args[0], 'utf8');
    } catch (e) {
      process.stderr.write(`Cannot read ${args[0]}: ${e.message}\n`);
      process.exit(1);
    }
  }

  let arch;
  try {
    arch = JSON.parse(raw);
  } catch (e) {
    process.stderr.write(`Invalid JSON: ${e.message}\n`);
    process.exit(1);
  }

  const result = assess(arch);
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

if (require.main === module) {
  main();
}

module.exports = { assess, scoreSIB, scoreCSB, scoreEAB, recommendTier, quantumReadiness };
