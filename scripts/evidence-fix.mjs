#!/usr/bin/env node
// Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=standards-audit Date=2026-09-19
// Audit trail: git log -- scripts/evidence-fix.mjs
import { readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import { resolve, relative, join } from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('usage: evidence-fix.mjs [--agent NAME] [--model MODEL] <file-or-dir>…');
  console.error('  --agent NAME   Agent/session name (default: auto-fixer)');
  console.error('  --model MODEL  Model ID (default: claude-haiku-4-5-20251001)');
  process.exit(2);
}

let agent = 'auto-fixer';
let model = 'claude-haiku-4-5-20251001';
const paths = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--agent') {
    agent = args[++i];
  } else if (args[i] === '--model') {
    model = args[++i];
  } else {
    paths.push(args[i]);
  }
}

const CODE_TYPES = {
  '.ts': { ext: '.ts', comment: '//', name: 'TypeScript' },
  '.tsx': { ext: '.tsx', comment: '//', name: 'TSX' },
  '.js': { ext: '.js', comment: '//', name: 'JavaScript' },
  '.mjs': { ext: '.mjs', comment: '//', name: 'ES Module' },
  '.cjs': { ext: '.cjs', comment: '//', name: 'CommonJS' },
  '.py': { ext: '.py', comment: '#', name: 'Python' },
  '.sql': { ext: '.sql', comment: '--', name: 'SQL' },
  '.md': { ext: '.md', comment: '<!--', name: 'Markdown' },
  '.html': { ext: '.html', comment: '<!--', name: 'HTML' },
  '.yaml': { ext: '.yaml', comment: '#', name: 'YAML' },
  '.yml': { ext: '.yml', comment: '#', name: 'YAML' },
  '.sh': { ext: '.sh', comment: '#', name: 'Shell' },
  '.bash': { ext: '.bash', comment: '#', name: 'Bash' },
  '.ps1': { ext: '.ps1', comment: '#', name: 'PowerShell' },
};

const SKIP_DIRS = /(^|\/)(node_modules|\.git|dist|build|coverage|Archive|landing-pages|\.next|\.cache)(\/|$)/;

const files = [];
for (const arg of paths) {
  const abs = resolve(arg);
  try {
    if (statSync(abs).isDirectory()) walk(arg);
    else files.push(arg);
  } catch {
    console.error(`not found: ${arg}`);
    process.exitCode = 1;
  }
}

function walk(rel) {
  for (const e of readdirSync(join(process.cwd(), rel), { withFileTypes: true })) {
    const p = relative(process.cwd(), join(process.cwd(), rel, e.name));
    if (SKIP_DIRS.test(p)) continue;
    if (e.isDirectory()) walk(p);
    else {
      const ext = '.' + e.name.split('.').pop();
      if (CODE_TYPES[ext]) files.push(p);
    }
  }
}

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function generateEvidence(ext) {
  const typeInfo = CODE_TYPES[ext];
  const today = getToday();
  const tool = 'Claude Code 1.0';

  if (!typeInfo) return null;

  if (typeInfo.comment === '<!--') {
    return [
      `<!-- Evidence: Tool=${tool} Model=${model} Agent=${agent} Date=${today} -->`,
      `<!-- Audit trail: git log -- <this-file> -->`
    ];
  } else {
    return [
      `${typeInfo.comment} Evidence: Tool=${tool} Model=${model} Agent=${agent} Date=${today}`,
      `${typeInfo.comment} Audit trail: git log -- <this-file>`
    ];
  }
}

function hasShebang(line) {
  return line.startsWith('#!');
}

function hasExistingEvidence(content) {
  const lines = content.split('\n');
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    if (lines[i].includes('Evidence:')) return true;
  }
  return false;
}

function fixFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');

    if (hasExistingEvidence(content)) {
      return { status: 'skip', reason: 'already has Evidence header' };
    }

    const ext = '.' + filePath.split('.').pop();
    const typeInfo = CODE_TYPES[ext];
    if (!typeInfo) return { status: 'skip', reason: 'unknown file type' };

    const evidence = generateEvidence(ext);
    if (!evidence) return { status: 'skip', reason: 'cannot generate evidence' };

    const lines = content.split('\n');
    let insertAt = 0;

    if (hasShebang(lines[0])) insertAt = 1;

    const newLines = [
      ...lines.slice(0, insertAt),
      ...evidence,
      ...lines.slice(insertAt)
    ];

    writeFileSync(filePath, newLines.join('\n'), 'utf8');
    return { status: 'fixed' };
  } catch (err) {
    return { status: 'error', reason: err.message };
  }
}

setTimeout(() => {
  let fixed = 0;
  let skipped = 0;
  let errors = 0;

  for (const f of files) {
    const result = fixFile(f);
    if (result.status === 'fixed') {
      fixed++;
      console.log(`✓ ${f}`);
    } else if (result.status === 'skip') {
      skipped++;
      console.log(`⊘ ${f} (${result.reason})`);
    } else {
      errors++;
      console.log(`✗ ${f} (${result.reason})`);
    }
  }

  console.log(`\nevidence-fix: ${files.length} file(s) processed`);
  console.log(`  ✓ ${fixed} fixed`);
  console.log(`  ⊘ ${skipped} skipped`);
  console.log(`  ✗ ${errors} errors`);

  process.exit(errors > 0 ? 1 : 0);
}, 100);

process.on('beforeExit', () => {});
