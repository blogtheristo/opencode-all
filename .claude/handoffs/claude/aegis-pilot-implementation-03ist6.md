# Handoff — claude/aegis-pilot-implementation-03ist6

**Task:** Implement DWS-AEGIS-PILOT-001 (Store/PRODUCT_AEGIS_PILOT.md) for real: the Chapter 4 G0–G6 substrate plus automated severed-uplink evidence.

**State (28.09.2026):**

- Built `src/aegis/pilot/` (scope, identity, evidence-ledger, kill-authority, uplink-probe, workflow-runner, acceptance, reference-workflow), CLI `scripts/aegis-pilot.ts` (`npm run aegis:pilot`) and `scripts/aegis-pilot-isolated-rehearsal.sh` (`npm run aegis:pilot:rehearse-isolated`, a real `unshare --net` isolation).
- 40 vitest cases in `src/__tests__/aegis-pilot.test.ts`. Isolated rehearsal returns PASS; un-isolated returns NOT_TAKEN.
- Security review (Chapter 4 mandatory): first verdict FAIL (1 critical: unsigned outbox; 2 high: site-key custody, no signature check on ledger open). All fixed with regression tests before push.
- Runbook `docs/runbooks/AEGIS_PILOT_RUNBOOK.md`; field note `docs/field-notes/2026-09-28-aegis-pilot-local-first-kit.md` (PENDING_REVIEW); done spec `.claude/done/claude/aegis-pilot-implementation-03ist6.json`.

**Next:**

1. HIC: decide on the readiness score move (field note §7) and the Article 12 §3 event-type extension (§4).
2. First customer: Phase 0 scope from `config/aegis-pilot/reference-scope.json`, then write customer handlers following `reference-workflow.ts`.
3. Optional hardening: worker-isolated hard stop (runbook §8).

**Blockers:** none.
