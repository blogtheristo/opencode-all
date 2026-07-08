# Handoff: claude/aegis-dependency-security-g9xcfo

## Task

Better dependency management for the DWS IQ Aegis product line (defence/dual-use
sovereign platform, Store/PRODUCT_AEGIS.md) — closing supply-chain gaps found
by the security-review command.

## State: DONE (this pass)

Fixed three concrete dependency-management gaps:

1. **Missing lockfiles** — `lambda/ses-inbound-parser/package-lock.json` and
   `infrastructure/dgx-spark/bumblebee/package-lock.json` generated and
   committed (`npm install --package-lock-only`, no network side effects,
   no node_modules committed). Both dirs already had `package.json` and were
   already listed in `.github/dependabot.yml`, but `npm audit` couldn't run
   against them without a lockfile.
2. **Audit script blind spots** — `scripts/daily/dependabot-audit.sh`
   `PACKAGE_DIRS` was missing `mcp-hub-ts`, `mcp-servers/cloud-run-gateway-ts`,
   and the two directories above, and referenced a non-existent
   `mobile-dashboard` dir (real name: `mobile-dashboard_RETIRED`). Fixed the
   list so the daily audit — which feeds the Aegis triage agent
   (`src/agents/aegis.agent.ts`) — actually covers every `package.json` in
   the repo.
3. **Documentation** — added `DWS_SECURITY_STANDARD.md` §13.6 (Dependency
   Lockfile & Vulnerability SLA Policy), version bumped 2.9 → 3.0. Documents
   the lockfile requirement, the Aegis SLA tiers (critical=2d/high=7d/
   moderate=30d/low=90d) as canonical policy, and logs an open moderate
   finding (`GHSA-8988-4f7v-96qf`, `@opentelemetry/*` in the bumblebee
   scanner) that needs a breaking-change upgrade — deferred, not force-fixed
   blind, tracked with a 30-day SLA clock from 08.07.2026.
4. Fixed a stale doc comment in `src/agents/aegis.agent.ts` (said
   `.github/dependabot.yml` was still 0 bytes; it has been populated for a
   while).

## Not done / explicitly out of scope this pass

- Did NOT force-upgrade `@opentelemetry/*` in bumblebee (breaking change,
  needs OTLP pipeline re-verification by an owner — see §13.6 tracked item).
- Did NOT add pip lockfiles (`pip-compile`/hashes) across the ~15
  `requirements.txt` files — flagged as a gap in the research pass but is a
  much larger, separate piece of work (no `poetry`/`pip-tools` currently in
  use repo-wide); raise separately if wanted.
- Did NOT touch GitHub Actions tag-vs-SHA pinning (§13.2 non-compliance,
  pre-existing, unrelated to this task's scope).
- Did not run `npm install`/full test suite (root node_modules not
  installed in this sandbox); changes are additive/comment-only in .ts and
  don't affect existing test behavior. Shell script syntax verified with
  `bash -n`.

## Next steps if resumed

- Confirm `scripts/daily/dependabot-audit.sh` picks up the two new lockfile
  dirs on its next scheduled run (DGX Spark, 03:00–06:00 UTC).
- Someone should upgrade bumblebee's OTel deps and re-verify the OTLP
  emitter before the tracked moderate SLA lapses.
