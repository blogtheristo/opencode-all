#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=undisclosed-in-source (see commit trailer) Agent=claude Date=2026-09-13
// Audit trail: git log -- scripts/sync-agents-md.mjs
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

import { agentPathsByName } from './lib/agent-files.mjs';

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

  const count = readdirSync(workflowDir).filter(
    (f) => f.endsWith('.yml') || f.endsWith('.yaml'),
  ).length;

  // Replace "15 workflows" or "N CI/CD workflows" patterns
  const oldContent = content;
  content = content.replace(/(\d+)\s+(CI\/CD\s+)?workflows/gi, (match, num) => {
    if (parseInt(num, 10) !== count) {
      return match.replace(num, String(count));
    }
    return match;
  });

  if (content !== oldContent) {
    changes.push({ section: 'workflow-count', detail: `Updated workflow count to ${count}` });
  }
}

/**
 * A `description:` value, including the concatenated multi-line form:
 *
 *     description:
 *       'Chemical & pharmaceutical industry specialist — CBAM fertilisers/hydrogen, ' +
 *       'REACH substance compliance, ...',
 *
 * A single-literal regex captured only the first segment, so `juno`,
 * `mercury-trade` and `world-model-loop` landed in the table as sentences cut off
 * mid-clause, ending in a dangling comma — and read as finished claims.
 */
const DESCRIPTION_EXPRESSION =
  /description:\s*((?:\s*(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)\s*\+?)+)/;

/** Concatenate the string literals of a `'a' + 'b'` expression. */
function joinLiterals(expr) {
  const parts = expr.match(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g) ?? [];
  return parts
    .map((p) => p.slice(1, -1))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Make a value safe for one markdown table cell. */
function cell(text) {
  return text.replace(/\|/g, '\\|');
}

// --- 2. Sync agent list in §7 table ---
function syncAgentList() {
  const agentsDir = join(ROOT, 'src', 'agents');
  if (!existsSync(agentsDir)) return;

  // Whole tree, not just the top level. This used to be a flat
  // `readdirSync(agentsDir)`, so the 32 agents under
  // `src/agents/{workflow,consultant,seo,world-model,loop-engineering}/` were
  // invisible to the syncer. A drift detector that cannot see a file reports no
  // drift for it, forever. Traversal is shared with verify-agents-md.mjs.
  const agentPaths = agentPathsByName(agentsDir);
  const agentFiles = [...agentPaths.keys()].sort();

  // Check which agents are NOT in the table
  const missing = agentFiles.filter((a) => {
    const regex = new RegExp(`\\|\\s*\`${a}\`\\s*\\|`);
    return !regex.test(content);
  });

  if (missing.length === 0) return;

  // Append after the LAST row of the Platform Agents table.
  //
  // This used to match `(sovereignty-monitor|quality-gate|viability)` and claim
  // in its own comment to be finding the table's end. Alternation returns the
  // EARLIEST match, and `quality-gate` sits in the middle of the table, so every
  // new agent was inserted mid-table. That is how `vuln-patch-sla-triage` landed
  // between `quality-gate` and `hic-content-audit`.
  //
  // Anchored on the heading instead, taking the final contiguous `|` line, so it
  // does not depend on which agents happen to exist.
  const sectionPattern = /(### Platform Agents \(`src\/agents\/`\)[\s\S]*?\n)(\|[^\n]*\n)+/;
  const tableMatch = content.match(sectionPattern);

  if (tableMatch) {
    const insertRows = missing
      .map((name) => {
        // Read the agent file for class name, description and declared model.
        const filePath = agentPaths.get(name);
        let displayName = name
          .split('-')
          .map((w) => w[0].toUpperCase() + w.slice(1))
          .join('');
        let description = `${displayName} agent`;
        // No fallback literal: `Llama 3.3 70B` was hardcoded here, and the table
        // asserted it for every generated row while the agents actually declare
        // nine different models (claude-sonnet-5, claude-opus-4-7, placeholder,
        // deterministic, …). A model we cannot read is reported as unknown rather
        // than guessed.
        let model = null;

        try {
          const src = readFileSync(filePath, 'utf-8');
          const descMatch = src.match(DESCRIPTION_EXPRESSION);
          if (descMatch) description = joinLiterals(descMatch[1]);
          const nameMatch = src.match(/class\s+(\w+)\s+extends/);
          if (nameMatch) displayName = nameMatch[1];
          const modelMatch = src.match(/model:\s*['"`]([^'"`]+)/);
          if (modelMatch) model = modelMatch[1];
        } catch {
          /* ignore */
        }

        // Column order follows the header: Agent | Role | Implementation |
        // Default model. The previous form emitted the class name under "Role"
        // and the prose under "Implementation", inverting both for 15 rows.
        const modelCell = model ? `\`${model}\`` : '_unknown_';
        return `| \`${name}\` | ${cell(description)} | \`${displayName}\` | ${modelCell} |`;
      })
      .join('\n');

    content = content.replace(tableMatch[0], tableMatch[0] + insertRows + '\n');

    changes.push({
      section: 'agent-list',
      detail: `Added ${missing.length} missing agents: ${missing.join(', ')}`,
    });
  }
}

// --- 3. Sync last-updated date ---
function syncDate() {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '-');
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const d = new Date();
  const prettyDate = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  const oldContent = content;
  // Update "**Updated:** March 7, 2026" pattern
  content = content.replace(/\*\*Updated:\*\*\s*\w+\s+\d+,\s+\d{4}/, `**Updated:** ${prettyDate}`);
  // Update "**Last Updated:** March 9, 2026" at footer
  content = content.replace(
    /\*\*Last Updated:\*\*\s*\w+\s+\d+,\s+\d{4}/,
    `**Last Updated:** ${prettyDate}`,
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
    const major = pkgVersion
      .replace(/[^0-9.]/g, '')
      .split('.')
      .slice(0, 2)
      .join('.');
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
