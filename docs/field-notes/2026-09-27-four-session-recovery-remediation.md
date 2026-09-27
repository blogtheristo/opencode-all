<!-- Evidence: Tool=GitHub-Copilot-CLI-1.0.88 Model=GPT-5.6-Sol Agent=reviewer Date=2026-09-27 -->
<!-- Audit trail: git log -- docs/field-notes/2026-09-27-four-session-recovery-remediation.md -->

# Four-session recovery, audit, and remediation

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: GitHub Copilot CLI 1.0.88 | Model: GPT-5.6 Sol | Session: copilot/four-session-takeover | Date: 27.09.2026 | Changes: Recovered four interrupted terminal sessions, independently audited their deliverables, fixed verified defects, completed the blocked Session 3–4 scope, and recorded merged evidence. | Harness: GitHub Copilot CLI + CLAUDE.md + matched DWS standards | HIC-approved-drift: Kimi is local-only and must never use a cloud provider.

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Classification: INTERNAL

---

## Context

Four Windows terminal sessions stopped while executing the Copilot bonus-credit work order. They were resumed on DGX, but Sessions 3 and 4 remained blocked by stale identity checks and write/network restrictions. A fifth reviewer session therefore took ownership of the complete result: reconstruct the work, audit every pull request, merge safe work, remediate findings, and finish the blocked lanes from current `main`.

## What changed

The review first merged the valid documentation and reconciliation work, then found four actionable implementation defects plus one model-policy mismatch:

1. OAuth portal hints could become editable role metadata.
2. DGX scheduled jobs were marked complete after a failed script.
3. Verified-Done attestation persistence and proof-state changes were not atomic.
4. Contact-form KV rate limiting used a racy read/modify/write counter.
5. The merged Baseten work implied cloud Kimi routing, which the HIC explicitly rejected.

PRs #2160–#2163 fixed the four implementation defects. The Kimi catalog change was intentionally not shipped: Kimi is local-only and is never selected through Baseten or another cloud provider.

Session 4 then completed:

- D3 moved the remaining PR gates to the DGX self-hosted runner.
- D4 moved Google OAuth keepalive and quarterly MGD scheduling to DGX-discovered scripts; monthly DAST remains the only Actions schedule.
- C2 replaced wildcard billing CORS with an explicit production allowlist and development-only localhost.
- C3 added one focused test PR for Stripe webhook, billing service, KYA engine, rate limiter, and admin cost-audit authorization.
- C4 reran combined coverage after all C2/C3 changes: 35.17% statements, 29.03% branches, 39.26% functions, and 35.47% lines.

Session 3 targets were reconciled against current GitHub state. Completed work stayed merged; thirteen obsolete branches between 536 and 2,341 commits behind `main` were closed instead of being revived from stale mixed-scope histories.

## Validation

- Core remediation synthetic merge tree: 167 test files and 1,726 tests passed; four files and 33 tests skipped.
- Complete Session 4 synthetic merge tree: 172 test files and 1,757 tests passed; four files and 33 tests skipped.
- TypeScript, targeted suites, shell syntax, migration filename validation, public mirror parity, Prettier, evidence, schedule, and diff checks passed.
- Migration `098_270926_attestation_consistency.sql` was committed but not applied.
- GitHub-hosted checks remained blocked by account billing; push-time DGX local CI passed.

## Operational follow-through

- Configure the dws10.com Pages `CONTACT_RATE_LIMITER` binding at five requests per 60 seconds before deploying the fail-closed contact handler.
- Keep migration 098 unapplied until an operator reviews duplicate evidence and explicitly approves application.
- PR #2156 remains held until the owner confirms OpenClaw Phase 1 is complete.
- Keep Kimi local-only; do not add a cloud Kimi catalog entry.

## Learning outcome

Recovery is not completion. A resumed agent can reproduce a green local result while still preserving a stale branch assumption, a false completion marker, or a non-atomic production boundary. The durable pattern is: reconstruct from current `main`, test exact heads, combine the heads in a synthetic merge tree, independently inspect authority and state transitions, then merge with exact-head guards.

---

Version 1.0 | 27.09.2026 | © 2026 Lifetime Oy | INTERNAL
