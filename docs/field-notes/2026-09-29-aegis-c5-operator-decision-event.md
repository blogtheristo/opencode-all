# Aegis Pilot C5: the operator's approval as a signed decision event

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/dws-iq7-aegis-research-lwqxgw | Date: 29.09.2026 | Changes: C5 implemented and verified. | Harness: Claude Code + CLAUDE.md + DWS_SECURITY_STANDARD

Document Status:

- Created: 29.09.2026
- Status: PENDING_REVIEW

---

## What happened

The HIC decided on 28.09.2026 that the pilot's first workflow is advisory: the agent recommends and the operator decides. The HIC also decided that the operator's approval must be recorded as a decision event, not as a note. The pilot kit had no event for this. An approval would have ended up either as free text or as a `human.override` event, and the acceptance test reads a `human.override` as a stop.

What was built (readiness plan C5):

- `src/aegis/pilot/decision-authority.ts` adds:
  - a signed `DecisionCommand` (accept, reject or defer);
  - `DecisionAuthority`, which verifies the command locally the same way stop commands are verified (credential, signature, freshness, replay);
  - `recordOutcome()`;
  - `decisionJourneys()`, which computes coverage and median decision latency.
- The ledger gains two event types: `human.decide`, which is bound to the recommendation by `seq` plus `event_hash` and carries `decision_by` = role, and `outcome.record`.
- Identity:
  - `decision.record` is an operator-only capability and requires a role.
  - Roles must match a pattern, which rules out personal names.
  - `human.decide` carries no `agent_id`, so acceptance condition (iii) stays sound.
- Workflow: handlers can mark their output `recommendation: true`, and the reference step `decide-actions` now does.
- CLI: new `decide`, `outcome` and `journey` commands, plus `issue-operator --role`.
- Runbook §5.1 documents the flow.

## Verification

- `src/__tests__/aegis-pilot-decision.test.ts`: 15 cases. The mutation check fails the right tests when the hash binding or the abandonment check is removed.
- Existing pilot suite: 62/62 tests green in total. tsc (including the CLI and tests), eslint and the evidence audit are clean.
- End-to-end run with a real severed uplink (`unshare --net`):
  - The rehearsal returned PASS.
  - The recommendation showed as pending.
  - The operator's accept was recorded inside the isolated namespace.
  - A second accept was refused ("already decided").
  - The outcome was recorded, coverage went from 0 to 1, `decision_by` = `shift-supervisor`, and the ledger verified.
- Security review (security-reviewer subagent). The first verdict was **FAIL**: 0 critical, 2 high, 3 medium and 6 low findings. The crypto binding, capability and role handling, signature compatibility and condition (iii) were confirmed sound. Fixed, each with a test:
  - **High 1: site-key exposure.** The operator-side `decide` loaded the site private key. It now only signs and queues the command, like `stop`. Recording moved to the site side (a running `run`, or `drain-decisions`).
  - **High 2: silently lost decisions.** Every ledger-open failure was reported as "queued", and nothing drained `decide/` during a run. The acceptance run now drains decisions. `drain-decisions` reports "queued" only for a live run's lock (exit 2). Every other failure is an error. A test shows that a decision queued before the run is recorded during the isolated run, which still PASSes, and a mutation check shows the test catches a missing watch.
  - **Medium 3: replay.** Replay is now also checked against the ledger's `command_id`, so a deleted `processed/` file cannot reopen a replay.
  - **Medium 4: marker source.** The recommendation marker comes from the signed scope (`advisory: true`), not from the handler.
  - **Medium 5: clock steps.** Ledger timestamps are clamped monotonic, with `clock_step_back_ms` recorded, so a clock step on an isolated site no longer breaks the chain.
  - **Low findings fixed:**
    - an attacker-chosen command id is never written;
    - the ledger is parsed once and that same parse is verified (`readVerifiedLedger`);
    - seq and hash are validated before signing;
    - `evidenceRef` must be an identifier or URI;
    - dead code removed.
  - **Open:**
    - Low 9: `--role` grants both stop and decide, so there is no separate decide-only credential, and there is no site allowlist of roles.
    - `outcome.record` has no `recorded_by`.
    - The same Low 6 command-id and Medium 3 replay pattern still exists in `kill-authority.ts`, which is outside this change.
- After the fixes: 21 decision tests, 67/67 pilot tests, tsc and eslint clean. E2E repeated with the split (the operator's `decide`, then the site's `drain-decisions`, both with the uplink severed): passes.

## Correction the same day (Boardy's point)

Operator time was counted from the time the site _recorded_ the decision. A decision drained from the queue up to 10 minutes later therefore inflated the number. Now `decided_at` = the operator-signed `issuedAt`, `decision_latency_ms` is measured from the recommendation to that signature, and `recorded_lag_ms` reports the queue delay separately. `drain-decisions` records a `system.reconcile` event (`decision-drain`) with the head it started from, so a catch-up is visible in the chain and not spliced in. Tests: 24 in the decision file, 71 in the pilot suites. A mutation check confirmed the latency test fails when the old basis is restored.

## Rubber-stamp protection (HIC 29.09.2026, implemented 30.09.2026)

Boardy's point: a bare acknowledgement optimises a rubber stamp, and that does not fit a human carrying responsibility for the decision.

What was built:

- **`modify` verdict.** The command carries the sha256 of the changed recommendation.
- **Reasons.** Reject and modify require one, checked both before signing and on receipt.
- **`manual_entry`.** A decision entered afterwards, with an operator-stated `occurredAt`. It is recorded as `MANUAL_ENTRY` at 0.40 × capture-lag factor, against `HUMAN_CONFIRMED` 0.80 for a live decision (decision-journey §3.5), and gets no latency number.
- **`journey` output.** It now includes the rejection, modification and manual-entry shares, `weakestEvidence`, and a `reviewSignal` that warns `no-challenge` after 10 decisions with no reject or modify.

Verification:

- 30 decision tests and 163 across all pilot suites.
- A mutation check confirmed the reason guard, the review signal and the manual-entry latency rule each fail their test when removed.
- The CLI E2E `modify` run with the uplink severed passes.

Security review (30.09.2026): **PASS**, with 0 critical, 0 high, 3 medium and 4 low findings. Fixed, each with a test and mutation-checked:

- **M1.** A `modify` that names the unchanged recommendation is refused. The digest matches `output_digest`.
- **M2.** Strength is labelled operator-attested (`evidenceBasis`). This is not fixable in code; it is documented.
- **M3.** The review signal is judged per operator and per recommending agent, so decoys cannot mask a rubber-stamped stream.
- **L1.** `occurredAt` must be strict ISO UTC and at most 30 days old.
- **L2.** The reconcile event uses the signing time.
- **L3.** An unknown `capture` value throws.
- **L4.** Documented: the digest is JS-canonical, and the operator keeps the modified file.

Suite totals: 34 decision tests and 167 across the pilot suites.

What the kit cannot do: it cannot prove that a "live" signature was not a transcription. The runbook states the rule, and the review signal makes the pattern visible.

## Insight

The advisory workflow is the same event chain as the decision journey that was already designed: `PATH_RECOMMENDED → PATH_ACCEPTED → OUTCOME_RECORDED`. Recording the approval as an event costs one design decision in the ledger. It turns the pilot's output from "the stop works" into "the stop works, and here is the first verifiable decision path, with a customer operator as the decision-maker". Report D7 names the number that follows from this: decision-path coverage.

## Next steps

- Fold the security-review findings into the next commit.
- The HIC calibrates the readiness scores (G3/G5) now that C5 has landed. I did not change the scores.

## Skipped steps

- KB update: N/A. This is implementation evidence of an already-registered design (`docs/plans/2026-09-24-decision-journey-outcome-evidence.md`). The KB entry follows at PR merge.
- Drive export: N/A. This session has no Drive write path for repository files, and the repo is the source of truth.
- Master's thesis (implementation evidence): N/A this pass. The four-file lockstep is not opened for one component. It is queued for the next thesis pass.

## HIC decision question

Is coverage counted over all recommendations including abandoned ones, as implemented (abandoned = complete, because the stop is also evidence)? Or are abandoned paths excluded from the denominator?
