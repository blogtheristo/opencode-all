#!/usr/bin/env node
/**
 * verify-agents-md.mjs — AGENTS.md Freshness Checker
 *
 * Verifies that claims in AGENTS.md match the actual codebase.
 * Run: node scripts/verify-agents-md.mjs [--section <name>] [--json]
 *
 * Sections: tech-stack, agent-list, file-paths, workflow-count, all
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const AGENTS_MD = join(ROOT, 'AGENTS.md');

const args = process.argv.slice(2);
const section = args.includes('--section') ? args[args.indexOf('--section') + 1] : 'all';
const jsonOutput = args.includes('--json');

const results = { passed: [], failed: [], warnings: [] };

function pass(check, detail) {
  results.passed.push({ check, detail });
}
function fail(check, detail, fix) {
  results.failed.push({ check, detail, fix });
}
function warn(check, detail) {
  results.warnings.push({ check, detail });
}

// Read AGENTS.md
let agentsMd;
try {
  agentsMd = readFileSync(AGENTS_MD, 'utf-8');
} catch {
  console.error('ERROR: AGENTS.md not found at', AGENTS_MD);
  process.exit(1);
}

// --- Section: tech-stack ---
function checkTechStack() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  const checks = [
    { name: 'React', mdPattern: /React\s+(\d+)/, pkgKey: 'react' },
    { name: 'Vite', mdPattern: /Vite\s+(\d+)/, pkgKey: 'vite' },
    { name: 'TypeScript', mdPattern: /TypeScript\s+([\d.]+)/, pkgKey: 'typescript' },
    { name: 'TailwindCSS', mdPattern: /TailwindCSS\s+(\d+)/, pkgKey: 'tailwindcss' },
    { name: 'Express', mdPattern: /Express\s+(\d+)/, pkgKey: 'express' },
  ];

  for (const c of checks) {
    const mdMatch = agentsMd.match(c.mdPattern);
    const pkgVersion = deps[c.pkgKey];

    if (!mdMatch) {
      warn(`tech-stack:${c.name}`, `${c.name} not mentioned in AGENTS.md`);
      continue;
    }
    if (!pkgVersion) {
      warn(`tech-stack:${c.name}`, `${c.name} not in package.json`);
      continue;
    }

    const mdMajor = mdMatch[1].split('.')[0];
    const pkgMajor = pkgVersion.replace(/[^0-9.]/g, '').split('.')[0];

    if (mdMajor === pkgMajor) {
      pass(
        `tech-stack:${c.name}`,
        `AGENTS.md says ${c.name} ${mdMatch[1]}, package.json has ^${pkgVersion}`,
      );
    } else {
      fail(
        `tech-stack:${c.name}`,
        `AGENTS.md says ${c.name} ${mdMatch[1]}, but package.json has ${pkgVersion}`,
        `Update AGENTS.md §1 tech stack: ${c.name} ${pkgMajor}`,
      );
    }
  }
}

// --- Section: agent-list ---
function checkAgentList() {
  const agentsDir = join(ROOT, 'src', 'agents');
  if (!existsSync(agentsDir)) {
    warn('agent-list', 'src/agents/ directory not found');
    return;
  }

  const agentFiles = readdirSync(agentsDir)
    .filter((f) => f.endsWith('.agent.ts'))
    .map((f) => f.replace('.agent.ts', ''));

  // Extract agent names from the "Platform Agents (`src/agents/`)" table in §7 only.
  // Scoped to that one table (not the whole file) so unrelated skills-registry
  // tables elsewhere in the doc — markdown-only by design, see AI_AGENT_GUIDELINES
  // §10 "thin harness, fat skills" — don't get flagged as missing code.
  const mdAgentNames = [];
  const platformAgentsSection = agentsMd.match(
    /### Platform Agents \(`src\/agents\/`\)[\s\S]*?(?=\n### |\n## )/,
  );
  if (!platformAgentsSection) {
    warn(
      'agent-list',
      'Could not find "### Platform Agents (`src/agents/`)" section in AGENTS.md §7',
    );
  } else {
    const agentTableRegex = /\|\s*`([a-z-]+)`\s*\|/g;
    let match;
    while ((match = agentTableRegex.exec(platformAgentsSection[0])) !== null) {
      mdAgentNames.push(match[1]);
    }
  }

  // Check for agents in code but not in docs
  for (const agent of agentFiles) {
    if (agent === 'base' || agent === 'types' || agent === 'index') continue;
    if (mdAgentNames.includes(agent)) {
      pass(`agent-list:${agent}`, `Agent "${agent}" documented in AGENTS.md`);
    } else {
      fail(
        `agent-list:${agent}`,
        `Agent "${agent}" exists in src/agents/ but NOT in AGENTS.md §7`,
        `Add "${agent}" to Platform Agents table in AGENTS.md §7`,
      );
    }
  }

  // Check for agents in docs but not in code
  for (const agent of mdAgentNames) {
    const exists = agentFiles.includes(agent) || existsSync(join(agentsDir, `${agent}.agent.ts`));
    if (!exists) {
      warn(
        `agent-list:${agent}`,
        `Agent "${agent}" listed in AGENTS.md but no .agent.ts file found`,
      );
    }
  }
}

// --- Section: file-paths ---
function checkFilePaths() {
  // Extract paths from §15 Quick Reference table
  const pathChecks = [
    { label: 'Agent implementations', path: 'src/agents' },
    { label: 'Agent registry', path: 'src/agents/index.ts' },
    { label: 'Agent API routes', path: 'src/agents/routes.ts' },
    { label: 'Agent types', path: 'src/agents/types.ts' },
    { label: 'MCP Hub', path: 'mcp-servers/cloud-run-gateway/server.py' },
    { label: 'Signal coordinator', path: '.workflows/agents/coordinator.cjs' },
    { label: 'Tests', path: 'src/__tests__' },
    { label: 'Main app', path: 'src/app.ts' },
  ];

  for (const { label, path } of pathChecks) {
    const fullPath = join(ROOT, path);
    if (existsSync(fullPath)) {
      pass(`file-paths:${label}`, `${path} exists`);
    } else {
      fail(
        `file-paths:${label}`,
        `${path} referenced in AGENTS.md §15 but does NOT exist`,
        `Update AGENTS.md §15 or create the missing file`,
      );
    }
  }
}

// --- Section: workflow-count ---
function checkWorkflowCount() {
  const workflowDir = join(ROOT, '.github', 'workflows');
  if (!existsSync(workflowDir)) {
    warn('workflow-count', '.github/workflows/ not found');
    return;
  }

  const actualCount = readdirSync(workflowDir).filter(
    (f) => f.endsWith('.yml') || f.endsWith('.yaml'),
  ).length;

  // Check what AGENTS.md claims
  const countMatch = agentsMd.match(/(\d+)\s+(?:CI\/CD\s+)?workflows/i);
  if (countMatch) {
    const claimed = parseInt(countMatch[1], 10);
    if (claimed === actualCount) {
      pass('workflow-count', `AGENTS.md claims ${claimed} workflows, actual: ${actualCount}`);
    } else {
      fail(
        'workflow-count',
        `AGENTS.md claims ${claimed} workflows, but actual count is ${actualCount}`,
        `Update AGENTS.md: "${actualCount} workflows" (was ${claimed})`,
      );
    }
  } else {
    warn('workflow-count', 'Could not find workflow count claim in AGENTS.md');
  }
}

// --- Section: line-count ---
function checkLineCount() {
  const lines = agentsMd.split('\n').length;
  if (lines <= 150) {
    pass('line-count', `AGENTS.md is ${lines} lines (target: ≤150)`);
  } else if (lines <= 1200) {
    warn('line-count', `AGENTS.md is ${lines} lines (target: ≤150, acceptable: ≤1200)`);
  } else {
    fail(
      'line-count',
      `AGENTS.md is ${lines} lines — too long (target: ≤150, hard limit: ≤1200)`,
      'Run agents-md-slim refactoring: move detail sections to docs/',
    );
  }
}

// Run selected sections
const sections = {
  'tech-stack': checkTechStack,
  'agent-list': checkAgentList,
  'file-paths': checkFilePaths,
  'workflow-count': checkWorkflowCount,
  'line-count': checkLineCount,
};

if (section === 'all') {
  for (const fn of Object.values(sections)) fn();
} else if (sections[section]) {
  sections[section]();
} else {
  console.error(`Unknown section: ${section}. Available: ${Object.keys(sections).join(', ')}, all`);
  process.exit(1);
}

// Output
if (jsonOutput) {
  console.log(JSON.stringify(results, null, 2));
} else {
  const total = results.passed.length + results.failed.length + results.warnings.length;
  console.log(`\n=== AGENTS.md Freshness Report ===\n`);

  if (results.passed.length) {
    console.log(`✓ PASSED (${results.passed.length}/${total}):`);
    for (const r of results.passed) console.log(`  ✓ ${r.check}: ${r.detail}`);
  }

  if (results.warnings.length) {
    console.log(`\n⚠ WARNINGS (${results.warnings.length}):`);
    for (const r of results.warnings) console.log(`  ⚠ ${r.check}: ${r.detail}`);
  }

  if (results.failed.length) {
    console.log(`\n✗ FAILED (${results.failed.length}):`);
    for (const r of results.failed) {
      console.log(`  ✗ ${r.check}: ${r.detail}`);
      console.log(`    FIX: ${r.fix}`);
    }
  }

  console.log(
    `\nGrade: ${results.failed.length === 0 ? 'A' : results.failed.length <= 2 ? 'B' : results.failed.length <= 5 ? 'C' : 'F'}`,
  );
  console.log(
    `Score: ${results.passed.length}/${total} passed, ${results.warnings.length} warnings, ${results.failed.length} failures\n`,
  );
}

process.exit(results.failed.length > 0 ? 1 : 0);
