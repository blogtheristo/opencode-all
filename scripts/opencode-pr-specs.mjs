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
 * Specs are machine-local (untracked); rerunning refreshes them. Needs an authenticated gh.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const DRY = process.argv.includes('--dry-run');
const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const SPEC_DIR = join(ROOT, '.claude', 'done');

const HIC_TITLE = /\b(proposal|do not merge|don't merge|wip)\b/i;
const HIC_PATHS = [
  /^onelifetime\.world\/posts\//,
  /(^|\/)blog\//,
  /^docs\/blog-drafts\//,
  /(^|\/)config\/products\.json$/,
  /^Store\//,
];

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
for (const pr of prs.sort((a, b) => a.number - b.number)) {
  const files = (pr.files ?? []).map((f) => f.path);
  const reason = pr.isDraft
    ? 'draft'
    : HIC_TITLE.test(pr.title)
      ? 'marked proposal / do-not-merge'
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
  queued.push(`#${n} ${pr.headRefName}`);
  if (!DRY) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `${JSON.stringify(spec, null, 2)}\n`);
  }
}

console.log(
  `opencode-pr-specs: ${prs.length} open PR(s); ${queued.length} queued for opencode-loop${DRY ? ' (dry run)' : ''}`,
);
for (const q of queued) console.log(`  queued  ${q}`);
if (hic.length) {
  console.log(`\nHIC — ${hic.length} PR(s) need your decision, not queued:`);
  for (const h of hic) console.log(`  ${h}`);
}
