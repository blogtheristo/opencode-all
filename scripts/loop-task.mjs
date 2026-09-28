#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic Agent=loop-task Date=2026-09-28
// Audit trail: git log -- scripts/loop-task.mjs
/**
 * loop-task — hand a coding task from a paid session (Claude Code, Copilot) to the DGX
 * opencode-task-loop, instead of coding it with paid tokens (CLAUDE.md Coding Delegation Rule).
 *
 * Writes .claude/done/<branch>.json. Every check must FAIL on today's code: a check that already
 * passes proves nothing, so it is refused (override with --allow-passing only for regression
 * guards). Commit the spec to main via a PR; the loop picks it up on its next pass.
 *
 * Usage:
 *   node scripts/loop-task.mjs --branch opencode/verify-logistics \
 *     --task "Verification suite for logistics" \
 *     --prompt "Write src/__tests__/agents/logistics.agent.test.ts ..." \
 *     --check "suite exists::test -f src/__tests__/agents/logistics.agent.test.ts" \
 *     --check "suite passes::npx vitest run src/__tests__/agents/logistics.agent.test.ts" \
 *     [--base main] [--order 100] [--max-rounds 4] [--model ollama-local/…] [--dry-run]
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const argv = process.argv.slice(2);
const one = (f) => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : undefined);
const all = (f) => argv.flatMap((a, i) => (a === f ? [argv[i + 1]] : []));
const die = (m) => {
  console.error(`loop-task: ${m}`);
  process.exit(2);
};

const branch = one('--branch');
const task = one('--task');
const prompt = one('--prompt');
const checks = all('--check').map((c) => {
  const i = (c ?? '').indexOf('::');
  if (i < 1) die(`--check must be "name::command", got: ${c}`);
  return { name: c.slice(0, i).trim(), run: c.slice(i + 2).trim() };
});
if (!branch || !task || !prompt) die('--branch, --task and --prompt are required');
if (!/^[A-Za-z0-9._/-]+$/.test(branch) || branch.includes('..'))
  die(`invalid branch name: ${branch}`);
if (!checks.length) die('at least one --check is required — a task without a check is not a task');

// Each check must fail today, otherwise it cannot tell "done" from "not started".
const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
for (const c of checks) {
  const r = spawnSync('bash', ['-c', c.run], {
    cwd: root,
    encoding: 'utf8',
    timeout: 10 * 60 * 1000,
  });
  if (r.status === 0 && !argv.includes('--allow-passing'))
    die(
      `check "${c.name}" already passes on the current code — make it test the new work (or --allow-passing)`,
    );
  console.log(`  check fails today, as it should: ${c.name}`);
}

const spec = {
  task,
  prompt,
  base: one('--base') ?? 'main',
  order: Number(one('--order') ?? 100),
  maxRounds: Number(one('--max-rounds') ?? 4),
  ...(one('--model') ? { model: one('--model') } : {}),
  checks,
};
const file = join(root, '.claude', 'done', `${branch}.json`);
if (existsSync(file) && !argv.includes('--force'))
  die(`${file} exists — pick another branch or --force`);
const json = `${JSON.stringify(spec, null, 2)}\n`;
if (argv.includes('--dry-run')) {
  process.stdout.write(json);
} else {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, json);
  console.log(
    `loop-task: wrote ${file.slice(root.length + 1)} — commit it to main (PR); opencode-loop runs it next pass`,
  );
}
