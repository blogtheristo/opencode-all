# Aegis Pilot: the local-first kit and the severed-uplink test

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/aegis-pilot-implementation-03ist6 | Date: 28.09.2026 | Changes: Build notes for the DWS-AEGIS-PILOT-001 implementation: what was missing, what was built, how it was verified, open decisions. | Harness: Claude Code + CLAUDE.md + DWS_ARTICLE_12_LOGGING_STANDARD + DWS_SECURITY_STANDARD + DWS_TRUTH_STANDARD | HIC-approved-drift: none

Session Links & References:

- Offer: `Store/PRODUCT_AEGIS_PILOT.md`
- Runbook: `docs/runbooks/AEGIS_PILOT_RUNBOOK.md`
- Plan: `docs/plans/PILOT_PRODUCT_READINESS_PRIORITY.md` (P0 active, next gate G0–G6 Chapter 4)

Document Status:

- Created: 28.09.2026
- Status: PENDING_REVIEW

---

## 1. The gap

The pilot promises a binary KPI. With the uplink severed: (i) the workflow completes, (ii) the Article 12 record is still written locally, (iii) an operator can still stop a running agent. The readiness plan gave the pilot 56 % and cited `src/agents/aegis.agent.ts` as its evidence. Measured against that KPI, the existing code failed all three conditions:

| Condition | Existing code                                                                                                                | Why it cannot pass                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| (ii)      | `Article12Logger` writes to Postgres and throws without `INTERNAL_DB_URL`. `AegisDurableStore` falls back to process memory. | Nothing is written durably and locally once the DB is unreachable. |
| (iii)     | TC-4 `terminateChain` (`src/identity/kya-engine.ts`) marks agents terminated in Supabase.                                    | The kill path needs the network the test removes.                  |
| (i)       | No runner that knows which steps are core and which can be deferred.                                                         | Nothing can be demonstrated against the pilot's own definition.    |
| Test      | Nothing automates the test itself.                                                                                           | Chapter 4 asks for the severed-uplink evidence to be automated.    |

## 2. What was built

The kit lives in `src/aegis/pilot/` (≈2,600 lines after formatting) and uses only `node:crypto`, `node:fs`, `node:net` and `zod`. No module in the verification path can open a socket.

- **Scope (`scope.ts`).** A Zod schema for the Phase 0 signed scope. Validation rejects a core step that needs the network, which is the Phase 2 fail condition moved to week 2. It also rejects a workflow with no core step or no completion state, and a reconciliation order that does not cover every deferrable step. The isolation ladder is encoded with what each rung demonstrates and what it does not.
- **Identity (`identity.ts`).** An Ed25519 site authority issues agent and operator credentials. Verification needs only `site.json`, and revocation is a local list. Agents cannot hold `agent.stop`.
- **Evidence (`evidence-ledger.ts`).** A JSONL ledger that follows Article 12 Logging Standard §3: `event_hash = sha256(prev_hash + canonical_event_json)`, and each hash is signed by the site key. Every event is fsynced. The ledger refuses to append to a broken chain. It refuses a torn tail unless asked to repair it, in which case it records an `incident`. It allows one writer at a time. Gap detection works against a time window.
- **Kill authority (`kill-authority.ts`).** The operator signs a stop command with their own key. The runtime reads it from a local inbox and checks the credential, the signature, freshness (10 minutes) and replay. The stop is recorded as `human.override` with the operator id (Art. 14(5)); a rejected command is recorded as `incident`.
- **Runner (`workflow-runner.ts`).** Each step is authorised by capability, raced against the kill signal and recorded with input and output digests. Non-core network steps are deferred to an outbox and replayed in `reconciliationOrder`.
- **Acceptance (`acceptance.ts`).** Probes egress before, during and after the window. The verdict is PASS, NEGATIVE_RESULT, NOT_TAKEN (egress succeeded, so no test was taken) or INVALID (isolation lapsed). Condition (iii) is judged from the ledger: the stopped agent must have written nothing after the override. The ledger must sit on a local filesystem (checked with statfs). An `acceptance` run requires a human operator and a named witness. The record is signed and its digest is chained into the ledger.
- **CLI (`scripts/aegis-pilot.ts`, `npm run aegis:pilot`).** Commands: init, issue-operator, revoke, validate-scope, probe, run, stop, verify, reconcile, status. Output is JSON with exit codes by verdict.
- **Real isolation (`npm run aegis:pilot:rehearse-isolated`).** Runs the rehearsal inside `unshare --net` (no interfaces, routes or DNS), then reconciles and verifies.

## 3. Verification

- `src/__tests__/aegis-pilot.test.ts`: 40 cases, three consecutive green runs. They cover tamper, deletion and forgery detection; torn-tail refusal and repair; forged, stale, replayed and revoked stop commands; a forged command trying to burn a genuine id; proxy detection without recording credentials; the Phase 2 finding; reconcile order; and all four verdicts, including an out-of-process operator stop through the kill inbox.
- Real severed uplink, run in this session's container:
  - **First run: NEGATIVE_RESULT.** Condition (ii) failed with a 9.9 s evidence gap. Cause: the heartbeat was stopped before the periodic-probe loop drained, so the tail of the window had no events. The gap check caught a defect in the harness itself. That is the behaviour the pilot sells.
  - **After fixing the shutdown order: PASS.** Conditions (i), (ii) and (iii) all true. The sync step was deferred and reconciled once the uplink returned. Ledger and record signature verified.
  - **Same run with the uplink up: NOT_TAKEN.** All four targets answered, including the environment's proxy.
- `tsc --noEmit` and `eslint` are clean. The evidence audit passes on 13 files.
- **Security review** (Chapter 4 makes this mandatory; run by a security-reviewer subagent). The first verdict was FAIL, with one critical and two high findings. All three are fixed, each with a regression test (suite now at 40 cases):
  - **Critical:** outbox entries were unauthenticated. Anyone who could write to the state directory could make `reconcile` run a handler on chosen input; with the reference sync handler, that meant reading an arbitrary file and sending it to the sync endpoint. Entries are now site-signed and schema-checked, and failures are quarantined and recorded as incidents. The reference handler now sends only files inside its report directory whose digest is unchanged.
  - **High:** the site key lives in the state directory. The fix pins `site.keyId` in the signed scope (and offers `verify --expect-key-id`), and the runbook now specifies directory ownership.
  - **High:** opening the ledger checked the chain but not signatures. With the site key known, it now refuses bad or missing signatures on open.
  - Advisories: the credential-id check now runs before any path is built. The whole-ledger scope of condition (ii) is documented as intended (runbook §8).

## 4. Proposed standard extension (Article 12 Logging Standard §3)

The §3 `event_type` enum has no values for the operational facts the pilot must prove. The ledger adds `system.genesis | system.heartbeat | system.uplink_probe | system.degraded | system.reconcile | workflow.start | workflow.complete | workflow.failed | acceptance.record`. Draft wording for §3: _"Deployments proving network-independent operation MAY emit `system.*`, `workflow.*` and `acceptance.record` events; they carry the same identity and tamper-evidence fields."_ **Status: PENDING_REVIEW.** The standard has not been edited.

## 5. What this does not close

- Cooperative stop inside a step (runbook §8). A hard stop would need worker isolation.
- Local model serving and hardware sizing (Phase 1 and Phase 4 site work).
- The readiness score (56 %) and `config/truth/product-readiness-backlog.json` are generated or HIC-scored, so they were not edited here.

## 6. Learning outcome steps

1. KB: N/A. No new external source was ingested; the knowledge is in this note and the runbook.
2. Field note: this file.
3. `Learn/` HTML render: N/A in this session (`scripts/render-doc.sh` not run). It can be rendered once the HIC approves.
4. Drive export: N/A (no Drive write in this session).
5. HIC decision question: see §7.
6. Calendar: N/A. No dated commitment was made.

## 7. HIC decision

Should the Aegis pilot readiness score move from 56 % once this merges? The kit covers G3 (working delivery), G4 (CLI/JSON) and G6 (tests, plus a real isolated run) for the Chapter 4 substrate. G7 (operations) and G10 (customer acceptance evidence) remain open by definition.
