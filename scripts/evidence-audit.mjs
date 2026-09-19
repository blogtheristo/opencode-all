#!/usr/bin/env node
// Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=standards-audit Date=2026-09-19
// Audit trail: git log -- scripts/evidence-audit.mjs
import { readFileSync, statSync, readdirSync } from 'node:fs';
import { resolve, relative, join } from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('usage: evidence-audit.mjs <file-or-dir>…');
  process.exit(2);
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
for (const arg of args) {
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

// Parse Evidence header and validate format
function validateEvidence(content, filePath) {
  const lines = content.split('\n');
  const ext = '.' + filePath.split('.').pop();
  const typeInfo = CODE_TYPES[ext];

  if (!typeInfo) return { ok: false, err: `unknown file type: ${ext}` };

  let headerLine = null;
  let headerIndex = -1;

  // Find Evidence header (skip shebang)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    if (lines[i].includes('Evidence:')) {
      headerLine = lines[i];
      headerIndex = i;
      break;
    }
  }

  if (!headerLine) {
    return { ok: false, err: 'missing Evidence header' };
  }

  // Validate comment style for this file type
  const commentRegex = typeInfo.comment === '<!--'
    ? /<!--.*Evidence:/
    : new RegExp(`^${typeInfo.comment.replace(/[-\/\\]/g, '\\$&')} Evidence:`);

  if (!commentRegex.test(headerLine)) {
    return { ok: false, err: `invalid comment style for ${typeInfo.name}; expected "${typeInfo.comment}"` };
  }

  // Extract fields using regex
  const toolMatch = headerLine.match(/Tool=([^ ]+)/);
  const modelMatch = headerLine.match(/Model=([^ ]+)/);
  const agentMatch = headerLine.match(/Agent=([^ ]+)/);
  const dateMatch = headerLine.match(/Date=(\d{4}-\d{2}-\d{2})/);

  if (!toolMatch) return { ok: false, err: 'missing Tool field' };
  if (!modelMatch) return { ok: false, err: 'missing Model field' };
  if (!agentMatch) return { ok: false, err: 'missing Agent field' };
  if (!dateMatch) return { ok: false, err: 'missing Date field (must be ISO 8601 YYYY-MM-DD)' };

  // Validate date format
  const datePart = dateMatch[1];
  const date = new Date(datePart);
  if (isNaN(date.getTime())) {
    return { ok: false, err: `invalid Date format: ${datePart}; expected YYYY-MM-DD` };
  }

  // Validate Tool version format
  const toolPart = toolMatch[1];
  if (!/^[\w\s\.\-]+$/.test(toolPart) || toolPart.length > 100) {
    return { ok: false, err: `invalid Tool format: ${toolPart}` };
  }

  // Validate Model format
  const modelPart = modelMatch[1];
  if (!/^[\w\.\-\/]+$/.test(modelPart) || modelPart.length > 100) {
    return { ok: false, err: `invalid Model format: ${modelPart}` };
  }

  // Validate Agent name
  const agentPart = agentMatch[1];
  if (!/^[\w\s\-]+$/.test(agentPart) || agentPart.length > 64) {
    return { ok: false, err: `invalid Agent format: ${agentPart}; must be alphanumeric + hyphens/spaces, max 64 chars` };
  }

  // Check second line is Audit trail comment
  if (headerIndex + 1 < lines.length) {
    const auditLine = lines[headerIndex + 1];
    const auditRegex = typeInfo.comment === '<!--'
      ? /<!--.*Audit trail/
      : new RegExp(`^${typeInfo.comment.replace(/[-\/\\]/g, '\\$&')} Audit trail`);
    if (!auditRegex.test(auditLine)) {
      return { ok: false, err: 'second line must be Audit trail comment' };
    }
  } else {
    return { ok: false, err: 'Audit trail comment missing (expected on line after Evidence)' };
  }

  return { ok: true };
}

setTimeout(() => {
  let passed = [];
  let failed = [];
  let checked = 0;

  for (const f of files) {
    let content;
    try {
      content = readFileSync(f, 'utf8').slice(0, 4096);
    } catch {
      continue;
    }
    checked++;

    const result = validateEvidence(content, f);
    if (result.ok) {
      passed.push(f);
    } else {
      failed.push({ file: f, error: result.err });
    }
  }

  console.log(`\nevidence audit: ${checked} code file(s) checked`);
  console.log(`  ✓ ${passed.length} compliant`);
  console.log(`  ✗ ${failed.length} non-compliant`);

  if (failed.length > 0) {
    console.log(`\nNon-compliant files:`);
    for (const { file, error } of failed) {
      console.log(`  ${file}`);
      console.log(`    → ${error}`);
    }
  }

  process.exit(failed.length > 0 ? 1 : 0);
}, 100);

process.on('beforeExit', () => {});
