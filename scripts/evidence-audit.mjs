#!/usr/bin/env node
// Evidence: Tool=OpenCode 1.18.21 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- scripts/evidence-audit.mjs
import { readFileSync, statSync } from 'node:fs';
import { resolve, relative } from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('usage: evidence-audit.mjs <file-or-dir>…');
  process.exit(2);
}

const CODE_EXT = new Set([
  '.ts', '.tsx', '.js', '.mjs', '.cjs', '.py', '.sh', '.bash', '.ps1',
]);
const SKIP_DIRS = /(^|\/)(node_modules|\.git|dist|build|coverage|Archive|landing-pages)(\/|$)/;
const EVIDENCE = /^(\/\/|#) Evidence:.*Tool=.+Model=.+/m;

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
  import('node:fs').then(({ readdirSync }) => {
    for (const e of readdirSync(join(process.cwd(), rel), { withFileTypes: true })) {
      const p = relative(process.cwd(), join(process.cwd(), rel, e.name));
      if (SKIP_DIRS.test(p)) continue;
      if (e.isDirectory()) walk(p);
      else if (CODE_EXT.has(e.name.split('.').pop())) files.push(p);
    }
  });
}

setTimeout(() => {
  let missing = [];
  let checked = 0;
  for (const f of files) {
    let head;
    try {
      head = readFileSync(f, 'utf8').slice(0, 2048);
    } catch {
      continue;
    }
    checked++;
    if (!EVIDENCE.test(head)) missing.push(f);
  }
  console.log(`evidence audit: ${checked} code file(s) checked, ${missing.length} missing Evidence header`);
  for (const f of missing) console.log(`  MISSING ${f}`);
  process.exit(missing.length > 0 ? 1 : 0);
}, 200);

process.on('beforeExit', () => {});
