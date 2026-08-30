# Handoff — backup/runbook-and-tree-gate (2026-08-24)

## Decisions taken
1. **#1888 incident recovered**: main restored via explicit restore commit
   (#1890); poisoned `197daefdb` kept in history as evidence.
2. **Defense layers deployed**: GitHub protection on main (PR required,
   force/deletion banned, review requirement removed by HIC), independent
   DGX cron backup (02:17 daily, mirror+bundle+manifest+flock+fail-closed,
   Sunday restore exercise PASS vs manifest tree-hash), dws7 off-host archive
   (branch+tag at `41ee234f2`), local-ci.sh worktree-root fix (#1891).
3. **Root causes closed**: fixture cwd-escape (Dev Fixture identity leaked
   into main repo config — removed), `core.bare=true` in main
   `.git/config.worktree` (removed, evidence in
   `/home/admin100/dws6-backups/2026-08-24/evidence-main-config.worktree.bak`).
4. **DDM-v1.1 merged** (#1892): working contract, restart-safe handoff,
   evidence hierarchy, invariant design as human role.
5. Retry-fixture test quarantined (`describe.skip`) pending forensics;
   GIT_TRACE rerun did NOT reproduce escape (all preserved code paths
   properly cwd'd) — vulnerable combination no longer exists.

## Uncertainties
- Exact mechanism of the original escape (config-level evidence confirms it;
  code-level reproduction failed).
- Poisoned-tree-gate fixture matrix: 12 tests, last full run failed
  universally due to the (now-fixed) bare-config corruption — **never re-run
  after rewrite**. Expected to largely pass now; diagnose any remainder fresh.

## Next bounded step
Run `npx vitest run scripts/__tests__/poisoned-tree-gate.fixture.test.mjs`
in worktree `/tmp/opencode/backup-plan` (branch
`backup/runbook-and-tree-gate`, contains gate + fixtures + runbook §6.1).
Fix failures one at a time (each case fully independent), add §9
defense-in-depth roadmap (Boardy layering + Actions-based tree gate),
push, open PR. Then: canary into quarantined fixture before un-skipping.

## Environment notes
- Main checkout healthy again (`core.bare=false`, stray config.worktree
  bare-line removed, Dev Fixture identity removed from main config).
- Cron installed: `17 2 * * *` → `/home/admin100/dws6-backups/bin/dws6-backup-cron.sh`.
- Proton transfer of bundle still pending (HIC, Win11).
- PRs open: #1891 (ci-fix, awaiting HIC merge — DONE? check), #1892 merged.
