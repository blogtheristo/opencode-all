# Field Note — 2026-08-28: opencode-all disclaimer + Docker node runtime

## What happened

**1. Non-affiliation disclaimer added to `blogtheristo/opencode-all`**
The OpenCode team requests that any public repo using "opencode" in its name add a note clarifying it is not built by or affiliated with the OpenCode team. Added the disclaimer to the top of `README.md` in the `blogtheristo/opencode-all` repo (public, default branch `dev`), committed as `47cce0c62`, pushed to `origin/dev`.

Memory saved: opencode-all is public — dws6-internal content must never appear there.

**2. Committed 4 pending dws6 files (commit `34bcb857d`)**
- `.workflows/opportunities.json` — refreshed hilma-watch run (3 opportunities, 330k)
- `.workflows/bids-log.jsonl` — new bid entries
- `package.json` / `package-lock.json` — playwright ^1.49.0 → ^1.62.1

**3. Push to `main` blocked — PR #1916 opened**
Two blockers discovered:
- Local CI pre-push hook fails on Windows: `flock` (Unix-only), `node` not in Git Bash PATH (bare node removed from Win11).
- GitHub branch protection rule: direct pushes to `main` require a PR.

Pushed via `chore/workflow-state-playwright-bump` branch, opened PR #1916.

**4. Docker node runtime — work in progress (interrupted)**
Root cause of local CI failures: node only lives in Docker container `dws6-node` (node:24-slim) on Win11. Started updating `scripts/local-ci.sh` to route all `node`/`npm`/`npx` calls through `docker exec -w /workspace dws6-node`. Edit was interrupted by HIC — `scripts/local-ci.sh` has 1 uncommitted change pending review.

## Next steps

- HIC: review and approve the `scripts/local-ci.sh` docker-node patch (currently uncommitted)
- Fix `flock` call in vitest check (Unix-only, replace with mkdir-based lock)
- Merge PR #1916 after local CI is fixed
- Address 8 parked blog drafts (see advisory below)

## Parked blog drafts (advisory)

8 drafts in `docs/blog-drafts/` have never been shown to the HIC for approval. They are parked — not queued for publishing. HIC should decide: read & approve, discard, or explicitly park each.

## N/A exemptions

N/A — session was substantive (new disclaimer, PR, partial hook fix).
