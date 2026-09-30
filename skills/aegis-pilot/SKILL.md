---
name: aegis-pilot
description: "DWS-AEGIS-PILOT-001 agent execution control: rehearsal, acceptance, stop, verification, and lifecycle management."
argument-hint: "state-dir, scope (JSON file path)"
allowed-tools: [Bash]
---

# Aegis Pilot — Agent Execution Control Skill

**Domain:** Agent outcome execution and governance | Evidence ledger

**CLI:** `dws aegis:pilot <command> --state-dir <dir> --scope <scope.json> ...`

**Source:** `scripts/aegis-pilot.ts` — CLI for DWS-AEGIS-PILOT-001 (Store/PRODUCT_AEGIS_PILOT.md)

## What This Skill Knows

DWS-AEGIS-PILOT-001 governs agentOutcome execution for critical operational workflows. It provides:

- **Rehearsal runs** — dry-run with simulated acceptance conditions
- **Acceptance runs** —live execution under human operator supervision with named witness
- **Agent stop** — emergency termination with evidence logging
- **Evidence verification** — cryptographic ledger audit (ED25519 signatures)
- **Lifecycle commands** — init, issue-operator, revoke, status, seal, segments, prune

## Hard Rules (Non-Negotiable)

1. **Acceptance runs require human operator + named witness** — never automated.
2. **Operator key must never reside in the state dir** — it belongs to the human operator.
3. **NEGATIVE_RESULT is valid** — not a failure; reported, never retried away.
4. **Evidence ledger is append-only** — revocations and grants are signed additions.

## CLI Commands

All commands output one JSON document to stdout. Exit codes:

- `0` — PASS / OK
- `1` — ERROR / INVALID arguments
- `2` — NEGATIVE_RESULT (valid outcome, not a failure)
- `3` — NOT_TAKEN / INVALID state
- `4` — verification failed (signature mismatch)

### `init`

Initialize a pilot site.

- **Input:** `--state-dir D`, `--site-id S`, `--org-id O` (optional)
- **Output:** `{ ok: true, command: 'init', siteId, keyId, ledgerHead }`

### `issue-operator`

Issue an operator credential (for agent stop authority).

- **Input:** `--state-dir D`, `--name N`, `--key-out K`, `--ttl-hours H` (optional, default 72)
- **Output:** `{ ok: true, command: 'issue-operator', credentialId, operatorId, credentialPath, keyPath, expiresAt }`

### `revoke`

Revoke a credential.

- **Input:** `--state-dir D`, `--credential ID`
- **Output:** `{ ok: true, command: 'revoke', revoked: ID }`

### `validate-scope`

Validate a scope JSON file.

- **Input:** `--scope F` (path to scope.json)
- **Output:** `{ command: 'validate-scope', ok, errors?, warnings?, scope? }`

### `probe`

Test isolation (egress probes from scope).

- **Input:** `--scope F`
- **Output:** `{ ok: true, command: 'probe', ...report }`

### `run`

Execute rehearsal or acceptance.

- **Input:**
  - `--state-dir D`
  - `--scope F`
  - `--kind rehearsal|acceptance`
  - Operator auth: `--operator-credential C --operator-key K` OR `--await-operator [--timeout-s 600]`
  - Optional: `--witness W`, `--hold`, `--stop-mode hard|cooperative`, `--containment worker|openshell`, `--handlers M`, `--readings R`, `--report-dir P`, `--sync-url U|none`
- **Output:** `{ ok: true, command: 'run', outcome, recordPath, conditions, isolation, findings }`
- **Exit:** `NEGATIVE_RESULT (2)` if outcome is `NEGATIVE_RESULT`

### `stop`

Stop an agent (hard/urgent termination).

- **Input:** `--state-dir D`, `--agent ID|'*'`, `--operator-credential C`, `--operator-key K`, `--reason R`
- **Output:** `{ ok: true, command: 'stop', commandId, target, inboxPath }`

### `verify`

Verify ledger integrity and acceptance record.

- **Input:** `--state-dir D`, `--record FILE` (optional), `--expect-key-id K` (optional)
- **Output:** `{ ok, command: 'verify', siteKeyId, keyPinned, ledger, record? }`
- **Exit:** `4` if verification fails

### `reconcile`

Reconcile outbox entries against workflow.

- **Input:** `--state-dir D`, `--scope F`, optional `--handlers M`, `--readings R`, `--report-dir P`, `--sync-url U|none`
- **Output:** `{ ok, command: 'reconcile', ...result }`

### `authority`

Derive authority record from ledger (who held decision authority, what followed).

- **Input:** `--state-dir D`, `--scope F` (optional), `--agent ID` (optional)
- **Output:** `{ ok: true, command: 'authority', ...record }`

### `status`

Report current pilot state.

- **Input:** `--state-dir D`
- **Output:** `{ ok: true, command: 'status', site, ledger, outbox, acceptanceRecords }`

### `doctor`

Read-only preflight checks (diagnostic).

- **Input:** `--state-dir D`, `--scope F` (optional)
- **Output:** `{ ok: true/false, command: 'doctor', ...result }`

### `prove`

Prove sandbox policies (OpenShell prover).

- **Input:** `--scope F`, `--openshell-prover P`, `--expect-prover-sha256 H` (optional)
- **Output:** `{ ok: true/false, command: 'prove', ...proof }`

### `seal`

Seal active evidence segment.

- **Input:** `--state-dir D`, optional `--max-bytes N`, `--max-age-days N`, `--force`
- **Output:** `{ ok: true, command: 'seal', ...result }`

### `segments`

Verify segments and check against seal digest.

- **Input:** `--state-dir D`, `--expect-seal DIGEST` (optional)
- **Output:** `{ ok: true/false, command: 'segments', ...verifyResult }`

### `prune`

List or delete expired segments.

- **Input:** `--state-dir D`, optional `--confirm TOKEN`
- **Output:** `{ ok: true, command: 'prune', ...result }`

## When to Use

- **Rehearsal run** — Before accepting a new workflow, rehearse all steps to verify handler logic and isolation.
- **Acceptance run** — Deploy a workflow in production; requires human operator + named witness (EU AI Act Article 14 audit).
- **Stop an agent** — Emergency termination (e.g., runaway cost, security incident); always pairs with `run`.
- **Verify evidence** — Audit trail verification for DWS-AEGIS-PILOT-001 compliance; `verify` checks ledger integrity.
- **Lifecycle management** — `init`, `issue-operator`, `revoke`, `doctor`, `status` for day-to-day operation.

## Latent vs Deterministic

| Step                                    | Where                         | Kind                   |
| --------------------------------------- | ----------------------------- | ---------------------- |
| CLI argument parsing / command dispatch | `scripts/aegis-pilot.ts`      | Deterministic          |
| Scope validation                        | `src/aegis/pilot/scope.ts`    | Deterministic          |
| Evidence ledger signing / verification  | `src/aegis/pilot/ledger.ts`   | Deterministic          |
| Handler module loading / invocation     | `scripts/aegis-pilot.ts`      | Latent (user-provided) |
| Run outcome judgment                    | Handler module (user-defined) | Latent                 |
| Report generation                       | Handler module                | Latent                 |

Rule: the CLI only orchestrates and verifies evidence; policy decisions live in the handler module provided at runtime.

## Standards References

- DWS-AEGIS-PILOT-001 — Store/PRODUCT_AEGIS_PILOT.md
- EU AI Act Article 12 — Logging obligations
- EU AI Act Article 14 — Human oversight
- ED25519 cryptographic signatures for ledger integrity
