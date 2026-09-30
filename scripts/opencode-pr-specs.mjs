#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic Agent=opencode-pr-specs Date=2026-09-28
// Audit trail: git log -- scripts/opencode-pr-specs.mjs
/**
 * opencode-pr-specs — turn the open-PR backlog into opencode-task-loop tasks.
 *
 * Why: every Claude/Copilot/Cursor session ends in a PR; nothing drives them to mergeable,
 * so the backlog grows (22 open on 28.09.2026). For each open PR this writes
 * .claude/done/<head-branch>.json: the loop then works in the PR's own branch (merge main,
 * resolve conflicts, fix failing checks, answer review comments), gates it, and the existing
 * PR is updated by the push. Nothing is merged — merging stays with the HIC.
 *
 * PRs that need a human decision are NOT queued and are listed instead: drafts, "proposal" /
 * "do not merge" titles, and PRs touching public blog/site content or the price catalogue
 * (CLAUDE.md Rule 13 and the pricing source-of-truth rule).
 *
 * Usage (DGX, ~/dws6 on main; called by `opencode-all --prs`):
 *   node scripts/opencode-pr-specs.mjs            write specs, print the HIC list
 *   node scripts/opencode-pr-specs.mjs --dry-run  print only
 * HIC decisions (remembered in ~/.local/state/opencode-all/pr-decisions.json, logged to
 * pr-decisions.log; any later run applies them):
 *   --approve 1810,2096      HIC approved the content: queue it (a draft is marked ready)
 *   --note 1495 "text"       queue it with HIC instructions for the content (implies approve)
 *   --close 2086             close the PR with a comment (branch is kept)
 *   --reset 1495             forget the decision
 * Specs are machine-local (untracked); rerunning refreshes them. Needs an authenticated gh.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry-run');
const nums = (v) =>
  String(v ?? '')
    .split(',')
    .map(Number)
    .filter(Boolean);
const DECISIONS_DIR = join(homedir(), '.local', 'state', 'opencode-all');
const DECISIONS_FILE = join(DECISIONS_DIR, 'pr-decisions.json');
const decisions = existsSync(DECISIONS_FILE)
  ? JSON.parse(readFileSync(DECISIONS_FILE, 'utf8'))
  : {};
const today = new Date().toISOString().slice(0, 10);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--approve')
    for (const n of nums(argv[++i])) decisions[n] = { decision: 'approve', at: today };
  else if (a === '--close')
    for (const n of nums(argv[++i])) decisions[n] = { decision: 'close', at: today };
  else if (a === '--reset') for (const n of nums(argv[++i])) delete decisions[n];
  else if (a === '--note') {
    const n = Number(argv[++i]);
    const note = argv[++i];
    if (!n || !note) {
      console.error('usage: --note <PR number> "<instructions>"');
      process.exit(2);
    }
    decisions[n] = { decision: 'approve', note, at: today };
  }
}
if (!DRY) {
  mkdirSync(DECISIONS_DIR, { recursive: true });
  writeFileSync(DECISIONS_FILE, `${JSON.stringify(decisions, null, 2)}\n`);
}
const logDecision = (line) =>
  !DRY &&
  writeFileSync(join(DECISIONS_DIR, 'pr-decisions.log'), `${new Date().toISOString()} ${line}\n`, {
    flag: 'a',
  });
const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const SPEC_DIR = join(ROOT, '.claude', 'done');

const HIC_TITLE = /\b(proposal|do not merge|don't merge|wip)\b/i;
// Public site content, pricing and the store need the HIC (Rule 13, pricing source of truth).
// Matched on paths, not titles: #2122 (price list) and #2096 (catalogue) were queued on
// 30.09.2026 because only config/products.json was listed.
const HIC_PATHS = [
  /^onelifetime\.world\/posts\//,
  /(^|\/)blog\//,
  /^docs\/blog-drafts\//,
  /(^|\/)config\/products\.json$/,
  /^Store\//,
  /(^|\/)price-list\//,
  /(^|\/)buy\//,
  /(^|\/)feeds\//,
  /^(landing-pages\/[^/]+|dws10\.com|dws6\.com|onelifetime\.world|lifetime\.fi)\/.*\.html$/,
  /^(landing-pages\/[^/]+|dws10\.com|dws6\.com|onelifetime\.world|lifetime\.fi)\/(_headers|_routes\.json|functions\/)/,
  /^supabase\/migrations\//,
];
// gh lists at most 100 files per PR; a truncated list cannot prove a PR is safe to automate.
const GH_FILE_LIMIT = 100;
const git = (...a) => {
  try {
    return execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
};

function gh(...args) {
  return execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

const prs = JSON.parse(
  gh(
    'pr',
    'list',
    '--state',
    'open',
    '--limit',
    '100',
    '--json',
    'number,title,headRefName,baseRefName,isDraft,files',
  ),
);

const queued = [];
const hic = [];
const closed = [];
for (const pr of prs.sort((a, b) => a.number - b.number)) {
  const files = (pr.files ?? []).map((f) => f.path);
  const d = decisions[pr.number];
  if (d?.decision === 'close') {
    if (!DRY) {
      gh(
        'pr',
        'close',
        String(pr.number),
        '--comment',
        `Closed on HIC decision (${d.at}) via opencode-all --prs --close. Branch kept.`,
      );
      logDecision(`closed #${pr.number} ${pr.title}`);
    }
    closed.push(`#${pr.number} ${pr.title}`);
    continue;
  }
  const approved = d?.decision === 'approve';
  if (approved && pr.isDraft && !DRY) {
    gh('pr', 'ready', String(pr.number));
    logDecision(`marked ready #${pr.number} (HIC approved ${d.at})`);
  }
  // A branch that shares no history with its base (main was re-rooted 27.09.2026) cannot be
  // brought up to date by merging the base in; it needs a rebuild on the base. Not even an
  // HIC approval makes the loop able to do that.
  git('fetch', '-q', 'origin', pr.baseRefName, pr.headRefName);
  const noBase =
    git('rev-parse', '--verify', '--quiet', `origin/${pr.headRefName}`) &&
    git('merge-base', `origin/${pr.baseRefName}`, `origin/${pr.headRefName}`) === null;
  if (noBase) {
    hic.push(
      `#${pr.number} ${pr.title} — shares no history with ${pr.baseRefName}: rebuild on ${pr.baseRefName} or close`,
    );
    continue;
  }
  const reason = approved
    ? null
    : pr.isDraft
      ? 'draft'
      : HIC_TITLE.test(pr.title)
        ? 'marked proposal / do-not-merge'
        : files.length >= GH_FILE_LIMIT
          ? `${files.length}+ files — too large to check automatically (HIC review)`
          : files.find((f) => HIC_PATHS.some((re) => re.test(f)))
            ? `touches ${files.find((f) => HIC_PATHS.some((re) => re.test(f)))} (blog/site/pricing — HIC approval)`
            : null;
  if (reason) {
    hic.push(`#${pr.number} ${pr.title} — ${reason}`);
    continue;
  }

  const file = join(SPEC_DIR, `${pr.headRefName}.json`);
  if (existsSync(file) && !JSON.parse(readFileSync(file, 'utf8')).pr) {
    // A hand-written task spec for this branch wins; never overwrite it.
    hic.push(`#${pr.number} ${pr.title} — has its own task spec, left as is`);
    continue;
  }
  const n = pr.number;
  const spec = {
    task: `Finish PR #${n}: ${pr.title}`,
    pr: n,
    base: pr.baseRefName,
    order: 1000 + n,
    maxRounds: 3,
    prompt: [
      `Bring PR #${n} ("${pr.title}", branch ${pr.headRefName}) to mergeable. Do not change what the PR is for.`,
      ...(approved
        ? [
            `HIC approved this PR's content on ${d.at}.${d.note ? '' : ' Do not change the content; only make it mergeable.'}`,
          ]
        : []),
      ...(d?.note
        ? [`HIC instructions for the content (apply them, then make it mergeable): ${d.note}`]
        : []),
      `1) git fetch origin && git merge origin/${pr.baseRefName} — resolve every conflict keeping both sides' intent; regenerate lockfiles/generated files with the repo's tooling, never by hand.`,
      `2) gh pr checks ${n} and gh pr view ${n} --comments: fix every failing check and every review finding that is a real bug; for optional nits, fix only if trivial.`,
      '3) Run the checks CI would run for the changed files (npx tsc --noEmit, related vitest, prettier --check).',
      `4) Commit and git push origin ${pr.headRefName} (a merge commit, never a rebase or force-push).`,
      '5) If something needs a human decision (content, pricing, policy), write it as a PR comment with gh pr comment and stop.',
    ].join('\n'),
    checks: [
      {
        name: `origin/${pr.baseRefName} is merged in`,
        run: `git fetch -q origin ${pr.baseRefName} && git merge-base --is-ancestor origin/${pr.baseRefName} HEAD`,
      },
      {
        name: 'no failing PR checks (except the Copilot reviewer app, which fails on every PR)',
        run: `out=$(gh pr checks ${n} 2>&1 | grep -v copilot-pull-request-reviewer); echo "$out" | tail -15; ! echo "$out" | grep -qiE '\\bfail(ed|ure)?\\b'`,
      },
      {
        name: 'GitHub sees it as mergeable',
        run: `m=$(gh pr view ${n} --json mergeable -q .mergeable); echo "mergeable=$m"; [ "$m" = MERGEABLE ]`,
      },
    ],
  };
  queued.push(
    `#${n} ${pr.headRefName}${approved ? (d.note ? '  (HIC approved + instructions)' : '  (HIC approved)') : ''}`,
  );
  if (!DRY) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `${JSON.stringify(spec, null, 2)}\n`);
  }
}

console.log(
  `opencode-pr-specs: ${prs.length} open PR(s); ${queued.length} queued for opencode-loop${closed.length ? `; ${closed.length} closed` : ''}${DRY ? ' (dry run)' : ''}`,
);
for (const c of closed) console.log(`  ${DRY ? 'would close' : 'closed'}  ${c}`);
for (const q of queued) console.log(`  queued  ${q}`);
if (hic.length) {
  console.log(`\nHIC — ${hic.length} PR(s) need your decision, not queued:`);
  for (const h of hic) console.log(`  ${h}`);
}
