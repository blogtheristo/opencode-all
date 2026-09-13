# Handoff — `claude/agents-md-table-columns` (PR #2001)

**Updated:** 2026-09-13 · **Head:** `26fd48e8` · **Base:** `origin/main` (`a069af0a`)
**Status:** open, CI green as of `6c30d979`; awaiting re-run on `26fd48e8`.
**Blocked on:** one HIC decision (below). Not blocked on code.

## What this branch does

Fixes `AGENTS.md` §7 "Platform Agents (`src/agents/`)" and the two scripts that
are supposed to keep it true. Six faults, in two commits:

**`915cb889` — what the generator wrote**

1. Columns inverted against the header — 15 rows showed a class name under "Role".
2. Insertion anchor `/(sovereignty-monitor|quality-gate|viability)/` returned the
   EARLIEST match, so new agents were inserted mid-table.
3. `let model = 'Llama 3.3 70B'` hardcoded — the table asserted one model for all
   42 rows while the agents declare nine. Five running `claude-sonnet-5` were
   documented as Llama.

**`eef84de0` — what the generator could see**

4. Flat `readdirSync('src/agents')` in BOTH `sync-agents-md.mjs` and
   `verify-agents-md.mjs`: 43 of 75 `*.agent.ts` files. 32 agents in
   `workflow/`, `workflow/industry/`, `consultant/`, `seo/`, `world-model/`,
   `loop-engineering/` were invisible to the generator and un-flaggable by the
   verifier — which the document cites as its guarantee of freshness.
5. Descriptions truncated at the first string literal (several agents concatenate
   across lines). `helpdesk` had already shipped that way in `915cb889`.
6. Verifier row regex unanchored, so it read the Default model cell as an agent
   name (`placeholder`, `deterministic` reported as undocumented agents).

Traversal now lives in **`scripts/lib/agent-files.mjs`**, shared by both scripts.
It throws on a basename collision rather than dropping an agent.

## Verification on this head

```
node scripts/verify-agents-md.mjs --section agent-list → Grade A, 74/74, 0 failures
node scripts/verify-agents-md.mjs                      → Grade A, 82/89, 7 warnings (pre-existing)
node scripts/sync-agents-md.mjs --dry-run              → already in sync (idempotent)
node scripts/evidence-audit.mjs <changed>              → 0 missing Evidence header
npx vitest run scripts/__tests__/agent-files-traversal.test.mjs → 7 passed
npx vitest run (full)                                  → 1284 passed, 2 failed
prettier --check                                       → clean
```

The 2 failures are `poisoned-tree-gate.fixture.test.mjs:635` and `:644` — red on
every runner except the DGX (`/home/admin100/dws6`), pre-existing, unrelated.

**Pushes used `SKIP_LOCAL_CI=1`** (the audited bypass, never `--no-verify`).
Local CI fails 5/6 checks in this container for reasons unrelated to a markdown +
`.mjs` change: `gitleaks` binary absent (exit 2), `npm audit` advisories, `ruff`
check and format on Python. Record: `.ci-audit/runs/20260913T090002Z_eef84de0b0b0.json`.

## The one open decision (HIC)

**Should `AGENTS.md` carry a "Default model" column at all?**

1. Keep it generated — what this branch does. True today, stays true only if the
   sync runs (which is what #1999 restores).
2. Drop it. The model belongs to the code; the inventory names agents and roles.
3. Keep it and register the agent→model mapping in `config/truth/` so
   `lint-truth-claims.mjs` fails on drift.

Recommendation: **3** — the only option where a wrong model is _caught_ rather
than hoped against. Field note:
`docs/field-notes/2026-09-11-controls-pointed-at-each-other.md` (PENDING_REVIEW),
§6 the decision, §7 the 09-13 addendum.

Also noted, not blocking: AGENTS.md is now **906 lines** against a ≤150 target
(`verify-agents-md.mjs` warns at >1200). The 32 added rows are facts the document
was missing; they are also 32 more rows. A slimming pass is its own change.

## Depends on

**PR #1999** (`claude/agents-md-sync-via-pr`, head `5daea561`) — makes the sync
open a PR instead of pushing to `main`, which `main` forbids. Without it the
generator fixed here still cannot deliver. Merge #1999 first; the appearance of
`refs/heads/chore/agents-md-sync` is its first real verification (it does not
exist yet).
