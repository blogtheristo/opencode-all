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
- Security review: started. Its findings go into the next commit and are recorded in this note.

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
