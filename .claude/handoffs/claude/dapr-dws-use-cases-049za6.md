# Handoff — claude/dapr-dws-use-cases-049za6

## VERSION AND AGENT HISTORY

---

Version: 1.1
Tool: Claude Code
Agent: Claude Fable 5.1 (standby runtime)
Date: 2026-09-23
Changes: [Latest] Merged origin/main (CHANGELOG conflict resolved), standards headers added, PR #2066 driven to merge on HIC instruction.

Version: 1.0
Tool: Claude Code
Agent: Claude Sonnet 5
Date: 2026-09-22
Changes: [not latest] Pilot implemented, default-off.

---

## State

Dapr pub/sub pilot (HIC-approved, §3 Phase 1) implemented and tested,
default-off. Field note: `docs/field-notes/2026-09-22-dapr-use-cases-dws.md`.

## Changed

- `src/agents/event-bus.ts` — feature-flagged Dapr publish for
  `agent.task_complete` only; `dispatchFromDapr()` for loop-free delivery.
- `src/routes/dapr-pubsub.routes.ts` (new) — subscribe + delivery callback.
- `src/app.ts` — mounts `/dapr`.
- `dapr/components/pubsub.yaml.tpl`, `dapr/README.md` (new).
- `.gitignore` — ignores rendered Dapr component (holds plaintext Redis password).
- Tests: `src/__tests__/event-bus-dapr-pilot.test.ts`,
  `src/__tests__/dapr-pubsub-routes.test.ts` — 8/8 passing.
- `CHANGELOG.md`, field note updated.

## Open

- `DAPR_PUBSUB_PILOT_ENABLED` is unset everywhere — capability shipped,
  live pilot not started. HIC still needs to: pick pilot Redis
  (`dapr/README.md` recommends isolating from prod rate-limiter/token-
  blacklist Redis), then say when to flip the flag for the 2-week
  observation window.
- Nothing else from the field note (service invocation, state, actors) is
  implemented — explicitly deferred pending concrete triggers.

## HIC decisions 2026-09-23

- Flag ON **before** the Diagrid call (HIC "1-3 do it"). Operator step on
  DGX per `dapr/README.md`; not reachable from Claude Code.
- PR #2066: merge on green (send_later check-in armed).
- Mark Fussell reply: drafted, HIC sends from Proton.

## Next session

If asked to "start the Dapr pilot" — that means setting
`DAPR_PUBSUB_PILOT_ENABLED=true` in a real environment and running
`dapr run` per `dapr/README.md`, not more code. If the 2-week window has
elapsed, check in on the decision gate in field note §3a.
