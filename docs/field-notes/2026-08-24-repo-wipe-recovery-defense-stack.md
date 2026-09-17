# Field Note — Repository Wipe Incident (#1888), Full Recovery, and the DWS Defense-in-Depth Stack

**Date:** 2026-08-24
**Tool:** OpenCode 1.18.22 · **Model:** opencode/x-preview-f-free (ox-alpha)
**Session:** interactive HIC ping-pong (manual ping-pong mode)

## What happened

A regression-test fixture escaped its sandbox during a pre-push vitest run:
a `git commit -m baseline` authored by the fixture identity (`Retry Test
<test@lifetime.fi>`) landed in the host worktree and deleted 5755 files.
The branch was pushed (with audited `SKIP_LOCAL_CI` — the local-ci script
was testing an unrelated checkout) and merged via PR #1888. `origin/main`
collapsed to a single-file tree: 6797 files gone, −2,378,360 lines.

## Recovery (≈2 h, zero data loss)

1. Known-good base `745267975` identified; four verified fix commits
   cherry-picked (tree-count checked per commit) → PR #1890.
2. GitHub could not cleanly merge recovery into the poisoned tip → single
   explicit restore commit with parent = poisoned main, tree = verified tree.
3. Post-merge verification: tree-hash + file-count from a detached worktree.

## Root causes (two independent defects)

1. **Fixture cwd-escape**: a fixture git call executed against the host repo
   (proven at config level: fixture identity leaked into main `.git/config`
   as `[user] Dev Fixture`). GIT_TRACE rerun did not reproduce with preserved
   code; vulnerable combination removed by ctx-refactor.
2. **`core.bare=true` contamination**: main `.git/config.worktree` set bare
   for the main checkout only, breaking worktrees intermittently and masking
   diagnosis. Removed; evidence saved to the backup snapshot dir.

## Defense stack now in place

| Layer | Mechanism |
| --- | --- |
| Prevent | poisoned-tree gate (`scripts/poisoned-tree-gate.mjs`, sandbox matrix), local-ci resolves caller worktree (#1891) |
| Block | GitHub protection on main: PR required, force/deletion banned, enforce_admins (negative tests: direct push + force push both rejected server-side) |
| Detect | cron backup health manifest; planned Actions anomaly check |
| Recover | independent DGX cron bundle (mirror.git, flock, fail-closed, 30d retention) + dws7 archive refs + Proton pending |
| Prove | weekly restore exercise vs manifest tree-hash/file-count (PASS) |

## Lessons codified

- DDM-v1.1 (#1892): §4a working contract, §8.1 restart-safe handoff,
  §8.2 evidence hierarchy, §13.1 invariant design as the human role.
- Runbook v1.0: 3-2-1 copies, pre-cycle snapshots, canaries, gated
  destructive ops, retention, weekly restore exercise.
- "Green tests" prove code, never tree integrity — integrity needs its own
  gate.
