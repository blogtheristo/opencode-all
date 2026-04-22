# .ci-audit/ — Local CI Audit Records

This folder holds tamper-evident JSON records of every local CI run. Each run
is written by `scripts/local-ci.sh` and verified by `scripts/ci-audit-verify.sh`.

## Layout

```
.ci-audit/
├── README.md                         ← this file
└── runs/
    └── <ISO-timestamp>_<short-sha>.json   ← one file per run, hash-chained
```

## One record per run

File name format: `20260422T033012Z_abc123def456.json`

```json
{
  "schema": "ci-audit/v1",
  "ts": "2026-04-22T03:30:12Z",
  "commit_sha": "abc123def456...",
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
    { "name": "vitest", "pass": true, "duration_ms": 10790, "output_sha256": "...", "notes": "" },
    {
      "name": "gitleaks-full",
      "pass": true,
      "duration_ms": 99000,
      "output_sha256": "...",
      "notes": ""
    }
  ],
  "prev_record_hash": "...",
  "this_record_hash": "..."
}
```

## Tamper evidence (two layers)

1. **Local hash chain.** `this_record_hash = sha256(canonical-json-without-hash)`.
   `prev_record_hash` points to the previous file's `this_record_hash`. Editing any
   prior record invalidates the chain — `scripts/ci-audit-verify.sh` catches it.

2. **Supabase `ci_audit_log`.** When `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
   are set, each record is also POSTed to the append-only Supabase table (RLS
   denies UPDATE/DELETE to every role including `service_role`). Supabase is the
   legal record-of-truth; this folder is a convenience mirror.

## Workflow

```bash
# Run all checks + write a record
bash scripts/local-ci.sh

# Verify chain integrity + HEAD coverage
bash scripts/ci-audit-verify.sh

# The pre-push hook does both automatically; bypass only with:
git push --no-verify   # recorded in git reflog — still auditable
```

## Retention

Do not delete records. The folder is committed to git, so history is the retention
policy. If it ever grows large enough to matter (thousands of runs), rotate to a
`archive/` subfolder — never `rm`.
