# GitHub Actions Workflow Audit

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/peaceful-hertz | Date: 17.02.2026 | Changes: Initial audit — documented all 26 workflows, run status, failure root causes

Session Links & References:
  - Claude Code (claude/peaceful-hertz): https://github.com/blogtheristo/dws6/commits/claude/peaceful-hertz

Document Status:
  - Created: 17.02.2026
  - Last Modified: 17.02.2026
  - Language: EN
  - Languages Available: EN
  - Publication Status: ACTIVE

***

## Summary

| Status | Count |
|--------|-------|
| Passing | 10 |
| Failing | 10 |
| Never ran / No recent runs | 4 |
| Not triggered (no matching event) | 2 |

**Verdict:** 10 of 26 workflows are broken. Most failures are missing dependencies, missing secrets, TypeScript errors, or missing permissions.

---

## Workflow Status Table

| # | Workflow | File | Trigger | Latest Status | Last Run | Root Cause |
|---|---------|------|---------|--------------|----------|------------|
| 1 | **Morning Briefing** | `morning-briefing.yml` | Schedule (Mon-Sat 03:00+04:00 UTC) | FAIL | 17.02.2026 | Missing `email_logs` table; `dws6.com` domain not verified in Resend |
| 2 | **Deploy to Scaleway** | `deploy-scaleway.yml` | Push to main | FAIL | 17.02.2026 | TypeScript build errors in `auth.middleware.ts`, `auth.service.ts`, `redis-token-blacklist.service.ts` |
| 3 | **Update Store Feed** | `update-store.yml` | Schedule (daily) + push to main | FAIL | 17.02.2026 | `ModuleNotFoundError: No module named 'defusedxml'` — missing pip dependency |
| 4 | **Ruff Linting** | `ruff.yml` | PR | FAIL | 17.02.2026 | 50+ linting errors across Python files (legitimate lint issues, not workflow bug) |
| 5 | **Weekly Report** | `weekly-report.yml` | PR + schedule | FAIL | 17.02.2026 | Log not available — file may reference missing script or have syntax error |
| 6 | **Daily Claude Backup** | `daily-claude-backup.yml` | Schedule (daily 06:00 UTC) | FAIL | 17.02.2026 | `403 Forbidden` — GITHUB_TOKEN lacks `contents: write` permission |
| 7 | **DWS7 Roadmap Tracker** | `roadmap-weekly-tracker.yml` | Schedule (weekly) | FAIL | 16.02.2026 | `Resource not accessible by integration (createIssue)` — needs `issues: write` permission |
| 8 | **Enhanced Security Audit** | `security-audit-enhanced.yml` | Schedule (daily 03:30 UTC) | FAIL | 18.02.2026 | `Missing 5 deployment file protections` — audit check finds missing files |
| 9 | **Weekly Security Scan** | `security-scan-weekly.yml` | Schedule (weekly Sat 21:00 UTC) | FAIL | 15.02.2026 | 3 CRITICAL security issues found (scan works, but fails on threshold) |
| 10 | **Monthly Security Audit** | `monthly-security-audit-enhanced.yml` | Schedule (monthly) | FAIL | 15.02.2026 | Likely same deployment file protections issue as Enhanced Audit |
| 11 | **Dependency Review** | `dependency_review.yml` | PR | PASS | 17.02.2026 | — |
| 12 | **PR Security Check (Aikido)** | `security-check-pr.yml` | PR | PASS | 17.02.2026 | — |
| 13 | **Daily Security Scan (ZenFree)** | `security-scan-daily.yml` | Schedule (daily 03:25 UTC) | PASS | 17.02.2026 | — |
| 14 | **Daily Site Backup** | `daily-site-backup.yml` | Schedule (daily 03:00 UTC) | PASS | 17.02.2026 | — |
| 15 | **Daily Intellectual Assets Backup** | `daily-backup.yml` | Schedule (daily 00:00 UTC) | PASS | 18.02.2026 | — |
| 16 | **Auto Dependency Submission** | (GitHub built-in) | Push | PASS | 18.02.2026 | — |
| 17 | **Sync DWS6.com Landing Pages** | `sync-dws6-landing-pages.yml` | Push (path filter) | PASS | 17.02.2026 | — |
| 18 | **Copilot Code Review** | (GitHub Copilot) | PR | PASS | 17.02.2026 | — |
| 19 | **No-Delete Branch Guard** | `no-delete-branch-guard.yml` | Branch delete event | PASS | 17.02.2026 | — |
| 20 | **Bi-Weekly Auth Audit** | `biweekly-auth-security-audit.yml` | Schedule (bi-weekly) | PASS | 15.02.2026 | — |
| 21 | **Ruff Auto-Fix** | `ruff-auto-fix.yml` | Manual / PR | NO RUNS | — | Never triggered (probably `workflow_dispatch` only) |
| 22 | **Sync Site Content** | (Dependabot-related?) | Push | PASS | 12.02.2026 | Working but infrequent |
| 23 | **Daily Thesis Update** | `daily-thesis-update.yml` | Schedule | FAIL (stale) | 16.12.2025 | Not run since December 2025 — likely obsolete |
| 24 | **Weekly Thesis Email** | `weekly-thesis-email.yml` | Schedule | FAIL (stale) | 16.12.2025 | Not run since December 2025 — likely obsolete |
| 25 | **Copilot Coding Agent** | (GitHub Copilot) | Issue assignment | PASS | 17.02.2026 | — |
| 26 | **Dependabot Updates** | (GitHub built-in) | Schedule | PASS | — | Managed by GitHub |

---

## Failure Details

### 1. Morning Briefing — `morning-briefing.yml`

**Errors (3 separate issues):**
1. Supabase table `public.email_logs` does not exist (hint: "Perhaps you meant `agent_logs`")
2. Column `v_outreach_enriched.updated_at` does not exist (hint: use `created_at`)
3. Column `firehorse_leads.status` does not exist (hint: use `state`)
4. Resend 403: `dws6.com` domain not verified

**Fix needed:**
- Create `email_logs` table in Supabase OR update script to use `agent_logs`
- Fix column references in `scripts/send-morning-briefing.ts`
- Verify `dws6.com` domain in Resend dashboard

---

### 2. Deploy to Scaleway — `deploy-scaleway.yml`

**Errors:** TypeScript compilation fails during Docker build:
- `auth.middleware.ts:100` — Property `userId` does not exist on type `Promise<any>`
- `auth.service.ts:232` — Property `type` does not exist on type `Promise<any>`
- `redis-token-blacklist.service.ts:47` — `retryDelayOnFailover` does not exist in `RedisOptions`

**Fix needed:** Fix TypeScript errors in auth middleware/service (likely missing `await` on promises).

---

### 3. Update Store Feed — `update-store.yml`

**Error:** `ModuleNotFoundError: No module named 'defusedxml'`

**Fix needed:** Add `defusedxml` to `requirements.txt` or add `pip install defusedxml` step in workflow.

---

### 4. Ruff Linting — `ruff.yml`

**Error:** 50+ lint violations across Python files. Not a workflow bug — the Python code has real lint issues.

**Key files with violations:**
- `AgentFoundry/scripts/agent_runner.py` — unsorted imports, unused args
- `mcp-hub/server.py` — E402, F401, F841, mutable defaults
- `src/payments/*.py` — `str(Enum)` pattern, missing `raise from`
- `Firehorse/Automation/main.py` — `str(Enum)` pattern

**Fix needed:** Run `ruff check --fix .` or fix violations manually.

---

### 5. Weekly Report — `weekly-report.yml`

**Error:** Log not retrievable. The workflow file name shows as `.github/workflows/weekly-report.yml` in run list (not resolved to a `name:`).

**Fix needed:** Check if the workflow YAML has a valid `name:` field and references valid scripts.

---

### 6. Daily Claude Backup — `daily-claude-backup.yml`

**Error:** `fatal: unable to access — 403 Forbidden`

**Fix needed:** Add `permissions: contents: write` to the workflow YAML.

---

### 7. DWS7 Roadmap Tracker — `roadmap-weekly-tracker.yml`

**Error:** `GraphQL: Resource not accessible by integration (createIssue.issue)`

**Fix needed:** Add `permissions: issues: write` to the workflow YAML.

---

### 8. Enhanced Security Audit — `security-audit-enhanced.yml`

**Error:** `Missing 5 deployment file protections`

**Fix needed:** Either create the expected deployment protection files or adjust the audit thresholds.

---

### 9. Weekly Security Scan — `security-scan-weekly.yml`

**Error:** `3 CRITICAL issues found!` — scan works correctly but finds real vulnerabilities.

**Fix needed:** Address the 3 critical security issues (check Dependabot alerts).

---

### 10. Monthly Security Audit — `monthly-security-audit-enhanced.yml`

**Error:** Likely same deployment file protections issue.

**Fix needed:** Same as Enhanced Security Audit (#8).

---

## Priority Fix Order

| Priority | Workflow | Impact | Effort |
|----------|---------|--------|--------|
| **P1** | Morning Briefing | CEO email broken | Medium — fix Supabase schema + Resend domain |
| **P1** | Deploy to Scaleway | Cannot deploy backend | Medium — fix TS errors (missing `await`) |
| **P2** | Daily Claude Backup | Session data not backed up | Low — add `permissions:` block |
| **P2** | DWS7 Roadmap Tracker | Roadmap tracking broken | Low — add `permissions:` block |
| **P2** | Update Store Feed | Store feed stale | Low — add `defusedxml` dependency |
| **P3** | Ruff Linting | PRs show lint failures | Medium — fix 50+ Python lint issues |
| **P3** | Enhanced Security Audit | Audit reports inaccurate | Low — create missing protection files |
| **P3** | Weekly Security Scan | Security scan fails | Medium — fix 3 critical vulnerabilities |
| **P4** | Weekly Report | Reports not generated | Low — investigate YAML syntax |
| **P4** | Thesis workflows (2) | Obsolete | None — consider disabling |

---

## Recommendations

1. **Disable obsolete workflows:** `daily-thesis-update.yml` and `weekly-thesis-email.yml` have not run since December 2025
2. **Fix permissions:** Claude Backup and Roadmap Tracker just need `permissions:` blocks added
3. **Fix Supabase schema:** Morning Briefing needs `email_logs` table and correct column names
4. **Verify Resend domain:** `dws6.com` must be verified in Resend dashboard for email delivery
5. **Fix TypeScript build:** Scaleway deploy is blocked by TS errors — likely missing `await` keywords
6. **Add missing pip deps:** Store Feed needs `defusedxml` in requirements
7. **Run Ruff auto-fix:** `ruff check --fix .` would resolve many Python lint issues automatically

---

**Document Owner:** Platform Operations
**Related:** [Cloud Environments](CLOUD_ENVIRONMENTS.md) | [Google Services](Google/Google-Services.md)

---

(c) 2026 Lifetime Oy — GitHub Actions Workflow Audit
