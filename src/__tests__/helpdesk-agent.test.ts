/**
 * Helpdesk Agent — invariants and parser tests.
 *
 * The most important test here is the **draft-only invariant**: the
 * helpdesk agent module (and its transitive imports inside src/agents/)
 * must never reach src/utils/send-email.ts. If a future refactor wires
 * send-email into the agent, this test must fail loudly.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { dirname, join, resolve } from 'path';

const REPO_ROOT = resolve(__dirname, '..', '..');
const AGENT_PATH = join(REPO_ROOT, 'src', 'agents', 'helpdesk.agent.ts');
const SEND_EMAIL_PATH = join(REPO_ROOT, 'src', 'utils', 'send-email.ts');

const IMPORT_RE = /from\s+['"]([^'"]+)['"]/g;

function listAgentDir(): Set<string> {
  return new Set(
    readdirSync(join(REPO_ROOT, 'src', 'agents'))
      .filter((f) => f.endsWith('.ts'))
      .map((f) => join(REPO_ROOT, 'src', 'agents', f)),
  );
}

function localResolve(fromFile: string, spec: string): string | null {
  if (!spec.startsWith('.')) return null;
  const baseDir = dirname(fromFile);
  // strip trailing .js for ESM-style imports
  const stripped = spec.replace(/\.js$/, '');
  const candidates = [
    resolve(baseDir, stripped + '.ts'),
    resolve(baseDir, stripped + '.tsx'),
    resolve(baseDir, stripped, 'index.ts'),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  return null;
}

function transitiveImports(entry: string, limit = 100): Set<string> {
  const seen = new Set<string>();
  const queue = [entry];
  while (queue.length && seen.size < limit) {
    const f = queue.shift()!;
    if (seen.has(f)) continue;
    seen.add(f);
    const src = readFileSync(f, 'utf-8');
    for (const m of src.matchAll(IMPORT_RE)) {
      const target = localResolve(f, m[1]);
      if (target && !seen.has(target)) queue.push(target);
    }
  }
  return seen;
}

describe('HelpdeskAgent — draft-only invariant', () => {
  it('helpdesk.agent.ts exists', () => {
    expect(existsSync(AGENT_PATH)).toBe(true);
  });

  it('does not directly import send-email', () => {
    const src = readFileSync(AGENT_PATH, 'utf-8');
    // strip block comments and line comments before checking, so the invariant
    // comment itself doesn't trip the assertion
    const stripped = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\n)\s*\/\/.*/g, '$1');
    expect(stripped).not.toMatch(/from\s+['"][^'"]*send-email[^'"]*['"]/);
    expect(stripped).not.toMatch(/require\(['"][^'"]*send-email[^'"]*['"]\)/);
  });

  it('does not transitively import send-email through local code', () => {
    const reached = transitiveImports(AGENT_PATH);
    // sanity: we did walk *something* beyond the entry file
    expect(reached.size).toBeGreaterThan(1);
    expect(reached.has(SEND_EMAIL_PATH)).toBe(false);
  });

  it('the agent source mentions the invariant comment for future maintainers', () => {
    const src = readFileSync(AGENT_PATH, 'utf-8');
    expect(src).toMatch(/MUST NOT import.*send-email/);
  });
});

describe('HelpdeskAgent — registry sanity', () => {
  it('lists known agent files (smoke check)', () => {
    const files = listAgentDir();
    expect(files.size).toBeGreaterThan(5);
    expect([...files].some((f) => f.endsWith('helpdesk.agent.ts'))).toBe(true);
  });
});
