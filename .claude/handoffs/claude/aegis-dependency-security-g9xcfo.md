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

## Follow-up (same session)

PR #1648 opened (`claude/aegis-dependency-security-g9xcfo` → `main`). No
Dependabot-alerts MCP tool exists in this session's GitHub toolset (only
`run_secret_scanning`, no alert-listing endpoint) — could not pull the 425
alerts GitHub reported on push (12 critical/164 high/183 moderate/66 low).
Instead ran real local scans across every current (non-`artifacts/`,
non-`_DEPRECATED`) lockfile/requirements file:

- `npm audit` on all 12 real `package-lock.json` dirs: clean except the
  already-tracked bumblebee `@opentelemetry/*` moderate finding.
- `pip-audit` on root `requirements.txt`, `Firehorse/requirements.txt`,
  `mcp-servers/cloud-run-gateway/requirements.txt`, `requirements-security.txt`:
  clean. `mcp-hub/requirements.txt`: found `python-dotenv` CVE-2026-28684
  (fixed, bumped 1.1.0 → 1.2.2, non-breaking) plus transitive `pyjwt`/
  `starlette` advisories (deferred — no direct pin to bump for either
  without adding an explicit constraint + FastAPI-compat check first).
  Logged both in `DWS_SECURITY_STANDARD.md` §13.6 (v3.0 → v3.1).
- Did NOT audit every `requirements.txt` in the repo (~15 total, several
  under `_DEPRECATED`/`artifacts/` dirs that look like stale worktree
  leftovers, not part of the real audit surface) — sampled the largest/most
  live ones. The gap between local scan results (near-zero) and GitHub's
  425-alert count is likely explained by: (a) requirements.txt files not yet
  sampled, (b) GitHub Actions ecosystem alerts, (c) no pip lockfile so
  transitive resolution differs run to run. Closing that gap fully needs
  either the GitHub Dependabot alerts API (not exposed via current MCP
  tools) or a full pip-audit sweep of all requirements files.

## Follow-up 2 (same session — user pasted live Dependabot alerts)

User pasted 6 real Dependabot alerts one at a time (no alert-listing MCP
tool available, so this was the only way to see actual alert content this
session). Investigated each:

- **linkify-it O(N^2) DoS** (user-supplied writeup, not a GitHub alert —
  novel finding, no GHSA/OSV entry). Confirmed real, live exposure: `src/
contentms/blog-publisher.ts` ran `markdown-it` with `linkify:true`,
  called synchronously from `createContent`/`updateContent`
  (`src/contentms/service.ts`) on `body_markdown` — customer-supplied,
  **no length limit** in the Zod schema. Fixed: `linkify:false` +
  100KB cap on `body_markdown` (`src/contentms/types.ts`).
- APScheduler insecure-deserialization RCE, `shell-quote` shell-injection,
  Vitest UI arbitrary-file-read, `axios` prototype-pollution MITM (CVSS
  9.4) — all four traced to `artifacts/pr925-worktree/` or `artifacts/
pr1295-mergecheck/`.
- OpenSSL-in-wheel + Bleichenbacher timing oracle (2 separate CVEs, same
  `cryptography==38.0.4` pin) — both traced to `mcp-servers/
cloudrun_DEPRECATED/requirements.txt`.

**Root cause identified:** `artifacts/pr925-worktree/` and `artifacts/
pr1295-mergecheck/` are full duplicate repo checkouts (997MB combined)
accidentally committed in PR #1573 as merge-check/worktree leftovers — not
referenced anywhere live. GitHub's dependency graph scans every manifest
in the tree regardless of `dependabot.yml` scoping, so this dead tree (plus
the intentionally-kept `*_DEPRECATED/` dirs) was very likely the majority
of the 425-alert count.

**User decision (asked via AskUserQuestion):** delete
`artifacts/pr925-worktree/` and `artifacts/pr1295-mergecheck/` (done, `git
rm -r`, 997MB → 45MB remaining in `artifacts/`; top-level media files and
`pr925-view.json` left untouched). Leave `*_DEPRECATED/` dirs in place —
documented as expected/accepted alert noise in `DWS_SECURITY_STANDARD.md`
§13.6 (v3.1 → v3.2), not touched.

**SEPARATE, URGENT, NOT YET RESOLVED:** found `100326.env` tracked in git
at repo root, added in PR #1573 (same commit as the artifacts/ dump),
710 bytes. Did **not** read its contents (secret-egress policy). Flagged
to the user directly in-chat for manual review and credential rotation —
git history retains it regardless of any future deletion, so this needs a
human decision (rotate + optionally purge history), not an agent action.

## Next steps if resumed

- **Confirm with the user whether `100326.env` was reviewed and any
  credentials in it rotated.** This is the highest-priority open item.
- Confirm `scripts/daily/dependabot-audit.sh` picks up the two new lockfile
  dirs on its next scheduled run (DGX Spark, 03:00–06:00 UTC).
- Someone should upgrade bumblebee's OTel deps and re-verify the OTLP
  emitter before the tracked moderate SLA lapses.
- Someone should add explicit `pyjwt`/`starlette` constraints in
  `mcp-hub/requirements.txt`, verify FastAPI 0.115.12 compatibility, and
  re-run `pip-audit` before the moderate SLA lapses.
- Watch the next `git push` output for the new GitHub alert count post
  artifacts/ cleanup — should drop substantially from 422.
- If the count is still high, remaining candidates are: GitHub Actions
  ecosystem alerts, or alerts against `*_DEPRECATED/` dirs (expected,
  accepted noise per §13.6 — do not chase these).
