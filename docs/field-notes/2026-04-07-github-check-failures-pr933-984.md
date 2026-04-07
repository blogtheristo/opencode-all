# Field Note: GitHub Check Failures on PRs 933–984

**Date:** 2026-04-07
**Author:** Risto Päärni
**Status:** Root cause found (Gitleaks), others under investigation
**Scope:** PRs #933–#984 (52 PRs, all merged)

---

## Summary

Every PR merged between #933 and #984 has at least one failed GitHub check. Most failures appear to be false positives or infrastructure-related rather than genuine code defects. This note captures the symptom pattern for later study and re-validation.

## Failure Patterns

### 1. Gitleaks Secret Scan — 52/52 PRs (100%) — ROOT CAUSE FOUND

**Not a secret detection issue.** The `gitleaks-action@v2` crashes with a 403 permissions error on every PR:

```
RequestError [HttpError]: Resource not accessible by integration
Status: 403
URL: https://api.github.com/repos/blogtheristo/dws6/pulls/<N>/commits
x-accepted-github-permissions: pull_requests=read
```

The action needs to list PR commits via the GitHub API, but the workflow only grants:
```yaml
permissions:
  contents: read
  security-events: write
```

Missing: `pull-requests: read`. This is why it **passes on `main` push** (no PR API call) but **fails on every PR** (403 on commits endpoint).

**Fix:** Add `pull-requests: read` to `.github/workflows/secret-scan-gitleaks.yml` permissions block.

**Affected:** ALL PRs #933–#984

### 2. Unit Tests + Coverage — 17 PRs

PRs with test failures: 933, 935, 936, 944, 946, 953, 958, 960, 962, 966, 967, 971, 972, 973, 974, 982, 984

Some PRs show the check listed twice (two separate runs, both failing). Many of these PRs are docs-only or field-note PRs that shouldn't trigger test failures — suggesting the test suite itself has a pre-existing broken test or the workflow runs against stale deps.

### 3. Dependency Security Review — 9 PRs (933–942)

PRs: 933, 934, 935, 937, 938, 939, 940, 941, 942

All in a contiguous block (PRs 933–942), then stops. Likely a workflow that was removed or fixed around PR #943.

### 4. submit-pypi — 9 PRs (933–946)

PRs: 933, 935, 937, 938, 939, 940, 941, 942, 946

Same contiguous pattern as Dependency Security Review. A Python packaging workflow that shouldn't be running on non-Python PRs.

### 5. Ruff Check — 2 PRs

PRs: 969, 975 — both touch Python files, so this is a legitimate lint gate. Likely real.

### 6. pr-security-check — 3 PRs

PRs: 933, 935, 940 — early block only.

### 7. OWASP ZAP Baseline — 1 PR

PR: 936 (security CI gates PR) — may be expected since DAST was being configured.

### 8. check-images — 1 PR

PR: 934 — image guardian flagging something.

## Root Cause Analysis

### Gitleaks (confirmed)

**Permissions bug.** `gitleaks-action@v2` needs `pull-requests: read` to call `GET /repos/{owner}/{repo}/pulls/{pull_number}/commits`. The workflow was missing this permission since it was created, so it has NEVER worked on PRs — only on `push` to `main`.

Gitleaks v8.24.3 on the runner. The action itself doesn't even get to scan — it crashes in the API call before running the secret detector.

### Other failures (hypothesis)

Workflows appearing/disappearing in blocks (Dependency Review, submit-pypi) and test failures on docs-only PRs suggest additional issues:
- Stale workflow files running checks that no longer apply
- Test suite with pre-existing failures unrelated to PR content
- Possible GitHub Actions billing/quota noise

## Verification Plan

- [ ] Re-run Gitleaks on latest `main` — confirm if it passes now
- [ ] Run `npm run test` locally to verify test suite health
- [ ] Check if `.gitleaks.toml` baseline needs updating
- [ ] Confirm `submit-pypi` and `Dependency Security Review` workflows are removed/disabled
- [ ] Re-run a recent PR's checks after billing/account is healthy
- [ ] Update this note with verification results and date

## PR Reference Table

| Check Name | Failed Count | PR Range | Likely Cause |
|---|---|---|---|
| Gitleaks Secret Scan | 52 | 933–984 (all) | **Missing `pull-requests: read` permission** |
| Unit Tests + Coverage | 17 | scattered | Pre-existing broken test or dep issue |
| Dependency Security Review | 9 | 933–942 | Removed workflow |
| submit-pypi | 9 | 933–946 | Irrelevant workflow |
| pr-security-check | 3 | 933–940 | Removed workflow |
| Ruff Check | 2 | 969, 975 | Likely real (Python lint) |
| OWASP ZAP Baseline | 1 | 936 | Expected (DAST config PR) |
| check-images | 1 | 934 | Image guardian |

## Fix (Gitleaks)

**Two issues found:**

1. **Permissions bug** — Missing `pull-requests: read` (403 on PR commits API)
2. **License issue** — `gitleaks/gitleaks-action@v2` requires a paid license for non-open-source repos. Only the gitleaks CLI binary is free/open-source (MIT license).

**Solution:** Replace `gitleaks-action@v2` with direct CLI install + run. The CLI is MIT-licensed, no API token needed, and scans git log ranges directly:

- PR events: scan `base.sha..head.sha` (only the PR diff)
- Push to main: scan `before..sha` (only the new commits)

No `GITHUB_TOKEN` or `pull-requests` permission needed — the CLI reads the local git repo directly.

## Remaining Next Steps

- [ ] Apply the Gitleaks permissions fix (one-line change)
- [ ] Re-run Gitleaks on an open PR to confirm green
- [ ] Run `npm run test` locally to verify test suite health
- [ ] Confirm `submit-pypi` and `Dependency Security Review` workflows are removed/disabled
- [ ] Update this note with verification results and date
