***
VERSION: 1.0.0
STATUS: active
OWNER: Risto
INTRODUCED-IN: PR-TBD
DATE: 2026-04-22
AGENT HISTORY:
  - 2026-04-22 | Copilot | Added repository-standard machine-readable header block per DWS_DOCUMENT_STANDARD.md §2.1.
***

# DWS6 Local-First CI + Audit Log

**Status:** active | **Owner:** Risto | **Introduced-In:** PR-TBD | **Date:** 2026-04-22

DWS6 runs CI checks **locally** (on developer machines) and **on DGX Spark**
(weekly), not on GitHub Actions. Every run produces a tamper-evident audit
record, mirrored to Supabase as the legal record-of-truth.

## Why

- **Cost.** GitHub Actions minutes are paid; every push was spending minutes on
  checks that run in <1 min locally.
- **Latency.** 2–5 minute queue + run on GitHub vs. seconds locally.
- **Compliance.** EU AI Act Art. 12 and CSRD ESRS G1 require traceable,
  tamper-evident audit trails. Supabase (EU, Helsinki, RLS-enforced
  append-only) meets that bar; GitHub Actions logs don't (retention, redaction,
  jurisdiction all wrong).

## Architecture

```
┌──────────────────────────┐   ┌─────────────────────────┐
│ Dev laptop               │   │ DGX Spark (weekly cron) │
│ git push → pre-push hook │   │ scripts/weekly/         │
│   → scripts/local-ci.sh  │   │   security-audit.sh     │
└─────────┬────────────────┘   └──────────┬──────────────┘
          │                               │
          ▼                               ▼
    .ci-audit/runs/<ts>_<sha>.json   (same format, runner_kind=dgx-spark)
          │                               │
          ├───POST──▶ Supabase ci_audit_log (INSERT-only, EU, tamper-evident)
          │
          └── committed with code ──▶ git history

                    ┌───────────────────────┐
                    │ GitHub: CI Audit Gate │ ← 3s workflow
                    │  verifies chain ∧     │
                    │  HEAD has pass=true   │
                    └───────────────────────┘
```

## What runs locally

`scripts/local-ci.sh` runs:

| Check               | Replaces GitHub workflow                  | Speed                               |
| ------------------- | ----------------------------------------- | ----------------------------------- |
| `npm-install-check` | (preflight)                               | <1s                                 |
| `vitest`            | `test.yml`                                | ~10s                                |
| `gitleaks-full`     | `secret-scan-gitleaks.yml`                | ~100s full / <1s staged (`--quick`) |
| `npm-audit-root`    | npm-audit step of `dependency_review.yml` | ~3s                                 |
| `ruff-check`        | `ruff.yml` (skipped if no `.py` changed)  | ~2s                                 |

Total: ~30–120s depending on `--quick` flag.

## Audit record format (`ci-audit/v1`)

```json
{
  "schema": "ci-audit/v1",
  "ts": "2026-04-22T03:30:12Z",
  "commit_sha": "abc123...",
  "branch": "claude/feature-x",
  "repo": "blogtheristo/dws6",
  "runner": "risto@macbook",
  "runner_kind": "local",
  "trigger_kind": "pre-push",
  "overall_pass": true,
  "checks_total": 5,
  "checks_passed": 5,
  "checks_failed": 0,
  "duration_ms": 47320,
  "checks": [
    { "name": "vitest", "pass": true, "duration_ms": 10790, "output_sha256": "...", "notes": "" }
  ],
  "prev_record_hash": "...",
  "this_record_hash": "..."
}
```

`this_record_hash = sha256(canonical_json_without_this_field)`
`prev_record_hash` links to the most recent previously written record.

## Tamper evidence (two layers)

1. **Local hash chain** in `.ci-audit/runs/`. Altering any record invalidates
   the chain. `scripts/ci-audit-verify.sh` catches it in ~200ms.
2. **Supabase `ci_audit_log`.** RLS denies UPDATE and DELETE to every role
   including `service_role`. Hosted in europe-north1 (Helsinki). The legal
   record. Apply the migration below to enable.

## Supabase table (apply once)

Paste into the Supabase SQL editor. The migration file is intentionally not
committed to `supabase/migrations/` because DB migrations are a RED-zone
action per CLAUDE.md — they must be authored and applied by a human.

```sql
CREATE TABLE IF NOT EXISTS ci_audit_log (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  commit_sha          TEXT        NOT NULL,
  branch              TEXT        NOT NULL,
  repo                TEXT        NOT NULL DEFAULT 'blogtheristo/dws6',
  runner              TEXT        NOT NULL,
  runner_kind         TEXT        NOT NULL CHECK (runner_kind IN ('local','dgx-spark','github-actions','other')),
  overall_pass        BOOLEAN     NOT NULL,
  checks_total        INTEGER     NOT NULL,
  checks_passed       INTEGER     NOT NULL,
  checks_failed       INTEGER     NOT NULL,
  duration_ms         INTEGER     NOT NULL,
  checks              JSONB       NOT NULL,
  prev_record_hash    TEXT,
  this_record_hash    TEXT        NOT NULL,
  trigger_kind        TEXT        NOT NULL DEFAULT 'pre-push',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ci_audit_log_commit_sha_idx   ON ci_audit_log (commit_sha);
CREATE INDEX IF NOT EXISTS ci_audit_log_branch_idx       ON ci_audit_log (branch);
CREATE INDEX IF NOT EXISTS ci_audit_log_created_at_idx   ON ci_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS ci_audit_log_overall_pass_idx ON ci_audit_log (overall_pass) WHERE overall_pass = FALSE;

ALTER TABLE ci_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ci_audit_insert_service" ON ci_audit_log
  FOR INSERT TO service_role WITH CHECK (TRUE);

CREATE POLICY "ci_audit_select_authenticated" ON ci_audit_log
  FOR SELECT TO authenticated USING (TRUE);

REVOKE UPDATE, DELETE, TRUNCATE ON ci_audit_log FROM PUBLIC, authenticated, service_role;

COMMENT ON TABLE ci_audit_log IS 'CI check-run audit trail. Append-only. Retention: forever.';
```

## Developer setup (once per clone)

```bash
git config core.hooksPath .githooks     # activates pre-push
# Supabase env (optional — enables legal record-of-truth):
export SUPABASE_URL="https://<ref>.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

Install one-time tools if missing: `gitleaks` (from releases), `jq`, `ruff`
(for Python).

## Daily flow

```bash
# Normal path — checks run on `git push` automatically
git push

# Skip only CI (keep ZenFree); still audited via git reflog
SKIP_LOCAL_CI=1 git push

# Skip everything (emergency only; reflog records the override)
git push --no-verify
```

## Verifying someone else's push

```bash
git fetch origin main
bash scripts/ci-audit-verify.sh --commit $(git rev-parse origin/main)
```

Exit 0 = chain intact, HEAD has a passing record. Exit 1 = broken.

## What's still on GitHub Actions (and why)

| Workflow                    | Reason it stays on GitHub                     |
| --------------------------- | --------------------------------------------- |
| `ci-audit-verify.yml` (new) | 3s gate; has to run on GitHub to block merges |
| `deploy-staging.yml`        | Needs GCP secrets + GitHub deployment env     |
| `deploy-scaleway.yml`       | Same — deployment needs GitHub context        |
| `claude-review.yml`         | Needs GitHub App token for PR comments        |
| `pr-auto-merge.yml`         | Orchestrates GitHub merge API                 |
| `ai-pr-review.yml`          | Posts PR review comments                      |
| Cloudflare Pages previews   | External — not our workflow                   |

## What was disabled (and how to re-enable)

Four workflows were renamed to `.yml.disabled` in the PR that shipped this:

| Disabled file                       | Replaced by                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| `test.yml.disabled`                 | `scripts/local-ci.sh` check `vitest`                                               |
| `secret-scan-gitleaks.yml.disabled` | `scripts/local-ci.sh` check `gitleaks-full`                                        |
| `dependency_review.yml.disabled`    | `scripts/local-ci.sh` check `npm-audit-root` + `scripts/daily/dependabot-audit.sh` |
| `ruff.yml.disabled`                 | `scripts/local-ci.sh` check `ruff-check`                                           |

To re-enable any of them (failover), rename back to `.yml` and push.

## DGX Spark scripts

| Script                              | Runs             | Replaces GitHub workflow                                                                                                       |
| ----------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `scripts/daily/dependabot-audit.sh` | daily 03:00 UTC  | (existing)                                                                                                                     |
| `scripts/weekly/security-audit.sh`  | Sunday 04:00 UTC | `security-audit-enhanced.yml`, `security-scan-weekly.yml`, `security-scan-biweekly.yml`, `monthly-security-audit-enhanced.yml` |

Follow-up work: the 4 GitHub workflows in the table above can be renamed to
`.yml.disabled` once the DGX weekly script has produced audit records for two
consecutive Sundays and the team verifies reports in `logs/security-audit/`.

## Failure mode cheat sheet

| Symptom                                          | Cause                                            | Fix                                                                           |
| ------------------------------------------------ | ------------------------------------------------ | ----------------------------------------------------------------------------- |
| `CI Audit Gate` fails with "no audit record"     | Pushed with `--no-verify` or local CI didn't run | Re-run `bash scripts/local-ci.sh` and amend the push with the new record file |
| `CI Audit Gate` fails with "chain broken"        | Someone edited a `.ci-audit/runs/*.json` file    | Restore from git history; never edit audit records manually                   |
| `CI Audit Gate` fails with "overall_pass=false"  | Local CI had failures                            | Fix the failures, re-run, push again                                          |
| Supabase upload warning `ci_audit_log not found` | Migration not applied                            | Copy SQL above into Supabase SQL editor                                       |
| `npm-audit-root` fails with 0 high/critical      | Transitive dep bumped to high                    | Run `npm audit fix` and commit lockfile                                       |

## File map

```
scripts/local-ci.sh                           ← the runner
scripts/ci-audit-verify.sh                    ← the verifier (used by hook + gate)
scripts/ci-audit-upload.ts                    ← Supabase POST (optional)
scripts/weekly/security-audit.sh              ← DGX Spark weekly job
.githooks/pre-push                            ← runs the runner on push
.github/workflows/ci-audit-verify.yml         ← 3s GitHub gate
.ci-audit/runs/*.json                         ← hash-chained records (committed)
.ci-audit/README.md                           ← quick reference
docs/CI_AUDIT.md                              ← this file
```
