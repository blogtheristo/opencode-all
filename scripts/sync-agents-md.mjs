#!/usr/bin/env node
/**
 * sync-agents-md.mjs — AGENTS.md Auto-Syncer
 *
 * Auto-updates specific sections of AGENTS.md from codebase truth.
 * Run: node scripts/sync-agents-md.mjs [--dry-run] [--json]
 *
 * Syncs: tech stack versions, agent list table, workflow count,
 *        file paths, last-updated date.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const AGENTS_MD = join(ROOT, 'AGENTS.md');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const jsonOutput = args.includes('--json');

let content = readFileSync(AGENTS_MD, 'utf-8');
const changes = [];

// --- 1. Sync workflow count ---
function syncWorkflowCount() {
  const workflowDir = join(ROOT, '.github', 'workflows');
  if (!existsSync(workflowDir)) return;

  const count = readdirSync(workflowDir)
    .filter(f => f.endsWith('.yml') || f.endsWith('.yaml')).length;

  // Replace "15 workflows" or "N CI/CD workflows" patterns
  const oldContent = content;
  content = content.replace(
    /(\d+)\s+(CI\/CD\s+)?workflows/gi,
    (match, num) => {
      if (parseInt(num, 10) !== count) {
        return match.replace(num, String(count));
      }
      return match;
    }
  );

  if (content !== oldContent) {
    changes.push({ section: 'workflow-count', detail: `Updated workflow count to ${count}` });
  }
}

// --- 2. Sync agent list in §7 table ---
function syncAgentList() {
  const agentsDir = join(ROOT, 'src', 'agents');
  if (!existsSync(agentsDir)) return;

  const agentFiles = readdirSync(agentsDir)
    .filter(f => f.endsWith('.agent.ts'))
    .map(f => f.replace('.agent.ts', ''))
    .filter(f => !['base', 'types', 'index'].includes(f))
    .sort();

  // Check which agents are NOT in the table
  const missing = agentFiles.filter(a => {
    const regex = new RegExp(`\\|\\s*\`${a}\`\\s*\\|`);
    return !regex.test(content);
  });

  if (missing.length === 0) return;

  // Find the end of the Platform Agents table and insert missing rows
  const tableEndPattern = /(\|\s*`(?:sovereignty-monitor|quality-gate|viability)`[^\n]*\n)/;
  const tableMatch = content.match(tableEndPattern);

  if (tableMatch) {
    const insertRows = missing.map(name => {
      // Try to read the agent file for class name and description
      const filePath = join(agentsDir, `${name}.agent.ts`);
      let displayName = name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
      let description = `${displayName} agent`;
      let model = 'Llama 3.3 70B';

      try {
        const src = readFileSync(filePath, 'utf-8');
        const descMatch = src.match(/description:\s*['"`]([^'"`]+)/);
        if (descMatch) description = descMatch[1];
        const nameMatch = src.match(/class\s+(\w+)\s+extends/);
        if (nameMatch) displayName = nameMatch[1];
      } catch { /* ignore */ }

      return `| \`${name}\` | ${displayName} | ${description} | ${model} |`;
    }).join('\n');

    content = content.replace(
      tableMatch[0],
      tableMatch[0] + insertRows + '\n'
    );

    changes.push({
      section: 'agent-list',
      detail: `Added ${missing.length} missing agents: ${missing.join(', ')}`
    });
  }
}

// --- 3. Sync last-updated date ---
function syncDate() {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '-');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const d = new Date();
  const prettyDate = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  const oldContent = content;
  // Update "**Updated:** March 7, 2026" pattern
  content = content.replace(
    /\*\*Updated:\*\*\s*\w+\s+\d+,\s+\d{4}/,
    `**Updated:** ${prettyDate}`
  );
  // Update "**Last Updated:** March 9, 2026" at footer
  content = content.replace(
    /\*\*Last Updated:\*\*\s*\w+\s+\d+,\s+\d{4}/,
    `**Last Updated:** ${prettyDate}`
  );

  if (content !== oldContent) {
    changes.push({ section: 'date', detail: `Updated date to ${prettyDate}` });
  }
}

// --- 4. Sync tech stack major versions ---
function syncTechStack() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  const mappings = [
    { name: 'Express', pattern: /Express\s+\d+/, pkgKey: 'express' },
    { name: 'TypeScript', pattern: /TypeScript\s+[\d.]+/, pkgKey: 'typescript' },
  ];

  for (const m of mappings) {
    const pkgVersion = deps[m.pkgKey];
    if (!pkgVersion) continue;
    const major = pkgVersion.replace(/[^0-9.]/g, '').split('.').slice(0, 2).join('.');
    const oldContent = content;
    content = content.replace(m.pattern, `${m.name} ${major}`);
    if (content !== oldContent) {
      changes.push({ section: 'tech-stack', detail: `Updated ${m.name} to ${major}` });
    }
  }
}

// Run all syncs
syncWorkflowCount();
syncAgentList();
syncTechStack();
syncDate();

// Output
if (jsonOutput) {
  console.log(JSON.stringify({ changes, dryRun }, null, 2));
} else if (changes.length === 0) {
  console.log('AGENTS.md is already in sync. No changes needed.');
} else {
  console.log(`\n=== AGENTS.md Auto-Sync ===\n`);
  for (const c of changes) {
    console.log(`  → [${c.section}] ${c.detail}`);
  }
  console.log(`\nTotal: ${changes.length} change(s)`);

  if (dryRun) {
    console.log('\n--dry-run: No files modified.\n');
  } else {
    writeFileSync(AGENTS_MD, content, 'utf-8');
    console.log('\nAGENTS.md updated successfully.\n');
  }
}
