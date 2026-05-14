# Field Note: CI Hygiene Audit — main branch baseline

## Location

- Repository: `dws6`
- Branch observed: `main`
- CI surface audited: GitHub Actions checks after PR #1152 and PR #1150 landed

## Context

- **Date:** 2026-04-22
- **Author:** Claude Code (session branch `claude/ci-hygiene-audit-vBYGo`)
- **Status:** Diagnosis complete; fixes queued as separate PRs
- **Scope:** Categorise every red check on main after PR #1152 (axios fix) and PR #1150 (ai-ethics update) landed
- **Follow-up to:** `docs/field-notes/2026-04-07-github-check-failures-pr933-984.md`

## Ontology Tags

- `ci-hygiene`
- `github-actions`
- `dependency-management`
- `dependabot`
- `test-failures`
- `compliance-agent`
- `operational-baseline`

## The Story

After merging PR #1152 (axios dep) and PR #1150 (ai-ethics), main still has **8 failing
checks**. They fall into 5 distinct root causes — all actionable, none require architectural
decisions. Every fix gets its own PR per CLAUDE.md scope discipline.

| #   | Check                       | Root cause                          | Fix PR (proposed)                  | Effort |
| --- | --------------------------- | ----------------------------------- | ---------------------------------- | ------ |
| 1   | `zod` missing dep           | 4 test files cannot load            | `claude/fix-zod-missing-dep`       | 1 line |
| 2   | `submit-pypi`               | External GitHub App (no repo file)  | Settings — remove app integration  | Admin  |
| 3   | Gitleaks / test / DSR (2s)  | Pre-merge cancelled runs, not bugs  | None (self-resolving)              | 0      |
| 4   | 56 Dependabot vulns         | `npm audit fix` across sub-packages | 5× `claude/audit-fix-<pkg>`        | 1/ea   |
| 5   | Compliance agent v1.0 tests | Scoring engine never implemented    | Issue filed → decide skip vs build | TBD    |

## The Insight

The failing checks are not a single systemic outage. They break down into one missing runtime
dependency, one obsolete external integration, one class of cancelled pre-merge runs that should
self-resolve, a backlog of package vulnerabilities addressable in scoped PRs, and one product-area
gap where tests expect a scoring engine that does not yet exist. The key operational insight is
that main can return to a trustworthy CI baseline through small, isolated fixes rather than a broad
refactor or architecture decision.

**Done when:** main's CI baseline is green or every remaining red links a tracking issue.

## Next Steps

1. Land the `zod` dependency fix as a dedicated PR.
2. Remove or disable the `submit-pypi` external GitHub App integration in repository settings.
3. Re-check cancelled Gitleaks / test / DSR runs and take no code action unless they recur on fresh commits.
4. Split Dependabot remediation into small package-specific `npm audit fix` PRs.
5. File or link a tracking issue for compliance agent v1.0 scoring-engine expectations and decide whether to implement or skip the tests.

---

## 1. `zod` missing from `package.json` (CRITICAL — 4 tests blocked)

**Symptom:** 4 test files fail to load with:

```
Error: Cannot find package 'zod' imported from '/home/user/dws6/src/<file>.ts'
```

**Root cause:** `zod` is imported in 8 source files but is **not listed in
`package.json`** — exactly the same class of bug PR #1152 fixed for `axios`.

**Files importing zod (source of truth):**

- `src/config/validate-env.ts`
- `src/contentms/routes.ts`
- `src/contentms/types.ts`
- `src/middleware/validate.ts`
- `src/routes/api-keys.routes.ts`
- `src/routes/compliance.routes.ts`
- `src/routes/report-export.routes.ts`
- `src/routes/user.routes.ts`

**Tests blocked:**

- `src/__tests__/contentms.test.ts`
- `src/__tests__/e2e/smoke.test.ts`
- `src/__tests__/integration/agents.integration.test.ts`
- `src/__tests__/integration/route-validation.test.ts`

**Fix:** Add `"zod": "^3.23.8"` (or latest `^3.x`) to `dependencies` in root `package.json`,
run `npm install`, commit both `package.json` and `package-lock.json`. One-commit PR.

**Proposed branch:** `claude/fix-zod-missing-dep`
**Proposed commit:** `fix: add missing zod dependency (blocks 4 vitest suites)`

---

## 2. `submit-pypi` — external GitHub App, not in repo

**Symptom:** Every PR shows `submit-pypi` as failed, completes in ~2 seconds.

**Finding:** `submit-pypi` does **not exist** in any workflow file on any branch.
Verified via:

- `grep -rln "submit-pypi\|submit_pypi\|pypi" .github/` → only match is this and the
  previous field note
- `mcp__github__search_code "submit-pypi repo:blogtheristo/dws6"` → only field note
- `git log --all -S "submit-pypi" -- .github/` → no history of it ever existing

The check comes from an **installed GitHub App or repo integration** (likely a
remnant from an older Python packaging workflow). The run URL format
(`actions/runs/<id>`) suggests it is an Actions-triggered job from outside the repo
(e.g. a reusable workflow from another repo or an app that dispatches workflows).

**Blocker:** We have 0 Python packages to publish — this repo is TypeScript + Python
scripts, no PyPI artefacts.

**Fix:** Admin action — go to `https://github.com/blogtheristo/dws6/settings/installations`
(or **Settings → Integrations → GitHub Apps**) and remove whichever integration is posting
`submit-pypi` status checks. Alternatively, if it is a branch protection required check,
un-require it in **Settings → Branches → main → Edit → Require status checks**.

**Proposed action:** human admin step (no code PR possible).

---

## 3. Gitleaks / test / Dependency Review 2-second failures

**Symptom:** On PRs #1151 and #1152, four checks (`Gitleaks Secret Scan`, two `test`
jobs, `Dependency Security Review`) all failed within 2–4 seconds — too fast to have
run `actions/checkout` let alone their payload.

**Finding:** Local reproduction confirms these workflows are correctly configured:

- `gitleaks detect --config .gitleaks.toml` on full history → `no leaks found` (1477 commits, 2.85 GB scanned)
- `npx vitest run` → only 8 tests fail (zod + compliance, see §1 and §5)
- `dependency_review.yml` uses `npm audit || true` — can't fail fast on legit audit findings

The 2-second failures all cluster around a single timestamp (02:35:35 ±2s), which
correlates with **GitHub's workflow-concurrency cancellation** — when a new push
supersedes an in-flight run, older runs report `completed / failure` immediately.
This is a benign artefact of rapid successive pushes and should self-resolve once a
run lands on main with no superseding push.

**Fix:** No code change required. Re-run the checks on a quiet window or after the next
push to confirm. If they persist on a stable sha, treat as a new bug.

**Proposed branch:** none (observation only).

---

## 4. Dependency Security Review — 56 vulnerabilities across monorepo

**Symptom:** Dependabot reports 29 high / 26 moderate / 1 low on the default branch.

**Breakdown by `package.json`** (each has its own lockfile, hence its own audit):

| Package                                   | Vulns         | High | Moderate | Fix             |
| ----------------------------------------- | ------------- | ---- | -------- | --------------- |
| `/package.json` (root, Express backend)   | 7 (1L, 6H)    | 6    | 0        | `npm audit fix` |
| `/mobile-dashboard/package.json`          | 19 (17H, 2M)  | 17   | 2        | `npm audit fix` |
| `/src/cloudflare/package.json`            | 12 (6H, 6M)   | 6    | 6        | `npm audit fix` |
| `/Firehorse/mobile-app/package.json`      | 20 (17H, 3M)  | 17   | 3        | `npm audit fix` |
| `/dws6.com/dashboard/firehorse/v10-react` | 2 (2H)        | 2    | 0        | `npm audit fix` |
| `/dws6.com/tools/content-pipeline`        | ≥1H           | 1+   | ?        | `npm audit fix` |
| `/cli/package.json`                       | 0             | 0    | 0        | ✅ clean        |
| `/lambda/ses-inbound-parser/package.json` | (no lockfile) | —    | —        | out of scope    |

All are transitive patch/minor bumps (lodash, flatted, path-to-regexp, picomatch,
qs, rollup, vite). Root-level top offenders:

| Package          | Severity | Advisory                               |
| ---------------- | -------- | -------------------------------------- |
| `vite`           | High     | GHSA-4w7w-66w2-5vf9 (path traversal)   |
| `rollup`         | High     | GHSA-mw96-cpmx-2vgc (path traversal)   |
| `path-to-regexp` | High     | GHSA-37ch-88jc-xwx2 (ReDoS)            |
| `picomatch`      | High     | GHSA-3v7f-55p6-f55p (method injection) |
| `lodash`         | High     | GHSA-f23m-r3pf-42rh (prototype poll)   |
| `flatted`        | High     | GHSA-rf6f-7fwh-wjgh (prototype poll)   |
| `qs`             | Low      | GHSA-w7fw-mjwx-w883 (DoS)              |

**Fix discipline:** One PR per sub-package (5 PRs total — 6 if we count content-pipeline).
Each PR:

1. `cd <pkg> && npm audit fix`
2. Verify `npm test` (or `npm run build`) still passes in that workspace
3. Commit `package-lock.json` only (no source changes)

**Proposed branches (one each):**

- `claude/audit-fix-root`
- `claude/audit-fix-mobile-dashboard`
- `claude/audit-fix-cloudflare`
- `claude/audit-fix-firehorse-mobile-app`
- `claude/audit-fix-v10-react`
- `claude/audit-fix-content-pipeline`

**Also:** `.github/dependabot.yml` is currently **empty (0 bytes)**. Enabling
weekly Dependabot PRs would prevent this from recurring. Separate PR proposed:
`claude/enable-dependabot-weekly`.

---

## 5. Compliance agent v1.0 scoring engine — 4 tests assert missing features

**Symptom:** `src/__tests__/compliance-agent-integration.test.ts` has 4 failing tests:

- `includes scoring engine fields in response` — `r.costEstimates.ets` is undefined
- `ETS cost estimate reflects high emissions` — same missing field
- `ESRS data points improve CSRD score` — score does not change when `dataPoints` supplied (stays 55)
- `metadata includes scoringEngine v1.0` — `result.metadata.scoringEngine` is undefined

**Root cause:** The tests expect a **ComplianceAgent v1.0 scoring engine** with:

- `result.costEstimates.ets.{estimatedCost, surrenderObligation}`
- `result.costEstimates.cbam.estimatedCost`
- `result.dataCompleteness` (number)
- `result.report.{reportId, metadata.framework}`
- `result.metadata.scoringEngine === 'v1.0'`
- ESRS `dataPoints[]` must influence `overallScore`

`src/agents/compliance.agent.ts` (510 lines) **does not implement any of these**.
The tests appear to be **written ahead of implementation** (TDD red state that was
merged) — or the scoring engine was removed in a refactor.

**Options:**

- **(a) Implement the scoring engine** — large scope (new calculators, ESRS integration,
  audit report generator). Needs `/plan-ceo-review` + `/plan-eng-review` per CLAUDE.md
  design-first gate (touches 3+ files).
- **(b) Skip the 4 tests** with `it.skip(..., 'v1.0 scoring engine not yet implemented — see issue #XXX')`
  and file a tracking issue. Minimal, unblocks CI immediately.

**Recommendation:** Option (b) as a CI-hygiene measure, paired with a GitHub issue
that links back to this note. Real implementation goes in a separate feature branch
under design-first review.

**Proposed branches:**

- `claude/skip-compliance-v1-tests` (hygiene — 1 file)
- Tracking issue: `compliance agent v1.0 scoring engine — implement or delete tests`

---

## What is NOT touched (scope discipline)

- `ai-pr-review.yml` has a YAML parse error at line 248/249 per Python yaml.safe_load.
  GitHub tolerates it (composite action string maybe), but worth a separate audit.
- 5th test file failure — `erp-routes.test.ts` — uses `vi.fn(() => mockService)` as a
  constructor, which throws `() => mockService is not a constructor`. Separate PR.
- `Build Staging Image` and `Notify on Failure` checks failed on main too — likely
  missing `STAGING_*` secrets. Separate infra triage, out of audit scope.

---

## Verification plan (once fixes land)

1. PR #zod → re-run vitest → 4 test files load cleanly; failing count drops from 8 to 4
2. Admin removes `submit-pypi` app integration → check disappears from subsequent PRs
3. 5× audit-fix PRs merge → `npm audit` reports 0 high in each sub-package
4. `claude/skip-compliance-v1-tests` merges → vitest reports 0 failures, test-files clean
5. Trigger one no-op PR on main → every required check is green (baseline achieved)

## One-line status

**main CI baseline:** red → yellow (after zod fix) → green (after the 6 audit-fix PRs + admin removes submit-pypi + compliance tests skipped or implemented).
