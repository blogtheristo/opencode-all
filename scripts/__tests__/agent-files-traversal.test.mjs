// Evidence: Tool=Claude Code Model=undisclosed-in-source (see commit trailer) Agent=claude Date=2026-09-13
// Audit trail: git log -- scripts/__tests__/agent-files-traversal.test.mjs
/**
 * AGENTS.md generator/verifier — do they see the whole agent tree?
 *
 * Both scripts used a flat `readdirSync('src/agents')`. 32 of the 75
 * `*.agent.ts` files live in subdirectories, so both covered 57% of a directory
 * the document describes as "Platform Agents (`src/agents/`)" and told readers
 * was "verified against the filesystem". A drift detector that cannot see a file
 * reports no drift for it, forever — which is why this is pinned by a test and
 * not just by a comment.
 */

import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { agentNames, agentPathsByName, walkAgents } from '../lib/agent-files.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const AGENTS_DIR = join(ROOT, 'src', 'agents');

describe('walkAgents — the real src/agents tree', () => {
  it('finds every *.agent.ts at any depth, not just the top level', () => {
    // Independent measurement: git, not another readdir, so the test cannot
    // agree with the code by sharing its bug.
    const tracked = execFileSync('git', ['ls-files', 'src/agents'], { cwd: ROOT, encoding: 'utf8' })
      .split('\n')
      .filter((f) => f.endsWith('.agent.ts'))
      .map((f) => f.replace(/.*\//, '').replace('.agent.ts', ''))
      .filter((n) => !['base', 'types', 'index'].includes(n))
      .sort();

    expect(agentNames(AGENTS_DIR)).toEqual(tracked);
  });

  it('reaches agents that a flat readdir cannot see', () => {
    const found = agentNames(AGENTS_DIR);
    // One per nested directory that existed when the traversal was fixed.
    for (const nested of ['helios', 'ai-scoping', 'seo-audit', 'world-model-loop', 'checker']) {
      expect(found).toContain(nested);
    }
  });

  it('excludes base/types/index, which are infrastructure', () => {
    expect(agentNames(AGENTS_DIR)).not.toContain('base');
  });
});

describe('agentPathsByName — name collisions', () => {
  it('throws rather than silently dropping a duplicate basename', () => {
    const dir = mkdtempSync(join(tmpdir(), 'agent-files-'));
    mkdirSync(join(dir, 'a'));
    mkdirSync(join(dir, 'b'));
    writeFileSync(join(dir, 'a', 'twin.agent.ts'), '');
    writeFileSync(join(dir, 'b', 'twin.agent.ts'), '');

    // The bare name is the key AGENTS.md rows match on, so a collision would
    // make one of the two agents permanently undocumentable.
    expect(() => agentPathsByName(dir)).toThrow(/share the basename "twin"/);
  });

  it('maps each name to the path it was found at', () => {
    const dir = mkdtempSync(join(tmpdir(), 'agent-files-'));
    mkdirSync(join(dir, 'deep', 'deeper'), { recursive: true });
    writeFileSync(join(dir, 'deep', 'deeper', 'buried.agent.ts'), '');
    expect([...walkAgents(dir)]).toEqual([
      { name: 'buried', path: join(dir, 'deep', 'deeper', 'buried.agent.ts') },
    ]);
  });
});

describe('verify-agents-md row parser', () => {
  /** Read the row regex out of the verifier — single source of truth. */
  function rowRegex() {
    const src = readFileSync(join(ROOT, 'scripts', 'verify-agents-md.mjs'), 'utf8');
    const m = src.match(/const agentTableRegex = (\/.+\/[gm]*);/);
    if (!m) throw new Error('agentTableRegex not found in scripts/verify-agents-md.mjs');
    // eslint-disable-next-line no-eval
    return eval(m[1]);
  }

  it('reads the first column only', () => {
    const row = '| `helios` | Energy specialist | `HeliosAgent` | `placeholder` |';
    expect([...row.matchAll(rowRegex())].map((m) => m[1])).toEqual(['helios']);
  });

  it('does not mistake a bare model value for an undocumented agent', () => {
    // `placeholder` and `deterministic` are Default model values. Unanchored,
    // the regex reported them as agents listed in AGENTS.md without code.
    const table = [
      '| `tau` | Stub | `TauAgent` | `placeholder` |',
      '| `rho` | Fixed rules | `RhoAgent` | `deterministic` |',
    ].join('\n');
    const names = [...table.matchAll(rowRegex())].map((m) => m[1]);
    expect(names).toEqual(['tau', 'rho']);
  });
});
