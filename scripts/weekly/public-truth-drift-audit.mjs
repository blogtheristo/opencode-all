#!/usr/bin/env node
// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- scripts/weekly/public-truth-drift-audit.mjs

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '../..');
const args = new Set(process.argv.slice(2));
const registryPath = path.join(ROOT, 'config/truth/tech-and-partners-registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const findings = [];

function add(severity, check, message, file = '') {
  findings.push({ severity, check, message, file });
}

function getJsonValue(value, dottedPath) {
  return dottedPath.split('.').reduce((current, key) => current?.[key], value);
}

function collectFiles(rootDir) {
  const files = new Map();
  if (!fs.existsSync(rootDir)) return files;

  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(absolute);
      } else if (entry.isFile()) {
        const relative = path.relative(rootDir, absolute).split(path.sep).join('/');
        files.set(relative, fs.readFileSync(absolute));
      }
    }
  }

  walk(rootDir);
  return files;
}

function compareDirectories(leftRelative, rightRelative) {
  const left = collectFiles(path.join(ROOT, leftRelative));
  const right = collectFiles(path.join(ROOT, rightRelative));
  const names = new Set([...left.keys(), ...right.keys()]);
  const differences = [];

  for (const name of [...names].sort()) {
    if (!left.has(name)) differences.push(`${name} missing from ${leftRelative}`);
    else if (!right.has(name)) differences.push(`${name} missing from ${rightRelative}`);
    else if (!left.get(name).equals(right.get(name))) differences.push(`${name} differs`);
  }

  return differences;
}

for (const check of registry.canonicalChecks) {
  const absolute = path.join(ROOT, check.path);
  if (!fs.existsSync(absolute)) {
    add('error', check.id, 'canonical source is missing', check.path);
    continue;
  }

  const text = fs.readFileSync(absolute, 'utf8');
  if (check.expectedVersion) {
    const currentVersion = text.match(/^Version:\s*(\S+)\s*$/m)?.[1];
    if (currentVersion !== check.expectedVersion) {
      add(
        'error',
        check.id,
        `current document version expected ${check.expectedVersion}, got ${currentVersion || 'missing'}`,
        check.path,
      );
    }
  }
  for (const required of check.requiredText || []) {
    if (!text.includes(required)) {
      add('error', check.id, `required canonical text is missing: ${required}`, check.path);
    }
  }
  const lines = text.split(/\r?\n/);
  for (const tokens of check.requiredLineIncludes || []) {
    if (!lines.some((line) => tokens.every((token) => line.includes(token)))) {
      add(
        'error',
        check.id,
        `no canonical line contains all required tokens: ${tokens.join(', ')}`,
        check.path,
      );
    }
  }
}

for (const check of registry.jsonChecks) {
  const absolute = path.join(ROOT, check.path);
  if (!fs.existsSync(absolute)) {
    add('error', check.id, 'structured mirror is missing', check.path);
    continue;
  }

  let value;
  try {
    value = JSON.parse(fs.readFileSync(absolute, 'utf8'));
  } catch (error) {
    add('error', check.id, `invalid JSON: ${error.message}`, check.path);
    continue;
  }

  for (const [key, expected] of Object.entries(check.expect)) {
    const actual = getJsonValue(value, key);
    if (actual !== expected) {
      add(
        'error',
        check.id,
        `${key} expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
        check.path,
      );
    }
  }
}

for (const validator of registry.validators) {
  const script = path.normalize(validator.script);
  if (path.isAbsolute(script) || script.startsWith(`..${path.sep}`)) {
    add('error', validator.id, 'validator script must stay inside the repository', validator.script);
    continue;
  }

  const result = spawnSync(process.execPath, [script, ...(validator.args || [])], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    const output = result.error?.message || result.stderr.trim() || result.stdout.trim();
    add('error', validator.id, output || `validator exited with status ${result.status}`, script);
  }
}

for (const [left, right] of registry.mirrorPairs) {
  const differences = compareDirectories(left, right);
  for (const difference of differences.slice(0, 50)) {
    add('warning', 'dual-folder-sync', difference, `${left} <> ${right}`);
  }
  if (differences.length > 50) {
    add(
      'warning',
      'dual-folder-sync',
      `${differences.length - 50} additional differences omitted`,
      `${left} <> ${right}`,
    );
  }
}

for (const partner of registry.partnerEvidence) {
  const evidence = path.join(ROOT, partner.evidencePath);
  if (!fs.existsSync(evidence)) {
    add(
      'error',
      'partner-evidence',
      `${partner.name} (${partner.status}) has no evidence file`,
      partner.evidencePath,
    );
    continue;
  }

  const text = fs.readFileSync(evidence, 'utf8');
  for (const required of partner.requiredText) {
    if (!text.includes(required)) {
      add(
        'error',
        'partner-evidence',
        `${partner.name} evidence is missing required claim text: ${required}`,
        partner.evidencePath,
      );
    }
  }
}

const truthLint = spawnSync(
  process.execPath,
  ['scripts/lint-truth-claims.mjs', '--json', '--no-fail'],
  { cwd: ROOT, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 },
);
if (truthLint.error || truthLint.status !== 0) {
  add('error', 'truth-claims-lint', truthLint.error?.message || truthLint.stderr.trim());
} else {
  try {
    const result = JSON.parse(truthLint.stdout);
    for (const finding of result.findings) {
      add(
        finding.severity === 'FAIL' ? 'error' : 'warning',
        'truth-claims-lint',
        `${finding.phrase}: ${finding.reason}`,
        `${finding.file}:${finding.line}`,
      );
    }
  } catch (error) {
    add('error', 'truth-claims-lint', `invalid JSON output: ${error.message}`);
  }
}

const environmentPins = spawnSync(process.execPath, ['scripts/check-dev-env-pins.mjs', '--json'], {
  cwd: ROOT,
  encoding: 'utf8',
  maxBuffer: 2 * 1024 * 1024,
});
if (environmentPins.error || environmentPins.status !== 0) {
  add('error', 'environment-pins', environmentPins.error?.message || environmentPins.stderr.trim());
} else {
  try {
    const result = JSON.parse(environmentPins.stdout);
    for (const mismatch of result.mismatches || []) {
      add(
        'warning',
        'environment-pins',
        mismatch.reason,
        `config/truth/dev-environment-pins.json#${mismatch.id}`,
      );
    }
  } catch (error) {
    add('error', 'environment-pins', `invalid JSON output: ${error.message}`);
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  errors: findings.filter((finding) => finding.severity === 'error').length,
  warnings: findings.filter((finding) => finding.severity === 'warning').length,
  recommendedBranch: `fix/public-truth-drift-${new Date().toISOString().slice(0, 10)}`,
};

if (args.has('--json')) {
  console.log(JSON.stringify({ ok: findings.length === 0, summary, findings }, null, 2));
} else {
  console.log(`# Weekly Public Truth Drift Audit — ${summary.generatedAt.slice(0, 10)}`);
  console.log('');
  console.log(`- Errors: ${summary.errors}`);
  console.log(`- Warnings: ${summary.warnings}`);
  console.log(`- Recommended branch: \`${summary.recommendedBranch}\``);
  console.log('');
  if (findings.length === 0) {
    console.log('No truth, technology, partner-evidence, or mirror drift found.');
  } else {
    console.log('| Severity | Check | File | Finding |');
    console.log('| --- | --- | --- | --- |');
    for (const finding of findings) {
      const message = finding.message.replaceAll('|', '\\|').replaceAll('\n', ' ');
      console.log(
        `| ${finding.severity.toUpperCase()} | ${finding.check} | ${finding.file || '—'} | ${message} |`,
      );
    }
  }
}

if (findings.length > 0 && !args.has('--no-fail')) process.exitCode = 1;
