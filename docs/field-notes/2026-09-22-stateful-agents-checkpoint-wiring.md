# 2026-09-22 — Stateful agents: wired dead checkpoint service into the Maker loop

## What happened

"New Orleans" (branch codename) turned out to mean **stateful agents**, not the city. Audited
what "stateful" already means in this repo:

- `memory.service.ts` (semantic long-term memory, hybrid search, contradiction resolution) —
  **wired**: called from `mcp/agent-server.ts`, `tools.ts`, `memory.scheduler.ts`,
  `fact-extraction.service.ts`. Working as designed.
- `session-checkpoint.service.ts` (ASTA Phase 1, migration 055, `session_checkpoints` table,
  24h TTL) — **dead code**. `checkpoint()`/`recover()`/`clear()` existed with a passing shape
  but were called from nowhere. No agent loop actually survived interruption via Postgres
  checkpointing despite the infra being built and migrated in prod.
- `loop-engineering/loop-orchestrator.ts` (Maker/Checker cycles) already had its own,
  independent state persistence — a JSON file on disk, one write per **outer cycle**. That
  covers "the whole loop died between cycles," but not "the Maker's inner
  observe-think-act loop died mid-cycle" — a multi-iteration Maker run restarts from
  iteration 0 and re-spends its budget on a crash mid-cycle.

## The fix

Wired `checkpointService` into `LoopOrchestrator.runMaker()`:

- Before the inner loop starts, `recover(sessionId, orgId, agentName)` is checked; if a
  checkpoint matches the _current_ cycle's instruction (`userMessage === instruction`), the
  Maker resumes from `iterationIndex + 1` with the saved message history instead of
  restarting the cycle from iteration 0.
- After every iteration, `checkpoint()` fires (non-blocking, fire-and-forget — matches the
  service's existing contract).
- On cycle exit (pass, fail-to-checker, or budget/step exhaustion), `clear()` removes the
  mid-cycle checkpoint, since the outer `LoopStateFile` now owns that cycle's record.

Net effect: an inner Maker loop interrupted after iteration 3 of a 6-iteration budget resumes
at iteration 4 instead of iteration 0, on process restart, same session/org/agent.

## Verification

- `tsc --noEmit` clean on the touched file.
- No existing test file for `loop-orchestrator.ts` (`src/__tests__/*loop-orchestrator*` — none
  found) — this change ships without new unit coverage. **Gap, not silently skipped**: a
  proper test needs a fake `createLLMClientForAgent` + fake `getInternalDbPool`, which is a
  half-day task, not a checkpoint-wiring fix. Flagging per Rule 12 (fail loud) rather than
  claiming verified behavior I didn't test.

## Next steps

1. Add `src/__tests__/loop-orchestrator-checkpoint.test.ts` — mock the LLM client to force a
   mid-cycle "crash" (throw after iteration N) and assert a second `run()` call resumes at
   N+1, not 0.
2. Consider whether `memory.service.ts`'s episode/procedure types should also feed the Maker's
   system-prompt context (cross-session learning) — currently the two stateful systems don't
   talk to each other.
