# DWS IQ Platform — External Audit Manual

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/ci-hygiene-audit-vBYGo | Date: 22.04.2026 | Changes: Initial creation — external auditor guide for local-first CI + tamper-evident audit log (Supabase `ci_audit_log`)

Session Links & References:

- Claude Code: https://github.com/blogtheristo/dws6/commits/claude/ci-hygiene-audit-vBYGo
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_AUDIT.md

Document Status:

- Created: 22.04.2026
- Last Modified: 22.04.2026
- Language: English
- Languages Available: English
- Publication Status: ✅ ACTIVE
- Audience: **External auditors, compliance reviewers, regulators**

***

**Repository:** [blogtheristo/dws6](https://github.com/blogtheristo/dws6) (PRIVATE)
**Data controller:** Lifetime Oy (Y-tunnus 0772407-9, Espoo, Finland)
**EU data residency:** Supabase `europe-north1` (Helsinki)

---

## Purpose

This manual is written for **external auditors** evaluating DWS IQ 6 for
conformity with:

- EU AI Act — Article 12 (Automatic logging of high-risk AI systems)
- GDPR — Article 30 (Records of processing activities)
- CSRD / ESRS G1 — Business conduct controls (audit trails, change management)
- ISO/IEC 27001:2022 — A.8.32 Change management, A.8.34 Protection during audit
- PiTuKri (Finnish public-sector cloud audit framework) — CO-05, CO-07

It explains **what is logged, where it lives, how to pull evidence, and how
to prove the record has not been tampered with.** It also defines the
auditor's access model (read-only, EU-residency, least-privilege).

Internal-facing operational docs (runbooks, deploy procedures, secrets
handling) live in `Admin/ADMIN_MANUAL.md`. This file contains only what
an external auditor needs.

---

## Table of Contents

1. [Scope of audited systems](#1-scope-of-audited-systems)
2. [Audit trail inventory](#2-audit-trail-inventory)
3. [CI audit log — the primary change-management record](#3-ci-audit-log--the-primary-change-management-record)
4. [Article 12 AI audit log](#4-article-12-ai-audit-log)
5. [How to pull evidence](#5-how-to-pull-evidence)
6. [How to verify integrity (tamper-evidence checks)](#6-how-to-verify-integrity)
7. [Retention and legal holds](#7-retention-and-legal-holds)
8. [Auditor access model](#8-auditor-access-model)
9. [Sample audit queries](#9-sample-audit-queries)
10. [Incident playbook for audit findings](#10-incident-playbook-for-audit-findings)
11. [Contact and escalation](#11-contact-and-escalation)

---

## 1. Scope of audited systems

| System                       | Role                                                     | EU residency                 | Audit trail                                                                             |
| ---------------------------- | -------------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------- |
| `blogtheristo/dws6` (GitHub) | Source of truth for all code + docs                      | US-hosted (GitHub)           | git history + branch protection                                                         |
| Supabase `europe-north1`     | Operational DB + audit tables                            | ✅ Finland (Helsinki)        | `article12_audit_log`, `ci_audit_log`, `security_events`                                |
| DGX Spark (on-prem Helsinki) | Primary runtime for scheduled AI agents + security scans | ✅ Finland                   | mirrors to Supabase                                                                     |
| GitHub Actions (residual)    | Deploy + CI audit gate (3s verify-only)                  | Multi-region runners         | `ci_audit_log` (INSERT from GH runner)                                                  |
| Anthropic / Groq APIs        | LLM inference                                            | US (Anthropic), mixed (Groq) | PII-scrubbed before egress; `article12_audit_log` records input hash + response lineage |

**Not in scope of this audit manual:** Cloudflare (edge CDN, no PII),
Scaleway (stateless container runtime, logs in Finland), ProtonDrive (backup
mirror, read-only).

---

## 2. Audit trail inventory

DWS6 keeps **four tamper-evident audit trails.** Each is append-only at the
database layer (PostgreSQL RLS + revoked UPDATE/DELETE), each is hosted in
the EU, and each is cross-linked to git history.

| Trail | Table / file                                        | Scope                                                                                           | Retention                  |
| ----- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------- |
| A     | `article12_audit_log` (Supabase)                    | Every AI agent call (pre-flight + post-flight, input hash, thinking block hash, scrub manifest) | 10 years (EU AI Act draft) |
| B     | `ci_audit_log` (Supabase) + `.ci-audit/runs/` (git) | Every CI check run on every commit: result, per-check hash, runner identity                     | Forever                    |
| C     | git commit history (GitHub)                         | Every code change, signed commits where present, protected branch                               | Forever                    |
| D     | `.claude/hooks/audit/bash-commands.log`             | Every YELLOW-zone AI tool action (MCP calls, git push, Docker)                                  | ≥ 2 years                  |

The remainder of this document focuses on **Trail A** (Article 12 AI Act) and
**Trail B** (CI change-management) because those are the two the auditor
will most commonly be asked to sample.

---

## 3. CI audit log — the primary change-management record

### What it proves

For every commit in the repository:

- **Which automated checks ran** (unit tests, secret scan, dependency
  vulnerability scan, lint) — the same set that used to live in GitHub
  Actions, now run locally on dev machines and on DGX Spark.
- **Whether each check passed**, how long it took, and the SHA-256 of its
  raw output (so an auditor can detect silent output substitution).
- **Which runner ran them**, from which machine, at what UTC time.
- **Whether the commit was allowed to be pushed.** A failing check blocks
  the push unless explicitly overridden, and the override itself is
  recorded.

Together with git commit history, this is the DWS6 equivalent of a CI/CD
change-management evidence pack for ISO 27001 A.8.32.

### Where it lives

Two layers:

1. **Primary (legal record of truth):** Supabase table `ci_audit_log`
   - Hosted in europe-north1 (Helsinki)
   - RLS enforces: `service_role` can only INSERT; `authenticated` can only
     SELECT; UPDATE, DELETE and TRUNCATE are REVOKEd from every role
   - Schema: see `docs/CI_AUDIT.md` §"Supabase table"
2. **Mirror (offline / integrity check):** git-tracked `.ci-audit/runs/*.json`
   - One file per CI run, named `<UTC-iso-timestamp>_<short-sha>.json`
   - Hash-chained: each record's `prev_record_hash` points to the previous
     record's `this_record_hash`. Altering any prior record invalidates the
     chain.

### Schema (short form)

```
commit_sha          git commit under test
branch              git ref
runner              who executed the check ("risto@macbook", "dgx-spark-weekly", …)
runner_kind         local | dgx-spark | github-actions | other
overall_pass        aggregate boolean
checks_total        count of checks in this run
checks_passed       count of passes
checks_failed       count of failures
duration_ms         total elapsed ms
checks              JSONB array of {name, pass, duration_ms, output_sha256, notes}
prev_record_hash    SHA-256 of previous row (chain link)
this_record_hash    SHA-256 of this row's canonical body
trigger_kind        pre-push | weekly-security-audit | ad-hoc
created_at          TIMESTAMPTZ (DB-set, not application-set)
```

Full schema in `docs/CI_AUDIT.md` and live in Supabase SQL editor.

### Covered checks

| Check name in record | What it verifies                                                |
| -------------------- | --------------------------------------------------------------- |
| `vitest`             | Unit + integration test suite pass (576 tests as of 2026-04-22) |
| `gitleaks-full`      | No secrets leaked in full git history (`.gitleaks.toml` config) |
| `gitleaks-staged`    | No secrets in staged diff (quick-mode)                          |
| `npm-audit-root`     | No high/critical vulnerabilities in production npm dependencies |
| `ruff-check`         | Python lint + format (when `.py` files are present)             |

### Link to git

`commit_sha` in the audit record is the exact git commit. The auditor can
cross-reference with `git log <sha>` or the GitHub Files view to see the
source that was under test.

---

## 4. Article 12 AI audit log

Separate table `article12_audit_log` logs **every AI agent invocation**
before and after the Anthropic/Groq API call:

- **Pre-flight** (written BEFORE any cloud egress): agent ID, input
  SHA-256 (post-scrub), model, thinking effort, regulation IDs, scrub
  manifest hash, PII types found, replacement count, scrub-location (must be
  EU), inference-location (honest declaration).
- **Post-flight** (written AFTER the API response): same trace_id, thinking
  block hash, decision summary (≤500 chars, scrubbed), token counts.

The raw prompt text is **never** stored — only its SHA-256 hash. The raw
thinking block is **never** stored — only its SHA-256 hash. This proves
lineage without exposing reasoning or user data.

Table definition: `supabase/migrations/038_article12_audit_log.sql`.
Logger: `src/agents/article12-logger.ts`.

---

## 5. How to pull evidence

The auditor should be provisioned a **read-only Supabase role** (see §8).
With that role, the following queries produce the evidence packs that
correspond to common audit questions.

### 5.1 "Prove that commit X on main passed CI before it was merged"

```sql
SELECT commit_sha, branch, runner, runner_kind,
       overall_pass, checks_passed, checks_failed,
       duration_ms, created_at, this_record_hash
FROM   ci_audit_log
WHERE  commit_sha = '<40-char-sha>'
ORDER  BY created_at DESC;
```

Expected: one or more rows, latest has `overall_pass = true`, and the row
was INSERTed **before** the git merge timestamp (check GitHub PR UI).

### 5.2 "Show me every failed CI check in March 2026"

```sql
SELECT created_at, commit_sha, branch, runner,
       checks - 'output_sha256' AS checks_summary
FROM   ci_audit_log
WHERE  overall_pass = FALSE
  AND  created_at BETWEEN '2026-03-01' AND '2026-04-01'
ORDER  BY created_at;
```

### 5.3 "Show me every AI agent call that classified as 'high risk'"

```sql
SELECT created_at, agent_id, model, risk_classification,
       pii_types_found, pii_replacement_count,
       inference_location, pii_scrub_location
FROM   article12_audit_log
WHERE  risk_classification = 'high'
ORDER  BY created_at DESC
LIMIT  200;
```

### 5.4 "Show me every case where PII was sent to inference"

```sql
SELECT COUNT(*) AS total_runs,
       SUM(CASE WHEN pii_replacement_count > 0 THEN 1 ELSE 0 END) AS pii_scrubbed_runs,
       SUM(CASE WHEN pii_scrubbed = FALSE THEN 1 ELSE 0 END) AS pii_leaked_runs
FROM   article12_audit_log
WHERE  created_at >= NOW() - INTERVAL '90 days';
```

`pii_leaked_runs` **must be zero.** If it is non-zero, escalate per §10.

---

## 6. How to verify integrity

### 6.1 Chain check (offline, ~200 ms)

Any auditor with a clone of the repo can verify the `.ci-audit/runs/` hash
chain without access to Supabase:

```bash
git clone https://github.com/blogtheristo/dws6.git   # requires access
cd dws6
bash scripts/ci-audit-verify.sh --chain-only
```

Exit code `0` = chain intact across every record. Exit code `1` = chain
broken (tampering evidence). The script walks all files in timestamp order
and recomputes SHA-256 of each record's canonical body, verifying both
`this_record_hash` and the `prev_record_hash → this_record_hash` link.

### 6.2 Supabase RLS check

From the Supabase SQL editor, confirm the tamper-evident posture:

```sql
-- Should return only the INSERT policy for service_role
-- and the SELECT policy for authenticated.
SELECT policyname, cmd, roles FROM pg_policies
WHERE tablename IN ('ci_audit_log','article12_audit_log');

-- Should show no UPDATE/DELETE/TRUNCATE grants.
SELECT grantee, privilege_type
FROM   information_schema.role_table_grants
WHERE  table_name IN ('ci_audit_log','article12_audit_log')
  AND  privilege_type IN ('UPDATE','DELETE','TRUNCATE');
```

The second query must return **zero rows** for each table — proving that
no role (including `service_role`) can modify or delete audit rows.

### 6.3 Cross-layer reconciliation

For any sampled commit, compare the `ci_audit_log` Supabase row against the
`.ci-audit/runs/*.json` file. `this_record_hash` and every field must match
byte-for-byte. Discrepancy = evidence of tampering in one of the two layers.

### 6.4 Git-level tamper detection

Because `.ci-audit/runs/*.json` is committed with the source change, any
attempt to alter a past audit record requires rewriting git history. The
`main` branch is protected against force-push (GitHub branch protection).
Any force-push attempt on `main` is refused by GitHub and the attempt is
visible in the repository's Audit Log (GitHub Enterprise feature).

---

## 7. Retention and legal holds

| Trail                                 | Retention policy                          | Legal basis                               |
| ------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| `article12_audit_log`                 | 10 years minimum from creation            | EU AI Act draft, High-Risk AI systems     |
| `ci_audit_log`                        | Indefinite ("forever" per schema comment) | ISO 27001 A.8.32, internal policy         |
| git history (`.ci-audit/runs/` files) | Indefinite (repo retention)               | Same as above                             |
| `security_events` table               | 2 years                                   | GDPR Art. 30, Finnish Data Protection Act |
| `.claude/hooks/audit/`                | 2 years (rotated per quarter)             | Internal policy                           |

**No automatic deletion job touches any of the audit tables.** A
manually-scheduled `pg_dump` is taken quarterly and mirrored to ProtonDrive
(Switzerland, EU-equivalent) for disaster-recovery purposes. Restoration
from backup does not reset the hash chain because the chain is stored in
the same dump.

### Legal hold procedure

If a regulator requests a hold, the DPO (Risto Päärni, `risto@lifetime.fi`)
executes:

1. `pg_dump -t article12_audit_log -t ci_audit_log > hold_<date>.sql`
2. Uploads the dump to a write-once bucket (Supabase Storage, immutability
   policy enabled).
3. Records the hold in `Admin/Legal_Holds/` with requester, scope, and
   release condition.

---

## 8. Auditor access model

DWS6 provisions auditors with the minimum access required and only for the
duration of the audit engagement.

### 8.1 What auditors get

- **Read-only Supabase role** `auditor_readonly` with `SELECT` on
  `article12_audit_log`, `ci_audit_log`, `security_events`. No access to
  PII-bearing operational tables (`users`, `organizations`, etc.).
- **Read-only GitHub collaborator access** to the `blogtheristo/dws6`
  private repo, scoped to the audit engagement branch (usually `main`
  - audit branch).
- **Read-only ProtonDrive share** of the backup mirror.

### 8.2 What auditors do not get

- No SSH access to DGX Spark.
- No service-role Supabase keys.
- No `.env` files or secrets.
- No GitHub App or bot tokens.
- No ability to run code in production (verification-only).

### 8.3 Onboarding checklist for a new auditor

1. Auditor signs mutual NDA (`Partners/NDA_TEMPLATE_EU_2026.md`, v2.0+).
2. DPO creates Supabase `auditor_readonly` user with time-limited password,
   scoped to the queries in §9.
3. DPO adds auditor as read-only GitHub collaborator (private repo).
4. Auditor confirms `scripts/ci-audit-verify.sh --chain-only` exits 0 on a
   fresh clone before starting the engagement.
5. At engagement end, DPO revokes both accesses and records revocation in
   `Admin/Audits/<engagement>/access_log.md`.

---

## 9. Sample audit queries

### 9.1 "Integrity of the CI audit chain over the last 90 days"

```sql
WITH ordered AS (
  SELECT this_record_hash, prev_record_hash, created_at,
         LAG(this_record_hash) OVER (ORDER BY created_at) AS expected_prev
  FROM   ci_audit_log
  WHERE  created_at >= NOW() - INTERVAL '90 days'
)
SELECT COUNT(*) AS total,
       SUM(CASE WHEN prev_record_hash = expected_prev OR expected_prev IS NULL
                THEN 0 ELSE 1 END) AS broken_links
FROM   ordered;
```

Expected: `broken_links = 0`.

### 9.2 "Coverage — how many commits on main have an audit record?"

```sql
-- Run in Supabase. Compare against git commits on main via GitHub API.
SELECT DATE_TRUNC('week', created_at) AS week,
       COUNT(DISTINCT commit_sha) AS commits_with_ci_record
FROM   ci_audit_log
WHERE  branch = 'main'
  AND  created_at >= NOW() - INTERVAL '12 weeks'
GROUP  BY week
ORDER  BY week;
```

### 9.3 "List every `--no-verify` override in the last quarter"

Overrides are not stored in Supabase (the developer bypassed the hook).
They are visible in the git reflog on the developer's machine AND in the
GitHub "Push events" audit log (GitHub Enterprise). To sample remotely:

```bash
# From any clone:
git log --format='%H %an %s %D' --since='3 months ago' main \
  | head -100
```

Correlate each HEAD sha with `ci_audit_log.commit_sha`. Any commit on main
whose sha does not appear in `ci_audit_log` is a `--no-verify` push and
should be sampled for policy compliance.

### 9.4 "Which AI models have processed production data?"

```sql
SELECT model, COUNT(*) AS calls,
       MIN(created_at) AS first_seen,
       MAX(created_at) AS last_seen
FROM   article12_audit_log
GROUP  BY model
ORDER  BY calls DESC;
```

---

## 10. Incident playbook for audit findings

If an auditor finds:

| Finding                                      | Immediate action                                                                             | Owner          | SLA  |
| -------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------- | ---- |
| Broken hash chain in `ci_audit_log`          | Freeze main; snapshot the affected range; investigate via git history                        | DPO + eng lead | 24 h |
| `pii_leaked_runs > 0`                        | Revoke affected Anthropic/Groq keys; notify DPO; 72-hour GDPR breach notification evaluation | DPO            | 72 h |
| Commit on main without a CI record           | Identify the pusher; review `--no-verify` override policy; amend if unjustified              | Eng lead       | 7 d  |
| UPDATE or DELETE succeeded on an audit table | Critical incident; rotate all Supabase keys; notify legal                                    | DPO + CEO      | 24 h |
| RLS policy missing / weakened                | Restore from migration; file post-mortem                                                     | DPO            | 48 h |

All findings are recorded in `Admin/Audits/<engagement-name>/findings.md`
with the response, owner, and close-out evidence.

---

## 11. Contact and escalation

| Role                                 | Contact                                             | Scope                               |
| ------------------------------------ | --------------------------------------------------- | ----------------------------------- |
| Data Protection Officer (DPO)        | Risto Päärni — `risto.paarni@lifetime.fi`           | First line for every audit question |
| Legal entity                         | Lifetime Oy, Y-tunnus 0772407-9, Espoo, Finland     | Contract / NDA                      |
| EU supervisory authority             | Finnish Data Protection Ombudsman (`tietosuoja.fi`) | GDPR escalation                     |
| AI Act competent authority (Finland) | Traficom                                            | EU AI Act escalation                |

### Audit engagement runbook

1. Auditor sends scope + timeline to `risto.paarni@lifetime.fi`.
2. DPO provisions access per §8 within 2 business days.
3. Kickoff call confirms the evidence packs required (§5).
4. Auditor runs §6 integrity checks and samples §9 queries.
5. Findings are discussed in weekly calls; each finding gets an entry per
   §10.
6. On close-out, auditor issues a report; DPO files it in
   `Admin/Audits/<engagement>/report.pdf` and revokes access.

---

## Related documents

| Document                                          | What it contains                                      |
| ------------------------------------------------- | ----------------------------------------------------- |
| `docs/CI_AUDIT.md`                                | Technical spec of the CI audit log (developer-facing) |
| `Admin/ADMIN_MANUAL.md`                           | Internal operations runbook                           |
| `Admin/SECURITY_COMPLIANCE.md`                    | Security controls catalogue                           |
| `Admin/PITUKRI_AUDIT_REPORT.md`                   | Finnish public-sector cloud audit framework mapping   |
| `DWS_SECURITY_STANDARD.md`                        | Company-wide security standard                        |
| `docs/DPA_DATA_PROCESSING_AGREEMENT.md`           | GDPR DPA template                                     |
| `supabase/migrations/038_article12_audit_log.sql` | `article12_audit_log` schema                          |
| SQL block in `docs/CI_AUDIT.md`                   | `ci_audit_log` schema                                 |

---

**License:** Proprietary — Lifetime Oy
**Maintained by:** Risto Päärni (DPO) + Lifetime Oy Development Team
**Storage:** GitHub (private repo `blogtheristo/dws6`) + ProtonDrive sync
