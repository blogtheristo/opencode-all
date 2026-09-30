#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=hic-console Date=2026-09-30
// Audit trail: git log -- scripts/hic.mjs
/**
 * hic — one command for the HIC's side of the opencode loop (DGX, ~/dws6).
 *
 *   hic                       digest: loop health, what is merge-ready, what needs you, what is blocked
 *   hic --brief               one line, for the login banner
 *   hic merge N [N...]        merge PRs — refuses unless not draft, MERGEABLE and CI green
 *                             (--yes skips the prompt; --merge / --rebase instead of squash;
 *                              --approved-content is required for blog/pricing PRs, Rule 13)
 *   hic approve N,N           HIC read the content: queue it for the loop
 *   hic note N "text"         queue it with HIC instructions
 *   hic close N,N             close with a comment (branch kept)
 *   hic reset N               forget a decision
 *   hic log [LINES]           loop alerts (BLOCKED, DONE, invalid spec)
 *
 * approve / note / close / reset are `opencode-all --prs` verbs: same decisions file, same audit log.
 * Nothing here merges without an explicit `hic merge`; merging stays with the HIC.
 * Needs `gh` (authenticated) and tmux (loop health = tmux session oc-loop).
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOOP_STATE = join(homedir(), '.local/state/opencode-task-loop');
const argv = process.argv.slice(2);
const cmd = argv[0] && !argv[0].startsWith('--') ? argv[0] : 'digest';
const has = (f) => argv.includes(f);

// Public-site content and the price catalogue need the HIC's eyes first (CLAUDE.md Rule 13, pricing rule).
const CONTENT =
  /^(docs\/blog-drafts\/|(onelifetime\.world|dws10\.com|dws6\.com|lifetime\.fi)\/(blog\/|.*\.html$)|.*products\.json$|landing-pages\/)/;
const NOISE_CHECK = /copilot-pull-request-reviewer/i;

const sh = (bin, args, opts = {}) => {
  try {
    return execFileSync(bin, args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      ...opts,
    }).trim();
  } catch {
    return null;
  }
};
const gh = (args) => {
  const out = sh('gh', args);
  if (out === null) {
    console.error('hic: `gh` failed or is not authenticated — run `gh auth status`');
    process.exit(2);
  }
  return out;
};
const readJson = (p, fallback) => {
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
};

function ci(pr) {
  const checks = (pr.statusCheckRollup ?? []).filter(
    (c) => !NOISE_CHECK.test(c.name ?? c.context ?? ''),
  );
  const bad = checks.filter((c) =>
    ['FAILURE', 'ERROR', 'TIMED_OUT', 'CANCELLED', 'ACTION_REQUIRED', 'STARTUP_FAILURE'].includes(
      c.conclusion ?? c.state,
    ),
  );
  const pending = checks.filter(
    (c) => !(c.conclusion ?? (c.state && c.state !== 'PENDING' ? c.state : null)),
  );
  return { bad, pending, total: checks.length };
}

function classify(pr, loopState) {
  const c = ci(pr);
  const content = (pr.files ?? []).some((f) => CONTENT.test(f.path));
  const branchState = loopState[`${pr.headRefName}`]?.status ?? null;
  let bucket;
  if (pr.isDraft) bucket = 'you';
  else if (content) bucket = 'you';
  else if (pr.mergeable === 'CONFLICTING' || c.bad.length) bucket = 'loop';
  else if (c.pending.length || pr.mergeable === 'UNKNOWN') bucket = 'wait';
  else if (c.total === 0)
    bucket = 'you'; // no CI evidence: never call it ready
  else bucket = 'ready';
  const why = [
    pr.isDraft && 'draft',
    content && 'content/pricing — Rule 13',
    pr.mergeable === 'CONFLICTING' && 'conflict',
    c.bad.length &&
      `CI red: ${c.bad
        .map((x) => x.name ?? x.context)
        .slice(0, 2)
        .join(', ')}`,
    c.pending.length && 'CI running',
    c.total === 0 && !pr.isDraft && 'no CI results',
  ].filter(Boolean);
  return { bucket, why: why.join('; '), loop: branchState };
}

function loadPrs() {
  const raw = gh([
    'pr',
    'list',
    '--state',
    'open',
    '--limit',
    '100',
    '--json',
    'number,title,headRefName,isDraft,mergeable,statusCheckRollup,files,url',
  ]);
  return JSON.parse(raw);
}

function loopHealth() {
  const active = sh('tmux', ['has-session', '-t', 'oc-loop']) === null ? 'down' : 'active';
  const timer = sh('systemctl', ['--user', 'is-active', 'opencode-loop.timer']);
  const state = readJson(join(LOOP_STATE, 'state.json'), {});
  const tally = {};
  for (const [, v] of Object.entries(state))
    tally[v.status ?? '?'] = (tally[v.status ?? '?'] ?? 0) + 1;
  return { active, timer, state, tally };
}

function tailAlerts(n) {
  const f = join(LOOP_STATE, 'alerts.log');
  return existsSync(f) ? readFileSync(f, 'utf8').trim().split('\n').slice(-n) : [];
}

const fmt = (pr, k) =>
  `  #${pr.number}  ${pr.title.slice(0, 64)}${k.why ? `\n        ${k.why}` : ''}${k.loop ? `  [loop: ${k.loop}]` : ''}`;

async function digest() {
  const health = loopHealth();
  const prs = loadPrs().map((pr) => ({ pr, k: classify(pr, health.state) }));
  const by = (b) => prs.filter((x) => x.k.bucket === b);
  const [ready, you, loop, wait] = ['ready', 'you', 'loop', 'wait'].map(by);
  const blocked = Object.entries(health.state)
    .filter(([, v]) => v.status === 'blocked')
    .map(([b]) => b);

  if (has('--brief')) {
    const svc =
      health.active === null
        ? 'loop ?'
        : health.active === 'active'
          ? 'loop up'
          : `LOOP ${health.active.toUpperCase()}`;
    console.log(
      `hic: ${svc} · ${ready.length} merge-ready · ${you.length} need you · ${blocked.length} blocked → run: hic`,
    );
    return;
  }

  const svc = health.active;
  console.log(
    `LOOP     service ${svc} · autostart timer ${health.timer ?? 'unknown'} · tasks ${JSON.stringify(health.tally)}`,
  );
  if (health.active !== 'active')
    console.log('         → opencode-loop start   (auto: bash scripts/install-opencode-loop.sh)');

  console.log(`\nMERGE-READY (${ready.length})   → hic merge N`);
  ready.forEach(({ pr, k }) => console.log(fmt(pr, k)));
  console.log(
    `\nNEED YOU (${you.length})   → read it, then: hic approve N | hic note N "…" | hic close N`,
  );
  you.forEach(({ pr, k }) => console.log(fmt(pr, k)));
  console.log(`\nLOOP IS ON IT (${loop.length})   conflict or red CI — nothing for you to do`);
  loop.forEach(({ pr, k }) => console.log(fmt(pr, k)));
  if (wait.length)
    console.log(
      `\nWAITING ON CI (${wait.length}): ${wait.map((x) => `#${x.pr.number}`).join(' ')}`,
    );
  if (blocked.length) {
    console.log(
      `\nBLOCKED TASKS (${blocked.length})   → edit the spec/handoff to retry, or hic close its PR`,
    );
    blocked.forEach((b) => console.log(`  ${b}`));
    tailAlerts(200)
      .filter((l) => /BLOCKED/.test(l))
      .slice(-3)
      .forEach((l) => console.log(`    ${l}`));
  }
}

async function merge() {
  const nums = argv.slice(1).filter((a) => /^\d+$/.test(a));
  if (!nums.length)
    return console.error(
      'usage: hic merge N [N...] [--yes] [--merge|--rebase] [--approved-content]',
    );
  const strategy = has('--merge') ? '--merge' : has('--rebase') ? '--rebase' : '--squash';
  const state = loopHealth().state;
  const rl = has('--yes')
    ? null
    : createInterface({ input: process.stdin, output: process.stdout });
  for (const n of nums) {
    const pr = JSON.parse(
      gh([
        'pr',
        'view',
        n,
        '--json',
        'number,title,headRefName,isDraft,mergeable,statusCheckRollup,files,url',
      ]),
    );
    const k = classify(pr, state);
    const content = (pr.files ?? []).some((f) => CONTENT.test(f.path));
    if (content && !has('--approved-content')) {
      console.log(
        `#${n} REFUSED: touches blog/site/pricing content — read it, then rerun with --approved-content`,
      );
      continue;
    }
    if (
      pr.isDraft ||
      pr.mergeable !== 'MERGEABLE' ||
      ci(pr).bad.length ||
      ci(pr).pending.length ||
      ci(pr).total === 0
    ) {
      console.log(`#${n} REFUSED: ${k.why || `mergeable=${pr.mergeable}`} — not merge-ready`);
      continue;
    }
    if (rl) {
      const a = (await rl.question(`Merge #${n} "${pr.title}" (${strategy.slice(2)})? [y/N] `))
        .trim()
        .toLowerCase();
      if (a !== 'y') {
        console.log(`#${n} skipped`);
        continue;
      }
    }
    const r = spawnSync('gh', ['pr', 'merge', n, strategy], { cwd: ROOT, stdio: 'inherit' });
    console.log(r.status === 0 ? `#${n} merged` : `#${n} merge FAILED`);
  }
  rl?.close();
}

const prsVerb = () => {
  const map = { approve: '--approve', note: '--note', close: '--close', reset: '--reset' };
  const rest = argv.slice(1);
  if (!rest.length) return console.error(`usage: hic ${cmd} N${cmd === 'note' ? ' "text"' : ''}`);
  const r = spawnSync('bash', ['scripts/opencode-open-all.sh', '--prs', map[cmd], ...rest], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  process.exit(r.status ?? 1);
};

switch (cmd) {
  case 'digest':
    await digest();
    break;
  case 'merge':
    await merge();
    break;
  case 'approve':
  case 'note':
  case 'close':
  case 'reset':
    prsVerb();
    break;
  case 'log':
    tailAlerts(Number(argv[1]) || 30).forEach((l) => console.log(l));
    break;
  default:
    console.error(
      'usage: hic [--brief] | merge N | approve N | note N "text" | close N | reset N | log [LINES]',
    );
    process.exit(1);
}
