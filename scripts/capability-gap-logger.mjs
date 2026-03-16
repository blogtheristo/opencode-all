#!/usr/bin/env node

/**
 * Capability Gap Logger
 *
 * Logs capability gaps discovered during agent sessions.
 *
 * Usage:
 *   node scripts/capability-gap-logger.mjs add --gap "Missing ESLint config" --context "Agent tried to lint but no linter configured" --severity high
 *   node scripts/capability-gap-logger.mjs list
 *   node scripts/capability-gap-logger.mjs report [--json]
 *   node scripts/capability-gap-logger.mjs resolve --id <id> --resolution "Configured ESLint"
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');
const GAPS_DIR = join(REPO_ROOT, 'docs', 'metrics');
const GAPS_FILE = join(GAPS_DIR, 'capability-gaps.json');

const VALID_SEVERITIES = ['critical', 'high', 'medium', 'low'];
const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

function loadGaps() {
  if (!existsSync(GAPS_FILE)) {
    return [];
  }
  try {
    return JSON.parse(readFileSync(GAPS_FILE, 'utf-8'));
  } catch {
    console.error('Error: Could not parse', GAPS_FILE);
    process.exit(1);
  }
}

function saveGaps(gaps) {
  if (!existsSync(GAPS_DIR)) {
    mkdirSync(GAPS_DIR, { recursive: true });
  }
  writeFileSync(GAPS_FILE, JSON.stringify(gaps, null, 2) + '\n', 'utf-8');
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

function cmdAdd(args) {
  if (!args.gap) {
    console.error('Error: --gap is required');
    console.error('Usage: node scripts/capability-gap-logger.mjs add --gap "description" --context "details" --severity high');
    process.exit(1);
  }

  const severity = args.severity || 'medium';
  if (!VALID_SEVERITIES.includes(severity)) {
    console.error(`Error: --severity must be one of: ${VALID_SEVERITIES.join(', ')}`);
    process.exit(1);
  }

  const gaps = loadGaps();
  const entry = {
    id: randomUUID().slice(0, 8),
    gap: args.gap,
    context: args.context || '',
    severity,
    timestamp: new Date().toISOString(),
    status: 'open',
    resolution: null
  };

  gaps.push(entry);
  saveGaps(gaps);
  console.log(`Gap logged: ${entry.id} [${severity}] ${entry.gap}`);
}

function cmdList() {
  const gaps = loadGaps();
  const open = gaps
    .filter(g => g.status === 'open')
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  if (open.length === 0) {
    console.log('No open capability gaps.');
    return;
  }

  console.log(`Open capability gaps (${open.length}):\n`);
  for (const g of open) {
    const sev = g.severity.toUpperCase().padEnd(8);
    console.log(`  [${sev}] ${g.id}  ${g.gap}`);
    if (g.context) {
      console.log(`           Context: ${g.context}`);
    }
    console.log(`           Logged:  ${g.timestamp}`);
    console.log();
  }
}

function cmdReport(args) {
  const gaps = loadGaps();

  if (args.json) {
    console.log(JSON.stringify(gaps, null, 2));
    return;
  }

  if (gaps.length === 0) {
    console.log('No capability gaps recorded.');
    return;
  }

  const open = gaps.filter(g => g.status === 'open');
  const resolved = gaps.filter(g => g.status === 'resolved');

  console.log('=== Capability Gap Report ===\n');
  console.log(`Total: ${gaps.length}  |  Open: ${open.length}  |  Resolved: ${resolved.length}\n`);

  const bySeverity = {};
  for (const s of VALID_SEVERITIES) {
    bySeverity[s] = open.filter(g => g.severity === s).length;
  }
  console.log('Open by severity:');
  for (const s of VALID_SEVERITIES) {
    if (bySeverity[s] > 0) {
      console.log(`  ${s.toUpperCase()}: ${bySeverity[s]}`);
    }
  }
  console.log();

  if (open.length > 0) {
    console.log('--- Open Gaps ---\n');
    for (const g of open.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])) {
      console.log(`  [${g.severity.toUpperCase()}] ${g.id}  ${g.gap}`);
      if (g.context) console.log(`    Context: ${g.context}`);
      console.log(`    Logged: ${g.timestamp}`);
      console.log();
    }
  }

  if (resolved.length > 0) {
    console.log('--- Resolved Gaps ---\n');
    for (const g of resolved) {
      console.log(`  [${g.severity.toUpperCase()}] ${g.id}  ${g.gap}`);
      console.log(`    Resolution: ${g.resolution}`);
      console.log();
    }
  }
}

function cmdResolve(args) {
  if (!args.id) {
    console.error('Error: --id is required');
    console.error('Usage: node scripts/capability-gap-logger.mjs resolve --id <id> --resolution "How it was fixed"');
    process.exit(1);
  }

  if (!args.resolution) {
    console.error('Error: --resolution is required');
    process.exit(1);
  }

  const gaps = loadGaps();
  const gap = gaps.find(g => g.id === args.id);

  if (!gap) {
    console.error(`Error: No gap found with id "${args.id}"`);
    process.exit(1);
  }

  if (gap.status === 'resolved') {
    console.log(`Gap ${args.id} is already resolved.`);
    return;
  }

  gap.status = 'resolved';
  gap.resolution = args.resolution;
  gap.resolvedAt = new Date().toISOString();
  saveGaps(gaps);
  console.log(`Resolved: ${gap.id} — ${gap.gap}`);
  console.log(`Resolution: ${args.resolution}`);
}

// --- Main ---

const [command, ...rest] = process.argv.slice(2);
const args = parseArgs(rest);

switch (command) {
  case 'add':
    cmdAdd(args);
    break;
  case 'list':
    cmdList();
    break;
  case 'report':
    cmdReport(args);
    break;
  case 'resolve':
    cmdResolve(args);
    break;
  default:
    console.log('Capability Gap Logger — tracks gaps discovered during agent sessions\n');
    console.log('Commands:');
    console.log('  add      Log a new gap        --gap <text> --context <text> --severity <level>');
    console.log('  list     Show open gaps sorted by severity');
    console.log('  report   Full report           [--json]');
    console.log('  resolve  Mark gap resolved     --id <id> --resolution <text>');
    console.log('\nSeverity levels: critical, high, medium, low');
    if (!command) process.exit(0);
    console.error(`\nUnknown command: ${command}`);
    process.exit(1);
}
