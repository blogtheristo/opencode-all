#!/usr/bin/env node
/**
 * golden-principle-check.mjs — Golden Principle Scanner
 *
 * Scans the DWS6 codebase for violations of golden principles
 * defined in CLAUDE.md and DWS standards.
 *
 * Run: node scripts/golden-principle-check.mjs [--json]
 *
 * Rules checked:
 *   1. No .md files in public paths
 *   2. No hardcoded secrets
 *   3. No exec() with string interpolation
 *   4. No CORS wildcard
 *   5. DWS Document Standard header in docs/
 *
 * Exit code: 0 if grade A-B, 1 if grade C-F
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, extname } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');

const violations = [];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function walkDir(dir, extensions, excludeDirs = []) {
  const results = [];
  if (!existsSync(dir)) return results;

  const defaultExcludes = ['node_modules', '.git', 'dist', '.venv', '__pycache__'];
  const allExcludes = [...defaultExcludes, ...excludeDirs];

  function walk(currentDir) {
    let entries;
    try {
      entries = readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (allExcludes.includes(entry.name)) continue;
      const fullPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (extensions === null || extensions.includes(extname(entry.name))) {
        results.push(fullPath);
      }
    }
  }

  walk(dir);
  return results;
}

function addViolation(rule, severity, file, line, message, fix) {
  violations.push({
    rule,
    severity,
    file: relative(ROOT, file),
    line,
    message,
    fix,
  });
}

// ---------------------------------------------------------------------------
// Rule 1: No .md files in public paths
// ---------------------------------------------------------------------------

function checkNoMdInPublicPaths() {
  const publicDirs = [
    'dws10.com',
    'landing-pages',
    'onelifetime.world',
    'dws6.com',
  ];

  for (const dir of publicDirs) {
    const fullDir = join(ROOT, dir);
    const mdFiles = walkDir(fullDir, ['.md']);
    for (const file of mdFiles) {
      addViolation(
        'no-md-in-public',
        'critical',
        file,
        0,
        `.md file found in public path: ${relative(ROOT, file)}`,
        'Convert to HTML or move to docs/, Admin/, or Learn/'
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Rule 2: No hardcoded secrets
// ---------------------------------------------------------------------------

function checkNoHardcodedSecrets() {
  const secretPatterns = [
    { pattern: /sk-[a-zA-Z0-9]{20,}/, name: 'API secret key (sk-)' },
    { pattern: /ghp_[a-zA-Z0-9]{20,}/, name: 'GitHub personal token (ghp_)' },
    { pattern: /ghu_[a-zA-Z0-9]{20,}/, name: 'GitHub user token (ghu_)' },
    { pattern: /xoxb-[a-zA-Z0-9-]{20,}/, name: 'Slack bot token (xoxb-)' },
    { pattern: /AKIA[A-Z0-9]{12,}/, name: 'AWS access key (AKIA)' },
    { pattern: /password\s*=\s*"[^"]{4,}"/, name: 'Hardcoded password' },
    { pattern: /api_key\s*=\s*"[^"]{4,}"/, name: 'Hardcoded api_key' },
    { pattern: /secret\s*=\s*"[^"]{4,}"/, name: 'Hardcoded secret' },
  ];

  const excludeDirs = ['docs', '__tests__', 'test', 'tests', '.env.example'];

  const codeFiles = walkDir(ROOT, ['.ts', '.js', '.py'], excludeDirs);

  for (const file of codeFiles) {
    const relPath = relative(ROOT, file);
    // Skip test files, example files, docs, and this scanner itself
    if (
      relPath.includes('__tests__') ||
      relPath.includes('.test.') ||
      relPath.includes('.spec.') ||
      relPath.includes('.env.example') ||
      relPath.includes('golden-principle-check') ||
      relPath.startsWith('docs/')
    ) {
      continue;
    }

    let content;
    try {
      content = readFileSync(file, 'utf-8');
    } catch {
      continue;
    }

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip comments
      if (line.trimStart().startsWith('//') || line.trimStart().startsWith('#')) continue;

      for (const sp of secretPatterns) {
        if (sp.pattern.test(line)) {
          addViolation(
            'no-hardcoded-secrets',
            'critical',
            file,
            i + 1,
            `Potential ${sp.name} found`,
            'Move to .env file and use process.env'
          );
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Rule 3: No exec() with string interpolation
// ---------------------------------------------------------------------------

function checkNoExecInterpolation() {
  const codeFiles = walkDir(ROOT, ['.ts', '.js']);

  for (const file of codeFiles) {
    const relPath = relative(ROOT, file);
    if (
      relPath.includes('__tests__') ||
      relPath.includes('.test.') ||
      relPath.includes('.spec.') ||
      relPath.includes('golden-principle-check')
    ) {
      continue;
    }

    let content;
    try {
      content = readFileSync(file, 'utf-8');
    } catch {
      continue;
    }

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trimStart().startsWith('//')) continue;

      // exec() with template literal
      if (/exec\s*\(\s*`/.test(line)) {
        addViolation(
          'no-exec-interpolation',
          'critical',
          file,
          i + 1,
          'exec() called with template literal — command injection risk',
          'Use execFile() with argument arrays instead'
        );
      }
      // exec() with string concatenation
      if (/exec\s*\([^)]*\+/.test(line) || /exec\s*\(\s*['"][^'"]*['"]\s*\+/.test(line)) {
        addViolation(
          'no-exec-interpolation',
          'critical',
          file,
          i + 1,
          'exec() called with string concatenation — command injection risk',
          'Use execFile() with argument arrays instead'
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Rule 4: No CORS wildcard
// ---------------------------------------------------------------------------

function checkNoCorsWildcard() {
  const codeFiles = walkDir(ROOT, ['.ts', '.js', '.py']);

  for (const file of codeFiles) {
    const relPath = relative(ROOT, file);
    if (
      relPath.includes('__tests__') ||
      relPath.includes('.test.') ||
      relPath.includes('.spec.') ||
      relPath.includes('golden-principle-check')
    ) {
      continue;
    }

    let content;
    try {
      content = readFileSync(file, 'utf-8');
    } catch {
      continue;
    }

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trimStart().startsWith('//') || line.trimStart().startsWith('#')) continue;

      if (/origin:\s*['"]\*['"]/.test(line)) {
        addViolation(
          'no-cors-wildcard',
          'critical',
          file,
          i + 1,
          "CORS wildcard origin: '*' found",
          'Use explicit allowed origins from DWS_SECURITY_STANDARD.md Section 13.3'
        );
      }
      if (/allow_origins\s*=\s*\[\s*["']\*["']\s*\]/.test(line)) {
        addViolation(
          'no-cors-wildcard',
          'critical',
          file,
          i + 1,
          'CORS wildcard allow_origins=["*"] found',
          'Use explicit allowed origins from DWS_SECURITY_STANDARD.md Section 13.3'
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Rule 5: DWS Document Standard header in docs/
// ---------------------------------------------------------------------------

function checkDocumentStandard() {
  const docsDir = join(ROOT, 'docs');
  const mdFiles = walkDir(docsDir, ['.md']);

  for (const file of mdFiles) {
    let content;
    try {
      content = readFileSync(file, 'utf-8');
    } catch {
      continue;
    }

    // Check for *** delimiter (DWS Document Standard separator)
    const hasDelimiter = content.includes('***');
    // Check for VERSION AND AGENT HISTORY block
    const hasVersionBlock = /VERSION\s+AND\s+AGENT\s+HISTORY/i.test(content);

    if (!hasDelimiter) {
      addViolation(
        'dws-document-standard',
        'warning',
        file,
        0,
        'Missing *** delimiter (DWS Document Standard)',
        'Add *** delimiter and VERSION AND AGENT HISTORY block per DWS_DOCUMENT_STANDARD.md'
      );
    }

    if (!hasVersionBlock) {
      addViolation(
        'dws-document-standard',
        'warning',
        file,
        0,
        'Missing VERSION AND AGENT HISTORY block',
        'Add VERSION AND AGENT HISTORY block per DWS_DOCUMENT_STANDARD.md'
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Grading
// ---------------------------------------------------------------------------

function calculateGrade(violations) {
  const criticalCount = violations.filter((v) => v.severity === 'critical').length;
  const warningCount = violations.filter((v) => v.severity === 'warning').length;

  // Weighted score: critical = 10 points, warning = 2 points
  const score = criticalCount * 10 + warningCount * 2;

  if (score === 0) return 'A';
  if (score <= 5) return 'B';
  if (score <= 15) return 'C';
  if (score <= 30) return 'D';
  return 'F';
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function printReport() {
  const grade = calculateGrade(violations);
  const criticalCount = violations.filter((v) => v.severity === 'critical').length;
  const warningCount = violations.filter((v) => v.severity === 'warning').length;

  if (jsonOutput) {
    const report = {
      timestamp: new Date().toISOString(),
      grade,
      summary: {
        total: violations.length,
        critical: criticalCount,
        warning: warningCount,
      },
      violations,
    };
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log('='.repeat(60));
    console.log('  DWS6 Golden Principle Scanner');
    console.log('='.repeat(60));
    console.log();
    console.log(`  Grade: ${grade}`);
    console.log(`  Total violations: ${violations.length}`);
    console.log(`  Critical: ${criticalCount}  |  Warnings: ${warningCount}`);
    console.log();

    if (violations.length === 0) {
      console.log('  All golden principles satisfied.');
    } else {
      // Group by rule
      const byRule = {};
      for (const v of violations) {
        if (!byRule[v.rule]) byRule[v.rule] = [];
        byRule[v.rule].push(v);
      }

      for (const [rule, items] of Object.entries(byRule)) {
        console.log('-'.repeat(60));
        console.log(`  Rule: ${rule}  (${items.length} violation${items.length > 1 ? 's' : ''})`);
        console.log('-'.repeat(60));
        for (const v of items) {
          const loc = v.line > 0 ? `${v.file}:${v.line}` : v.file;
          const sev = v.severity === 'critical' ? 'CRITICAL' : 'WARNING';
          console.log(`  [${sev}] ${loc}`);
          console.log(`          ${v.message}`);
          console.log(`          Fix: ${v.fix}`);
          console.log();
        }
      }
    }

    console.log('='.repeat(60));
    console.log(`  Scan completed: ${new Date().toISOString()}`);
    console.log('='.repeat(60));
  }

  // Exit code: 0 if A-B, 1 if C-F
  const passing = grade === 'A' || grade === 'B';
  process.exit(passing ? 0 : 1);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

checkNoMdInPublicPaths();
checkNoHardcodedSecrets();
checkNoExecInterpolation();
checkNoCorsWildcard();
checkDocumentStandard();
printReport();
